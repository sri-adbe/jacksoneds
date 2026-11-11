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

  // tools/importer/import-app-search-form.js
  var import_app_search_form_exports = {};
  __export(import_app_search_form_exports, {
    default: () => import_app_search_form_default
  });

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
  function parse(element, { document, params }) {
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

  // tools/importer/parsers/forms-finder.js
  var MARK = "data-excat-forms-finder";
  function text(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function fieldRow(label, type, options) {
    return [label, type, options || ""];
  }
  function keywordRows(el) {
    const rows = [];
    const input = el.querySelector('input[type="text"], input:not([type]), input[type="search"]');
    if (input) {
      const label = el.querySelector("label");
      rows.push(fieldRow(text(label) || "Search", "search"));
    }
    [...el.querySelectorAll('button, input[type="submit"], input[type="reset"]')].forEach((b) => {
      const label = text(b) || b.getAttribute("value") || "";
      if (!label) return;
      rows.push(fieldRow(label, /clear|reset/i.test(label) ? "reset" : "submit"));
    });
    return rows;
  }
  function filterRows(el) {
    const rows = [];
    const items = el.matches("li") ? [el] : [...el.querySelectorAll("li")].filter((li) => li.querySelector("label"));
    items.forEach((li) => {
      const label = text(li.querySelector("label"));
      if (!label) return;
      const select = li.querySelector("select");
      let opts = select ? [...select.querySelectorAll("option")].map(text) : [];
      if (!opts.length) {
        opts = [...li.querySelectorAll(".ui-selectonemenu-item, [data-label]")].map((o) => o.getAttribute("data-label") || text(o));
      }
      opts = [...new Set(opts.filter(Boolean))];
      rows.push(fieldRow(label, "select", opts.join(", ")));
    });
    return rows;
  }
  function libraryLink(document, params) {
    const p = document.createElement("p");
    const a = document.createElement("a");
    a.href = params && params.originalURL || "https://www.jackson.com/forms/forms.xhtml";
    const count = text(document.querySelector(".ui-paginator-current")).match(/of\s+(\d+)/i);
    a.textContent = count ? `Browse all ${count[1]} forms in the forms library` : "Browse the forms library";
    p.append(a);
    return [p];
  }
  function appendRows(document, table, rows) {
    const body = table.querySelector("tbody") || table;
    rows.forEach((row) => {
      const tr = document.createElement("tr");
      row.forEach((cell) => {
        const td = document.createElement("td");
        if (Array.isArray(cell)) cell.forEach((n) => td.append(n));
        else if (cell) td.textContent = cell;
        tr.append(td);
      });
      body.append(tr);
    });
  }
  function parse2(element, { document, params }) {
    const isPaginator = element.matches(".ui-paginator") || !!element.closest(".ui-paginator");
    let rows = [];
    if (!isPaginator) {
      const isFilterList = element.matches("ul, li") || !!element.querySelector(":scope > li");
      rows = isFilterList ? filterRows(element) : keywordRows(element);
    }
    const existing = document.querySelector(`table[${MARK}]`);
    if (existing) {
      const linkRow = existing.querySelector("tr[data-excat-library]");
      appendRows(document, existing, rows);
      if (linkRow) linkRow.parentElement.append(linkRow);
      element.remove();
      return;
    }
    const library = libraryLink(document, params);
    const scope = element.closest("form") || document;
    scope.querySelectorAll(".ui-datatable").forEach((t) => t.remove());
    const cells = [...rows, [library]];
    const block = WebImporter.Blocks.createBlock(document, { name: "forms-finder", cells });
    block.setAttribute(MARK, "true");
    const trs = [...block.querySelectorAll("tr")];
    if (trs.length) trs[trs.length - 1].setAttribute("data-excat-library", "true");
    element.replaceWith(block);
  }

  // tools/importer/parsers/table-product.js
  var NBSP_ONLY = /^[\s ]*$/;
  function cellContent(td, document) {
    const clone = td.cloneNode(true);
    [clone, ...clone.querySelectorAll("*")].forEach((n) => {
      n.removeAttribute("style");
      n.removeAttribute("class");
      n.removeAttribute("id");
    });
    clone.querySelectorAll("p").forEach((p) => {
      if (NBSP_ONLY.test(p.textContent) && !p.querySelector("img")) p.remove();
    });
    clone.querySelectorAll("i, em, span").forEach((n) => {
      if (!n.textContent && !n.children.length) n.remove();
    });
    if (NBSP_ONLY.test(clone.textContent) && !clone.querySelector("img")) return "";
    while (clone.firstChild && (clone.firstChild.nodeType === 3 && NBSP_ONLY.test(clone.firstChild.textContent) || clone.firstChild.nodeType === 1 && clone.firstChild.tagName === "BR")) {
      clone.firstChild.remove();
    }
    const frag = document.createElement("div");
    frag.append(...clone.childNodes);
    return [...frag.childNodes];
  }
  function parse3(element, { document, params }) {
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

  // tools/importer/parsers/app-form.js
  var INPUT_TYPES = ["text", "email", "tel", "number", "password", "date", "search", "url", "checkbox", "radio"];
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
    let text2 = "";
    const id = ctrl.getAttribute("id");
    if (id) {
      const label = [...form.querySelectorAll("label")].find((l) => l.getAttribute("for") === id);
      if (label) text2 = label.textContent.replace(/\s+/g, " ").trim();
    }
    if (!text2 && ctrl.closest("label")) text2 = ctrl.closest("label").textContent.replace(/\s+/g, " ").trim();
    if (!text2 && ctrl.getAttribute("aria-describedby")) {
      const ref = ctrl.getAttribute("aria-describedby").split(/\s+/)[0];
      const el = [...form.querySelectorAll("[id]")].find((n) => n.getAttribute("id") === ref);
      if (el) text2 = el.textContent.replace(/\s+/g, " ").trim();
    }
    if (!text2) text2 = (ctrl.getAttribute("placeholder") || ctrl.getAttribute("aria-label") || "").trim();
    if (!text2 && ctrl.tagName.toLowerCase() === "button") text2 = ctrl.textContent.replace(/\s+/g, " ").trim();
    if (!text2) text2 = (ctrl.getAttribute("value") || ctrl.getAttribute("name") || "").trim();
    return text2;
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
  function formRows(form, document) {
    const rows = [];
    const seenGroups = /* @__PURE__ */ new Set();
    form.querySelectorAll("input, select, textarea, button").forEach((ctrl) => {
      var _a;
      if (ctrl.closest(".g-recaptcha, .grecaptcha-badge") || /recaptcha/i.test(ctrl.getAttribute("name") || ctrl.getAttribute("id") || "")) return;
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
          const legend = (_a = ctrl.closest("fieldset")) == null ? void 0 : _a.querySelector("legend");
          rows.push([legend ? legend.textContent.trim() : name, type === "radio" ? "radio" : "checkboxes", ul]);
          return;
        }
      }
      let label = controlLabel(ctrl, form);
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
        const type = controlType(el);
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
              li.textContent = controlLabel(g, form);
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
            label2 = label2.replace(/:\s*$/, "").trim() || controlLabel(group[0], form);
            rows.push([label2, type === "radio" ? "radio" : "checkboxes", ul]);
            return;
          }
        }
        let label = controlLabel(el, form);
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
  function parse4(element, { document, params }) {
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
    const rows = formRows(form, document);
    if (!rows.length) {
      element.remove();
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "app-form", cells: rows });
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

  // tools/importer/import-app-search-form.js
  var PAGE_TEMPLATE = {
    "name": "app-search-form",
    "urls": [
      "https://www.jackson.com/forms/forms.xhtml",
      "https://www.jackson.com/login/register.xhtml"
    ],
    "description": "Application page with upload or search form, data table with paginator and page disclosures",
    "blocks": [
      {
        "name": "cards-product",
        "instances": [
          "div.pageWrapper div.formUploadBoxes"
        ],
        "pageInstances": {
          "https://www.jackson.com/forms/forms.xhtml": [
            "#page > div > div > div.formUploadBoxes"
          ]
        }
      },
      {
        "name": "forms-finder",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/forms/forms.xhtml": [
            "#formsForm > div.formsControls > div > div:nth-child(1)",
            "#formsForm > div.formsControls > ul:nth-child(3)",
            "#formsForm > div.formsControls > ul:nth-child(4)",
            "#formsForm\\:formsTable_paginator_bottom"
          ]
        }
      },
      {
        "name": "table-product",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/forms/forms.xhtml": [
            "#formsForm\\:formsTable > div.ui-datatable-tablewrapper"
          ]
        }
      },
      {
        "name": "app-form",
        "instances": [
          "div.pageWrapper div.mainContent"
        ],
        "pageInstances": {
          "https://www.jackson.com/login/register.xhtml": [
            "#page > div > div.mainContent"
          ]
        }
      }
    ],
    "sections": [
      {
        "id": "main-content",
        "name": "main-content",
        "selector": [
          "div.root.responsiveGrid > div.pageWrapper",
          "div.root.responsiveGrid > div.pageDisclosures"
        ],
        "style": null,
        "blocks": [
          "cards-product",
          "forms-finder",
          "table-product",
          "app-form"
        ],
        "defaultContent": [
          "div#page > h1",
          "div#page div.content > p",
          "div#page div.content > h2",
          "div.pageDisclosures p"
        ]
      }
    ],
    "pageCleanup": {
      "https://www.jackson.com/forms/forms.xhtml": [
        "#onetrust-banner-sdk",
        "body.responsive > div:nth-child(33)",
        "#QSIFeedbackButton-target-container",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "#formsForm\\:formsTable\\:1\\:j_idt291",
        "#formsForm\\:formsTable\\:2\\:j_idt291",
        "#formsForm\\:formsTable\\:3\\:j_idt291",
        "#formsForm\\:formsTable\\:4\\:j_idt291",
        "#formsForm\\:formsTable\\:6\\:j_idt291",
        "#formsForm\\:formsTable\\:7\\:j_idt291",
        "#formsForm\\:formsTable\\:8\\:j_idt291",
        "#formsForm\\:productTypeFilter_panel",
        "#formsForm\\:productNameFilter_panel",
        "#formsForm\\:transactionTypeFilter_panel",
        "#formsForm\\:stateFilter_panel",
        "#formsForm\\:formsTable\\:j_idt298_panel",
        "#j_idt49\\:sessionManagerForm\\:sessionExpireDialog",
        "#emailDialogForm\\:j_idt304",
        "#protectedForm\\:j_idt309"
      ],
      "https://www.jackson.com/login/register.xhtml": [
        "#onetrust-banner-sdk",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "#registerForm\\:j_idt154",
        "#registerForm\\:j_idt171",
        "#registerForm\\:j_idt179",
        "#j_idt49\\:sessionManagerForm\\:sessionExpireDialog",
        "#registerForm\\:j_idt264"
      ]
    }
  };
  var parsers = {
    "cards-product": parse,
    "forms-finder": parse2,
    "table-product": parse3,
    "app-form": parse4
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
  var import_app_search_form_default = {
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
  return __toCommonJS(import_app_search_form_exports);
})();
