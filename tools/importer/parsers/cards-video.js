/* eslint-disable */
/* global WebImporter */

/**
 * cards-video parser.
 * Source shape (block-context/cards-video): comparison-highlight-layout with
 * .main-content / .secondary-content columns, each holding an .ibm-video iframe and an .rte text block.
 * Block rows: [video link (optional poster picture before it) | heading + text + CTA].
 */

function absolute(url) {
  if (!url) return '';
  try {
    return new URL(url.replace(/&amp;/g, '&'), 'https://www.jackson.com').href;
  } catch (e) {
    return url;
  }
}

function videoSrc(scope) {
  const iframe = scope.querySelector('iframe');
  if (iframe) {
    const s = iframe.getAttribute('src') || iframe.getAttribute('data-src');
    if (s) return s;
  }
  const source = scope.querySelector('video source[src], video[src]');
  if (source) return source.getAttribute('src');
  const vjs = scope.querySelector('video-js[data-video-id], video[data-video-id]');
  if (vjs && vjs.getAttribute('data-account')) {
    const player = vjs.getAttribute('data-player') || 'default';
    return `https://players.brightcove.net/${vjs.getAttribute('data-account')}/${player}_default/index.html?videoId=${vjs.getAttribute('data-video-id')}`;
  }
  return '';
}

function parseItem(document, item) {
  const media = [];
  const poster = item.querySelector('.video-container img, .ibm-video img, .poster img');
  if (poster) media.push(poster.closest('picture') || poster);
  const src = videoSrc(item);
  if (src) {
    const href = absolute(src);
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = href;
    p.append(a);
    media.push(p);
  }

  const body = [];
  const text = item.querySelector('.cmp-text') || item.querySelector('.rte');
  if (text) {
    [...text.children].forEach((child) => {
      if (/^H[1-6]$/.test(child.tagName)) {
        // drop leading <br> used for spacing in source headings
        child.querySelectorAll('br').forEach((br) => {
          if (!br.previousSibling || !br.previousSibling.textContent.trim()) br.remove();
        });
        child.innerHTML = child.innerHTML.trim();
        if (!child.textContent.trim()) return;
        const h = document.createElement('h3');
        h.innerHTML = child.innerHTML;
        body.push(h);
      } else if (child.textContent.trim() || child.querySelector('img')) {
        body.push(child);
      }
    });
  }
  return { media, body };
}

export default function parse(element, { document, params }) {
  let items = [...element.querySelectorAll('.main-content, .secondary-content, .tertiary-content')]
    .filter((c) => c.querySelector('iframe, video, video-js, .ibm-video'));
  if (!items.length) {
    // fallback: each video container with its following text
    items = [...element.querySelectorAll('.ibm-video, .video-container')]
      .filter((v) => !v.parentElement.closest('.ibm-video, .video-container'))
      .map((v) => v.parentElement);
    items = items.filter((v, i) => items.indexOf(v) === i);
  }

  const cells = items
    .map((it) => parseItem(document, it))
    .filter((it) => it.media.length || it.body.length)
    .map((it) => [it.media.length ? it.media : '', it.body.length ? it.body : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-video', cells });
  element.replaceWith(block);
}
