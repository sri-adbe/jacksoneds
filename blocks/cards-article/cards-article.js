import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizeImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

const READ_TIME = /^\d+\s*(min|mins|minutes?)\b/i;

/**
 * Marks up the body cell: paragraphs before the heading are meta
 * (first = tag, next = date), the heading is the title, a trailing
 * "N min" paragraph is the read time, the rest is the description.
 */
function decorateBody(body) {
  body.className = 'cards-article-card-body';
  const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
  let beforeHeading = !!heading;
  let metaIndex = 0;
  [...body.children].forEach((el) => {
    if (el === heading) {
      beforeHeading = false;
      el.classList.add('cards-article-title');
      return;
    }
    if (beforeHeading) {
      el.classList.add(metaIndex === 0 ? 'cards-article-tag' : 'cards-article-date');
      metaIndex += 1;
      return;
    }
    if (READ_TIME.test(el.textContent.trim())) el.classList.add('cards-article-read-time');
    else el.classList.add('cards-article-description');
  });
}

/**
 * Article cards: one row per article, cells `image | body`.
 * The card links to the article via the title link, or the first link
 * found in the card; the link is stretched over the whole card.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((c) => c.innerHTML.trim() !== '');
    if (!cells.length) return;
    const li = document.createElement('li');
    li.className = 'cards-article-card';
    const bodyParts = [];
    cells.forEach((cell) => {
      if (cell.querySelector('picture') && !cell.textContent.trim()) {
        cell.className = 'cards-article-card-image';
        li.append(cell);
      } else {
        bodyParts.push(cell);
      }
    });
    if (bodyParts.length) {
      const body = bodyParts.shift();
      bodyParts.forEach((extra) => body.append(...extra.childNodes));
      decorateBody(body);
      li.append(body);
    }

    // a link-only paragraph without a title link is the card link
    const titleLink = li.querySelector('.cards-article-title a');
    const link = titleLink || li.querySelector('a');
    if (link) {
      link.classList.add('cards-article-link');
      li.classList.add('cards-article-card-linked');
      const linkPara = link.closest('p');
      if (!titleLink && linkPara && linkPara.textContent.trim() === link.textContent.trim()
        && li.querySelector('.cards-article-title')) {
        // move the bare link onto the title so the card has one accessible name
        const title = li.querySelector('.cards-article-title');
        const a = document.createElement('a');
        a.href = link.href;
        a.className = 'cards-article-link';
        a.append(...title.childNodes);
        title.append(a);
        linkPara.remove();
      }
    }
    ul.append(li);
  });
  block.replaceChildren(ul);
  optimizeImages(block);
}
