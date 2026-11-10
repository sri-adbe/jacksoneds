import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizeImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, true, [
      { media: '(min-width: 900px)', width: '1200' },
      { width: '750' },
    ]));
  });
}

/**
 * Page-top banner: page title (and optional intro, CTA) beside a photo or
 * decorative graphic. Content: a text cell and a picture cell in either
 * order, on one row or two. Without a picture the title box spans the width.
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const mediaCell = cells.find((c) => c.querySelector('picture') && !c.textContent.trim());

  const text = document.createElement('div');
  text.className = 'hero-page-content';
  cells.forEach((cell) => {
    if (cell !== mediaCell) text.append(...cell.childNodes);
  });

  // a picture authored inside the text cell still becomes the media
  let picture = mediaCell ? mediaCell.querySelector('picture') : null;
  if (!picture) {
    picture = text.querySelector('picture');
    if (picture) {
      const holder = picture.parentElement;
      picture.remove();
      if (holder !== text && holder.matches('p') && !holder.textContent.trim()) holder.remove();
    }
  }

  const children = [text];
  if (picture) {
    const media = document.createElement('div');
    media.className = 'hero-page-media';
    media.append(picture);
    children.push(media);
  } else {
    block.classList.add('hero-page-no-image');
  }
  block.replaceChildren(...children);
  optimizeImages(block);
}
