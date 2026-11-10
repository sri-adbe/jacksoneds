/* eslint-disable */
/* global WebImporter */

/**
 * Parser for app-form.
 * Block rows (blocks/app-form): one row per field `label | type | options/help`
 * (label ends with * when required); any other row is rich content kept in order.
 *
 * Source shapes handled (instances disagree on the repeating unit, so each shape has its own path):
 * - div.form > form (AEM core form components, e.g. accessibility feedback): repeating unit is the
 *   field / <option>                                                          -> `app-form` field rows
 * - div.legacy-component (server-rendered JSF performance tool with live, daily-generated data):
 *   repeating units are <link> stylesheet tags, <script>s and data-table rows -> paragraph linking
 *   to the live tool (the data changes daily, so it is not frozen as static content)
 */

const INPUT_TYPES = ['text', 'email', 'tel', 'number', 'password', 'date', 'search', 'url', 'checkbox', 'radio'];

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
    if (label) text = label.textContent.replace(/\s+/g, ' ').trim();
  }
  if (!text && ctrl.closest('label')) text = ctrl.closest('label').textContent.replace(/\s+/g, ' ').trim();
  if (!text) text = (ctrl.getAttribute('placeholder') || ctrl.getAttribute('aria-label') || '').trim();
  if (!text && ctrl.tagName.toLowerCase() === 'button') text = ctrl.textContent.replace(/\s+/g, ' ').trim();
  if (!text) text = (ctrl.getAttribute('value') || ctrl.getAttribute('name') || '').trim();
  return text;
}

function helpText(ctrl, document) {
  const field = ctrl.closest('.field, .cmp-form-text, .cmp-form-options');
  const help = field && field.querySelector('.cmp-form-text__help-block, .help-block');
  const t = help ? help.textContent.replace(/\s+/g, ' ').trim() : '';
  return t ? document.createTextNode(t) : '';
}

function optionList(select, document) {
  const ul = document.createElement('ul');
  [...select.querySelectorAll('option')].forEach((o) => {
    const t = o.textContent.trim();
    if (!t || !o.getAttribute('value')) return;
    const li = document.createElement('li');
    li.textContent = t;
    ul.append(li);
  });
  return ul.children.length ? ul : '';
}

function formRows(form, document) {
  const rows = [];
  const seenGroups = new Set();
  form.querySelectorAll('input, select, textarea, button').forEach((ctrl) => {
    if (ctrl.closest('.g-recaptcha, .grecaptcha-badge')) return;
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
        const legend = ctrl.closest('fieldset')?.querySelector('legend');
        rows.push([legend ? legend.textContent.trim() : name, type === 'radio' ? 'radio' : 'checkboxes', ul]);
        return;
      }
    }
    let label = controlLabel(ctrl, form);
    if (!label) return;
    if (ctrl.hasAttribute('required') && !/\*\s*$/.test(label)) label = `${label} *`;
    const extra = type === 'select' ? optionList(ctrl, document) : helpText(ctrl, document);
    rows.push([label, type, extra]);
  });
  return rows;
}

function parseLegacy(element, document) {
  // stylesheet <link>s and scripts of the embedded app are not content
  element.querySelectorAll('link, script, style, noscript').forEach((n) => n.remove());
  const legacy = element.querySelector('#legacyUrl');
  const path = legacy && legacy.getAttribute('value');
  if (!path) {
    element.remove();
    return;
  }
  const href = /^https?:/.test(path) ? path : `https://www.jackson.com${path}`;
  const p = document.createElement('p');
  const a = document.createElement('a');
  a.href = href;
  a.textContent = 'View daily performance data';
  p.append(a);
  element.replaceWith(p);
}

export default function parse(element, { document, params }) {
  if (element.matches('.legacy-component') || element.querySelector('#legacyUrl')) {
    parseLegacy(element, document);
    return;
  }
  const form = element.matches('form') ? element : element.querySelector('form');
  if (!form) {
    element.remove();
    return;
  }
  const rows = formRows(form, document);
  if (!rows.length) {
    element.remove();
    return;
  }
  const block = WebImporter.Blocks.createBlock(document, { name: 'app-form', cells: rows });
  element.replaceWith(block);
}
