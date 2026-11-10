/**
 * Schedule split: intro text beside a dates table.
 *
 * Row 1: `heading + text | optional table caption or authored table`.
 * Rows 2+: the table itself, one block row per table row; the first of
 * these is the header row (its first cell may be empty). If the second
 * cell of row 1 already holds a <table>, it is used as is.
 */
export default function decorate(block) {
  const [first, ...tableRows] = [...block.children];
  if (!first) return;

  const cells = [...first.children];
  const text = cells[0] || document.createElement('div');
  text.className = 'columns-schedule-text';
  const side = cells[1] || document.createElement('div');
  side.className = 'columns-schedule-table';

  const rows = tableRows.filter((row) => row.textContent.trim() !== '');
  if (rows.length && !side.querySelector('table')) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    rows.forEach((row, i) => {
      const tr = document.createElement('tr');
      [...row.children].forEach((cell, j) => {
        const isHead = i === 0 || j === 0;
        const td = document.createElement(isHead ? 'th' : 'td');
        if (i === 0) td.scope = 'col';
        else if (j === 0) td.scope = 'row';
        // EDS wraps cell text in a lone <p>; table cells hold the text directly.
        const only = cell.children.length === 1 && cell.firstElementChild;
        const lone = only && only.tagName === 'P' && cell.textContent.trim() === only.textContent.trim();
        td.append(...(lone ? only.childNodes : cell.childNodes));
        tr.append(td);
      });
      (i === 0 ? thead : tbody).append(tr);
    });
    table.append(thead, tbody);
    side.append(table);
  }

  const children = [text];
  if (side.textContent.trim() || side.querySelector('table')) children.push(side);
  block.replaceChildren(...children);
  block.classList.add(`columns-schedule-${children.length}-cols`);
}
