/* eslint-disable */
/* global WebImporter */

/**
 * cards-article parser.
 * Source shapes (block-context/cards-article):
 *   - div.article-card (carousel cards: category, date, title, description, duration) -> cards-article
 *   - div.resource-listing > .resource (asset-type tag, date, h3, summary)            -> cards-article (image-magenta-shadow)
 * Block rows: [image | tag p, date p, h3 (linked), summary p, read time p].
 */

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function para(document, value) {
  const p = document.createElement('p');
  p.textContent = value;
  return p;
}

function richPara(document, src) {
  const p = document.createElement('p');
  p.innerHTML = src.innerHTML.trim();
  p.querySelectorAll('div, span').forEach((w) => w.replaceWith(...w.childNodes));
  return p;
}

function linkedHeading(document, titleSrc, href) {
  const h = document.createElement('h3');
  const inner = document.createElement('span');
  inner.innerHTML = titleSrc.innerHTML.trim();
  inner.querySelectorAll('div, span').forEach((w) => w.replaceWith(...w.childNodes));
  if (href) {
    const a = document.createElement('a');
    a.href = href;
    a.append(...inner.childNodes);
    h.append(a);
  } else {
    h.append(...inner.childNodes);
  }
  return h;
}

function imageOf(scope) {
  if (!scope) return null;
  const pic = scope.querySelector('picture');
  if (pic) return pic;
  const img = scope.querySelector('img');
  if (img) img.removeAttribute('title');
  return img;
}

function hrefOf(card) {
  const a = card.querySelector('a[href]');
  return a ? a.getAttribute('href') : '';
}

function parseArticleCard(document, card) {
  const body = [];
  const href = hrefOf(card);
  const tag = text(card.querySelector('.article-card__category'));
  if (tag) body.push(para(document, tag));
  const date = text(card.querySelector('.article-card__publish-date'));
  if (date) body.push(para(document, date));
  const title = card.querySelector('.article-card__title');
  if (title && text(title)) body.push(linkedHeading(document, title, href));
  const desc = card.querySelector('.article-card__description');
  if (desc && text(desc)) body.push(richPara(document, desc));
  const author = text(card.querySelector('.article-card__author'));
  if (author) body.push(para(document, author));
  const dur = text(card.querySelector('.article-card__duration'));
  if (dur) body.push(para(document, dur));
  return { image: imageOf(card.querySelector('.article-card__image') || card), body };
}

function parseResource(document, card) {
  const body = [];
  const href = hrefOf(card);
  const tag = text(card.querySelector('.asset-type'));
  if (tag) body.push(para(document, tag));
  const date = text(card.querySelector('.content .length, .length'));
  if (date) body.push(para(document, date));
  const content = card.querySelector('.content') || card;
  const title = content.querySelector('h1, h2, h3, h4, h5, h6');
  if (title && text(title)) body.push(linkedHeading(document, title, href));
  content.querySelectorAll(':scope > p').forEach((p) => {
    if (text(p)) body.push(richPara(document, p));
  });
  return { image: imageOf(card.querySelector('.imagery') || card), body };
}

export default function parse(element, { document, params }) {
  const root = element;
  let items = [];
  let variant = null;

  const articleCards = [...root.querySelectorAll('.article-card')]
    .filter((c) => c.querySelector('.article-card__title, .article-card__image'));
  const resources = [...root.querySelectorAll('.resource-listing')]
    .map((l) => l.querySelector('.base-resource') || l)
    .filter((c) => c.querySelector('h1, h2, h3, h4, img'));

  if (articleCards.length) {
    items = articleCards.map((c) => parseArticleCard(document, c));
  } else if (resources.length) {
    items = resources.map((c) => parseResource(document, c));
    variant = 'image-magenta-shadow';
  } else {
    items = [...root.querySelectorAll('.card, .resource')]
      .filter((c) => c.querySelector('h2, h3, h4'))
      .map((c) => parseResource(document, c));
  }

  items = items.filter((it) => it.image || it.body.length);
  const cells = items.map((it) => [it.image || '', it.body]);

  const name = variant ? `cards-article (${variant})` : 'cards-article';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
