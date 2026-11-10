import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizeImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '900' }]));
  });
}

function isMediaOnly(col) {
  return !!col.querySelector('picture, img, .video-embed, iframe, video')
    && col.textContent.trim() === '';
}

/**
 * Benefits split: a wide intro column (heading, text, CTAs) beside a narrow benefits
 * column (heading + list). A media-only column is allowed (photo + text split).
 */
export default function decorate(block) {
  const rows = [...block.children];
  const maxCols = Math.max(1, ...rows.map((row) => row.children.length));
  block.classList.add(`columns-benefits-${maxCols}-cols`);

  rows.forEach((row) => {
    row.classList.add('columns-benefits-row');
    [...row.children].forEach((col) => {
      if (isMediaOnly(col)) col.classList.add('columns-benefits-media-col');
      else col.classList.add('columns-benefits-text-col');
      if (col.querySelector('ul, ol') && col.classList.contains('columns-benefits-text-col')) col.classList.add('columns-benefits-list-col');
    });
  });
  optimizeImages(block);
}
