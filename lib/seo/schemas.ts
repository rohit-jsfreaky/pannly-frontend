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

export interface OrganizationGraph {
  "@context": "https://schema.org";
  "@graph": Record<string, unknown>[];
}

/** Site-wide @graph: Organization + WebSite. Renders once in root layout. */
export function buildOrganizationGraph(): OrganizationGraph {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "Pannly",
        url: BASE,
        logo: {
          "@type": "ImageObject",
          url: `${BASE}/og-default.png`,
          width: 1200,
          height: 630,
        },
        description:
          "Pannly watches Reddit and Hacker News for real founder pain. We score the signals, write the brief, and let you unlock one for $3 — refunded the moment you ship.",
        founder: {
          "@type": "Person",
          name: "Rohit",
          jobTitle: "Founder",
        },
        sameAs: [],
      },
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
  /** Cents — converted to "X.XX" inside. */
  unlock_price_cents: number;
}

export function buildIdeaSchema(idea: IdeaSchemaInput) {
  const url = `${BASE}/ideas/${encodeURIComponent(idea.slug)}`;
  const price = (idea.unlock_price_cents / 100).toFixed(2);
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#brief`,
    name: idea.title,
    description: idea.one_line_pain ?? idea.title,
    url,
    inLanguage: "en-US",
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
    },
  };
  if (idea.first_published_at) {
    // Strip the time component for a clean ISO date.
    schema.datePublished = idea.first_published_at.slice(0, 10);
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
        offers: {
          "@type": "Offer",
          price: input.unlockUsd.toFixed(2),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${BASE}/feed`,
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
        offers: {
          "@type": "Offer",
          price: input.proMonthlyUsd.toFixed(2),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: pricingUrl,
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
        ...(input.founderJobTitle ? { jobTitle: input.founderJobTitle } : {}),
        ...(input.founderLocation
          ? { homeLocation: { "@type": "Place", name: input.founderLocation } }
          : {}),
        worksFor: { "@id": ORG_ID },
      },
    ],
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
