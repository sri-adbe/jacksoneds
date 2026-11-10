/* eslint-disable */
/* global WebImporter */

import appFormParser from './parsers/app-form.js';
import contactFormParser from './parsers/contact-form.js';
import tabsSectionParser from './parsers/tabs-section.js';
import cardsProductParser from './parsers/cards-product.js';
import jacksonCleanupTransformer from './transformers/jackson-cleanup.js';
import jacksonSectionsTransformer from './transformers/jackson-sections.js';

const PAGE_TEMPLATE = {
  "name": "utility-page",
  "urls": [
    "https://www.jackson.com/accessibility.html",
    "https://www.jackson.com/annuities/variable-annuities/elite-access-ii-performance-center.html",
    "https://www.jackson.com/annuities/variable-annuities/perspective-advisory-ii-performance-center.html",
    "https://www.jackson.com/annuities/variable-annuities/perspective-ii-performance-center.html",
    "https://www.jackson.com/frequently-asked-questions.html",
    "https://www.jackson.com/interval-funds.html",
    "https://www.jackson.com/legal-and-privacy.html",
    "https://www.jackson.com/performance-center.html"
  ],
  "description": "Breadcrumb, page title and long-form text or FAQ/table content in a single column, with optional form",
  "blocks": [
    {
      "name": "app-form",
      "instances": [
        "div.body-content div.form",
        "div.body-content div.legacy-component"
      ],
      "pageInstances": {
        "https://www.jackson.com/accessibility.html": [
          "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.experiencefragment > div > div.layout-container > div > div > div > div > div > div > div.form"
        ],
        "https://www.jackson.com/annuities/variable-annuities/elite-access-ii-performance-center.html": [
          "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.legacy-component"
        ],
        "https://www.jackson.com/annuities/variable-annuities/perspective-advisory-ii-performance-center.html": [
          "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.legacy-component"
        ],
        "https://www.jackson.com/annuities/variable-annuities/perspective-ii-performance-center.html": [
          "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.legacy-component"
        ]
      }
    },
    {
      "name": "contact-form",
      "instances": [],
      "pageInstances": {
        "https://www.jackson.com/annuities/variable-annuities/elite-access-ii-performance-center.html": [
          "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.experiencefragment"
        ],
        "https://www.jackson.com/annuities/variable-annuities/perspective-advisory-ii-performance-center.html": [
          "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.experiencefragment-personalization"
        ],
        "https://www.jackson.com/annuities/variable-annuities/perspective-ii-performance-center.html": [
          "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.experiencefragment-personalization"
        ]
      }
    },
    {
      "name": "tabs-section",
      "instances": [
        "div.body-content div.tab-container.v4"
      ],
      "pageInstances": {
        "https://www.jackson.com/frequently-asked-questions.html": [
          "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.tab-container.v4"
        ],
        "https://www.jackson.com/legal-and-privacy.html": [
          "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.tab-container.v4"
        ]
      }
    },
    {
      "name": "cards-product",
      "instances": [],
      "pageInstances": {
        "https://www.jackson.com/interval-funds.html": [
          "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.layout-container"
        ],
        "https://www.jackson.com/performance-center.html": [
          "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.layout-container > div > div.three-column"
        ]
      }
    }
  ],
  "sections": [
    {
      "id": "main-content",
      "name": "main-content",
      "selector": [
        "div.aem-Grid > div.body-content"
      ],
      "style": null,
      "blocks": [
        "app-form",
        "contact-form",
        "tabs-section",
        "cards-product"
      ],
      "defaultContent": [
        "div.subpage-header-block div.title",
        "div.subpage-header-block div.description",
        "section div.header",
        "section h2",
        "section div.description",
        "section div.rte",
        "section div.disclosure",
        "section p"
      ]
    }
  ],
  "pageCleanup": {
    "https://www.jackson.com/accessibility.html": [
      "#onetrust-banner-sdk",
      "html > body:nth-child(2) > div:nth-child(20)",
      "html > body:nth-child(2) > div:nth-child(25)",
      "#QSIFeedbackButton-target-container",
      "#onetrust-style",
      "#onetrust-consent-sdk"
    ],
    "https://www.jackson.com/annuities/variable-annuities/elite-access-ii-performance-center.html": [
      "#onetrust-banner-sdk",
      "html > body:nth-child(2) > div:nth-child(28)",
      "#QSIFeedbackButton-target-container",
      "#onetrust-style",
      "#onetrust-consent-sdk",
      "#perfForm\\:j_idt109",
      "#perfForm\\:j_idt112",
      "div.ui-dialog.ui-corner-all"
    ],
    "https://www.jackson.com/annuities/variable-annuities/perspective-advisory-ii-performance-center.html": [
      "#onetrust-banner-sdk",
      "html > body:nth-child(2) > div:nth-child(28)",
      "#QSIFeedbackButton-target-container",
      "#onetrust-style",
      "#onetrust-consent-sdk",
      "#perfForm\\:j_idt109",
      "#perfForm\\:j_idt112",
      "div.ui-dialog.ui-corner-all"
    ],
    "https://www.jackson.com/annuities/variable-annuities/perspective-ii-performance-center.html": [
      "#onetrust-banner-sdk",
      "html > body:nth-child(2) > div:nth-child(28)",
      "#QSIFeedbackButton-target-container",
      "#onetrust-style",
      "#onetrust-consent-sdk",
      "#perfForm\\:j_idt109",
      "#perfForm\\:j_idt112",
      "div.ui-dialog.ui-corner-all"
    ],
    "https://www.jackson.com/frequently-asked-questions.html": [
      "#onetrust-banner-sdk",
      "html > body:nth-child(2) > div:nth-child(25)",
      "#QSIFeedbackButton-target-container",
      "#onetrust-style",
      "#onetrust-consent-sdk"
    ],
    "https://www.jackson.com/interval-funds.html": [
      "#onetrust-banner-sdk",
      "html > body:nth-child(2) > div:nth-child(25)",
      "#QSIFeedbackButton-target-container",
      "#onetrust-style",
      "#onetrust-consent-sdk"
    ],
    "https://www.jackson.com/legal-and-privacy.html": [
      "#onetrust-banner-sdk",
      "html > body:nth-child(2) > div:nth-child(25)",
      "#QSIFeedbackButton-target-container",
      "#onetrust-style",
      "#onetrust-consent-sdk"
    ],
    "https://www.jackson.com/performance-center.html": [
      "#onetrust-banner-sdk",
      "html > body:nth-child(2) > div:nth-child(25)",
      "#QSIFeedbackButton-target-container",
      "#onetrust-style",
      "#onetrust-consent-sdk"
    ]
  }
};

const parsers = {
  'app-form': appFormParser,
  'contact-form': contactFormParser,
  'tabs-section': tabsSectionParser,
  'cards-product': cardsProductParser,
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

    executeTransformers('afterTransform', main, payload);

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // A fragment's nodes left `main` before afterTransform: finalize it the same way, without the
    // page-only section breaks and metadata.
    params.fragments.forEach(({ element }) => {
      executeTransformers('afterTransform', element, payload, earlyTransformers);
      WebImporter.rules.transformBackgroundImages(element, document);
      WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
    });

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }, ...params.fragments];
  },
};
