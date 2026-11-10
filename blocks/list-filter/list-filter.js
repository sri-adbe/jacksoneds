import { toClassName } from '../../scripts/aem.js';

/**
 * List filter: checkbox chips (or a year select) that filter the listing
 * that follows the block. The source filters server-side; here items are
 * filtered client-side by text.
 *
 * Content: an optional heading/label, then the filter values as a list,
 * paragraphs or one per row. "All" (or "All categories") clears the filter.
 * With 8+ values, or when every value is a year, a select is rendered
 * instead of chips.
 *
 * Target: the next block in the same section, else the first block of the
 * next section. Items are its top-level list items, else table rows, else
 * its rows. An item matches when its text (or data-tags) contains any
 * selected value.
 */
const ALL = /^all\b/i;
const YEAR = /^\d{4}$/;

function readValues(block) {
  const values = [];
  let label = null;
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const heading = cell.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading && !label) label = heading.textContent.trim();
    const lis = [...cell.querySelectorAll('li')];
    const parts = lis.length ? lis : [...cell.querySelectorAll('p')];
    if (parts.length) parts.forEach((p) => values.push(p.textContent.trim()));
    else if (!heading && cell.textContent.trim()) values.push(cell.textContent.trim());
  });
  return { label, values: values.filter(Boolean) };
}

function findTarget(block) {
  const wrapper = block.parentElement;
  let next = wrapper ? wrapper.nextElementSibling : null;
  while (next && !next.querySelector('.block')) next = next.nextElementSibling;
  if (next) return next.querySelector('.block');
  const section = block.closest('.section');
  let nextSection = section ? section.nextElementSibling : null;
  while (nextSection && !nextSection.querySelector('.block')) {
    nextSection = nextSection.nextElementSibling;
  }
  return nextSection ? nextSection.querySelector('.block') : null;
}

function targetItems(target) {
  if (!target) return [];
  const topItems = target.querySelectorAll(':scope > ul > li');
  if (topItems.length) return [...topItems];
  const rows = target.querySelectorAll('tbody tr');
  if (rows.length) return [...rows];
  return [...target.children];
}

function buildSelect(form, id, label, allValue, options) {
  const lab = document.createElement('label');
  lab.setAttribute('for', id);
  lab.textContent = label || 'Filter';
  const select = document.createElement('select');
  select.id = id;
  const any = document.createElement('option');
  any.value = '';
  any.textContent = allValue || 'All';
  select.append(any);
  options.forEach((v) => {
    const o = document.createElement('option');
    o.value = v;
    o.textContent = v;
    select.append(o);
  });
  form.append(lab, select);
}

function buildChips(form, id, label, allValue, options) {
  const fieldset = document.createElement('fieldset');
  if (label) {
    const legend = document.createElement('legend');
    legend.textContent = label;
    fieldset.append(legend);
  } else {
    fieldset.setAttribute('aria-label', 'Filter');
  }
  if (allValue) {
    const all = document.createElement('button');
    all.type = 'button';
    all.className = 'list-filter-chip list-filter-all';
    all.textContent = allValue;
    all.setAttribute('aria-pressed', 'true');
    fieldset.append(all);
  }
  const group = document.createElement('div');
  group.className = 'list-filter-options';
  options.forEach((v, i) => {
    const chip = document.createElement('div');
    chip.className = 'list-filter-chip';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = v;
    input.id = `${id}-${i}`;
    const text = document.createElement('label');
    text.setAttribute('for', input.id);
    text.textContent = v;
    chip.append(input, text);
    group.append(chip);
  });
  fieldset.append(group);
  form.append(fieldset);
}

export default function decorate(block) {
  const { label, values } = readValues(block);
  const allValue = values.find((v) => ALL.test(v));
  const options = values.filter((v) => !ALL.test(v));
  const useSelect = options.length >= 8
    || (options.length > 0 && options.every((v) => YEAR.test(v)));

  const form = document.createElement('form');
  form.className = 'list-filter-form';
  form.addEventListener('submit', (e) => e.preventDefault());
  const id = `list-filter-${toClassName(label || 'filter')}`;

  if (useSelect) buildSelect(form, id, label, allValue, options);
  else buildChips(form, id, label, allValue, options);

  const status = document.createElement('p');
  status.className = 'list-filter-status';
  status.setAttribute('role', 'status');
  form.append(status);
  block.replaceChildren(form);

  const apply = () => {
    const selected = useSelect
      ? [form.querySelector('select').value].filter(Boolean)
      : [...form.querySelectorAll('input:checked')].map((i) => i.value);
    const allBtn = form.querySelector('.list-filter-all');
    if (allBtn) allBtn.setAttribute('aria-pressed', String(!selected.length));
    const items = targetItems(findTarget(block));
    let shown = 0;
    items.forEach((item) => {
      const text = `${item.dataset.tags || ''} ${item.textContent}`.toLowerCase();
      const match = !selected.length || selected.some((v) => text.includes(v.toLowerCase()));
      item.hidden = !match;
      if (match) shown += 1;
    });
    status.textContent = items.length && selected.length ? `Showing ${shown} of ${items.length}` : '';
  };

  form.addEventListener('change', apply);
  const allBtn = form.querySelector('.list-filter-all');
  if (allBtn) {
    allBtn.addEventListener('click', () => {
      form.querySelectorAll('input:checked').forEach((i) => { i.checked = false; });
      apply();
    });
  }
}
