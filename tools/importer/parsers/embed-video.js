/* eslint-disable */
/* global WebImporter */

/**
 * embed-video parser (jackson.com IBM video playlists and external iframes).
 * Block structure (blocks/embed-video): one cell holding the video/embed URL as a
 * link, optional poster picture, optional caption text.
 */
function absolute(url) {
  if (!url) return '';
  try {
    return new URL(url.replace(/&amp;/g, '&'), 'https://www.jackson.com').href;
  } catch (e) {
    return url;
  }
}

export default function parse(element, { document, params }) {
  const content = [];

  let src = '';
  const iframe = element.querySelector('iframe');
  if (iframe) src = iframe.getAttribute('src') || iframe.getAttribute('data-src') || '';
  if (!src) {
    const video = element.querySelector('video source[src], video[src]');
    if (video) src = video.getAttribute('src');
  }
  if (!src) {
    const vjs = element.querySelector('video-js[data-video-id], video[data-video-id]');
    if (vjs) {
      const account = vjs.getAttribute('data-account');
      const player = vjs.getAttribute('data-player') || 'default';
      const id = vjs.getAttribute('data-video-id');
      if (account && id) src = `https://players.brightcove.net/${account}/${player}_default/index.html?videoId=${id}`;
    }
  }
  if (!src) {
    const a = element.querySelector('a[href]');
    if (a) src = a.getAttribute('href');
  }

  const poster = element.querySelector('img');
  if (poster) content.push(poster.closest('picture') || poster);

  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading && heading.textContent.trim()) content.push(heading);

  if (src) {
    const href = absolute(src);
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = href;
    p.append(a);
    content.push(p);
  }

  const cells = [[content]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-video', cells });
  element.replaceWith(block);
}
