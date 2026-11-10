/* eslint-disable */
/* global WebImporter */

/**
 * hero-page parser (jackson.com div.herospace).
 * Block structure (blocks/hero-page): one row, two cells — text cell (h1 title,
 * optional intro, optional CTA) and picture cell. Picture cell left empty when
 * the source has no image.
 */
export default function parse(element, { document, params }) {
  const root = element.querySelector('.subpage-herospace-block') || element;
  const content = root.querySelector('.card-content') || root;

  const textCell = [];
  let title = content.querySelector('h1, h2, .title');
  if (title) {
    if (!/^H[1-6]$/.test(title.tagName)) {
      const h1 = document.createElement('h1');
      h1.textContent = title.textContent.trim();
      title = h1;
    } else {
      title.textContent = title.textContent.trim();
    }
    textCell.push(title);
  }

  const desc = content.querySelector('.description');
  if (desc && desc.textContent.trim()) {
    const blocks = [...desc.querySelectorAll(':scope > p, :scope > ul, :scope > ol')];
    if (blocks.length) {
      textCell.push(...blocks);
    } else {
      const p = document.createElement('p');
      p.innerHTML = desc.innerHTML;
      textCell.push(p);
    }
  }

  // optional CTA links in the content area (outside the description)
  [...content.querySelectorAll('a[href]')]
    .filter((a) => !(desc && desc.contains(a)) && a.textContent.trim())
    .forEach((a) => {
      const p = document.createElement('p');
      p.append(a);
      textCell.push(p);
    });

  const imageCell = [];
  const img = root.querySelector('.image img, picture img, img');
  if (img) imageCell.push(img.closest('picture') || img);

  const cells = [[textCell, imageCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-page', cells });
  element.replaceWith(block);
}
