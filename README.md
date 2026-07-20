NewSwap
A Chrome extension that replaces any name on any webpage with a name you choose. It ships empty — you decide what gets replaced with what, using the built-in configuration page.
What it does
NewSwap scans the text on every page you visit and swaps names you've configured for names you've chosen instead. It works across page loads and dynamically loaded content (infinite scroll, single-page apps, etc.), and you can toggle it on or off per browsing session, or view the original unmodified page at any time.
Privacy
All matching happens locally in your browser using regular expressions built from the entries you add. Your replacement list is stored in `chrome.storage.sync` (synced across your own signed-in Chrome instances only). Nothing is sent to any server. There is no network activity, no analytics, and no third-party code.
Installation
Download or clone this repository.
Open Chrome and go to `chrome://extensions`.
Enable Developer mode (top right toggle).
Click Load unpacked and select the project folder.
NewSwap will appear in your extensions toolbar. Pin it for easy access.
Getting started
The extension ships with two example entries so you can see the data format, but no real replacements are active until you add your own. Click the NewSwap icon, then Manage replacements to open the configuration page.
See USER_GUIDE.md for a full walkthrough of adding, exporting, and importing replacements.
Project structure
```
newswap/
├── manifest.json       Extension manifest (Manifest V3)
├── config.js            Bundled fallback config (used only until you add your own entries)
├── content.js            Injected into every page: does the matching/replacing
├── styles.css             Styles for the in-page "show original" modal
├── options.html/.css/.js  The configuration page (the config builder)
├── popup/
│   ├── popup.html         Toolbar popup: on/off toggle, show original, open settings
│   └── popup.js
└── icons/                 Toolbar icons
```
How matching works
Each replacement entry has one or more patterns:
Type	Behavior
`full`	Matches a full name (e.g. "Jane Example"). Always checked first.
`surname`	Matches a single word, case-insensitive. Checked after full-name patterns.
`capitalized`	Matches a single word, case-sensitive, and supports a blacklist to skip common-word collisions (e.g. a surname that's also an ordinary English word).
The configuration page builds these patterns for you automatically from a plain name — you don't need to write regex by hand unless you're editing `config.js` directly.
Configuration storage
New installs read from the bundled `config.js` as a starting fallback.
As soon as you add or import an entry through the options page, your saved set (in `chrome.storage.sync`) takes over completely, and `config.js` is ignored.
Use Export JSON on the options page to back up your list or share it with someone else; Import JSON merges a file back in.
License
Copyright <2026> <THEZEEBASS>
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE..
