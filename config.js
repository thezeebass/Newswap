// config.js
// NewSwap — default/bundled replacement set
// This file is the FALLBACK used only if nothing has been saved in
// chrome.storage yet. Once a user adds entries via the options page,
// their saved config takes over. Edit this file to change what ships
// with a fresh install, or leave it empty and let users build their
// own set from scratch.
//
// Pattern types:
//   "full"        — matched and replaced first, before shorter patterns
//   "surname"     — single-word matches (case-insensitive), matched last
//   "capitalized" — single-word matches (case-sensitive), for common
//                   words that need a blacklist to avoid false positives
//
// blacklist (optional, "capitalized" type only): substrings that, if
// present in the surrounding text, cause the match to be skipped.
// Use this for names that collide with common English words.

const NEWSWAP_CONFIG = {
  entries: {

    // ── EXAMPLE 1: a simple full-name + surname swap ──
    "example_one": {
      original: "Jane Example",
      replacement: "Captain Placeholder",
      category: "Example",
      patterns: [
        { regex: /Jane\s+Example/gi, type: "full" },
        { regex: /\bExample\b/gi, type: "surname" }
      ]
    },

    // ── EXAMPLE 2: a name that collides with a common word,
    //    showing how to use a blacklist ──
    "example_two": {
      original: "Chris Baker",
      replacement: "The Baker Ghost",
      category: "Example",
      patterns: [
        { regex: /Chris\s+Baker/gi, type: "full" },
        { regex: /\bBaker\b/g, type: "capitalized" }
      ],
      blacklist: [
        "baker's dozen", "baking soda", "master baker"
      ]
    }

  }
};
