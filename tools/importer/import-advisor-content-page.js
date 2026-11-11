/* eslint-disable */
/* global WebImporter */

import columnsFeatureParser from './parsers/columns-feature.js';
import embedVideoParser from './parsers/embed-video.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import cardsProductParser from './parsers/cards-product.js';
import tabsSectionParser from './parsers/tabs-section.js';
import contactFormParser from './parsers/contact-form.js';
import columnsBenefitsParser from './parsers/columns-benefits.js';
import heroBannerParser from './parsers/hero-banner.js';
import appFormParser from './parsers/app-form.js';
import addressCardParser from './parsers/address-card.js';
import accordionManagerParser from './parsers/accordion-manager.js';
import cardsArticleParser from './parsers/cards-article.js';
import paginationParser from './parsers/pagination.js';
import listFilterParser from './parsers/list-filter.js';
import cardsToolParser from './parsers/cards-tool.js';
import cardsEventParser from './parsers/cards-event.js';
import jacksonCleanupTransformer from './transformers/jackson-cleanup.js';
import jacksonSectionsTransformer from './transformers/jackson-sections.js';

const PAGE_TEMPLATE = {
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

const parsers = {
  'columns-feature': columnsFeatureParser,
  'embed-video': embedVideoParser,
  'cards-feature': cardsFeatureParser,
  'cards-product': cardsProductParser,
  'tabs-section': tabsSectionParser,
  'contact-form': contactFormParser,
  'columns-benefits': columnsBenefitsParser,
  'hero-banner': heroBannerParser,
  'app-form': appFormParser,
  'address-card': addressCardParser,
  'accordion-manager': accordionManagerParser,
  'cards-article': cardsArticleParser,
  'pagination': paginationParser,
  'list-filter': listFilterParser,
  'cards-tool': cardsToolParser,
  'cards-event': cardsEventParser,
};
// Late transformers change the DOM (section <hr> markers, shared fragments), so their beforeTransform
// runs after block discovery.
const sectionTransformers = [jacksonSectionsTransformer];
const fragmentTransformers = [];
const lateTransformers = [...sectionTransformers, ...fragmentTransformers];
const transformers = [jacksonCleanupTransformer, ...lateTransformers];
const earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
// Catalog selectors (pageInstances, pageCleanup) count the <script> and <hr> elements the importer
// removes before transform, so a catalog template finds its targets in preprocess.
const CATALOG = Boolean(PAGE_TEMPLATE.pageCleanup || PAGE_TEMPLATE.blocks.some((b) => b.pageInstances));

function executeTransformers(hookName, element, payload, list = transformers) {
  const enhancedPayload = { ...payload, template: payload.params?.targets?.template || PAGE_TEMPLATE };
  list.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); } catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template, url) {
  const pageBlocks = [];
  const pageKey = (u) => {
    try { const { origin, pathname } = new URL(u); return `${origin}${pathname.replace(/\/$/, '')}`; } catch { return u; }
  };
  const key = pageKey(url);
  const claim = (blockDef, selector) => {
    let matches = [];
    try { matches = document.querySelectorAll(selector); } catch { return; }
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

// Runs the early transformers, then marks each block and section target with an attribute: the
// importer re-creates the body before transform, so only attributes survive, not element references.
function markPageTargets(payload) {
  const { document, params } = payload;
  executeTransformers('beforeTransform', document.body, payload, earlyTransformers);
  const blocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
    element.setAttribute('data-excat-block', String(i));
    return { name, selector };
  });
  const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
    const target = (section.selector || []).map((s) => { try { return document.querySelector(s); } catch { return null; } }).find(Boolean);
    if (!target) return section;
    target.setAttribute('data-excat-section', String(i));
    return { ...section, selector: [`[data-excat-section="${i}"]`] };
  });
  params.targets = { blocks, template: { ...PAGE_TEMPLATE, sections } };
}

export default {
  preprocess: (payload) => {
    if (CATALOG) markPageTargets(payload);
  },
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    params.fragments = [];

    if (!params.targets) markPageTargets(payload);
    const pageBlocks = params.targets.blocks
      .map((block, i) => ({ ...block, element: document.querySelector(`[data-excat-block="${i}"]`) }))
      .filter((block) => block.element);
    executeTransformers('beforeTransform', main, { ...payload, pageBlocks }, lateTransformers);

    pageBlocks.forEach((block) => {
      if (!main.contains(block.element)) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); } catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    // Blocks inside fragments (e.g. tab panels) left `main` with their fragment, so page-level
    // discovery never sees them: parse them with the template's optional fragmentInstances.
    const fragmentInstances = PAGE_TEMPLATE.fragmentInstances || {};
    if (Object.keys(fragmentInstances).length) {
      params.fragments.slice().forEach(({ element: frag }) => {
        const found = [];
        Object.entries(fragmentInstances).forEach(([name, selectors]) => selectors.forEach((sel) => {
          let matches = [];
          try { matches = frag.querySelectorAll(sel); } catch { return; }
          matches.forEach((el) => {
            if (found.some((f) => f.el === el || f.el.contains(el) || el.contains(f.el))) return;
            found.push({ name, el });
          });
        }));
        // eslint-disable-next-line no-bitwise
        found.sort((a, b) => ((a.el.compareDocumentPosition(b.el) & 4) ? -1 : 1));
        found.forEach(({ name, el }) => {
          if (!frag.contains(el) || !parsers[name]) return;
          try { parsers[name](el, { document, url, params }); } catch (e) { console.error(`Failed to parse fragment ${name}:`, e); }
        });
      });
    }

    executeTransformers('afterTransform', main, payload);

    // A fragment's nodes left `main` before afterTransform: finalize it the same way, without the
    // page-only section breaks and metadata. This runs BEFORE the page metadata is created: the
    // cleanup's afterTransform also prunes document-level chrome (everything outside the page
    // wrapper), which would otherwise delete the page's metadata block and final section break.
    params.fragments.forEach(({ element }) => {
      executeTransformers('afterTransform', element, payload, earlyTransformers);
      WebImporter.rules.transformBackgroundImages(element, document);
      WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
    });

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    // Page theme: the financial-professional site and the app screens use their own styles
    // (styles.css body.advisor / body.app), selected through the Theme metadata.
    const themePath = new URL(params.originalURL).pathname;
    const APP_TEMPLATES = ['app-search-form', 'account-recovery-form', 'sign-in'];
    let theme = null;
    if (APP_TEMPLATES.includes(PAGE_TEMPLATE.name)) theme = 'app';
    else if (/^\/financial-professional(\/|\.html$)/.test(themePath)) theme = 'advisor';
    if (theme) {
      const meta = [...main.querySelectorAll('table')]
        .find((t) => /^metadata$/i.test((t.querySelector('tr')?.textContent || '').trim()));
      if (meta) {
        const tr = document.createElement('tr');
        const k = document.createElement('td');
        const v = document.createElement('td');
        k.textContent = 'Theme';
        v.textContent = theme;
        tr.append(k, v);
        (meta.querySelector('tbody') || meta).append(tr);
      } else {
        main.append(WebImporter.Blocks.createBlock(document, { name: 'Metadata', cells: { Theme: theme } }));
      }
    }
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.x?html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }, ...params.fragments];
  },
};
