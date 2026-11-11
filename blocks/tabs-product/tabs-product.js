import { createOptimizedPicture, toClassName } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function optimizeImages(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '900' }]));
  });
}

/**
 * Returns the fragment path when a panel holds only a bare same-site link
 * (link text equals its URL). Links under /fragments/ are left alone: the
 * page's auto-blocking already swaps those for the fragment content.
 */
function fragmentPath(panel) {
  const links = panel.querySelectorAll('a[href]');
  if (links.length !== 1) return null;
  const link = links[0];
  if (panel.textContent.trim() !== link.textContent.trim()) return null;
  if (link.textContent.trim() !== link.getAttribute('href').trim()
    && link.textContent.trim() !== link.href) return null;
  const url = new URL(link.href, window.location.href);
  const sameSite = url.origin === window.location.origin
    || /\.aem\.(page|live)$/.test(url.hostname);
  if (!sameSite || url.pathname.includes('/fragments/')) return null;
  return url.pathname.replace(/\.(plain\.)?html$/, '');
}

/* a picture plus copy in a panel becomes a hero-style media + box layout */
function decoratePanel(panel) {
  const pics = [...panel.children].filter((el) => el.matches('p')
    && el.querySelector('picture') && !el.textContent.trim());
  if (pics.length !== 1 || panel.children.length < 2) return;
  const media = document.createElement('div');
  media.className = 'tabs-product-panel-media';
  media.append(pics[0]);
  const body = document.createElement('div');
  body.className = 'tabs-product-panel-body';
  body.append(...panel.childNodes);
  panel.append(media, body);
  panel.classList.add('tabs-product-panel-hero');
}

/**
 * A fragment panel that opens with a lone picture then a heading gets the same
 * photo + text box layout: the heading and the paragraphs right after it (up to
 * the next heading or picture) go in the box.
 */
function decorateFragmentHero(panel) {
  if (panel.querySelector('.tabs-product-panel-hero')) return true;
  const wrapper = panel.querySelector(':scope > .section:first-child > .default-content-wrapper:first-child');
  const pic = wrapper && wrapper.firstElementChild;
  if (!pic || !pic.matches('p') || !pic.querySelector('picture') || pic.textContent.trim()) return false;
  const heading = pic.nextElementSibling;
  if (!heading || !/^H[1-3]$/.test(heading.tagName)) return false;
  const copy = [heading];
  let next = heading.nextElementSibling;
  while (next && next.matches('p') && !next.querySelector('picture')) {
    copy.push(next);
    next = next.nextElementSibling;
  }
  const hero = document.createElement('div');
  hero.className = 'tabs-product-panel-hero tabs-product-panel-hero-fragment';
  const media = document.createElement('div');
  media.className = 'tabs-product-panel-media';
  media.append(pic);
  const body = document.createElement('div');
  body.className = 'tabs-product-panel-body';
  body.append(...copy);
  hero.append(media, body);
  wrapper.prepend(hero);
  return true;
}

/* page auto-blocking may swap /fragments/ links for their content after decoration */
function watchFragmentHero(panel) {
  if (decorateFragmentHero(panel) || !panel.querySelector('a[href*="/fragments/"]')) return;
  const observer = new MutationObserver(() => {
    if (decorateFragmentHero(panel)) observer.disconnect();
  });
  observer.observe(panel, { childList: true, subtree: true });
}

/**
 * Product page shell: product title, then a tab strip over the product hero.
 * An optional first row with a single cell holding a heading is the title.
 * Then one row per tab, cells `tab label | panel content`.
 * - A panel with one picture plus copy renders as a photo with a text box.
 * - The label may include an icon. A label that is a link with no panel is a
 *   link tab (navigates instead of switching panels), for tab strips between
 *   pages or product suites.
 * - A panel holding only a bare link to a page path loads that page as a
 *   fragment, so a panel can hold other blocks.
 * - Arrow keys move between tabs; a URL hash matching a tab id opens it.
 */
export default async function decorate(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-product-list';
  tablist.setAttribute('role', 'tablist');
  const panels = [];
  const fragments = [];
  const usedIds = new Set();
  let title = null;

  const rows = [...block.children];
  const firstCells = rows[0] ? [...rows[0].children].filter((c) => c.innerHTML.trim() !== '') : [];
  if (firstCells.length === 1 && firstCells[0].querySelector('h1, h2')
    && !firstCells[0].querySelector('a')) {
    title = document.createElement('div');
    title.className = 'tabs-product-title';
    title.append(...firstCells[0].childNodes);
    rows.shift().remove();
  }

  rows.forEach((row) => {
    const [labelCell, ...rest] = [...row.children];
    if (!labelCell || !labelCell.textContent.trim()) {
      row.remove();
      return;
    }
    let id = toClassName(labelCell.textContent) || 'tab';
    while (usedIds.has(id)) id = `${id}-${usedIds.size}`;
    usedIds.add(id);

    const panelContent = rest.filter((c) => c.innerHTML.trim() !== '');
    const labelLink = labelCell.querySelector('a[href]');
    if (!panelContent.length && labelLink) {
      const a = document.createElement('a');
      a.href = labelLink.href;
      a.className = 'tabs-product-tab tabs-product-tab-link';
      a.append(...labelLink.childNodes);
      labelCell.querySelectorAll('picture').forEach((pic) => a.prepend(pic));
      if (labelLink.href.split('#')[0] === window.location.href.split('#')[0]) {
        a.setAttribute('aria-current', 'page');
      }
      tablist.append(a);
      row.remove();
      return;
    }

    const panel = document.createElement('div');
    panel.className = 'tabs-product-panel';
    panel.id = `tabpanel-${id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panelContent.forEach((cell) => panel.append(...cell.childNodes));
    const path = fragmentPath(panel);
    if (path) fragments.push({ panel, path });
    else if (panel.querySelector(':scope > .section')
      || panel.querySelector(':scope > a[href*="/fragments/"], :scope > p > a[href*="/fragments/"]')) watchFragmentHero(panel);
    else decoratePanel(panel);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tabs-product-tab';
    button.id = `tab-${id}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', panel.id);
    const label = labelCell.querySelector(':scope > p:only-child') || labelCell;
    button.append(...label.childNodes);

    tablist.append(button);
    panels.push({ button, panel });
    row.replaceWith(panel);
  });

  const select = (index, focus = false) => {
    panels.forEach(({ button, panel }, i) => {
      const on = i === index;
      button.setAttribute('aria-selected', String(on));
      button.tabIndex = on ? 0 : -1;
      panel.hidden = !on;
      panel.setAttribute('aria-hidden', String(!on));
    });
    if (focus && panels[index]) panels[index].button.focus();
  };

  panels.forEach(({ button }, i) => {
    button.addEventListener('click', () => select(i));
    button.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowRight') next = (i + 1) % panels.length;
      if (e.key === 'ArrowLeft') next = (i - 1 + panels.length) % panels.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = panels.length - 1;
      if (next !== null) {
        e.preventDefault();
        select(next, true);
      }
    });
  });

  const hashIndex = panels.findIndex(({ button, panel }) => window.location.hash
    && [`#${button.id}`, `#${panel.id}`, `#${button.id.replace(/^tab-/, '')}`].includes(window.location.hash));
  if (panels.length) select(hashIndex >= 0 ? hashIndex : 0);
  if (!panels.length) block.classList.add('tabs-product-links-only');

  block.prepend(tablist);
  if (title) block.prepend(title);
  optimizeImages(block);

  await Promise.all(fragments.map(async ({ panel, path }) => {
    const fragment = await loadFragment(path);
    if (!fragment) return;
    panel.replaceChildren(...fragment.childNodes);
    panel.classList.add('tabs-product-panel-fragment');
    decorateFragmentHero(panel);
  }));
}
