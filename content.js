// content.js
// NewSwap — main content script (DIAGNOSTIC VERSION with console logging)

(function() {
  'use strict';

  let enabled = true;
  let replacements = [];
  let originalTexts = new Map();
  let modalElement = null;

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

  function loadConfig(callback) {
    chrome.storage?.sync?.get(['newswapEntries'], (result) => {
      if (result.newswapEntries && Object.keys(result.newswapEntries).length > 0) {
        callback(compileReplacements(deserializeEntries(result.newswapEntries)));
      } else if (typeof NEWSWAP_CONFIG !== 'undefined') {
        callback(compileReplacements(NEWSWAP_CONFIG.entries));
      } else {
        callback([]);
      }
    });
  }

  function isBlacklisted(text, blacklist) {
    if (!blacklist) return false;
    const lower = text.toLowerCase();
    return blacklist.some(word => lower.includes(word.toLowerCase()));
  }

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

  // ── IMAGE BLUR (SIMPLIFIED) ──
  // Blurs images whose surrounding context matches a replacement name.
  // Clicking the blurred image reveals it. No external image fetching.

  function blurImage(img, replacementName) {
    if (img.dataset.newswapBlurred) return;

    img.dataset.newswapOriginal = img.src;
    img.dataset.newswapOriginalAlt = img.alt || '';
    img.dataset.newswapBlurred = replacementName;

    // Wrap in a container for the overlay UI
    const wrapper = document.createElement('div');
    wrapper.className = 'newswap-blur-wrapper';
    wrapper.style.cssText = 'position:relative;display:inline-block;overflow:hidden;';

    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    // Apply blur styles
    img.classList.add('newswap-blurred');

    // Add click-to-reveal overlay
    const overlay = document.createElement('div');
    overlay.className = 'newswap-blur-overlay';
    overlay.innerHTML = '<span>👁️ Click to reveal</span>';
    wrapper.appendChild(overlay);

    // Click handler: toggle reveal
    wrapper.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isRevealed = wrapper.classList.contains('newswap-revealed');
      if (isRevealed) {
        wrapper.classList.remove('newswap-revealed');
        img.classList.add('newswap-blurred');
      } else {
        wrapper.classList.add('newswap-revealed');
        img.classList.remove('newswap-blurred');
      }
    });

    console.log('[NewSwap] Blurred image for:', replacementName);
  }

  function unblurImage(img) {
    if (!img.dataset.newswapBlurred) return;
    const wrapper = img.closest('.newswap-blur-wrapper');
    if (wrapper) {
      wrapper.parentNode.insertBefore(img, wrapper);
      wrapper.remove();
    }
    img.classList.remove('newswap-blurred');
    img.src = img.dataset.newswapOriginal || img.src;
    img.alt = img.dataset.newswapOriginalAlt || img.alt;
    delete img.dataset.newswapOriginal;
    delete img.dataset.newswapOriginalAlt;
    delete img.dataset.newswapBlurred;
  }

  function walkAndBlurImages(root) {
    const images = root.querySelectorAll('img');
    console.log(`[NewSwap] Scanning ${images.length} images in`, root.nodeName || 'document');

    for (const img of images) {
      if (img.dataset.newswapBlurred) continue;
      if (img.closest('.newswap-blur-wrapper')) continue;

      // Build context from image and surrounding page text
      const context = (
        (img.alt || '') + ' ' +
        (img.title || '') + ' ' +
        (img.closest('figure')?.textContent || '') + ' ' +
        (img.closest('article, .article, [class*="article"]')?.textContent?.slice(0, 800) || '') + ' ' +
        (img.closest('div')?.textContent?.slice(0, 400) || '')
      );

      // Check if any replacement pattern matches the context
      for (const rep of replacements) {
        if (rep.type !== 'full') continue;
        if (!rep.pattern.test(context)) continue;

        blurImage(img, rep.replacement);
        break; // blur once per image
      }
    }
  }

  const observer = new MutationObserver(mutations => {
    if (!enabled) return;
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          walkAndReplace(node);
          walkAndBlurImages(node);
        } else if (node.nodeType === Node.TEXT_NODE) {
          replaceInNode(node);
        }
      });
    });
  });

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

  function restoreOriginal() {
    originalTexts.forEach((original, node) => {
      if (node.parentNode) {
        node.textContent = original;
      }
    });
    originalTexts.clear();

    // Unblur all images
    document.querySelectorAll('img[data-newswap-blurred]').forEach(img => {
      unblurImage(img);
    });
  }

  function reapplyReplacements() {
    walkAndReplace(document.body);
    walkAndBlurImages(document.body);
  }

  function init() {
    console.log('[NewSwap] Initializing...');
    loadConfig((compiled) => {
      replacements = compiled;
      console.log('[NewSwap] Loaded', replacements.length, 'replacements');

      chrome.storage?.sync?.get(['newswapEnabled'], (result) => {
        enabled = result.newswapEnabled !== false;
        console.log('[NewSwap] Enabled:', enabled);
        if (enabled) {
          walkAndReplace(document.body);
          walkAndBlurImages(document.body);
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
