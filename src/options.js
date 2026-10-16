"use strict";

const tb = typeof messenger !== "undefined" ? messenger : browser;
const $ = id => document.getElementById(id);
const DEFAULTS = { targetLanguage: "auto", unwrap: true };
const LANGUAGES = ["de", "en", "hu", "fr", "es", "it", "pt", "nl", "pl", "cs", "sk", "sl", "hr", "sr",
  "ro", "bg", "el", "ru", "uk", "tr", "sv", "da", "no", "fi", "ar", "he", "ja", "ko", "zh-CN", "zh-TW"];

function t(key, sub) {
  try {
    return (sub === undefined ? tb.i18n.getMessage(key) : tb.i18n.getMessage(key, String(sub))) || key;
  } catch (error) {
    return key;
  }
}

function languageName(code, locale) {
  try {
    return new Intl.DisplayNames([locale], { type: "language" }).of(code) || code;
  } catch (error) {
    return code;
  }
}

function render() {
  for (const element of document.querySelectorAll("[data-i18n]")) {
    element.textContent = t(element.getAttribute("data-i18n"));
  }
  const ui = (tb.i18n.getUILanguage() || "de").replace("_", "-");
  const select = $("targetLanguage");
  const auto = document.createElement("option");
  auto.value = "auto";
  auto.textContent = t("optTargetAuto", languageName(ui.split("-")[0], ui));
  select.appendChild(auto);
  for (const code of LANGUAGES) {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = `${languageName(code, ui)} (${code})`;
    select.appendChild(option);
  }
}

async function load() {
  const stored = await tb.storage.local.get("settings");
  const settings = Object.assign({}, DEFAULTS, stored.settings || {});
  $("targetLanguage").value = settings.targetLanguage;
  if (!$("targetLanguage").value) {
    $("targetLanguage").value = "auto";
  }
  $("unwrap").checked = settings.unwrap !== false;
}

async function save() {
  await tb.storage.local.set({
    settings: { targetLanguage: $("targetLanguage").value || "auto", unwrap: $("unwrap").checked }
  });
  $("status").textContent = t("optSaved");
  setTimeout(() => { $("status").textContent = ""; }, 2500);
}

render();
load();
$("save").addEventListener("click", save);
