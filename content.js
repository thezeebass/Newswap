// content.js
// NewSwap — main content script
// Handles text replacement, image replacement, MutationObserver, and the "original page" modal.
// Config source priority: chrome.storage.sync (user-built set) → bundled
// SKELETOR_CONFIG in config.js (fallback/default set).

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

    reps.sort((a, b) => {
      if (a.type === "full" && b.type !== "full") return -1;
      if (a.type !== "full" && b.type === "full") return 1;
      return b.pattern.source.length - a.pattern.source.length;
    });

    return reps;
  }

  // ── DESERIALIZE: reconstruct RegExp objects from stored source/flags ──
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

  // ── LOAD CONFIG: storage first, bundled file as fallback ──
  function loadConfig(callback) {
    chrome.storage?.sync?.get(['newswapEntries'], (result) => {
      if (result.newswapEntries && Object.keys(result.newswapEntries).length > 0) {
        callback(compileReplacements(deserializeEntries(result.newswapEntries)));
      } else if (typeof SKELETOR_CONFIG !== 'undefined') {
        callback(compileReplacements(SKELETOR_CONFIG.entries));
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

  // ── IMAGE REPLACEMENT ──
  async function walkAndReplaceImages(root) {
    const images = root.querySelectorAll('img');
    
    for (const img of images) {
      if (img.dataset.newswapReplaced) continue;
      
      const context = (
        (img.alt || '') + ' ' +
        (img.title || '') + ' ' +
        (img.closest('figure')?.textContent || '') + ' ' +
        (img.closest('article, .article, [class*="article"]')?.textContent?.slice(0, 800) || '') + ' ' +
        (img.closest('div')?.textContent?.slice(0, 400) || '')
      );
      
      for (const rep of replacements) {
        if (rep.type !== 'full') continue;
        if (!rep.pattern.test(context)) continue;
        
        img.dataset.newswapOriginal = img.src;
        img.dataset.newswapReplaced = rep.replacement;
        img.dataset.newswapOriginalAlt = img.alt;
        
        img.src = chrome.runtime.getURL('images/placeholder.png');
        img.alt = rep.replacement;
        
        fetchReplacementImage(img, rep.replacement);
        
        break;
      }
    }
  }

  async function fetchReplacementImage(imgElement, replacementName) {
    try {
      const settings = await new Promise((resolve) => {
        chrome.storage?.sync?.get(['newswapSettings'], (result) => {
          resolve(result.newswapSettings || {});
        });
      });
      
      const resolved = await resolveImage(replacementName, settings);
      
      if (resolved) {
        imgElement.src = resolved.url;
        imgElement.style.border = '2px solid #4361ee';
        imgElement.title = `NewSwap: ${resolved.tier === 4 ? 'calming scene' : replacementName}`;
      }
    } catch (err) {
      console.log('NewSwap image fetch failed:', err);
    }
  }

  // ── MUTATION OBSERVER ──
  const observer = new MutationObserver(mutations => {
    if (!enabled) return;

    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          walkAndReplace(node);
          walkAndReplaceImages(node);
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

  // ── RESTORE ORIGINAL TEXT AND IMAGES ──
  function restoreOriginal() {
    originalTexts.forEach((original, node) => {
      if (node.parentNode) {
        node.textContent = original;
      }
    });
    originalTexts.clear();
    
    document.querySelectorAll('img[data-newswap-original]').forEach(img => {
      img.src = img.dataset.newswapOriginal;
      img.alt = img.dataset.newswapOriginalAlt || img.alt;
      img.style.border = '';
      img.title = '';
      delete img.dataset.newswapOriginal;
      delete img.dataset.newswapReplaced;
      delete img.dataset.newswapOriginalAlt;
    });
  }

  // ── RE-APPLY REPLACEMENTS ──
  function reapplyReplacements() {
    walkAndReplace(document.body);
    walkAndReplaceImages(document.body);
  }

  // ── INITIALIZE ──
  function init() {
    loadConfig((compiled) => {
      replacements = compiled;

      chrome.storage?.sync?.get(['newswapEnabled'], (result) => {
        enabled = result.newswapEnabled !== false;
        if (enabled) {
          walkAndReplace(document.body);
          walkAndReplaceImages(document.body);
          observer.observe(document.body, { childList: true, subtree: true });
        }
      });
    });

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