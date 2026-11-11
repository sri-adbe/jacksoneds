/* eslint-disable */
/* global WebImporter */

/**
 * Parser for retirement-calculator (catalog variant v_73cce7700691).
 * Block rows (blocks/retirement-calculator): content rows (heading, intro,
 * results header, launch link, optional <ol> step indicator) plus field rows
 * `label | type | options/help`.
 *
 * Cached source (catalog variant `red`): div.accordion.base-version whose
 * panel holds a "More articles" cta-list. Headings become their own row, link
 * lists become a list row. Any rendered <form> becomes field rows.
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
    if (n.matches && n.matches('.cta-list__links, .small-links')) {
      const links = [...n.querySelectorAll('a')].filter((a) => !NBSP_ONLY.test(a.textContent));
      if (links.length) {
        const ul = document.createElement('ul');
        links.forEach((a) => {
          const li = document.createElement('li');
          li.append(a.cloneNode(true));
          ul.append(li);
        });
        out.push(ul);
      }
      return;
    }
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
  // calculator journey (dash tools): the step buttons only repeat the step indicator
  if (element.matches('.journey-controls')) {
    element.remove();
    return;
  }
  let items;
  if (element.matches('.journey-nav')) {
    const ol = document.createElement('ol');
    element.querySelectorAll('.journey-step').forEach((step) => {
      const label = step.querySelector('.full-label') || step.querySelector('.label') || step;
      const text = label.textContent.replace(/\s+/g, ' ').trim();
      if (!text) return;
      const li = document.createElement('li');
      li.textContent = text;
      ol.append(li);
    });
    items = ol.children.length ? [ol] : [];
  } else {
    // info-icon help text sits in .tooltip spans inside trigger buttons, which collect() skips.
    // Lift each tooltip out (document order, no ancestor walking: the source nests <a> in
    // <button>, which browsers flatten) so its copy is kept as authored text.
    [...element.querySelectorAll('.tooltip')].forEach((tip) => {
      const trigger = tip.parentElement && tip.parentElement.closest('button');
      if (trigger && element.contains(trigger)) trigger.after(tip);
    });
    items = collect(element, document, []);
  }
  const cells = [];
  items.forEach((item) => {
    if (item && item.form) {
      formRows(item.form, document).forEach((row) => cells.push(row));
    } else if (/^H[1-6]$/.test(item.tagName)) {
      // a heading starts a new content row
      cells.push([[item]]);
    } else if (item.tagName === 'OL') {
      // an ordered list on its own row is the step indicator
      cells.push([item]);
    } else {
      const last = cells[cells.length - 1];
      // group following content into the current content row
      if (last && last.length === 1 && Array.isArray(last[0])) last[0].push(item);
      else cells.push([[item]]);
    }
  });
  if (!cells.length) cells.push(['']);
  cells.flat(2).forEach((el) => {
    if (!el || typeof el === 'string' || !el.querySelectorAll) return;
    [el, ...el.querySelectorAll('*')].forEach((n) => {
      n.removeAttribute('style');
      n.removeAttribute('class');
      n.removeAttribute('id');
    });
  });

  // the calculator journey is split across sibling containers (nav, header, content): merge
  // consecutive pieces into the previous retirement-calculator block
  const inJourney = !!element.closest('.rec-container');
  let prev = element.previousElementSibling;
  while (prev && !prev.textContent.trim() && !prev.querySelector('img')) prev = prev.previousElementSibling;
  if (inJourney && prev && prev.tagName === 'TABLE' && prev.dataset.excatCalculator === 'true') {
    const target = prev.querySelector('tbody') || prev;
    cells.forEach((row) => {
      const tr = document.createElement('tr');
      row.forEach((cell) => {
        const td = document.createElement('td');
        (Array.isArray(cell) ? cell : [cell]).forEach((c) => {
          if (c && typeof c !== 'string') td.append(c);
          else if (c) td.append(document.createTextNode(c));
        });
        tr.append(td);
      });
      target.append(tr);
    });
    element.remove();
    return;
  }
  if (!items.length && inJourney) {
    element.remove();
    return;
  }

  // every cached instance of this block is the catalog's `red` option
  const block = WebImporter.Blocks.createBlock(document, { name: 'retirement-calculator (red)', cells });
  if (inJourney && block.dataset) block.dataset.excatCalculator = 'true';
  element.replaceWith(block);
}
