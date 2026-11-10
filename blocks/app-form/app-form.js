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

/**
 * App form: a static rendering of an application form (login, registration,
 * account recovery, search, claim). The source posts to a server-side app,
 * so submission is blocked and a notice is shown instead.
 *
 * Rows: `label | type | options/help` become fields; any other row is
 * rich content (headings, instructions, links) kept in order. With the
 * `image` option a picture-only row becomes a media column beside the form.
 */
export default function decorate(block) {
  const form = createStaticForm('app-form-form');
  const actions = document.createElement('div');
  actions.className = 'app-form-actions';
  let media = null;

  classifyRows(block).forEach(({ row, type }) => {
    if (type) {
      const field = buildField(row, type);
      if (['submit', 'reset', 'button'].includes(type)) actions.append(field);
      else form.append(field);
      return;
    }
    const content = contentFromRow(row, 'app-form-content');
    if (!content.textContent.trim() && !content.querySelector('picture, img, iframe')) return;
    const imageOnly = content.querySelector('picture') && !content.textContent.trim();
    if (imageOnly && block.classList.contains('image') && !media) {
      media = content;
      media.className = 'app-form-media';
      return;
    }
    form.append(content);
  });

  if (actions.children.length) form.append(actions);

  const children = [form];
  if (media) children.unshift(media);
  block.replaceChildren(...children);
  optimizeImages(block);
}
