/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-benefits (Jackson).
 * Block rows: one row, intro column (heading + text + CTA links) | benefits column
 * (benefits heading + bulleted list) or a photo.
 * Shapes handled:
 *  - .stat-spotlight (intro | stats-container); no section background -> light
 *  - .feature-50-50 (heading + list + links | photo, in source image order)
 */

function textOf(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function flattenInline(document, src, tag) {
  const h = document.createElement(tag);
  h.innerHTML = src.innerHTML;
  [...h.querySelectorAll('*')].forEach((d) => {
    const keep = d.matches('sup, sub, em, strong, b, i, br') || (d.matches('a') && d.getAttribute('href'));
    if (!keep) d.replaceWith(...d.childNodes);
  });
  h.innerHTML = h.innerHTML.replace(/\s+/g, ' ').replace(/&nbsp;/g, ' ').trim();
  return h;
}

function firstHeading(document, container) {
  if (!container) return null;
  const hs = [...container.querySelectorAll('h1, h2, h3, h4, h5, h6')].filter((h) => textOf(h));
  if (!hs.length) return null;
  return flattenInline(document, hs[0], hs[0].tagName.toLowerCase());
}

function richChildren(document, container) {
  const out = [];
  if (!container) return out;
  [...container.children].forEach((child) => {
    if (!textOf(child) && !child.querySelector('img')) return;
    child.removeAttribute('style');
    child.querySelectorAll('[style]').forEach((s) => s.removeAttribute('style'));
    child.innerHTML = child.innerHTML.replace(/(<br\s*\/?>\s*(&nbsp;| |\s)*)+$/i, '');
    out.push(child);
  });
  if (!out.length && textOf(container)) {
    const p = document.createElement('p');
    p.textContent = textOf(container);
    out.push(p);
  }
  return out;
}

function linkParas(document, links) {
  return links
    .filter((a) => a && a.getAttribute('href') && textOf(a))
    .map((a) => {
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = textOf(a);
      if (a.classList.contains('secondary-cta-button')) {
        const em = document.createElement('em');
        em.append(link);
        p.append(em);
      } else {
        const strong = document.createElement('strong');
        strong.append(link);
        p.append(strong);
      }
      return p;
    });
}

function parseStatSpotlight(document, spot) {
  const intro = [];
  const content = spot.querySelector('.stat-spotlight-content') || spot;
  const h = firstHeading(document, content);
  if (h) intro.push(h);
  intro.push(...richChildren(document, content.querySelector('.description')));
  intro.push(...linkParas(document, [...content.querySelectorAll('.action a')]));

  const benefits = [];
  const stats = spot.querySelector('.stats-container');
  if (stats) {
    const titleEl = stats.querySelector('.stat-title');
    const th = titleEl && (titleEl.querySelector('h1, h2, h3, h4, h5, h6') || titleEl);
    if (th && textOf(th)) {
      const tag = th.matches('h1, h2, h3, h4, h5, h6') ? th.tagName.toLowerCase() : 'h4';
      benefits.push(flattenInline(document, th, tag));
    }
    const ul = document.createElement('ul');
    const headers = [...stats.querySelectorAll('.stat-header')];
    headers.forEach((header) => {
      const li = document.createElement('li');
      // a stat whose header is a real heading (e.g. <h4>$338 billion</h4>) keeps that heading:
      // li > hN + p; plain headers stay li > strong + br + text
      const hSrc = [...header.querySelectorAll('h1, h2, h3, h4, h5, h6')].find((x) => textOf(x));
      if (hSrc) {
        const hEl = flattenInline(document, hSrc, hSrc.tagName === 'H1' ? 'h2' : hSrc.tagName.toLowerCase());
        hEl.querySelectorAll('b, strong').forEach((x) => x.replaceWith(...x.childNodes));
        hEl.querySelectorAll('sup, sub').forEach((x) => { if (!textOf(x)) x.remove(); });
        hEl.innerHTML = hEl.innerHTML.replace(/(&nbsp;|\s)+$/, '').replace(/^(&nbsp;|\s)+/, '');
        li.append(hEl);
        let d = header.nextElementSibling;
        if (d && !d.classList.contains('stat-description')) d = null;
        if (d && textOf(d)) {
          const para = flattenInline(document, d, 'p');
          para.querySelectorAll('b, strong').forEach((x) => x.replaceWith(...x.childNodes));
          li.append(para);
        }
        if (textOf(li)) ul.append(li);
        return;
      }
      const strong = flattenInline(document, header, 'strong');
      // drop nested <b> inside strong
      strong.querySelectorAll('b, strong').forEach((b) => b.replaceWith(...b.childNodes));
      strong.innerHTML = strong.innerHTML.replace(/(&nbsp;|\s)+$/, '').replace(/^(&nbsp;|\s)+/, '');
      if (textOf(strong)) li.append(strong);
      let desc = header.nextElementSibling;
      if (desc && !desc.classList.contains('stat-description')) desc = null;
      if (desc && textOf(desc)) {
        const span = flattenInline(document, desc, 'span');
        span.querySelectorAll('b, strong').forEach((b) => b.replaceWith(...b.childNodes));
        if (li.childNodes.length) li.append(document.createElement('br'));
        li.append(...span.childNodes);
      }
      if (textOf(li)) ul.append(li);
    });
    // descriptions without headers
    if (!headers.length) {
      stats.querySelectorAll('.stat-description').forEach((d) => {
        if (!textOf(d)) return;
        const li = document.createElement('li');
        li.append(...flattenInline(document, d, 'span').childNodes);
        ul.append(li);
      });
    }
    if (ul.children.length) benefits.push(ul);
  }
  return [intro.length ? intro : '', benefits.length ? benefits : ''];
}

function parseFeature(document, feature) {
  const text = [];
  const h = firstHeading(document, feature.querySelector('.feature-50-50__card') || feature);
  if (h) text.push(h);
  text.push(...richChildren(document, feature.querySelector('.feature-50-50__description')));
  text.push(...linkParas(document, [...feature.querySelectorAll('.feature-50-50__links a')]));
  const img = feature.querySelector('.feature-50-50__image img');
  const media = img && img.getAttribute('src') ? [img] : '';
  const content = feature.querySelector('.feature-50-50__content');
  const imageLeft = content && content.classList.contains('image-left');
  const textCell = text.length ? text : '';
  if (!media) return [textCell];
  return imageLeft ? [media, textCell] : [textCell, media];
}

export default function parse(element, { document, params }) {
  const cells = [];
  let variant = null;

  const spot = element.matches('.stat-spotlight') ? element : element.querySelector('.stat-spotlight');
  const feature = element.matches('.feature-50-50') ? element : element.querySelector('.feature-50-50');

  if (spot) {
    cells.push(parseStatSpotlight(document, spot));
    const contents = element.querySelector('.contents.bg-color') || spot.closest('.contents');
    const bg = contents ? (contents.getAttribute('style') || '') : '';
    const m = bg.match(/--bg-color:\s*([^;]*);/);
    if (contents && (!m || !m[1].trim())) variant = 'light';
  } else if (feature) {
    cells.push(parseFeature(document, feature));
  } else {
    const items = [...element.children].filter((c) => textOf(c) || c.querySelector('img'));
    if (items.length) cells.push(items.map((c) => [c]));
  }

  const name = variant ? `columns-benefits (${variant})` : 'columns-benefits';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
