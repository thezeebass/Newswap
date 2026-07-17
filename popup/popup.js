// popup.js
(function() {
  'use strict';

  const toggle = document.getElementById('toggle-enabled');
  const btnShowOriginal = document.getElementById('btn-show-original');
  const btnOpenOptions = document.getElementById('btn-open-options');

  function getActiveTab(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => callback(tabs[0]));
  }

  getActiveTab((tab) => {
    chrome.tabs.sendMessage(tab.id, { action: 'getStatus' }, (response) => {
      if (chrome.runtime.lastError) return; // no content script on this page (e.g. chrome://)
      toggle.checked = !!response?.enabled;
    });
  });

  toggle.addEventListener('change', () => {
    getActiveTab((tab) => {
      chrome.tabs.sendMessage(tab.id, { action: 'toggle', enabled: toggle.checked });
    });
    chrome.storage.sync.set({ newswapEnabled: toggle.checked });
  });

  btnShowOriginal.addEventListener('click', () => {
    getActiveTab((tab) => {
      chrome.tabs.sendMessage(tab.id, { action: 'showOriginal' });
    });
  });

  btnOpenOptions.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
})();
