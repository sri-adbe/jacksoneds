import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizeImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]));
  });
}

function isImageOnly(cell) {
  return cell.querySelector('picture, img') && cell.textContent.trim() === '';
}

/**
 * Each row is one tile: [logo image] | label | details.
 * The logo and label may share one cell. Rows without a details cell render
 * as static tiles (e.g. the category pill row).
 */
export default function decorate(block) {
  const list = document.createElement('div');
  list.className = 'accordion-manager-list';

  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((c) => c.innerHTML.trim() !== '');
    if (!cells.length) return;

    const media = cells.length > 1 && isImageOnly(cells[0]) ? cells.shift() : null;
    const label = cells.shift();
    const bodyCells = cells;

    const summaryContent = document.createElement('div');
    summaryContent.className = 'accordion-manager-item-label';
    if (media) {
      media.className = 'accordion-manager-item-image';
      summaryContent.append(media);
    }
    if (label) {
      const text = document.createElement('div');
      text.className = 'accordion-manager-item-title';
      text.append(...label.childNodes);
      summaryContent.append(text);
    }

    if (!bodyCells.length) {
      const item = document.createElement('div');
      item.className = 'accordion-manager-item accordion-manager-item-static';
      item.append(summaryContent);
      list.append(item);
      return;
    }

    const details = document.createElement('details');
    details.className = 'accordion-manager-item';
    const summary = document.createElement('summary');
    summary.append(summaryContent);
    const body = document.createElement('div');
    body.className = 'accordion-manager-item-body';
    bodyCells.forEach((cell) => body.append(...cell.childNodes));
    details.append(summary, body);
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      list.querySelectorAll('details[open]').forEach((other) => {
        if (other !== details) other.open = false;
      });
    });
    list.append(details);
  });

  block.replaceChildren(list);
  optimizeImages(block);
}
