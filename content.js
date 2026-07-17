// content.js
// Main content script for Skeletor's Cabinet EXPANDED
// Handles text replacement, MutationObserver, and original page modal

(function() {
  'use strict';

  let enabled = true;
  let replacements = [];
  let originalTexts = new Map();
  let modalElement = null;

  // ── BUILD REPLACEMENT ARRAY FROM ALL CATEGORIES ──
  function buildReplacements() {
    const reps = [];

    // Trump
    SKELETOR_CONFIG.trump.patterns.forEach(p => {
      reps.push({
        pattern: p.regex,
        type: p.type,
        replacement: SKELETOR_CONFIG.trump.villain,
        blacklist: SKELETOR_CONFIG.trump.blacklist
      });
    });

    // Helper to process a category
    function processCategory(category) {
      Object.values(category).forEach(member => {
        member.patterns.forEach(p => {
          reps.push({
            pattern: p.regex,
            type: p.type,
            replacement: member.villain
          });
        });
      });
    }

    // Process all categories
    processCategory(SKELETOR_CONFIG.cabinet);
    processCategory(SKELETOR_CONFIG.industry);
    processCategory(SKELETOR_CONFIG.sports);
    processCategory(SKELETOR_CONFIG.pop_culture);

    // Sort: full names first, then by pattern length descending
    reps.sort((a, b) => {
      if (a.type === "full" && b.type !== "full") return -1;
      if (a.type !== "full" && b.type === "full") return 1;
      return b.pattern.source.length - a.pattern.source.length;
    });

    return reps;
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

      // For capitalized "Trump" only, check blacklist
      if (rep.type === "capitalized" && rep.blacklist) {
        if (isBlacklisted(text, rep.blacklist)) continue;
      }

      // Store original text before replacement
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

    // Batch process for performance
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
    modalElement.id = 'skeletor-modal';
    modalElement.innerHTML = `
      <div class="skeletor-modal-overlay">
        <div class="skeletor-modal-content">
          <div class="skeletor-modal-header">
            <h2>👁️ Original Page</h2>
            <button class="skeletor-close-btn">&times;</button>
          </div>
          <div class="skeletor-modal-body">
            <p>Showing original text. Close to return to Skeletor mode.</p>
            <div class="skeletor-restore-btn-container">
              <button class="skeletor-restore-btn">Restore Skeletor Mode</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalElement);

    modalElement.querySelector('.skeletor-close-btn').addEventListener('click', hideModal);
    modalElement.querySelector('.skeletor-restore-btn').addEventListener('click', () => {
      hideModal();
      restoreOriginal();
    });
    modalElement.querySelector('.skeletor-modal-overlay').addEventListener('click', (e) => {
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
    replacements = buildReplacements();

    chrome.storage?.sync?.get(['skeletorEnabled'], (result) => {
      enabled = result.skeletorEnabled !== false;
      if (enabled) {
        walkAndReplace(document.body);
        observer.observe(document.body, { childList: true, subtree: true });
      }
    });

    // Listen for messages from popup
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
      return true;
    });
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
