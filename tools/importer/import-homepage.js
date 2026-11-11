/* eslint-disable */
/* global WebImporter */

import tabsSectionParser from './parsers/tabs-section.js';
import heroBannerParser from './parsers/hero-banner.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import columnsBenefitsParser from './parsers/columns-benefits.js';
import cardsToolParser from './parsers/cards-tool.js';
import jacksonCleanupTransformer from './transformers/jackson-cleanup.js';
import jacksonSectionsTransformer from './transformers/jackson-sections.js';

const PAGE_TEMPLATE = {
  "name": "homepage",
  "urls": [
    "https://www.jackson.com/"
  ],
  "description": "Landing page with full-width background hero, tabbed feature panels, three-column card rows and disclosures",
  "blocks": [
    {
      "name": "tabs-section",
      "instances": [
        "div.hero-space div.content-area.tab-wrapper"
      ],
      "pageInstances": {
        "https://www.jackson.com/": [
          "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div.hero-space.v3 > div > div.tab.event-setup > div.content-area.tab-wrapper"
        ]
      }
    },
    {
      "name": "hero-banner",
      "instances": [],
      "pageInstances": {
        "https://www.jackson.com/": [
          "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(3)"
        ]
      }
    },
    {
      "name": "cards-feature",
      "instances": [],
      "pageInstances": {
        "https://www.jackson.com/": [
          "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(4)",
          "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(6) > div > div"
        ]
      }
    },
    {
      "name": "columns-benefits",
      "instances": [],
      "pageInstances": {
        "https://www.jackson.com/": [
          "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(7)"
        ]
      }
    },
    {
      "name": "cards-tool",
      "instances": [],
      "pageInstances": {
        "https://www.jackson.com/": [
          "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(8) > div > div"
        ]
      }
    }
  ],
  "sections": [
    {
      "id": "hero",
      "name": "hero",
      "selector": [
        "div.hero-space",
        "div.aem-Grid > div.full-width-container:nth-of-type(4)"
      ],
      "style": null,
      "blocks": [
        "tabs-section"
      ],
      "defaultContent": [
        "div.hero-space div.background",
        "div.hero-space h1",
        "div.hero-space div.description",
        "div.hero-space div.subheading"
      ]
    },
    {
      "id": "main-content",
      "name": "main-content",
      "selector": [
        "div.hero-space + div.promo-area",
        "div.hero-space ~ div.background-container"
      ],
      "style": null,
      "blocks": [
        "hero-banner",
        "cards-feature",
        "columns-benefits",
        "cards-tool"
      ],
      "defaultContent": [
        "section div.disclosure",
        "section div.layout-container > div.content-area > h3",
        "section p"
      ]
    }
  ],
  "pageCleanup": {
    "https://www.jackson.com/": [
      "#onetrust-banner-sdk",
      "html > body:nth-child(2) > div:nth-child(27)",
      "#QSIFeedbackButton-target-container",
      "#onetrust-style",
      "#onetrust-consent-sdk"
    ]
  }
};

const parsers = {
  'tabs-section': tabsSectionParser,
  'hero-banner': heroBannerParser,
  'cards-feature': cardsFeatureParser,
  'columns-benefits': columnsBenefitsParser,
  'cards-tool': cardsToolParser,
};
// Late transformers change the DOM (section <hr> markers, shared fragments), so their beforeTransform
// runs after block discovery.
const sectionTransformers = [jacksonSectionsTransformer];
const fragmentTransformers = [];
const lateTransformers = [...sectionTransformers, ...fragmentTransformers];
const transformers = [jacksonCleanupTransformer, ...lateTransformers];
const earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
// Catalog selectors (pageInstances, pageCleanup) count the <script> and <hr> elements the importer
// removes before transform, so a catalog template finds its targets in preprocess.
const CATALOG = Boolean(PAGE_TEMPLATE.pageCleanup || PAGE_TEMPLATE.blocks.some((b) => b.pageInstances));

function executeTransformers(hookName, element, payload, list = transformers) {
  const enhancedPayload = { ...payload, template: payload.params?.targets?.template || PAGE_TEMPLATE };
  list.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); } catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template, url) {
  const pageBlocks = [];
  const pageKey = (u) => {
    try { const { origin, pathname } = new URL(u); return `${origin}${pathname.replace(/\/$/, '')}`; } catch { return u; }
  };
  const key = pageKey(url);
  const claim = (blockDef, selector) => {
    let matches = [];
    try { matches = document.querySelectorAll(selector); } catch { return; }
    matches.forEach((element) => {
      if (pageBlocks.some((b) => b.element === element || b.element.contains(element) || element.contains(b.element))) return;
      pageBlocks.push({ name: blockDef.name, selector, element });
    });
  };
  template.blocks.forEach((blockDef) => {
    const entry = Object.entries(blockDef.pageInstances || {}).find(([u]) => pageKey(u) === key);
    (entry ? entry[1] : []).forEach((selector) => claim(blockDef, selector));
  });
  template.blocks.forEach((blockDef) => (blockDef.instances || []).forEach((selector) => claim(blockDef, selector)));
  return pageBlocks;
}

// Runs the early transformers, then marks each block and section target with an attribute: the
// importer re-creates the body before transform, so only attributes survive, not element references.
function markPageTargets(payload) {
  const { document, params } = payload;
  executeTransformers('beforeTransform', document.body, payload, earlyTransformers);
  const blocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
    element.setAttribute('data-excat-block', String(i));
    return { name, selector };
  });
  const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
    const target = (section.selector || []).map((s) => { try { return document.querySelector(s); } catch { return null; } }).find(Boolean);
    if (!target) return section;
    target.setAttribute('data-excat-section', String(i));
    return { ...section, selector: [`[data-excat-section="${i}"]`] };
  });
  params.targets = { blocks, template: { ...PAGE_TEMPLATE, sections } };
}

export default {
  preprocess: (payload) => {
    if (CATALOG) markPageTargets(payload);
  },
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    params.fragments = [];

    if (!params.targets) markPageTargets(payload);
    const pageBlocks = params.targets.blocks
      .map((block, i) => ({ ...block, element: document.querySelector(`[data-excat-block="${i}"]`) }))
      .filter((block) => block.element);
    executeTransformers('beforeTransform', main, { ...payload, pageBlocks }, lateTransformers);

    pageBlocks.forEach((block) => {
      if (!main.contains(block.element)) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); } catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    // Blocks inside fragments (e.g. tab panels) left `main` with their fragment, so page-level
    // discovery never sees them: parse them with the template's optional fragmentInstances.
    const fragmentInstances = PAGE_TEMPLATE.fragmentInstances || {};
    if (Object.keys(fragmentInstances).length) {
      params.fragments.slice().forEach(({ element: frag }) => {
        const found = [];
        Object.entries(fragmentInstances).forEach(([name, selectors]) => selectors.forEach((sel) => {
          let matches = [];
          try { matches = frag.querySelectorAll(sel); } catch { return; }
          matches.forEach((el) => {
            if (found.some((f) => f.el === el || f.el.contains(el) || el.contains(f.el))) return;
            found.push({ name, el });
          });
        }));
        // eslint-disable-next-line no-bitwise
        found.sort((a, b) => ((a.el.compareDocumentPosition(b.el) & 4) ? -1 : 1));
        found.forEach(({ name, el }) => {
          if (!frag.contains(el) || !parsers[name]) return;
          try { parsers[name](el, { document, url, params }); } catch (e) { console.error(`Failed to parse fragment ${name}:`, e); }
        });
      });
    }

    executeTransformers('afterTransform', main, payload);

    // A fragment's nodes left `main` before afterTransform: finalize it the same way, without the
    // page-only section breaks and metadata. This runs BEFORE the page metadata is created: the
    // cleanup's afterTransform also prunes document-level chrome (everything outside the page
    // wrapper), which would otherwise delete the page's metadata block and final section break.
    params.fragments.forEach(({ element }) => {
      executeTransformers('afterTransform', element, payload, earlyTransformers);
      WebImporter.rules.transformBackgroundImages(element, document);
      WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
    });

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    // Page theme: the financial-professional site and the app screens use their own styles
    // (styles.css body.advisor / body.app), selected through the Theme metadata.
    const themePath = new URL(params.originalURL).pathname;
    const APP_TEMPLATES = ['app-search-form', 'account-recovery-form', 'sign-in'];
    let theme = null;
    if (APP_TEMPLATES.includes(PAGE_TEMPLATE.name)) theme = 'app';
    else if (/^\/financial-professional(\/|\.html$)/.test(themePath)) theme = 'advisor';
    if (theme) {
      const meta = [...main.querySelectorAll('table')]
        .find((t) => /^metadata$/i.test((t.querySelector('tr')?.textContent || '').trim()));
      if (meta) {
        const tr = document.createElement('tr');
        const k = document.createElement('td');
        const v = document.createElement('td');
        k.textContent = 'Theme';
        v.textContent = theme;
        tr.append(k, v);
        (meta.querySelector('tbody') || meta).append(tr);
      } else {
        main.append(WebImporter.Blocks.createBlock(document, { name: 'Metadata', cells: { Theme: theme } }));
      }
    }
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.x?html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }, ...params.fragments];
  },
};
