# NewSwap User Guide

This guide walks through everyday use of NewSwap: adding replacements, toggling it on and off, viewing the original page, and backing up your list.

## 1. Opening the configuration page

Click the NewSwap icon in your toolbar, then **Manage replacements**. This opens a full browser tab where you build your replacement list. You can also reach it directly by right-clicking the NewSwap icon and choosing **Options**.

## 2. Adding your first replacement

On the configuration page, fill in the **Add a replacement** form:

- **Name to replace** — the text as it actually appears on pages, e.g. `Jane Example`.
- **Replacement name** — what you want to see instead, e.g. `Captain Placeholder`.
- **Category** (optional) — a label to help you organize a long list, e.g. `Work`, `Sports`, `News`.
- **Match style** — controls how much of the name gets matched:
  - *Full name + surname* — matches both "Jane Example" and standalone "Example". Best for most names.
  - *Full name only* — only matches the exact full phrase "Jane Example". Use this if the surname alone is too common a word to safely swap everywhere.
  - *Surname only* — matches just "Example" wherever it appears.
- **Avoid false matches** (optional) — if the surname doubles as an everyday word (e.g. "Baker", "Hunter"), list phrases here, separated by commas, that should block the swap when nearby. For example, entering `baker's dozen, master baker` stops those phrases from being altered while "Chris Baker" or standalone "Baker" elsewhere still gets replaced.

Click **Add replacement**. It's saved immediately and takes effect on any open tabs.

## 3. Managing your list

Every saved entry appears under **Your replacements**, showing the original name, the replacement, and category. Click **Remove** on any entry to delete it.

Click **Clear all** to wipe your entire list and start over. This can't be undone, so export first if you want a backup (see below).

## 4. Turning replacements on or off

Click the NewSwap toolbar icon and use the switch next to **Replacements active**. This affects only the current page/tab session — reloading a page re-applies your setting.

## 5. Viewing the original page

Sometimes you want to double-check what a page actually says. Click the toolbar icon, then **Show original page**. A panel appears confirming you're viewing unmodified text. Click **Restore Replacements** to bring your swaps back, or close the panel to keep viewing the original text until you navigate away or reload.

## 6. Backing up or sharing your list

On the configuration page:

- **Export JSON** downloads your full replacement list as a `.json` file — a good habit before making big changes, or if you want to move your list to another computer.
- **Import JSON** lets you load a previously exported file. Imported entries are merged into your existing list rather than replacing it, so importing is safe to do repeatedly.

## Tips

- Start with **Full name + surname** matching for most names — it's the most forgiving default.
- If you notice unrelated words getting swapped, switch that entry to **Full name only**, or add the offending phrase to the blacklist field.
- Longer, more specific full-name patterns are always checked before shorter surname-only ones, so overlapping names won't produce broken partial swaps.
- Entries sync via your Chrome sign-in (`chrome.storage.sync`), so your list follows you to other computers signed into the same Chrome account.
