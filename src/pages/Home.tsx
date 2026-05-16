import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CommerceCta } from "../components/commerce/CommerceCta";
import { Badge } from "../components/ui/Badge";
import { Divider } from "../components/ui/Divider";
import { buttonSurfaceClassName } from "../components/ui/Button";
import { absoluteUrl } from "../lib/seo";

export function Home() {
  const canonical = absoluteUrl("/");
  const ogImage = absoluteUrl("/hero-vinoveil.jpg");

  return (
    <div className="space-y-20 sm:space-y-28">
      <Helmet>
        <title>VinoVeil | Elegant Wine Glass Covers</title>
        <meta
          name="description"
          content="VinoVeil keeps your wine pleasant outdoors with a refined reusable mesh veil for stemware—patio nights, dining al fresco, and gifting."
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content="VinoVeil | Elegant Wine Glass Covers" />
        <meta
          property="og:description"
          content="VinoVeil keeps your wine pleasant outdoors with a refined reusable mesh veil for stemware."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:alt" content="VinoVeil mesh wine glass cover in a warm setting" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="VinoVeil | Elegant Wine Glass Covers" />
        <meta
          name="twitter:description"
          content="VinoVeil keeps your wine pleasant outdoors with a refined reusable mesh veil for stemware."
        />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <section className="section-container grid gap-12 pb-4 pt-2 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-6">
        <div className="flex flex-col justify-center space-y-8">
          <Badge>Outdoor entertaining</Badge>
          <h1 className="font-serif text-4xl leading-[1.08] text-ivory sm:text-5xl lg:text-[3.25rem]">
            Dine outdoors with confidence. Pour without the fuss.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-parchment/80">
            VinoVeil is a reusable mesh wine veil that rests over your glass—helping keep fruit flies
            and breeze-borne dust away while the evening stays elegant.
          </p>
          <div className="flex flex-wrap gap-4">
            <CommerceCta size="lg" />
            <Link
              to="/vino-veil"
              className={buttonSurfaceClassName({ variant: "secondary", size: "lg" })}
            >
              Explore the product
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.28em] text-gold/70">
            <span>Reusable</span>
            <span>Fine mesh</span>
            <span>Stemware-friendly</span>
          </div>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute -inset-3 rounded-[36px] bg-gradient-to-br from-gold/12 via-transparent to-wine/25 blur-2xl" />
          <img
            src="/hero-vinoveil.jpg"
            alt="VinoVeil mesh wine glass cover on stemware in a moody, warm setting"
            className="relative z-[1] aspect-[4/5] w-full rounded-[32px] object-cover shadow-card sm:aspect-auto sm:min-h-[420px] lg:min-h-[480px]"
          />
        </div>
      </section>

      <section className="section-container grid gap-12 lg:grid-cols-3 lg:gap-10">
        <div className="space-y-4 lg:pr-4">
          <p className="text-xs uppercase tracking-[0.22em] text-gold/70">The moment</p>
          <h2 className="font-serif text-3xl leading-snug text-ivory sm:text-4xl">
            Outdoor wine invites small interruptions.
          </h2>
          <p className="text-sm leading-relaxed text-parchment/75">
            Patios, gardens, and rooftops move—air moves with them. VinoVeil offers a composed layer
            so the glass still feels like part of the table.
          </p>
        </div>
        <div className="space-y-5 rounded-[32px] border border-gold/18 bg-cocoa/60 p-7 shadow-inner shadow-black/20">
          <h3 className="font-serif text-2xl text-gold">A light touch</h3>
          <p className="text-sm leading-relaxed text-parchment/75">
            Breathable mesh and a gentle raised outer rim keep the silhouette refined while you sip.
          </p>
          <img
            src="/mesh-detail.jpg"
            alt="Close-up of VinoVeil mesh texture and rim"
            className="rounded-3xl"
            loading="lazy"
          />
        </div>
        <div className="space-y-5 rounded-[32px] border border-gold/18 bg-cocoa/60 p-7 shadow-inner shadow-black/20">
          <h3 className="font-serif text-2xl text-gold">Table-ready presence</h3>
          <p className="text-sm leading-relaxed text-parchment/75">
            Designed to read as intentional—quiet enough for weeknight wine, polished enough when you
            are setting the table for guests.
          </p>
          <img
            src="/vinoveil-mesh-gold-halo.png"
            alt="VinoVeil outer rim and mesh detail on a wine glass"
            className="rounded-3xl"
            loading="lazy"
          />
        </div>
      </section>

      <section className="section-container space-y-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gold/70">How it works</p>
            <h2 className="font-serif text-3xl text-ivory sm:text-4xl">Three simple steps</h2>
          </div>
          <span className="text-xs uppercase tracking-[0.28em] text-parchment/45">Calm routine</span>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Slip on",
              body: "Stretch the elastic edge over your glass for a seated fit."
            },
            {
              title: "Sip freely",
              body: "The open mesh keeps the moment airy while you enjoy the wine."
            },
            {
              title: "Rinse & repeat",
              body: "Rinse after use, hand wash with mild soap, and air dry for the next pour."
            }
          ].map((step) => (
            <div
              key={step.title}
              className="rounded-[32px] border border-gold/15 bg-night/40 p-7 backdrop-blur-sm"
            >
              <h3 className="font-serif text-2xl text-gold">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-parchment/75">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-container space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-serif text-3xl text-ivory sm:text-4xl">On the table</h2>
        <div className="hidden flex-1 sm:ml-10 sm:block">
          <Divider />
        </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <img
            src="/vinoveil-lifestyle-1.png"
            alt="VinoVeil on wine glasses at an outdoor evening gathering"
            className="h-full min-h-[280px] w-full rounded-[32px] object-cover"
            loading="lazy"
          />
          <div className="grid gap-4">
            <img
              src="/vinoveil-lifestyle-2.png"
              alt="VinoVeil styled on a dressed outdoor table"
              className="rounded-[32px] object-cover"
              loading="lazy"
            />
            <img
              src="/vinoveil-lifestyle-3.png"
              alt="VinoVeil in a relaxed backyard wine setting"
              className="rounded-[32px] object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="section-container grid gap-10 rounded-[32px] border border-gold/18 bg-cocoa/70 p-9 sm:p-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <h2 className="font-serif text-3xl text-ivory sm:text-4xl">Made for slow evenings</h2>
          <ul className="mt-6 space-y-3 text-sm leading-relaxed text-parchment/78">
            <li className="flex gap-2">
              <span className="text-gold">·</span>
              Soft mesh with an open weave
            </li>
            <li className="flex gap-2">
              <span className="text-gold">·</span>
              Elastic edge for standard stemware
            </li>
            <li className="flex gap-2">
              <span className="text-gold">·</span>
              Reusable and easy to rinse between pours
            </li>
            <li className="flex gap-2">
              <span className="text-gold">·</span>
              A thoughtful shape for gifting
            </li>
          </ul>
        </div>
        <div className="rounded-3xl border border-white/10 bg-night/35 p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-gold/70">Editorial note</p>
          <p className="mt-4 font-serif text-xl leading-relaxed text-ivory">
            We believe outdoor wine should still feel considered—glass, light, company, and a little
            room to breathe.
          </p>
        </div>
      </section>

      <section className="section-container grid gap-10 pb-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <h2 className="font-serif text-3xl text-ivory sm:text-4xl">Ready for your next pour?</h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-parchment/75">
            See the full product story, specifications, and FAQ—or open Shopify checkout when your
            store links are configured.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <CommerceCta size="lg" />
          <Link
            to="/contact"
            className={buttonSurfaceClassName({ variant: "secondary", size: "lg" })}
          >
            Contact concierge
          </Link>
        </div>
      </section>
    </div>
  );
}
