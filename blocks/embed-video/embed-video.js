import { createOptimizedPicture } from '../../scripts/aem.js';
import { isVideoUrl, createVideoEmbed } from '../../scripts/video-embed.js';

function optimizeImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '1200' }]));
  });
}

function genericEmbed(href) {
  const wrapper = document.createElement('div');
  wrapper.className = 'video-embed';
  const frame = document.createElement('div');
  frame.className = 'video-embed-frame';
  const iframe = document.createElement('iframe');
  iframe.src = href;
  iframe.loading = 'lazy';
  iframe.title = `Content from ${new URL(href).hostname}`;
  iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
  iframe.allowFullscreen = true;
  frame.append(iframe);
  wrapper.append(frame);
  return wrapper;
}

/**
 * Standalone video player.
 * Content: the video link (YouTube, Vimeo, Brightcove player/playlist URL,
 * Vidyard, Wistia or a .mp4 file), an optional poster picture, and optional
 * caption text (title, description). Any other https link is embedded as an
 * iframe. Without a link the block keeps its authored content.
 */
export default function decorate(block) {
  const link = block.querySelector('a[href]');
  if (!link) return;
  const poster = block.querySelector('picture');
  const { href } = link;

  let player = null;
  if (isVideoUrl(href)) player = createVideoEmbed(link, poster);
  else if (/^https:/.test(href)) player = genericEmbed(href);
  if (!player) return;

  // remaining authored text (minus the link itself) becomes the caption
  const linkHolder = link.closest('p') || link;
  linkHolder.remove();
  const caption = document.createElement('div');
  caption.className = 'embed-video-caption';
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    [...cell.children].forEach((el) => {
      if (el.textContent.trim()) caption.append(el);
    });
    if (!cell.children.length && cell.textContent.trim()) caption.append(cell.textContent.trim());
  });

  const media = document.createElement('div');
  media.className = 'embed-video-player';
  media.append(player);
  block.replaceChildren(media);
  if (caption.textContent.trim()) block.append(caption);
  optimizeImages(block);
}
