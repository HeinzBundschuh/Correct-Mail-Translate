# Einreichung bei addons.thunderbird.net (ATN)

Schritt für Schritt, mit allen Texten zum Hineinkopieren.

## 1. Hochladen

1. https://addons.thunderbird.net → anmelden → **Tools → Submit a New Add-on**
2. Verbreitung: **On this site** (auf ATN veröffentlichen)
3. Datei hochladen: `dist/correct_mail_translate-1.0.0.xpi`
4. Plattform: alle
5. Frage nach Quellcode: **Nein** – der Code ist weder minimiert noch gebündelt, die .xpi enthält den lesbaren Quelltext.

## 2. Angaben zum Eintrag

**Name:** Correct Mail Translate
**Kategorie:** Message Reading (bzw. „Nachrichten lesen“); zusätzlich ggf. Language Support
**Tags:** translate, translation, google translate, übersetzen, plain text
**Lizenz:** MIT
**Homepage / Support-Seite:** https://github.com/HeinzBundschuh/correct-mail-translate
**Support-E-Mail:** nach Wunsch

ATN erlaubt Texte in mehreren Sprachen: Zuerst Englisch eintragen, dann über die Sprachauswahl am Formular **Deutsch** ergänzen.

### Zusammenfassung (Summary, max. 250 Zeichen)

**English:**
> Translate selected text or the whole message on the Google Translate website via the context menu. Hard-wrapped lines are joined into whole sentences first, so Google translates complete sentences instead of fragments.

**Deutsch:**
> Übersetzt markierten Text oder die ganze Nachricht über das Kontextmenü auf der Google-Übersetzer-Webseite. Hart umbrochene Zeilen werden vorher zu ganzen Sätzen zusammengefügt – Google übersetzt Sätze statt Bruchstücke.

### Beschreibung (Description)

**English:**
> Many translation add-ons send emails line by line or in fragments. In plain-text emails that are hard-wrapped at about 72 characters, sentences get torn apart and the translation suffers.
>
> Correct Mail Translate joins hard-wrapped lines back into whole sentences and passes the text to the Google Translate website in your default browser. Lists, greetings, quotes and signatures stay intact.
>
> Right-click on …
> • selected text → "Translate with Google: …"
> • the open message without a selection → "Translate whole message with Google"
> • a message in the message list → "Translate message with Google"
>
> • Source language is detected automatically
> • Target language: same as Thunderbird or freely selectable
> • Texts longer than 5,000 characters are copied to the clipboard and the Google page opens ready to paste
> • German and English user interface
>
> Privacy: the add-on itself stores and sends no data. The text is only passed to translate.google.com when you click a menu entry.
>
> "Google" is a trademark of Google LLC. This add-on is not affiliated with Google.

**Deutsch:**
> Viele Übersetzungs-Add-ons schicken Mails zeilen- oder stückweise an den Übersetzungsdienst. Bei Nur-Text-Mails, die nach etwa 72 Zeichen hart umbrochen sind, reißen dadurch Sätze auseinander, und die Übersetzung leidet.
>
> Correct Mail Translate fügt hart umbrochene Zeilen wieder zu ganzen Sätzen zusammen und übergibt den Text an die Google-Übersetzer-Webseite im Standardbrowser. Listen, Grußzeilen, Zitate und Signatur bleiben erhalten.
>
> Rechtsklick auf …
> • markierten Text → „Mit Google übersetzen: …“
> • die geöffnete Nachricht ohne Markierung → „Ganze Nachricht mit Google übersetzen“
> • eine Nachricht in der Nachrichtenliste → „Nachricht mit Google übersetzen“
>
> • Die Ausgangssprache wird automatisch erkannt
> • Zielsprache: wie Thunderbird oder frei wählbar
> • Texte über 5.000 Zeichen kommen in die Zwischenablage, die Google-Seite öffnet sich zum Einfügen
> • Oberfläche auf Deutsch und Englisch
>
> Datenschutz: Das Add-on selbst speichert und sendet keine Daten. Der Text wird erst beim Klick auf einen Menüeintrag an translate.google.com übergeben.
>
> „Google“ ist eine Marke der Google LLC. Dieses Add-on steht in keiner Verbindung zu Google.

## 3. Datenschutzerklärung (Privacy Policy)

ATN verlangt sie, weil Text an einen fremden Dienst übergeben wird.

**English:**
> Correct Mail Translate does not collect, store or transmit any personal data by itself.
> When you choose a menu entry, the selected text (or the text of the chosen message) is placed into a link to https://translate.google.com/ and opened in your default web browser. The text is thereby sent to Google; Google's privacy policy applies (https://policies.google.com/privacy).
> If the text is too long for a link, it is only copied to your local clipboard, and the Google Translate page is opened without text.
> The only data stored by the add-on are your settings (target language, line joining), kept locally in Thunderbird.

**Deutsch:**
> Correct Mail Translate erhebt, speichert und überträgt selbst keine personenbezogenen Daten.
> Wenn Sie einen Menüeintrag wählen, wird der markierte Text (bzw. der Text der gewählten Nachricht) in einen Link zu https://translate.google.com/ eingefügt und im Standardbrowser geöffnet. Der Text wird dadurch an Google übermittelt; es gelten die Datenschutzbestimmungen von Google (https://policies.google.com/privacy).
> Ist der Text für einen Link zu lang, wird er nur in die lokale Zwischenablage kopiert und die Google-Übersetzer-Seite ohne Text geöffnet.
> Gespeichert werden ausschließlich Ihre Einstellungen (Zielsprache, Zeilen zusammenfügen), lokal in Thunderbird.

## 4. Hinweise für die Prüfer (Notes to Reviewer)

> No remote code, no minification, no bundling, no experiment APIs.
> Permissions:
> • menus – context menu entries
> • messagesRead – read the text of the selected/displayed message (only on user click)
> • scripting – read the current selection / visible text of the displayed message (only on user click)
> • storage – local settings
> • clipboardWrite – copy long texts that do not fit into a URL
> • notifications – inform the user when the clipboard was used
> The add-on makes no network requests itself; it only opens https://translate.google.com/ in the default browser via windows.openDefaultBrowser().
> Test: open any message, select some text, right-click → "Translate with Google: …".

## 5. Screenshots (selbst erstellen)

Empfohlen 2–3 Bilder, z. B. 1280 × 800:

1. Rechtsklick auf markierten Text mit sichtbarem Eintrag „Mit Google übersetzen: …“
2. Rechtsklick in der Nachrichtenliste mit „Nachricht mit Google übersetzen“
3. Die Einstellungsseite

Persönliche Daten (fremde Adressen, Namen) vorher unkenntlich machen oder eine Testmail an dich selbst verwenden.

## 6. GitHub-Release

1. Repository `correct-mail-translate` unter HeinzBundschuh anlegen, Inhalt dieses Ordners hochladen.
2. **Releases → Draft a new release** → Tag `v1.0.0` → Titel „Correct Mail Translate 1.0.0“ → die .xpi aus `dist/` anhängen → Text aus `CHANGELOG.md` übernehmen.
