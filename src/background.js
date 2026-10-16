"use strict";

// Correct Mail Translate – Heinz Bundschuh
// Übergibt markierten Text oder die ganze Nachricht an die Google-Übersetzer-
// Webseite. Hart umbrochene Zeilen werden vorher zu ganzen Sätzen zusammengefügt.

const tb = typeof messenger !== "undefined" ? messenger : browser;

const DEFAULTS = Object.freeze({ targetLanguage: "auto", unwrap: true });
const GOOGLE_URL = "https://translate.google.com/";
const GOOGLE_MAX_CHARS = 5000;   // Grenze der Google-Webseite pro Übersetzung
const MAX_URL_LENGTH = 8000;     // darüber lieber über die Zwischenablage

const MENU_SELECTION = "cmt_selection";
const MENU_MESSAGE = "cmt_message";
const MENU_LIST = "cmt_list";

function msg(key, substitution) {
  try {
    const value = substitution === undefined ? tb.i18n.getMessage(key) : tb.i18n.getMessage(key, String(substitution));
    if (value) {
      return value;
    }
  } catch (error) {}
  return key;
}

// ---------------------------------------------------------------------------
// Kontextmenü
// ---------------------------------------------------------------------------
function buildMenus() {
  tb.menus.removeAll().then(() => {
    // Bei markiertem Text: wie Thunderbirds "Google-Suche nach …"
    tb.menus.create({ id: MENU_SELECTION, title: msg("menuSelection"), contexts: ["selection"] });
    // Ohne Markierung in der geöffneten Nachricht
    tb.menus.create({ id: MENU_MESSAGE, title: msg("menuMessage"), contexts: ["page", "frame"] });
    // In der Nachrichtenliste
    tb.menus.create({ id: MENU_LIST, title: msg("menuListMessage"), contexts: ["message_list"] });
  });
}

buildMenus();

tb.menus.onClicked.addListener(async (info, tab) => {
  try {
    let text = "";
    if (info.menuItemId === MENU_SELECTION) {
      text = await getSelectionText(tab, info);
    } else if (info.menuItemId === MENU_MESSAGE) {
      text = await getDisplayedMessageText(tab);
    } else if (info.menuItemId === MENU_LIST) {
      const messages = info.selectedMessages && info.selectedMessages.messages;
      if (messages && messages.length > 0) {
        text = await getMessageTextById(messages[0].id);
      }
    } else {
      return;
    }
    await translateOnGoogle(text);
  } catch (error) {
    console.error("Correct Mail Translate:", error);
    notify(msg("notifyError", (error && error.message) || String(error)));
  }
});

// ---------------------------------------------------------------------------
// Text holen
// ---------------------------------------------------------------------------

// Markierung direkt aus der Nachricht lesen (behält Zeilenumbrüche; das
// selectionText des Menüs ist auf 16.384 Zeichen gekürzt und ohne Absätze).
async function getSelectionText(tab, info) {
  if (tab && typeof tab.id === "number") {
    try {
      const results = await tb.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        func: () => String(window.getSelection ? window.getSelection() : "")
      });
      const best = (results || [])
        .map(entry => (entry && typeof entry.result === "string" ? entry.result : ""))
        .sort((a, b) => b.length - a.length)[0];
      if (best && best.trim()) {
        return best;
      }
    } catch (error) {
      console.warn("Correct Mail Translate: selection via script failed, using menu text", error);
    }
  }
  return (info && info.selectionText) || "";
}

// Ganze angezeigte Nachricht: zuerst der sichtbare Text, sonst aus der Mail.
async function getDisplayedMessageText(tab) {
  if (tab && typeof tab.id === "number") {
    try {
      const results = await tb.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        func: () => (document.body ? document.body.innerText || "" : "")
      });
      const best = (results || [])
        .map(entry => (entry && typeof entry.result === "string" ? entry.result : ""))
        .sort((a, b) => b.length - a.length)[0];
      if (best && best.trim()) {
        return stripTranslateBanners(best);
      }
    } catch (error) {
      console.warn("Correct Mail Translate: page text via script failed, using message parts", error);
    }

    try {
      const displayed = await tb.messageDisplay.getDisplayedMessages(tab.id);
      const list = Array.isArray(displayed) ? displayed : (displayed && displayed.messages) || [];
      if (list.length > 0) {
        return await getMessageTextById(list[0].id);
      }
    } catch (error) {
      console.warn("Correct Mail Translate: getDisplayedMessages failed", error);
    }
  }
  return "";
}

// Hinweisbalken anderer Übersetzungs-Add-ons nicht mitübersetzen.
function stripTranslateBanners(text) {
  return String(text).replace(/^(Übersetzt nach|Translated to|Originalnachricht wiederhergestellt|Original message restored)[^\n]*\n+/i, "");
}

async function getMessageTextById(messageId) {
  const full = await tb.messages.getFull(messageId);
  const plain = [];
  const html = [];
  collectParts(full, plain, html);
  if (plain.length > 0) {
    return plain.join("\n\n");
  }
  if (html.length > 0) {
    return html.map(htmlToText).join("\n\n");
  }
  return "";
}

function collectParts(part, plain, html) {
  if (!part) {
    return;
  }
  const type = String(part.contentType || "").toLowerCase();
  const isAttachment = /attachment/i.test(String(part.headers && part.headers["content-disposition"] || ""));
  if (!isAttachment && typeof part.body === "string") {
    if (type === "text/plain") {
      plain.push(part.body);
    } else if (type === "text/html") {
      html.push(part.body);
    }
  }
  for (const child of part.parts || []) {
    collectParts(child, plain, html);
  }
}

function htmlToText(source) {
  const doc = new DOMParser().parseFromString(String(source), "text/html");
  for (const element of doc.querySelectorAll("script, style, head")) {
    element.remove();
  }
  for (const br of doc.querySelectorAll("br")) {
    br.replaceWith("\n");
  }
  for (const block of doc.querySelectorAll("p, div, li, tr, h1, h2, h3, h4, h5, h6, blockquote")) {
    block.append("\n");
  }
  return (doc.body ? doc.body.textContent : "").replace(/\n{3,}/g, "\n\n");
}

// ---------------------------------------------------------------------------
// Text aufbereiten: hart umbrochene Zeilen zu Sätzen zusammenfügen
// ---------------------------------------------------------------------------
const LIST_START = /^\s*([-*•–+]|\d{1,3}[.)]|[a-z][.)])\s/i;
const SIG_DELIMITER = /^\s*--\s*$/;

function quotePrefix(line) {
  const match = line.match(/^(\s*>[>\s]*)/);
  return match ? match[1].replace(/\s+$/, "") : "";
}

function unwrapText(text) {
  const lines = String(text).replace(/\r\n?/g, "\n").replace(/ /g, " ").split("\n");
  const lengths = lines
    .map(line => line.trim().length)
    .filter(length => length > 0)
    .sort((a, b) => a - b);
  let wrapWidth = 0;
  if (lengths.length >= 2) {
    const p90 = lengths[Math.floor(0.9 * (lengths.length - 1))];
    wrapWidth = p90 >= 40 && p90 <= 120 ? p90 : 0;
  }

  const out = [];
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index].replace(/\s+$/, "");
    const previous = out.length > 0 ? out[out.length - 1] : null;
    const previousRaw = index > 0 ? lines[index - 1].replace(/\s+$/, "") : "";
    const joinable =
      wrapWidth > 0 &&
      previous !== null &&
      previousRaw.trim() !== "" &&
      line.trim() !== "" &&
      previousRaw.trim().length >= Math.floor(wrapWidth * 0.6) &&
      quotePrefix(previousRaw) === quotePrefix(line) &&
      !LIST_START.test(line.slice(quotePrefix(line).length)) &&
      !SIG_DELIMITER.test(previousRaw) &&
      !SIG_DELIMITER.test(line);
    if (joinable) {
      const content = line.slice(quotePrefix(line).length).trim();
      out[out.length - 1] = previous + " " + content;
    } else {
      out.push(line);
    }
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

// ---------------------------------------------------------------------------
// Google-Übersetzer öffnen
// ---------------------------------------------------------------------------
async function getSettings() {
  try {
    const stored = await tb.storage.local.get("settings");
    return Object.assign({}, DEFAULTS, stored.settings || {});
  } catch (error) {
    return Object.assign({}, DEFAULTS);
  }
}

function resolveTargetLanguage(setting) {
  if (setting && setting !== "auto") {
    return setting;
  }
  let ui = "de";
  try {
    ui = tb.i18n.getUILanguage() || "de";
  } catch (error) {}
  ui = ui.replace("_", "-");
  // Google erwartet z. B. "zh-CN", sonst nur den Sprachteil ("de-AT" -> "de").
  if (/^zh-(cn|sg|hans)/i.test(ui)) {
    return "zh-CN";
  }
  if (/^zh/i.test(ui)) {
    return "zh-TW";
  }
  return ui.split("-")[0].toLowerCase();
}

function buildGoogleUrl(text, targetLanguage) {
  const url = new URL(GOOGLE_URL);
  url.searchParams.set("sl", "auto");
  url.searchParams.set("tl", targetLanguage);
  if (text) {
    url.searchParams.set("text", text);
  }
  url.searchParams.set("op", "translate");
  return url.toString();
}

async function translateOnGoogle(rawText) {
  const settings = await getSettings();
  let text = String(rawText || "").replace(/\r\n?/g, "\n");
  if (settings.unwrap) {
    text = unwrapText(text);
  } else {
    text = text.trim();
  }
  if (!text) {
    notify(msg("notifyNoText"));
    return;
  }

  const targetLanguage = resolveTargetLanguage(settings.targetLanguage);
  const directUrl = buildGoogleUrl(text, targetLanguage);

  if (text.length <= GOOGLE_MAX_CHARS && directUrl.length <= MAX_URL_LENGTH) {
    await openUrl(directUrl);
    return;
  }

  // Zu lang für die Adresse: über die Zwischenablage.
  await navigator.clipboard.writeText(text);
  await openUrl(buildGoogleUrl("", targetLanguage));
  notify(text.length > GOOGLE_MAX_CHARS ? msg("notifyTooLong", text.length) : msg("notifyClipboard", text.length));
}

async function openUrl(url) {
  try {
    await tb.windows.openDefaultBrowser(url);
  } catch (error) {
    await tb.tabs.create({ url });
  }
}

function notify(message) {
  try {
    tb.notifications.create({
      type: "basic",
      iconUrl: tb.runtime.getURL("icon.svg"),
      title: msg("notifyTitle"),
      message
    });
  } catch (error) {
    console.warn("Correct Mail Translate:", message);
  }
}
