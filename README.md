# Fake Email Filler

A Chrome extension (Manifest V3) that adds a **right-click context menu item** to any editable input field, instantly filling it with a configurable fake/test email address.

Built for developers and QA testers who repeatedly fill email fields during testing.

---

## Features

- Right-click any text input → **Insert fake email address** or **Insert fake phone number**
- Configurable email format and phone number via the extension's options page
- `{unique-id}` placeholder is replaced with a `YYYYMMDDHHmmss` timestamp, so every generated address is unique
- Works with React, Vue, and Angular (uses the native input setter + dispatches `input`/`change` events)
- No build step or dependencies — plain vanilla JS

## Installation

Since this extension is not published to the Chrome Web Store, install it in developer mode:

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked** and select the **`src`** folder inside the project

## Usage

1. Focus any text input on a page
2. Right-click the input
3. Select **Insert fake email address** or **Insert fake phone number** from the context menu

The field will be filled with your configured value.

## Configuration

Open the extension's options page to customise the email format:

1. Go to `chrome://extensions`
2. Find **Fake Email Filler** and click **Details**
3. Click **Extension options**

### Email format

| Format string | Example output |
|---|---|
| `test@test.com` | `test@test.com` |
| `user+{unique-id}@example.com` | `user+20260529143022@example.com` |
| `qa-{unique-id}@mycompany.com` | `qa-20260529143022@mycompany.com` |

The `{unique-id}` placeholder is replaced with the current timestamp (`YYYYMMDDHHmmss`) at the moment the menu item is clicked. If your format contains no placeholder, the string is used verbatim every time.

The default format is `test@test.com`.

### Phone number

Enter any phone number string (digits, spaces, or symbols — whatever your target field accepts). The value is used verbatim.

The default is `07111222333`.

## Project Structure

```
├── src/
│   ├── manifest.json   # MV3 manifest — permissions, service worker, content script
│   ├── background.js   # Service worker — context menu, email generation, messaging
│   ├── content.js      # Content script — focus tracking, input filling
│   ├── options.html    # Settings UI
│   └── options.js      # Options page logic — load/save format
├── .github/
│   └── copilot-instructions.md
└── README.md
```

When loading the extension unpacked or packaging it for the store, use the `src/` folder — not the repo root.

## Permissions

| Permission | Reason |
|---|---|
| `contextMenus` | Register the right-click menu item |
| `storage` | Persist the user's email format across sessions |
| `activeTab` | Identify the active tab when the menu item is clicked |
| `scripting` | Send messages to the content script |

## Packaging

### For the Chrome Web Store (`.zip`)

```powershell
Compress-Archive -Path .\src\* -DestinationPath ..\fake-email-extension.zip -Force
```

Upload the resulting `.zip` on the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).

### For self-distribution (`.crx`)

Chrome can pack the extension and generate a signed `.crx` file:

1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Pack extension**
4. Set the **Extension root directory** to the `src/` folder
5. Leave the private key field empty on the first pack — Chrome generates a `.pem` key file alongside the `.crx`
6. **Keep the `.pem` file safe** — it is required to sign future updates as the same extension

> Note: Chrome blocks installation of `.crx` files not from the Web Store by default. Self-distributed `.crx` files are mainly useful for enterprise deployments via group policy. For personal/dev use, **Load unpacked** is simpler.

### Before packaging

- Bump `"version"` in `src/manifest.json`
- Ensure no dev or test files have been added to `src/`

## Roadmap

### Format & Generation
- [ ] Multiple named formats (e.g. "Work", "Personal", "Throwaway") selectable from the context menu
- [ ] Per-site format rules — automatically pick a format based on the current domain
- [ ] Additional placeholders: `{random}` (random string), `{counter}` (incrementing number), `{domain}` (current site's domain)

### UX
- [ ] Copy-to-clipboard option in the context menu without filling the field
- [ ] History / recently used addresses — context submenu showing the last N generated emails
- [ ] Keyboard shortcut to fill the focused input without right-clicking
- [ ] Browser action popup for quick format switching without opening the options page

### Options Page
- [ ] Manage multiple saved formats with add / delete / reorder
- [ ] Live preview of the generated output as you type the format string
- [ ] Import / export settings as JSON

### Broader Input Support
- [ ] Support `<textarea>` elements
- [ ] Support shadow DOM inputs used by web components

### Quality & Distribution
- [ ] Unit tests for `generateEmail()` and the content script fill logic
- [ ] Chrome Web Store listing
- [ ] Firefox (MV3) compatibility
