/**
 * Product data table.
 * One block row per table row; the first row is the header (add the
 * `no-header` option to skip it). Cells keep their links and formatting.
 * Header cells become sort buttons: clicking sorts the rows by that column
 * (text, case-insensitive, numeric-aware). On narrow screens the table
 * scrolls horizontally.
 */
function sortRows(tbody, col, dir) {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  const rows = [...tbody.rows];
  rows.sort((a, b) => {
    const x = (a.cells[col]?.textContent || '').trim();
    const y = (b.cells[col]?.textContent || '').trim();
    return dir * collator.compare(x, y);
  });
  tbody.append(...rows);
}

export default function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const header = !block.classList.contains('no-header');
  const rows = [...block.children].filter((row) => row.textContent.trim() || row.querySelector('img'));
  const cols = Math.max(0, ...rows.map((row) => row.children.length));

  rows.forEach((row, i) => {
    const tr = document.createElement('tr');
    const isHead = i === 0 && header;
    const cells = [...row.children];
    for (let c = 0; c < cols; c += 1) {
      const cell = document.createElement(isHead ? 'th' : 'td');
      if (isHead) cell.scope = 'col';
      if (cells[c]) cell.append(...cells[c].childNodes);
      tr.append(cell);
    }
    (isHead ? thead : tbody).append(tr);
  });

  if (thead.rows.length && tbody.rows.length > 1) {
    [...thead.rows[0].cells].forEach((th, col) => {
      if (!th.textContent.trim()) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'table-product-sort';
      button.append(...th.childNodes);
      th.append(button);
      th.setAttribute('aria-sort', 'none');
      button.addEventListener('click', () => {
        const dir = th.getAttribute('aria-sort') === 'ascending' ? -1 : 1;
        thead.querySelectorAll('th').forEach((h) => h.setAttribute('aria-sort', 'none'));
        th.setAttribute('aria-sort', dir === 1 ? 'ascending' : 'descending');
        sortRows(tbody, col, dir);
      });
    });
  }

  if (thead.rows.length) table.append(thead);
  table.append(tbody);
  const wrapper = document.createElement('div');
  wrapper.className = 'table-product-scroll';
  wrapper.append(table);
  block.replaceChildren(wrapper);
}
