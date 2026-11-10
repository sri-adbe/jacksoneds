import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  classifyRows, buildField, createStaticForm, contentFromRow,
} from '../../scripts/static-form.js';

function optimizeImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

let panelCounter = 0;

function buildSteps(ol) {
  const nav = document.createElement('nav');
  nav.className = 'retirement-calculator-steps';
  nav.setAttribute('aria-label', 'Calculator steps');
  const items = [...ol.children];
  const current = items.find((li) => li.querySelector('strong, b')) || items[0];
  if (current) current.setAttribute('aria-current', 'step');
  nav.append(ol);
  return nav;
}

/**
 * Retirement calculator: a static rendering of the interactive retirement
 * expense calculator (the source runs it as a server-backed app).
 *
 * Field rows (`label | type | options/help`) are the calculator inputs.
 * A content row that is just an ordered list becomes the step indicator;
 * the item in bold (or the first) is the current step. Other content rows
 * (heading, intro, results header, launch link) are kept in order: before
 * the first field they lead the block, after it they sit inside the form.
 * Without field rows the block renders just its content, e.g. a
 * "Start the calculator" launch button.
 */
export default function decorate(block) {
  const rows = classifyRows(block);
  const form = createStaticForm(
    'retirement-calculator-form',
    'The calculator is not available here yet. Please contact your financial professional.',
  );
  const actions = document.createElement('div');
  actions.className = 'retirement-calculator-actions';
  const lead = document.createElement('div');
  lead.className = 'retirement-calculator-lead';
  let seenField = false;

  rows.forEach(({ row, type }) => {
    if (type) {
      seenField = true;
      const field = buildField(row, type);
      if (['submit', 'reset', 'button'].includes(type)) actions.append(field);
      else form.append(field);
      return;
    }
    const content = contentFromRow(row, 'retirement-calculator-content');
    if (!content.innerHTML.trim()) return;
    const ol = content.querySelector(':scope > ol');
    const part = ol && content.children.length === 1 ? buildSteps(ol) : content;
    (seenField ? form : lead).append(part);
  });

  if (actions.children.length) form.append(actions);

  // No fields, content opening with a heading: collapsible panel (source accordion)
  const first = lead.firstElementChild;
  const heading = first?.firstElementChild;
  if (!seenField && heading?.matches('h1, h2, h3, h4, h5, h6')
    && (first.children.length > 1 || lead.children.length > 1)) {
    panelCounter += 1;
    const panel = document.createElement('div');
    panel.className = 'retirement-calculator-panel';
    const body = document.createElement('div');
    body.className = 'retirement-calculator-panel-body';
    body.id = `retirement-calculator-panel-${panelCounter}`;
    body.hidden = true;
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'retirement-calculator-panel-trigger';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', body.id);
    trigger.append(heading);
    body.append(...lead.children);
    trigger.addEventListener('click', () => {
      const open = trigger.getAttribute('aria-expanded') !== 'true';
      trigger.setAttribute('aria-expanded', String(open));
      body.hidden = !open;
    });
    panel.append(trigger, body);
    block.replaceChildren(panel);
    optimizeImages(block);
    return;
  }

  const children = [];
  if (lead.children.length) children.push(lead);
  if (seenField) children.push(form);
  block.replaceChildren(...children);
  optimizeImages(block);
}
