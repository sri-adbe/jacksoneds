/* eslint-disable */
/* global WebImporter */

/**
 * hero-banner parser (jackson.com div.background-container with a spotlight box).
 * Block structure (blocks/hero-banner): row 1 = background picture, row 2 = content
 * cell (heading, text, CTA links). Background image comes from the inline <style>
 * rule (background: url(...)) or an inline style attribute.
 */
function findBackgroundUrl(element) {
  const urls = [];
  element.querySelectorAll('style').forEach((style) => {
    const m = style.textContent.match(/url\(\s*["']?([^"')]+)["']?\s*\)/i);
    if (m) urls.push(m[1]);
  });
  if (!urls.length) {
    const styled = [element, ...element.querySelectorAll('[style*="url("]')];
    styled.forEach((el) => {
      const m = (el.getAttribute('style') || '').match(/url\(\s*["']?([^"')]+)["']?\s*\)/i);
      if (m) urls.push(m[1]);
    });
  }
  if (!urls.length) return null;
  try {
    return new URL(urls[0], 'https://www.jackson.com').href;
  } catch (e) {
    return urls[0];
  }
}

export default function parse(element, { document, params }) {
  const cells = [];

  // background image row
  let picture = null;
  const bgUrl = findBackgroundUrl(element);
  if (bgUrl) {
    picture = document.createElement('img');
    picture.src = bgUrl;
    picture.alt = '';
  } else {
    const img = element.querySelector('img');
    if (img) picture = img.closest('picture') || img;
  }
  element.querySelectorAll('style').forEach((s) => s.remove());

  // content row
  const wrapper = element.querySelector('.spotlight-wrapper, .spotlight-block, .spotlight') || element;
  const content = [];
  const heading = wrapper.querySelector('h1, h2, h3, h4');
  if (heading) {
    const h = document.createElement(heading.tagName.toLowerCase());
    h.textContent = heading.textContent.trim();
    content.push(h);
  }
  const header = wrapper.querySelector('.header') || wrapper;
  [...header.querySelectorAll('p, ul, ol')]
    .filter((el) => el.textContent.trim() && !el.closest('.title') && !el.closest('.action')
      && !(el.parentElement && el.parentElement.closest('p, ul, ol') && header.contains(el.parentElement.closest('p, ul, ol'))))
    .forEach((el) => content.push(el));

  const actionRoot = wrapper.querySelector('.action') || wrapper;
  [...actionRoot.querySelectorAll('a[href]')]
    .filter((a) => a.textContent.trim() && !content.some((c) => c.contains(a)))
    .forEach((a) => {
      const p = document.createElement('p');
      a.removeAttribute('class');
      p.append(a);
      content.push(p);
    });

  if (picture) cells.push([picture]);
  cells.push([content]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
