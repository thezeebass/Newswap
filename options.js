// options.js
// NewSwap config builder — turns plain-text name input into the
// pattern objects content.js needs, and persists them to chrome.storage.

(function() {
  'use strict';

  const form = document.getElementById('entry-form');
  const listEl = document.getElementById('entry-list');
  const toastEl = document.getElementById('ns-toast');

  let entries = {}; // keyed by slug, matches the shape used in config.js

  // ── HELPERS ──

  function slugify(str) {
    return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('ns-toast-visible');
    setTimeout(() => toastEl.classList.remove('ns-toast-visible'), 2200);
  }

  // Build the {regex, type} pattern list from a plain name + match style.
  // This is what lets users type "Jane Example" instead of writing regex.
  function buildPatterns(original, matchStyle) {
    const parts = original.trim().split(/\s+/);
    const escapedFull = parts.map(escapeRegex).join('\\s+');
    const surname = parts[parts.length - 1];
    const escapedSurname = escapeRegex(surname);

    const patterns = [];

    if (matchStyle === 'full_only' || matchStyle === 'full_surname') {
      patterns.push({ regex: new RegExp(escapedFull, 'gi'), type: 'full' });
    }
    if (matchStyle === 'surname_only' || matchStyle === 'full_surname') {
      // Only add a standalone surname pattern if there's more than one
      // word — otherwise it would just duplicate the full-name pattern.
      if (parts.length > 1 || matchStyle === 'surname_only') {
        patterns.push({ regex: new RegExp(`\\b${escapedSurname}\\b`, 'gi'), type: 'surname' });
      }
    }

    return patterns;
  }

  // Regexes can't be stored directly in chrome.storage (they're not
  // JSON-serializable), so we store the pattern source/flags/type and
  // reconstruct RegExp objects when loading.
  function serializeEntries(entriesObj) {
    const out = {};
    Object.entries(entriesObj).forEach(([key, entry]) => {
      out[key] = {
        original: entry.original,
        replacement: entry.replacement,
        category: entry.category,
        blacklist: entry.blacklist,
        patterns: entry.patterns.map(p => ({
          source: p.regex.source,
          flags: p.regex.flags,
          type: p.type
        }))
      };
    });
    return out;
  }

  function deserializeEntries(stored) {
    const out = {};
    Object.entries(stored || {}).forEach(([key, entry]) => {
      out[key] = {
        original: entry.original,
        replacement: entry.replacement,
        category: entry.category,
        blacklist: entry.blacklist,
        patterns: entry.patterns.map(p => ({
          regex: new RegExp(p.source, p.flags),
          type: p.type
        }))
      };
    });
    return out;
  }

  // ── STORAGE ──

  function saveEntries() {
    chrome.storage.sync.set({ newswapEntries: serializeEntries(entries) }, () => {
      // Tell any open tabs to reload their config live
      chrome.tabs?.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { action: 'configUpdated' }, () => {
            // Ignore errors from tabs without the content script (e.g. chrome:// pages)
            void chrome.runtime.lastError;
          });
        });
      });
    });
  }

// Add to options.js storage
chrome.storage.sync.set({
  newswapEntries: entries,
  newswapSettings: {
    pexelsKey: '',
    zenMode: false,
    allowFanArt: false
  }
});

  function loadEntries(callback) {
    chrome.storage.sync.get(['newswapEntries'], (result) => {
      entries = deserializeEntries(result.newswapEntries);
      callback();
    });
  }

  // ── RENDER ──

  function render() {
    if (Object.keys(entries).length === 0) {
      listEl.innerHTML = '<p class="ns-empty-state">No replacements yet. Add one above to get started.</p>';
      return;
    }

    listEl.innerHTML = '';
    Object.entries(entries).forEach(([key, entry]) => {
      const row = document.createElement('div');
      row.className = 'ns-entry';
      row.innerHTML = `
        <div class="ns-entry-info">
          <div class="ns-entry-names">${escapeHtml(entry.original)} &rarr; <b>${escapeHtml(entry.replacement)}</b></div>
          ${entry.category ? `<div class="ns-entry-category">${escapeHtml(entry.category)}</div>` : ''}
        </div>
        <button class="ns-entry-remove" data-key="${key}">Remove</button>
      `;
      listEl.appendChild(row);
    });

    listEl.querySelectorAll('.ns-entry-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        delete entries[btn.dataset.key];
        saveEntries();
        render();
        showToast('Replacement removed');
      });
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── FORM SUBMIT ──

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const original = document.getElementById('field-original').value.trim();
    const replacement = document.getElementById('field-replacement').value.trim();
    const category = document.getElementById('field-category').value.trim();
    const matchStyle = document.getElementById('field-matchstyle').value;
    const blacklistRaw = document.getElementById('field-blacklist').value.trim();

    if (!original || !replacement) return;

    const key = slugify(original) || `entry_${Date.now()}`;
    const patterns = buildPatterns(original, matchStyle);
    const blacklist = blacklistRaw
      ? blacklistRaw.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    // If a blacklist is provided, downgrade the surname pattern to
    // "capitalized" type so content.js actually checks the blacklist.
    if (blacklist) {
      patterns.forEach(p => {
        if (p.type === 'surname') p.type = 'capitalized';
      });
    }

    entries[key] = { original, replacement, category, patterns, blacklist };

    saveEntries();
    render();
    form.reset();
    showToast(`Added: ${original} → ${replacement}`);
  });

  // ── CLEAR ALL ──

  document.getElementById('btn-clear-all').addEventListener('click', () => {
    if (Object.keys(entries).length === 0) return;
    if (!confirm('Remove all saved replacements? This cannot be undone.')) return;
    entries = {};
    saveEntries();
    render();
    showToast('All replacements cleared');
  });

  // ── EXPORT ──

  document.getElementById('btn-export').addEventListener('click', () => {
    const data = JSON.stringify(serializeEntries(entries), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newswap-config.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported to newswap-config.json');
  });

  // ── IMPORT ──

  document.getElementById('btn-import').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        const incoming = deserializeEntries(parsed);
        entries = { ...entries, ...incoming };
        saveEntries();
        render();
        showToast(`Imported ${Object.keys(incoming).length} replacement(s)`);
      } catch (err) {
        showToast('Import failed: invalid JSON file');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  });

  // ── INIT ──

  loadEntries(render);
})();
