import { classifyRows, buildField, contentFromRow } from '../../scripts/static-form.js';

/**
 * Forms finder: keyword search and dropdown filters over an authored list
 * of forms. The source queries a server-side forms library; here filtering
 * runs client-side over the list items (or table rows) authored in the block.
 *
 * Field rows (`label | type | options`): a text/search field is the keyword
 * box, select fields are filters (an item matches when its text contains the
 * chosen option), submit/reset buttons run or clear the search.
 * Content rows hold the forms list: a list of links or a table, one form per
 * item/row. Other content rows (intro, notes) are kept in order.
 */
export default function decorate(block) {
  const form = document.createElement('form');
  form.className = 'forms-finder-form';
  form.setAttribute('role', 'search');
  const actions = document.createElement('div');
  actions.className = 'forms-finder-actions';
  const results = document.createElement('div');
  results.className = 'forms-finder-results';
  const leading = [];

  classifyRows(block).forEach(({ row, type }) => {
    if (type) {
      const field = buildField(row, type);
      if (['submit', 'reset', 'button'].includes(type)) actions.append(field);
      else form.append(field);
      return;
    }
    const content = contentFromRow(row, 'forms-finder-content');
    if (!content.innerHTML.trim()) return;
    if (content.querySelector('li, tr')) results.append(content);
    else if (!results.children.length) leading.push(content);
    else results.append(content);
  });
  if (actions.children.length) form.append(actions);

  const items = [...results.querySelectorAll('li, tbody tr, table tr:not(:first-child)')]
    .filter((el, i, arr) => arr.indexOf(el) === i);
  const status = document.createElement('p');
  status.className = 'forms-finder-status';
  status.setAttribute('role', 'status');

  const apply = () => {
    const keyword = (form.querySelector('input[type="search"], input[type="text"]')?.value || '').trim().toLowerCase();
    // a select value only filters when some item mentions it ("10 per page" does not)
    const texts = items.map((item) => item.textContent.toLowerCase());
    const filters = [...form.querySelectorAll('select')]
      .map((s) => s.value.toLowerCase())
      .filter((f) => f && texts.some((t) => t.includes(f)));
    let shown = 0;
    items.forEach((item, i) => {
      const text = texts[i];
      const match = (!keyword || text.includes(keyword)) && filters.every((f) => text.includes(f));
      item.hidden = !match;
      if (match) shown += 1;
    });
    status.textContent = items.length ? `${shown} of ${items.length} forms` : '';
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    apply();
  });
  form.addEventListener('reset', () => setTimeout(apply));
  form.addEventListener('change', (e) => {
    if (e.target.matches('select')) apply();
  });

  const children = [...leading];
  if (form.children.length) children.push(form);
  if (items.length) children.push(status);
  if (results.children.length) children.push(results);
  block.replaceChildren(...children);
  apply();
}
