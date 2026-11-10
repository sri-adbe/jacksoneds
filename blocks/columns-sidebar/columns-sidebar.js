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
 * Article body with a sidebar: row 1 is `main content | sidebar`. The last column
 * becomes an <aside> (related links, tools). Extra rows repeat the same layout.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const maxCols = Math.max(1, ...rows.map((row) => row.children.length));
  block.classList.add(`columns-sidebar-${maxCols}-cols`);

  rows.forEach((row) => {
    row.classList.add('columns-sidebar-row');
    [...row.children].forEach((col) => {
      if (isMediaOnly(col)) col.classList.add('columns-sidebar-media-col');
      else col.classList.add('columns-sidebar-text-col');
    });
    const cols = [...row.children];
    if (cols.length > 1) {
      const last = cols[cols.length - 1];
      const aside = document.createElement('aside');
      aside.className = last.className;
      aside.classList.add('columns-sidebar-aside');
      aside.append(...last.childNodes);
      last.replaceWith(aside);
      cols[0].classList.add('columns-sidebar-main');
    }
  });
  optimizeImages(block);
}
