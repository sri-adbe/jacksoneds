/*
 * Static form helpers shared by form-like blocks (app-form, contact-form,
 * disclaimer-gate, forms-finder, list-filter, retirement-calculator).
 *
 * The source site's forms post to server-side apps that EDS cannot reproduce.
 * These helpers render authored field rows as real, accessible form controls
 * so the page reads correctly; submission is blocked and a notice is shown.
 *
 * Field row contract (one block row per field):
 *   label | type | options or placeholder/help text
 * Known types are listed in FIELD_TYPES. A label ending in "*" is required.
 * Any row whose second cell is not a known type is treated as rich content.
 */

import { toClassName } from './aem.js';

export const FIELD_TYPES = [
  'text', 'email', 'tel', 'number', 'password', 'date', 'search', 'url',
  'textarea', 'select', 'radio', 'checkbox', 'checkboxes', 'toggle',
  'submit', 'reset', 'button',
];

let fieldCounter = 0;

function cellText(cell) {
  return (cell?.textContent || '').trim();
}

/**
 * Returns the normalized field type for a row, or null when the row is content.
 * @param {Element} row
 */
export function getFieldType(row) {
  const cells = [...row.children];
  if (cells.length < 2) return null;
  const type = cellText(cells[1]).toLowerCase();
  return FIELD_TYPES.includes(type) ? type : null;
}

/**
 * Reads the options for select / radio / checkbox fields from a cell.
 * List items win; otherwise paragraphs, then newline or comma separated text.
 * @param {Element} cell
 */
export function readOptions(cell) {
  if (!cell) return [];
  const items = [...cell.querySelectorAll('li')].map((li) => li.textContent.trim());
  if (items.length) return items.filter(Boolean);
  const paras = [...cell.querySelectorAll('p')].map((p) => p.textContent.trim());
  if (paras.length > 1) return paras.filter(Boolean);
  return cellText(cell).split(/\n|,/).map((s) => s.trim()).filter(Boolean);
}

function makeChoice(kind, name, value, idBase, index, checked) {
  const wrap = document.createElement('label');
  wrap.className = `form-choice form-${kind}`;
  const input = document.createElement('input');
  input.type = kind;
  input.name = name;
  input.value = value;
  input.id = `${idBase}-${index}`;
  if (checked) input.checked = true;
  const span = document.createElement('span');
  span.textContent = value;
  wrap.append(input, span);
  return wrap;
}

/**
 * Builds one form field wrapper from a field row.
 * @param {Element} row
 * @param {string} type one of FIELD_TYPES
 * @returns {HTMLElement}
 */
export function buildField(row, type) {
  const cells = [...row.children];
  const rawLabel = cellText(cells[0]);
  const required = /\*\s*$/.test(rawLabel);
  const label = rawLabel.replace(/\s*\*\s*$/, '');
  const extra = cells[2];
  fieldCounter += 1;
  const name = toClassName(label) || `field-${fieldCounter}`;
  const id = `form-${name}-${fieldCounter}`;

  const field = document.createElement('div');
  field.className = `form-field form-field-${type}`;

  if (['submit', 'reset', 'button'].includes(type)) {
    const button = document.createElement('button');
    button.type = type === 'button' ? 'button' : type;
    button.className = `button form-${type}`;
    button.textContent = label || type;
    field.append(button);
    return field;
  }

  if (['radio', 'checkboxes'].includes(type)) {
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = label;
    fieldset.append(legend);
    const kind = type === 'radio' ? 'radio' : 'checkbox';
    readOptions(extra).forEach((opt, i) => {
      fieldset.append(makeChoice(kind, name, opt, id, i, kind === 'radio' && i === 0));
    });
    if (required) fieldset.dataset.required = 'true';
    field.append(fieldset);
    return field;
  }

  if (['checkbox', 'toggle'].includes(type)) {
    const wrap = document.createElement('label');
    wrap.className = `form-choice form-${type}`;
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = name;
    input.id = id;
    if (required) input.required = true;
    const span = document.createElement('span');
    // keep links in rich labels (e.g. "I agree to the terms")
    if (cells[0]) span.append(...cells[0].childNodes);
    else span.textContent = label;
    wrap.append(input, span);
    field.append(wrap);
    if (extra && cellText(extra)) {
      const help = document.createElement('div');
      help.className = 'form-help';
      help.append(...extra.childNodes);
      field.append(help);
    }
    return field;
  }

  const labelEl = document.createElement('label');
  labelEl.setAttribute('for', id);
  labelEl.textContent = label;
  if (required) labelEl.dataset.required = 'true';

  let control;
  if (type === 'textarea') {
    control = document.createElement('textarea');
    control.rows = 4;
  } else if (type === 'select') {
    control = document.createElement('select');
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = label;
    control.append(placeholder);
    readOptions(extra).forEach((opt) => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      control.append(option);
    });
  } else {
    control = document.createElement('input');
    control.type = type;
  }
  control.id = id;
  control.name = name;
  if (required) control.required = true;
  if (type !== 'select') control.placeholder = label;

  field.append(labelEl, control);

  if (type !== 'select' && extra && cellText(extra)) {
    const help = document.createElement('div');
    help.className = 'form-help';
    help.append(...extra.childNodes);
    field.append(help);
  }
  return field;
}

/**
 * Creates a <form> that never submits to a server and shows a notice instead.
 * @param {string} className
 * @param {string} [message]
 */
export function createStaticForm(className, message) {
  const form = document.createElement('form');
  form.className = className;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    let notice = form.querySelector('.form-notice');
    if (!notice) {
      notice = document.createElement('p');
      notice.className = 'form-notice';
      notice.setAttribute('role', 'status');
      form.append(notice);
    }
    notice.textContent = message
      || 'This form is not connected yet. Please contact us by phone or email.';
  });
  return form;
}

/**
 * Splits block rows into field rows and content rows, keeping order.
 * @param {Element} block
 * @returns {{row: Element, type: string|null}[]}
 */
export function classifyRows(block) {
  return [...block.children].map((row) => ({ row, type: getFieldType(row) }));
}

/**
 * Moves the content of a non-field row into a container element.
 * Multi-cell content rows keep one div per cell.
 * @param {Element} row
 * @param {string} className
 */
export function contentFromRow(row, className) {
  const div = document.createElement('div');
  div.className = className;
  const cells = [...row.children];
  if (cells.length === 1) {
    div.append(...cells[0].childNodes);
  } else {
    cells.forEach((cell) => div.append(cell));
  }
  return div;
}
