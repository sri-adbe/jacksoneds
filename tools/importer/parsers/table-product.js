/* eslint-disable */
/* global WebImporter */

/**
 * Parser for table-product.
 * Block rows (blocks/table-product): one block row per table row; first row is
 * the header. Source: div.table (v3/v4) wrapping a plain <table>, possibly
 * inside a .two-column wrapper.
 * rowspan/colspan are expanded into a rectangular grid (spanned slots stay
 * empty) so every block row has the same number of cells.
 */

const NBSP_ONLY = /^[\s ]*$/;

function cellContent(td, document) {
  const clone = td.cloneNode(true);
  [clone, ...clone.querySelectorAll('*')].forEach((n) => {
    n.removeAttribute('style');
    n.removeAttribute('class');
    n.removeAttribute('id');
  });
  // drop empty spacer paragraphs and stray empty inline tags
  clone.querySelectorAll('p').forEach((p) => {
    if (NBSP_ONLY.test(p.textContent) && !p.querySelector('img')) p.remove();
  });
  clone.querySelectorAll('i, em, span').forEach((n) => {
    if (!n.textContent && !n.children.length) n.remove();
  });
  if (NBSP_ONLY.test(clone.textContent) && !clone.querySelector('img')) return '';
  // drop leading line breaks / whitespace
  while (clone.firstChild && ((clone.firstChild.nodeType === 3 && NBSP_ONLY.test(clone.firstChild.textContent))
    || (clone.firstChild.nodeType === 1 && clone.firstChild.tagName === 'BR'))) {
    clone.firstChild.remove();
  }
  const frag = document.createElement('div');
  frag.append(...clone.childNodes);
  return [...frag.childNodes];
}

export default function parse(element, { document, params }) {
  const table = element.matches('table') ? element : element.querySelector('table');
  const cells = [];
  if (table) {
    const trs = [...table.querySelectorAll('tr')].filter((tr) => tr.closest('table') === table);
    const grid = [];
    const carry = []; // remaining rowspan count per column
    trs.forEach((tr, r) => {
      const row = [];
      let col = 0;
      const tds = [...tr.children].filter((c) => /^t[dh]$/i.test(c.tagName));
      const place = () => {
        while (carry[col] > 0) {
          row[col] = '';
          carry[col] -= 1;
          col += 1;
        }
      };
      tds.forEach((td) => {
        place();
        const colspan = Math.max(1, parseInt(td.getAttribute('colspan'), 10) || 1);
        const rowspan = Math.max(1, parseInt(td.getAttribute('rowspan'), 10) || 1);
        row[col] = cellContent(td, document);
        for (let k = 1; k < colspan; k += 1) row[col + k] = '';
        for (let k = 0; k < colspan; k += 1) if (rowspan > 1) carry[col + k] = rowspan - 1;
        col += colspan;
      });
      place();
      grid[r] = row;
    });
    const width = Math.max(0, ...grid.map((r) => r.length));
    grid.forEach((row) => {
      const full = [];
      for (let c = 0; c < width; c += 1) full.push(row[c] === undefined ? '' : row[c]);
      const empty = full.every((c) => c === '');
      if (!empty) cells.push(full);
    });
  }
  if (!cells.length) cells.push(['']);

  // Source tables without any <th> (e.g. the careers benefits grid) have no
  // header row; the block's documented `no-header` option keeps row 1 as data.
  const noHeader = table && !table.querySelector('th, thead');
  const name = noHeader ? 'table-product (no-header)' : 'table-product';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
