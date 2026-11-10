import { createOptimizedPicture } from '../../scripts/aem.js';
import { decorateVideoLinks } from '../../scripts/video-embed.js';

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

/* icon paragraph followed by copy in a text column becomes a callout */
function decorateCallout(col, prefix) {
  const icon = [...col.children].find((el, i) => i > 0 && el.matches('p')
    && el.querySelector('picture, img') && !el.textContent.trim());
  if (!icon) return;
  const callout = document.createElement('div');
  callout.className = `${prefix}-callout`;
  const body = document.createElement('div');
  body.className = `${prefix}-callout-body`;
  icon.classList.add(`${prefix}-callout-icon`);
  icon.before(callout);
  while (callout.nextSibling) body.append(callout.nextSibling);
  callout.append(icon, body);
}

/**
 * Feature split: text beside media. Cells `heading + text + list + CTA | image or video link`
 * in either order. A video link (YouTube, Vimeo, Brightcove, .mp4) becomes a player.
 * In a text column, an icon paragraph followed by copy becomes an icon callout.
 * Options: image-left forces the media first on desktop; wide-image and wide-image-2
 * widen the media column; product-intro, alt and dark are layout/colour hooks.
 */
export default function decorate(block) {
  decorateVideoLinks(block);
  const rows = [...block.children];
  const maxCols = Math.max(1, ...rows.map((row) => row.children.length));
  block.classList.add(`columns-feature-${maxCols}-cols`);

  rows.forEach((row) => {
    row.classList.add('columns-feature-row');
    [...row.children].forEach((col) => {
      if (isMediaOnly(col)) col.classList.add('columns-feature-media-col');
      else col.classList.add('columns-feature-text-col');
      if (col.classList.contains('columns-feature-text-col')) decorateCallout(col, 'columns-feature');
    });
  });
  optimizeImages(block);
}
