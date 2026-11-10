import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizeImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }]));
  });
}

/**
 * Location tiles: a horizontal row of office photo tiles; the open tile
 * widens to show its description and link (an accordion laid out sideways).
 *
 * One row per location, cells `photo | location name | description + link`.
 * The name may be the first paragraph or heading of the photo cell or of the
 * details cell. The first tile starts open; only one is open at a time.
 * On narrow screens the tiles stack vertically.
 */
export default function decorate(block) {
  const list = document.createElement('div');
  list.className = 'location-tiles-list';
  const tiles = [];

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

    const tile = document.createElement('div');
    tile.className = 'location-tiles-tile';
    const id = `location-tiles-${index}-${Math.random().toString(36).slice(2, 7)}`;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'location-tiles-toggle';
    button.setAttribute('aria-controls', id);
    if (picture) {
      const media = document.createElement('span');
      media.className = 'location-tiles-media';
      media.append(picture);
      button.append(media);
    }
    const label = document.createElement('span');
    label.className = 'location-tiles-name';
    label.textContent = name;
    button.append(label);

    const details = document.createElement('div');
    details.className = 'location-tiles-details';
    details.id = id;
    if (detailsCell) details.append(...detailsCell.childNodes);

    tile.append(button, details);
    list.append(tile);
    tiles.push({ tile, button, details });
  });

  const open = (index) => {
    tiles.forEach(({ tile, button, details }, i) => {
      const on = i === index;
      tile.classList.toggle('location-tiles-open', on);
      button.setAttribute('aria-expanded', String(on));
      details.hidden = !on;
    });
  };
  tiles.forEach(({ button }, i) => button.addEventListener('click', () => open(i)));
  if (tiles.length) open(0);

  block.replaceChildren(list);
  optimizeImages(block);
}
