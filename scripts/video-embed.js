/*
 * Video embed helpers shared by blocks that carry video links
 * (embed-video, cards-video, columns-feature, contact-form, tabs).
 *
 * A paragraph whose only content is a link to a supported video
 * (YouTube, Vimeo, Brightcove, Vidyard, Wistia or a .mp4/.webm file)
 * becomes a lazily loaded player. An optional poster picture shows
 * a play button until clicked.
 */

const PROVIDERS = [
  {
    name: 'youtube',
    match: (u) => /(^|\.)youtube(-nocookie)?\.com$/.test(u.hostname) || u.hostname === 'youtu.be',
    src: (u, autoplay) => {
      let id = u.searchParams.get('v');
      if (u.hostname === 'youtu.be') [, id] = u.pathname.split('/');
      if (!id && u.pathname.startsWith('/embed/')) [, , id] = u.pathname.split('/');
      if (!id && u.pathname.startsWith('/shorts/')) [, , id] = u.pathname.split('/');
      if (!id) return null;
      return `https://www.youtube.com/embed/${encodeURIComponent(id)}?rel=0${autoplay ? '&autoplay=1&mute=1' : ''}`;
    },
  },
  {
    name: 'vimeo',
    match: (u) => /(^|\.)vimeo\.com$/.test(u.hostname),
    src: (u, autoplay) => {
      const id = u.pathname.split('/').filter(Boolean).find((p) => /^\d+$/.test(p));
      if (!id) return null;
      return `https://player.vimeo.com/video/${id}${autoplay ? '?autoplay=1&muted=1' : ''}`;
    },
  },
  {
    name: 'brightcove',
    match: (u) => /players\.brightcove\.net$/.test(u.hostname),
    src: (u, autoplay) => {
      if (autoplay) u.searchParams.set('autoplay', 'true');
      return u.href;
    },
  },
  {
    name: 'vidyard',
    match: (u) => /(^|\.)vidyard\.com$/.test(u.hostname),
    src: (u) => {
      const id = u.pathname.split('/').filter(Boolean).pop();
      return id ? `https://play.vidyard.com/${id}` : null;
    },
  },
  {
    name: 'wistia',
    match: (u) => /(^|\.)wistia\.(com|net)$/.test(u.hostname),
    src: (u) => {
      const id = u.pathname.split('/').filter(Boolean).pop();
      return id ? `https://fast.wistia.net/embed/iframe/${id}` : null;
    },
  },
];

const FILE_VIDEO = /\.(mp4|webm|m4v|mov)$/i;

/**
 * Returns true when the URL points to a video this helper can play.
 * @param {string} href
 */
export function isVideoUrl(href) {
  try {
    const url = new URL(href, window.location.href);
    return FILE_VIDEO.test(url.pathname) || PROVIDERS.some((p) => p.match(url));
  } catch (e) {
    return false;
  }
}

function buildPlayer(href, title, autoplay) {
  const url = new URL(href, window.location.href);
  const frame = document.createElement('div');
  frame.className = 'video-embed-frame';
  if (FILE_VIDEO.test(url.pathname)) {
    const video = document.createElement('video');
    video.controls = true;
    video.preload = autoplay ? 'auto' : 'none';
    video.playsInline = true;
    if (autoplay) video.autoplay = true;
    const source = document.createElement('source');
    source.src = url.href;
    const ext = url.pathname.split('.').pop().toLowerCase();
    source.type = `video/${ext === 'webm' ? 'webm' : 'mp4'}`;
    video.append(source);
    frame.append(video);
    return frame;
  }
  const provider = PROVIDERS.find((p) => p.match(url));
  const src = provider && provider.src(url, autoplay);
  if (!src) return null;
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.title = title || `Video from ${url.hostname}`;
  iframe.loading = 'lazy';
  iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
  iframe.allowFullscreen = true;
  frame.append(iframe);
  return frame;
}

/**
 * Turns one video link into a player.
 * @param {HTMLAnchorElement} link
 * @param {HTMLPictureElement|null} poster optional poster image
 * @returns {HTMLElement|null} the player wrapper
 */
export function createVideoEmbed(link, poster) {
  const { href } = link;
  const title = link.title || (link.textContent.trim() !== href ? link.textContent.trim() : '');
  const wrapper = document.createElement('div');
  wrapper.className = 'video-embed';

  if (poster) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'video-embed-play';
    button.setAttribute('aria-label', title ? `Play video: ${title}` : 'Play video');
    wrapper.classList.add('video-embed-has-poster');
    wrapper.append(poster, button);
    button.addEventListener('click', () => {
      const player = buildPlayer(href, title, true);
      if (player) wrapper.replaceChildren(player);
      wrapper.classList.remove('video-embed-has-poster');
    }, { once: true });
    return wrapper;
  }

  const load = () => {
    const player = buildPlayer(href, title, false);
    if (player) wrapper.replaceChildren(player);
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        load();
      }
    }, { rootMargin: '200px' });
    observer.observe(wrapper);
  } else {
    load();
  }
  return wrapper;
}

/**
 * Replaces every link-only paragraph that points at a video with a player.
 * A picture directly before the link (same paragraph or previous sibling)
 * becomes the poster.
 * @param {Element} root
 * @returns {HTMLElement[]} the created players
 */
export function decorateVideoLinks(root) {
  const players = [];
  root.querySelectorAll('a[href]').forEach((link) => {
    if (!isVideoUrl(link.href)) return;
    const holder = link.closest('p, li, div');
    if (!holder || holder.textContent.trim() !== link.textContent.trim()) return;
    let poster = holder.querySelector('picture');
    const prev = holder.previousElementSibling;
    if (!poster && prev && prev.matches('p') && prev.querySelector('picture') && !prev.textContent.trim()) {
      poster = prev.querySelector('picture');
      prev.remove();
    }
    const player = createVideoEmbed(link, poster);
    if (holder.matches('p, li')) holder.replaceWith(player);
    else link.replaceWith(player);
    players.push(player);
  });
  return players;
}
