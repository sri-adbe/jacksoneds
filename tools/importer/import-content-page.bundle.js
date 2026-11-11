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

  // tools/importer/import-content-page.js
  var import_content_page_exports = {};
  __export(import_content_page_exports, {
    default: () => import_content_page_default
  });

  // tools/importer/parsers/columns-sidebar.js
  function textOf(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function flattenInline(document, src, tag) {
    const h = document.createElement(tag);
    h.innerHTML = src.innerHTML;
    [...h.querySelectorAll("*")].forEach((d) => {
      const keep = d.matches("sup, sub, em, strong, b, i, br") || d.matches("a") && d.getAttribute("href");
      if (!keep) d.replaceWith(...d.childNodes);
    });
    h.innerHTML = h.innerHTML.replace(/\s+/g, " ").trim();
    return h;
  }
  function headingIn(document, container, fallbackTag) {
    if (!container) return null;
    const h = container.querySelector("h1, h2, h3, h4, h5, h6");
    const src = h || container;
    if (!textOf(src)) return null;
    return flattenInline(document, src, h ? h.tagName.toLowerCase() : fallbackTag);
  }
  function richChildren(document, container) {
    const out = [];
    if (!container) return out;
    [...container.children].forEach((child) => {
      if (!textOf(child) && !child.querySelector("img")) return;
      child.removeAttribute("style");
      child.querySelectorAll("[style]").forEach((s) => s.removeAttribute("style"));
      child.querySelectorAll("a:not([href])").forEach((a) => a.replaceWith(...a.childNodes));
      child.innerHTML = child.innerHTML.replace(/(<br\s*\/?>\s*(&nbsp;| |\s)*)+$/i, "");
      out.push(child);
    });
    if (!out.length && textOf(container)) {
      const p = document.createElement("p");
      p.textContent = textOf(container);
      out.push(p);
    }
    return out;
  }
  function cleanLink(document, a) {
    const link = document.createElement("a");
    link.href = a.getAttribute("href");
    link.textContent = textOf(a);
    return link;
  }
  function validLinks(container, selector) {
    if (!container) return [];
    return [...container.querySelectorAll(selector)].filter((a) => a.getAttribute("href") && textOf(a));
  }
  function linkParas(document, links) {
    return links.map((a) => {
      const p = document.createElement("p");
      p.append(cleanLink(document, a));
      return p;
    });
  }
  function linkList(document, links) {
    if (!links.length) return [];
    if (links.length === 1) return linkParas(document, links);
    const ul = document.createElement("ul");
    links.forEach((a) => {
      const li = document.createElement("li");
      li.append(cleanLink(document, a));
      ul.append(li);
    });
    return [ul];
  }
  var COMPONENTS = ".header, .cta-list, .rte, .image, .text";
  function extractComponent(document, comp, sidebar) {
    const out = [];
    if (comp.matches(".header")) {
      const h = headingIn(document, comp.querySelector(".title"), "h2");
      if (h) out.push(h);
      out.push(...richChildren(document, comp.querySelector(".description")));
      const links = validLinks(comp, ".small-links a");
      out.push(...sidebar ? linkList(document, links) : linkParas(document, links));
    } else if (comp.matches(".cta-list")) {
      const h = headingIn(document, comp.querySelector(".cta-list__header"), sidebar ? "h4" : "h3");
      if (h) out.push(h);
      out.push(...richChildren(document, comp.querySelector(".cta-list__description")));
      const links = validLinks(comp, ".customContent a, .cta-list__links a");
      out.push(...sidebar ? linkList(document, links) : linkParas(document, links));
    } else if (comp.matches(".rte, .text")) {
      out.push(...richChildren(document, comp.querySelector(".cmp-text") || comp));
    } else if (comp.matches(".image")) {
      const img = comp.querySelector("img");
      if (img && img.getAttribute("src")) out.push(img);
    }
    return out;
  }
  function extractColumn(document, col, sidebar) {
    if (!col) return [];
    const comps = [...col.querySelectorAll(COMPONENTS)].filter((c) => !c.closest(".herospace")).filter((c, i, all) => !all.some((o) => o !== c && o.contains(c)));
    if (comps.length) return comps.flatMap((c) => extractComponent(document, c, sidebar));
    const out = [];
    col.querySelectorAll("h1, h2, h3, h4, h5, h6, p, ul, ol, table, img").forEach((n) => {
      if (n.parentElement.closest("p, ul, ol, table, h1, h2, h3, h4, h5, h6")) return;
      if (n.matches("img") || textOf(n)) out.push(n);
    });
    return out;
  }
  function parse(element, { document, params }) {
    const cells = [];
    const main = element.querySelector(".main-content") || element.querySelector(":scope > .content-area > div:not(aside)");
    const aside = element.querySelector("aside, .secondary-content");
    const hoist = [];
    if (main) {
      main.querySelectorAll(".herospace").forEach((h) => hoist.push(h));
      [...main.querySelectorAll("table")].forEach((t) => {
        const head = t.querySelector("tr");
        if (head && /hero/i.test(textOf(head)) && !hoist.some((h) => h.contains(t))) hoist.push(t);
      });
    }
    hoist.forEach((h) => element.before(h));
    const mainCell = extractColumn(document, main, false);
    const asideCell = extractColumn(document, aside, true);
    if (mainCell.length || asideCell.length) {
      cells.push([mainCell.length ? mainCell : "", asideCell.length ? asideCell : ""]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-sidebar", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  var UNIT_SELECTORS = {
    productCard: [
      "div.experiencefragment .cta-product-card .cta-product-card-block",
      "div.cta-product-card .cta-product-card-block",
      "div.cta-product-card.hidden .cta-product-card-block",
      ".cta-product-card-block"
    ],
    firmCard: ["div.product-card.v1", ".product-card__block"],
    // FP-design units: linked icon tiles and image feature cards
    iconCard: ["div.icon-card.v1", ".icon-card__block"],
    featureCard: ["div.feature-card.v1", ".feature-card__block"]
  };
  function unitsOf(root, selectors) {
    const found = [];
    selectors.forEach((sel) => {
      let list = [];
      try {
        list = [...root.querySelectorAll(sel)];
      } catch (e) {
        list = [];
      }
      list.forEach((el) => {
        if (!found.includes(el)) found.push(el);
      });
    });
    return found.filter((el) => !found.some((o) => o !== el && o.contains(el)));
  }
  function inlineHeading(document, src, tag) {
    const h = document.createElement(tag);
    h.innerHTML = src.innerHTML;
    h.querySelectorAll("div, span").forEach((w) => w.replaceWith(...w.childNodes));
    h.innerHTML = h.innerHTML.trim();
    return h;
  }
  function descriptionNodes(document, src) {
    if (!src) return [];
    const blocks = [...src.querySelectorAll(":scope > p, :scope > ul, :scope > ol")];
    if (blocks.length) return blocks.filter((b) => b.textContent.trim() || b.querySelector("img"));
    if (!src.textContent.trim()) return [];
    const p = document.createElement("p");
    p.innerHTML = src.innerHTML.trim();
    return [p];
  }
  function makeLink(document, a) {
    const link = document.createElement("a");
    link.href = a.getAttribute("href");
    link.textContent = a.textContent.trim();
    if (a.getAttribute("title")) link.title = a.getAttribute("title");
    return link;
  }
  function ctaParagraph(document, a) {
    const p = document.createElement("p");
    p.append(makeLink(document, a));
    return p;
  }
  function linkList2(document, links) {
    const ul = document.createElement("ul");
    links.forEach((a) => {
      const li = document.createElement("li");
      li.append(makeLink(document, a));
      ul.append(li);
    });
    return ul;
  }
  function imageFrom(card) {
    const pic = card.querySelector("picture");
    if (pic) return pic;
    const img = card.querySelector("img");
    return img || null;
  }
  function parseCtaList(document, card) {
    const body = [];
    const title = card.querySelector(".cta-list__header h1, .cta-list__header h2, .cta-list__header h3, .cta-list__header h4, .cta-list__header h5, .cta-list__header h6, .list-header h4");
    if (title && title.textContent.trim()) body.push(inlineHeading(document, title, "h3"));
    body.push(...descriptionNodes(document, card.querySelector(".cta-list__description, .list-description")));
    const custom = card.querySelector(".customContent");
    if (custom && custom.textContent.trim()) body.push(...[...custom.children]);
    card.querySelectorAll(".cta-list__links a[href]").forEach((a) => {
      if (a.textContent.trim()) body.push(ctaParagraph(document, a));
    });
    return { image: imageFrom(card.querySelector(".cta-list__content") || card), body };
  }
  function parseProductLine(document, card) {
    const body = [];
    const wrapLink = card.querySelector("a.product-line-card__cta");
    const titleSrc = card.querySelector(".product-line-card__title");
    if (titleSrc && titleSrc.textContent.trim()) {
      const h = inlineHeading(document, titleSrc, "h3");
      if (wrapLink && wrapLink.getAttribute("href")) {
        const a = document.createElement("a");
        a.href = wrapLink.getAttribute("href");
        a.innerHTML = h.innerHTML;
        h.replaceChildren(a);
      }
      body.push(h);
    }
    body.push(...descriptionNodes(document, card.querySelector(".product-line-card__description")));
    card.querySelectorAll("a.product-line-card__action[href], a.cta-arrow-button[href]").forEach((a) => {
      if (a !== wrapLink && a.textContent.trim()) body.push(ctaParagraph(document, a));
    });
    return { image: imageFrom(card), body };
  }
  function parseLogoCard(document, card) {
    const body = [];
    const title = card.querySelector(".logo-title, .title, h2, h3, h4");
    if (title && title.textContent.trim()) body.push(inlineHeading(document, title, "h3"));
    const link = card.querySelector("a[href]");
    if (link && link.textContent.trim()) body.push(ctaParagraph(document, link));
    return { image: imageFrom(card), body };
  }
  function parseProductCard(document, card) {
    const body = [];
    const titleSrc = card.querySelector(".card-content > .title") || card.querySelector(".title");
    if (titleSrc && titleSrc.textContent.trim()) {
      const h = inlineHeading(document, titleSrc, "h3");
      h.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((x) => x.replaceWith(...x.childNodes));
      h.innerHTML = h.innerHTML.replace(/\s+/g, " ").trim();
      body.push(h);
    }
    body.push(...descriptionNodes(document, card.querySelector(".description")));
    const groups = [...card.querySelectorAll(".cta-section .small-links")].map((g) => [...g.querySelectorAll("a[href]")].filter((a) => a.textContent.trim())).filter((g) => g.length);
    let columns = false;
    if (groups.length > 1) {
      groups.forEach((g) => body.push(linkList2(document, g)));
      columns = true;
    } else {
      card.querySelectorAll(".cta-section a[href]").forEach((a) => {
        if (a.textContent.trim()) body.push(ctaParagraph(document, a));
      });
    }
    return { image: imageFrom(card), body, columns };
  }
  function parseFirmCard(document, card) {
    const body = [];
    const title = card.querySelector(".product-card__title, .product-card__header, .product-card__product-name, h2, h3, h4");
    if (title && title.textContent.trim()) body.push(inlineHeading(document, title, "h3"));
    body.push(...descriptionNodes(document, card.querySelector(".product-card__product-description")));
    const seen = /* @__PURE__ */ new Set();
    card.querySelectorAll(".product-card__links a[href], .product-card__cta-section a[href]").forEach((a) => {
      const key = a.getAttribute("href");
      if (!a.textContent.trim() || seen.has(key)) return;
      seen.add(key);
      body.push(ctaParagraph(document, a));
    });
    return { image: imageFrom(card.querySelector(".product-card__image") || card), body };
  }
  function parseIconCard(document, card) {
    const body = [];
    const title = card.querySelector(".icon-card__title, h2, h3, h4");
    if (title && title.textContent.trim()) body.push(inlineHeading(document, title, "h3"));
    body.push(...descriptionNodes(document, card.querySelector(".icon-card__description")));
    const a = card.querySelector("a.icon-card__link[href], a[href]");
    if (a) {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = title && title.textContent.replace(/\s+/g, " ").trim() || "Learn more";
      p.append(link);
      body.push(p);
    }
    return { image: null, body };
  }
  function parseFeatureCard(document, card) {
    const body = [];
    const title = card.querySelector(".feature-card__title, h2, h3, h4");
    if (title && title.textContent.trim()) body.push(inlineHeading(document, title, "h3"));
    body.push(...descriptionNodes(document, card.querySelector(".feature-card__description")));
    card.querySelectorAll(".feature-card__links a[href]").forEach((a) => {
      if (a.textContent.trim()) body.push(ctaParagraph(document, a));
    });
    return { image: imageFrom(card.querySelector(".feature-card__image") || card), body };
  }
  function parsePromoCard(document, card) {
    const body = [];
    const heading = card.querySelector(".heading");
    if (heading && heading.textContent.trim()) body.push(inlineHeading(document, heading, "h3"));
    body.push(...descriptionNodes(document, card.querySelector(".content .cmp-text") || card.querySelector(".content")));
    card.querySelectorAll(".action a[href]").forEach((a) => {
      if (a.textContent.trim()) body.push(ctaParagraph(document, a));
    });
    return { image: imageFrom(card.querySelector(".imagery") || card), body };
  }
  function parse2(element, { document, params }) {
    const root = element;
    let items = [];
    const ctaLists = [...root.querySelectorAll(".cta-list")];
    const productLines = [...root.querySelectorAll(".product-line-card")].filter((c) => c.querySelector(".product-line-card__title, .product-line-card__description"));
    const logoCards = [...root.querySelectorAll(".logo-card")];
    const productCards = unitsOf(root, UNIT_SELECTORS.productCard);
    const firmCards = unitsOf(root, UNIT_SELECTORS.firmCard);
    let firm = false;
    if (productCards.length && !ctaLists.length && !productLines.length && !logoCards.length) {
      items = productCards.map((c) => parseProductCard(document, c));
    } else if (ctaLists.length) items = ctaLists.map((c) => parseCtaList(document, c));
    else if (productLines.length) items = productLines.map((c) => parseProductLine(document, c));
    else if (logoCards.length) items = logoCards.map((c) => parseLogoCard(document, c));
    else if (firmCards.length) {
      items = firmCards.map((c) => parseFirmCard(document, c));
      firm = true;
    } else if (unitsOf(root, UNIT_SELECTORS.featureCard).length) {
      items = unitsOf(root, UNIT_SELECTORS.featureCard).map((c) => parseFeatureCard(document, c));
    } else if (unitsOf(root, UNIT_SELECTORS.iconCard).length) {
      items = unitsOf(root, UNIT_SELECTORS.iconCard).map((c) => parseIconCard(document, c));
    } else if (root.querySelector(".promo-card .card")) {
      items = [...root.querySelectorAll(".promo-card .card")].map((c) => parsePromoCard(document, c));
    } else {
      items = [...root.querySelectorAll(":scope > div, :scope > * > div")].filter((c) => c.querySelector("h2, h3, h4")).map((c) => {
        const body = [];
        const h = c.querySelector("h2, h3, h4");
        body.push(inlineHeading(document, h, "h3"));
        c.querySelectorAll("p").forEach((p) => {
          if (p.textContent.trim()) body.push(p);
        });
        c.querySelectorAll("a[href], button").forEach((ctl) => {
          const label = ctl.textContent.replace(/\s+/g, " ").trim();
          if (!label || ctl.closest("p")) return;
          const href = ctl.tagName === "A" ? ctl.getAttribute("href") : params && params.originalURL;
          if (!href || href === "#") return;
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.href = href;
          a.textContent = label;
          p.append(a);
          body.push(p);
        });
        return { image: imageFrom(c), body };
      });
    }
    items = items.filter((it) => it.image || it.body.length);
    if (!items.length) {
      if (!element.textContent.trim() && !element.querySelector("img")) element.remove();
      return;
    }
    const hasImages = items.some((it) => it.image);
    const hasBodies = items.some((it) => it.body.length);
    items.forEach((it) => it.body.forEach((n) => n.removeAttribute && n.removeAttribute("style")));
    const linkColumns = items.some((it) => it.columns);
    const cells = items.map((it) => {
      if (hasImages && hasBodies) return [it.image || "", it.body];
      return [hasImages ? it.image : it.body];
    });
    const isAlt = firm || logoCards.length > 0 && !ctaLists.length && !productLines.length || !!root.querySelector(".cta-list .content-area.vertical");
    let name = isAlt ? "cards-product (alt)" : "cards-product";
    if (linkColumns) name = "cards-product (link-columns)";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  var COMPONENTS2 = ".image, .ibm-video, .video-container, .header, .cta-list, .rte, .cta-icon-card, .promo-image-card";
  function textOf2(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function flattenInline2(document, src, tag) {
    const h = document.createElement(tag);
    h.innerHTML = src.innerHTML;
    [...h.querySelectorAll("*")].forEach((d) => {
      if (!d.matches("sup, sub, em, strong, b, i, a, br")) d.replaceWith(...d.childNodes);
    });
    h.innerHTML = h.innerHTML.replace(/\s+/g, " ").trim();
    return h;
  }
  function headingFrom(document, container, fallbackTag) {
    if (!container) return null;
    const h = container.matches("h1, h2, h3, h4, h5, h6") ? container : container.querySelector("h1, h2, h3, h4, h5, h6");
    const src = h || container;
    if (!textOf2(src)) return null;
    const tag = h ? h.tagName.toLowerCase() : fallbackTag;
    return flattenInline2(document, src, tag);
  }
  function richChildren2(document, container) {
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
  function linkParas2(document, links) {
    return links.filter((a) => a && a.getAttribute("href") && textOf2(a)).map((a) => {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = textOf2(a);
      p.append(link);
      return p;
    });
  }
  function imageEl(img) {
    if (!img || !img.getAttribute("src")) return null;
    return img;
  }
  function videoLink(document, iframe) {
    const src = iframe && (iframe.getAttribute("src") || iframe.getAttribute("data-src"));
    if (!src) return null;
    const p = document.createElement("p");
    const a = document.createElement("a");
    a.href = src.startsWith("//") ? `https:${src}` : src;
    a.textContent = a.href;
    p.append(a);
    return p;
  }
  function extractComponent2(document, comp) {
    const out = [];
    if (comp.matches(".ibm-video, .video-container") || comp.querySelector("iframe") && !textOf2(comp)) {
      const v = videoLink(document, comp.querySelector("iframe"));
      if (v) out.push(v);
    } else if (comp.matches(".image")) {
      const img = imageEl(comp.querySelector("img"));
      if (img) out.push(img);
    } else if (comp.matches(".header")) {
      const h = headingFrom(document, comp.querySelector(".title"), "h2");
      if (h) out.push(h);
      out.push(...richChildren2(document, comp.querySelector(".description")));
      out.push(...linkParas2(document, [...comp.querySelectorAll(".small-links a")]));
    } else if (comp.matches(".cta-list")) {
      const h = headingFrom(document, comp.querySelector(".cta-list__header"), "h3");
      if (h) out.push(h);
      out.push(...richChildren2(document, comp.querySelector(".cta-list__description")));
      out.push(...linkParas2(document, [...comp.querySelectorAll(".customContent a, .cta-list__links a")]));
    } else if (comp.matches(".rte")) {
      out.push(...richChildren2(document, comp.querySelector(".cmp-text") || comp));
    } else if (comp.matches(".cta-icon-card")) {
      const img = imageEl(comp.querySelector(".icon-image img"));
      if (img) {
        const p = document.createElement("p");
        p.append(img);
        out.push(p);
      }
      const title = comp.querySelector(".card-content .title");
      const titleHeading = title && title.querySelector("h1, h2, h3, h4, h5, h6");
      if (titleHeading && textOf2(titleHeading)) {
        out.push(headingFrom(document, titleHeading, "h3"));
      } else if (title && textOf2(title)) {
        const p = document.createElement("p");
        const strong = flattenInline2(document, title, "strong");
        p.append(strong);
        out.push(p);
      }
      out.push(...richChildren2(document, comp.querySelector(".description")));
      out.push(...linkParas2(document, [...comp.querySelectorAll(".cta-arrow-button-wrapper a")]));
    } else if (comp.matches(".promo-image-card")) {
      const img = imageEl(comp.querySelector(".promo-image-card__image img"));
      if (img) {
        const p = document.createElement("p");
        p.append(img);
        out.push(p);
      }
      const h = headingFrom(document, comp.querySelector(".promo-image-card__title"), "h3");
      if (h) out.push(h);
      out.push(...richChildren2(document, comp.querySelector(".promo-image-card__description")));
      out.push(...linkParas2(document, [...comp.querySelectorAll(".promo-image-card__link a")]));
    }
    return out;
  }
  function extractColumn2(document, col) {
    const comps = [...col.querySelectorAll(COMPONENTS2)].filter((c, i, all) => !all.some((o) => o !== c && o.contains(c)));
    if (!comps.length) {
      const out = [];
      col.querySelectorAll("h1, h2, h3, h4, h5, h6, p, ul, ol, img").forEach((n) => {
        if (n.closest("p, ul, ol") && n.tagName !== "P" && n.tagName !== "UL" && n.tagName !== "OL") return;
        if (n.matches("img") || textOf2(n)) out.push(n);
      });
      const iframe = col.querySelector("iframe");
      if (iframe) out.push(videoLink(document, iframe));
      return out.filter(Boolean);
    }
    return comps.flatMap((c) => extractComponent2(document, c));
  }
  function v1Text(document, box, titleSel, descSel, linkSel) {
    const out = [];
    const h = headingFrom(document, box.querySelector(titleSel), "h3");
    if (h) out.push(h);
    out.push(...richChildren2(document, box.querySelector(descSel)));
    out.push(...linkParas2(document, [...box.querySelectorAll(linkSel)]));
    return out;
  }
  function parseV1(document, element) {
    const feature = element.matches(".feature-50-50__content") ? element : element.querySelector(".feature-50-50__content");
    if (feature) {
      const media = [];
      const img = imageEl(feature.querySelector(".feature-50-50__image img"));
      if (img) media.push(img);
      const iframe = feature.querySelector(".feature-50-50__image iframe");
      if (iframe) media.push(videoLink(document, iframe));
      const text5 = v1Text(
        document,
        feature,
        ".feature-50-50__title",
        ".feature-50-50__description",
        ".feature-50-50__links a, .feature-50-50__link a, .feature-50-50__cta a"
      );
      const imageRight = feature.matches(".image-right");
      const row = imageRight ? [text5, media] : [media, text5];
      const scope = feature.closest(".feature-50-50") || element;
      let gradient = false;
      for (let n = feature; n && !gradient; n = n === scope ? null : n.parentElement) {
        gradient = [...n.classList].some((c) => c.startsWith("color-grad-"));
      }
      const options = [imageRight ? null : "image-left", gradient ? "gradient" : null].filter(Boolean);
      return { row: row.map((c) => c.length ? c : ""), variant: options.join(", ") || null };
    }
    const columns = [...element.querySelectorAll(".flexible-width-container__columns > .flexible-width-container__column")];
    if (columns.length >= 2) {
      const row = columns.map((col) => {
        const out = [];
        col.querySelectorAll(".flexible-content-area__content").forEach((box) => {
          out.push(...v1Text(
            document,
            box,
            ".flexible-content-area__title",
            ".flexible-content-area__description",
            ".flexible-content-area__links a"
          ));
        });
        const iframe = col.querySelector("iframe");
        if (iframe) out.push(videoLink(document, iframe));
        if (!out.length) {
          const img = imageEl(col.querySelector("img"));
          if (img) out.push(img);
        }
        return out.filter(Boolean);
      });
      return { row: row.map((c) => c.length ? c : ""), variant: "alt" };
    }
    return null;
  }
  function parseFeatureAccordion(document, element) {
    const root = element.matches(".feature-accordion__content") ? element : element.querySelector(".feature-accordion__content");
    if (!root || !root.querySelector(".feature-accordion__card")) return null;
    const out = [];
    const title = headingFrom(document, root.querySelector(".feature-accordion__title"), "h2");
    if (title) out.push(title);
    root.querySelectorAll(".feature-accordion__card").forEach((card) => {
      const header = card.querySelector(".feature-accordion__card-header");
      const label = card.querySelector(".feature-accordion__card-title") || header;
      if (label && textOf2(label)) {
        const tag = header && /^H[1-6]$/.test(header.tagName) ? header.tagName.toLowerCase() : "h3";
        out.push(flattenInline2(document, label, tag));
      }
      card.querySelectorAll(".feature-accordion__card-description").forEach((d) => {
        if (!textOf2(d)) return;
        if (d.tagName === "P") out.push(flattenInline2(document, d, "p"));
        else out.push(...richChildren2(document, d));
      });
      out.push(...linkParas2(document, [...card.querySelectorAll(".feature-accordion__card-cta a[href]")]));
    });
    const block = root.closest(".feature-accordion__block, .feature-accordion") || element;
    const img = imageEl(block.querySelector(".feature-accordion__image img"));
    if (img) {
      const p = document.createElement("p");
      p.append(img);
      out.push(p);
    }
    return out.length ? out : null;
  }
  function parse3(element, { document, params }) {
    const accordion = parseFeatureAccordion(document, element);
    if (accordion) {
      const block2 = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells: [[accordion]] });
      element.replaceWith(block2);
      return;
    }
    const v1 = parseV1(document, element);
    if (v1) {
      const name2 = v1.variant ? `columns-feature (${v1.variant})` : "columns-feature";
      const block2 = WebImporter.Blocks.createBlock(document, { name: name2, cells: [v1.row] });
      element.replaceWith(block2);
      return;
    }
    const cells = [];
    let variant = null;
    const main = element.querySelector(".main-content");
    const secondary = element.querySelector(".secondary-content");
    const promoCards = [...element.querySelectorAll(".promo-image-card")];
    if (main || secondary) {
      const row = [main, secondary].filter(Boolean).map((col) => extractColumn2(document, col));
      cells.push(row.map((c) => c.length ? c : ""));
      const isDefault = main && secondary && main.querySelector(".image img") && secondary.querySelector(".cta-list");
      if (!isDefault) variant = "alt";
    } else if (promoCards.length) {
      variant = "product-intro";
      cells.push(promoCards.map((card) => extractComponent2(document, card)));
    } else {
      const items = [...element.querySelectorAll(".cta-list")];
      if (items.length) {
        variant = "dark";
        cells.push(items.map((item) => extractComponent2(document, item)));
      } else {
        const col = extractColumn2(document, element);
        if (col.length) cells.push([col]);
      }
    }
    const name = variant ? `columns-feature (${variant})` : "columns-feature";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-page.js
  function parse4(element, { document, params }) {
    const root = element.querySelector(".subpage-herospace-block") || element;
    const content = root.querySelector(".card-content") || root;
    const textCell = [];
    let title = content.querySelector("h1, h2, .title");
    if (title) {
      if (!/^H[1-6]$/.test(title.tagName)) {
        const h1 = document.createElement("h1");
        h1.textContent = title.textContent.trim();
        title = h1;
      } else {
        title.textContent = title.textContent.trim();
      }
      textCell.push(title);
    }
    const desc = content.querySelector(".description");
    if (desc && desc.textContent.trim()) {
      const blocks = [...desc.querySelectorAll(":scope > p, :scope > ul, :scope > ol")];
      if (blocks.length) {
        textCell.push(...blocks);
      } else {
        const p = document.createElement("p");
        p.innerHTML = desc.innerHTML;
        textCell.push(p);
      }
    }
    [...content.querySelectorAll("a[href]")].filter((a) => !(desc && desc.contains(a)) && a.textContent.trim()).forEach((a) => {
      const p = document.createElement("p");
      p.append(a);
      textCell.push(p);
    });
    const imageCell = [];
    const img = root.querySelector(".image img, picture img, img");
    if (img) imageCell.push(img.closest("picture") || img);
    const cells = [[textCell, imageCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-page", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/contact-form.js
  var NBSP_ONLY = /^[\s ]*$/;
  var INPUT_TYPES = ["text", "email", "tel", "number", "password", "date", "search", "url", "checkbox", "radio"];
  function hasContent(el) {
    return !NBSP_ONLY.test(el.textContent || "") || !!el.querySelector("img, picture, iframe, video");
  }
  function controlType(ctrl) {
    const tag = ctrl.tagName.toLowerCase();
    if (tag === "textarea") return "textarea";
    if (tag === "select") return "select";
    if (tag === "button") {
      const t2 = (ctrl.getAttribute("type") || "submit").toLowerCase();
      return ["submit", "reset"].includes(t2) ? t2 : "button";
    }
    const t = (ctrl.getAttribute("type") || "text").toLowerCase();
    if (t === "submit" || t === "reset") return t;
    return INPUT_TYPES.includes(t) ? t : null;
  }
  function controlLabel(ctrl, form) {
    let text5 = "";
    const id = ctrl.getAttribute("id");
    if (id) {
      const label = [...form.querySelectorAll("label")].find((l) => l.getAttribute("for") === id);
      if (label) {
        const clone = label.cloneNode(true);
        clone.querySelectorAll(".mktoAsterix").forEach((a) => a.remove());
        text5 = clone.textContent.replace(/\s+/g, " ").trim();
      }
    }
    if (!text5 && ctrl.closest("label")) text5 = ctrl.closest("label").textContent.replace(/\s+/g, " ").trim();
    if (!text5) text5 = (ctrl.getAttribute("placeholder") || "").trim();
    if (!text5 && ctrl.tagName.toLowerCase() === "button") text5 = ctrl.textContent.trim();
    if (!text5) text5 = (ctrl.getAttribute("value") || ctrl.getAttribute("name") || "").trim();
    return text5;
  }
  function formRows(form, document) {
    const rows = [];
    const seenGroups = /* @__PURE__ */ new Set();
    const nodes = form.querySelectorAll("input, select, textarea, button, .mktoCaptchaDisclaimer, .mktoHtmlText");
    nodes.forEach((ctrl) => {
      if (ctrl.closest(".g-recaptcha, .grecaptcha-badge")) return;
      if (ctrl.matches(".mktoCaptchaDisclaimer, .mktoHtmlText")) {
        if (!hasContent(ctrl)) return;
        const p = document.createElement("p");
        p.innerHTML = ctrl.innerHTML;
        rows.push([p]);
        return;
      }
      const type = controlType(ctrl);
      if (!type) return;
      if (type === "radio" || type === "checkbox") {
        const name = ctrl.getAttribute("name");
        const group = name ? [...form.querySelectorAll(`input[name="${name}"]`)] : [ctrl];
        if (group.length > 1) {
          if (seenGroups.has(name)) return;
          seenGroups.add(name);
          const ul = document.createElement("ul");
          group.forEach((g) => {
            const li = document.createElement("li");
            li.textContent = controlLabel(g, form);
            ul.append(li);
          });
          const fieldset = ctrl.closest("fieldset");
          const legend = fieldset && fieldset.querySelector("legend");
          rows.push([legend ? legend.textContent.trim() : name, type === "radio" ? "radio" : "checkboxes", ul]);
          return;
        }
      }
      let label = controlLabel(ctrl, form);
      if (!label) return;
      const required = ctrl.hasAttribute("required") || ctrl.getAttribute("aria-required") === "true" || ctrl.classList.contains("mktoRequired");
      if (required && !/\*\s*$/.test(label)) label = `${label} *`;
      let extra = "";
      if (type === "select") {
        const ul = document.createElement("ul");
        [...ctrl.querySelectorAll("option")].forEach((o) => {
          const t = o.textContent.trim();
          if (!t || !o.getAttribute("value")) return;
          const li = document.createElement("li");
          li.textContent = t;
          ul.append(li);
        });
        if (ul.children.length) extra = ul;
      }
      rows.push([label, type, extra]);
    });
    return rows;
  }
  function collect(root, document, out) {
    [...root.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const t = n.textContent.replace(/\s+/g, " ").trim();
        if (t && !NBSP_ONLY.test(t)) {
          const p = document.createElement("p");
          p.textContent = t;
          out.push(p);
        }
        return;
      }
      if (n.nodeType !== 1) return;
      const tag = n.tagName.toLowerCase();
      if (["script", "style", "noscript", "link", "svg", "template"].includes(tag)) return;
      if (tag === "form") {
        out.push({ form: n });
        return;
      }
      if (/^h[1-6]$/.test(tag)) {
        if (NBSP_ONLY.test(n.textContent)) return;
        const h = document.createElement(tag);
        if (n.querySelector("div, p")) h.textContent = n.textContent.replace(/\s+/g, " ").trim();
        else h.innerHTML = n.innerHTML;
        out.push(h);
        return;
      }
      if (["p", "ul", "ol", "table", "blockquote"].includes(tag)) {
        if (hasContent(n)) out.push(n.cloneNode(true));
        return;
      }
      if (tag === "img" || tag === "picture") {
        out.push(n.cloneNode(true));
        return;
      }
      if (tag === "a") {
        if (!hasContent(n)) return;
        const p = document.createElement("p");
        p.append(n.cloneNode(true));
        out.push(p);
        return;
      }
      if (tag === "iframe") {
        const src = n.getAttribute("src") || n.getAttribute("data-src");
        if (!src || n.closest(".g-recaptcha")) return;
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = src;
        a.textContent = src;
        p.append(a);
        out.push(p);
        return;
      }
      if (tag === "button") {
        if (n.querySelector("h1, h2, h3, h4, h5, h6")) {
          collect(n, document, out);
        } else if (n.closest(".accordion-title") && !NBSP_ONLY.test(n.textContent)) {
          const h = document.createElement("h3");
          h.textContent = n.textContent.replace(/\s+/g, " ").trim();
          out.push(h);
        }
        return;
      }
      if (["input", "select", "textarea", "label"].includes(tag)) return;
      collect(n, document, out);
    });
    return out;
  }
  function parse5(element, { document, params }) {
    let variant = null;
    if (element.querySelector("form, .marketo-form")) variant = "alt";
    else if (element.matches(".flexible-width-container") || element.querySelector(".flexible-width-container__wrapper")) variant = "red";
    const items = collect(element, document, []);
    const cells = [];
    let group = [];
    const flush = () => {
      if (group.length) cells.push([group]);
      group = [];
    };
    items.forEach((item) => {
      if (item && item.form) {
        flush();
        formRows(item.form, document).forEach((row) => cells.push(row));
      } else {
        group.push(item);
      }
    });
    flush();
    if (!cells.length) cells.push([""]);
    cells.flat(2).forEach((el) => {
      if (!el || typeof el === "string" || !el.querySelectorAll) return;
      [el, ...el.querySelectorAll("*")].forEach((n) => {
        n.removeAttribute("style");
        n.removeAttribute("class");
        n.removeAttribute("id");
      });
    });
    const name = variant ? `contact-form (${variant})` : "contact-form";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-video.js
  function absolute(url) {
    if (!url) return "";
    try {
      return new URL(url.replace(/&amp;/g, "&"), "https://www.jackson.com").href;
    } catch (e) {
      return url;
    }
  }
  function parse6(element, { document, params }) {
    const content = [];
    let src = "";
    const iframe = element.querySelector("iframe");
    if (iframe) src = iframe.getAttribute("src") || iframe.getAttribute("data-src") || "";
    if (!src) {
      const video = element.querySelector("video source[src], video[src]");
      if (video) src = video.getAttribute("src");
    }
    if (!src) {
      const vjs = element.querySelector("video-js[data-video-id], video[data-video-id]");
      if (vjs) {
        const account = vjs.getAttribute("data-account");
        const player = vjs.getAttribute("data-player") || "default";
        const id = vjs.getAttribute("data-video-id");
        if (account && id) src = `https://players.brightcove.net/${account}/${player}_default/index.html?videoId=${id}`;
      }
    }
    if (!src) {
      const a = element.querySelector("a[href]");
      if (a) src = a.getAttribute("href");
    }
    const poster = element.querySelector("img");
    if (poster) content.push(poster.closest("picture") || poster);
    const heading = element.querySelector("h1, h2, h3, h4, h5, h6");
    if (heading && heading.textContent.trim()) content.push(heading);
    if (src) {
      const href = absolute(src);
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = href;
      a.textContent = href;
      p.append(a);
      content.push(p);
    }
    const cells = [[content]];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-video", cells });
    element.replaceWith(block);
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
  function parse7(element, { document, params }) {
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

  // tools/importer/parsers/cards-tool.js
  function cleanInline(document, src, tag) {
    const el = document.createElement(tag);
    el.innerHTML = src.innerHTML;
    el.querySelectorAll("div, span").forEach((w) => w.replaceWith(...w.childNodes));
    el.innerHTML = el.innerHTML.trim();
    return el;
  }
  function para(document, text5) {
    const p = document.createElement("p");
    p.textContent = text5;
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
      const text5 = cap && cap.textContent.trim();
      return { image: null, body: [], caption: text5 ? para(document, text5) : null };
    }
    return { image: logo, body };
  }
  function parse8(element, { document, params }) {
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

  // tools/importer/parsers/cards-feature.js
  function textOf3(el) {
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
    if (!src || !textOf3(src)) return null;
    const h = document.createElement(`h${headingLevel(src, fallback)}`);
    h.innerHTML = src.innerHTML.trim();
    [...h.querySelectorAll("*")].forEach((d) => {
      if (!d.matches("sup, sub, em, strong, b, i, a, br")) d.replaceWith(...d.childNodes);
    });
    h.innerHTML = h.innerHTML.replace(/\s+/g, " ").trim();
    if (!textOf3(h)) h.textContent = textOf3(src);
    return h;
  }
  function cleanDescription(document, desc) {
    const out = [];
    if (!desc) return out;
    [...desc.children].forEach((child) => {
      if (!textOf3(child) && !child.querySelector("img, picture")) return;
      child.removeAttribute("style");
      child.querySelectorAll("[style]").forEach((s) => s.removeAttribute("style"));
      out.push(child);
    });
    if (!out.length && textOf3(desc)) {
      const p = document.createElement("p");
      p.textContent = textOf3(desc);
      out.push(p);
    }
    return out;
  }
  function ctaParagraphs(document, links) {
    return links.filter((a) => a && a.getAttribute("href") && textOf3(a)).map((a) => {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = textOf3(a);
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
  function parseProductCard2(element, document) {
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
      if (head && textOf3(head)) {
        const h = document.createElement("h3");
        const a = document.createElement("a");
        a.href = head.getAttribute("href");
        a.textContent = textOf3(head);
        h.append(a);
        body.push(h);
      }
      const links = [...section.querySelectorAll(":scope > .link a[href]")].filter((a) => textOf3(a));
      if (links.length) {
        const ul = document.createElement("ul");
        links.forEach((src) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = src.getAttribute("href");
          a.textContent = textOf3(src);
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
  function parse9(element, { document, params }) {
    if (element.closest(".cta-product-card-block")) {
      parseProductCard2(element, document);
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
        if (!textOf3(child) && !child.querySelector("img")) return;
        const img = child.querySelector("img");
        const body = [];
        const h = makeHeading(document, child.querySelector("h1, h2, h3, h4, h5, h6, .title"), 3);
        if (h) body.push(h);
        child.querySelectorAll("p, ul, ol").forEach((p) => {
          if (textOf3(p)) body.push(p);
        });
        const loose = [...child.querySelectorAll(".small-links a[href], .cta-arrow-button-wrapper a[href], a.primary-button[href], a.secondary-button[href]")].filter((a, i, all) => all.indexOf(a) === i && !body.some((n) => n.contains && n.contains(a)));
        body.push(...ctaParagraphs(document, loose));
        if (!body.length && !img) return;
        const prev = cells[cells.length - 1];
        if (!img && prev && body.every((n) => n.tagName === "P" && n.querySelector("a") && textOf3(n) === textOf3(n.querySelector("a")))) {
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

  // tools/importer/parsers/cards-video.js
  function absolute2(url) {
    if (!url) return "";
    try {
      return new URL(url.replace(/&amp;/g, "&"), "https://www.jackson.com").href;
    } catch (e) {
      return url;
    }
  }
  function videoSrc(scope) {
    const iframe = scope.querySelector("iframe");
    if (iframe) {
      const s = iframe.getAttribute("src") || iframe.getAttribute("data-src");
      if (s) return s;
    }
    const source = scope.querySelector("video source[src], video[src]");
    if (source) return source.getAttribute("src");
    const vjs = scope.querySelector("video-js[data-video-id], video[data-video-id]");
    if (vjs && vjs.getAttribute("data-account")) {
      const player = vjs.getAttribute("data-player") || "default";
      return `https://players.brightcove.net/${vjs.getAttribute("data-account")}/${player}_default/index.html?videoId=${vjs.getAttribute("data-video-id")}`;
    }
    return "";
  }
  function parseItem(document, item) {
    const media = [];
    const poster = item.querySelector(".video-container img, .ibm-video img, .poster img");
    if (poster) media.push(poster.closest("picture") || poster);
    const src = videoSrc(item);
    if (src) {
      const href = absolute2(src);
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = href;
      a.textContent = href;
      p.append(a);
      media.push(p);
    }
    const body = [];
    const text5 = item.querySelector(".cmp-text") || item.querySelector(".rte");
    const iconCard = !text5 && item.querySelector(".cta-icon-card-block .card-content");
    if (iconCard) {
      const icon = item.querySelector(".cta-icon-card-block .icon-image img, .cta-icon-card-block img");
      if (icon && icon.getAttribute("src") && !iconCard.contains(icon)) {
        const p = document.createElement("p");
        p.append(icon);
        body.push(p);
      }
      const title = iconCard.querySelector(".title");
      if (title && title.textContent.trim()) {
        const h = document.createElement("h3");
        h.innerHTML = (title.querySelector("span") || title).innerHTML.trim();
        body.push(h);
      }
      const desc = iconCard.querySelector(".description");
      if (desc) {
        [...desc.children].forEach((c) => {
          if (c.textContent.trim()) body.push(c);
        });
      }
      iconCard.querySelectorAll(".cta-arrow-button-wrapper a[href]").forEach((a) => {
        const p = document.createElement("p");
        const link = document.createElement("a");
        link.href = a.getAttribute("href");
        link.textContent = a.textContent.replace(/\s+/g, " ").trim();
        p.append(link);
        body.push(p);
      });
    }
    if (text5) {
      [...text5.children].forEach((child) => {
        if (/^H[1-6]$/.test(child.tagName)) {
          child.querySelectorAll("br").forEach((br) => {
            if (!br.previousSibling || !br.previousSibling.textContent.trim()) br.remove();
          });
          child.innerHTML = child.innerHTML.trim();
          if (!child.textContent.trim()) return;
          const h = document.createElement("h3");
          h.innerHTML = child.innerHTML;
          body.push(h);
        } else if (child.textContent.trim() || child.querySelector("img")) {
          body.push(child);
        }
      });
    }
    return { media, body };
  }
  function parse10(element, { document, params }) {
    let items = [...element.querySelectorAll(".main-content, .secondary-content, .tertiary-content")].filter((c) => c.querySelector("iframe, video, video-js, .ibm-video"));
    if (!items.length) {
      items = [...element.querySelectorAll(".ibm-video, .video-container")].filter((v) => !v.parentElement.closest(".ibm-video, .video-container")).map((v) => v.parentElement);
      items = items.filter((v, i) => items.indexOf(v) === i);
    }
    const cells = items.map((it) => parseItem(document, it)).filter((it) => it.media.length || it.body.length).map((it) => [it.media.length ? it.media : "", it.body.length ? it.body : ""]);
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-video", cells });
    element.replaceWith(block);
  }

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
  function slugify(text5) {
    return String(text5 || "").toLowerCase().replace(/&amp;/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "tab";
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
    const text5 = clone.textContent.replace(/\s+/g, " ").trim();
    const link = clone.querySelector("a[href]");
    if (link && text5) {
      const a = document.createElement("a");
      a.href = link.getAttribute("href");
      a.textContent = text5;
      parts.push(a);
    } else if (text5) {
      parts.push(text5);
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
  function parse11(element, { document, params }) {
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
            const text5 = t.textContent.replace(/\s+/g, " ").trim();
            if (!text5) {
              t.remove();
              return;
            }
            const h = document.createElement("h3");
            h.textContent = text5;
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

  // tools/importer/parsers/accordion-manager.js
  function cleanHeading(document, el, fallbackTag) {
    const tag = el && /^H[1-6]$/.test(el.tagName) ? el.tagName.toLowerCase() : fallbackTag;
    const h = document.createElement(tag);
    if (!el) return h;
    const walk = (node) => {
      node.childNodes.forEach((n) => {
        if (n.nodeType === 3) {
          h.append(document.createTextNode(n.textContent.replace(/\s+/g, " ")));
        } else if (n.nodeType === 1 && /^(SUP|SUB)$/.test(n.tagName)) {
          const s = document.createElement(n.tagName.toLowerCase());
          s.textContent = n.textContent.trim();
          h.append(s);
        } else if (n.nodeType === 1) {
          walk(n);
        }
      });
    };
    walk(el);
    h.normalize();
    if (h.firstChild && h.firstChild.nodeType === 3) h.firstChild.textContent = h.firstChild.textContent.trimStart();
    if (h.lastChild && h.lastChild.nodeType === 3) h.lastChild.textContent = h.lastChild.textContent.trimEnd();
    return h;
  }
  function bodyContent(container) {
    if (!container) return [];
    const text5 = container.querySelector(".cmp-text") || container;
    const kids = [...text5.children].filter((c) => c.textContent.trim() || c.querySelector("img"));
    return kids;
  }
  function parse12(element, { document, params }) {
    const cells = [];
    const promoItems = [...element.querySelectorAll(".promo-area__content-area")];
    if (promoItems.length) {
      promoItems.forEach((item) => {
        const img = item.querySelector(".promo-area__image-wrapper img");
        const headingEl = item.querySelector(".promo-area__heading h1, .promo-area__heading h2, .promo-area__heading h3, .promo-area__heading h4, .promo-area__heading h5, .promo-area__heading h6") || item.querySelector(".promo-area__heading");
        const name = headingEl && headingEl.textContent.trim() ? cleanHeading(document, headingEl, "h5") : "";
        const details = bodyContent(item.querySelector(".promo-area__description"));
        const action = item.querySelector(".promo-area__action");
        if (action) {
          [...action.querySelectorAll("a[href]")].filter((a) => a.textContent.trim()).forEach((a) => {
            const p = document.createElement("p");
            p.append(a);
            details.push(p);
          });
        }
        if (!img && !name && !details.length) return;
        const row = [img || "", name];
        if (details.length) row.push(details);
        else row.push("");
        cells.push(row);
      });
    } else {
      const items = [...element.querySelectorAll(".accordion-item")];
      items.forEach((item) => {
        const titleEl = item.querySelector(".accordion-title button, .accordion-title");
        const name = titleEl && titleEl.textContent.trim() ? cleanHeading(document, null, "h5") : "";
        if (name) name.textContent = titleEl.textContent.replace(/\s+/g, " ").trim();
        const img = item.querySelector(".accordion-title img");
        const details = bodyContent(item.querySelector(".accordion-description"));
        if (!name && !details.length) return;
        cells.push([img || "", name, details.length ? details : ""]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-manager", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-benefits.js
  function textOf4(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function flattenInline3(document, src, tag) {
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
    const hs = [...container.querySelectorAll("h1, h2, h3, h4, h5, h6")].filter((h) => textOf4(h));
    if (!hs.length) return null;
    return flattenInline3(document, hs[0], hs[0].tagName.toLowerCase());
  }
  function richChildren3(document, container) {
    const out = [];
    if (!container) return out;
    [...container.children].forEach((child) => {
      if (!textOf4(child) && !child.querySelector("img")) return;
      child.removeAttribute("style");
      child.querySelectorAll("[style]").forEach((s) => s.removeAttribute("style"));
      child.innerHTML = child.innerHTML.replace(/(<br\s*\/?>\s*(&nbsp;| |\s)*)+$/i, "");
      out.push(child);
    });
    if (!out.length && textOf4(container)) {
      const p = document.createElement("p");
      p.textContent = textOf4(container);
      out.push(p);
    }
    return out;
  }
  function linkParas3(document, links) {
    return links.filter((a) => a && a.getAttribute("href") && textOf4(a)).map((a) => {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = textOf4(a);
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
    intro.push(...richChildren3(document, content.querySelector(".description")));
    intro.push(...linkParas3(document, [...content.querySelectorAll(".action a")]));
    const benefits = [];
    const stats = spot.querySelector(".stats-container");
    if (stats) {
      const titleEl = stats.querySelector(".stat-title");
      const th = titleEl && (titleEl.querySelector("h1, h2, h3, h4, h5, h6") || titleEl);
      if (th && textOf4(th)) {
        const tag = th.matches("h1, h2, h3, h4, h5, h6") ? th.tagName.toLowerCase() : "h4";
        benefits.push(flattenInline3(document, th, tag));
      }
      const ul = document.createElement("ul");
      const headers = [...stats.querySelectorAll(".stat-header")];
      headers.forEach((header) => {
        const li = document.createElement("li");
        const hSrc = [...header.querySelectorAll("h1, h2, h3, h4, h5, h6")].find((x) => textOf4(x));
        if (hSrc) {
          const hEl = flattenInline3(document, hSrc, hSrc.tagName === "H1" ? "h2" : hSrc.tagName.toLowerCase());
          hEl.querySelectorAll("b, strong").forEach((x) => x.replaceWith(...x.childNodes));
          hEl.querySelectorAll("sup, sub").forEach((x) => {
            if (!textOf4(x)) x.remove();
          });
          hEl.innerHTML = hEl.innerHTML.replace(/(&nbsp;|\s)+$/, "").replace(/^(&nbsp;|\s)+/, "");
          li.append(hEl);
          let d = header.nextElementSibling;
          if (d && !d.classList.contains("stat-description")) d = null;
          if (d && textOf4(d)) {
            const para3 = flattenInline3(document, d, "p");
            para3.querySelectorAll("b, strong").forEach((x) => x.replaceWith(...x.childNodes));
            li.append(para3);
          }
          if (textOf4(li)) ul.append(li);
          return;
        }
        const strong = flattenInline3(document, header, "strong");
        strong.querySelectorAll("b, strong").forEach((b) => b.replaceWith(...b.childNodes));
        strong.innerHTML = strong.innerHTML.replace(/(&nbsp;|\s)+$/, "").replace(/^(&nbsp;|\s)+/, "");
        if (textOf4(strong)) li.append(strong);
        let desc = header.nextElementSibling;
        if (desc && !desc.classList.contains("stat-description")) desc = null;
        if (desc && textOf4(desc)) {
          const span = flattenInline3(document, desc, "span");
          span.querySelectorAll("b, strong").forEach((b) => b.replaceWith(...b.childNodes));
          if (li.childNodes.length) li.append(document.createElement("br"));
          li.append(...span.childNodes);
        }
        if (textOf4(li)) ul.append(li);
      });
      if (!headers.length) {
        stats.querySelectorAll(".stat-description").forEach((d) => {
          if (!textOf4(d)) return;
          const li = document.createElement("li");
          li.append(...flattenInline3(document, d, "span").childNodes);
          ul.append(li);
        });
      }
      if (ul.children.length) benefits.push(ul);
    }
    return [intro.length ? intro : "", benefits.length ? benefits : ""];
  }
  function parseFeature(document, feature) {
    const text5 = [];
    const h = firstHeading(document, feature.querySelector(".feature-50-50__card") || feature);
    if (h) text5.push(h);
    text5.push(...richChildren3(document, feature.querySelector(".feature-50-50__description")));
    text5.push(...linkParas3(document, [...feature.querySelectorAll(".feature-50-50__links a")]));
    const img = feature.querySelector(".feature-50-50__image img");
    const media = img && img.getAttribute("src") ? [img] : "";
    const content = feature.querySelector(".feature-50-50__content");
    const imageLeft = content && content.classList.contains("image-left");
    const textCell = text5.length ? text5 : "";
    if (!media) return [textCell];
    return imageLeft ? [media, textCell] : [textCell, media];
  }
  function parse13(element, { document, params }) {
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
      const items = [...element.children].filter((c) => textOf4(c) || c.querySelector("img"));
      if (items.length) cells.push(items.map((c) => [c]));
    }
    const name = variant ? `columns-benefits (${variant})` : "columns-benefits";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/disclaimer-gate.js
  var NBSP_ONLY2 = /^[\s ]*$/;
  function clean(el) {
    [el, ...el.querySelectorAll("*")].forEach((n) => {
      n.removeAttribute("style");
      n.removeAttribute("class");
      n.removeAttribute("id");
    });
    return el;
  }
  function parse14(element, { document, params }) {
    const img = element.querySelector(".feature-understanding__image img, img");
    const imageCell = img ? clean(img.cloneNode(true)) : "";
    const content = [];
    const titleWrap = element.querySelector(".feature-understanding__title");
    const heading = titleWrap ? titleWrap.querySelector("h1, h2, h3, h4, h5, h6") : element.querySelector("h1, h2, h3, h4, h5, h6");
    if (heading) {
      content.push(clean(heading.cloneNode(true)));
    } else if (titleWrap && !NBSP_ONLY2.test(titleWrap.textContent)) {
      const h = document.createElement("h2");
      h.textContent = titleWrap.textContent.trim();
      content.push(h);
    }
    const desc = element.querySelector(".feature-understanding__description");
    if (desc) {
      const parts = [...desc.children].filter((c) => !NBSP_ONLY2.test(c.textContent) || c.querySelector("img"));
      if (parts.length) parts.forEach((c) => content.push(clean(c.cloneNode(true))));
      else if (!NBSP_ONLY2.test(desc.textContent)) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        content.push(p);
      }
    }
    const links = [...element.querySelectorAll(".feature-understanding__links a, .feature-understanding__link a")];
    links.forEach((a) => {
      const text5 = a.textContent.replace(/\s+/g, " ").trim();
      if (!text5) return;
      const link = document.createElement("a");
      link.href = a.getAttribute("href") || a.getAttribute("data-href") || "#";
      link.textContent = text5;
      const p = document.createElement("p");
      p.append(link);
      content.push(p);
    });
    const cells = [[imageCell, content.length ? content : ""]];
    const checkboxLabel = element.querySelector('.feature-understanding__checkbox-item label, input[type="checkbox"] + label');
    const labelText = checkboxLabel ? checkboxLabel.textContent.replace(/\s+/g, " ").trim() : "";
    cells.push([labelText || "I understand", "checkbox"]);
    const block = WebImporter.Blocks.createBlock(document, { name: "disclaimer-gate", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function text(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function para2(document, value) {
    const p = document.createElement("p");
    p.textContent = value;
    return p;
  }
  function richPara(document, src) {
    const p = document.createElement("p");
    p.innerHTML = src.innerHTML.trim();
    p.querySelectorAll("div, span").forEach((w) => w.replaceWith(...w.childNodes));
    return p;
  }
  function linkedHeading(document, titleSrc, href) {
    const h = document.createElement("h3");
    const inner = document.createElement("span");
    inner.innerHTML = titleSrc.innerHTML.trim();
    inner.querySelectorAll("div, span").forEach((w) => w.replaceWith(...w.childNodes));
    if (href) {
      const a = document.createElement("a");
      a.href = href;
      a.append(...inner.childNodes);
      h.append(a);
    } else {
      h.append(...inner.childNodes);
    }
    return h;
  }
  function imageOf2(scope) {
    if (!scope) return null;
    const pic = scope.querySelector("picture");
    if (pic) return pic;
    const img = scope.querySelector("img");
    if (img) img.removeAttribute("title");
    return img;
  }
  function hrefOf(card) {
    const a = card.querySelector("a[href]");
    return a ? a.getAttribute("href") : "";
  }
  function parseArticleCard(document, card) {
    const body = [];
    const href = hrefOf(card);
    const tag = text(card.querySelector(".article-card__category"));
    if (tag) body.push(para2(document, tag));
    const date = text(card.querySelector(".article-card__publish-date"));
    if (date) body.push(para2(document, date));
    const title = card.querySelector(".article-card__title");
    if (title && text(title)) body.push(linkedHeading(document, title, href));
    const desc = card.querySelector(".article-card__description");
    if (desc && text(desc)) body.push(richPara(document, desc));
    const author = text(card.querySelector(".article-card__author"));
    if (author) body.push(para2(document, author));
    const dur = text(card.querySelector(".article-card__duration"));
    if (dur) body.push(para2(document, dur));
    return { image: imageOf2(card.querySelector(".article-card__image") || card), body };
  }
  function parseResource(document, card) {
    const body = [];
    const href = hrefOf(card);
    const tag = text(card.querySelector(".asset-type"));
    if (tag) body.push(para2(document, tag));
    const date = text(card.querySelector(".content .length, .length"));
    if (date) body.push(para2(document, date));
    const content = card.querySelector(".content") || card;
    const title = content.querySelector("h1, h2, h3, h4, h5, h6");
    if (title && text(title)) body.push(linkedHeading(document, title, href));
    content.querySelectorAll(":scope > p").forEach((p) => {
      if (text(p)) body.push(richPara(document, p));
    });
    return { image: imageOf2(card.querySelector(".imagery") || card), body };
  }
  function parse15(element, { document, params }) {
    const root = element;
    let items = [];
    let variant = null;
    const articleCards = [...root.querySelectorAll(".article-card")].filter((c) => c.querySelector(".article-card__title, .article-card__image"));
    const resources = [...root.querySelectorAll(".resource-listing")].map((l) => l.querySelector(".base-resource") || l).filter((c) => c.querySelector("h1, h2, h3, h4, img"));
    if (articleCards.length) {
      items = articleCards.map((c) => parseArticleCard(document, c));
    } else if (resources.length) {
      items = resources.map((c) => parseResource(document, c));
      variant = "image-magenta-shadow";
    } else {
      items = [...root.querySelectorAll(".card, .resource")].filter((c) => c.querySelector("h2, h3, h4")).map((c) => parseResource(document, c));
    }
    items = items.filter((it) => it.image || it.body.length);
    const cells = items.map((it) => [it.image || "", it.body]);
    const name = variant ? `cards-article (${variant})` : "cards-article";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table-product.js
  var NBSP_ONLY3 = /^[\s ]*$/;
  function cellContent(td, document) {
    const clone = td.cloneNode(true);
    [clone, ...clone.querySelectorAll("*")].forEach((n) => {
      n.removeAttribute("style");
      n.removeAttribute("class");
      n.removeAttribute("id");
    });
    clone.querySelectorAll("p").forEach((p) => {
      if (NBSP_ONLY3.test(p.textContent) && !p.querySelector("img")) p.remove();
    });
    clone.querySelectorAll("i, em, span").forEach((n) => {
      if (!n.textContent && !n.children.length) n.remove();
    });
    if (NBSP_ONLY3.test(clone.textContent) && !clone.querySelector("img")) return "";
    while (clone.firstChild && (clone.firstChild.nodeType === 3 && NBSP_ONLY3.test(clone.firstChild.textContent) || clone.firstChild.nodeType === 1 && clone.firstChild.tagName === "BR")) {
      clone.firstChild.remove();
    }
    const frag = document.createElement("div");
    frag.append(...clone.childNodes);
    return [...frag.childNodes];
  }
  function parse16(element, { document, params }) {
    const table = element.matches("table") ? element : element.querySelector("table");
    const cells = [];
    if (table) {
      const trs = [...table.querySelectorAll("tr")].filter((tr) => tr.closest("table") === table);
      const grid = [];
      const carry = [];
      trs.forEach((tr, r) => {
        const row = [];
        let col = 0;
        const tds = [...tr.children].filter((c) => /^t[dh]$/i.test(c.tagName));
        const place = () => {
          while (carry[col] > 0) {
            row[col] = "";
            carry[col] -= 1;
            col += 1;
          }
        };
        tds.forEach((td) => {
          place();
          const colspan = Math.max(1, parseInt(td.getAttribute("colspan"), 10) || 1);
          const rowspan = Math.max(1, parseInt(td.getAttribute("rowspan"), 10) || 1);
          row[col] = cellContent(td, document);
          for (let k = 1; k < colspan; k += 1) row[col + k] = "";
          for (let k = 0; k < colspan; k += 1) if (rowspan > 1) carry[col + k] = rowspan - 1;
          col += colspan;
        });
        place();
        grid[r] = row;
      });
      const width = Math.max(0, ...grid.map((r) => r.length));
      grid.forEach((row) => {
        const full = [];
        for (let c = 0; c < width; c += 1) full.push(row[c] === void 0 ? "" : row[c]);
        const empty = full.every((c) => c === "");
        if (!empty) cells.push(full);
      });
    }
    if (!cells.length) cells.push([""]);
    const noHeader = table && !table.querySelector("th, thead");
    const name = noHeader ? "table-product (no-header)" : "table-product";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/list-filter.js
  function text2(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function parse17(element, { document, params }) {
    const isSelect = !!element.querySelector("select");
    const variant = element.matches(".integrations-filter-container") || element.querySelector(".select-integration-type-container") ? "light-blue-orange-magenta" : isSelect ? "alt" : null;
    let label = "";
    const values = [];
    let pageTitle = null;
    if (isSelect) {
      const select = element.querySelector("select");
      const selLabel = element.querySelector("label.floating, label[for]");
      label = text2(selLabel);
      const title = element.querySelector(".page-title, h1, h2, h3, h4");
      if (title && text2(title)) {
        if (label) {
          pageTitle = document.createElement(/^h[1-6]$/i.test(title.tagName) ? title.tagName.toLowerCase() : "h3");
          pageTitle.textContent = text2(title);
        } else {
          label = text2(title);
        }
      }
      [...select.querySelectorAll("option")].forEach((o) => {
        const t = text2(o);
        if (t) values.push(t);
      });
    } else {
      const heading = element.querySelector('h1, h2, h3, h4, h5, h6, legend, [class*="sub-header"]');
      label = text2(heading);
      const deselect = element.querySelector(".deselect-all-text, .deselect-all-container label");
      if (deselect) values.push("All");
      const filterLabels = element.querySelectorAll(".filter-name-sub-container label, .filter_header label");
      const seen = /* @__PURE__ */ new Set();
      filterLabels.forEach((l) => {
        const clone = l.cloneNode(true);
        clone.querySelectorAll('span[id$="-count"], span').forEach((s) => {
          if (/^\(\d+\)$/.test(text2(s))) s.remove();
        });
        const t = text2(clone).replace(/\s*\(\d+\)\s*$/, "");
        if (t && !seen.has(t)) {
          seen.add(t);
          values.push(t);
        }
      });
      if (!filterLabels.length) {
        element.querySelectorAll("label").forEach((l) => {
          const t = text2(l).replace(/\s*\(\d+\)\s*$/, "");
          if (t && !/deselect/i.test(t) && !seen.has(t)) {
            seen.add(t);
            values.push(t);
          }
        });
      }
    }
    const cells = [];
    if (label) {
      const h = document.createElement("h3");
      h.textContent = label;
      cells.push([h]);
    }
    if (values.length) {
      const ul = document.createElement("ul");
      values.forEach((v) => {
        const li = document.createElement("li");
        li.textContent = v;
        ul.append(li);
      });
      cells.push([ul]);
    }
    if (!cells.length) cells.push([""]);
    const name = variant ? `list-filter (${variant})` : "list-filter";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    if (pageTitle) element.before(pageTitle);
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-event.js
  function text3(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function cleanInline2(document, src, tag) {
    const el = document.createElement(tag);
    el.innerHTML = src.innerHTML;
    el.querySelectorAll("div, span").forEach((w) => w.replaceWith(...w.childNodes));
    el.innerHTML = el.innerHTML.trim();
    return el;
  }
  function parseCard(document, card) {
    const date = [];
    const body = [];
    const cta = [];
    const dateSrc = card.querySelector(".date, .event-date, time");
    if (dateSrc && text3(dateSrc)) date.push(cleanInline2(document, dateSrc, "p"));
    const icon = card.querySelector(".icon-image img, .icon-image picture");
    if (icon) {
      const p = document.createElement("p");
      p.append(icon.closest("picture") || icon);
      body.push(p);
    }
    const title = card.querySelector(".card-content .title, .title, h2, h3, h4");
    if (title && text3(title)) body.push(cleanInline2(document, title, "h3"));
    const desc = card.querySelector(".card-content .description, .description");
    if (desc) {
      const ps = [...desc.querySelectorAll(":scope > p, :scope > ul, :scope > ol")].filter((p) => text3(p));
      if (ps.length) body.push(...ps);
      else if (text3(desc)) body.push(cleanInline2(document, desc, "p"));
    }
    card.querySelectorAll(".cta-arrow-button-wrapper a[href], .card-content a.cta-arrow-button[href], .action a[href]").forEach((a) => {
      if (!text3(a) || cta.some((p2) => p2.querySelector("a").getAttribute("href") === a.getAttribute("href"))) return;
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = text3(a);
      p.append(link);
      cta.push(p);
    });
    return [date.length ? date : "", body.length ? body : "", cta.length ? cta : ""];
  }
  function eventCard(document, ev) {
    const first = [];
    const dateSrc = ev.querySelector(".event__date, :scope > .date");
    if (dateSrc && text3(dateSrc)) first.push(cleanInline2(document, dateSrc, "p"));
    const textCell = [];
    const name = ev.querySelector(".event__name, :scope > .details > h1, :scope > .details > h2, :scope > .details > h3, :scope > .details > h4, :scope > .details > h5, :scope > .details > h6");
    if (name && text3(name)) {
      const h = document.createElement("h3");
      h.textContent = text3(name);
      textCell.push(h);
    }
    const details = ev.querySelector(".event__event-details, :scope > .details");
    if (details) {
      const ps = [...details.querySelectorAll(":scope > p")].filter((p) => text3(p));
      if (ps.length) textCell.push(...ps);
      else if (text3(details)) textCell.push(cleanInline2(document, details, "p"));
    }
    ev.querySelectorAll(".event__link a[href], :scope > .action a[href]").forEach((a) => {
      if (!text3(a)) return;
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = text3(a);
      p.append(link);
      textCell.push(p);
    });
    return [first.length ? first : "", textCell.length ? textCell : ""];
  }
  function parseEventListing(element, document) {
    const sel = ".event__block, .item.event";
    const events = element.matches(sel) ? [element] : [...element.querySelectorAll(sel)];
    if (!events.length) {
      element.remove();
      return;
    }
    const rows = events.map((ev) => eventCard(document, ev)).filter((row) => row.some((c) => c));
    let prev = element.previousElementSibling;
    while (prev && !prev.textContent.trim() && prev.tagName !== "TABLE") prev = prev.previousElementSibling;
    if (prev && prev.tagName === "TABLE" && prev.dataset && prev.dataset.excatEvents === "true") {
      const body = prev.querySelector("tbody") || prev;
      rows.forEach((row) => {
        const tr = document.createElement("tr");
        row.forEach((cell) => {
          const td = document.createElement("td");
          (Array.isArray(cell) ? cell : [cell]).forEach((n) => {
            if (n) td.append(n);
          });
          tr.append(td);
        });
        body.append(tr);
      });
      element.remove();
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-event", cells: rows });
    if (block.dataset) block.dataset.excatEvents = "true";
    element.replaceWith(block);
  }
  function parse18(element, { document, params }) {
    if (element.closest(".event-listing") || element.querySelector(".event__block, .event-listing__table-header")) {
      parseEventListing(element, document);
      return;
    }
    let cards = [...element.querySelectorAll(".cta-icon-card-block")];
    if (!cards.length && element.matches(".cta-icon-card-block")) cards = [element];
    if (!cards.length) cards = [element];
    const cells = cards.map((c) => parseCard(document, c)).filter((row) => row.some((c) => c));
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-event", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/location-tiles.js
  var NBSP_ONLY4 = /^[\s ]*$/;
  function clean2(el) {
    [el, ...el.querySelectorAll("*")].forEach((n) => {
      n.removeAttribute("style");
      n.removeAttribute("class");
      n.removeAttribute("id");
    });
    return el;
  }
  function parse19(element, { document, params }) {
    let columns = [...element.querySelectorAll(".locations-column")];
    if (!columns.length) columns = [...element.children];
    const cells = [];
    columns.forEach((col) => {
      const img = col.querySelector(".location-image img, img");
      const nameEl = col.querySelector(".location-name");
      const name = nameEl ? nameEl.textContent.replace(/\s+/g, " ").trim() : "";
      const details = [];
      const desc = col.querySelector(".location-description");
      if (desc) {
        [...desc.children].forEach((c) => {
          c.querySelectorAll("a").forEach((a) => {
            if (NBSP_ONLY4.test(a.textContent) && !a.querySelector("img")) a.remove();
          });
          if (NBSP_ONLY4.test(c.textContent) && !c.querySelector("img")) return;
          details.push(clean2(c.cloneNode(true)));
        });
        if (!details.length && !NBSP_ONLY4.test(desc.textContent)) {
          const p = document.createElement("p");
          p.textContent = desc.textContent.trim();
          details.push(p);
        }
      }
      if (!img && !name && !details.length) return;
      let nameCell = "";
      if (name) {
        const p = document.createElement("p");
        p.textContent = name;
        nameCell = p;
      }
      cells.push([img ? clean2(img.cloneNode(true)) : "", nameCell, details.length ? details : ""]);
    });
    if (!cells.length) cells.push(["", "", ""]);
    const block = WebImporter.Blocks.createBlock(document, { name: "location-tiles", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-schedule.js
  function textOf5(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function flattenInline4(document, src, tag) {
    const h = document.createElement(tag);
    h.innerHTML = src.innerHTML;
    [...h.querySelectorAll("*")].forEach((d) => {
      const keep = d.matches("sup, sub, em, strong, b, i, br") || d.matches("a") && d.getAttribute("href");
      if (!keep) d.replaceWith(...d.childNodes);
    });
    h.innerHTML = h.innerHTML.replace(/\s+/g, " ").trim();
    return h;
  }
  function richChildren4(document, container) {
    const out = [];
    if (!container) return out;
    [...container.children].forEach((child) => {
      if (!textOf5(child) && !child.querySelector("img")) return;
      child.removeAttribute("style");
      child.querySelectorAll("[style]").forEach((s) => s.removeAttribute("style"));
      out.push(child);
    });
    if (!out.length && textOf5(container)) {
      const p = document.createElement("p");
      p.textContent = textOf5(container);
      out.push(p);
    }
    return out;
  }
  function parse20(element, { document, params }) {
    const cells = [];
    const table = element.querySelector("table");
    const intro = [];
    const introRoot = element.querySelector(".main-content") || element;
    const header = introRoot.querySelector(".cta-list__header, .title");
    const hSrc = header && (header.querySelector("h1, h2, h3, h4, h5, h6") || header);
    if (hSrc && textOf5(hSrc) && !(table && table.contains(hSrc))) {
      const tag = hSrc.matches("h1, h2, h3, h4, h5, h6") ? hSrc.tagName.toLowerCase() : "h3";
      intro.push(flattenInline4(document, hSrc, tag));
    }
    intro.push(...richChildren4(document, introRoot.querySelector(".cta-list__description, .description, .cmp-text")));
    introRoot.querySelectorAll(".cta-list__links a, .customContent a, .small-links a").forEach((a) => {
      if (!a.getAttribute("href") || !textOf5(a)) return;
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = textOf5(a);
      p.append(link);
      intro.push(p);
    });
    const captionEl = table && table.querySelector("caption");
    const caption = captionEl && textOf5(captionEl) ? textOf5(captionEl) : "";
    const tableRows = [];
    if (table) {
      [...table.querySelectorAll("tr")].forEach((tr, i) => {
        const row = [...tr.children].filter((c) => c.matches("th, td")).map((c, j) => {
          const t = textOf5(c).replace(/ /g, " ").trim();
          if (!t) return "";
          if (i === 0 || j === 0) return t;
          const span = flattenInline4(document, c, "p");
          return span.childNodes.length ? [...span.childNodes] : t;
        });
        if (row.some((c) => c !== "")) tableRows.push(row);
      });
    }
    const maxCols = Math.max(2, ...tableRows.map((r) => r.length));
    const first = [intro.length ? intro : "", caption];
    while (first.length < maxCols) first.push("");
    cells.push(first);
    tableRows.forEach((r) => {
      while (r.length < maxCols) r.push("");
      cells.push(r);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-schedule", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-team.js
  function text4(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function cleanInline3(document, src, tag) {
    const el = document.createElement(tag);
    el.innerHTML = src.innerHTML;
    el.querySelectorAll("div, span").forEach((w) => w.replaceWith(...w.childNodes));
    const trimBr = (node) => {
      let last = node.lastChild;
      while (last && (last.nodeType === 3 && !last.textContent.trim() || last.nodeName === "BR")) {
        last.remove();
        last = node.lastChild;
      }
      if (last && last.nodeType === 1) trimBr(last);
    };
    trimBr(el);
    el.innerHTML = el.innerHTML.trim();
    return el;
  }
  function parseCard2(document, card) {
    const image = card.querySelector(".icon-image picture, .icon-image img");
    const body = [];
    const title = card.querySelector(".card-content .title, .title");
    if (title && text4(title)) body.push(cleanInline3(document, title, "h3"));
    const desc = card.querySelector(".card-content .description, .description");
    if (desc) {
      const ps = [...desc.querySelectorAll(":scope > p")].filter((p) => text4(p));
      if (ps.length) ps.forEach((p) => body.push(cleanInline3(document, p, "p")));
      else if (text4(desc)) body.push(cleanInline3(document, desc, "p"));
    }
    card.querySelectorAll(".cta-arrow-button-wrapper a[href], .action a[href]").forEach((a) => {
      if (!text4(a)) return;
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = text4(a);
      p.append(link);
      body.push(p);
    });
    return { image: image ? image.closest("picture") || image : null, body };
  }
  function parse21(element, { document, params }) {
    let cards = [...element.querySelectorAll(".cta-icon-card-block")];
    if (!cards.length) cards = [...element.querySelectorAll(".cta-icon-card")];
    if (!cards.length) cards = [element];
    const cells = cards.map((c) => parseCard2(document, c)).filter((it) => it.image || it.body.length).map((it) => [it.image || "", it.body.length ? it.body : ""]);
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-team", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/retirement-calculator.js
  var NBSP_ONLY5 = /^[\s ]*$/;
  var INPUT_TYPES2 = ["text", "email", "tel", "number", "password", "date", "search", "url", "checkbox", "radio"];
  function hasContent2(el) {
    return !NBSP_ONLY5.test(el.textContent || "") || !!el.querySelector("img, picture, iframe, video");
  }
  function controlType2(ctrl) {
    const tag = ctrl.tagName.toLowerCase();
    if (tag === "textarea") return "textarea";
    if (tag === "select") return "select";
    if (tag === "button") {
      const t2 = (ctrl.getAttribute("type") || "submit").toLowerCase();
      return ["submit", "reset"].includes(t2) ? t2 : "button";
    }
    const t = (ctrl.getAttribute("type") || "text").toLowerCase();
    if (t === "submit" || t === "reset") return t;
    return INPUT_TYPES2.includes(t) ? t : null;
  }
  function controlLabel2(ctrl, form) {
    let text5 = "";
    const id = ctrl.getAttribute("id");
    if (id) {
      const label = [...form.querySelectorAll("label")].find((l) => l.getAttribute("for") === id);
      if (label) {
        const clone = label.cloneNode(true);
        clone.querySelectorAll(".mktoAsterix").forEach((a) => a.remove());
        text5 = clone.textContent.replace(/\s+/g, " ").trim();
      }
    }
    if (!text5 && ctrl.closest("label")) text5 = ctrl.closest("label").textContent.replace(/\s+/g, " ").trim();
    if (!text5) text5 = (ctrl.getAttribute("placeholder") || "").trim();
    if (!text5 && ctrl.tagName.toLowerCase() === "button") text5 = ctrl.textContent.trim();
    if (!text5) text5 = (ctrl.getAttribute("value") || ctrl.getAttribute("name") || "").trim();
    return text5;
  }
  function formRows2(form, document) {
    const rows = [];
    const seenGroups = /* @__PURE__ */ new Set();
    const nodes = form.querySelectorAll("input, select, textarea, button, .mktoCaptchaDisclaimer, .mktoHtmlText");
    nodes.forEach((ctrl) => {
      if (ctrl.closest(".g-recaptcha, .grecaptcha-badge")) return;
      if (ctrl.matches(".mktoCaptchaDisclaimer, .mktoHtmlText")) {
        if (!hasContent2(ctrl)) return;
        const p = document.createElement("p");
        p.innerHTML = ctrl.innerHTML;
        rows.push([p]);
        return;
      }
      const type = controlType2(ctrl);
      if (!type) return;
      if (type === "radio" || type === "checkbox") {
        const name = ctrl.getAttribute("name");
        const group = name ? [...form.querySelectorAll(`input[name="${name}"]`)] : [ctrl];
        if (group.length > 1) {
          if (seenGroups.has(name)) return;
          seenGroups.add(name);
          const ul = document.createElement("ul");
          group.forEach((g) => {
            const li = document.createElement("li");
            li.textContent = controlLabel2(g, form);
            ul.append(li);
          });
          const fieldset = ctrl.closest("fieldset");
          const legend = fieldset && fieldset.querySelector("legend");
          rows.push([legend ? legend.textContent.trim() : name, type === "radio" ? "radio" : "checkboxes", ul]);
          return;
        }
      }
      let label = controlLabel2(ctrl, form);
      if (!label) return;
      const required = ctrl.hasAttribute("required") || ctrl.getAttribute("aria-required") === "true" || ctrl.classList.contains("mktoRequired");
      if (required && !/\*\s*$/.test(label)) label = `${label} *`;
      let extra = "";
      if (type === "select") {
        const ul = document.createElement("ul");
        [...ctrl.querySelectorAll("option")].forEach((o) => {
          const t = o.textContent.trim();
          if (!t || !o.getAttribute("value")) return;
          const li = document.createElement("li");
          li.textContent = t;
          ul.append(li);
        });
        if (ul.children.length) extra = ul;
      }
      rows.push([label, type, extra]);
    });
    return rows;
  }
  function collect2(root, document, out) {
    [...root.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const t = n.textContent.replace(/\s+/g, " ").trim();
        if (t && !NBSP_ONLY5.test(t)) {
          const p = document.createElement("p");
          p.textContent = t;
          out.push(p);
        }
        return;
      }
      if (n.nodeType !== 1) return;
      const tag = n.tagName.toLowerCase();
      if (["script", "style", "noscript", "link", "svg", "template"].includes(tag)) return;
      if (n.matches && n.matches(".cta-list__links, .small-links")) {
        const links = [...n.querySelectorAll("a")].filter((a) => !NBSP_ONLY5.test(a.textContent));
        if (links.length) {
          const ul = document.createElement("ul");
          links.forEach((a) => {
            const li = document.createElement("li");
            li.append(a.cloneNode(true));
            ul.append(li);
          });
          out.push(ul);
        }
        return;
      }
      if (tag === "form") {
        out.push({ form: n });
        return;
      }
      if (/^h[1-6]$/.test(tag)) {
        if (NBSP_ONLY5.test(n.textContent)) return;
        const h = document.createElement(tag);
        if (n.querySelector("div, p")) h.textContent = n.textContent.replace(/\s+/g, " ").trim();
        else h.innerHTML = n.innerHTML;
        out.push(h);
        return;
      }
      if (["p", "ul", "ol", "table", "blockquote"].includes(tag)) {
        if (hasContent2(n)) out.push(n.cloneNode(true));
        return;
      }
      if (tag === "img" || tag === "picture") {
        out.push(n.cloneNode(true));
        return;
      }
      if (tag === "a") {
        if (!hasContent2(n)) return;
        const p = document.createElement("p");
        p.append(n.cloneNode(true));
        out.push(p);
        return;
      }
      if (tag === "iframe") {
        const src = n.getAttribute("src") || n.getAttribute("data-src");
        if (!src || n.closest(".g-recaptcha")) return;
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = src;
        a.textContent = src;
        p.append(a);
        out.push(p);
        return;
      }
      if (tag === "button") {
        if (n.querySelector("h1, h2, h3, h4, h5, h6")) {
          collect2(n, document, out);
        } else if (n.closest(".accordion-title") && !NBSP_ONLY5.test(n.textContent)) {
          const h = document.createElement("h3");
          h.textContent = n.textContent.replace(/\s+/g, " ").trim();
          out.push(h);
        }
        return;
      }
      if (["input", "select", "textarea", "label"].includes(tag)) return;
      collect2(n, document, out);
    });
    return out;
  }
  function parse22(element, { document, params }) {
    if (element.matches(".journey-controls")) {
      element.remove();
      return;
    }
    let items;
    if (element.matches(".journey-nav")) {
      const ol = document.createElement("ol");
      element.querySelectorAll(".journey-step").forEach((step) => {
        const label = step.querySelector(".full-label") || step.querySelector(".label") || step;
        const text5 = label.textContent.replace(/\s+/g, " ").trim();
        if (!text5) return;
        const li = document.createElement("li");
        li.textContent = text5;
        ol.append(li);
      });
      items = ol.children.length ? [ol] : [];
    } else {
      [...element.querySelectorAll(".tooltip")].forEach((tip) => {
        const trigger = tip.parentElement && tip.parentElement.closest("button");
        if (trigger && element.contains(trigger)) trigger.after(tip);
      });
      items = collect2(element, document, []);
    }
    const cells = [];
    items.forEach((item) => {
      if (item && item.form) {
        formRows2(item.form, document).forEach((row) => cells.push(row));
      } else if (/^H[1-6]$/.test(item.tagName)) {
        cells.push([[item]]);
      } else if (item.tagName === "OL") {
        cells.push([item]);
      } else {
        const last = cells[cells.length - 1];
        if (last && last.length === 1 && Array.isArray(last[0])) last[0].push(item);
        else cells.push([[item]]);
      }
    });
    if (!cells.length) cells.push([""]);
    cells.flat(2).forEach((el) => {
      if (!el || typeof el === "string" || !el.querySelectorAll) return;
      [el, ...el.querySelectorAll("*")].forEach((n) => {
        n.removeAttribute("style");
        n.removeAttribute("class");
        n.removeAttribute("id");
      });
    });
    const inJourney = !!element.closest(".rec-container");
    let prev = element.previousElementSibling;
    while (prev && !prev.textContent.trim() && !prev.querySelector("img")) prev = prev.previousElementSibling;
    if (inJourney && prev && prev.tagName === "TABLE" && prev.dataset.excatCalculator === "true") {
      const target = prev.querySelector("tbody") || prev;
      cells.forEach((row) => {
        const tr = document.createElement("tr");
        row.forEach((cell) => {
          const td = document.createElement("td");
          (Array.isArray(cell) ? cell : [cell]).forEach((c) => {
            if (c && typeof c !== "string") td.append(c);
            else if (c) td.append(document.createTextNode(c));
          });
          tr.append(td);
        });
        target.append(tr);
      });
      element.remove();
      return;
    }
    if (!items.length && inJourney) {
      element.remove();
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "retirement-calculator (red)", cells });
    if (inJourney && block.dataset) block.dataset.excatCalculator = "true";
    element.replaceWith(block);
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

  // tools/importer/import-content-page.js
  var PAGE_TEMPLATE = {
    "name": "content-page",
    "urls": [
      "https://www.jackson.com/annuities.html",
      "https://www.jackson.com/annuities/benefits-of-annuities.html",
      "https://www.jackson.com/annuities/benefits-of-annuities/growth-potential.html",
      "https://www.jackson.com/annuities/benefits-of-annuities/income-protection.html",
      "https://www.jackson.com/annuities/benefits-of-annuities/legacy-benefits.html",
      "https://www.jackson.com/annuities/benefits-of-annuities/tax-deferral.html",
      "https://www.jackson.com/annuities/fixed-annuities.html",
      "https://www.jackson.com/annuities/fixed-index-annuities.html",
      "https://www.jackson.com/annuities/variable-annuities.html",
      "https://www.jackson.com/annuities/variable-annuities/investment-options.html",
      "https://www.jackson.com/cyber-security.html",
      "https://www.jackson.com/financial-professional/annuity-products.html",
      "https://www.jackson.com/financial-professional/annuity-products/product-match-pro.html",
      "https://www.jackson.com/financial-professional/get-appointed.html",
      "https://www.jackson.com/financial-professional/resources.html",
      "https://www.jackson.com/financial-professional/why-jackson.html",
      "https://www.jackson.com/financial-professionals.html",
      "https://www.jackson.com/financial-professionals/client-conversation-resources.html",
      "https://www.jackson.com/financial-professionals/insurance-professionals.html",
      "https://www.jackson.com/financial-professionals/tools/tax-deferral-calculator.html",
      "https://www.jackson.com/ria-and-wealth-managers.html",
      "https://www.jackson.com/ria-and-wealth-managers/fee-based-annuity-solutions.html",
      "https://www.jackson.com/ria-and-wealth-managers/integration-with-your-practice.html",
      "https://www.jackson.com/ria-and-wealth-managers/making-it-easier-to-do-business.html",
      "https://www.jackson.com/ria-and-wealth-managers/planning-tools-for-your-journey.html",
      "https://www.jackson.com/supplier-management.html",
      "https://www.jackson.com/the-jackson-difference.html",
      "https://www.jackson.com/the-jackson-difference/careers.html",
      "https://www.jackson.com/the-jackson-difference/corporate-responsibility.html",
      "https://www.jackson.com/the-jackson-difference/supporting-our-community.html",
      "https://www.jackson.com/the-jackson-difference/supporting-our-community/grant-application.html",
      "https://www.jackson.com/the-jackson-difference/who-we-are.html",
      "https://www.jackson.com/the-jackson-difference/who-we-are/jnam.html",
      "https://www.jackson.com/the-jackson-difference/who-we-are/jnam/investment-due-diligence.html",
      "https://www.jackson.com/the-jackson-difference/who-we-are/leaders.html",
      "https://www.jackson.com/the-jackson-difference/who-we-are/news.html",
      "https://www.jackson.com/your-financial-future.html",
      "https://www.jackson.com/your-financial-future/calculators-and-tools.html",
      "https://www.jackson.com/your-financial-future/educational-resources.html",
      "https://www.jackson.com/your-financial-future/how-to-plan-for-retirement.html",
      "https://www.jackson.com/your-financial-future/retirement-statistics.html"
    ],
    "description": "Breadcrumb, hero banner with optional sidebar layout, alternating text-and-media columns, card rows and disclosure footer",
    "blocks": [
      {
        "name": "columns-sidebar",
        "instances": [
          "div.aside-layout"
        ],
        "pageInstances": {
          "https://www.jackson.com/annuities.html": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div.aside-layout"
          ],
          "https://www.jackson.com/the-jackson-difference/supporting-our-community.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.aside-layout"
          ]
        }
      },
      {
        "name": "cards-product",
        "instances": [
          "div.card-container__cards",
          "div.be-ix-link-block"
        ],
        "pageInstances": {
          "https://www.jackson.com/annuities.html": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div.layout-container > div > div.two-column",
            "#brightedgeLinks > div"
          ],
          "https://www.jackson.com/annuities/benefits-of-annuities/tax-deferral.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3) > div > div > div > div > div"
          ],
          "https://www.jackson.com/financial-professional/annuity-products.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4) > div > div > div.card-container__cards"
          ],
          "https://www.jackson.com/ria-and-wealth-managers/making-it-easier-to-do-business.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5) > div > div > div.layout-container > div > div.three-column"
          ],
          "https://www.jackson.com/ria-and-wealth-managers/planning-tools-for-your-journey.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2) > div > div.three-column"
          ],
          "https://www.jackson.com/the-jackson-difference/careers.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3)"
          ],
          "https://www.jackson.com/your-financial-future/calculators-and-tools.html": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(2) > div > div > div > div > div.three-column"
          ]
        }
      },
      {
        "name": "columns-feature",
        "instances": [
          "div.comparison-highlight-layout",
          "div.partial-width-image-hero",
          "div.feature-50-50",
          "div.permission-wrapper",
          "div.feature-accordion"
        ],
        "pageInstances": {
          "https://www.jackson.com/annuities.html": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div.background-container.base-version"
          ],
          "https://www.jackson.com/annuities/benefits-of-annuities/growth-potential.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.background-container.base-version",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.comparison-highlight-layout"
          ],
          "https://www.jackson.com/annuities/benefits-of-annuities/income-protection.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.background-container.base-version",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.comparison-highlight-layout"
          ],
          "https://www.jackson.com/annuities/benefits-of-annuities/legacy-benefits.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.background-container.base-version",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.comparison-highlight-layout"
          ],
          "https://www.jackson.com/annuities/fixed-annuities.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4) > div > div"
          ],
          "https://www.jackson.com/annuities/fixed-index-annuities.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4) > div > div",
            "#expVar-892326235 > div > div > div > div > div > div > div:nth-child(1)",
            "#expVar-892326235 > div > div > div > div > div > div > div:nth-child(6)",
            "#expVar-892326235 > div > div > div > div > div > div > div:nth-child(8)",
            "#expVar-892326235 > div > div > div > div > div > div > div:nth-child(13)"
          ],
          "https://www.jackson.com/annuities/variable-annuities.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4) > div > div"
          ],
          "https://www.jackson.com/financial-professional/annuity-products.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.partial-width-image-hero.v1",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(6)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(8)"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/product-match-pro.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.partial-width-image-hero.v1"
          ],
          "https://www.jackson.com/financial-professional/get-appointed.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.partial-width-image-hero.v1",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.feature-accordion.v1",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(6)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(7)"
          ],
          "https://www.jackson.com/financial-professional/resources.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.partial-width-image-hero.v1",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3)"
          ],
          "https://www.jackson.com/financial-professional/why-jackson.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.partial-width-image-hero.v1",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3)"
          ],
          "https://www.jackson.com/financial-professionals.html": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(3)",
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(4)"
          ],
          "https://www.jackson.com/financial-professionals/insurance-professionals.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3)"
          ],
          "https://www.jackson.com/ria-and-wealth-managers.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.comparison-highlight-layout > div > div"
          ],
          "https://www.jackson.com/ria-and-wealth-managers/fee-based-annuity-solutions.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.comparison-highlight-layout",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(8)"
          ],
          "https://www.jackson.com/ria-and-wealth-managers/making-it-easier-to-do-business.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3) > div > div > div:nth-child(1)",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3) > div > div > div:nth-child(2)"
          ],
          "https://www.jackson.com/the-jackson-difference/corporate-responsibility.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3) > div > div > div.comparison-highlight-layout",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4) > div > div > div.comparison-highlight-layout",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5) > div > div > div.comparison-highlight-layout",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(6) > div > div > div.comparison-highlight-layout"
          ],
          "https://www.jackson.com/the-jackson-difference/supporting-our-community/grant-application.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)"
          ],
          "https://www.jackson.com/the-jackson-difference/who-we-are/leaders.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3)"
          ],
          "https://www.jackson.com/your-financial-future/how-to-plan-for-retirement.html": [
            "#header_copy-1169627654 > div.child-items"
          ]
        }
      },
      {
        "name": "hero-page",
        "instances": [
          "div.herospace"
        ],
        "pageInstances": {
          "https://www.jackson.com/annuities/benefits-of-annuities.html": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div.herospace"
          ],
          "https://www.jackson.com/annuities/benefits-of-annuities/growth-potential.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/annuities/benefits-of-annuities/income-protection.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/annuities/benefits-of-annuities/legacy-benefits.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/annuities/benefits-of-annuities/tax-deferral.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/annuities/fixed-annuities.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/annuities/fixed-index-annuities.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/annuities/variable-annuities.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/annuities/variable-annuities/investment-options.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/cyber-security.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/financial-professionals.html": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div.herospace"
          ],
          "https://www.jackson.com/financial-professionals/client-conversation-resources.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/financial-professionals/insurance-professionals.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/financial-professionals/tools/tax-deferral-calculator.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/ria-and-wealth-managers.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/ria-and-wealth-managers/fee-based-annuity-solutions.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/ria-and-wealth-managers/integration-with-your-practice.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/ria-and-wealth-managers/making-it-easier-to-do-business.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/ria-and-wealth-managers/planning-tools-for-your-journey.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/supplier-management.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/the-jackson-difference.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div > section > div > div.herospace"
          ],
          "https://www.jackson.com/the-jackson-difference/careers.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/the-jackson-difference/corporate-responsibility.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/the-jackson-difference/supporting-our-community/grant-application.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/the-jackson-difference/who-we-are.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/the-jackson-difference/who-we-are/jnam.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/the-jackson-difference/who-we-are/jnam/investment-due-diligence.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/the-jackson-difference/who-we-are/leaders.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/the-jackson-difference/who-we-are/news.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.aside-layout > div > div > div.herospace"
          ],
          "https://www.jackson.com/your-financial-future.html": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div.herospace",
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(3)",
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(4)",
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(5)",
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(6)"
          ],
          "https://www.jackson.com/your-financial-future/calculators-and-tools.html": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div.herospace"
          ],
          "https://www.jackson.com/your-financial-future/educational-resources.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/your-financial-future/how-to-plan-for-retirement.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ],
          "https://www.jackson.com/your-financial-future/retirement-statistics.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.herospace"
          ]
        }
      },
      {
        "name": "contact-form",
        "instances": [
          "div.flexible-width-container"
        ],
        "pageInstances": {
          "https://www.jackson.com/annuities/benefits-of-annuities.html": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(3)"
          ],
          "https://www.jackson.com/financial-professional/resources.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.flexible-width-container.v1"
          ],
          "https://www.jackson.com/ria-and-wealth-managers.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(7)"
          ],
          "https://www.jackson.com/ria-and-wealth-managers/fee-based-annuity-solutions.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(9)"
          ],
          "https://www.jackson.com/ria-and-wealth-managers/integration-with-your-practice.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5)"
          ],
          "https://www.jackson.com/ria-and-wealth-managers/making-it-easier-to-do-business.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(7)"
          ],
          "https://www.jackson.com/ria-and-wealth-managers/planning-tools-for-your-journey.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(8)"
          ],
          "https://www.jackson.com/your-financial-future/educational-resources.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.background-container.base-version"
          ]
        }
      },
      {
        "name": "embed-video",
        "instances": [
          "div.external"
        ],
        "pageInstances": {
          "https://www.jackson.com/annuities/benefits-of-annuities.html": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div.layout-container > div > div.one-column"
          ],
          "https://www.jackson.com/financial-professional/annuity-products.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.flexible-width-container.v1 > div > div > div.flexible-width-container__columns.full-width"
          ],
          "https://www.jackson.com/financial-professionals/client-conversation-resources.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3) > div > div.one-column"
          ],
          "https://www.jackson.com/financial-professionals/tools/tax-deferral-calculator.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.background-container.base-version > div > div > div.external.v1"
          ]
        }
      },
      {
        "name": "hero-banner",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/annuities/benefits-of-annuities.html": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(6)"
          ],
          "https://www.jackson.com/annuities/benefits-of-annuities/tax-deferral.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5)"
          ],
          "https://www.jackson.com/annuities/variable-annuities.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.background-container.base-version"
          ],
          "https://www.jackson.com/financial-professionals/insurance-professionals.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4)"
          ],
          "https://www.jackson.com/the-jackson-difference.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div > section > div > div.background-container"
          ],
          "https://www.jackson.com/the-jackson-difference/who-we-are.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.background-container.base-version"
          ],
          "https://www.jackson.com/the-jackson-difference/who-we-are/jnam.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5)"
          ],
          "https://www.jackson.com/the-jackson-difference/who-we-are/leaders.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5)"
          ],
          "https://www.jackson.com/your-financial-future/calculators-and-tools.html": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(3)"
          ]
        }
      },
      {
        "name": "cards-tool",
        "instances": [
          "div.resource-filter-listing__block-wrapper",
          "div.resource-filter-listing__additional-options-block-wrapper"
        ],
        "pageInstances": {
          "https://www.jackson.com/annuities/benefits-of-annuities/growth-potential.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.layout-container > div > div"
          ],
          "https://www.jackson.com/annuities/benefits-of-annuities/income-protection.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.layout-container > div > div"
          ],
          "https://www.jackson.com/annuities/benefits-of-annuities/legacy-benefits.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.layout-container > div > div"
          ],
          "https://www.jackson.com/annuities/benefits-of-annuities/tax-deferral.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.layout-container > div > div"
          ],
          "https://www.jackson.com/annuities/fixed-annuities.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(7)"
          ],
          "https://www.jackson.com/annuities/fixed-index-annuities.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(7)"
          ],
          "https://www.jackson.com/annuities/variable-annuities.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(8)"
          ],
          "https://www.jackson.com/financial-professionals/client-conversation-resources.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(6)"
          ],
          "https://www.jackson.com/financial-professionals/tools/tax-deferral-calculator.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.layout-container > div > div.two-column"
          ],
          "https://www.jackson.com/ria-and-wealth-managers.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(6) > div > div.two-column"
          ],
          "https://www.jackson.com/ria-and-wealth-managers/integration-with-your-practice.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3) > div > div > div > div > div.resource-filter-listing__main-container > div.resource-filter-listing__block-wrapper",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3) > div > div > div > div > div.resource-filter-listing__main-container > div.resource-filter-listing__additional-options-block-wrapper"
          ],
          "https://www.jackson.com/ria-and-wealth-managers/making-it-easier-to-do-business.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(6) > div > div"
          ],
          "https://www.jackson.com/the-jackson-difference/careers.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(8) > div > div"
          ],
          "https://www.jackson.com/the-jackson-difference/supporting-our-community.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3)"
          ],
          "https://www.jackson.com/the-jackson-difference/who-we-are.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5) > div > div"
          ],
          "https://www.jackson.com/your-financial-future/calculators-and-tools.html": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div.layout-container"
          ],
          "https://www.jackson.com/your-financial-future/educational-resources.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.layout-container"
          ],
          "https://www.jackson.com/your-financial-future/how-to-plan-for-retirement.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.layout-container > div > div"
          ],
          "https://www.jackson.com/your-financial-future/retirement-statistics.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.layout-container > div > div"
          ]
        }
      },
      {
        "name": "cards-feature",
        "instances": [
          "div.cta-section",
          "div.carousel-card-container__content"
        ],
        "pageInstances": {
          "https://www.jackson.com/annuities/benefits-of-annuities/tax-deferral.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4) > div > div > div.comparison-highlight-layout > div > div"
          ],
          "https://www.jackson.com/annuities/fixed-annuities.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3) > div > div"
          ],
          "https://www.jackson.com/annuities/fixed-index-annuities.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3) > div > div",
            "#jfia5-card > div > div > div.cta-section",
            "#jfiaa5-card > div > div > div.cta-section",
            "#jfia7-card > div > div > div.cta-section",
            "#jfiaa7-card > div > div > div.cta-section",
            "#jpa-card > div > div > div.cta-section",
            "#jia7-card > div > div > div.cta-section",
            "#jiaa7-card > div > div > div.cta-section",
            "#jia10-card > div > div > div.cta-section",
            "#jiaa10-card > div > div > div.cta-section",
            "#mp-card > div > div > div.cta-section",
            "#mpa-card > div > div > div.cta-section"
          ],
          "https://www.jackson.com/annuities/variable-annuities.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3) > div > div"
          ],
          "https://www.jackson.com/financial-professional/get-appointed.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.card-container.v1"
          ],
          "https://www.jackson.com/financial-professional/resources.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.card-container.v1",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.carousel-card-container.v1 > div > div > div.carousel-card-container__content"
          ],
          "https://www.jackson.com/financial-professional/why-jackson.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.card-container.v1"
          ],
          "https://www.jackson.com/financial-professionals.html": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div.layout-container > div > div.two-column"
          ],
          "https://www.jackson.com/financial-professionals/insurance-professionals.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.layout-container"
          ],
          "https://www.jackson.com/ria-and-wealth-managers.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2) > div > div"
          ],
          "https://www.jackson.com/ria-and-wealth-managers/making-it-easier-to-do-business.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2) > div > div.three-column"
          ],
          "https://www.jackson.com/ria-and-wealth-managers/planning-tools-for-your-journey.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5) > div > div > div > div > div.three-column",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(6) > div > div",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(7)"
          ],
          "https://www.jackson.com/the-jackson-difference/careers.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.background-container.base-version > div > div > div > div > div.three-column"
          ],
          "https://www.jackson.com/the-jackson-difference/corporate-responsibility.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3) > div > div > div.layout-container",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4) > div > div > div.layout-container",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5) > div > div > div.layout-container",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(6) > div > div > div.layout-container"
          ],
          "https://www.jackson.com/the-jackson-difference/supporting-our-community.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)"
          ],
          "https://www.jackson.com/the-jackson-difference/supporting-our-community/grant-application.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5) > div > div > div.layout-container > div > div"
          ],
          "https://www.jackson.com/the-jackson-difference/who-we-are.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4) > div > div.two-column"
          ],
          "https://www.jackson.com/the-jackson-difference/who-we-are/jnam.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3) > div > div > div > div > div"
          ],
          "https://www.jackson.com/the-jackson-difference/who-we-are/jnam/investment-due-diligence.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3) > div > div.three-column",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.background-container.base-version > div > div > div > div > div.two-column",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(6) > div > div"
          ],
          "https://www.jackson.com/the-jackson-difference/who-we-are/leaders.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.layout-container"
          ]
        }
      },
      {
        "name": "cards-video",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/annuities/benefits-of-annuities/tax-deferral.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4) > div > div > div.background-container.base-version"
          ]
        }
      },
      {
        "name": "tabs-section",
        "instances": [
          "div.tab-container.v4",
          "div.tab.v4"
        ],
        "pageInstances": {
          "https://www.jackson.com/annuities/fixed-annuities.html": [
            "#expVar-1936343968 > div > div > div > div.tab.v4.event-setup"
          ],
          "https://www.jackson.com/annuities/variable-annuities.html": [
            "#expVar-1023500558 > div > div > div > div.tab.v4.event-setup"
          ],
          "https://www.jackson.com/cyber-security.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.tab-container.v4"
          ],
          "https://www.jackson.com/financial-professionals/client-conversation-resources.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.tab-container.v4"
          ],
          "https://www.jackson.com/the-jackson-difference/careers.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.tab-container.v4 > div > div.tab.v4.event-setup"
          ],
          "https://www.jackson.com/your-financial-future/retirement-statistics.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.tab-container.v4 > div > div.tab.v4.event-setup"
          ]
        }
      },
      {
        "name": "accordion-manager",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/annuities/variable-annuities/investment-options.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.layout-container > div > div.three-column"
          ],
          "https://www.jackson.com/supplier-management.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2) > div > div.two-column"
          ]
        }
      },
      {
        "name": "columns-benefits",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/financial-professional/annuity-products.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3)"
          ],
          "https://www.jackson.com/ria-and-wealth-managers.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4)"
          ],
          "https://www.jackson.com/ria-and-wealth-managers/fee-based-annuity-solutions.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(7)"
          ]
        }
      },
      {
        "name": "disclaimer-gate",
        "instances": [
          "div.understanding-feature"
        ],
        "pageInstances": {
          "https://www.jackson.com/financial-professional/annuity-products/product-match-pro.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.understanding-feature.v1"
          ]
        }
      },
      {
        "name": "cards-article",
        "instances": [
          "div.carousel-card-container__cards",
          "div.resource-container-wrapper"
        ],
        "pageInstances": {
          "https://www.jackson.com/financial-professional/resources.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.carousel-card-container.v1 > div > div > div.carousel-card-container__cards"
          ],
          "https://www.jackson.com/your-financial-future/educational-resources.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.resource-filters-gallery.base-version > div > div:nth-child(2) > div.resource-container-wrapper"
          ]
        }
      },
      {
        "name": "table-product",
        "instances": [
          "div.table.v3"
        ],
        "pageInstances": {
          "https://www.jackson.com/financial-professionals/insurance-professionals.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2) > div > div > div.table.v3"
          ],
          "https://www.jackson.com/ria-and-wealth-managers/fee-based-annuity-solutions.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.table.v3"
          ],
          "https://www.jackson.com/the-jackson-difference/careers.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(6) > div > div.two-column"
          ]
        }
      },
      {
        "name": "list-filter",
        "instances": [
          "div.integrations-filter-container",
          "div.press-release-list div.header-block"
        ],
        "pageInstances": {
          "https://www.jackson.com/ria-and-wealth-managers/integration-with-your-practice.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3) > div > div > div > div > div.integrations-filter-container"
          ],
          "https://www.jackson.com/the-jackson-difference/who-we-are/news.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.aside-layout > div > div > div.press-release-list.base-version > div > div > div.header-block"
          ]
        }
      },
      {
        "name": "cards-event",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/the-jackson-difference.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div > section > div > div:nth-child(3)",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div > section > div > div:nth-child(4)",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div > section > div > div:nth-child(5)",
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div > section > div > div:nth-child(6)"
          ]
        }
      },
      {
        "name": "location-tiles",
        "instances": [
          "div.locations-row"
        ],
        "pageInstances": {
          "https://www.jackson.com/the-jackson-difference/careers.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.jackson-locations.base-version > div > div > div.locations-row"
          ]
        }
      },
      {
        "name": "columns-schedule",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/the-jackson-difference/supporting-our-community/grant-application.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4)"
          ]
        }
      },
      {
        "name": "cards-team",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/the-jackson-difference/who-we-are/jnam.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.layout-container > div > div"
          ]
        }
      },
      {
        "name": "retirement-calculator",
        "instances": [
          "div.accordion.base-version"
        ],
        "pageInstances": {
          "https://www.jackson.com/your-financial-future/educational-resources.html": [
            "body > div.responsive.brandEvolution > div > div > div.body-content.base-version.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.accordion.base-version"
          ]
        }
      }
    ],
    "sections": [
      {
        "id": "main-content",
        "name": "main-content",
        "selector": [
          "div.aem-Grid > div.body-content",
          "div.aem-Grid > div.content-wrapper",
          "div.aem-Grid > div.full-width-container:nth-of-type(4)",
          "div.aem-Grid > div.full-width-container"
        ],
        "style": null,
        "blocks": [
          "columns-sidebar",
          "cards-product",
          "columns-feature",
          "hero-page",
          "contact-form",
          "embed-video",
          "hero-banner",
          "cards-tool",
          "cards-feature",
          "cards-video",
          "tabs-section",
          "accordion-manager",
          "columns-benefits",
          "disclaimer-gate",
          "cards-article",
          "table-product",
          "list-filter",
          "cards-event",
          "location-tiles",
          "columns-schedule",
          "cards-team",
          "retirement-calculator"
        ],
        "defaultContent": [
          "section h1",
          "section h2",
          "section h3",
          "section div.description",
          "section div.rte",
          "section div.disclosure",
          "section p"
        ]
      }
    ],
    "pageCleanup": {
      "https://www.jackson.com/annuities.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(26)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/annuities/benefits-of-annuities.html": [
        "#onetrust-banner-sdk",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/annuities/benefits-of-annuities/growth-potential.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(26)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/annuities/benefits-of-annuities/income-protection.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(26)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/annuities/benefits-of-annuities/legacy-benefits.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(26)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/annuities/benefits-of-annuities/tax-deferral.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(26)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.body-content.base-version > section:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/annuities/fixed-annuities.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(28)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/annuities/fixed-index-annuities.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(28)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/annuities/variable-annuities.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(28)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/annuities/variable-annuities/investment-options.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(26)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/cyber-security.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.contents.bg-color > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(1) > div:nth-child(3)",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/financial-professional/annuity-products.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/financial-professional/annuity-products/product-match-pro.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(32)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/get-appointed.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/resources.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/financial-professional/why-jackson.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professionals.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/financial-professionals/client-conversation-resources.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "#trust-owned-annuities-for-trustees",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/financial-professionals/insurance-professionals.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professionals/tools/tax-deferral-calculator.html": [
        "#onetrust-banner-sdk",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/ria-and-wealth-managers.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(28)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/ria-and-wealth-managers/fee-based-annuity-solutions.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(28)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/ria-and-wealth-managers/integration-with-your-practice.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(28)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/ria-and-wealth-managers/making-it-easier-to-do-business.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(28)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.body-content.base-version > section:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/ria-and-wealth-managers/planning-tools-for-your-journey.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(28)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/supplier-management.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/the-jackson-difference.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/the-jackson-difference/careers.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/the-jackson-difference/corporate-responsibility.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/the-jackson-difference/supporting-our-community.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/the-jackson-difference/supporting-our-community/grant-application.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/the-jackson-difference/who-we-are.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/the-jackson-difference/who-we-are/jnam.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/the-jackson-difference/who-we-are/jnam/investment-due-diligence.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/the-jackson-difference/who-we-are/leaders.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/the-jackson-difference/who-we-are/news.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/your-financial-future.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/your-financial-future/calculators-and-tools.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/your-financial-future/educational-resources.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(26)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/your-financial-future/how-to-plan-for-retirement.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/your-financial-future/retirement-statistics.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ]
    }
  };
  var parsers = {
    "columns-sidebar": parse,
    "cards-product": parse2,
    "columns-feature": parse3,
    "hero-page": parse4,
    "contact-form": parse5,
    "embed-video": parse6,
    "hero-banner": parse7,
    "cards-tool": parse8,
    "cards-feature": parse9,
    "cards-video": parse10,
    "tabs-section": parse11,
    "accordion-manager": parse12,
    "columns-benefits": parse13,
    "disclaimer-gate": parse14,
    "cards-article": parse15,
    "table-product": parse16,
    "list-filter": parse17,
    "cards-event": parse18,
    "location-tiles": parse19,
    "columns-schedule": parse20,
    "cards-team": parse21,
    "retirement-calculator": parse22
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
  var import_content_page_default = {
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
      params.fragments.forEach(({ element }) => {
        executeTransformers("afterTransform", element, payload, earlyTransformers);
        WebImporter.rules.transformBackgroundImages(element, document);
        WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
      });
      main.appendChild(document.createElement("hr"));
      WebImporter.rules.createMetadata(main, document);
      const themePath = new URL(params.originalURL).pathname;
      const APP_TEMPLATES = ["app-search-form", "account-recovery-form", "sign-in"];
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
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.x?html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }, ...params.fragments];
    }
  };
  return __toCommonJS(import_content_page_exports);
})();
