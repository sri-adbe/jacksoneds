/* eslint-disable */
/* global WebImporter */

/**
 * Parser for forms-finder.
 * Block rows (blocks/forms-finder): field rows `label | type | options` (search, select, submit,
 * reset) followed by content rows (the forms list as links or a table).
 *
 * Source: forms.xhtml (JSF/PrimeFaces app). The catalog claims the controls piecemeal and the
 * instances disagree on the repeating unit and on direct-child count, so each shape has its own
 * conditional path (any row may be absent):
 * - keyword box (div, ~3 children): repeating unit is tag:button (Search / Clear All) plus one
 *   label + text input                                   -> `label | search`, `button | submit/reset`
 * - ul.form filter rows (~2 children): repeating unit is tag:li (label + PrimeFaces select whose
 *   options live in a hidden <select> or .ui-selectonemenu-item list) -> `label | select | options`
 * - paginator (div.ui-paginator, ~12 children): repeating unit is tag:span/a page links; the list
 *   is not paged here, so it contributes no row and is removed
 * The first claimed piece builds the block; later pieces add their rows to it (one block per
 * page). The server-paged forms table (.ui-datatable, first 10 of ~400 rows with app-only
 * actions) is not frozen as static rows: it becomes a content row linking to the live library.
 */

const MARK = 'data-excat-forms-finder';

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function fieldRow(label, type, options) {
  return [label, type, options || ''];
}

// keyword box: label + input + buttons (tag:button repeating unit)
function keywordRows(el) {
  const rows = [];
  const input = el.querySelector('input[type="text"], input:not([type]), input[type="search"]');
  if (input) {
    const label = el.querySelector('label');
    rows.push(fieldRow(text(label) || 'Search', 'search'));
  }
  [...el.querySelectorAll('button, input[type="submit"], input[type="reset"]')].forEach((b) => {
    const label = text(b) || b.getAttribute('value') || '';
    if (!label) return;
    rows.push(fieldRow(label, /clear|reset/i.test(label) ? 'reset' : 'submit'));
  });
  return rows;
}

// filter list: one select per li (tag:li repeating unit)
function filterRows(el) {
  const rows = [];
  const items = el.matches('li') ? [el] : [...el.querySelectorAll('li')].filter((li) => li.querySelector('label'));
  items.forEach((li) => {
    const label = text(li.querySelector('label'));
    if (!label) return;
    const select = li.querySelector('select');
    let opts = select ? [...select.querySelectorAll('option')].map(text) : [];
    if (!opts.length) {
      opts = [...li.querySelectorAll('.ui-selectonemenu-item, [data-label]')]
        .map((o) => o.getAttribute('data-label') || text(o));
    }
    opts = [...new Set(opts.filter(Boolean))];
    rows.push(fieldRow(label, 'select', opts.join(', ')));
  });
  return rows;
}

function libraryLink(document, params) {
  const p = document.createElement('p');
  const a = document.createElement('a');
  a.href = (params && params.originalURL) || 'https://www.jackson.com/forms/forms.xhtml';
  const count = text(document.querySelector('.ui-paginator-current')).match(/of\s+(\d+)/i);
  a.textContent = count ? `Browse all ${count[1]} forms in the forms library` : 'Browse the forms library';
  p.append(a);
  return [p];
}

function appendRows(document, table, rows) {
  const body = table.querySelector('tbody') || table;
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    row.forEach((cell) => {
      const td = document.createElement('td');
      if (Array.isArray(cell)) cell.forEach((n) => td.append(n));
      else if (cell) td.textContent = cell;
      tr.append(td);
    });
    body.append(tr);
  });
}

export default function parse(element, { document, params }) {
  // paginator (tag:span repeating unit): no row of its own
  const isPaginator = element.matches('.ui-paginator') || !!element.closest('.ui-paginator');
  let rows = [];
  if (!isPaginator) {
    const isFilterList = element.matches('ul, li') || !!element.querySelector(':scope > li');
    rows = isFilterList ? filterRows(element) : keywordRows(element);
  }

  const existing = document.querySelector(`table[${MARK}]`);
  if (existing) {
    // keep later field rows above the trailing content row (library link)
    const linkRow = existing.querySelector('tr[data-excat-library]');
    appendRows(document, existing, rows);
    if (linkRow) linkRow.parentElement.append(linkRow);
    element.remove();
    return;
  }

  // the forms list: replace the paged app table with one content row linking to the live library
  const library = libraryLink(document, params); // read the paginator count before removal
  const scope = element.closest('form') || document;
  scope.querySelectorAll('.ui-datatable').forEach((t) => t.remove());

  const cells = [...rows, [library]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'forms-finder', cells });
  block.setAttribute(MARK, 'true');
  const trs = [...block.querySelectorAll('tr')];
  if (trs.length) trs[trs.length - 1].setAttribute('data-excat-library', 'true');
  element.replaceWith(block);
}
