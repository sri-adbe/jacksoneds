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
 * IBM Video (video.ibm.com/embed/...) is the source's player and is not one of
 * the shared video-embed providers: link-only paragraphs become an iframe.
 * @param {Element} root
 */
function embedIbmVideos(root) {
  root.querySelectorAll('a[href*="video.ibm.com/embed/"]').forEach((link) => {
    const holder = link.closest('p, li');
    if (!holder || holder.textContent.trim() !== link.textContent.trim()) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'video-embed';
    const frame = document.createElement('div');
    frame.className = 'video-embed-frame';
    const iframe = document.createElement('iframe');
    iframe.src = link.href;
    iframe.title = link.title && link.title !== link.href ? link.title : 'Video';
    iframe.loading = 'lazy';
    iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    iframe.allowFullscreen = true;
    frame.append(iframe);
    wrapper.append(frame);
    holder.replaceWith(wrapper);
  });
}

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

  // without a form, a video in the intro becomes its own column (copy beside video)
  const media = document.createElement('div');
  media.className = 'contact-form-media';
  if (hasIntro && !hasForm) {
    embedIbmVideos(intro);
    decorateVideoLinks(intro);
    media.append(...intro.querySelectorAll('.video-embed'));
    intro.querySelectorAll('.contact-form-content').forEach((c) => {
      if (!c.children.length && !c.textContent.trim()) c.remove();
    });
  }
  const hasMedia = media.children.length > 0;

  const columns = [];
  if (hasIntro && hasAside) {
    // intro sits above the form; contact details form the second column
    main.append(intro, form);
    columns.push(main, aside);
  } else {
    if (intro.children.length) columns.push(intro);
    if (hasMedia) columns.push(media);
    if (hasForm) columns.push(form);
    if (hasAside) columns.push(aside);
  }
  const inner = document.createElement('div');
  inner.className = 'contact-form-inner';
  inner.append(...columns);
  block.replaceChildren(inner);
  block.classList.add(`contact-form-${columns.length}-cols`);
  if (!hasForm) block.classList.add('contact-form-no-fields');
  if (hasMedia) block.classList.add('contact-form-has-media');
  embedIbmVideos(block);
  decorateVideoLinks(block);
  optimizeImages(block);
}
