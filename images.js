// images.js — image replacement module for NewSwap

const IMAGE_TIERS = {
  // Tier 1: Wikimedia Commons (no key, public domain)
  wikimedia: {
    async search(query) {
      const url = 'https://commons.wikimedia.org/w/api.php?' +
        'action=query&generator=search&gsrnamespace=6' +
        '&gsrsearch=' + encodeURIComponent(query) +
        '&prop=imageinfo|categories&iiprop=url|extmetadata' +
        '&format=json&origin=*';
      
      const res = await fetch(url);
      const data = await res.json();
      
      // Parse pages, filter for public domain / CC0 / CC-BY
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

  // Tier 2: Pexels (user-supplied key)
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

  // Tier 3: DuckDuckGo (unofficial, no key)
  duckduckgo: {
    async search(query) {
      // Uses DDG's image search endpoint
      // Returns direct image URLs — no license metadata
      const res = await fetch(
        `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`
      );
      // Parse HTML or use a lightweight scraper
      // This is brittle and could break
      return [];
    }
  },

  // Tier 4: Calming nature scenes (Pexels/Pixabay with fixed queries)
  calming: {
    queries: [
      'calm forest mist', 'ocean waves sunset', 'mountain lake reflection',
      'cherry blossom spring', 'northern lights aurora', 'tropical waterfall',
      'snowy mountain peak', 'lavender field provence', 'autumn forest path',
      'starry night sky', 'desert sand dunes', 'green meadow hills'
    ],
    
    async getRandom(apiKey) {
      const query = this.queries[Math.floor(Math.random() * this.queries.length)];
      // Try Pexels first if key exists
      if (apiKey) {
        const pexels = await IMAGE_TIERS.pexels.search(query, apiKey);
        if (pexels.length) return pexels[0];
      }
      // Fallback to Wikimedia nature category
      return IMAGE_TIERS.wikimedia.search(query + ' nature landscape')
        .then(results => results[0] || null);
    }
  }
};

// License checker for Wikimedia
function isSafeLicense(licenseShort) {
  if (!licenseShort) return false;
  const safe = ['cc0', 'cc-zero', 'pd', 'public domain', 'cc-by', 'cc-by-sa'];
  return safe.some(l => licenseShort.toLowerCase().includes(l));
}

// Main resolver
async function resolveImage(targetName, replacementName, userSettings) {
  const { pexelsKey, zenMode, allowFanArt } = userSettings;
  
  // Tier 1: Wikimedia Commons for replacement character
  const wm = await IMAGE_TIERS.wikimedia.search(replacementName);
  if (wm.length) return { url: wm[0].url, tier: 1, attribution: wm[0].license };
  
  // Tier 2: Pexels for replacement character
  if (pexelsKey) {
    const pex = await IMAGE_TIERS.pexels.search(replacementName, pexelsKey);
    if (pex.length) return { url: pex[0].url, tier: 2, attribution: pex[0].photographer };
  }
  
  // If zenMode is ON, skip Tier 3/5 and go straight to calming
  if (zenMode) {
    const calm = await IMAGE_TIERS.calming.getRandom(pexelsKey);
    if (calm) return { url: calm.url, tier: 4, attribution: calm.photographer || 'Wikimedia Commons' };
  }
  
  // Tier 3: DuckDuckGo (broad web search)
  const ddg = await IMAGE_TIERS.duckduckgo.search(replacementName);
  if (ddg.length) return { url: ddg[0].url, tier: 3, attribution: null };
  
  // Tier 5: Fan art (only if explicitly allowed)
  if (allowFanArt) {
    const fan = await IMAGE_TIERS.duckduckgo.search(replacementName + ' fan art');
    if (fan.length) return { url: fan[0].url, tier: 5, attribution: null };
  }
  
  // Ultimate fallback: calming scene regardless
  const calm = await IMAGE_TIERS.calming.getRandom(pexelsKey);
  if (calm) return { url: calm.url, tier: 4, attribution: calm.photographer || 'Wikimedia Commons' };
  
  return null;
}