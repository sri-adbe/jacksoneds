import { createOptimizedPicture } from '../../scripts/aem.js';

const DESKTOP = window.matchMedia('(width >= 900px)');

function optimizeImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

/**
 * Location tiles: a horizontal row of office photo tiles; the open tile
 * widens to show its description and link (an accordion laid out sideways).
 *
 * One row per location, cells `photo | location name | description + link`.
 * The name may be the first paragraph or heading of the photo cell or of the
 * details cell. The first tile starts open; only one is open at a time.
 * On narrow screens the tiles stack vertically with every description shown.
 */
export default function decorate(block) {
  const list = document.createElement('div');
  list.className = 'location-tiles-list';
  const tiles = [];
  const uid = Math.random().toString(36).slice(2, 7);

  [...block.children].forEach((row, index) => {
    const cells = [...row.children].filter((c) => c.innerHTML.trim() !== '');
    if (!cells.length) return;

    const picture = row.querySelector('picture');
    const textCells = cells.filter((c) => c.textContent.trim());
    let nameEl = null;
    let detailsCell = null;
    if (textCells.length >= 2) {
      [nameEl, detailsCell] = textCells;
    } else if (textCells.length === 1) {
      [detailsCell] = textCells;
      nameEl = detailsCell.querySelector(':scope > h2, :scope > h3, :scope > h4, :scope > p');
    }
    const name = nameEl ? nameEl.textContent.trim() : `Location ${index + 1}`;
    if (nameEl && detailsCell && detailsCell.contains(nameEl)) nameEl.remove();

    const id = `location-tiles-${uid}-${index}`;
    const tile = document.createElement('div');
    tile.className = 'location-tiles-tile';

    const preview = document.createElement('div');
    preview.className = 'location-tiles-preview';
    if (picture) {
      const media = document.createElement('div');
      media.className = 'location-tiles-media';
      media.append(picture);
      preview.append(media);
    }
    const band = document.createElement('div');
    band.className = 'location-tiles-name';
    const label = document.createElement('p');
    label.id = `${id}-name`;
    label.textContent = name;
    band.append(label);
    preview.append(band);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'location-tiles-toggle';
    button.setAttribute('aria-labelledby', label.id);
    button.setAttribute('aria-controls', `${id}-details`);
    preview.append(button);

    const details = document.createElement('div');
    details.className = 'location-tiles-details';
    details.id = `${id}-details`;
    if (detailsCell) details.append(...detailsCell.childNodes);

    tile.append(preview, details);
    list.append(tile);
    tiles.push({ tile, button, details });
  });

  let current = 0;
  const render = () => {
    tiles.forEach(({ tile, button, details }, i) => {
      const on = i === current;
      tile.classList.toggle('location-tiles-open', on);
      button.setAttribute('aria-expanded', String(on));
      // collapsed descriptions are clipped (not removed) on desktop; keep them out of reach
      details.inert = DESKTOP.matches && !on;
    });
  };
  tiles.forEach(({ button }, i) => button.addEventListener('click', () => {
    current = i;
    render();
  }));
  DESKTOP.addEventListener('change', render);
  if (tiles.length) render();

  block.replaceChildren(list);
  optimizeImages(block);
}
