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

  // tools/importer/import-advisor-content-page.js
  var import_advisor_content_page_exports = {};
  __export(import_advisor_content_page_exports, {
    default: () => import_advisor_content_page_default
  });

  // tools/importer/parsers/columns-feature.js
  var COMPONENTS = ".image, .ibm-video, .video-container, .header, .cta-list, .rte, .cta-icon-card, .promo-image-card";
  function textOf(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function flattenInline(document, src, tag) {
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
    if (!textOf(src)) return null;
    const tag = h ? h.tagName.toLowerCase() : fallbackTag;
    return flattenInline(document, src, tag);
  }
  function richChildren(document, container) {
    const out = [];
    if (!container) return out;
    [...container.children].forEach((child) => {
      if (!textOf(child) && !child.querySelector("img")) return;
      child.removeAttribute("style");
      child.querySelectorAll("[style]").forEach((s) => s.removeAttribute("style"));
      child.innerHTML = child.innerHTML.replace(/(<br\s*\/?>\s*(&nbsp;| |\s)*)+$/i, "");
      out.push(child);
    });
    if (!out.length && textOf(container)) {
      const p = document.createElement("p");
      p.textContent = textOf(container);
      out.push(p);
    }
    return out;
  }
  function linkParas(document, links) {
    return links.filter((a) => a && a.getAttribute("href") && textOf(a)).map((a) => {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = textOf(a);
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
  function extractComponent(document, comp) {
    const out = [];
    if (comp.matches(".ibm-video, .video-container") || comp.querySelector("iframe") && !textOf(comp)) {
      const v = videoLink(document, comp.querySelector("iframe"));
      if (v) out.push(v);
    } else if (comp.matches(".image")) {
      const img = imageEl(comp.querySelector("img"));
      if (img) out.push(img);
    } else if (comp.matches(".header")) {
      const h = headingFrom(document, comp.querySelector(".title"), "h2");
      if (h) out.push(h);
      out.push(...richChildren(document, comp.querySelector(".description")));
      out.push(...linkParas(document, [...comp.querySelectorAll(".small-links a")]));
    } else if (comp.matches(".cta-list")) {
      const h = headingFrom(document, comp.querySelector(".cta-list__header"), "h3");
      if (h) out.push(h);
      out.push(...richChildren(document, comp.querySelector(".cta-list__description")));
      out.push(...linkParas(document, [...comp.querySelectorAll(".customContent a, .cta-list__links a")]));
    } else if (comp.matches(".rte")) {
      out.push(...richChildren(document, comp.querySelector(".cmp-text") || comp));
    } else if (comp.matches(".cta-icon-card")) {
      const img = imageEl(comp.querySelector(".icon-image img"));
      if (img) {
        const p = document.createElement("p");
        p.append(img);
        out.push(p);
      }
      const title = comp.querySelector(".card-content .title");
      const titleHeading = title && title.querySelector("h1, h2, h3, h4, h5, h6");
      if (titleHeading && textOf(titleHeading)) {
        out.push(headingFrom(document, titleHeading, "h3"));
      } else if (title && textOf(title)) {
        const p = document.createElement("p");
        const strong = flattenInline(document, title, "strong");
        p.append(strong);
        out.push(p);
      }
      out.push(...richChildren(document, comp.querySelector(".description")));
      out.push(...linkParas(document, [...comp.querySelectorAll(".cta-arrow-button-wrapper a")]));
    } else if (comp.matches(".promo-image-card")) {
      const img = imageEl(comp.querySelector(".promo-image-card__image img"));
      if (img) {
        const p = document.createElement("p");
        p.append(img);
        out.push(p);
      }
      const h = headingFrom(document, comp.querySelector(".promo-image-card__title"), "h3");
      if (h) out.push(h);
      out.push(...richChildren(document, comp.querySelector(".promo-image-card__description")));
      out.push(...linkParas(document, [...comp.querySelectorAll(".promo-image-card__link a")]));
    }
    return out;
  }
  function extractColumn(document, col) {
    const comps = [...col.querySelectorAll(COMPONENTS)].filter((c, i, all) => !all.some((o) => o !== c && o.contains(c)));
    if (!comps.length) {
      const out = [];
      col.querySelectorAll("h1, h2, h3, h4, h5, h6, p, ul, ol, img").forEach((n) => {
        if (n.closest("p, ul, ol") && n.tagName !== "P" && n.tagName !== "UL" && n.tagName !== "OL") return;
        if (n.matches("img") || textOf(n)) out.push(n);
      });
      const iframe = col.querySelector("iframe");
      if (iframe) out.push(videoLink(document, iframe));
      return out.filter(Boolean);
    }
    return comps.flatMap((c) => extractComponent(document, c));
  }
  function v1Text(document, box, titleSel, descSel, linkSel) {
    const out = [];
    const h = headingFrom(document, box.querySelector(titleSel), "h3");
    if (h) out.push(h);
    out.push(...richChildren(document, box.querySelector(descSel)));
    out.push(...linkParas(document, [...box.querySelectorAll(linkSel)]));
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
      const text4 = v1Text(
        document,
        feature,
        ".feature-50-50__title",
        ".feature-50-50__description",
        ".feature-50-50__links a, .feature-50-50__link a, .feature-50-50__cta a"
      );
      const imageRight = feature.matches(".image-right");
      const row = imageRight ? [text4, media] : [media, text4];
      return { row: row.map((c) => c.length ? c : ""), variant: imageRight ? null : "image-left" };
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
      if (label && textOf(label)) {
        const tag = header && /^H[1-6]$/.test(header.tagName) ? header.tagName.toLowerCase() : "h3";
        out.push(flattenInline(document, label, tag));
      }
      card.querySelectorAll(".feature-accordion__card-description").forEach((d) => {
        if (!textOf(d)) return;
        if (d.tagName === "P") out.push(flattenInline(document, d, "p"));
        else out.push(...richChildren(document, d));
      });
      out.push(...linkParas(document, [...card.querySelectorAll(".feature-accordion__card-cta a[href]")]));
    });
    const img = imageEl(root.querySelector(".feature-accordion__image img"));
    if (img) out.push(img);
    return out.length ? out : null;
  }
  function parse(element, { document, params }) {
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
      const row = [main, secondary].filter(Boolean).map((col) => extractColumn(document, col));
      cells.push(row.map((c) => c.length ? c : ""));
      const isDefault = main && secondary && main.querySelector(".image img") && secondary.querySelector(".cta-list");
      if (!isDefault) variant = "alt";
    } else if (promoCards.length) {
      variant = "product-intro";
      cells.push(promoCards.map((card) => extractComponent(document, card)));
    } else {
      const items = [...element.querySelectorAll(".cta-list")];
      if (items.length) {
        variant = "dark";
        cells.push(items.map((item) => extractComponent(document, item)));
      } else {
        const col = extractColumn(document, element);
        if (col.length) cells.push([col]);
      }
    }
    const name = variant ? `columns-feature (${variant})` : "columns-feature";
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
  function parse2(element, { document, params }) {
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

  // tools/importer/parsers/cards-feature.js
  function textOf2(el) {
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
    if (!src || !textOf2(src)) return null;
    const h = document.createElement(`h${headingLevel(src, fallback)}`);
    h.innerHTML = src.innerHTML.trim();
    [...h.querySelectorAll("*")].forEach((d) => {
      if (!d.matches("sup, sub, em, strong, b, i, a, br")) d.replaceWith(...d.childNodes);
    });
    h.innerHTML = h.innerHTML.replace(/\s+/g, " ").trim();
    if (!textOf2(h)) h.textContent = textOf2(src);
    return h;
  }
  function cleanDescription(document, desc) {
    const out = [];
    if (!desc) return out;
    [...desc.children].forEach((child) => {
      if (!textOf2(child) && !child.querySelector("img, picture")) return;
      child.removeAttribute("style");
      child.querySelectorAll("[style]").forEach((s) => s.removeAttribute("style"));
      out.push(child);
    });
    if (!out.length && textOf2(desc)) {
      const p = document.createElement("p");
      p.textContent = textOf2(desc);
      out.push(p);
    }
    return out;
  }
  function ctaParagraphs(document, links) {
    return links.filter((a) => a && a.getAttribute("href") && textOf2(a)).map((a) => {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = textOf2(a);
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
      if (head && textOf2(head)) {
        const h = document.createElement("h3");
        const a = document.createElement("a");
        a.href = head.getAttribute("href");
        a.textContent = textOf2(head);
        h.append(a);
        body.push(h);
      }
      const links = [...section.querySelectorAll(":scope > .link a[href]")].filter((a) => textOf2(a));
      if (links.length) {
        const ul = document.createElement("ul");
        links.forEach((src) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = src.getAttribute("href");
          a.textContent = textOf2(src);
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
        if (!textOf2(child) && !child.querySelector("img")) return;
        const img = child.querySelector("img");
        const body = [];
        const h = makeHeading(document, child.querySelector("h1, h2, h3, h4, h5, h6, .title"), 3);
        if (h) body.push(h);
        child.querySelectorAll("p, ul, ol").forEach((p) => {
          if (textOf2(p)) body.push(p);
        });
        const loose = [...child.querySelectorAll(".small-links a[href], .cta-arrow-button-wrapper a[href], a.primary-button[href], a.secondary-button[href]")].filter((a, i, all) => all.indexOf(a) === i && !body.some((n) => n.contains && n.contains(a)));
        body.push(...ctaParagraphs(document, loose));
        if (!body.length && !img) return;
        const prev = cells[cells.length - 1];
        if (!img && prev && body.every((n) => n.tagName === "P" && n.querySelector("a") && textOf2(n) === textOf2(n.querySelector("a")))) {
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
  function linkList(document, links) {
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
  function parseProductCard2(document, card) {
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
      groups.forEach((g) => body.push(linkList(document, g)));
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
  function parse4(element, { document, params }) {
    const root = element;
    let items = [];
    const ctaLists = [...root.querySelectorAll(".cta-list")];
    const productLines = [...root.querySelectorAll(".product-line-card")].filter((c) => c.querySelector(".product-line-card__title, .product-line-card__description"));
    const logoCards = [...root.querySelectorAll(".logo-card")];
    const productCards = unitsOf(root, UNIT_SELECTORS.productCard);
    const firmCards = unitsOf(root, UNIT_SELECTORS.firmCard);
    let firm = false;
    if (productCards.length && !ctaLists.length && !productLines.length && !logoCards.length) {
      items = productCards.map((c) => parseProductCard2(document, c));
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
  function slugify(text4) {
    return String(text4 || "").toLowerCase().replace(/&amp;/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "tab";
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
    const text4 = clone.textContent.replace(/\s+/g, " ").trim();
    const link = clone.querySelector("a[href]");
    if (link && text4) {
      const a = document.createElement("a");
      a.href = link.getAttribute("href");
      a.textContent = text4;
      parts.push(a);
    } else if (text4) {
      parts.push(text4);
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
  function parse5(element, { document, params }) {
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
            const text4 = t.textContent.replace(/\s+/g, " ").trim();
            if (!text4) {
              t.remove();
              return;
            }
            const h = document.createElement("h3");
            h.textContent = text4;
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
    let text4 = "";
    const id = ctrl.getAttribute("id");
    if (id) {
      const label = [...form.querySelectorAll("label")].find((l) => l.getAttribute("for") === id);
      if (label) {
        const clone = label.cloneNode(true);
        clone.querySelectorAll(".mktoAsterix").forEach((a) => a.remove());
        text4 = clone.textContent.replace(/\s+/g, " ").trim();
      }
    }
    if (!text4 && ctrl.closest("label")) text4 = ctrl.closest("label").textContent.replace(/\s+/g, " ").trim();
    if (!text4) text4 = (ctrl.getAttribute("placeholder") || "").trim();
    if (!text4 && ctrl.tagName.toLowerCase() === "button") text4 = ctrl.textContent.trim();
    if (!text4) text4 = (ctrl.getAttribute("value") || ctrl.getAttribute("name") || "").trim();
    return text4;
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
  function parse6(element, { document, params }) {
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

  // tools/importer/parsers/columns-benefits.js
  function textOf3(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function flattenInline2(document, src, tag) {
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
    const hs = [...container.querySelectorAll("h1, h2, h3, h4, h5, h6")].filter((h) => textOf3(h));
    if (!hs.length) return null;
    return flattenInline2(document, hs[0], hs[0].tagName.toLowerCase());
  }
  function richChildren2(document, container) {
    const out = [];
    if (!container) return out;
    [...container.children].forEach((child) => {
      if (!textOf3(child) && !child.querySelector("img")) return;
      child.removeAttribute("style");
      child.querySelectorAll("[style]").forEach((s) => s.removeAttribute("style"));
      child.innerHTML = child.innerHTML.replace(/(<br\s*\/?>\s*(&nbsp;| |\s)*)+$/i, "");
      out.push(child);
    });
    if (!out.length && textOf3(container)) {
      const p = document.createElement("p");
      p.textContent = textOf3(container);
      out.push(p);
    }
    return out;
  }
  function linkParas2(document, links) {
    return links.filter((a) => a && a.getAttribute("href") && textOf3(a)).map((a) => {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = textOf3(a);
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
    intro.push(...richChildren2(document, content.querySelector(".description")));
    intro.push(...linkParas2(document, [...content.querySelectorAll(".action a")]));
    const benefits = [];
    const stats = spot.querySelector(".stats-container");
    if (stats) {
      const titleEl = stats.querySelector(".stat-title");
      const th = titleEl && (titleEl.querySelector("h1, h2, h3, h4, h5, h6") || titleEl);
      if (th && textOf3(th)) {
        const tag = th.matches("h1, h2, h3, h4, h5, h6") ? th.tagName.toLowerCase() : "h4";
        benefits.push(flattenInline2(document, th, tag));
      }
      const ul = document.createElement("ul");
      const headers = [...stats.querySelectorAll(".stat-header")];
      headers.forEach((header) => {
        const li = document.createElement("li");
        const hSrc = [...header.querySelectorAll("h1, h2, h3, h4, h5, h6")].find((x) => textOf3(x));
        if (hSrc) {
          const hEl = flattenInline2(document, hSrc, hSrc.tagName === "H1" ? "h2" : hSrc.tagName.toLowerCase());
          hEl.querySelectorAll("b, strong").forEach((x) => x.replaceWith(...x.childNodes));
          hEl.querySelectorAll("sup, sub").forEach((x) => {
            if (!textOf3(x)) x.remove();
          });
          hEl.innerHTML = hEl.innerHTML.replace(/(&nbsp;|\s)+$/, "").replace(/^(&nbsp;|\s)+/, "");
          li.append(hEl);
          let d = header.nextElementSibling;
          if (d && !d.classList.contains("stat-description")) d = null;
          if (d && textOf3(d)) {
            const para3 = flattenInline2(document, d, "p");
            para3.querySelectorAll("b, strong").forEach((x) => x.replaceWith(...x.childNodes));
            li.append(para3);
          }
          if (textOf3(li)) ul.append(li);
          return;
        }
        const strong = flattenInline2(document, header, "strong");
        strong.querySelectorAll("b, strong").forEach((b) => b.replaceWith(...b.childNodes));
        strong.innerHTML = strong.innerHTML.replace(/(&nbsp;|\s)+$/, "").replace(/^(&nbsp;|\s)+/, "");
        if (textOf3(strong)) li.append(strong);
        let desc = header.nextElementSibling;
        if (desc && !desc.classList.contains("stat-description")) desc = null;
        if (desc && textOf3(desc)) {
          const span = flattenInline2(document, desc, "span");
          span.querySelectorAll("b, strong").forEach((b) => b.replaceWith(...b.childNodes));
          if (li.childNodes.length) li.append(document.createElement("br"));
          li.append(...span.childNodes);
        }
        if (textOf3(li)) ul.append(li);
      });
      if (!headers.length) {
        stats.querySelectorAll(".stat-description").forEach((d) => {
          if (!textOf3(d)) return;
          const li = document.createElement("li");
          li.append(...flattenInline2(document, d, "span").childNodes);
          ul.append(li);
        });
      }
      if (ul.children.length) benefits.push(ul);
    }
    return [intro.length ? intro : "", benefits.length ? benefits : ""];
  }
  function parseFeature(document, feature) {
    const text4 = [];
    const h = firstHeading(document, feature.querySelector(".feature-50-50__card") || feature);
    if (h) text4.push(h);
    text4.push(...richChildren2(document, feature.querySelector(".feature-50-50__description")));
    text4.push(...linkParas2(document, [...feature.querySelectorAll(".feature-50-50__links a")]));
    const img = feature.querySelector(".feature-50-50__image img");
    const media = img && img.getAttribute("src") ? [img] : "";
    const content = feature.querySelector(".feature-50-50__content");
    const imageLeft = content && content.classList.contains("image-left");
    const textCell = text4.length ? text4 : "";
    if (!media) return [textCell];
    return imageLeft ? [media, textCell] : [textCell, media];
  }
  function parse7(element, { document, params }) {
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
      const items = [...element.children].filter((c) => textOf3(c) || c.querySelector("img"));
      if (items.length) cells.push(items.map((c) => [c]));
    }
    const name = variant ? `columns-benefits (${variant})` : "columns-benefits";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
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
  function parse8(element, { document, params }) {
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

  // tools/importer/parsers/app-form.js
  var INPUT_TYPES2 = ["text", "email", "tel", "number", "password", "date", "search", "url", "checkbox", "radio"];
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
    let text4 = "";
    const id = ctrl.getAttribute("id");
    if (id) {
      const label = [...form.querySelectorAll("label")].find((l) => l.getAttribute("for") === id);
      if (label) text4 = label.textContent.replace(/\s+/g, " ").trim();
    }
    if (!text4 && ctrl.closest("label")) text4 = ctrl.closest("label").textContent.replace(/\s+/g, " ").trim();
    if (!text4 && ctrl.getAttribute("aria-describedby")) {
      const ref = ctrl.getAttribute("aria-describedby").split(/\s+/)[0];
      const el = [...form.querySelectorAll("[id]")].find((n) => n.getAttribute("id") === ref);
      if (el) text4 = el.textContent.replace(/\s+/g, " ").trim();
    }
    if (!text4) text4 = (ctrl.getAttribute("placeholder") || ctrl.getAttribute("aria-label") || "").trim();
    if (!text4 && ctrl.tagName.toLowerCase() === "button") text4 = ctrl.textContent.replace(/\s+/g, " ").trim();
    if (!text4) text4 = (ctrl.getAttribute("value") || ctrl.getAttribute("name") || "").trim();
    return text4;
  }
  function helpText(ctrl, document) {
    const field = ctrl.closest(".field, .cmp-form-text, .cmp-form-options");
    const help = field && field.querySelector(".cmp-form-text__help-block, .help-block");
    const t = help ? help.textContent.replace(/\s+/g, " ").trim() : "";
    return t ? document.createTextNode(t) : "";
  }
  function optionList(select, document) {
    const ul = document.createElement("ul");
    [...select.querySelectorAll("option")].forEach((o) => {
      const t = o.textContent.trim();
      if (!t || !o.getAttribute("value")) return;
      const li = document.createElement("li");
      li.textContent = t;
      ul.append(li);
    });
    return ul.children.length ? ul : "";
  }
  function formRows2(form, document) {
    const rows = [];
    const seenGroups = /* @__PURE__ */ new Set();
    form.querySelectorAll("input, select, textarea, button").forEach((ctrl) => {
      var _a;
      if (ctrl.closest(".g-recaptcha, .grecaptcha-badge") || /recaptcha/i.test(ctrl.getAttribute("name") || ctrl.getAttribute("id") || "")) return;
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
          const legend = (_a = ctrl.closest("fieldset")) == null ? void 0 : _a.querySelector("legend");
          rows.push([legend ? legend.textContent.trim() : name, type === "radio" ? "radio" : "checkboxes", ul]);
          return;
        }
      }
      let label = controlLabel2(ctrl, form);
      if (!label) return;
      if (ctrl.hasAttribute("required") && !/\*\s*$/.test(label)) label = `${label} *`;
      const extra = type === "select" ? optionList(ctrl, document) : helpText(ctrl, document);
      rows.push([label, type, extra]);
    });
    return rows;
  }
  function parseLegacy(element, document) {
    element.querySelectorAll("link, script, style, noscript").forEach((n) => n.remove());
    const legacy = element.querySelector("#legacyUrl");
    const path = legacy && legacy.getAttribute("value");
    if (!path) {
      element.remove();
      return;
    }
    const href = /^https?:/.test(path) ? path : `https://www.jackson.com${path}`;
    const p = document.createElement("p");
    const a = document.createElement("a");
    a.href = href;
    a.textContent = "View daily performance data";
    p.append(a);
    element.replaceWith(p);
  }
  function ownText(el) {
    return [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(" ").replace(/\s+/g, " ").trim();
  }
  function linkListRow(document, links) {
    const ul = document.createElement("ul");
    links.forEach((src) => {
      const href = src.getAttribute("href");
      const t = src.textContent.replace(/\s+/g, " ").trim();
      if (!href || href === "#" || !t) return;
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = href;
      a.textContent = t;
      li.append(a);
      ul.append(li);
    });
    return ul.children.length ? [[ul]] : [];
  }
  function jsfRows(form, document) {
    const rows = [];
    const firstH1 = document.querySelector("h1");
    const seenGroups = /* @__PURE__ */ new Set();
    const skip = (el) => el.matches('script, style, noscript, .ui-messages, [style*="display: none"], [style*="display:none"], .visible-xs, .guide-mobile-navigator, .guide-header-bar-wrapper, .sr-only') || el.matches(".ui-helper-hidden-accessible") && !el.querySelector('input[type="radio"], input[type="checkbox"], select');
    const visit = (el) => {
      var _a;
      if (skip(el)) return;
      const tag = el.tagName.toLowerCase();
      if (/^h[1-6]$/.test(tag)) {
        const t = el.textContent.replace(/\s+/g, " ").trim();
        if (t) {
          const h = document.createElement(tag === "h1" && el !== firstH1 ? "h2" : tag);
          h.textContent = t;
          rows.push([h]);
        }
        return;
      }
      if (tag === "p") {
        if (el.textContent.trim()) {
          const p = document.createElement("p");
          p.innerHTML = el.innerHTML;
          p.querySelectorAll("[class], [id], [style]").forEach((n) => {
            n.removeAttribute("class");
            n.removeAttribute("id");
            n.removeAttribute("style");
          });
          rows.push([p]);
        }
        return;
      }
      if (el.matches("ol.wizard-navigators, ul.wizard-navigators, ul.ui-wizard-step-titles")) {
        const ol = document.createElement("ol");
        const whole = el.matches(".ui-wizard-step-titles");
        [...el.children].forEach((li) => {
          if (li.matches(".hidden")) return;
          const label = (whole ? li : li.querySelector("a, span") || li).textContent.replace(/\s+/g, " ").trim();
          if (!label || /^error page$/i.test(label)) return;
          const item = document.createElement("li");
          item.textContent = label;
          ol.append(item);
        });
        if (ol.children.length) rows.push([ol]);
        return;
      }
      if ((tag === "ul" || tag === "ol" || el.matches("div.column")) && !el.querySelector("input, select, textarea, button") && el.querySelector("a")) {
        rows.push(...linkListRow(document, [...el.querySelectorAll("a")]));
        return;
      }
      if (el.matches("input, select, textarea, button")) {
        const type = controlType2(el);
        if (!type || /_focus$/.test(el.getAttribute("id") || "")) return;
        if (type === "radio" || type === "checkbox") {
          const name = el.getAttribute("name");
          const group = name ? [...form.querySelectorAll("input")].filter((i) => i.getAttribute("name") === name) : [el];
          if (group.length > 1) {
            if (seenGroups.has(name)) return;
            seenGroups.add(name);
            const ul = document.createElement("ul");
            group.forEach((g) => {
              const li = document.createElement("li");
              li.textContent = controlLabel2(g, form);
              ul.append(li);
            });
            const prompt = el.closest(".userSelection, fieldset");
            let label2 = prompt ? prompt.matches("fieldset") ? ((_a = prompt.querySelector("legend")) == null ? void 0 : _a.textContent) || "" : ownText(prompt) : "";
            if (!label2.trim()) {
              const node = el.closest(".guideFieldNode");
              const fl = node ? node.querySelector(".guideFieldLabel") : null;
              if (fl) label2 = fl.textContent;
            }
            if (!label2.trim()) {
              const panel = el.closest("table") ? el.closest("table").parentElement : null;
              const h = panel ? [...panel.children].find((c) => /^H[1-6]$/.test(c.tagName)) : null;
              if (h) label2 = h.textContent;
            }
            label2 = label2.replace(/:\s*$/, "").trim() || controlLabel2(group[0], form);
            rows.push([label2, type === "radio" ? "radio" : "checkboxes", ul]);
            return;
          }
        }
        let label = controlLabel2(el, form);
        if (!label) return;
        if (el.hasAttribute("required") && !/\*\s*$/.test(label)) label = `${label} *`;
        let extra = type === "select" ? optionList(el, document) : helpText(el, document);
        if (!extra && type !== "submit" && type !== "reset") {
          const li = el.closest("li");
          if (li) {
            const clone = li.cloneNode(true);
            clone.querySelectorAll("label, input, select, textarea, button, .ui-message, script").forEach((n) => n.remove());
            const t = clone.textContent.replace(/\s+/g, " ").trim();
            if (t) extra = document.createTextNode(t);
          }
        }
        rows.push([label, type, extra]);
        return;
      }
      if (tag === "label") return;
      if (el.matches(".guidePanelDescription")) {
        const t = el.textContent.replace(/\s+/g, " ").trim();
        if (t) {
          const h = document.createElement("h3");
          h.textContent = t;
          rows.push([h]);
        }
        return;
      }
      if (tag === "a") {
        const t = el.textContent.replace(/\s+/g, " ").trim();
        const href = el.getAttribute("href");
        if (!t) return;
        if (/Button/.test(el.className || "") && (!href || href === "#" || /^javascript:/i.test(href))) {
          rows.push([t, /secondary/i.test(el.className) || /cancel/i.test(t) ? "reset" : "submit", ""]);
          return;
        }
        rows.push(...linkListRow(document, [el]).map(([ul]) => {
          const p = document.createElement("p");
          p.append(ul.querySelector("a"));
          return [p];
        }));
        return;
      }
      if (tag === "div" && !el.children.length && el.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = el.textContent.replace(/\s+/g, " ").trim();
        rows.push([p]);
        return;
      }
      [...el.children].forEach(visit);
    };
    [...form.children].forEach(visit);
    return rows;
  }
  function parse9(element, { document, params }) {
    const jsfForm = element.matches("form") ? element : element.querySelector("form") || element.closest("form");
    const isAppForm = jsfForm && (jsfForm.querySelector('input[name="javax.faces.ViewState"]') || jsfForm.matches("#guideContainerForm") || jsfForm.closest(".guideContainer"));
    if (isAppForm) {
      const rows2 = jsfRows(jsfForm, document);
      if (!rows2.length) {
        element.remove();
        return;
      }
      const block2 = WebImporter.Blocks.createBlock(document, { name: "app-form", cells: rows2 });
      if (element === jsfForm || element.contains(jsfForm)) {
        if (element === jsfForm) element.replaceWith(block2);
        else jsfForm.replaceWith(block2);
      } else {
        jsfForm.replaceWith(block2);
      }
      return;
    }
    if (element.matches(".legacy-component") || element.querySelector("#legacyUrl")) {
      parseLegacy(element, document);
      return;
    }
    const form = element.matches("form") ? element : element.querySelector("form");
    if (!form) {
      element.remove();
      return;
    }
    const rows = formRows2(form, document);
    if (!rows.length) {
      element.remove();
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "app-form", cells: rows });
    element.replaceWith(block);
  }

  // tools/importer/parsers/address-card.js
  function paras(document, el) {
    if (!el) return [];
    const out = [...el.querySelectorAll(":scope > p")].filter((p) => p.textContent.trim()).map((p) => {
      const n = document.createElement("p");
      n.innerHTML = p.innerHTML.trim();
      n.querySelectorAll("[style]").forEach((s) => s.removeAttribute("style"));
      return n;
    });
    if (!out.length && el.textContent.trim()) {
      const n = document.createElement("p");
      n.textContent = el.textContent.replace(/\s+/g, " ").trim();
      out.push(n);
    }
    return out;
  }
  function parse10(element, { document, params }) {
    const title = paras(document, element.querySelector(".contact-locations__title"));
    const address = paras(document, element.querySelector(".contact-locations__description"));
    if (!title.length && !address.length) {
      element.remove();
      return;
    }
    const cells = [];
    if (title.length) cells.push([title]);
    if (address.length) cells.push([address]);
    const block = WebImporter.Blocks.createBlock(document, { name: "address-card", cells });
    element.replaceWith(block);
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
    const text4 = container.querySelector(".cmp-text") || container;
    const kids = [...text4.children].filter((c) => c.textContent.trim() || c.querySelector("img"));
    return kids;
  }
  function parse11(element, { document, params }) {
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

  // tools/importer/parsers/cards-article.js
  function text(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function para(document, value) {
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
  function imageOf(scope) {
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
    if (tag) body.push(para(document, tag));
    const date = text(card.querySelector(".article-card__publish-date"));
    if (date) body.push(para(document, date));
    const title = card.querySelector(".article-card__title");
    if (title && text(title)) body.push(linkedHeading(document, title, href));
    const desc = card.querySelector(".article-card__description");
    if (desc && text(desc)) body.push(richPara(document, desc));
    const author = text(card.querySelector(".article-card__author"));
    if (author) body.push(para(document, author));
    const dur = text(card.querySelector(".article-card__duration"));
    if (dur) body.push(para(document, dur));
    return { image: imageOf(card.querySelector(".article-card__image") || card), body };
  }
  function parseResource(document, card) {
    const body = [];
    const href = hrefOf(card);
    const tag = text(card.querySelector(".asset-type"));
    if (tag) body.push(para(document, tag));
    const date = text(card.querySelector(".content .length, .length"));
    if (date) body.push(para(document, date));
    const content = card.querySelector(".content") || card;
    const title = content.querySelector("h1, h2, h3, h4, h5, h6");
    if (title && text(title)) body.push(linkedHeading(document, title, href));
    content.querySelectorAll(":scope > p").forEach((p) => {
      if (text(p)) body.push(richPara(document, p));
    });
    return { image: imageOf(card.querySelector(".imagery") || card), body };
  }
  function parse12(element, { document, params }) {
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

  // tools/importer/parsers/pagination.js
  function parse13(element, { document, params }) {
    const links = [...element.querySelectorAll("a[href]")].filter((a) => a.textContent.trim());
    if (!links.length) {
      element.remove();
      return;
    }
    const cell = links.map((a) => {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = a.textContent.replace(/\s+/g, " ").trim();
      p.append(link);
      return p;
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "pagination", cells: [[cell]] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/list-filter.js
  function text2(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function parse14(element, { document, params }) {
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

  // tools/importer/parsers/cards-tool.js
  function cleanInline(document, src, tag) {
    const el = document.createElement(tag);
    el.innerHTML = src.innerHTML;
    el.querySelectorAll("div, span").forEach((w) => w.replaceWith(...w.childNodes));
    el.innerHTML = el.innerHTML.trim();
    return el;
  }
  function para2(document, text4) {
    const p = document.createElement("p");
    p.textContent = text4;
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
  function imageOf2(scope) {
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
    return { image: imageOf2(card.querySelector(".promo-image") || card), body };
  }
  function parsePartner(document, card) {
    const body = [];
    const tag = card.querySelector(".resource-filter-listing__header-text, .resource-filter-listing__mobile-header-text");
    if (tag && tag.textContent.trim()) body.push(para2(document, tag.textContent.trim()));
    const logo = imageOf2(card.querySelector(".logo-image-container"));
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
      const text4 = cap && cap.textContent.trim();
      return { image: null, body: [], caption: text4 ? para2(document, text4) : null };
    }
    return { image: logo, body };
  }
  function parse15(element, { document, params }) {
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
  function parse16(element, { document, params }) {
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

  // tools/importer/import-advisor-content-page.js
  var PAGE_TEMPLATE = {
    "name": "advisor-content-page",
    "urls": [
      "https://www.jackson.com/financial-professional/annuity-products/client-needs.html",
      "https://www.jackson.com/financial-professional/annuity-products/client-needs/growth-potential.html",
      "https://www.jackson.com/financial-professional/annuity-products/client-needs/legacy-planning.html",
      "https://www.jackson.com/financial-professional/annuity-products/client-needs/lifetime-income.html",
      "https://www.jackson.com/financial-professional/annuity-products/client-needs/protection-options.html",
      "https://www.jackson.com/financial-professional/annuity-products/client-needs/tax-deferral.html",
      "https://www.jackson.com/financial-professional/annuity-products/fee-based-annuities.html",
      "https://www.jackson.com/financial-professional/annuity-products/fixed-annuities.html",
      "https://www.jackson.com/financial-professional/annuity-products/fixed-index-annuities.html",
      "https://www.jackson.com/financial-professional/annuity-products/registered-index-linked-annuities.html",
      "https://www.jackson.com/financial-professional/annuity-products/variable-annuities.html",
      "https://www.jackson.com/financial-professional/bank.html",
      "https://www.jackson.com/financial-professional/bank/referral.html",
      "https://www.jackson.com/financial-professional/contact-us.html",
      "https://www.jackson.com/financial-professional/credit-union.html",
      "https://www.jackson.com/financial-professional/credit-union/referral.html",
      "https://www.jackson.com/financial-professional/find-your-wholesaler.html",
      "https://www.jackson.com/financial-professional/independent.html",
      "https://www.jackson.com/financial-professional/insurance-professional.html",
      "https://www.jackson.com/financial-professional/regional.html",
      "https://www.jackson.com/financial-professional/resources/advisor-experience-updates.html",
      "https://www.jackson.com/financial-professional/resources/annuity-calculator-and-tools.html",
      "https://www.jackson.com/financial-professional/resources/client-resources.html",
      "https://www.jackson.com/financial-professional/resources/retirement-articles.html",
      "https://www.jackson.com/financial-professional/resources/retirement-research.html",
      "https://www.jackson.com/financial-professional/ria-and-wealth-manager.html",
      "https://www.jackson.com/financial-professional/ria-and-wealth-manager/integrations.html",
      "https://www.jackson.com/financial-professional/ria-and-wealth-manager/making-it-easier.html",
      "https://www.jackson.com/financial-professional/ria-and-wealth-manager/ria-academy.html",
      "https://www.jackson.com/financial-professional/sitemap.html",
      "https://www.jackson.com/financial-professional/why-jackson/customer-care.html",
      "https://www.jackson.com/financial-professional/why-jackson/financial-strength.html",
      "https://www.jackson.com/financial-professional/why-jackson/value-added-services.html",
      "https://www.jackson.com/financial-professional/why-jackson/wholesaler-support.html",
      "https://www.jackson.com/financial-professional/wirehouse.html"
    ],
    "description": "Text-only hero, feature accordion, text blocks, 50-50 feature rows and card containers",
    "blocks": [
      {
        "name": "columns-feature",
        "instances": [
          "div.feature-accordion.v1"
        ],
        "pageInstances": {
          "https://www.jackson.com/financial-professional/annuity-products/client-needs.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.feature-accordion.v1",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.feature-50-50.v1"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/client-needs/growth-potential.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.flexible-width-container.v1",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(7)"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/client-needs/legacy-planning.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.flexible-width-container.v1",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4)"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/client-needs/lifetime-income.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.flexible-width-container.v1",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5)"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/client-needs/protection-options.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3)"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/client-needs/tax-deferral.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5)"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/fee-based-annuities.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(8)"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/fixed-annuities.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.feature-50-50.v1",
            "#expVar-468268836 > div.feature-50-50.v1"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/fixed-index-annuities.html": [
            "#expVar-1708939007 > div.feature-50-50.v1"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/registered-index-linked-annuities.html": [
            "#expVar-1656512025 > div.feature-50-50.v1"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/variable-annuities.html": [
            "#expVar-815326180 > div.feature-50-50.v1"
          ],
          "https://www.jackson.com/financial-professional/bank.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(9)"
          ],
          "https://www.jackson.com/financial-professional/bank/referral.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(7)"
          ],
          "https://www.jackson.com/financial-professional/credit-union.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(9)"
          ],
          "https://www.jackson.com/financial-professional/credit-union/referral.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(7)"
          ],
          "https://www.jackson.com/financial-professional/find-your-wholesaler.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.feature-50-50.v1"
          ],
          "https://www.jackson.com/financial-professional/independent.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(8)"
          ],
          "https://www.jackson.com/financial-professional/insurance-professional.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4)"
          ],
          "https://www.jackson.com/financial-professional/regional.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(8)"
          ],
          "https://www.jackson.com/financial-professional/resources/advisor-experience-updates.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.feature-50-50.v1",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(6)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(7)"
          ],
          "https://www.jackson.com/financial-professional/resources/annuity-calculator-and-tools.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5)"
          ],
          "https://www.jackson.com/financial-professional/resources/client-resources.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.feature-50-50.v1"
          ],
          "https://www.jackson.com/financial-professional/ria-and-wealth-manager.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5)"
          ],
          "https://www.jackson.com/financial-professional/ria-and-wealth-manager/integrations.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.feature-50-50.v1"
          ],
          "https://www.jackson.com/financial-professional/ria-and-wealth-manager/making-it-easier.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.feature-50-50.v1"
          ],
          "https://www.jackson.com/financial-professional/ria-and-wealth-manager/ria-academy.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.feature-50-50.v1"
          ],
          "https://www.jackson.com/financial-professional/why-jackson/customer-care.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5)"
          ],
          "https://www.jackson.com/financial-professional/why-jackson/value-added-services.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(8)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(9)"
          ],
          "https://www.jackson.com/financial-professional/why-jackson/wholesaler-support.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5)"
          ],
          "https://www.jackson.com/financial-professional/wirehouse.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(8)"
          ]
        }
      },
      {
        "name": "embed-video",
        "instances": [
          "div.ibm-video.v2"
        ],
        "pageInstances": {
          "https://www.jackson.com/financial-professional/annuity-products/client-needs.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.flexible-width-container.v1"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/fee-based-annuities.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.flexible-width-container.v1 > div > div > div.flexible-width-container__columns.full-width > div > div.ibm-video.v2"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/fixed-annuities.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.flexible-width-container.v1 > div > div > div.flexible-width-container__columns.full-width"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/fixed-index-annuities.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.flexible-width-container.v1 > div > div > div.flexible-width-container__columns.full-width"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/registered-index-linked-annuities.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.flexible-width-container.v1 > div > div > div.flexible-width-container__columns.full-width"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/variable-annuities.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.flexible-width-container.v1 > div > div > div.flexible-width-container__columns.full-width"
          ],
          "https://www.jackson.com/financial-professional/resources/client-resources.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.flexible-width-container.v1 > div > div > div.flexible-width-container__columns.full-width"
          ]
        }
      },
      {
        "name": "cards-feature",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/financial-professional/annuity-products/client-needs.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.card-container.v1"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/client-needs/tax-deferral.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4)"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/fee-based-annuities.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4) > div > div > div.card-container__cards",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(7)"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/fixed-index-annuities.html": [
            "#fp-jpa-card > div.product-card__cta-section"
          ],
          "https://www.jackson.com/financial-professional/bank.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(10)"
          ],
          "https://www.jackson.com/financial-professional/bank/referral.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3) > div > div > div.card-container__cards",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(8) > div > div > div.card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/contact-us.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.card-container.v1"
          ],
          "https://www.jackson.com/financial-professional/credit-union.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(10)"
          ],
          "https://www.jackson.com/financial-professional/credit-union/referral.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3) > div > div > div.card-container__cards",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(8) > div > div > div.card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/find-your-wholesaler.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.wholesaler-search.base-version > div > div.wholesaler-search__aside"
          ],
          "https://www.jackson.com/financial-professional/independent.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(9)"
          ],
          "https://www.jackson.com/financial-professional/insurance-professional.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(8)"
          ],
          "https://www.jackson.com/financial-professional/regional.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(9)"
          ],
          "https://www.jackson.com/financial-professional/resources/advisor-experience-updates.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.card-container.v1"
          ],
          "https://www.jackson.com/financial-professional/resources/annuity-calculator-and-tools.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(6) > div > div > div.card-container__cards",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(8)"
          ],
          "https://www.jackson.com/financial-professional/resources/retirement-research.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.feature-50-50.v1"
          ],
          "https://www.jackson.com/financial-professional/ria-and-wealth-manager.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(8)"
          ],
          "https://www.jackson.com/financial-professional/ria-and-wealth-manager/making-it-easier.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2) > div > div > div.card-container__cards",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(6) > div > div > div.card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/ria-and-wealth-manager/ria-academy.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.card-container.v1"
          ],
          "https://www.jackson.com/financial-professional/sitemap.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(1) > div > div.sitemap__columns"
          ],
          "https://www.jackson.com/financial-professional/why-jackson/customer-care.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4)"
          ],
          "https://www.jackson.com/financial-professional/why-jackson/financial-strength.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.card-container.v1"
          ],
          "https://www.jackson.com/financial-professional/why-jackson/value-added-services.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.card-container.v1"
          ],
          "https://www.jackson.com/financial-professional/why-jackson/wholesaler-support.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3)"
          ],
          "https://www.jackson.com/financial-professional/wirehouse.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(9)"
          ]
        }
      },
      {
        "name": "cards-product",
        "instances": [
          "div.carousel-card-container__cards"
        ],
        "pageInstances": {
          "https://www.jackson.com/financial-professional/annuity-products/client-needs/growth-potential.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.card-container.v1 > div > div > div.card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/client-needs/legacy-planning.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.card-container.v1 > div > div > div.card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/client-needs/lifetime-income.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.card-container.v1 > div > div > div.card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/client-needs/protection-options.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.card-container.v1 > div > div > div.card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/client-needs/tax-deferral.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.card-container.v1 > div > div > div.card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/fee-based-annuities.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(5) > div > div > div.card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/fixed-annuities.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.card-container.v1 > div > div > div.card-container__cards",
            "#expVar-468268836 > div.card-container.v1 > div > div > div.card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/fixed-index-annuities.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.card-container.v1 > div > div > div.card-container__cards",
            "#expVar-1708939007 > div.xf-content-height > div > div:nth-child(2)",
            "#expVar-1708939007 > div.xf-content-height > div > div:nth-child(6)",
            "#expVar-1708939007 > div.xf-content-height > div > div:nth-child(8)",
            "#expVar-1708939007 > div.card-container.v1 > div > div > div.card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/registered-index-linked-annuities.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.card-container.v1 > div > div > div.card-container__cards",
            "#expVar-1656512025 > div.card-container.v1 > div > div > div.card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/variable-annuities.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.card-container.v1 > div > div > div.card-container__cards",
            "#expVar-815326180 > div.card-container.v1 > div > div > div.card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/bank.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(7) > div > div > div.card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/credit-union.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(7) > div > div > div.card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/independent.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(6) > div > div > div.card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/insurance-professional.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(6) > div > div > div.card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/regional.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(6) > div > div > div.card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/resources/annuity-calculator-and-tools.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2) > div > div > div.card-container__cards",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.carousel-card-container.v1 > div > div > div.carousel-card-container__cards.scrollbar"
          ],
          "https://www.jackson.com/financial-professional/ria-and-wealth-manager.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2) > div > div > div.card-container__cards",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.carousel-card-container.v1 > div > div > div.carousel-card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/ria-and-wealth-manager/integrations.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.carousel-card-container.v1 > div > div > div.carousel-card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/ria-and-wealth-manager/making-it-easier.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.carousel-card-container.v1 > div > div > div.carousel-card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/why-jackson/customer-care.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2) > div > div > div.card-container__cards",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.carousel-card-container.v1 > div > div > div.carousel-card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/why-jackson/wholesaler-support.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(2) > div > div > div.card-container__cards"
          ],
          "https://www.jackson.com/financial-professional/wirehouse.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(6) > div > div > div.card-container__cards"
          ]
        }
      },
      {
        "name": "tabs-section",
        "instances": [
          "div.tab-container.v1"
        ],
        "pageInstances": {
          "https://www.jackson.com/financial-professional/annuity-products/client-needs/tax-deferral.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.tab-container.v1"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/fixed-annuities.html": [
            "#expVar-468268836 > div.xf-content-height"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/registered-index-linked-annuities.html": [
            "#expVar-1656512025 > div.xf-content-height"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/variable-annuities.html": [
            "#expVar-815326180 > div.xf-content-height"
          ],
          "https://www.jackson.com/financial-professional/resources/client-resources.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.tab-container.v1"
          ],
          "https://www.jackson.com/financial-professional/resources/retirement-research.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.tab-container.v1"
          ]
        }
      },
      {
        "name": "contact-form",
        "instances": [
          "div.contact-us__two-column"
        ],
        "pageInstances": {
          "https://www.jackson.com/financial-professional/annuity-products/fee-based-annuities.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.experiencefragment"
          ],
          "https://www.jackson.com/financial-professional/contact-us.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.contact-us.v1 > div > div.contact-us__two-column"
          ],
          "https://www.jackson.com/financial-professional/ria-and-wealth-manager.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.experiencefragment"
          ],
          "https://www.jackson.com/financial-professional/ria-and-wealth-manager/integrations.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.experiencefragment"
          ],
          "https://www.jackson.com/financial-professional/ria-and-wealth-manager/making-it-easier.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(3)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div:nth-child(4)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.experiencefragment"
          ],
          "https://www.jackson.com/financial-professional/ria-and-wealth-manager/ria-academy.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.experiencefragment"
          ],
          "https://www.jackson.com/financial-professional/why-jackson/value-added-services.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.flexible-width-container.v1"
          ]
        }
      },
      {
        "name": "columns-benefits",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/financial-professional/annuity-products/fixed-index-annuities.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.feature-50-50.v1"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/registered-index-linked-annuities.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.feature-50-50.v1"
          ],
          "https://www.jackson.com/financial-professional/annuity-products/variable-annuities.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.feature-50-50.v1"
          ]
        }
      },
      {
        "name": "hero-banner",
        "instances": [
          "div.full-width-image-buffer.v1"
        ],
        "pageInstances": {
          "https://www.jackson.com/financial-professional/annuity-products/fixed-index-annuities.html": [
            "#expVar-1708939007 > div.xf-content-height > div > div:nth-child(1)",
            "#expVar-1708939007 > div.xf-content-height > div > div:nth-child(3)",
            "#expVar-1708939007 > div.xf-content-height > div > div:nth-child(5)",
            "#expVar-1708939007 > div.xf-content-height > div > div:nth-child(7)"
          ],
          "https://www.jackson.com/financial-professional/bank.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.full-width-image-buffer.v1"
          ],
          "https://www.jackson.com/financial-professional/credit-union.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.full-width-image-buffer.v1"
          ],
          "https://www.jackson.com/financial-professional/independent.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.full-width-image-buffer.v1"
          ],
          "https://www.jackson.com/financial-professional/insurance-professional.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.full-width-image-buffer.v1"
          ],
          "https://www.jackson.com/financial-professional/regional.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.full-width-image-buffer.v1"
          ],
          "https://www.jackson.com/financial-professional/ria-and-wealth-manager.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.full-width-image-buffer.v1"
          ],
          "https://www.jackson.com/financial-professional/why-jackson/value-added-services.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.full-width-image-buffer.v1"
          ],
          "https://www.jackson.com/financial-professional/wirehouse.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.full-width-image-buffer.v1"
          ]
        }
      },
      {
        "name": "app-form",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/financial-professional/contact-us.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.contact-us.v1 > div > div.contact-reason > div:nth-child(1)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.contact-us.v1 > div > div.contact-reason > div:nth-child(2)"
          ],
          "https://www.jackson.com/financial-professional/find-your-wholesaler.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.wholesaler-search.base-version > div > form"
          ]
        }
      },
      {
        "name": "address-card",
        "instances": [
          "div.contact-locations__state"
        ],
        "pageInstances": {
          "https://www.jackson.com/financial-professional/contact-us.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.contact-us.v1 > div > div.contact-locations > div > div > div.contact-locations__state.contact-locations__state--michigan",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.contact-us.v1 > div > div.contact-locations > div > div > div.contact-locations__state.contact-locations__state--illinois"
          ]
        }
      },
      {
        "name": "accordion-manager",
        "instances": [
          "div.article-gallery__header"
        ],
        "pageInstances": {
          "https://www.jackson.com/financial-professional/resources/retirement-articles.html": [
            "#articleList1404948799 > div > div.article-gallery__header"
          ]
        }
      },
      {
        "name": "cards-article",
        "instances": [
          "div.article-gallery__cards"
        ],
        "pageInstances": {
          "https://www.jackson.com/financial-professional/resources/retirement-articles.html": [
            "#articleList1404948799 > div > div.article-gallery__cards"
          ]
        }
      },
      {
        "name": "pagination",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/financial-professional/resources/retirement-articles.html": [
            "#articleList1404948799 > div > div.article-gallery__footer > div > nav"
          ]
        }
      },
      {
        "name": "list-filter",
        "instances": [
          "div.integrations-filter-container"
        ],
        "pageInstances": {
          "https://www.jackson.com/financial-professional/ria-and-wealth-manager/integrations.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.resource-filter-listing.base-version > div > div > fieldset > div.integrations-filter-container"
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
          "https://www.jackson.com/financial-professional/ria-and-wealth-manager/integrations.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.resource-filter-listing.base-version > div > div > div.resource-filter-listing__main-container > div.resource-filter-listing__block-wrapper",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.resource-filter-listing.base-version > div > div > div.resource-filter-listing__main-container > div.resource-filter-listing__additional-options-block-wrapper"
          ]
        }
      },
      {
        "name": "cards-event",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/financial-professional/ria-and-wealth-manager/ria-academy.html": [
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.event-listing.v1 > div > div.event-listing__table-content > div.event-listing__table-header",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.event-listing.v1 > div > div.event-listing__table-content > div.event-listing__events > div:nth-child(1)",
            "body > div.responsive > div > div > div.content-wrapper.v1.aem-GridColumn.aem-GridColumn--default--12 > section > div > div.event-listing.v1 > div > div.event-listing__table-content > div.event-listing__events > div:nth-child(2)"
          ]
        }
      }
    ],
    "sections": [
      {
        "id": "main-content",
        "name": "main-content",
        "selector": [
          "div.aem-Grid > div.content-wrapper"
        ],
        "style": null,
        "blocks": [
          "columns-feature",
          "embed-video",
          "cards-feature",
          "cards-product",
          "tabs-section",
          "contact-form",
          "columns-benefits",
          "hero-banner",
          "app-form",
          "address-card",
          "accordion-manager",
          "cards-article",
          "pagination",
          "list-filter",
          "cards-tool",
          "cards-event"
        ],
        "defaultContent": [
          "section div.no-image-hero",
          "section div.text-block",
          "section div.card-container__content",
          "section div.carousel-card-container__content",
          "section div.flexible-width-container__content",
          "section div.contact-locations__title",
          "section div.contact-locations__description",
          "section h2",
          "section h3",
          "section h4",
          "section p",
          "section ul"
        ]
      }
    ],
    "pageCleanup": {
      "https://www.jackson.com/financial-professional/annuity-products/client-needs.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/financial-professional/annuity-products/client-needs/growth-potential.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/financial-professional/annuity-products/client-needs/legacy-planning.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/financial-professional/annuity-products/client-needs/lifetime-income.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/financial-professional/annuity-products/client-needs/protection-options.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/annuity-products/client-needs/tax-deferral.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "#obbba-resources-tab > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/financial-professional/annuity-products/fee-based-annuities.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(28)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/financial-professional/annuity-products/fixed-annuities.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/financial-professional/annuity-products/fixed-index-annuities.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/financial-professional/annuity-products/registered-index-linked-annuities.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/financial-professional/annuity-products/variable-annuities.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/financial-professional/bank.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/bank/referral.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/contact-us.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(20)",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/credit-union.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/credit-union/referral.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/find-your-wholesaler.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/independent.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/insurance-professional.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/regional.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/resources/advisor-experience-updates.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.content-wrapper.v1 > section:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)",
        "div.content-wrapper.v1 > section:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)",
        "div.content-wrapper.v1 > section:nth-child(1) > div:nth-child(1) > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)",
        "div.content-wrapper.v1 > section:nth-child(1) > div:nth-child(1) > div:nth-child(6) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/financial-professional/resources/annuity-calculator-and-tools.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/resources/client-resources.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/financial-professional/resources/retirement-articles.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/resources/retirement-research.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/ria-and-wealth-manager.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(28)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/ria-and-wealth-manager/integrations.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(28)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/ria-and-wealth-manager/making-it-easier.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(28)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.content-wrapper.v1 > section:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)",
        "div.cookie-consent__placeholder.hidden"
      ],
      "https://www.jackson.com/financial-professional/ria-and-wealth-manager/ria-academy.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(28)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/sitemap.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/why-jackson/customer-care.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/why-jackson/financial-strength.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/why-jackson/value-added-services.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(28)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/why-jackson/wholesaler-support.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ],
      "https://www.jackson.com/financial-professional/wirehouse.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ]
    },
    "fragmentInstances": {
      "columns-feature": [
        "div.feature-50-50"
      ],
      "cards-product": [
        "div.card-container__cards"
      ],
      "contact-form": [
        "div.flexible-width-container"
      ]
    }
  };
  var parsers = {
    "columns-feature": parse,
    "embed-video": parse2,
    "cards-feature": parse3,
    "cards-product": parse4,
    "tabs-section": parse5,
    "contact-form": parse6,
    "columns-benefits": parse7,
    "hero-banner": parse8,
    "app-form": parse9,
    "address-card": parse10,
    "accordion-manager": parse11,
    "cards-article": parse12,
    "pagination": parse13,
    "list-filter": parse14,
    "cards-tool": parse15,
    "cards-event": parse16
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
  var import_advisor_content_page_default = {
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
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.x?html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }, ...params.fragments];
    }
  };
  return __toCommonJS(import_advisor_content_page_exports);
})();
