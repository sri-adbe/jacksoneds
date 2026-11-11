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
  if (!text && ctrl.getAttribute('aria-describedby')) {
    const ref = ctrl.getAttribute('aria-describedby').split(/\s+/)[0];
    const el = [...form.querySelectorAll('[id]')].find((n) => n.getAttribute('id') === ref);
    if (el) text = el.textContent.replace(/\s+/g, ' ').trim();
  }
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
    if (ctrl.closest('.g-recaptcha, .grecaptcha-badge') || /recaptcha/i.test(ctrl.getAttribute('name') || ctrl.getAttribute('id') || '')) return;
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

/*
 * JSF/PrimeFaces app forms (.xhtml: registration, sign-in, account recovery, claims). Walk the form
 * in document order so headings, instructions and help-link lists stay in place as rich rows (one
 * cell) between the field rows. Any part may be absent:
 * - h1-h6 -> heading row; p / text-only div -> paragraph row; ul/ol or div.column of links -> link
 *   list row (links without href, e.g. JS-only video triggers, are dropped)
 * - radio/checkbox groups: label from the visible prompt (.userSelection own text, legend), else
 *   the group's first label
 * - hidden inputs, JSF messages and PrimeFaces hidden-accessible focus inputs are skipped
 */
function ownText(el) {
  return [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ')
    .replace(/\s+/g, ' ').trim();
}

function linkListRow(document, links) {
  const ul = document.createElement('ul');
  links.forEach((src) => {
    const href = src.getAttribute('href');
    const t = src.textContent.replace(/\s+/g, ' ').trim();
    if (!href || href === '#' || !t) return;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = t;
    li.append(a);
    ul.append(li);
  });
  return ul.children.length ? [[ul]] : [];
}

function jsfRows(form, document) {
  const rows = [];
  // source heading levels are kept; an h1 inside the form stays h1 only when it is the page's
  // first h1 (one h1 per page), otherwise it becomes h2
  const firstH1 = document.querySelector('h1');
  const seenGroups = new Set();
  // PrimeFaces wraps native radios/checkboxes/selects in .ui-helper-hidden-accessible; only skip
  // that wrapper when it holds nothing but the widget's focus input
  const skip = (el) => el.matches('script, style, noscript, .ui-messages, [style*="display: none"], [style*="display:none"], .visible-xs, .guide-mobile-navigator, .guide-header-bar-wrapper, .sr-only')
    || (el.matches('.ui-helper-hidden-accessible') && !el.querySelector('input[type="radio"], input[type="checkbox"], select'));
  const visit = (el) => {
    if (skip(el)) return;
    const tag = el.tagName.toLowerCase();
    if (/^h[1-6]$/.test(tag)) {
      const t = el.textContent.replace(/\s+/g, ' ').trim();
      if (t) {
        const h = document.createElement(tag === 'h1' && el !== firstH1 ? 'h2' : tag);
        h.textContent = t;
        rows.push([h]);
      }
      return;
    }
    if (tag === 'p') {
      if (el.textContent.trim()) {
        const p = document.createElement('p');
        p.innerHTML = el.innerHTML;
        p.querySelectorAll('[class], [id], [style]').forEach((n) => {
          n.removeAttribute('class'); n.removeAttribute('id'); n.removeAttribute('style');
        });
        rows.push([p]);
      }
      return;
    }
    // AEM adaptive form wizard: step navigator -> ordered steps list (the internal error step is
    // dropped); panel descriptions -> step headings
    // (JSF/PrimeFaces wizards use ul.ui-wizard-step-titles with the whole step title in the li)
    if (el.matches('ol.wizard-navigators, ul.wizard-navigators, ul.ui-wizard-step-titles')) {
      const ol = document.createElement('ol');
      const whole = el.matches('.ui-wizard-step-titles');
      [...el.children].forEach((li) => {
        if (li.matches('.hidden')) return;
        const label = (whole ? li : (li.querySelector('a, span') || li)).textContent.replace(/\s+/g, ' ').trim();
        if (!label || /^error page$/i.test(label)) return;
        const item = document.createElement('li');
        item.textContent = label;
        ol.append(item);
      });
      if (ol.children.length) rows.push([ol]);
      return;
    }
    if ((tag === 'ul' || tag === 'ol' || el.matches('div.column')) && !el.querySelector('input, select, textarea, button')
      && el.querySelector('a')) {
      rows.push(...linkListRow(document, [...el.querySelectorAll('a')]));
      return;
    }
    if (el.matches('input, select, textarea, button')) {
      const type = controlType(el);
      if (!type || /_focus$/.test(el.getAttribute('id') || '')) return;
      if (type === 'radio' || type === 'checkbox') {
        const name = el.getAttribute('name');
        const group = name ? [...form.querySelectorAll('input')].filter((i) => i.getAttribute('name') === name) : [el];
        if (group.length > 1) {
          if (seenGroups.has(name)) return;
          seenGroups.add(name);
          const ul = document.createElement('ul');
          group.forEach((g) => {
            const li = document.createElement('li');
            li.textContent = controlLabel(g, form);
            ul.append(li);
          });
          const prompt = el.closest('.userSelection, fieldset');
          let label = prompt ? (prompt.matches('fieldset') ? (prompt.querySelector('legend')?.textContent || '') : ownText(prompt)) : '';
          if (!label.trim()) {
            const node = el.closest('.guideFieldNode');
            const fl = node ? node.querySelector('.guideFieldLabel') : null;
            if (fl) label = fl.textContent;
          }
          // a heading directly inside the group's panel ("I want to") also labels the group; the
          // heading row stays (source heading kept; the block hides the duplicate legend)
          if (!label.trim()) {
            const panel = el.closest('table') ? el.closest('table').parentElement : null;
            const h = panel ? [...panel.children].find((c) => /^H[1-6]$/.test(c.tagName)) : null;
            if (h) label = h.textContent;
          }
          label = label.replace(/:\s*$/, '').trim() || controlLabel(group[0], form);
          rows.push([label, type === 'radio' ? 'radio' : 'checkboxes', ul]);
          return;
        }
      }
      let label = controlLabel(el, form);
      if (!label) return;
      if (el.hasAttribute('required') && !/\*\s*$/.test(label)) label = `${label} *`;
      let extra = type === 'select' ? optionList(el, document) : helpText(el, document);
      // JSF help text sits beside the control in the same li (e.g. "Do not check if this is a
      // public or shared device.")
      if (!extra && type !== 'submit' && type !== 'reset') {
        const li = el.closest('li');
        if (li) {
          const clone = li.cloneNode(true);
          clone.querySelectorAll('label, input, select, textarea, button, .ui-message, script').forEach((n) => n.remove());
          const t = clone.textContent.replace(/\s+/g, ' ').trim();
          if (t) extra = document.createTextNode(t);
        }
      }
      rows.push([label, type, extra]);
      return;
    }
    // labels are read through their controls
    if (tag === 'label') return;
    if (el.matches('.guidePanelDescription')) {
      const t = el.textContent.replace(/\s+/g, ' ').trim();
      if (t) {
        const h = document.createElement('h3');
        h.textContent = t;
        rows.push([h]);
      }
      return;
    }
    // button-styled links (a.primaryButton / a.secondaryButton) are form actions when they run in
    // the app (no real URL), otherwise links; other standalone links become a link row
    if (tag === 'a') {
      const t = el.textContent.replace(/\s+/g, ' ').trim();
      const href = el.getAttribute('href');
      if (!t) return;
      if (/Button/.test(el.className || '') && (!href || href === '#' || /^javascript:/i.test(href))) {
        rows.push([t, /secondary/i.test(el.className) || /cancel/i.test(t) ? 'reset' : 'submit', '']);
        return;
      }
      rows.push(...linkListRow(document, [el]).map(([ul]) => {
        const p = document.createElement('p');
        p.append(ul.querySelector('a'));
        return [p];
      }));
      return;
    }
    // text-only leaf containers (instructions without a <p>)
    if (tag === 'div' && !el.children.length && el.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = el.textContent.replace(/\s+/g, ' ').trim();
      rows.push([p]);
      return;
    }
    [...el.children].forEach(visit);
  };
  [...form.children].forEach(visit);
  return rows;
}

export default function parse(element, { document, params }) {
  // embedded live-data tools (performance centers) are replaced by a link to the live app; check
  // this first, because the tool is itself a JSF form
  if (element.matches('.legacy-component') || element.querySelector('#legacyUrl')
    || element.closest('.legacy-component')) {
    parseLegacy(element.closest('.legacy-component') || element, document);
    return;
  }
  // the catalog may claim only a piece of a JSF form (its field list): parse the whole form once
  const jsfForm = element.matches('form') ? element : (element.querySelector('form') || element.closest('form'));
  const isAppForm = jsfForm && (jsfForm.querySelector('input[name="javax.faces.ViewState"]')
    || jsfForm.matches('#guideContainerForm') || jsfForm.closest('.guideContainer'));
  if (isAppForm) {
    const rows = jsfRows(jsfForm, document);
    // content around the form inside the claimed element (e.g. a heading before <form>) stays as
    // default content before the block
    if (!rows.length) {
      element.remove();
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: 'app-form', cells: rows });
    if (element === jsfForm || element.contains(jsfForm)) {
      if (element === jsfForm) element.replaceWith(block);
      else jsfForm.replaceWith(block);
    } else {
      jsfForm.replaceWith(block); // claimed piece sat inside the form
    }
    return;
  }
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
