/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/tabs-section.js
  var COMPONENT_SELECTOR = [
    ".cta-list",
    ".comparison-highlight-layout",
    ".cta-product-card",
    ".resource-listing",
    ".resource-filters-gallery",
    ".layout-container",
    ".permission-wrapper",
    ".background-container",
    ".accordion",
    ".experiencefragment",
    ".ibm-video",
    "img",
    "table",
    "iframe",
    "form"
  ].join(", ");
  function slugify(text) {
    return String(text || "").toLowerCase().replace(/&amp;/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "tab";
  }
  function pageSlug(document, params) {
    const candidates = [];
    if (params && params.originalURL) candidates.push(params.originalURL);
    const og = document.querySelector('meta[property="og:url"]');
    if (og) candidates.push(og.getAttribute("content"));
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) candidates.push(canonical.getAttribute("href"));
    for (const url of candidates) {
      try {
        const path = new URL(url, "https://www.jackson.com").pathname.replace(/\.html?$/, "").replace(/\/+$/, "");
        if (path) return path.split("/").filter(Boolean).map(slugify).join("/");
      } catch (e) {
      }
    }
    return "page";
  }
  function labelContent(document, li) {
    const clone = li.cloneNode(true);
    clone.querySelectorAll(".hidden, .tab-form-number, .tab-archive-form-number").forEach((el) => el.remove());
    const parts = [];
    const icon = clone.querySelector("img");
    if (icon) parts.push(icon);
    const text = clone.textContent.replace(/\s+/g, " ").trim();
    const link = clone.querySelector("a[href]");
    if (link && text) {
      const a = document.createElement("a");
      a.href = link.getAttribute("href");
      a.textContent = text;
      parts.push(a);
    } else if (text) {
      parts.push(text);
    }
    return parts;
  }
  function textOnlyContent(panel) {
    if (panel.querySelector(COMPONENT_SELECTOR)) return null;
    const texts = [...panel.querySelectorAll(".cmp-text")];
    const roots = texts.length ? texts : [panel];
    const nodes = [];
    roots.forEach((root) => {
      [...root.children].forEach((child) => {
        if (child.textContent.trim()) nodes.push(child);
      });
    });
    return nodes.length ? nodes : null;
  }
  function heroPanelContent(document, panel, first) {
    const wrap = panel.querySelector(".wide .tab-content-wrappper") || panel.querySelector(".narrow .tab-content-wrappper") || panel;
    const nodes = [];
    const headline = wrap.querySelector(".headline, h1, h2");
    if (headline && headline.textContent.trim()) {
      const h = document.createElement(first ? "h1" : "h2");
      h.innerHTML = headline.innerHTML.trim();
      [...h.querySelectorAll("*")].reverse().forEach((d) => {
        if (!d.matches("sup, sub, em, strong, br")) d.replaceWith(...d.childNodes);
      });
      h.innerHTML = h.innerHTML.replace(/\s+/g, " ").trim();
      nodes.push(h);
    }
    wrap.querySelectorAll(".description, .subheading").forEach((src) => {
      const d = src.cloneNode(true);
      d.querySelectorAll(".action").forEach((x) => x.remove());
      const ps = [...d.querySelectorAll("p")].filter((p) => p.textContent.trim());
      if (ps.length) nodes.push(...ps);
      else if (d.textContent.trim()) {
        const p = document.createElement("p");
        p.innerHTML = d.innerHTML.trim();
        nodes.push(p);
      }
    });
    const seen = /* @__PURE__ */ new Set();
    wrap.querySelectorAll(".action a[href]").forEach((a) => {
      const key = `${a.getAttribute("href")}|${a.textContent.replace(/\s+/g, " ").trim()}`;
      if (!a.textContent.trim() || seen.has(key)) return;
      seen.add(key);
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = a.textContent.replace(/\s+/g, " ").trim();
      p.append(link);
      nodes.push(p);
    });
    return nodes;
  }
  function parseHeroTabs(element, document, heroTab) {
    const heroPanels = [...heroTab.querySelectorAll(":scope > .tab-content")];
    const tabs = [...element.querySelectorAll(".tab-container ul > li")];
    const cells = [];
    tabs.forEach((li, index) => {
      const label = labelContent(document, li);
      if (!label.length) return;
      const panel = heroPanels.find((p) => li.id && p.id === li.id) || heroPanels[index];
      cells.push([label, panel ? heroPanelContent(document, panel, index === 0) : ""]);
    });
    heroPanels.forEach((p) => p.remove());
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-section (alt)", cells });
    element.replaceWith(block);
  }
  function parse(element, { document, params }) {
    const heroTab = element.matches(".tab-wrapper") && element.parentElement && element.parentElement.matches(".tab") ? element.parentElement : null;
    if (heroTab && heroTab.querySelector(":scope > .tab-content") && !element.querySelector(".tab-content")) {
      parseHeroTabs(element, document, heroTab);
      return;
    }
    const tabRoot = element.matches(".tab") ? element : element.querySelector(".tab.v4, .tab") || element;
    const tabs = [...tabRoot.querySelectorAll('.tab-container ul[role="tablist"] > li, .tab-container ul > li[role="tab"], .tab-container__tabs ul > li')].filter((li, i, arr) => arr.indexOf(li) === i);
    const panels = [...tabRoot.querySelectorAll('.tab-content-wrappper > .tab-content, .tab-content[role="tabpanel"], .tab-container__contents > .tab-container__tab-content')].filter((p, i, arr) => arr.indexOf(p) === i);
    const intro = [];
    const introSrc = tabRoot.querySelector(".tab-container__text");
    if (introSrc) {
      const title = introSrc.querySelector(".tab-container__title");
      if (title && title.textContent.trim()) {
        const h = document.createElement("h2");
        h.textContent = title.textContent.replace(/\s+/g, " ").trim();
        intro.push(h);
      }
      const desc = introSrc.querySelector(".tab-container__description");
      if (desc) {
        [...desc.querySelectorAll("p")].filter((p) => p.textContent.trim()).forEach((p) => {
          const n = document.createElement("p");
          n.innerHTML = p.innerHTML.trim();
          intro.push(n);
        });
      }
    }
    let variant = "alt-3";
    if (tabRoot.querySelector(".resource-filters-gallery, .resource-listing")) variant = "image-magenta-grey-shadow";
    else if (tabRoot.querySelector(".cta-product-card")) variant = null;
    const slug = pageSlug(document, params);
    const fragments = params && Array.isArray(params.fragments) ? params.fragments : null;
    const usedIds = /* @__PURE__ */ new Set();
    const cells = [];
    tabs.forEach((li, index) => {
      const label = labelContent(document, li);
      const labelText = li.textContent.replace(/\s+/g, " ").trim();
      if (!labelText && !label.length) return;
      const controls = li.getAttribute("aria-controls");
      let panel = controls ? panels.find((p) => p.id === controls) : null;
      if (!panel && li.id) panel = panels.find((p) => p.id === `${li.id}-tab`) || null;
      if (!panel) panel = panels[index] || null;
      let panelCell = "";
      if (panel && (panel.textContent.trim() || panel.querySelector("img, iframe"))) {
        const inline = textOnlyContent(panel);
        if (inline) {
          panelCell = inline;
        } else {
          let id = slugify(li.id || labelText);
          const taken = (candidate) => usedIds.has(candidate) || fragments && fragments.some((f) => f.path === `/fragments/${slug}/${candidate}`);
          let n = 2;
          const base = id;
          while (taken(id)) {
            id = `${base}-${n}`;
            n += 1;
          }
          usedIds.add(id);
          const path = `/fragments/${slug}/${id}`;
          const container = document.createElement("div");
          container.append(...panel.childNodes);
          container.querySelectorAll(".accordion-item .accordion-title").forEach((t) => {
            const text = t.textContent.replace(/\s+/g, " ").trim();
            if (!text) {
              t.remove();
              return;
            }
            const h = document.createElement("h3");
            h.textContent = text;
            t.replaceWith(h);
          });
          if (fragments) fragments.push({ element: container, path });
          const a = document.createElement("a");
          a.href = path;
          a.textContent = path;
          const p = document.createElement("p");
          p.append(a);
          panelCell = [p];
        }
      }
      cells.push([label, panelCell]);
    });
    const name = variant ? `tabs-section (${variant})` : "tabs-section";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(...intro, block);
  }

  // tools/importer/parsers/hero-banner.js
  function findBackgroundUrl(element) {
    const urls = [];
    element.querySelectorAll("style").forEach((style) => {
      const m = style.textContent.match(/url\(\s*["']?([^"')]+)["']?\s*\)/i);
      if (m) urls.push(m[1]);
    });
    if (!urls.length) {
      const styled = [element, ...element.querySelectorAll('[style*="url("]')];
      styled.forEach((el) => {
        const m = (el.getAttribute("style") || "").match(/url\(\s*["']?([^"')]+)["']?\s*\)/i);
        if (m) urls.push(m[1]);
      });
    }
    if (!urls.length) return null;
    try {
      return new URL(urls[0], "https://www.jackson.com").href;
    } catch (e) {
      return urls[0];
    }
  }
  function parse2(element, { document, params }) {
    const cells = [];
    let picture = null;
    const bgUrl = findBackgroundUrl(element);
    if (bgUrl) {
      picture = document.createElement("img");
      picture.src = bgUrl;
      picture.alt = "";
    } else {
      const img = element.querySelector("img");
      if (img) picture = img.closest("picture") || img;
    }
    element.querySelectorAll("style").forEach((s) => s.remove());
    const wrapper = element.querySelector(".spotlight-wrapper, .spotlight-block, .spotlight") || element;
    const content = [];
    const heading = wrapper.querySelector("h1, h2, h3, h4");
    if (heading) {
      const h = document.createElement(heading.tagName.toLowerCase());
      h.innerHTML = heading.innerHTML.trim();
      [...h.querySelectorAll("*")].forEach((d) => {
        if (!d.matches("sup, sub")) d.replaceWith(...d.childNodes);
      });
      h.innerHTML = h.innerHTML.replace(/\s+/g, " ").trim();
      if (!h.textContent.trim()) h.textContent = heading.textContent.trim();
      content.push(h);
    }
    const header = wrapper.querySelector(".header") || wrapper;
    [...header.querySelectorAll("p, ul, ol")].filter((el) => el.textContent.trim() && !el.closest(".title") && !el.closest(".action") && !(el.parentElement && el.parentElement.closest("p, ul, ol") && header.contains(el.parentElement.closest("p, ul, ol")))).forEach((el) => content.push(el));
    const actionRoot = wrapper.querySelector(".action") || wrapper;
    [...actionRoot.querySelectorAll("a[href]")].filter((a) => a.textContent.trim() && !content.some((c) => c.contains(a))).forEach((a) => {
      const p = document.createElement("p");
      a.removeAttribute("class");
      p.append(a);
      content.push(p);
    });
    if (picture) cells.push([picture]);
    cells.push([content]);
    const COLOR_OPTIONS = {
      "#3b455b": "blue",
      "#c1c72b": "orange",
      "#b2b4be": "grey",
      "#8aced3": "cyan",
      "#474546": "charcoal",
      "#995d7a": "mauve",
      "#a8d7af": "green",
      "#fa9e73": "peach"
    };
    const box = element.querySelector(".product-header__content[style]");
    const m = box && (box.getAttribute("style") || "").match(/--content-color:\s*(#[0-9a-f]{6})/i);
    const option = m ? COLOR_OPTIONS[m[1].toLowerCase()] : null;
    const block = WebImporter.Blocks.createBlock(document, { name: option ? `hero-banner (${option})` : "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function textOf(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function headingLevel(src, fallback) {
    const tag = /^H([1-6])$/.exec(src.tagName || "");
    let level = tag ? Number(tag[1]) : null;
    if (!level) {
      const inner = src.querySelectorAll("h1, h2, h3, h4, h5, h6");
      if (inner.length === 1) level = Number(inner[0].tagName[1]);
    }
    if (!level) return fallback;
    return Math.max(level, 2);
  }
  function makeHeading(document, src, fallback) {
    if (!src || !textOf(src)) return null;
    const h = document.createElement(`h${headingLevel(src, fallback)}`);
    h.innerHTML = src.innerHTML.trim();
    [...h.querySelectorAll("*")].forEach((d) => {
      if (!d.matches("sup, sub, em, strong, b, i, a, br")) d.replaceWith(...d.childNodes);
    });
    h.innerHTML = h.innerHTML.replace(/\s+/g, " ").trim();
    if (!textOf(h)) h.textContent = textOf(src);
    return h;
  }
  function cleanDescription(document, desc) {
    const out = [];
    if (!desc) return out;
    [...desc.children].forEach((child) => {
      if (!textOf(child) && !child.querySelector("img, picture")) return;
      child.removeAttribute("style");
      child.querySelectorAll("[style]").forEach((s) => s.removeAttribute("style"));
      out.push(child);
    });
    if (!out.length && textOf(desc)) {
      const p = document.createElement("p");
      p.textContent = textOf(desc);
      out.push(p);
    }
    return out;
  }
  function ctaParagraphs(document, links) {
    return links.filter((a) => a && a.getAttribute("href") && textOf(a)).map((a) => {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = textOf(a);
      if (a.getAttribute("title")) link.title = a.getAttribute("title");
      p.append(link);
      return p;
    });
  }
  function iconCell(img) {
    if (!img || !img.getAttribute("src")) return "";
    return img;
  }
  function productCardRow(document, card) {
    const body = [];
    const h = makeHeading(document, card.querySelector(".card-content > .title, .title"), 3);
    if (h) body.push(h);
    body.push(...cleanDescription(document, card.querySelector(".description")));
    body.push(...ctaParagraphs(document, [...card.querySelectorAll(".cta-section a[href]")]));
    return [body];
  }
  function parseProductCard(element, document) {
    const card = element.closest(".cta-product-card-block");
    let holder = card;
    while (holder.parentElement && holder.parentElement.children.length === 1 && !holder.parentElement.matches("section, .body-content, .content-wrapper, body")) {
      holder = holder.parentElement;
    }
    const row = productCardRow(document, card);
    let prev = holder.previousElementSibling;
    while (prev && !prev.textContent.trim() && !prev.querySelector("img")) prev = prev.previousElementSibling;
    if (prev && prev.tagName === "TABLE" && prev.dataset.excatProductCards === "true") {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.append(...row[0]);
      tr.append(td);
      (prev.querySelector("tbody") || prev).append(tr);
      holder.remove();
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells: [row] });
    if (block.dataset) block.dataset.excatProductCards = "true";
    holder.replaceWith(block);
  }
  function parseSitemap(element, document) {
    const rows = [...element.querySelectorAll(".sitemap .section")].map((section) => {
      const body = [];
      const head = section.querySelector(".header-link a[href]");
      if (head && textOf(head)) {
        const h = document.createElement("h3");
        const a = document.createElement("a");
        a.href = head.getAttribute("href");
        a.textContent = textOf(head);
        h.append(a);
        body.push(h);
      }
      const links = [...section.querySelectorAll(":scope > .link a[href]")].filter((a) => textOf(a));
      if (links.length) {
        const ul = document.createElement("ul");
        links.forEach((src) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = src.getAttribute("href");
          a.textContent = textOf(src);
          li.append(a);
          ul.append(li);
        });
        body.push(ul);
      }
      return body.length ? [body] : null;
    }).filter(Boolean);
    if (!rows.length) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature (alt)", cells: rows });
    element.replaceWith(block);
  }
  function parse3(element, { document, params }) {
    if (element.closest(".cta-product-card-block")) {
      parseProductCard(element, document);
      return;
    }
    if (element.querySelector(".sitemap .section") || element.matches(".sitemap")) {
      parseSitemap(element, document);
      return;
    }
    const cells = [];
    let variant = null;
    const iconCards = [...element.querySelectorAll(".cta-icon-card-block")];
    const ctaLists = [...element.querySelectorAll(".cta-list__content")];
    const feature = element.querySelector(".feature-50-50__content");
    const iconFeatures = [...element.querySelectorAll(".icon-feature")].filter((c) => !c.parentElement.closest(".icon-feature"));
    let trailing = [];
    if (iconCards.length) {
      if (element.querySelector(".main-content, .secondary-content")) variant = "icon-left";
      else if (element.matches(".three-column, .cta-icon-card-wrapper") || element.querySelector(".cta-icon-card-wrapper") || element.closest(".three-column")) variant = "alt";
      iconCards.forEach((card) => {
        const img = card.querySelector(".icon-image img, img");
        const body = [];
        const h = makeHeading(document, card.querySelector(".title"), 3);
        if (h) body.push(h);
        body.push(...cleanDescription(document, card.querySelector(".description")));
        body.push(...ctaParagraphs(document, [...card.querySelectorAll(".cta-arrow-button-wrapper a, .card-content > a")]));
        if (!body.length && !img) return;
        cells.push([iconCell(img), body]);
      });
    } else if (ctaLists.length) {
      const outerImgs = [...element.querySelectorAll("img")].filter((i) => !i.closest(".cta-list"));
      ctaLists.forEach((item) => {
        const img = item.querySelector("img") || (ctaLists.length === 1 ? outerImgs[0] : null);
        const body = [];
        const h = makeHeading(document, item.querySelector(".cta-list__header") || item.querySelector("h1, h2, h3, h4, h5, h6"), 3);
        if (h) body.push(h);
        body.push(...cleanDescription(document, item.querySelector(".cta-list__description")));
        const area = item.closest(".content-area") || item;
        const linkEls = [...item.querySelectorAll(".customContent a, .cta-list__links a")];
        area.querySelectorAll(":scope > .cta-list__links a").forEach((a) => {
          if (!linkEls.includes(a)) linkEls.push(a);
        });
        body.push(...ctaParagraphs(document, linkEls));
        if (!body.length && !img) return;
        cells.push([iconCell(img), body]);
      });
      trailing = ctaParagraphs(document, [...element.querySelectorAll(".cta a, .cta--text-center a")]).map((p) => {
        const strong = document.createElement("strong");
        const a = p.querySelector("a");
        a.replaceWith(strong);
        strong.append(a);
        return p;
      });
    } else if (iconFeatures.length) {
      iconFeatures.forEach((card) => {
        const img = card.querySelector(".icon-feature__image img");
        const body = [];
        const h = makeHeading(document, card.querySelector(".icon-feature__title"), 3);
        if (h) body.push(h);
        body.push(...cleanDescription(document, card.querySelector(".icon-feature__description")));
        body.push(...ctaParagraphs(document, [...card.querySelectorAll(".icon-feature__link a[href]")]));
        if (!body.length && !img) return;
        cells.push([iconCell(img), body]);
      });
    } else if (feature) {
      const img = feature.querySelector(".feature-50-50__image img, img");
      const body = [];
      const h = makeHeading(document, feature.querySelector(".feature-50-50__title, h1, h2, h3, h4"), 3);
      if (h) body.push(h);
      body.push(...cleanDescription(document, feature.querySelector(".feature-50-50__description")));
      body.push(...ctaParagraphs(document, [...feature.querySelectorAll(".feature-50-50__links a")]));
      if (body.length || img) cells.push([iconCell(img), body]);
    } else {
      [...element.children].forEach((child) => {
        if (!textOf(child) && !child.querySelector("img")) return;
        const img = child.querySelector("img");
        const body = [];
        const h = makeHeading(document, child.querySelector("h1, h2, h3, h4, h5, h6, .title"), 3);
        if (h) body.push(h);
        child.querySelectorAll("p, ul, ol").forEach((p) => {
          if (textOf(p)) body.push(p);
        });
        const loose = [...child.querySelectorAll(".small-links a[href], .cta-arrow-button-wrapper a[href], a.primary-button[href], a.secondary-button[href]")].filter((a, i, all) => all.indexOf(a) === i && !body.some((n) => n.contains && n.contains(a)));
        body.push(...ctaParagraphs(document, loose));
        if (!body.length && !img) return;
        const prev = cells[cells.length - 1];
        if (!img && prev && body.every((n) => n.tagName === "P" && n.querySelector("a") && textOf(n) === textOf(n.querySelector("a")))) {
          prev[1].push(...body);
          return;
        }
        cells.push([iconCell(img), body]);
      });
    }
    if (cells.length && cells.every((r) => r[0] === "")) {
      cells.forEach((r, i) => {
        cells[i] = [r[1]];
      });
    }
    const name = variant ? `cards-feature (${variant})` : "cards-feature";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    if (trailing.length) element.after(...trailing);
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-benefits.js
  function textOf2(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function flattenInline(document, src, tag) {
    const h = document.createElement(tag);
    h.innerHTML = src.innerHTML;
    [...h.querySelectorAll("*")].forEach((d) => {
      const keep = d.matches("sup, sub, em, strong, b, i, br") || d.matches("a") && d.getAttribute("href");
      if (!keep) d.replaceWith(...d.childNodes);
    });
    h.innerHTML = h.innerHTML.replace(/\s+/g, " ").replace(/&nbsp;/g, " ").trim();
    return h;
  }
  function firstHeading(document, container) {
    if (!container) return null;
    const hs = [...container.querySelectorAll("h1, h2, h3, h4, h5, h6")].filter((h) => textOf2(h));
    if (!hs.length) return null;
    return flattenInline(document, hs[0], hs[0].tagName.toLowerCase());
  }
  function richChildren(document, container) {
    const out = [];
    if (!container) return out;
    [...container.children].forEach((child) => {
      if (!textOf2(child) && !child.querySelector("img")) return;
      child.removeAttribute("style");
      child.querySelectorAll("[style]").forEach((s) => s.removeAttribute("style"));
      child.innerHTML = child.innerHTML.replace(/(<br\s*\/?>\s*(&nbsp;| |\s)*)+$/i, "");
      out.push(child);
    });
    if (!out.length && textOf2(container)) {
      const p = document.createElement("p");
      p.textContent = textOf2(container);
      out.push(p);
    }
    return out;
  }
  function linkParas(document, links) {
    return links.filter((a) => a && a.getAttribute("href") && textOf2(a)).map((a) => {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = textOf2(a);
      if (a.classList.contains("secondary-cta-button")) {
        const em = document.createElement("em");
        em.append(link);
        p.append(em);
      } else {
        const strong = document.createElement("strong");
        strong.append(link);
        p.append(strong);
      }
      return p;
    });
  }
  function parseStatSpotlight(document, spot) {
    const intro = [];
    const content = spot.querySelector(".stat-spotlight-content") || spot;
    const h = firstHeading(document, content);
    if (h) intro.push(h);
    intro.push(...richChildren(document, content.querySelector(".description")));
    intro.push(...linkParas(document, [...content.querySelectorAll(".action a")]));
    const benefits = [];
    const stats = spot.querySelector(".stats-container");
    if (stats) {
      const titleEl = stats.querySelector(".stat-title");
      const th = titleEl && (titleEl.querySelector("h1, h2, h3, h4, h5, h6") || titleEl);
      if (th && textOf2(th)) {
        const tag = th.matches("h1, h2, h3, h4, h5, h6") ? th.tagName.toLowerCase() : "h4";
        benefits.push(flattenInline(document, th, tag));
      }
      const ul = document.createElement("ul");
      const headers = [...stats.querySelectorAll(".stat-header")];
      headers.forEach((header) => {
        const li = document.createElement("li");
        const hSrc = [...header.querySelectorAll("h1, h2, h3, h4, h5, h6")].find((x) => textOf2(x));
        if (hSrc) {
          const hEl = flattenInline(document, hSrc, hSrc.tagName === "H1" ? "h2" : hSrc.tagName.toLowerCase());
          hEl.querySelectorAll("b, strong").forEach((x) => x.replaceWith(...x.childNodes));
          hEl.querySelectorAll("sup, sub").forEach((x) => {
            if (!textOf2(x)) x.remove();
          });
          hEl.innerHTML = hEl.innerHTML.replace(/(&nbsp;|\s)+$/, "").replace(/^(&nbsp;|\s)+/, "");
          li.append(hEl);
          let d = header.nextElementSibling;
          if (d && !d.classList.contains("stat-description")) d = null;
          if (d && textOf2(d)) {
            const para2 = flattenInline(document, d, "p");
            para2.querySelectorAll("b, strong").forEach((x) => x.replaceWith(...x.childNodes));
            li.append(para2);
          }
          if (textOf2(li)) ul.append(li);
          return;
        }
        const strong = flattenInline(document, header, "strong");
        strong.querySelectorAll("b, strong").forEach((b) => b.replaceWith(...b.childNodes));
        strong.innerHTML = strong.innerHTML.replace(/(&nbsp;|\s)+$/, "").replace(/^(&nbsp;|\s)+/, "");
        if (textOf2(strong)) li.append(strong);
        let desc = header.nextElementSibling;
        if (desc && !desc.classList.contains("stat-description")) desc = null;
        if (desc && textOf2(desc)) {
          const span = flattenInline(document, desc, "span");
          span.querySelectorAll("b, strong").forEach((b) => b.replaceWith(...b.childNodes));
          if (li.childNodes.length) li.append(document.createElement("br"));
          li.append(...span.childNodes);
        }
        if (textOf2(li)) ul.append(li);
      });
      if (!headers.length) {
        stats.querySelectorAll(".stat-description").forEach((d) => {
          if (!textOf2(d)) return;
          const li = document.createElement("li");
          li.append(...flattenInline(document, d, "span").childNodes);
          ul.append(li);
        });
      }
      if (ul.children.length) benefits.push(ul);
    }
    return [intro.length ? intro : "", benefits.length ? benefits : ""];
  }
  function parseFeature(document, feature) {
    const text = [];
    const h = firstHeading(document, feature.querySelector(".feature-50-50__card") || feature);
    if (h) text.push(h);
    text.push(...richChildren(document, feature.querySelector(".feature-50-50__description")));
    text.push(...linkParas(document, [...feature.querySelectorAll(".feature-50-50__links a")]));
    const img = feature.querySelector(".feature-50-50__image img");
    const media = img && img.getAttribute("src") ? [img] : "";
    const content = feature.querySelector(".feature-50-50__content");
    const imageLeft = content && content.classList.contains("image-left");
    const textCell = text.length ? text : "";
    if (!media) return [textCell];
    return imageLeft ? [media, textCell] : [textCell, media];
  }
  function parse4(element, { document, params }) {
    const cells = [];
    let variant = null;
    const spot = element.matches(".stat-spotlight") ? element : element.querySelector(".stat-spotlight");
    const feature = element.matches(".feature-50-50") ? element : element.querySelector(".feature-50-50");
    if (spot) {
      cells.push(parseStatSpotlight(document, spot));
      const contents = element.querySelector(".contents.bg-color") || spot.closest(".contents");
      const bg = contents ? contents.getAttribute("style") || "" : "";
      const m = bg.match(/--bg-color:\s*([^;]*);/);
      if (contents && (!m || !m[1].trim())) variant = "light";
    } else if (feature) {
      cells.push(parseFeature(document, feature));
    } else {
      const items = [...element.children].filter((c) => textOf2(c) || c.querySelector("img"));
      if (items.length) cells.push(items.map((c) => [c]));
    }
    const name = variant ? `columns-benefits (${variant})` : "columns-benefits";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-tool.js
  function cleanInline(document, src, tag) {
    const el = document.createElement(tag);
    el.innerHTML = src.innerHTML;
    el.querySelectorAll("div, span").forEach((w) => w.replaceWith(...w.childNodes));
    el.innerHTML = el.innerHTML.trim();
    return el;
  }
  function para(document, text) {
    const p = document.createElement("p");
    p.textContent = text;
    return p;
  }
  function linkPara(document, a) {
    const p = document.createElement("p");
    const link = document.createElement("a");
    link.href = a.getAttribute("href");
    link.textContent = a.textContent.trim();
    p.append(link);
    return p;
  }
  function imageOf(scope) {
    if (!scope) return null;
    return scope.querySelector("picture") || scope.querySelector("img");
  }
  function parsePromo(document, card) {
    const body = [];
    const title = card.querySelector(".card-content .title, .title");
    if (title && title.textContent.trim()) body.push(cleanInline(document, title, "h3"));
    const desc = card.querySelector(".card-content .description, .description");
    if (desc) {
      const ps = [...desc.querySelectorAll(":scope > p, :scope > ul, :scope > ol")].filter((p) => p.textContent.trim());
      if (ps.length) body.push(...ps);
      else if (desc.textContent.trim()) body.push(cleanInline(document, desc, "p"));
    }
    card.querySelectorAll(".action a[href]").forEach((a) => {
      if (a.textContent.trim()) body.push(linkPara(document, a));
    });
    return { image: imageOf(card.querySelector(".promo-image") || card), body };
  }
  function parsePartner(document, card) {
    const body = [];
    const tag = card.querySelector(".resource-filter-listing__header-text, .resource-filter-listing__mobile-header-text");
    if (tag && tag.textContent.trim()) body.push(para(document, tag.textContent.trim()));
    const logo = imageOf(card.querySelector(".logo-image-container"));
    const nameSrc = card.querySelector(".card-title-additional .card-title__text");
    if (nameSrc) {
      const name = [...nameSrc.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(" ").replace(/\s+/g, " ").trim();
      if (name) {
        const h = document.createElement("h3");
        h.textContent = name;
        body.push(h);
      }
    }
    const links = [...card.querySelectorAll(".card-title a[href], .card-title-additional a[href]")].filter((a) => a.textContent.trim());
    links.forEach((a) => body.push(linkPara(document, a)));
    if (!logo && !nameSrc && !links.length) {
      const cap = card.querySelector(".resource-filter-listing__mobile-caption");
      const text = cap && cap.textContent.trim();
      return { image: null, body: [], caption: text ? para(document, text) : null };
    }
    return { image: logo, body };
  }
  function parse5(element, { document, params }) {
    const root = element;
    let items = [];
    let variant = null;
    const partnerCards = [...root.querySelectorAll(".resource-filter-listing__block")];
    const promoCards = [...root.querySelectorAll(".promo-card")].filter((c) => c.querySelector(".card-content, .title, .promo-image"));
    if (partnerCards.length) {
      items = partnerCards.map((c) => parsePartner(document, c));
      const hasLogos = !!root.querySelector(".logo-image-container img");
      const additional = root.matches(".resource-filter-listing__additional-options-block-wrapper") || !!root.querySelector(".card-title-additional");
      variant = hasLogos && !additional ? "partner-logo" : "partner";
    } else if (promoCards.length) {
      items = promoCards.map((c) => parsePromo(document, c));
    } else {
      items = [...root.querySelectorAll(":scope > div, :scope > * > div")].filter((c) => c.querySelector("h2, h3, h4, .title")).map((c) => parsePromo(document, c));
    }
    const captions = items.map((it) => it.caption).filter(Boolean);
    items = items.filter((it) => it.image || it.body.length);
    const hasImages = items.some((it) => it.image);
    const hasBodies = items.some((it) => it.body.length);
    const cells = items.map((it) => {
      if (hasImages && hasBodies) return [it.image || "", it.body];
      return [hasImages ? it.image : it.body];
    });
    const name = variant ? `cards-tool (${variant})` : "cards-tool";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block, ...captions);
  }

  // tools/importer/transformers/jackson-cleanup.js
  var CATALOG_CLEANUP_RULES = [
    '[id*="onetrust"]',
    '[class*="cookie-consent"]',
    '[id*="truste"]'
  ];
  function normalizeUrl(url) {
    if (!url) return "";
    try {
      const u = new URL(url, "https://www.jackson.com");
      let path = u.pathname.replace(/\/+$/, "") || "/";
      return path.toLowerCase();
    } catch (e) {
      return String(url).split(/[?#]/)[0].replace(/\/+$/, "").toLowerCase();
    }
  }
  function getPageUrl(document, payload) {
    const params = payload.params || {};
    const candidates = [params.originalURL, payload.url, params.url];
    const og = document.querySelector('meta[property="og:url"]');
    if (og) candidates.push(og.getAttribute("content"));
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) candidates.push(canonical.getAttribute("href"));
    return candidates.filter(Boolean);
  }
  function findPageEntry(map, document, payload) {
    if (!map) return null;
    const urls = getPageUrl(document, payload);
    for (const url of urls) {
      if (Object.prototype.hasOwnProperty.call(map, url)) return map[url];
    }
    const keys = Object.keys(map);
    for (const url of urls) {
      const norm = normalizeUrl(url);
      const key = keys.find((k) => normalizeUrl(k) === norm);
      if (key) return map[key];
    }
    return null;
  }
  function safeQueryAll(root, selector) {
    try {
      return [...root.querySelectorAll(selector)];
    } catch (e) {
      return [];
    }
  }
  function getMainRoots(document, template) {
    const roots = safeQueryAll(document, "main");
    if (roots.length) return roots;
    const sections = template && template.sections || [];
    sections.forEach((section) => {
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      selectors.filter(Boolean).forEach((sel) => {
        safeQueryAll(document, sel).forEach((el) => {
          if (!roots.includes(el)) roots.push(el);
        });
      });
    });
    if (!roots.length) {
      safeQueryAll(document, "div.body-content, div.content-wrapper.v1").forEach((el) => roots.push(el));
    }
    return roots;
  }
  function hasAuthorableContent(el) {
    if ((el.textContent || "").replace(/\s+/g, "").length) return true;
    return !!el.querySelector("img, picture, video, table, iframe, svg, a[href]");
  }
  function removeAll(root, selector) {
    safeQueryAll(root, selector).forEach((el) => el.remove());
  }
  function transform(hookName, element, payload) {
    const document = payload.document || element && element.ownerDocument;
    if (!document) return;
    const template = payload.template || {};
    if (hookName === "beforeTransform") {
      const pageSelectors = findPageEntry(template.pageCleanup, document, payload);
      if (Array.isArray(pageSelectors)) {
        pageSelectors.forEach((selector) => {
          const found = safeQueryAll(document, selector);
          if (found.length === 1) found[0].remove();
        });
      } else {
        const mainRoots = getMainRoots(document, template);
        CATALOG_CLEANUP_RULES.forEach((rule) => {
          safeQueryAll(document, rule).forEach((el) => {
            if (!el.isConnected) return;
            if (el.matches("html, head, body")) return;
            if (mainRoots.some((root) => root === el || root.contains(el) || el.contains(root))) return;
            el.remove();
          });
        });
      }
      return;
    }
    if (hookName === "afterTransform") {
      const body = document.body || document.querySelector("body");
      if (!body) return;
      const grid = body.querySelector(":scope > div.responsive > div.root > div.aem-Grid") || body.querySelector("div.responsive div.root.responsivegrid > div.aem-Grid");
      if (grid) {
        [...grid.children].forEach((child) => {
          if (child.matches("div.experiencefragment")) {
            child.remove();
            return;
          }
          if (child.matches("div.toggle-container")) {
            child.remove();
            return;
          }
          if (child.matches("div.full-width-container") && !hasAuthorableContent(child)) {
            child.remove();
          }
        });
      }
      removeAll(document, [
        ".masthead",
        ".global-footer",
        ".masthead__breadcrumb",
        "nav.cmp-breadcrumb",
        ".fragment-navigation",
        ".contact-us-secondary-nav-area",
        "div.toggle-container"
      ].join(", "));
      removeAll(document, [
        "#mastContainer",
        'form[id$="sessionManagerForm"]',
        "footer#fatFooter",
        "footer#fpFooter",
        "div.root.responsiveGrid > div#disclosure",
        "body > div#disclosure",
        // app pages without a page grid wrapper: body-level overlays, dialogs and beacons
        "body > #container",
        "body > #backgroundOverlay",
        "body > #backgroudOverlay",
        "body > #textarea_simulator",
        "body > .ui-dialog-docking-zone",
        'body > [id^="ZN_"]',
        'body > [id^="batBeacon"]',
        "body > #inauth_font_detector",
        "body > iframe",
        // transactional (adaptive form) pages: own minimal header/footer, same content as the site chrome
        "body > div.form__header",
        "body > footer.form__footer",
        "body > div.guideContainer #loadingPage"
      ].join(", "));
      const wrapper = body.querySelector(":scope > div.responsive") || body.querySelector(":scope > div.root.responsiveGrid");
      if (wrapper) {
        [...body.children].forEach((child) => {
          if (child !== wrapper) child.remove();
        });
      }
      removeAll(document, [
        "#background-mask",
        "#cludoSearchProperties",
        ".session-timeout-panel",
        ".session-timeout-dialog__panel",
        '[id^="ZN_"]',
        '[id^="batBeacon"]',
        "#QSIFeedbackButton-target-container"
      ].join(", "));
      CATALOG_CLEANUP_RULES.forEach((rule) => {
        safeQueryAll(document, rule).forEach((el) => {
          if (!el.matches("html, head, body")) el.remove();
        });
      });
      removeAll(document, "script, style, noscript, link");
      safeQueryAll(document, "iframe").forEach((iframe) => {
        if (!iframe.closest("table")) {
          const src = iframe.getAttribute("src") || "";
          if (!src || /doubleclick|googletagmanager|bat\.bing|qualtrics|siteintercept|demdex|adsrvr|facebook|linkedin|cludo/i.test(src)) {
            iframe.remove();
          }
        }
      });
      safeQueryAll(document, "*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          const name = attr.name.toLowerCase();
          if (name.startsWith("data-analytics") || name.startsWith("data-track") || name.startsWith("data-gtm") || name === "data-ueto" || name === "onclick") {
            el.removeAttribute(attr.name);
          }
        });
      });
      const KNOWN_BLOCKS = [
        "accordion-manager",
        "address-card",
        "app-form",
        "cards-article",
        "cards-event",
        "cards-feature",
        "cards-product",
        "cards-team",
        "cards-tool",
        "cards-video",
        "cards",
        "columns-benefits",
        "columns-feature",
        "columns-schedule",
        "columns-sidebar",
        "columns",
        "contact-form",
        "disclaimer-gate",
        "embed-video",
        "forms-finder",
        "fragment",
        "hero-banner",
        "hero-page",
        "hero",
        "list-filter",
        "location-tiles",
        "pagination",
        "retirement-calculator",
        "table-product",
        "tabs-product",
        "tabs-section",
        "metadata",
        "section-metadata"
      ];
      safeQueryAll(element, "table").forEach((table) => {
        const rows = [...table.querySelectorAll(":scope > tr, :scope > thead > tr, :scope > tbody > tr, :scope > tfoot > tr")];
        if (!rows.length) return;
        if (table.parentElement && table.parentElement.closest("table")) return;
        if (rows[0].children.length < 2) {
          const title = rows[0].textContent.replace(/\s+/g, " ").trim();
          const blockName = title.toLowerCase().replace(/\s*\(.*\)\s*$/, "").replace(/\s+/g, "-");
          if (KNOWN_BLOCKS.includes(blockName) || rows.length < 2 || rows[1].children.length < 2) return;
          const caption = document.createElement("p");
          const strong = document.createElement("strong");
          strong.textContent = title;
          caption.append(strong);
          table.before(caption);
          rows.shift();
        }
        const cells = rows.map((tr) => [...tr.children].map((cell) => {
          const div = document.createElement("div");
          div.innerHTML = cell.innerHTML;
          return div;
        }));
        const hasHeader = rows[0].querySelector("th") !== null;
        const name = hasHeader ? "table-product" : "table-product (no-header)";
        table.replaceWith(WebImporter.Blocks.createBlock(document, { name, cells }));
      });
      safeQueryAll(element, "a[href]").forEach((a) => {
        const href = a.getAttribute("href");
        if (/^\/[^?#]*\.xhtml/i.test(href)) {
          a.setAttribute("href", `https://www.jackson.com${href}`);
          return;
        }
        if (/^[^/:#?][^:]*\.xhtml/i.test(href)) {
          try {
            const base = payload && payload.params && payload.params.originalURL || "https://www.jackson.com/";
            a.setAttribute("href", new URL(href, base).href.replace(/^http:/, "https:"));
          } catch (e) {
          }
          return;
        }
        const m = href.match(/^(?:https?:\/\/www\.jackson\.com)?(\/[^?#]*?)\.html?([?#].*)?$/i);
        if (!m || m[1].startsWith("/content/")) return;
        const path = m[1] === "/index" ? "/" : m[1];
        a.setAttribute("href", `${path}${m[2] || ""}`);
      });
    }
  }

  // tools/importer/transformers/jackson-sections.js
  var MARKER = "data-excat-section-id";
  function findSectionElement(document, section) {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    for (const sel of selectors.filter(Boolean)) {
      try {
        const el = document.querySelector(sel);
        if (el) return el;
      } catch (e) {
      }
    }
    return null;
  }
  function hasStyle(section) {
    return !!(section && section.style && String(section.style).trim());
  }
  function transform2(hookName, element, payload) {
    const document = payload.document || element && element.ownerDocument;
    const template = payload.template || {};
    const sections = Array.isArray(template.sections) ? template.sections : [];
    if (!document || !sections.length) return;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const el = findSectionElement(document, section);
        if (!el) continue;
        const styled = hasStyle(section);
        if (i === 0 && !styled) continue;
        const hr = document.createElement("hr");
        if (styled) hr.setAttribute(MARKER, section.id || section.name || String(i));
        if (i === 0) hr.setAttribute("data-excat-first-section", "true");
        el.before(hr);
      }
      return;
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const id = section.id || section.name || String(i);
        let marker = null;
        document.querySelectorAll(`hr[${MARKER}]`).forEach((hr) => {
          if (hr.getAttribute(MARKER) === id) marker = hr;
        });
        if (hasStyle(section)) {
          const metadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          let anchor = null;
          if (marker) {
            let node = marker.nextSibling;
            while (node && !(node.nodeType === 1 && node.tagName === "HR")) {
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
          if (marker.hasAttribute("data-excat-first-section")) marker.remove();
          else marker.removeAttribute(MARKER);
        }
      }
      document.querySelectorAll("hr[data-excat-first-section]").forEach((hr) => hr.remove());
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    "name": "homepage",
    "urls": [
      "https://www.jackson.com/"
    ],
    "description": "Landing page with full-width background hero, tabbed feature panels, three-column card rows and disclosures",
    "blocks": [
      {
        "name": "tabs-section",
        "instances": [
          "div.hero-space div.content-area.tab-wrapper"
        ],
        "pageInstances": {
          "https://www.jackson.com/": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div.hero-space.v3 > div > div.tab.event-setup > div.content-area.tab-wrapper"
          ]
        }
      },
      {
        "name": "hero-banner",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(3)"
          ]
        }
      },
      {
        "name": "cards-feature",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(4)",
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(6) > div > div"
          ]
        }
      },
      {
        "name": "columns-benefits",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(7)"
          ]
        }
      },
      {
        "name": "cards-tool",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(8) > div > div"
          ]
        }
      }
    ],
    "sections": [
      {
        "id": "hero",
        "name": "hero",
        "selector": [
          "div.hero-space",
          "div.aem-Grid > div.full-width-container:nth-of-type(4)"
        ],
        "style": null,
        "blocks": [
          "tabs-section"
        ],
        "defaultContent": [
          "div.hero-space div.background",
          "div.hero-space h1",
          "div.hero-space div.description",
          "div.hero-space div.subheading"
        ]
      },
      {
        "id": "main-content",
        "name": "main-content",
        "selector": [
          "div.hero-space + div.promo-area",
          "div.hero-space ~ div.background-container"
        ],
        "style": null,
        "blocks": [
          "hero-banner",
          "cards-feature",
          "columns-benefits",
          "cards-tool"
        ],
        "defaultContent": [
          "section div.disclosure",
          "section div.layout-container > div.content-area > h3",
          "section p"
        ]
      }
    ],
    "pageCleanup": {
      "https://www.jackson.com/": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(27)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ]
    }
  };
  var parsers = {
    "tabs-section": parse,
    "hero-banner": parse2,
    "cards-feature": parse3,
    "columns-benefits": parse4,
    "cards-tool": parse5
  };
  var sectionTransformers = [transform2];
  var fragmentTransformers = [];
  var lateTransformers = [...sectionTransformers, ...fragmentTransformers];
  var transformers = [transform, ...lateTransformers];
  var earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
  var CATALOG = Boolean(PAGE_TEMPLATE.pageCleanup || PAGE_TEMPLATE.blocks.some((b) => b.pageInstances));
  function executeTransformers(hookName, element, payload, list = transformers) {
    var _a, _b;
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: ((_b = (_a = payload.params) == null ? void 0 : _a.targets) == null ? void 0 : _b.template) || PAGE_TEMPLATE });
    list.forEach((fn) => {
      try {
        fn(hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template, url) {
    const pageBlocks = [];
    const pageKey = (u) => {
      try {
        const { origin, pathname } = new URL(u);
        return `${origin}${pathname.replace(/\/$/, "")}`;
      } catch (e) {
        return u;
      }
    };
    const key = pageKey(url);
    const claim = (blockDef, selector) => {
      let matches = [];
      try {
        matches = document.querySelectorAll(selector);
      } catch (e) {
        return;
      }
      matches.forEach((element) => {
        if (pageBlocks.some((b) => b.element === element || b.element.contains(element) || element.contains(b.element))) return;
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    };
    template.blocks.forEach((blockDef) => {
      const entry = Object.entries(blockDef.pageInstances || {}).find(([u]) => pageKey(u) === key);
      (entry ? entry[1] : []).forEach((selector) => claim(blockDef, selector));
    });
    template.blocks.forEach((blockDef) => (blockDef.instances || []).forEach((selector) => claim(blockDef, selector)));
    return pageBlocks;
  }
  function markPageTargets(payload) {
    const { document, params } = payload;
    executeTransformers("beforeTransform", document.body, payload, earlyTransformers);
    const blocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
      element.setAttribute("data-excat-block", String(i));
      return { name, selector };
    });
    const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
      const target = (section.selector || []).map((s) => {
        try {
          return document.querySelector(s);
        } catch (e) {
          return null;
        }
      }).find(Boolean);
      if (!target) return section;
      target.setAttribute("data-excat-section", String(i));
      return __spreadProps(__spreadValues({}, section), { selector: [`[data-excat-section="${i}"]`] });
    });
    params.targets = { blocks, template: __spreadProps(__spreadValues({}, PAGE_TEMPLATE), { sections }) };
  }
  var import_homepage_default = {
    preprocess: (payload) => {
      if (CATALOG) markPageTargets(payload);
    },
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      params.fragments = [];
      if (!params.targets) markPageTargets(payload);
      const pageBlocks = params.targets.blocks.map((block, i) => __spreadProps(__spreadValues({}, block), { element: document.querySelector(`[data-excat-block="${i}"]`) })).filter((block) => block.element);
      executeTransformers("beforeTransform", main, __spreadProps(__spreadValues({}, payload), { pageBlocks }), lateTransformers);
      pageBlocks.forEach((block) => {
        if (!main.contains(block.element)) return;
        const parser = parsers[block.name];
        if (!parser) return;
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      });
      const fragmentInstances = PAGE_TEMPLATE.fragmentInstances || {};
      if (Object.keys(fragmentInstances).length) {
        params.fragments.slice().forEach(({ element: frag }) => {
          const found = [];
          Object.entries(fragmentInstances).forEach(([name, selectors]) => selectors.forEach((sel) => {
            let matches = [];
            try {
              matches = frag.querySelectorAll(sel);
            } catch (e) {
              return;
            }
            matches.forEach((el) => {
              if (found.some((f) => f.el === el || f.el.contains(el) || el.contains(f.el))) return;
              found.push({ name, el });
            });
          }));
          found.sort((a, b) => a.el.compareDocumentPosition(b.el) & 4 ? -1 : 1);
          found.forEach(({ name, el }) => {
            if (!frag.contains(el) || !parsers[name]) return;
            try {
              parsers[name](el, { document, url, params });
            } catch (e) {
              console.error(`Failed to parse fragment ${name}:`, e);
            }
          });
        });
      }
      executeTransformers("afterTransform", main, payload);
      main.appendChild(document.createElement("hr"));
      WebImporter.rules.createMetadata(main, document);
      const themePath = new URL(params.originalURL).pathname;
      const APP_TEMPLATES = ["app-search-form", "account-recovery-form", "sign-in", "registration-form", "claim-form"];
      let theme = null;
      if (APP_TEMPLATES.includes(PAGE_TEMPLATE.name)) theme = "app";
      else if (/^\/financial-professional(\/|\.html$)/.test(themePath)) theme = "advisor";
      if (theme) {
        const meta = [...main.querySelectorAll("table")].find((t) => {
          var _a;
          return /^metadata$/i.test((((_a = t.querySelector("tr")) == null ? void 0 : _a.textContent) || "").trim());
        });
        if (meta) {
          const tr = document.createElement("tr");
          const k = document.createElement("td");
          const v = document.createElement("td");
          k.textContent = "Theme";
          v.textContent = theme;
          tr.append(k, v);
          (meta.querySelector("tbody") || meta).append(tr);
        } else {
          main.append(WebImporter.Blocks.createBlock(document, { name: "Metadata", cells: { Theme: theme } }));
        }
      }
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      params.fragments.forEach(({ element }) => {
        executeTransformers("afterTransform", element, payload, earlyTransformers);
        WebImporter.rules.transformBackgroundImages(element, document);
        WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
      });
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.x?html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }, ...params.fragments];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
