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
    // Title (heading) of the content row; trademark superscripts are kept
    const h = document.createElement(heading.tagName.toLowerCase());
    h.innerHTML = heading.innerHTML.trim();
    [...h.querySelectorAll('*')].forEach((d) => { if (!d.matches('sup, sub')) d.replaceWith(...d.childNodes); });
    h.innerHTML = h.innerHTML.replace(/\s+/g, ' ').trim();
    if (!h.textContent.trim()) h.textContent = heading.textContent.trim();
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

  // Hero convention: optional background-image row (only when the source has an image;
  // instances have 1 or 2 direct children), then one content row (title, text, CTA).
  if (picture) cells.push([picture]);
  cells.push([content]);

  // Optional variant: FP product headers colour the text box with an inline --content-color.
  // Catalog looks are blue, orange, grey and cyan; other hues get descriptive names.
  const COLOR_OPTIONS = {
    '#3b455b': 'blue', '#c1c72b': 'orange', '#b2b4be': 'grey', '#8aced3': 'cyan',
    '#474546': 'charcoal', '#995d7a': 'mauve', '#a8d7af': 'green', '#fa9e73': 'peach',
  };
  const box = element.querySelector('.product-header__content[style]');
  const m = box && (box.getAttribute('style') || '').match(/--content-color:\s*(#[0-9a-f]{6})/i);
  const option = m ? COLOR_OPTIONS[m[1].toLowerCase()] : null;
  const block = WebImporter.Blocks.createBlock(document, { name: option ? `hero-banner (${option})` : 'hero-banner', cells });
  element.replaceWith(block);
}
