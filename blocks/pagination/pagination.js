/**
 * Pagination: a static list of page links. The source paginates a
 * server-rendered listing; here the authored links are rendered as a nav.
 * Author each page (and optional first / previous / next / last) as a link,
 * in one cell or one row each. An item without a link, or a link to the
 * current URL, is marked as the current page.
 */
const LABELS = {
  first: 'First page',
  prev: 'Previous page',
  previous: 'Previous page',
  next: 'Next page',
  last: 'Last page',
  '«': 'First page',
  '‹': 'Previous page',
  '›': 'Next page',
  '»': 'Last page',
};

export default function decorate(block) {
  const items = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const lis = cell.querySelectorAll('li');
    const parts = lis.length ? [...lis] : [...cell.querySelectorAll('p')];
    if (parts.length) parts.forEach((p) => items.push(p));
    else if (cell.textContent.trim()) items.push(cell);
  });

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Pagination');
  const ul = document.createElement('ul');
  const here = window.location.href.split('#')[0];

  items.forEach((source) => {
    const li = document.createElement('li');
    const link = source.querySelector('a');
    const text = source.textContent.trim();
    const key = text.toLowerCase();
    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = text;
      if (LABELS[key]) {
        a.setAttribute('aria-label', LABELS[key]);
        li.classList.add('pagination-step');
      }
      if (link.href.split('#')[0] === here && !LABELS[key]) {
        a.setAttribute('aria-current', 'page');
        li.classList.add('pagination-current');
      }
      li.append(a);
    } else {
      const span = document.createElement('span');
      span.textContent = text;
      if (LABELS[key]) li.classList.add('pagination-step', 'pagination-disabled');
      else {
        span.setAttribute('aria-current', 'page');
        li.classList.add('pagination-current');
      }
      li.append(span);
    }
    ul.append(li);
  });

  nav.append(ul);
  block.replaceChildren(nav);
}
