// images.js
// NewSwap — image replacement resolver
// Tiered fallback: Wikimedia Commons → Pexels → DuckDuckGo → calming scene

const IMAGE_TIERS = {
  wikimedia: {
    async search(query) {
      const url = 'https://commons.wikimedia.org/w/api.php?' +
        'action=query&generator=search&gsrnamespace=6' +
        '&gsrsearch=' + encodeURIComponent(query) +
        '&prop=imageinfo|categories&iiprop=url|extmetadata' +
        '&format=json&origin=*';
      
      const res = await fetch(url);
      const data = await res.json();
      
      const pages = data.query?.pages || {};
      return Object.values(pages)
        .map(p => ({
          url: p.imageinfo?.[0]?.url,
          license: p.imageinfo?.[0]?.extmetadata?.License?.value,
          licenseShort: p.imageinfo?.[0]?.extmetadata?.LicenseShortName?.value,
          width: p.imageinfo?.[0]?.width,
          height: p.imageinfo?.[0]?.height
        }))
        .filter(img => img.url && isSafeLicense(img.licenseShort));
    }
  },

  pexels: {
    async search(query, apiKey) {
      if (!apiKey) return [];
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5`,
        { headers: { Authorization: apiKey } }
      );
      const data = await res.json();
      return (data.photos || []).map(p => ({
        url: p.src.medium,
        photographer: p.photographer,
        source: 'pexels'
      }));
    }
  },

  duckduckgo: {
    async search(query) {
      // Unofficial DDG image search — brittle, may break
      const res = await fetch(
        `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`,
        { headers: { 'Accept': 'text/html' } }
      );
      const html = await res.text();
      // Very basic parsing — look for image URLs in the response
      const matches = html.match(/https:\/\/[^"\s]+\.(?:jpg|jpeg|png|gif)/gi);
      return (matches || []).slice(0, 5).map(url => ({ url }));
    }
  },

  calming: {
    queries: [
      'calm forest mist', 'ocean waves sunset', 'mountain lake reflection',
      'cherry blossom spring', 'northern lights aurora', 'tropical waterfall',
      'snowy mountain peak', 'lavender field provence', 'autumn forest path',
      'starry night sky', 'desert sand dunes', 'green meadow hills'
    ],
    
    async getRandom(apiKey) {
      const query = this.queries[Math.floor(Math.random() * this.queries.length)];
      if (apiKey) {
        const pexels = await IMAGE_TIERS.pexels.search(query, apiKey);
        if (pexels.length) return pexels[0];
      }
      const wm = await IMAGE_TIERS.wikimedia.search(query + ' nature landscape');
      return wm[0] || null;
    }
  }
};

function isSafeLicense(licenseShort) {
  if (!licenseShort) return false;
  const safe = ['cc0', 'cc-zero', 'pd', 'public domain', 'cc-by', 'cc-by-sa'];
  return safe.some(l => licenseShort.toLowerCase().includes(l));
}

// Main resolver — renamed to match content.js expectation
async function resolveImage(replacementName, userSettings) {
  const { pexelsKey, zenMode, allowFanArt } = userSettings || {};
  
  // Tier 1: Wikimedia Commons for replacement character
  const wm = await IMAGE_TIERS.wikimedia.search(replacementName);
  if (wm.length) return { url: wm[0].url, tier: 1, attribution: wm[0].license };
  
  // Tier 2: Pexels for replacement character
  if (pexelsKey) {
    const pex = await IMAGE_TIERS.pexels.search(replacementName, pexelsKey);
    if (pex.length) return { url: pex[0].url, tier: 2, attribution: pex[0].photographer };
  }
  
  // Zen mode: skip to calming immediately
  if (zenMode) {
    const calm = await IMAGE_TIERS.calming.getRandom(pexelsKey);
    if (calm) return { url: calm.url, tier: 4, attribution: calm.photographer || 'Wikimedia Commons' };
  }
  
  // Tier 3: DuckDuckGo broad search
  const ddg = await IMAGE_TIERS.duckduckgo.search(replacementName);
  if (ddg.length) return { url: ddg[0].url, tier: 3, attribution: null };
  
  // Tier 5: Fan art (if allowed)
  if (allowFanArt) {
    const fan = await IMAGE_TIERS.duckduckgo.search(replacementName + ' fan art');
    if (fan.length) return { url: fan[0].url, tier: 5, attribution: null };
  }
  
  // Ultimate fallback: calming scene
  const calm = await IMAGE_TIERS.calming.getRandom(pexelsKey);
  if (calm) return { url: calm.url, tier: 4, attribution: calm.photographer || 'Wikimedia Commons' };
  
  return null;
}