/* eslint-disable */
/* global WebImporter */

/**
 * Parser for disclaimer-gate.
 * Block rows (blocks/disclaimer-gate):
 *   row 1: image | heading + text + list + start link
 *   row 2: `I understand | checkbox`
 * Source: div.understanding-feature (.feature-understanding__*).
 */

const NBSP_ONLY = /^[\s ]*$/;

function clean(el) {
  [el, ...el.querySelectorAll('*')].forEach((n) => {
    n.removeAttribute('style');
    n.removeAttribute('class');
    n.removeAttribute('id');
  });
  return el;
}

export default function parse(element, { document, params }) {
  const img = element.querySelector('.feature-understanding__image img, img');
  const imageCell = img ? clean(img.cloneNode(true)) : '';

  const content = [];
  const titleWrap = element.querySelector('.feature-understanding__title');
  const heading = titleWrap
    ? titleWrap.querySelector('h1, h2, h3, h4, h5, h6')
    : element.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    content.push(clean(heading.cloneNode(true)));
  } else if (titleWrap && !NBSP_ONLY.test(titleWrap.textContent)) {
    const h = document.createElement('h2');
    h.textContent = titleWrap.textContent.trim();
    content.push(h);
  }

  const desc = element.querySelector('.feature-understanding__description');
  if (desc) {
    const parts = [...desc.children].filter((c) => !NBSP_ONLY.test(c.textContent) || c.querySelector('img'));
    if (parts.length) parts.forEach((c) => content.push(clean(c.cloneNode(true))));
    else if (!NBSP_ONLY.test(desc.textContent)) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      content.push(p);
    }
  }

  // Start link(s): source renders a disabled <a> without href until the box is checked.
  const links = [...element.querySelectorAll('.feature-understanding__links a, .feature-understanding__link a')];
  links.forEach((a) => {
    const text = a.textContent.replace(/\s+/g, ' ').trim();
    if (!text) return;
    const link = document.createElement('a');
    link.href = a.getAttribute('href') || a.getAttribute('data-href') || '#';
    link.textContent = text;
    const p = document.createElement('p');
    p.append(link);
    content.push(p);
  });

  const cells = [[imageCell, content.length ? content : '']];

  const checkboxLabel = element.querySelector('.feature-understanding__checkbox-item label, input[type="checkbox"] + label');
  const labelText = checkboxLabel ? checkboxLabel.textContent.replace(/\s+/g, ' ').trim() : '';
  cells.push([labelText || 'I understand', 'checkbox']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'disclaimer-gate', cells });
  element.replaceWith(block);
}
