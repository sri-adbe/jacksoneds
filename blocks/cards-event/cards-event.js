/**
 * Event list: one row per event, cells `date/time | title + description | CTA`.
 * Any cell may be missing. A cell holding only links is treated as the CTA;
 * a short first cell without a heading is the date.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((c) => c.innerHTML.trim() !== '');
    if (!cells.length) return;
    const li = document.createElement('li');
    li.className = 'cards-event-item';

    cells.forEach((cell, i) => {
      const links = [...cell.querySelectorAll('a')];
      const linkText = links.map((a) => a.textContent.trim()).join('');
      const onlyLinks = links.length > 0 && linkText.replace(/\s+/g, '') === cell.textContent.replace(/\s+/g, '');
      const isCta = onlyLinks && i > 0;
      const isDate = i === 0 && cells.length > 1 && !cell.querySelector('h1, h2, h3, h4, h5, h6') && !onlyLinks;
      if (isCta) cell.className = 'cards-event-cta';
      else if (isDate) cell.className = 'cards-event-date';
      else cell.className = 'cards-event-body';
      li.append(cell);
    });
    ul.append(li);
  });
  block.replaceChildren(ul);
}
