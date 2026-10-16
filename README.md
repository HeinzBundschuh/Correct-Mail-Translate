# Correct Mail Translate

Thunderbird-Add-on: Markierten Text oder die ganze Nachricht über das Kontextmenü auf der Google-Übersetzer-Webseite übersetzen – in ganzen Sätzen.

*English version below.*

---

## Deutsch

### Warum?

Viele Übersetzungs-Add-ons schicken Mails zeilen- oder stückweise an einen Übersetzungsdienst. Bei Nur-Text-Mails, die nach etwa 72 Zeichen hart umbrochen sind, reißen dadurch Sätze auseinander, und die Übersetzung wird holprig oder falsch.

**Correct Mail Translate** fügt hart umbrochene Zeilen vorher wieder zu ganzen Sätzen zusammen und übergibt den Text an die Webseite von Google Übersetzer. Listen, Grußzeilen, Zitate und Signatur bleiben dabei erhalten.

### Funktionen

| Rechtsklick auf … | Menüeintrag |
|---|---|
| markierten Text | **Mit Google übersetzen: „…“** |
| die geöffnete Nachricht (ohne Markierung) | **Ganze Nachricht mit Google übersetzen** |
| eine Nachricht in der Nachrichtenliste | **Nachricht mit Google übersetzen** |

- Ausgangssprache wird von Google automatisch erkannt.
- Zielsprache: wie Thunderbird oder frei wählbar.
- Texte über 5.000 Zeichen (Grenze der Google-Webseite) kommen in die Zwischenablage; die Google-Seite öffnet sich leer zum Einfügen mit Strg+V.
- Anhänge werden nicht mitübersetzt.
- Oberfläche auf Deutsch und Englisch (automatisch nach Thunderbird-Sprache).

### Installation

- Über [addons.thunderbird.net](https://addons.thunderbird.net) (sobald veröffentlicht), oder
- `.xpi` aus den [Releases](https://github.com/HeinzBundschuh/correct-mail-translate/releases) herunterladen → Thunderbird → **Add-ons und Themes** → Zahnrad → **Add-on aus Datei installieren …**

Voraussetzung: Thunderbird 128 oder neuer.

### Einstellungen

Add-ons-Manager → Correct Mail Translate → **Einstellungen**:

- **Zielsprache** – Standard: wie Thunderbird
- **Hart umbrochene Zeilen zu ganzen Sätzen zusammenfügen** – Standard: an

### Datenschutz

Das Add-on speichert und sendet selbst keine Daten. Erst beim Klick auf einen Menüeintrag wird der Text als Teil der Adresse an `translate.google.com` übergeben und im Standardbrowser geöffnet. Dort gelten die Datenschutzbestimmungen von Google. Bei langen Texten wird der Text nur in die lokale Zwischenablage kopiert.

### Selbst bauen

```
Windows:      powershell -ExecutionPolicy Bypass -File build.ps1
Linux/macOS:  ./build.sh
```

Ergebnis: `dist/correct_mail_translate-<version>.xpi`

### Lizenz

[MIT](LICENSE) © 2026 Heinz Bundschuh

„Google“ ist eine Marke der Google LLC. Dieses Add-on steht in keiner Verbindung zu Google.

---

## English

### Why?

Many translation add-ons send emails to a translation service line by line or in fragments. In plain-text emails that are hard-wrapped at about 72 characters, sentences get torn apart and the translation becomes clumsy or wrong.

**Correct Mail Translate** first joins hard-wrapped lines back into whole sentences and passes the text to the Google Translate website. Lists, greetings, quotes and signatures are kept intact.

### Features

| Right-click on … | Menu entry |
|---|---|
| selected text | **Translate with Google: “…”** |
| the open message (no selection) | **Translate whole message with Google** |
| a message in the message list | **Translate message with Google** |

- Source language is detected automatically by Google.
- Target language: same as Thunderbird, or any language you choose.
- Texts longer than 5,000 characters (the Google website limit) are copied to the clipboard; the Google page opens empty so you can paste with Ctrl+V.
- Attachments are not translated.
- User interface in German and English (follows the Thunderbird language).

### Installation

- From [addons.thunderbird.net](https://addons.thunderbird.net) (once published), or
- download the `.xpi` from [Releases](https://github.com/HeinzBundschuh/correct-mail-translate/releases) → Thunderbird → **Add-ons and Themes** → gear icon → **Install Add-on From File …**

Requires Thunderbird 128 or later.

### Settings

Add-ons Manager → Correct Mail Translate → **Options**:

- **Target language** – default: same as Thunderbird
- **Join hard-wrapped lines into whole sentences** – default: on

### Privacy

The add-on itself does not store or send any data. Only when you click a menu entry is the text passed as part of the address to `translate.google.com` and opened in your default browser, where Google's privacy policy applies. For long texts, the text is only copied to the local clipboard.

### Building

```
Windows:      powershell -ExecutionPolicy Bypass -File build.ps1
Linux/macOS:  ./build.sh
```

Output: `dist/correct_mail_translate-<version>.xpi`

### License

[MIT](LICENSE) © 2026 Heinz Bundschuh

"Google" is a trademark of Google LLC. This add-on is not affiliated with Google.
