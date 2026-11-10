/* eslint-disable */
/* global WebImporter */

/**
 * Parser for list-filter.
 * Block rows (blocks/list-filter): optional heading (filter label), then the
 * filter values as a list. A value starting with "All" clears the filter.
 *
 * Source shapes:
 * - div.integrations-filter-container (checkbox chips + "Deselect All")
 *     -> `list-filter (light-blue-orange-magenta)`
 * - div.header-block (page title + year <select>) -> `list-filter (alt)`;
 *     the page title stays above the block as default content.
 */

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

export default function parse(element, { document, params }) {
  const isSelect = !!element.querySelector('select');
  const variant = element.matches('.integrations-filter-container') || element.querySelector('.select-integration-type-container')
    ? 'light-blue-orange-magenta'
    : (isSelect ? 'alt' : null);

  let label = '';
  const values = [];
  let pageTitle = null;

  if (isSelect) {
    const select = element.querySelector('select');
    const selLabel = element.querySelector('label.floating, label[for]');
    label = text(selLabel);
    const title = element.querySelector('.page-title, h1, h2, h3, h4');
    if (title && text(title)) {
      if (label) {
        pageTitle = document.createElement(/^h[1-6]$/i.test(title.tagName) ? title.tagName.toLowerCase() : 'h3');
        pageTitle.textContent = text(title);
      } else {
        label = text(title);
      }
    }
    [...select.querySelectorAll('option')].forEach((o) => {
      const t = text(o);
      if (t) values.push(t);
    });
  } else {
    const heading = element.querySelector('h1, h2, h3, h4, h5, h6, legend, [class*="sub-header"]');
    label = text(heading);
    const deselect = element.querySelector('.deselect-all-text, .deselect-all-container label');
    if (deselect) values.push('All');
    const filterLabels = element.querySelectorAll('.filter-name-sub-container label, .filter_header label');
    const seen = new Set();
    filterLabels.forEach((l) => {
      const clone = l.cloneNode(true);
      clone.querySelectorAll('span[id$="-count"], span').forEach((s) => {
        if (/^\(\d+\)$/.test(text(s))) s.remove();
      });
      const t = text(clone).replace(/\s*\(\d+\)\s*$/, '');
      if (t && !seen.has(t)) {
        seen.add(t);
        values.push(t);
      }
    });
    if (!filterLabels.length) {
      element.querySelectorAll('label').forEach((l) => {
        const t = text(l).replace(/\s*\(\d+\)\s*$/, '');
        if (t && !/deselect/i.test(t) && !seen.has(t)) {
          seen.add(t);
          values.push(t);
        }
      });
    }
  }

  const cells = [];
  if (label) {
    const h = document.createElement('h3');
    h.textContent = label;
    cells.push([h]);
  }
  if (values.length) {
    const ul = document.createElement('ul');
    values.forEach((v) => {
      const li = document.createElement('li');
      li.textContent = v;
      ul.append(li);
    });
    cells.push([ul]);
  }
  if (!cells.length) cells.push(['']);

  const name = variant ? `list-filter (${variant})` : 'list-filter';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  if (pageTitle) element.before(pageTitle);
  element.replaceWith(block);
}
