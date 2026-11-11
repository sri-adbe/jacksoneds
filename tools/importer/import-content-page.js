/* eslint-disable */
/* global WebImporter */

import columnsSidebarParser from './parsers/columns-sidebar.js';
import cardsProductParser from './parsers/cards-product.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import heroPageParser from './parsers/hero-page.js';
import contactFormParser from './parsers/contact-form.js';
import embedVideoParser from './parsers/embed-video.js';
import heroBannerParser from './parsers/hero-banner.js';
import cardsToolParser from './parsers/cards-tool.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import cardsVideoParser from './parsers/cards-video.js';
import tabsSectionParser from './parsers/tabs-section.js';
import accordionManagerParser from './parsers/accordion-manager.js';
import columnsBenefitsParser from './parsers/columns-benefits.js';
import disclaimerGateParser from './parsers/disclaimer-gate.js';
import cardsArticleParser from './parsers/cards-article.js';
import tableProductParser from './parsers/table-product.js';
import listFilterParser from './parsers/list-filter.js';
import cardsEventParser from './parsers/cards-event.js';
import locationTilesParser from './parsers/location-tiles.js';
import columnsScheduleParser from './parsers/columns-schedule.js';
import cardsTeamParser from './parsers/cards-team.js';
import retirementCalculatorParser from './parsers/retirement-calculator.js';
import jacksonCleanupTransformer from './transformers/jackson-cleanup.js';
import jacksonSectionsTransformer from './transformers/jackson-sections.js';

const PAGE_TEMPLATE = {
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

const parsers = {
  'columns-sidebar': columnsSidebarParser,
  'cards-product': cardsProductParser,
  'columns-feature': columnsFeatureParser,
  'hero-page': heroPageParser,
  'contact-form': contactFormParser,
  'embed-video': embedVideoParser,
  'hero-banner': heroBannerParser,
  'cards-tool': cardsToolParser,
  'cards-feature': cardsFeatureParser,
  'cards-video': cardsVideoParser,
  'tabs-section': tabsSectionParser,
  'accordion-manager': accordionManagerParser,
  'columns-benefits': columnsBenefitsParser,
  'disclaimer-gate': disclaimerGateParser,
  'cards-article': cardsArticleParser,
  'table-product': tableProductParser,
  'list-filter': listFilterParser,
  'cards-event': cardsEventParser,
  'location-tiles': locationTilesParser,
  'columns-schedule': columnsScheduleParser,
  'cards-team': cardsTeamParser,
  'retirement-calculator': retirementCalculatorParser,
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
