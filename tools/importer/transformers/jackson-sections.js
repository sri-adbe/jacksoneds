/* eslint-disable */
/* global WebImporter */

/**
 * Jackson (www.jackson.com) sections transformer.
 *
 * Builds section breaks (<hr>) and Section Metadata from payload.template.sections.
 * beforeTransform: walk sections in reverse, insert <hr> before every non-first section while the
 *   parser target elements still exist; styled sections get a temporary data-excat-section-id
 *   marker on their <hr> (a styled first section gets a temporary marked <hr> too).
 * afterTransform: walk in reverse, add a Section Metadata block after each styled section's marker
 *   (or surviving section element), clear markers, and drop the first section's temporary <hr>.
 *
 * content-page currently has one section (main-content, style null), so this is a no-op there.
 */

const MARKER = 'data-excat-section-id';

function findSectionElement(document, section) {
  const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
  for (const sel of selectors.filter(Boolean)) {
    try {
      const el = document.querySelector(sel);
      if (el) return el;
    } catch (e) {
      // invalid selector: try the next one
    }
  }
  return null;
}

function hasStyle(section) {
  return !!(section && section.style && String(section.style).trim());
}

export default function transform(hookName, element, payload) {
  const document = payload.document || (element && element.ownerDocument);
  const template = payload.template || {};
  const sections = Array.isArray(template.sections) ? template.sections : [];
  if (!document || !sections.length) return;

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const el = findSectionElement(document, section);
      if (!el) continue;
      const styled = hasStyle(section);
      if (i === 0 && !styled) continue;
      const hr = document.createElement('hr');
      if (styled) hr.setAttribute(MARKER, section.id || section.name || String(i));
      if (i === 0) hr.setAttribute('data-excat-first-section', 'true');
      el.before(hr);
    }
    return;
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const id = section.id || section.name || String(i);
      let marker = null;
      document.querySelectorAll(`hr[${MARKER}]`).forEach((hr) => {
        if (hr.getAttribute(MARKER) === id) marker = hr;
      });

      if (hasStyle(section)) {
        const metadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        // Section Metadata goes at the end of the section: before the next section's <hr>.
        let anchor = null;
        if (marker) {
          let node = marker.nextSibling;
          while (node && !(node.nodeType === 1 && node.tagName === 'HR')) {
            anchor = node;
            node = node.nextSibling;
          }
          (anchor || marker).after(metadata);
        } else {
          const el = findSectionElement(document, section);
          if (el) el.after(metadata);
        }
      }

      if (marker) {
        if (marker.hasAttribute('data-excat-first-section')) marker.remove();
        else marker.removeAttribute(MARKER);
      }
    }
    document.querySelectorAll('hr[data-excat-first-section]').forEach((hr) => hr.remove());
  }
}
