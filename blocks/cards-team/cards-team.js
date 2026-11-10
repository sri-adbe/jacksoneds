import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizeImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '500' }]));
  });
}

function isImageOnly(cell) {
  return !!cell.querySelector('picture, img') && cell.textContent.trim() === '';
}

function isLinkOnly(el) {
  const links = [...el.querySelectorAll('a')];
  if (!links.length) return false;
  const linkText = links.map((a) => a.textContent).join('').replace(/\s+/g, '');
  return linkText === el.textContent.replace(/\s+/g, '');
}

/**
 * Marks up a card body: paragraphs before the first heading are eyebrows
 * (tags), link-only paragraphs are CTAs, the rest stays as body copy.
 */
function decorateBody(body) {
  body.className = 'cards-team-card-body';
  const heading = body.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6');
  if (heading) heading.classList.add('cards-team-card-title');
  let beforeHeading = !!heading;
  [...body.children].forEach((el) => {
    if (el === heading) {
      beforeHeading = false;
      return;
    }
    if (el.matches('p') && el.querySelector('picture') && !el.textContent.trim()) {
      el.classList.add('cards-team-card-icon');
      return;
    }
    if (el.matches('p, div') && isLinkOnly(el)) {
      el.classList.add('cards-team-card-cta');
      return;
    }
    if (beforeHeading && el.matches('p')) el.classList.add('cards-team-card-eyebrow');
  });
}

/**
 * Team cards: one row per person, cells `headshot | name heading + job title`.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((cell) => cell.innerHTML.trim() !== '');
    if (!cells.length) return;
    const li = document.createElement('li');
    li.className = 'cards-team-card';
    const bodies = [];
    cells.forEach((cell) => {
      if (isImageOnly(cell)) {
        cell.className = 'cards-team-card-image';
        li.append(cell);
      } else {
        decorateBody(cell);
        bodies.push(cell);
        li.append(cell);
      }
    });
    if (bodies.length > 1) li.classList.add('cards-team-card-multi');
    if (!bodies.length) li.classList.add('cards-team-card-image-only');
    ul.append(li);
  });
  block.replaceChildren(ul);
  optimizeImages(block);
}
