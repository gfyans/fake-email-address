# Fake Email Filler — Copilot Instructions

## Project Overview

A Chrome extension (Manifest V3) that adds a right-click context menu item to any editable input field, filling it with a configurable fake/test email address. Useful for developers and QA testers who repeatedly fill email fields during testing.

## Architecture

All extension source files live in the `src/` folder. Load unpacked from `src/`, and zip `src/` for store submission.

| File | Role |
|------|------|
| `src/manifest.json` | MV3 manifest — declares permissions, background service worker, options page, and content script |
| `src/background.js` | Service worker — registers the context menu, handles clicks, generates the email, and messages the content script |
| `src/content.js` | Content script — tracks the last focused input, receives messages, and injects the email value in a framework-compatible way |
| `src/options.html` | Settings UI — lets the user configure the email format |
| `src/options.js` | Options page logic — loads/saves the format to `chrome.storage.sync` |

## Key Behaviours

- **Email generation**: `generateEmail(format)` in `background.js` replaces the `{unique-id}` placeholder with a `YYYYMMDDHHmmss` timestamp derived from `new Date()`.
- **Default format**: `"test@test.com"` (defined as `DEFAULT_FORMAT` in both `background.js` and `options.js`).
- **Storage**: The user's chosen format is persisted in `chrome.storage.sync` under the key `"format"`. Sync storage means it roams across the user's Chrome profiles.
- **Framework-compatible filling**: The content script sets `input.value` via the native `HTMLInputElement.prototype.value` setter (not a direct property assignment) and then dispatches `input` and `change` events with `bubbles: true`. This ensures React, Vue, and Angular detect the change correctly.
- **Focus tracking**: `content.js` listens for `focus` events in capture phase to remember the last focused non-button/non-checkbox input, because by the time the context menu click is processed the field may have lost focus.

## Working Conventions

- **Read `README.md` first.** Before making any changes, read `README.md` to understand the current state of the project, its features, and the roadmap.
- **Update `README.md` after changes.** After implementing any change — new feature, restructure, new placeholder, etc. — update `README.md` to reflect it. Keep the Features list, Project Structure, Configuration docs, and Roadmap checkboxes accurate.
- **Be honest about uncertainty.** Do not hallucinate API behaviour, browser support, or Chrome extension specifics. If something is unclear or unknown, say so and ask the user to clarify or provide the relevant information rather than guessing.

## Conventions & Rules

- **Manifest V3 only.** Do not use MV2 APIs (`background.scripts`, `browser_action`, etc.).
- **No external dependencies.** The extension has no npm packages, no bundler, and no build step. All code is plain vanilla JS that runs directly in the browser.
- **Service worker constraints.** `background.js` is a service worker — it has no DOM access and can be terminated at any time. Avoid storing state in module-level variables that must survive across events; use `chrome.storage` instead.
- **`DEFAULT_FORMAT` is duplicated** between `background.js` and `options.js` intentionally (no shared module), so keep them in sync if the default changes.
- **Content script scope.** `content.js` runs on `<all_urls>` and must remain lightweight. Do not add heavy listeners or imports.
- **Permissions are minimal.** Only `contextMenus`, `storage`, `activeTab`, and `scripting` are declared. Do not request additional permissions without a clear requirement.
- **Options page, not popup.** There is no browser-action popup. User configuration is done via the extensions options page (`options.html`).

## Extension Communication Flow

```
User right-clicks input
        |
  background.js (service worker)
  - contextMenus.onClicked fires
  - reads format from chrome.storage.sync
  - calls generateEmail(format)
  - chrome.tabs.sendMessage → { action: "fillEmail", email }
        |
  content.js (injected in page)
  - runtime.onMessage fires
  - resolves target input (lastFocusedInput || activeElement)
  - sets value via native setter
  - dispatches "input" + "change" events
```

## `{unique-id}` Placeholder

The timestamp format is `YYYYMMDDHHmmss` (e.g. `20260529143022`). It is generated at click time, not at save time. If the format string does not contain `{unique-id}`, the format is used verbatim.

## Adding New Placeholders

To add a new placeholder (e.g. `{random}`):
1. Add the replacement logic inside `generateEmail()` in `background.js`.
2. Document the placeholder in the hint text in `options.html`.
3. No other files need to change.
