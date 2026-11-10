import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizeImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, true, [
      { media: '(min-width: 900px)', width: '2000' },
      { width: '900' },
    ]));
  });
}

function isLinkOnly(el) {
  const links = [...el.querySelectorAll('a')];
  if (!links.length) return false;
  return links.map((a) => a.textContent).join('').replace(/\s+/g, '')
    === el.textContent.replace(/\s+/g, '');
}

/**
 * Photo banner with an inset content box.
 * Content: a background picture (its own row or cell) and a content cell with
 * heading, text and optional CTA links, in any order. The first picture-only
 * cell (or the first picture found) is the background. A missing image or CTA
 * is fine. Options orange, blue, cyan and grey are colour hooks for the box.
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  let bgCell = cells.find((c) => c.querySelector('picture') && !c.textContent.trim());
  let background = bgCell ? bgCell.querySelector('picture') : null;
  if (!background) {
    background = block.querySelector('picture');
    bgCell = null;
  }

  const box = document.createElement('div');
  box.className = 'hero-banner-content';
  cells.forEach((cell) => {
    if (cell !== bgCell) box.append(...cell.childNodes);
  });
  if (background && box.contains(background)) {
    const holder = background.parentElement;
    background.remove();
    if (holder !== box && holder.matches('p') && !holder.textContent.trim()) holder.remove();
  }

  const ctas = [...box.children].filter((el) => el.matches('p') && isLinkOnly(el));
  if (ctas.length) {
    const actions = document.createElement('div');
    actions.className = 'hero-banner-actions';
    ctas.forEach((cta) => actions.append(cta));
    box.append(actions);
  }

  const children = [];
  if (background) {
    const bg = document.createElement('div');
    bg.className = 'hero-banner-background';
    bg.append(background);
    children.push(bg);
  } else {
    block.classList.add('hero-banner-no-image');
  }
  children.push(box);
  block.replaceChildren(...children);
  optimizeImages(block);
}
