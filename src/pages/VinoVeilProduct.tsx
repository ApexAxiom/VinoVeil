import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CommerceCta } from "../components/commerce/CommerceCta";
import { buttonSurfaceClassName } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Divider } from "../components/ui/Divider";
import { ENABLE_SHOPIFY_CHECKOUT, isShopifyPurchaseConfigured } from "../config/commerce";
import { vinoveilShopifyProduct } from "../data/vinoveilShopifyProduct";
import { absoluteUrl, getSiteOrigin } from "../lib/seo";

const benefits = [
  {
    title: "Keeps the moment calm",
    body: "A light mesh layer helps shield your glass from small insects and wind-blown dust while you stay present with guests."
  },
  {
    title: "Made to look intentional",
    body: "Soft texture and a refined rim silhouette read as part of the table—not a compromise."
  },
  {
    title: "Simple after the last sip",
    body: "Rinse, hand wash with mild soap, and air dry; store until the next patio night or celebration."
  }
];

const useCases = [
  { title: "Patio wine", body: "Golden-hour pours on the deck without constantly covering your glass." },
  { title: "Outdoor dining", body: "Backyard suppers, courtyards, and terraces where the breeze picks up." },
  { title: "Restaurants", body: "A polished touch for outdoor service when guests want a little extra care." },
  { title: "Gifts", body: "Thoughtful for hosts, newlyweds, and anyone who loves table details." },
  { title: "Events & weddings", body: "Outdoor receptions and long toasts where stemware sits out between sips." }
];

const specs = [
  "Reusable",
  "Mesh top",
  "Raised outer rim",
  "Wine-glass compatible (standard stemware)",
  "Easy to rinse"
];

const howSteps = [
  {
    title: "Set the veil",
    body: "Rest VinoVeil over the bowl so the mesh sits evenly and the rim finds its natural seat."
  },
  {
    title: "Sip as usual",
    body: "The weave is open enough to feel unobtrusive while you enjoy aroma and conversation."
  },
  {
    title: "Refresh for next time",
    body: "Rinse after use, wash gently by hand, and let it dry before tucking it away."
  }
];

function buildProductJsonLd() {
  const origin = getSiteOrigin();
  const images = vinoveilShopifyProduct.imagesPlaceholder.map((img) => absoluteUrl(img.src));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: vinoveilShopifyProduct.title,
    description: vinoveilShopifyProduct.longDescription,
    image: images,
    brand: {
      "@type": "Brand",
      name: "VinoVeil"
    },
    sku: vinoveilShopifyProduct.handle,
    ...(origin
      ? {
          url: `${origin}/vino-veil`
        }
      : {})
  };
}

function SectionHeading({ eyebrow, title, kicker }: { eyebrow: string; title: string; kicker?: string }) {
  return (
    <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.28em] text-gold/75">{eyebrow}</p>
        <h2 className="font-serif text-3xl text-ivory sm:text-4xl">{title}</h2>
      </div>
      {kicker ? <span className="text-xs uppercase tracking-[0.28em] text-parchment/50">{kicker}</span> : null}
    </div>
  );
}

export function VinoVeilProduct() {
  const p = vinoveilShopifyProduct;
  const faqItems = [
    {
      q: "Will it fit my wine glasses?",
      a: "The elastic edge is meant for typical wine stems and bowls you see at home or on a patio. If your glassware is unusually wide or narrow, check fit calmly before guests arrive."
    },
    {
      q: "Does it change how the wine smells?",
      a: "The mesh is open and light; most people find it similar to sipping with nothing on the glass, with less worry about what might land in the wine outdoors."
    },
    {
      q: "How do I clean it?",
      a: p.careInstructions
    },
    {
      q: "Where can I buy it?",
      a: isShopifyPurchaseConfigured()
        ? "Use the Shop buttons on this page—they open our Shopify checkout flow in a new tab."
        : "We are finishing our Shopify storefront. Join the waitlist and we will email you when ordering opens."
    }
  ];
  const heroImage = p.imagesPlaceholder[0]!;
  const canonicalPath = "/vino-veil";
  const canonical = absoluteUrl(canonicalPath);
  const ogImage = absoluteUrl(heroImage.src);
  const jsonLd = JSON.stringify(buildProductJsonLd());

  const availabilityNote = !ENABLE_SHOPIFY_CHECKOUT
    ? "Online ordering is not enabled on this preview yet—use the waitlist and we will follow up."
    : !isShopifyPurchaseConfigured()
      ? "Shopify checkout is enabled in settings, but a product or buy URL is still missing. Add your env vars to activate purchase buttons."
      : null;

  return (
    <div>
      <Helmet>
        <title>{p.seoTitle}</title>
        <meta name="description" content={p.seoDescription} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={p.seoTitle} />
        <meta property="og:description" content={p.seoDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:alt" content={heroImage.alt} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={p.seoTitle} />
        <meta name="twitter:description" content={p.seoDescription} />
        <meta name="twitter:image" content={ogImage} />
        <script type="application/ld+json">{jsonLd}</script>
      </Helmet>

      {/* Hero */}
      <section className="section-container pb-8 pt-4 lg:pt-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="space-y-8">
            <p className="text-xs uppercase tracking-[0.3em] text-gold/75">VinoVeil</p>
            <h1 className="font-serif text-4xl leading-[1.08] text-ivory sm:text-5xl lg:text-[3.25rem]">
              A quiet veil for the wine you are actually drinking.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-parchment/80">{p.shortDescription}</p>
            <div className="flex flex-wrap items-center gap-4">
              <CommerceCta size="lg" />
              <CommerceCta mode="waitlist" variant="secondary" size="lg" label="Notify me" />
            </div>
            {availabilityNote ? (
              <p className="max-w-xl text-sm leading-relaxed text-parchment/60">{availabilityNote}</p>
            ) : null}
            <p className="text-xs uppercase tracking-[0.22em] text-parchment/45">
              {p.pricePlaceholder}
            </p>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute -inset-4 rounded-[40px] bg-gradient-to-br from-gold/15 via-transparent to-wine/30 blur-2xl" />
            <img
              src={heroImage.src}
              alt={heroImage.alt}
              className="relative z-[1] aspect-[4/5] w-full rounded-[36px] object-cover shadow-card"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Mid CTA band */}
      <section className="border-y border-white/5 bg-cocoa/40 py-10">
        <div className="section-container flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold/70">Ready when you are</p>
            <p className="mt-2 font-serif text-2xl text-ivory">Bring VinoVeil to your next table.</p>
          </div>
          <CommerceCta size="lg" />
        </div>
      </section>

      {/* Story + gallery */}
      <section className="section-container space-y-12">
        <SectionHeading eyebrow="The product" title="Protection that stays understated." />
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="space-y-5 text-parchment/80">
            <p className="text-lg leading-relaxed text-ivory/95">{p.longDescription}</p>
            <p className="text-sm leading-relaxed">
              Whether you are pouring for two or setting a long outdoor table, VinoVeil is meant to feel
              giftable and practical—never loud.
            </p>
            <Divider />
            <Link to="/faq" className="text-sm text-gold transition hover:text-parchment">
              Read the short FAQ →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {p.imagesPlaceholder.slice(1).map((img) => (
              <img
                key={img.src}
                src={img.src}
                alt={img.alt}
                className="h-full max-h-80 w-full rounded-[28px] object-cover"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-container">
        <SectionHeading eyebrow="Benefits" title="Why hosts reach for it." />
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((b) => (
            <Card key={b.title} padding="lg" className="border-gold/15 bg-night/40">
              <h3 className="font-serif text-2xl text-gold">{b.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-parchment/75">{b.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="section-container">
        <SectionHeading eyebrow="Use cases" title="Made for evenings that spill outside." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((u) => (
            <div
              key={u.title}
              className="rounded-[28px] border border-white/8 bg-gradient-to-br from-cocoa/80 to-night/60 p-6"
            >
              <h3 className="font-serif text-xl text-ivory">{u.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-parchment/72">{u.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Specs */}
      <section className="section-container">
        <SectionHeading eyebrow="Specifications" title="At a glance" kicker="Details for your listing" />
        <Card padding="lg" className="max-w-3xl border-gold/20 bg-cocoa/50">
          <ul className="grid gap-3 sm:grid-cols-2">
            {specs.map((line) => (
              <li key={line} className="flex items-start gap-2 text-sm text-parchment/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold/80" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-3 border-t border-white/10 pt-8 text-sm text-parchment/65">
            <p>
              <span className="text-gold/90">Dimensions:</span> {p.dimensionsPlaceholder}
            </p>
            <p>
              <span className="text-gold/90">Materials:</span> {p.materialsPlaceholder}
            </p>
            <p>
              <span className="text-gold/90">Care:</span> {p.careInstructions}
            </p>
          </div>
        </Card>
      </section>

      {/* How it works */}
      <section className="section-container">
        <SectionHeading eyebrow="How it works" title="Three calm steps." kicker="No theatrics" />
        <div className="grid gap-6 md:grid-cols-3">
          {howSteps.map((step, i) => (
            <Card key={step.title} padding="lg" className="relative overflow-hidden border-gold/15 bg-night/35">
              <span className="font-serif text-5xl text-gold/25">{i + 1}</span>
              <h3 className="mt-2 font-serif text-2xl text-gold">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-parchment/75">{step.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section-container">
        <SectionHeading eyebrow="FAQ" title="Straight answers." />
        <div className="space-y-4">
          {faqItems.map((item) => (
            <Card key={item.q} padding="lg" className="border-white/8 bg-cocoa/40">
              <h3 className="font-serif text-xl text-gold">{item.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-parchment/75">{item.a}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-container pb-20">
        <Card
          padding="lg"
          className="flex flex-col items-start justify-between gap-8 border-gold/25 bg-gradient-to-br from-cocoa/90 to-night/80 sm:flex-row sm:items-center"
        >
          <div>
            <h2 className="font-serif text-3xl text-ivory">VinoVeil, table-ready.</h2>
            <p className="mt-2 max-w-lg text-sm text-parchment/70">
              {isShopifyPurchaseConfigured()
                ? "Continue to Shopify for secure checkout in a new tab."
                : "We are not taking online orders on this site yet—leave a note via the waitlist."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CommerceCta size="lg" />
            <Link
              to="/contact"
              className={buttonSurfaceClassName({ variant: "secondary", size: "lg" })}
            >
              Contact
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
