import { createOptimizedPicture } from '../../scripts/aem.js';
import { classifyRows, buildField } from '../../scripts/static-form.js';

function optimizeImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '900' }]));
  });
}

function isLinkOnly(el) {
  const links = [...el.querySelectorAll('a')];
  if (!links.length) return false;
  return links.map((a) => a.textContent).join('').replace(/\s+/g, '')
    === el.textContent.replace(/\s+/g, '');
}

/**
 * Disclaimer gate: a photo beside considerations copy, an acknowledgement
 * checkbox and a start button that stays disabled until the box is checked.
 *
 * Row 1: `image | heading + text + list + start link`.
 * Optional row: `I understand | checkbox` (created with that label when missing).
 * The last link-only paragraph is the gated start link.
 */
export default function decorate(block) {
  const media = document.createElement('div');
  media.className = 'disclaimer-gate-media';
  const content = document.createElement('div');
  content.className = 'disclaimer-gate-content';
  let checkboxField = null;

  classifyRows(block).forEach(({ row, type }) => {
    if (type === 'checkbox' || type === 'toggle') {
      checkboxField = buildField(row, 'checkbox');
      return;
    }
    if (type) {
      content.append(buildField(row, type));
      return;
    }
    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture') && !cell.textContent.trim() && !media.children.length) {
        media.append(...cell.childNodes);
      } else {
        const part = document.createElement('div');
        part.className = 'disclaimer-gate-copy';
        part.append(...cell.childNodes);
        content.append(part);
      }
    });
  });

  const ctas = [...content.querySelectorAll('p, div')].filter((el) => isLinkOnly(el) && el.querySelector('a'));
  const ctaHolder = ctas[ctas.length - 1];
  const gate = document.createElement('div');
  gate.className = 'disclaimer-gate-actions';

  if (!checkboxField) {
    const row = document.createElement('div');
    row.innerHTML = '<div>I understand</div><div>checkbox</div>';
    checkboxField = buildField(row, 'checkbox');
  }
  gate.append(checkboxField);

  const checkbox = checkboxField.querySelector('input[type="checkbox"]');
  if (ctaHolder) {
    const link = ctaHolder.querySelector('a');
    link.classList.add('button', 'disclaimer-gate-start');
    const setState = () => {
      const on = checkbox.checked;
      link.setAttribute('aria-disabled', String(!on));
      link.tabIndex = on ? 0 : -1;
      link.classList.toggle('disclaimer-gate-disabled', !on);
    };
    link.addEventListener('click', (e) => {
      if (!checkbox.checked) {
        e.preventDefault();
        checkbox.focus();
      }
    });
    checkbox.addEventListener('change', setState);
    setState();
    gate.append(link);
    ctaHolder.remove();
  }
  content.append(gate);

  const children = media.children.length ? [media, content] : [content];
  block.replaceChildren(...children);
  optimizeImages(block);
}
