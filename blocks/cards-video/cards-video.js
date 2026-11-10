import { decorateVideoLinks } from '../../scripts/video-embed.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizeImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
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
  body.className = 'cards-video-card-body';
  const heading = body.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6');
  if (heading) heading.classList.add('cards-video-card-title');
  let beforeHeading = !!heading;
  [...body.children].forEach((el) => {
    if (el === heading) {
      beforeHeading = false;
      return;
    }
    if (el.matches('p') && el.querySelector('picture') && !el.textContent.trim()) {
      el.classList.add('cards-video-card-icon');
      return;
    }
    if (el.matches('p, div') && isLinkOnly(el)) {
      el.classList.add('cards-video-card-cta');
      return;
    }
    if (beforeHeading && el.matches('p')) el.classList.add('cards-video-card-eyebrow');
  });
}

/**
 * Video cards: one row per video,
 * cells `video link (optional poster picture before it) | icon + heading + text + CTA`.
 * The video link paragraph becomes a lazily loaded player at the top of the card.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((cell) => cell.innerHTML.trim() !== '');
    if (!cells.length) return;
    const li = document.createElement('li');
    li.className = 'cards-video-card';
    const bodies = [];
    cells.forEach((cell) => {
      if (isImageOnly(cell)) {
        cell.className = 'cards-video-card-image';
        li.append(cell);
      } else {
        decorateBody(cell);
        bodies.push(cell);
        li.append(cell);
      }
    });
    if (bodies.length > 1) li.classList.add('cards-video-card-multi');
    if (!bodies.length) li.classList.add('cards-video-card-image-only');
    const players = decorateVideoLinks(li);
    if (players.length) {
      const media = document.createElement('div');
      media.className = 'cards-video-card-media';
      media.append(...players);
      li.prepend(media);
      li.querySelectorAll(':scope > div').forEach((cell) => {
        if (cell !== media && !cell.innerHTML.trim()) cell.remove();
      });
    }
    ul.append(li);
  });
  block.replaceChildren(ul);
  optimizeImages(block);
}
