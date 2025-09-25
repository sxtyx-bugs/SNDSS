/**
 * Privacy utilities for preventing browser history storage and enhancing security
 */

/**
 * Initializes privacy features to prevent browser history storage
 */
export function initPrivacyFeatures() {
  // Add referrer-policy meta tag to head
  const referrerMeta = document.createElement('meta');
  referrerMeta.name = 'referrer-policy';
  referrerMeta.content = 'no-referrer';
  document.head.appendChild(referrerMeta);
  
  // Prevent browser from storing history for this page
  if (window.history && window.history.pushState) {
    // Replace current history entry with a modified one that won't be stored properly
    window.history.replaceState(null, document.title, window.location.pathname);
    
    // Listen for history changes and prevent them
    window.addEventListener('popstate', () => {
      window.history.replaceState(null, document.title, window.location.pathname);
    });
    
    // Override pushState and replaceState to prevent history entries
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = function(...args) {
      const result = originalPushState.apply(this, args);
      window.dispatchEvent(new Event('locationchange'));
      return result;
    };
    
    window.history.replaceState = function(...args) {
      const result = originalReplaceState.apply(this, args);
      window.dispatchEvent(new Event('locationchange'));
      return result;
    };
  }

  // Add noopener and noreferrer to all external links
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A') {
      const link = target as HTMLAnchorElement;
      if (link.href && link.hostname !== window.location.hostname) {
        link.rel = 'noopener noreferrer';
      }
    }
  });

  // Clear localStorage and sessionStorage when page unloads
  window.addEventListener('beforeunload', () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error('Error clearing storage:', e);
    }
  });
}

/**
 * Applies privacy mode to a specific route
 * @param path The route path to apply privacy mode to
 */
export function applyPrivacyMode(path: string) {
  if (window.location.pathname.startsWith(path)) {
    // Set additional privacy headers via meta tags
    const metaTags = [
      { httpEquiv: 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
      { httpEquiv: 'Pragma', content: 'no-cache' },
      { httpEquiv: 'Expires', content: '0' },
      { name: 'referrer', content: 'no-referrer' },
      { name: 'referrer-policy', content: 'no-referrer' },
      { name: 'robots', content: 'noindex, nofollow, noarchive' },
    ];

    metaTags.forEach(({ httpEquiv, name, content }) => {
      const meta = document.createElement('meta');
      if (httpEquiv) meta.httpEquiv = httpEquiv;
      if (name) meta.name = name;
      meta.content = content;
      document.head.appendChild(meta);
    });

    // Disable browser caching for this page
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'DISABLE_CACHE',
        url: window.location.href,
      });
    }
    
    // For /app route, apply extra privacy measures
    if (path === '/app') {
      applyAppRoutePrivacy();
    }
  }
}

/**
 * Apply special privacy measures for the /app route
 */
function applyAppRoutePrivacy() {
  // Prevent the page from being added to browser history
  if (window.history && window.history.replaceState) {
    // Use a random string as state to make it harder to track
    const randomState = Math.random().toString(36).substring(2);
    window.history.replaceState(randomState, document.title, window.location.pathname);
  }
  
  // Clear session storage when leaving the page
  window.addEventListener('beforeunload', () => {
    sessionStorage.clear();
  });
  
  // Add a special class to the body to indicate privacy mode
  document.body.classList.add('privacy-mode');
}