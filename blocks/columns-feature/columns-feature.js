import { createOptimizedPicture } from '../../scripts/aem.js';
import { decorateVideoLinks } from '../../scripts/video-embed.js';

const IBM_VIDEO = /(^|\.)video\.ibm\.com$/;
const DOWNLOAD = /(\.pdf$|-pdf$|^\/pdf\/)/i;

function optimizeImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '900' }]));
  });
}

/* IBM Video (video.ibm.com/embed/...) links, which the shared helper does not cover */
function decorateIbmVideos(block) {
  block.querySelectorAll('a[href]').forEach((link) => {
    let url;
    try {
      url = new URL(link.href);
    } catch (e) {
      return;
    }
    if (!IBM_VIDEO.test(url.hostname) || !url.pathname.startsWith('/embed/')) return;
    const holder = link.closest('p, li, div');
    if (!holder || holder.textContent.trim() !== link.textContent.trim()) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'video-embed';
    const frame = document.createElement('div');
    frame.className = 'video-embed-frame';
    const iframe = document.createElement('iframe');
    iframe.src = url.href;
    iframe.title = link.title && link.title !== link.href ? link.title : 'Video';
    iframe.loading = 'lazy';
    iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    iframe.allowFullscreen = true;
    frame.append(iframe);
    wrapper.append(frame);
    if (holder.matches('p, li')) holder.replaceWith(wrapper);
    else link.replaceWith(wrapper);
  });
}

function isMediaOnly(col) {
  return !!col.querySelector('picture, img, .video-embed, iframe, video')
    && col.textContent.trim() === '';
}

/* a link alone in its paragraph (not an authored button) is an arrow call-to-action */
function decorateCtas(col, prefix) {
  col.querySelectorAll(':scope > p > a[href]:not(.button)').forEach((a) => {
    const p = a.parentElement;
    if (p.textContent.trim() !== a.textContent.trim()) return;
    p.classList.add(`${prefix}-cta-wrapper`);
    a.classList.add(`${prefix}-cta`);
    const href = a.getAttribute('href') || '';
    if (DOWNLOAD.test(href.split(/[?#]/)[0])) a.classList.add(`${prefix}-cta-download`);
  });
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
 * in either order. A video link (YouTube, Vimeo, Brightcove, IBM Video, .mp4) becomes a player.
 * In a text column, an icon paragraph followed by copy becomes an icon callout, and a link
 * alone in its paragraph becomes an arrow call-to-action.
 * Options: image-left puts the media first on mobile; wide-image and wide-image-2
 * widen the media column; product-intro, alt and dark are layout/colour hooks.
 */
export default function decorate(block) {
  decorateVideoLinks(block);
  decorateIbmVideos(block);
  const rows = [...block.children];
  const maxCols = Math.max(1, ...rows.map((row) => row.children.length));
  block.classList.add(`columns-feature-${maxCols}-cols`);

  rows.forEach((row) => {
    row.classList.add('columns-feature-row');
    [...row.children].forEach((col) => {
      if (isMediaOnly(col)) {
        col.classList.add('columns-feature-media-col');
        return;
      }
      col.classList.add('columns-feature-text-col');
      decorateCtas(col, 'columns-feature');
      decorateCallout(col, 'columns-feature');
    });
  });
  optimizeImages(block);
}
