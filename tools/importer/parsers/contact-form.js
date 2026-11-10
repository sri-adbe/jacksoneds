/* eslint-disable */
/* global WebImporter */

/**
 * Parser for contact-form.
 * Block rows (blocks/contact-form): content rows (heading, intro, links) then
 * field rows `label | type | options/help`; content rows after the last field
 * become the contact-details column.
 *
 * Source shapes handled:
 * - comparison-highlight-layout with a header + Marketo form  -> `contact-form (alt)`
 * - flexible-width-container (copy + IBM video, coloured bg)  -> `contact-form (red)`
 * - comparison-highlight-layout with accordion items + image  -> `contact-form`
 */

const NBSP_ONLY = /^[\s ]*$/;
const INPUT_TYPES = ['text', 'email', 'tel', 'number', 'password', 'date', 'search', 'url', 'checkbox', 'radio'];

function hasContent(el) {
  return !NBSP_ONLY.test(el.textContent || '') || !!el.querySelector('img, picture, iframe, video');
}

function controlType(ctrl) {
  const tag = ctrl.tagName.toLowerCase();
  if (tag === 'textarea') return 'textarea';
  if (tag === 'select') return 'select';
  if (tag === 'button') {
    const t = (ctrl.getAttribute('type') || 'submit').toLowerCase();
    return ['submit', 'reset'].includes(t) ? t : 'button';
  }
  const t = (ctrl.getAttribute('type') || 'text').toLowerCase();
  if (t === 'submit' || t === 'reset') return t;
  return INPUT_TYPES.includes(t) ? t : null;
}

function controlLabel(ctrl, form) {
  let text = '';
  const id = ctrl.getAttribute('id');
  if (id) {
    const label = [...form.querySelectorAll('label')].find((l) => l.getAttribute('for') === id);
    if (label) {
      const clone = label.cloneNode(true);
      clone.querySelectorAll('.mktoAsterix').forEach((a) => a.remove());
      text = clone.textContent.replace(/\s+/g, ' ').trim();
    }
  }
  if (!text && ctrl.closest('label')) text = ctrl.closest('label').textContent.replace(/\s+/g, ' ').trim();
  if (!text) text = (ctrl.getAttribute('placeholder') || '').trim();
  if (!text && ctrl.tagName.toLowerCase() === 'button') text = ctrl.textContent.trim();
  if (!text) text = (ctrl.getAttribute('value') || ctrl.getAttribute('name') || '').trim();
  return text;
}

/** Converts a source <form> into `label | type | options/help` rows plus inline content rows. */
function formRows(form, document) {
  const rows = [];
  const seenGroups = new Set();
  const nodes = form.querySelectorAll('input, select, textarea, button, .mktoCaptchaDisclaimer, .mktoHtmlText');
  nodes.forEach((ctrl) => {
    if (ctrl.closest('.g-recaptcha, .grecaptcha-badge')) return;
    if (ctrl.matches('.mktoCaptchaDisclaimer, .mktoHtmlText')) {
      if (!hasContent(ctrl)) return;
      const p = document.createElement('p');
      p.innerHTML = ctrl.innerHTML;
      rows.push([p]);
      return;
    }
    const type = controlType(ctrl);
    if (!type) return;
    if (type === 'radio' || type === 'checkbox') {
      const name = ctrl.getAttribute('name');
      const group = name ? [...form.querySelectorAll(`input[name="${name}"]`)] : [ctrl];
      if (group.length > 1) {
        if (seenGroups.has(name)) return;
        seenGroups.add(name);
        const ul = document.createElement('ul');
        group.forEach((g) => {
          const li = document.createElement('li');
          li.textContent = controlLabel(g, form);
          ul.append(li);
        });
        const fieldset = ctrl.closest('fieldset');
        const legend = fieldset && fieldset.querySelector('legend');
        rows.push([legend ? legend.textContent.trim() : name, type === 'radio' ? 'radio' : 'checkboxes', ul]);
        return;
      }
    }
    let label = controlLabel(ctrl, form);
    if (!label) return;
    const required = ctrl.hasAttribute('required')
      || ctrl.getAttribute('aria-required') === 'true'
      || ctrl.classList.contains('mktoRequired');
    if (required && !/\*\s*$/.test(label)) label = `${label} *`;
    let extra = '';
    if (type === 'select') {
      const ul = document.createElement('ul');
      [...ctrl.querySelectorAll('option')].forEach((o) => {
        const t = o.textContent.trim();
        if (!t || !o.getAttribute('value')) return;
        const li = document.createElement('li');
        li.textContent = t;
        ul.append(li);
      });
      if (ul.children.length) extra = ul;
    }
    rows.push([label, type, extra]);
  });
  return rows;
}

/** Flattens source markup into clean, authorable elements; forms become field-row markers. */
function collect(root, document, out) {
  [...root.childNodes].forEach((n) => {
    if (n.nodeType === 3) {
      const t = n.textContent.replace(/\s+/g, ' ').trim();
      if (t && !NBSP_ONLY.test(t)) {
        const p = document.createElement('p');
        p.textContent = t;
        out.push(p);
      }
      return;
    }
    if (n.nodeType !== 1) return;
    const tag = n.tagName.toLowerCase();
    if (['script', 'style', 'noscript', 'link', 'svg', 'template'].includes(tag)) return;
    if (tag === 'form') {
      out.push({ form: n });
      return;
    }
    if (/^h[1-6]$/.test(tag)) {
      if (NBSP_ONLY.test(n.textContent)) return;
      const h = document.createElement(tag);
      if (n.querySelector('div, p')) h.textContent = n.textContent.replace(/\s+/g, ' ').trim();
      else h.innerHTML = n.innerHTML;
      out.push(h);
      return;
    }
    if (['p', 'ul', 'ol', 'table', 'blockquote'].includes(tag)) {
      if (hasContent(n)) out.push(n.cloneNode(true));
      return;
    }
    if (tag === 'img' || tag === 'picture') {
      out.push(n.cloneNode(true));
      return;
    }
    if (tag === 'a') {
      if (!hasContent(n)) return;
      const p = document.createElement('p');
      p.append(n.cloneNode(true));
      out.push(p);
      return;
    }
    if (tag === 'iframe') {
      const src = n.getAttribute('src') || n.getAttribute('data-src');
      if (!src || n.closest('.g-recaptcha')) return;
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = src;
      a.textContent = src;
      p.append(a);
      out.push(p);
      return;
    }
    if (tag === 'button') {
      if (n.querySelector('h1, h2, h3, h4, h5, h6')) {
        collect(n, document, out);
      } else if (n.closest('.accordion-title') && !NBSP_ONLY.test(n.textContent)) {
        const h = document.createElement('h3');
        h.textContent = n.textContent.replace(/\s+/g, ' ').trim();
        out.push(h);
      }
      return;
    }
    if (['input', 'select', 'textarea', 'label'].includes(tag)) return;
    collect(n, document, out);
  });
  return out;
}

export default function parse(element, { document, params }) {
  let variant = null;
  if (element.querySelector('form, .marketo-form')) variant = 'alt';
  else if (element.matches('.flexible-width-container') || element.querySelector('.flexible-width-container__wrapper')) variant = 'red';

  const items = collect(element, document, []);
  const cells = [];
  let group = [];
  const flush = () => {
    if (group.length) cells.push([group]);
    group = [];
  };
  items.forEach((item) => {
    if (item && item.form) {
      flush();
      formRows(item.form, document).forEach((row) => cells.push(row));
    } else {
      group.push(item);
    }
  });
  flush();
  if (!cells.length) cells.push(['']);
  // drop source presentation attributes from the copied markup
  cells.flat(2).forEach((el) => {
    if (!el || typeof el === 'string' || !el.querySelectorAll) return;
    [el, ...el.querySelectorAll('*')].forEach((n) => {
      n.removeAttribute('style');
      n.removeAttribute('class');
      n.removeAttribute('id');
    });
  });

  const name = variant ? `contact-form (${variant})` : 'contact-form';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
