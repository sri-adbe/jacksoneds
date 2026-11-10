/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-sidebar (Jackson).
 * Block rows: one row, main article content | sidebar.
 * Source: div.aside-layout > .main-content (.header sections, optional leading .herospace)
 *         + aside.secondary-content (.cta-list items with heading, text and link list).
 * A leading page hero (.herospace, or a block table already produced from it) is moved
 * before the block so it stays a page-top hero instead of nesting inside the column.
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
  h.innerHTML = h.innerHTML.replace(/\s+/g, ' ').trim();
  return h;
}

function headingIn(document, container, fallbackTag) {
  if (!container) return null;
  const h = container.querySelector('h1, h2, h3, h4, h5, h6');
  const src = h || container;
  if (!textOf(src)) return null;
  return flattenInline(document, src, h ? h.tagName.toLowerCase() : fallbackTag);
}

function richChildren(document, container) {
  const out = [];
  if (!container) return out;
  [...container.children].forEach((child) => {
    if (!textOf(child) && !child.querySelector('img')) return;
    child.removeAttribute('style');
    child.querySelectorAll('[style]').forEach((s) => s.removeAttribute('style'));
    // empty anchors and trailing <br>&nbsp;
    child.querySelectorAll('a:not([href])').forEach((a) => a.replaceWith(...a.childNodes));
    child.innerHTML = child.innerHTML.replace(/(<br\s*\/?>\s*(&nbsp;| |\s)*)+$/i, '');
    out.push(child);
  });
  if (!out.length && textOf(container)) {
    const p = document.createElement('p');
    p.textContent = textOf(container);
    out.push(p);
  }
  return out;
}

function cleanLink(document, a) {
  const link = document.createElement('a');
  link.href = a.getAttribute('href');
  link.textContent = textOf(a);
  return link;
}

function validLinks(container, selector) {
  if (!container) return [];
  return [...container.querySelectorAll(selector)].filter((a) => a.getAttribute('href') && textOf(a));
}

function linkParas(document, links) {
  return links.map((a) => {
    const p = document.createElement('p');
    p.append(cleanLink(document, a));
    return p;
  });
}

function linkList(document, links) {
  if (!links.length) return [];
  if (links.length === 1) return linkParas(document, links);
  const ul = document.createElement('ul');
  links.forEach((a) => {
    const li = document.createElement('li');
    li.append(cleanLink(document, a));
    ul.append(li);
  });
  return [ul];
}

const COMPONENTS = '.header, .cta-list, .rte, .image, .text';

function extractComponent(document, comp, sidebar) {
  const out = [];
  if (comp.matches('.header')) {
    const h = headingIn(document, comp.querySelector('.title'), 'h2');
    if (h) out.push(h);
    out.push(...richChildren(document, comp.querySelector('.description')));
    const links = validLinks(comp, '.small-links a');
    out.push(...(sidebar ? linkList(document, links) : linkParas(document, links)));
  } else if (comp.matches('.cta-list')) {
    const h = headingIn(document, comp.querySelector('.cta-list__header'), sidebar ? 'h4' : 'h3');
    if (h) out.push(h);
    out.push(...richChildren(document, comp.querySelector('.cta-list__description')));
    const links = validLinks(comp, '.customContent a, .cta-list__links a');
    out.push(...(sidebar ? linkList(document, links) : linkParas(document, links)));
  } else if (comp.matches('.rte, .text')) {
    out.push(...richChildren(document, comp.querySelector('.cmp-text') || comp));
  } else if (comp.matches('.image')) {
    const img = comp.querySelector('img');
    if (img && img.getAttribute('src')) out.push(img);
  }
  return out;
}

function extractColumn(document, col, sidebar) {
  if (!col) return [];
  const comps = [...col.querySelectorAll(COMPONENTS)]
    .filter((c) => !c.closest('.herospace'))
    .filter((c, i, all) => !all.some((o) => o !== c && o.contains(c)));
  if (comps.length) return comps.flatMap((c) => extractComponent(document, c, sidebar));
  // fallback: plain semantic content
  const out = [];
  col.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, table, img').forEach((n) => {
    if (n.parentElement.closest('p, ul, ol, table, h1, h2, h3, h4, h5, h6')) return;
    if (n.matches('img') || textOf(n)) out.push(n);
  });
  return out;
}

export default function parse(element, { document, params }) {
  const cells = [];
  const main = element.querySelector('.main-content') || element.querySelector(':scope > .content-area > div:not(aside)');
  const aside = element.querySelector('aside, .secondary-content');

  // hoist the page hero (raw or already converted) out of the main column
  const hoist = [];
  if (main) {
    main.querySelectorAll('.herospace').forEach((h) => hoist.push(h));
    [...main.querySelectorAll('table')].forEach((t) => {
      const head = t.querySelector('tr');
      if (head && /hero/i.test(textOf(head)) && !hoist.some((h) => h.contains(t))) hoist.push(t);
    });
  }
  hoist.forEach((h) => element.before(h));

  const mainCell = extractColumn(document, main, false);
  const asideCell = extractColumn(document, aside, true);
  if (mainCell.length || asideCell.length) {
    cells.push([mainCell.length ? mainCell : '', asideCell.length ? asideCell : '']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-sidebar', cells });
  element.replaceWith(block);
}
