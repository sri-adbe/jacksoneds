/**
 * Address card: the first row is the header band (organisation name),
 * every following row is the address body. A single-row block renders
 * the first paragraph or heading as the header.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const header = document.createElement('div');
  header.className = 'address-card-header';
  const body = document.createElement('address');
  body.className = 'address-card-body';

  if (rows.length > 1) {
    [...rows[0].children].forEach((cell) => header.append(...cell.childNodes));
    rows.slice(1).forEach((row) => {
      [...row.children].forEach((cell) => body.append(...cell.childNodes));
    });
  } else if (rows.length === 1) {
    const cell = rows[0].firstElementChild || rows[0];
    const first = cell.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > p');
    if (first && cell.children.length > 1) header.append(first);
    body.append(...cell.childNodes);
  }

  block.replaceChildren(...[header, body].filter((el) => el.textContent.trim()));
}
