// content.js
// NewSwap — main content script
// Handles text replacement, MutationObserver, and the "original page" modal.
// Config source priority: chrome.storage.sync (user-built set) → bundled
// NEWSWAP_CONFIG in config.js (fallback/default set).

(function() {
  'use strict';

  let enabled = true;
  let replacements = [];
  let originalTexts = new Map();
  let modalElement = null;

  // ── COMPILE A RAW ENTRIES OBJECT INTO A SORTED REPLACEMENT LIST ──
  function compileReplacements(entriesObj) {
    const reps = [];

    Object.values(entriesObj || {}).forEach(entry => {
      (entry.patterns || []).forEach(p => {
        reps.push({
          pattern: p.regex,
          type: p.type,
          replacement: entry.replacement,
          blacklist: entry.blacklist
        });
      });
    });

    // Sort: full names first, then by pattern length descending
    reps.sort((a, b) => {
      if (a.type === "full" && b.type !== "full") return -1;
      if (a.type !== "full" && b.type === "full") return 1;
      return b.pattern.source.length - a.pattern.source.length;
    });

    return reps;
  }

  // ── LOAD CONFIG: storage first, bundled file as fallback ──
  function loadConfig(callback) {
    chrome.storage?.sync?.get(['newswapEntries'], (result) => {
      if (result.newswapEntries && Object.keys(result.newswapEntries).length > 0) {
        callback(compileReplacements(result.newswapEntries));
      } else if (typeof NEWSWAP_CONFIG !== 'undefined') {
        callback(compileReplacements(NEWSWAP_CONFIG.entries));
      } else {
        callback([]);
      }
    });
  }

  // ── CHECK BLACKLIST ──
  function isBlacklisted(text, blacklist) {
    if (!blacklist) return false;
    const lower = text.toLowerCase();
    return blacklist.some(word => lower.includes(word.toLowerCase()));
  }

  // ── REPLACE TEXT IN NODE ──
  function replaceInNode(node) {
    if (node.nodeType !== Node.TEXT_NODE) return false;
    if (node.parentElement?.isContentEditable) return false;
    if (node.parentElement?.tagName === 'SCRIPT') return false;
    if (node.parentElement?.tagName === 'STYLE') return false;
    if (node.parentElement?.tagName === 'NOSCRIPT') return false;

    let text = node.textContent;
    let changed = false;

    for (const rep of replacements) {
      if (!rep.pattern.test(text)) continue;

      if (rep.type === "capitalized" && rep.blacklist) {
        if (isBlacklisted(text, rep.blacklist)) continue;
      }

      if (!originalTexts.has(node)) {
        originalTexts.set(node, text);
      }

      text = text.replace(rep.pattern, rep.replacement);
      changed = true;
    }

    if (changed) {
      node.textContent = text;
    }
    return changed;
  }

  // ── WALK AND REPLACE ──
  function walkAndReplace(root) {
    const walker = document.createTreeWalker(
      root, NodeFilter.SHOW_TEXT, null, false
    );
    const nodes = [];
    let node;
    while (node = walker.nextNode()) nodes.push(node);

    const batchSize = 100;
    for (let i = 0; i < nodes.length; i += batchSize) {
      const batch = nodes.slice(i, i + batchSize);
      batch.forEach(replaceInNode);
    }
  }

  // ── MUTATION OBSERVER ──
  const observer = new MutationObserver(mutations => {
    if (!enabled) return;

    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          walkAndReplace(node);
        } else if (node.nodeType === Node.TEXT_NODE) {
          replaceInNode(node);
        }
      });
    });
  });

  // ── ORIGINAL PAGE MODAL ──
  function createModal() {
    if (modalElement) return;

    modalElement = document.createElement('div');
    modalElement.id = 'newswap-modal';
    modalElement.innerHTML = `
      <div class="newswap-modal-overlay">
        <div class="newswap-modal-content">
          <div class="newswap-modal-header">
            <h2>👁️ Original Page</h2>
            <button class="newswap-close-btn">&times;</button>
          </div>
          <div class="newswap-modal-body">
            <p>Showing original text. Close to return to NewSwap mode.</p>
            <div class="newswap-restore-btn-container">
              <button class="newswap-restore-btn">Restore Replacements</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalElement);

    modalElement.querySelector('.newswap-close-btn').addEventListener('click', hideModal);
    modalElement.querySelector('.newswap-restore-btn').addEventListener('click', () => {
      hideModal();
      restoreOriginal();
    });
    modalElement.querySelector('.newswap-modal-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) hideModal();
    });
  }

  function showModal() {
    if (!modalElement) createModal();
    modalElement.style.display = 'block';
  }

  function hideModal() {
    if (modalElement) modalElement.style.display = 'none';
  }

  // ── RESTORE ORIGINAL TEXT ──
  function restoreOriginal() {
    originalTexts.forEach((original, node) => {
      if (node.parentNode) {
        node.textContent = original;
      }
    });
    originalTexts.clear();
  }

  // ── RE-APPLY REPLACEMENTS ──
  function reapplyReplacements() {
    walkAndReplace(document.body);
  }

  // ── INITIALIZE ──
  function init() {
    loadConfig((compiled) => {
      replacements = compiled;

      chrome.storage?.sync?.get(['newswapEnabled'], (result) => {
        enabled = result.newswapEnabled !== false;
        if (enabled) {
          walkAndReplace(document.body);
          observer.observe(document.body, { childList: true, subtree: true });
        }
      });
    });

    // Listen for messages from popup / options page
    chrome.runtime?.onMessage?.addListener((request, sender, sendResponse) => {
      if (request.action === 'toggle') {
        enabled = request.enabled;
        if (enabled) {
          reapplyReplacements();
          observer.observe(document.body, { childList: true, subtree: true });
        } else {
          observer.disconnect();
          restoreOriginal();
        }
        sendResponse({ success: true, enabled });
      }
      if (request.action === 'showOriginal') {
        showModal();
        sendResponse({ success: true });
      }
      if (request.action === 'getStatus') {
        sendResponse({ enabled });
      }
      if (request.action === 'configUpdated') {
        // Options page saved new entries — reload and reapply live
        restoreOriginal();
        loadConfig((compiled) => {
          replacements = compiled;
          if (enabled) reapplyReplacements();
        });
        sendResponse({ success: true });
      }
      return true;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
