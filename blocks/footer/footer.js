// Footer: reads all copy, links and images from the footer fragment (footer.plain.html) and
// lays it out as a main band (link columns, divider, legal row with social icons) and a
// notice band (badge, notice box, disclosures, address). Nothing site-specific is hardcoded.

/**
 * Fetches the footer fragment. Metadata-independent dual fetch: /content first (local preview),
 * then the site root (Document Authoring / Edge Delivery).
 * @returns {Promise<{html: string, base: string}|null>}
 */
async function fetchFooter() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  return { html: await resp.text(), base: resp.url };
}

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

/**
 * Rewrites relative image sources so they resolve against the fragment URL.
 * @param {Element} root container
 * @param {string} base fragment URL
 */
function resolveImages(root, base) {
  root.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !/^(https?:|data:|\/)/.test(src)) img.src = new URL(src, base).href;
    img.loading = 'lazy';
  });
}

/** True when every link in the element wraps only an image (icon or logo list). */
function isImageLinkList(node) {
  const links = [...node.querySelectorAll('a')];
  return links.length > 0 && links.every((a) => a.querySelector('img') && !a.textContent.trim());
}

/** True when the element's text comes only from links (a row of inline links). */
function isLinkRow(node) {
  const links = [...node.querySelectorAll('a')];
  if (!links.length) return false;
  const linkText = links.map((a) => a.textContent).join('').replace(/\s+/g, '');
  return node.textContent.replace(/\s+/g, '') === linkText;
}

/**
 * Groups heading + list pairs into link columns.
 * @param {Element} section fragment section
 * @returns {Element}
 */
function buildLinkColumns(section) {
  const wrap = el('div', 'footer-link-columns');
  let col = null;
  [...section.children].forEach((child) => {
    if (/^H[1-6]$/.test(child.tagName) || !col) {
      col = el('div', 'footer-link-column');
      wrap.append(col);
    }
    if (/^H[1-6]$/.test(child.tagName)) child.classList.add('footer-link-heading');
    col.append(child);
  });
  return wrap;
}

const SOCIAL_NETWORKS = ['facebook', 'linkedin', 'twitter', 'instagram', 'youtube', 'x', 'tiktok', 'pinterest'];

/** Social network name for a link, from its host name (www.facebook.com -> facebook). */
function socialNetwork(a) {
  try {
    const parts = new URL(a.href).hostname.split('.');
    const name = parts.length > 1 ? parts[parts.length - 2] : parts[0];
    return SOCIAL_NETWORKS.includes(name) ? name : null;
  } catch {
    return null;
  }
}

/** True when every link in the list points to a known social network. */
function isSocialList(list) {
  const links = [...list.querySelectorAll('a')];
  return links.length > 0 && links.every((a) => socialNetwork(a));
}

/**
 * Turns a list of social links into icon buttons. Each authored icon image (or, without one,
 * icons/social-<network>.png) is drawn as a CSS mask so the glyph follows the link colour on
 * hover, like an icon font. The image alt (or link text) becomes the accessible name.
 * @param {Element} list ul
 */
function decorateSocialList(list) {
  const codeBase = window.hlx?.codeBasePath || '';
  list.classList.add('footer-social');
  list.querySelectorAll('a').forEach((a) => {
    const network = socialNetwork(a);
    const img = a.querySelector('img');
    a.classList.add('footer-social-link', `footer-social-${network}`);
    const label = (img?.alt || a.textContent).trim();
    if (label && !a.getAttribute('aria-label')) a.setAttribute('aria-label', label);
    const text = el('span', 'footer-social-label');
    text.textContent = label;
    const icon = el('span', 'footer-social-icon');
    icon.setAttribute('aria-hidden', 'true');
    const src = img?.src || `${codeBase}/icons/social-${network}.png`;
    icon.style.setProperty('--footer-icon', `url("${src}")`);
    a.replaceChildren(icon, text);
  });
}

/**
 * Builds the legal row: leading plain paragraph = copyright, link-only paragraph = legal
 * links, list of social-network links = social icons.
 * @param {Element} section fragment section
 * @returns {Element}
 */
function buildLegalRow(section) {
  const row = el('div', 'footer-legal-row');
  const textGroup = el('div', 'footer-legal-text');
  [...section.children].forEach((child) => {
    if (child.tagName === 'UL' && isSocialList(child)) {
      decorateSocialList(child);
      row.append(child);
    } else if (child.tagName === 'P' && isLinkRow(child)) {
      child.classList.add('footer-legal-links');
      textGroup.append(child);
    } else {
      if (child.tagName === 'P' && !textGroup.children.length) child.classList.add('footer-copyright');
      textGroup.append(child);
    }
  });
  row.prepend(textGroup);
  return row;
}

/**
 * Decorates the notice band: image-only paragraph = floating badge, bold-only paragraph =
 * bordered notice box, the rest are disclosure paragraphs.
 * @param {Element} section fragment section
 * @returns {Element}
 */
function buildNoticeBand(section) {
  const inner = el('div', 'footer-notice-inner');
  [...section.children].forEach((child) => {
    if (child.tagName === 'P' && isImageLinkList(child)) child.classList.add('footer-badge');
    else if (child.tagName === 'P' && child.children.length === 1 && child.firstElementChild.tagName === 'STRONG'
      && child.textContent.trim() === child.firstElementChild.textContent.trim()) {
      child.classList.add('footer-notice-box');
    } else if (child.tagName === 'P' && child.querySelector('br')) child.classList.add('footer-address');
    inner.append(child);
  });
  return inner;
}

/** Consent links (#showConsentPreferences) open the site's consent manager when one is loaded. */
function wireConsentLinks(root) {
  root.querySelectorAll('a[href^="#showConsentPreferences"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const ot = window.OneTrust;
      if (ot && typeof ot.ToggleInfoDisplay === 'function') ot.ToggleInfoDisplay();
    });
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const frag = await fetchFooter();
  block.textContent = '';
  if (!frag) return;

  const tmp = document.createElement('div');
  tmp.innerHTML = frag.html;
  resolveImages(tmp, frag.base);
  const sections = [...tmp.children].filter((c) => c.tagName === 'DIV');
  if (!sections.length) return;

  const noticeSection = sections.length > 1 ? sections[sections.length - 1] : null;
  const mainSections = noticeSection ? sections.slice(0, -1) : sections;

  const main = el('div', 'footer-main');
  const mainInner = el('div', 'footer-main-inner');
  mainSections.forEach((section, i) => {
    if (i > 0) mainInner.append(el('hr', 'footer-divider'));
    const hasColumns = section.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4');
    mainInner.append(hasColumns ? buildLinkColumns(section) : buildLegalRow(section));
  });
  main.append(mainInner);
  block.append(main);

  if (noticeSection) {
    const notice = el('div', 'footer-notice');
    notice.append(buildNoticeBand(noticeSection));
    block.append(notice);
  }

  wireConsentLinks(block);
}
