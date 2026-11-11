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

  // tools/importer/import-sign-in.js
  var import_sign_in_exports = {};
  __export(import_sign_in_exports, {
    default: () => import_sign_in_default
  });

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
    let text = "";
    const id = ctrl.getAttribute("id");
    if (id) {
      const label = [...form.querySelectorAll("label")].find((l) => l.getAttribute("for") === id);
      if (label) text = label.textContent.replace(/\s+/g, " ").trim();
    }
    if (!text && ctrl.closest("label")) text = ctrl.closest("label").textContent.replace(/\s+/g, " ").trim();
    if (!text && ctrl.getAttribute("aria-describedby")) {
      const ref = ctrl.getAttribute("aria-describedby").split(/\s+/)[0];
      const el = [...form.querySelectorAll("[id]")].find((n) => n.getAttribute("id") === ref);
      if (el) text = el.textContent.replace(/\s+/g, " ").trim();
    }
    if (!text) text = (ctrl.getAttribute("placeholder") || ctrl.getAttribute("aria-label") || "").trim();
    if (!text && ctrl.tagName.toLowerCase() === "button") text = ctrl.textContent.replace(/\s+/g, " ").trim();
    if (!text) text = (ctrl.getAttribute("value") || ctrl.getAttribute("name") || "").trim();
    return text;
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
  function parse(element, { document, params }) {
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
  function parse2(element, { document, params }) {
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

  // tools/importer/import-sign-in.js
  var PAGE_TEMPLATE = {
    "name": "sign-in",
    "urls": [
      "https://www.jackson.com/login/login.xhtml"
    ],
    "description": "Application sign-in form with action links, sign-in help links and disclosure boxes",
    "blocks": [
      {
        "name": "app-form",
        "instances": [
          "div.pageWrapper div.mainContent"
        ],
        "pageInstances": {
          "https://www.jackson.com/login/login.xhtml": [
            "#loginForm\\:loginPnl > div > div > ul:nth-child(5)",
            "#loginForm\\:loginPnl > div > div > ul.form.remember"
          ]
        }
      },
      {
        "name": "columns-feature",
        "instances": [],
        "pageInstances": {
          "https://www.jackson.com/login/login.xhtml": [
            "#loginForm\\:loginPnl > div > div > div.signinLinks.alignLeft"
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
          "app-form",
          "columns-feature"
        ],
        "defaultContent": [
          "div#page > h1",
          "div.pageDisclosures p"
        ]
      }
    ],
    "pageCleanup": {
      "https://www.jackson.com/login/login.xhtml": [
        "#onetrust-banner-sdk",
        "#onetrust-style",
        "#onetrust-consent-sdk",
        "#loginForm\\:j_idt130"
      ]
    }
  };
  var parsers = {
    "app-form": parse,
    "columns-feature": parse2
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
  var import_sign_in_default = {
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
  return __toCommonJS(import_sign_in_exports);
})();
