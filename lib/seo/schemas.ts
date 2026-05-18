/**
 * Typed JSON-LD builders for Pannly.
 *
 * Each function returns a plain object. The render helper serialises it for
 * an inline `<script type="application/ld+json">` tag.
 *
 * Why a single file: schemas reference each other by `@id` (Organization is
 * the publisher of every other entity). Centralising the IDs prevents drift
 * between root-layout markup and per-page markup.
 */

import { env } from "@/lib/env";

/** Strip trailing slash so we can concat clean URLs against this base. */
const BASE = env.appBaseUrl.replace(/\/+$/, "");

const ORG_ID = `${BASE}/#organization`;
const SITE_ID = `${BASE}/#website`;
const SOFTWARE_ID = `${BASE}/#software`;

/**
 * External profiles for the Pannly brand entity. Google + AI engines use
 * these to resolve the Organization @id to a real-world entity. Even one
 * verified link materially lifts entity-resolution confidence; an empty
 * array is a wasted signal so the helpers below conditionally drop the
 * `sameAs` property entirely if this array is empty.
 *
 * TODO(rohit): drop in the real handles once the social presence exists.
 * Twitter/X, LinkedIn, Product Hunt are the highest-leverage three.
 */
export const BRAND_SOCIALS: readonly string[] = [
  // "https://twitter.com/pannlyhq",
  // "https://www.linkedin.com/company/pannly",
  // "https://www.producthunt.com/products/pannly",
];

/**
 * Founder external profiles for E-E-A-T person-entity resolution. Same
 * trade-off as BRAND_SOCIALS — empty drops the field cleanly.
 *
 * TODO(rohit): replace with real handles. LinkedIn is the single most
 * trust-weighted signal for AI engines per QRG (Sept 2025).
 */
export const FOUNDER_SAMEAS: readonly string[] = [
  // "https://www.linkedin.com/in/rohit-...",
  // "https://twitter.com/rohit-...",
];

export interface OrganizationGraph {
  "@context": "https://schema.org";
  "@graph": Record<string, unknown>[];
}

/** Site-wide @graph: Organization + WebSite. Renders once in root layout. */
export function buildOrganizationGraph(): OrganizationGraph {
  const orgNode: Record<string, unknown> = {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Pannly",
    url: BASE,
    logo: {
      "@type": "ImageObject",
      // Square asset is required for Knowledge Panel logo eligibility.
      // /icon-512.png is shipped from public/.
      url: `${BASE}/icon-512.png`,
      width: 512,
      height: 512,
    },
    description:
      "Pannly watches Reddit and Hacker News for real founder pain. We score the signals, write the brief, and let you unlock one for $3 — refunded the moment you ship.",
    founder: {
      "@type": "Person",
      name: "Rohit",
      jobTitle: "Founder",
      ...(FOUNDER_SAMEAS.length > 0 ? { sameAs: [...FOUNDER_SAMEAS] } : {}),
    },
  };
  // Conditional sameAs — only emit when we actually have profile URLs to point
  // to. An empty array reads as "we tried" and Google ignores it.
  if (BRAND_SOCIALS.length > 0) {
    orgNode.sameAs = [...BRAND_SOCIALS];
  }
  return {
    "@context": "https://schema.org",
    "@graph": [
      orgNode,
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: BASE,
        name: "Pannly",
        description:
          "A curated archive of high-signal software ideas sourced from real business pain points. Unlock a brief, build the solution, and we return your pledge.",
        inLanguage: "en-US",
        publisher: { "@id": ORG_ID },
        // SearchAction enables the Sitelinks Searchbox. /feed?q=… is a real
        // search surface (the feed bar drives URL state), so this is honest.
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${BASE}/feed?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

// =================================================================== //
//  CreativeWork + Offer for /ideas/[slug]                              //
// =================================================================== //

export interface IdeaSchemaInput {
  slug: string;
  title: string;
  one_line_pain: string | null;
  tags: string[];
  /** ISO date string from `idea.first_published_at`. Null on briefs that
   *  haven't been published yet — we omit `datePublished` in that case. */
  first_published_at: string | null;
  /** ISO date string from `idea.last_refreshed_at`. Optional — when present,
   *  surfaces as `dateModified` so crawlers know the brief was re-scored. */
  last_refreshed_at?: string | null;
  /** Cents — converted to "X.XX" inside. */
  unlock_price_cents: number;
}

export function buildIdeaSchema(idea: IdeaSchemaInput) {
  const url = `${BASE}/ideas/${encodeURIComponent(idea.slug)}`;
  const price = (idea.unlock_price_cents / 100).toFixed(2);
  // Switched from `CreativeWork` to `Product`. Each idea brief is a
  // purchasable digital good with a real Offer at $3 — Product matches the
  // commercial intent and unlocks Google's product rich-result eligibility
  // (price, availability, offer chips). The previous CreativeWork @type was
  // technically valid but left those rich results on the table.
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#brief`,
    name: idea.title,
    description: idea.one_line_pain ?? idea.title,
    url,
    inLanguage: "en-US",
    brand: { "@type": "Brand", name: "Pannly" },
    // Image required for Product rich-result eligibility. We share the
    // default OG asset until per-idea OG images are wired up.
    image: {
      "@type": "ImageObject",
      url: `${BASE}/og-default.png`,
      width: 1200,
      height: 630,
    },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": SITE_ID },
    keywords: idea.tags.join(", "),
    about: idea.tags.map((t) => ({ "@type": "Thing", name: t })),
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url,
      // `seller` ties the Offer back to the Organization so Google can group
      // every Pannly brief under the same merchant entity.
      seller: { "@id": ORG_ID },
    },
  };
  if (idea.first_published_at) {
    schema.datePublished = idea.first_published_at.slice(0, 10);
  }
  if (idea.last_refreshed_at) {
    // Surfaces re-clustering and re-scoring as a real freshness signal.
    schema.dateModified = idea.last_refreshed_at.slice(0, 10);
  }
  return schema;
}

// =================================================================== //
//  Product + Offer for /pricing                                        //
// =================================================================== //

export interface PricingSchemaInput {
  /** USD value of the per-unlock tier, e.g. 3. */
  unlockUsd: number;
  /** USD value of the Pro monthly plan, e.g. 15. */
  proMonthlyUsd: number;
}

/**
 * Two Products in one @graph: the Per-Unlock one-time purchase and the Pro
 * monthly subscription. Free tier is omitted — Schema.org's Product isn't
 * the right fit for a $0 plan with no offer.
 */
export function buildPricingGraph(input: PricingSchemaInput) {
  const pricingUrl = `${BASE}/pricing`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${pricingUrl}#per-unlock`,
        name: "Pannly Idea Brief — Per Unlock",
        description:
          "Unlock a single founder pain-point brief. Full PDF teardown, evidence quotes, competitor matrix, validation plan, and landing copy. Refunded automatically when you ship within 30 days.",
        url: pricingUrl,
        brand: { "@type": "Brand", name: "Pannly" },
        // Image is required by Google for Product rich-result eligibility.
        image: {
          "@type": "ImageObject",
          url: `${BASE}/og-default.png`,
          width: 1200,
          height: 630,
        },
        offers: {
          "@type": "Offer",
          price: input.unlockUsd.toFixed(2),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${BASE}/feed`,
          seller: { "@id": ORG_ID },
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: input.unlockUsd.toFixed(2),
            priceCurrency: "USD",
            unitText: "per brief",
          },
        },
      },
      {
        "@type": "Product",
        "@id": `${pricingUrl}#pro`,
        name: "Pannly Pro — Unlimited Briefs",
        description:
          "Unlimited idea brief access, early drops, and private builder community. Cancel anytime.",
        url: pricingUrl,
        brand: { "@type": "Brand", name: "Pannly" },
        image: {
          "@type": "ImageObject",
          url: `${BASE}/og-default.png`,
          width: 1200,
          height: 630,
        },
        offers: {
          "@type": "Offer",
          price: input.proMonthlyUsd.toFixed(2),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: pricingUrl,
          seller: { "@id": ORG_ID },
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: input.proMonthlyUsd.toFixed(2),
            priceCurrency: "USD",
            referenceQuantity: {
              "@type": "QuantitativeValue",
              value: "1",
              unitCode: "MON",
            },
          },
        },
      },
    ],
  };
}

// =================================================================== //
//  CollectionPage + ItemList for /built                                //
// =================================================================== //

export interface BuildItem {
  /** Slug used to deep-link back to /built/{slug} or /ideas/{slug}. */
  slug: string;
  name: string;
  description?: string | null;
}

/**
 * The build gallery as an enumerable structured list. Google doesn't surface
 * this as a rich result on its own, but AI engines (Perplexity, ChatGPT
 * search) use ItemList to discover and cite individual entries.
 *
 * `items` should be the first server-rendered page (12 entries) — bots that
 * don't execute JS still see a complete starter set; the rest of the gallery
 * gets discovered through the sitemap.
 */
export function buildGalleryGraph(items: BuildItem[]) {
  const galleryUrl = `${BASE}/built`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${galleryUrl}#collection`,
    url: galleryUrl,
    name: "Pannly Build Gallery",
    description:
      "Public gallery of products built from Pannly idea briefs — every entry was unlocked for $3 and refunded after shipping.",
    isPartOf: { "@id": SITE_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
    mainEntity: {
      "@type": "ItemList",
      "@id": `${galleryUrl}#itemlist`,
      name: "Shipped builds",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: items.length,
      itemListElement: items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${BASE}/built/${encodeURIComponent(item.slug)}`,
        name: item.name,
        ...(item.description ? { description: item.description } : {}),
      })),
    },
  };
}

// =================================================================== //
//  AboutPage + Person for /about                                       //
// =================================================================== //

export interface AboutPageInput {
  founderName: string;
  founderJobTitle?: string;
  founderLocation?: string;
}

/**
 * AboutPage gives Google + AI search a clean signal that this URL describes
 * the company itself (not a product, not a blog post). Person sub-entity
 * ties the founder to the Organization.
 */
export function buildAboutGraph(input: AboutPageInput) {
  const aboutUrl = `${BASE}/about`;
  const personId = `${BASE}/about#founder`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${aboutUrl}#aboutpage`,
        url: aboutUrl,
        name: "About Pannly",
        description:
          "Why Pannly exists. The founder note, scoring methodology, and how we build in public.",
        inLanguage: "en-US",
        isPartOf: { "@id": SITE_ID },
        about: { "@id": ORG_ID },
        mainEntity: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: input.founderName,
        url: aboutUrl,
        ...(input.founderJobTitle ? { jobTitle: input.founderJobTitle } : {}),
        ...(input.founderLocation
          ? { homeLocation: { "@type": "Place", name: input.founderLocation } }
          : {}),
        worksFor: { "@id": ORG_ID },
        ...(FOUNDER_SAMEAS.length > 0 ? { sameAs: [...FOUNDER_SAMEAS] } : {}),
      },
    ],
  };
}

// =================================================================== //
//  SoftwareApplication for the homepage                                //
// =================================================================== //

export interface SoftwareApplicationInput {
  /** USD value of the per-unlock tier, e.g. 3. */
  unlockUsd: number;
}

/**
 * Pannly is a SaaS product. SoftwareApplication is the most specific schema
 * for it and unlocks the Software Application rich result in Google Search
 * (price chip, OS, application category badge). We render this in addition
 * to the WebPage / SpeakableSpecification block on the homepage.
 *
 * `applicationCategory: "BusinessApplication"` matches Google's published
 * vocabulary; `operatingSystem: "Web"` declares browser-based delivery.
 */
export function buildSoftwareApplication(input: SoftwareApplicationInput) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": SOFTWARE_ID,
    name: "Pannly",
    url: BASE,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Startup idea finder that surfaces validated software opportunities from real Reddit and Hacker News pain threads. Unlock a brief for $3, refunded automatically when you ship within 30 days.",
    offers: {
      "@type": "Offer",
      price: input.unlockUsd.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      seller: { "@id": ORG_ID },
    },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": SITE_ID },
  };
}

// =================================================================== //
//  FAQPage — for the homepage FAQ section                              //
// =================================================================== //

export interface FaqQA {
  question: string;
  /** Plain text answer. Newlines become <br> if injected as HTML elsewhere,
   *  but the schema field itself stores raw text. */
  answer: string;
}

/**
 * FAQPage on a commercial page no longer triggers Google's rich-result
 * accordions (Aug 2023 restriction limits FAQ rich results to government
 * and healthcare sites). However, AI engines (Perplexity, ChatGPT,
 * Bing Copilot) still parse FAQPage JSON-LD as a citation source, and
 * AI Overviews extract Q&A pairs preferentially when they're declared this
 * way. The cost is one extra script tag per page and the upside is
 * direct AI-answer eligibility for the most common Pannly queries.
 */
export function buildFaqPage(input: { url: string; qas: readonly FaqQA[] }) {
  const pageUrl = `${BASE}${input.url}`;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    url: pageUrl,
    isPartOf: { "@id": SITE_ID },
    inLanguage: "en-US",
    mainEntity: input.qas.map((qa) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: qa.answer,
      },
    })),
  };
}

// =================================================================== //
//  Dataset for /refunds                                                //
// =================================================================== //

export interface RefundsDatasetInput {
  totalRefundedCents: number;
  totalRefundsCount: number;
  avgRefundCents: number;
  /** ISO date — when this dataset row was last computed. */
  asOf?: string;
}

/**
 * Pannly's refund ledger as a public Dataset. Eligible for Google's Dataset
 * Search experience (Scholar / data discovery) — niche traffic but a strong
 * "build in public" credibility signal that AI engines pick up too.
 *
 * `variableMeasured` enumerates the structured columns of the dataset so
 * crawlers know what's queryable.
 */
export function buildRefundsDataset(input: RefundsDatasetInput) {
  const refundsUrl = `${BASE}/refunds`;
  const asOf = input.asOf ?? new Date().toISOString().slice(0, 10);
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${refundsUrl}#dataset`,
    name: "Pannly refund ledger",
    description: `Public ledger of every refund Pannly has issued to builders who shipped within 30 days. ${input.totalRefundsCount} refunds totalling $${(input.totalRefundedCents / 100).toFixed(2)} as of ${asOf}.`,
    url: refundsUrl,
    isPartOf: { "@id": SITE_ID },
    creator: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    keywords: ["refunds", "indie hackers", "build in public", "Pannly"],
    measurementTechnique: "Sum and average over refunded unlocks",
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "Total refunded",
        unitText: "USD cents",
        value: input.totalRefundedCents,
      },
      {
        "@type": "PropertyValue",
        name: "Refund count",
        unitText: "count",
        value: input.totalRefundsCount,
      },
      {
        "@type": "PropertyValue",
        name: "Average refund",
        unitText: "USD cents",
        value: input.avgRefundCents,
      },
    ],
    distribution: {
      "@type": "DataDownload",
      contentUrl: `${BASE}/v1/refunds/ledger`,
      encodingFormat: "application/json",
    },
  };
}

// =================================================================== //
//  BreadcrumbList — every interior page                                //
// =================================================================== //

export interface Breadcrumb {
  /** Visible label, e.g. "Pricing". */
  name: string;
  /** Site-relative path, e.g. "/pricing". The helper prepends BASE. */
  path: string;
}

/**
 * BreadcrumbList is one of the few schema types that still triggers a Google
 * rich result (the breadcrumb trail above the SERP title) for any site
 * category. Cheap to add, valuable on every interior page.
 *
 * Pass an array of crumbs from the home root onward — the helper handles the
 * "Home" entry implicitly so callers stay terse.
 */
export function buildBreadcrumbSchema(crumbs: Breadcrumb[]) {
  const trail: Breadcrumb[] = [{ name: "Home", path: "/" }, ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: crumb.name,
      item: `${BASE}${crumb.path === "/" ? "" : crumb.path}`,
    })),
  };
}

// =================================================================== //
//  SpeakableSpecification — voice / AI summarisation                   //
// =================================================================== //

/**
 * Marks the strongest definitional content on a page as the preferred passage
 * for voice assistants and AI Overviews. Wrap the matching DOM nodes with
 * `className="geo-speakable"` for the second selector to apply.
 *
 * Returns a `WebPage` schema rather than just the SpeakableSpecification
 * fragment because Google requires Speakable to live inside a WebPage entity.
 */
export function buildSpeakableWebPage(input: {
  url: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE}${input.url}#webpage`,
    url: `${BASE}${input.url}`,
    name: input.name,
    description: input.description,
    isPartOf: { "@id": SITE_ID },
    inLanguage: "en-US",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".geo-speakable"],
    },
  };
}

// =================================================================== //
//  Render helper — injects a plain <script>                            //
// =================================================================== //

/**
 * Serialise a schema object for `<script type="application/ld+json">`.
 *
 * Returns the raw JSON string — caller renders it via
 * `dangerouslySetInnerHTML` on a <script> element. Using `JSON.stringify`
 * (no pretty-print) keeps the payload tight and avoids whitespace breaking
 * Google's parser if a description contains a newline.
 */
export function schemaJson(schema: unknown): string {
  return JSON.stringify(schema);
}
