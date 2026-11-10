import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  classifyRows, buildField, createStaticForm, contentFromRow,
} from '../../scripts/static-form.js';
import { decorateVideoLinks } from '../../scripts/video-embed.js';

function optimizeImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

const BUTTON_TYPES = ['submit', 'reset', 'button'];

/**
 * Contact form: intro copy beside a lead-capture form, optionally with a
 * contact-details column.
 *
 * Rows `label | type | options/help` are form fields (see scripts/static-form.js).
 * Content rows before the first field are the intro; content rows after the
 * last field are the contact-details aside; content rows between fields stay
 * inside the form (e.g. "All fields are required").
 * The source posts to a CRM; submission is blocked and a notice is shown.
 */
export default function decorate(block) {
  const rows = classifyRows(block);
  const firstField = rows.findIndex((r) => r.type);
  const lastField = rows.map((r) => !!r.type).lastIndexOf(true);

  const intro = document.createElement('div');
  intro.className = 'contact-form-intro';
  const aside = document.createElement('div');
  aside.className = 'contact-form-aside';
  const form = createStaticForm(
    'contact-form-form',
    'Thank you. This form is not connected yet; please call or email us using the details on this page.',
  );
  const actions = document.createElement('div');
  actions.className = 'contact-form-actions';

  rows.forEach(({ row, type }, i) => {
    if (type) {
      const field = buildField(row, type);
      (BUTTON_TYPES.includes(type) ? actions : form).append(field);
      return;
    }
    const content = contentFromRow(row, 'contact-form-content');
    if (!content.innerHTML.trim()) return;
    if (firstField === -1 || i < firstField) intro.append(content);
    else if (i > lastField) aside.append(content);
    else form.append(content);
  });
  if (actions.children.length) form.append(actions);

  const main = document.createElement('div');
  main.className = 'contact-form-main';
  const hasIntro = intro.children.length > 0;
  const hasAside = aside.children.length > 0;
  const hasForm = form.children.length > 0;

  const columns = [];
  if (hasIntro && hasAside) {
    // intro sits above the form; contact details form the second column
    main.append(intro, form);
    columns.push(main, aside);
  } else {
    if (hasIntro) columns.push(intro);
    if (hasForm) columns.push(form);
    if (hasAside) columns.push(aside);
  }
  block.replaceChildren(...columns);
  block.classList.add(`contact-form-${columns.length}-cols`);
  if (!hasForm) block.classList.add('contact-form-no-fields');
  decorateVideoLinks(block);
  optimizeImages(block);
}
