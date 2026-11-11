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

  // tools/importer/import-calculator-tool.js
  var import_calculator_tool_exports = {};
  __export(import_calculator_tool_exports, {
    default: () => import_calculator_tool_default
  });

  // tools/importer/parsers/hero-page.js
  function parse(element, { document, params }) {
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

  // tools/importer/parsers/retirement-calculator.js
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
    let text = "";
    const id = ctrl.getAttribute("id");
    if (id) {
      const label = [...form.querySelectorAll("label")].find((l) => l.getAttribute("for") === id);
      if (label) {
        const clone = label.cloneNode(true);
        clone.querySelectorAll(".mktoAsterix").forEach((a) => a.remove());
        text = clone.textContent.replace(/\s+/g, " ").trim();
      }
    }
    if (!text && ctrl.closest("label")) text = ctrl.closest("label").textContent.replace(/\s+/g, " ").trim();
    if (!text) text = (ctrl.getAttribute("placeholder") || "").trim();
    if (!text && ctrl.tagName.toLowerCase() === "button") text = ctrl.textContent.trim();
    if (!text) text = (ctrl.getAttribute("value") || ctrl.getAttribute("name") || "").trim();
    return text;
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
      if (n.matches && n.matches(".cta-list__links, .small-links")) {
        const links = [...n.querySelectorAll("a")].filter((a) => !NBSP_ONLY.test(a.textContent));
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
  function parse2(element, { document, params }) {
    if (element.matches(".journey-controls")) {
      element.remove();
      return;
    }
    let items;
    if (element.matches(".journey-nav")) {
      const ol = document.createElement("ol");
      element.querySelectorAll(".journey-step").forEach((step) => {
        const label = step.querySelector(".full-label") || step.querySelector(".label") || step;
        const text = label.textContent.replace(/\s+/g, " ").trim();
        if (!text) return;
        const li = document.createElement("li");
        li.textContent = text;
        ol.append(li);
      });
      items = ol.children.length ? [ol] : [];
    } else {
      [...element.querySelectorAll(".tooltip")].forEach((tip) => {
        const trigger = tip.parentElement && tip.parentElement.closest("button");
        if (trigger && element.contains(trigger)) trigger.after(tip);
      });
      items = collect(element, document, []);
    }
    const cells = [];
    items.forEach((item) => {
      if (item && item.form) {
        formRows(item.form, document).forEach((row) => cells.push(row));
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
  function parse3(element, { document, params }) {
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
      const text = v1Text(
        document,
        feature,
        ".feature-50-50__title",
        ".feature-50-50__description",
        ".feature-50-50__links a, .feature-50-50__link a, .feature-50-50__cta a"
      );
      const imageRight = feature.matches(".image-right");
      const row = imageRight ? [text, media] : [media, text];
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
  function parse4(element, { document, params }) {
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
  function parse5(element, { document, params }) {
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
  function parse6(element, { document, params }) {
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

  // tools/importer/import-calculator-tool.js
  var PAGE_TEMPLATE = {
    "name": "calculator-tool",
    "urls": [
      "https://www.jackson.com/dash/tools/retirement-expense-calculator.html",
      "https://www.jackson.com/financial-professionals/get-appointed.html"
    ],
    "description": "Interactive tool page with hero, step navigation, tool form area, promo cards and disclosures",
    "blocks": [
      {
        "name": "hero-page",
        "instances": [
          "body > section.hero.v2"
        ],
        "pageInstances": {
          "https://www.jackson.com/dash/tools/retirement-expense-calculator.html": [
            "body > section"
          ]
        }
      },
      {
        "name": "retirement-calculator",
        "instances": [
          "div.rec-container > div.journey-nav",
          "div.rec-container > div.tool-header",
          "div.rec-container > div.journey-content-container",
          "div.rec-container > div.journey-controls"
        ],
        "pageInstances": {
          "https://www.jackson.com/dash/tools/retirement-expense-calculator.html": [
            "body > div.one-column.rec-main-container.main-content-container > div.rec-container.v4 > div.journey-nav",
            "body > div.one-column.rec-main-container.main-content-container > div.rec-container.v4 > div.tool-header",
            "body > div.one-column.rec-main-container.main-content-container > div.rec-container.v4 > div.journey-content-container",
            "body > div.one-column.rec-main-container.main-content-container > div.rec-container.v4 > div.journey-controls"
          ]
        }
      },
      {
        "name": "cards-product",
        "instances": [
          "div.rec-main-container > div.promo-card-container"
        ],
        "pageInstances": {
          "https://www.jackson.com/dash/tools/retirement-expense-calculator.html": [
            "body > div.one-column.rec-main-container.main-content-container > div.promo-card-container.v1"
          ]
        }
      },
      {
        "name": "columns-feature",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/financial-professionals/get-appointed.html": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div.background-container.base-version"
          ]
        }
      },
      {
        "name": "cards-feature",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/financial-professionals/get-appointed.html": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div.comparison-highlight-layout",
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(3) > div > div"
          ]
        }
      },
      {
        "name": "cards-tool",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/financial-professionals/get-appointed.html": [
            "body > div.responsive.brandEvolution > div > div > div:nth-child(4) > section > div > div:nth-child(4)"
          ]
        }
      }
    ],
    "sections": [
      {
        "id": "tool-hero",
        "name": "tool-hero",
        "selector": [
          "body > section.hero"
        ],
        "style": null,
        "blocks": [
          "hero-page"
        ],
        "defaultContent": []
      },
      {
        "id": "tool-main",
        "name": "tool-main",
        "selector": [
          "body > div.rec-main-container"
        ],
        "style": null,
        "blocks": [
          "retirement-calculator",
          "cards-product"
        ],
        "defaultContent": [
          "div.rec-main-container > div.disclosure"
        ]
      },
      {
        "id": "main-content",
        "name": "main-content",
        "selector": [
          "div.aem-Grid > div.full-width-container",
          "div.aem-Grid > div.body-content"
        ],
        "style": null,
        "blocks": [
          "columns-feature",
          "cards-feature",
          "cards-tool"
        ],
        "defaultContent": [
          "div.full-width-container section h3",
          "div.full-width-container section p",
          "div.full-width-container section div.disclosure",
          "div.full-width-container section div.header"
        ]
      }
    ],
    "pageCleanup": {
      "https://www.jackson.com/dash/tools/retirement-expense-calculator.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "div.ui-dialog.calculation-explanation-container",
        "div.ui-dialog.solution-explanation-container",
        "div.ui-dialog.load-dialog"
      ],
      "https://www.jackson.com/financial-professionals/get-appointed.html": [
        "#onetrust-banner-sdk",
        "html > body:nth-child(2) > div:nth-child(25)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk"
      ]
    }
  };
  var parsers = {
    "hero-page": parse,
    "retirement-calculator": parse2,
    "cards-product": parse3,
    "columns-feature": parse4,
    "cards-feature": parse5,
    "cards-tool": parse6
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
  var import_calculator_tool_default = {
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
  return __toCommonJS(import_calculator_tool_exports);
})();
