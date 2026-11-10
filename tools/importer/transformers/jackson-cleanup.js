/* eslint-disable */
/* global WebImporter */

/**
 * Jackson (www.jackson.com) cleanup transformer.
 *
 * beforeTransform: ONLY replays catalog removals.
 *   1. template.pageCleanup[pageUrl] selectors, in order; each selector must match exactly one
 *      element, otherwise it is skipped.
 *   2. catalog-template.json cleanup.rules[] (consent banners), only on pages that have no
 *      pageCleanup entry, and only outside the main content.
 *   Catalog selectors were captured with the header/footer still in place, so no chrome is
 *   removed here (it would shift :nth-child/:nth-of-type positions).
 *
 * afterTransform: removes site chrome (masthead, footer, breadcrumbs, nav, profile toggle bar,
 *   empty overlay containers, body-level overlay divs, cookie/consent, tracking scripts/iframes).
 */

// From migration-work/catalog-template.json cleanup.rules[]
const CATALOG_CLEANUP_RULES = [
  '[id*="onetrust"]',
  '[class*="cookie-consent"]',
  '[id*="truste"]',
];

function normalizeUrl(url) {
  if (!url) return '';
  try {
    const u = new URL(url, 'https://www.jackson.com');
    let path = u.pathname.replace(/\/+$/, '') || '/';
    return path.toLowerCase();
  } catch (e) {
    return String(url).split(/[?#]/)[0].replace(/\/+$/, '').toLowerCase();
  }
}

function getPageUrl(document, payload) {
  const params = payload.params || {};
  const candidates = [params.originalURL, payload.url, params.url];
  const og = document.querySelector('meta[property="og:url"]');
  if (og) candidates.push(og.getAttribute('content'));
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) candidates.push(canonical.getAttribute('href'));
  return candidates.filter(Boolean);
}

/** Find the pageCleanup list for this page: exact URL match first, then by normalized path. */
function findPageEntry(map, document, payload) {
  if (!map) return null;
  const urls = getPageUrl(document, payload);
  for (const url of urls) {
    if (Object.prototype.hasOwnProperty.call(map, url)) return map[url];
  }
  const keys = Object.keys(map);
  for (const url of urls) {
    const norm = normalizeUrl(url);
    const key = keys.find((k) => normalizeUrl(k) === norm);
    if (key) return map[key];
  }
  return null;
}

function safeQueryAll(root, selector) {
  try {
    return [...root.querySelectorAll(selector)];
  } catch (e) {
    return [];
  }
}

/** Main content roots: <main> if present, else the template section containers. */
function getMainRoots(document, template) {
  const roots = safeQueryAll(document, 'main');
  if (roots.length) return roots;
  const sections = (template && template.sections) || [];
  sections.forEach((section) => {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    selectors.filter(Boolean).forEach((sel) => {
      safeQueryAll(document, sel).forEach((el) => {
        if (!roots.includes(el)) roots.push(el);
      });
    });
  });
  // Fallback for templates without sections: the content columns of the page grid.
  if (!roots.length) {
    safeQueryAll(document, 'div.body-content, div.content-wrapper.v1').forEach((el) => roots.push(el));
  }
  return roots;
}

function hasAuthorableContent(el) {
  if ((el.textContent || '').replace(/\s+/g, '').length) return true;
  return !!el.querySelector('img, picture, video, table, iframe, svg, a[href]');
}

function removeAll(root, selector) {
  safeQueryAll(root, selector).forEach((el) => el.remove());
}

export default function transform(hookName, element, payload) {
  const document = payload.document || (element && element.ownerDocument);
  if (!document) return;
  const template = payload.template || {};

  if (hookName === 'beforeTransform') {
    const pageSelectors = findPageEntry(template.pageCleanup, document, payload);

    if (Array.isArray(pageSelectors)) {
      // 1. Replay this page's catalog removals in order.
      pageSelectors.forEach((selector) => {
        const found = safeQueryAll(document, selector);
        if (found.length === 1) found[0].remove();
      });
    } else {
      // 2. Page not listed: apply the generic catalog rules, outside main content only.
      const mainRoots = getMainRoots(document, template);
      CATALOG_CLEANUP_RULES.forEach((rule) => {
        safeQueryAll(document, rule).forEach((el) => {
          if (!el.isConnected) return;
          if (el.matches('html, head, body')) return;
          if (mainRoots.some((root) => root === el || root.contains(el) || el.contains(root))) return;
          el.remove();
        });
      });
    }
    return;
  }

  if (hookName === 'afterTransform') {
    const body = document.body || document.querySelector('body');
    if (!body) return;

    // Top-level page grid (body > div.responsive > div.root > div.aem-Grid).
    const grid = body.querySelector(':scope > div.responsive > div.root > div.aem-Grid')
      || body.querySelector('div.responsive div.root.responsivegrid > div.aem-Grid');

    if (grid) {
      [...grid.children].forEach((child) => {
        // Header/footer experience fragments (masthead v1/v2, global-footer v1/v2, empty XFs).
        if (child.matches('div.experiencefragment')) {
          child.remove();
          return;
        }
        // Profile selector toggle bar.
        if (child.matches('div.toggle-container')) {
          child.remove();
          return;
        }
        // Empty full-width-container overlay (only when it carries no content).
        if (child.matches('div.full-width-container') && !hasAuthorableContent(child)) {
          child.remove();
        }
      });
    }

    // Masthead / footer / breadcrumb / site nav wherever they survived.
    removeAll(document, [
      '.masthead',
      '.global-footer',
      '.masthead__breadcrumb',
      'nav.cmp-breadcrumb',
      '.fragment-navigation',
      '.contact-us-secondary-nav-area',
      'div.toggle-container',
    ].join(', '));

    // Body-level overlays, dialogs, beacons: everything outside the page wrapper.
    const wrapper = body.querySelector(':scope > div.responsive');
    if (wrapper) {
      [...body.children].forEach((child) => {
        if (child !== wrapper) child.remove();
      });
    }
    removeAll(document, [
      '#background-mask',
      '#cludoSearchProperties',
      '.session-timeout-panel',
      '.session-timeout-dialog__panel',
      '[id^="ZN_"]',
      '[id^="batBeacon"]',
      '#QSIFeedbackButton-target-container',
    ].join(', '));

    // Cookie / consent leftovers.
    CATALOG_CLEANUP_RULES.forEach((rule) => {
      safeQueryAll(document, rule).forEach((el) => {
        if (!el.matches('html, head, body')) el.remove();
      });
    });

    // Non-authorable elements and tracking iframes (content embeds are inside block tables).
    removeAll(document, 'script, style, noscript, link');
    safeQueryAll(document, 'iframe').forEach((iframe) => {
      if (!iframe.closest('table')) {
        const src = iframe.getAttribute('src') || '';
        if (!src || /doubleclick|googletagmanager|bat\.bing|qualtrics|siteintercept|demdex|adsrvr|facebook|linkedin|cludo/i.test(src)) {
          iframe.remove();
        }
      }
    });

    // Tracking attributes.
    safeQueryAll(document, '*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (name.startsWith('data-analytics') || name.startsWith('data-track')
          || name.startsWith('data-gtm') || name === 'data-ueto' || name === 'onclick') {
          el.removeAttribute(attr.name);
        }
      });
    });
  }
}
