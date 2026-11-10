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

/**
 * Tabs: one row per tab, cells `tab label | panel content`.
 * - The label may include an icon. A label that is a link with no panel is a
 *   link tab (navigates instead of switching panels), for tab strips between
 *   pages or product suites.
 * - A panel holding only a bare link to a page path loads that page as a
 *   fragment, so a panel can hold other blocks.
 * - Arrow keys move between tabs; a URL hash matching a tab id opens it.
 */
export default async function decorate(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-section-list';
  tablist.setAttribute('role', 'tablist');
  const panels = [];
  const fragments = [];
  const usedIds = new Set();

  [...block.children].forEach((row) => {
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
      a.className = 'tabs-section-tab tabs-section-tab-link';
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
    panel.className = 'tabs-section-panel';
    panel.id = `tabpanel-${id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panelContent.forEach((cell) => panel.append(...cell.childNodes));
    const path = fragmentPath(panel);
    if (path) fragments.push({ panel, path });

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tabs-section-tab';
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
  if (!panels.length) block.classList.add('tabs-section-links-only');

  block.prepend(tablist);
  optimizeImages(block);

  await Promise.all(fragments.map(async ({ panel, path }) => {
    const fragment = await loadFragment(path);
    if (!fragment) return;
    panel.replaceChildren(...fragment.childNodes);
    panel.classList.add('tabs-section-panel-fragment');
  }));
}
