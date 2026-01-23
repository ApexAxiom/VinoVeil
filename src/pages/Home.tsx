import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Divider } from "../components/ui/Divider";

export function Home() {
  return (
    <div className="space-y-24">
      <Helmet>
        <title>VinoVeil | Elegant Wine Glass Covers</title>
        <meta
          name="description"
          content="VinoVeil keeps your wine pristine with elegant mesh covers designed for outdoor entertaining."
        />
      </Helmet>
      <section className="section-container grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <Badge>NEW ARRIVAL</Badge>
          <h1 className="font-serif text-4xl leading-tight text-ivory sm:text-5xl">
            Dine outdoors with confidence. Pour without the buzz.
          </h1>
          <p className="text-lg text-parchment/80">
            VinoVeil is a delicate, reusable wine glass cover that keeps fruit flies and wind-borne
            dust away. Designed for alfresco tastings, rooftop dinners, and every golden hour
            gathering.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/shop">
              <Button>Shop VinoVeil</Button>
            </Link>
            <Link to="/faq">
              <Button variant="secondary">Learn More</Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.3em] text-gold/70">
            <span>Reusable</span>
            <span>Elegant Mesh</span>
            <span>Wine Approved</span>
          </div>
        </div>
        <div className="relative">
          <img
            src="/hero-vinoveil.jpg"
            alt="VinoVeil glass cover in a moody wine setting"
            className="h-full w-full rounded-[32px] object-cover shadow-card"
          />
          <div className="absolute -bottom-6 right-6 rounded-3xl border border-gold/40 bg-night/80 px-5 py-4 text-sm text-parchment/80">
            "The quiet luxury upgrade your stemware deserves."
          </div>
        </div>
      </section>

      <section className="section-container grid gap-12 lg:grid-cols-3">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-gold/70">The Problem</p>
          <h2 className="font-serif text-3xl">Outdoor wine attracts uninvited guests.</h2>
          <p className="text-sm text-parchment/70">
            From patios to picnics, insects and breeze can spoil the moment. VinoVeil offers a
            polished barrier without hiding your pour.
          </p>
        </div>
        <div className="space-y-4 rounded-[32px] border border-gold/20 bg-cocoa/70 p-6">
          <h3 className="font-serif text-2xl text-gold">Solution</h3>
          <p className="text-sm text-parchment/70">
            A breathable, shimmering mesh that rests gently on your glass with a tailored elastic
            edge.
          </p>
          <img
            src="/mesh-detail.jpg"
            alt="Close-up of VinoVeil mesh detail"
            className="rounded-3xl"
          />
        </div>
        <div className="space-y-4 rounded-[32px] border border-gold/20 bg-cocoa/70 p-6">
          <h3 className="font-serif text-2xl text-gold">Crafted to Impress</h3>
          <p className="text-sm text-parchment/70">
            Each set arrives ready for gifting, with satin-soft mesh and a gold halo that elevates
            any tablescape.
          </p>
          <img
            src="/vinoveil-mesh-gold-halo.png"
            alt="Gold halo detail of VinoVeil"
            className="rounded-3xl"
          />
        </div>
      </section>

      <section className="section-container space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl">How it works</h2>
          <span className="text-xs uppercase tracking-[0.3em] text-gold/70">3 Steps</span>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Slip on",
              body: "Stretch the elastic edge over your glass for a seamless fit."
            },
            {
              title: "Sip freely",
              body: "Enjoy uninterrupted aromas while keeping insects away."
            },
            {
              title: "Rinse & repeat",
              body: "Hand wash after use and store in the included pouch."
            }
          ].map((step) => (
            <div key={step.title} className="rounded-[32px] border border-gold/20 bg-cocoa/70 p-6">
              <h3 className="font-serif text-2xl text-gold">{step.title}</h3>
              <p className="mt-3 text-sm text-parchment/70">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-container space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl">Lifestyle gallery</h2>
          <Divider />
        </div>
        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <img
            src="/vinoveil-lifestyle-1.png"
            alt="VinoVeil at a sunset dinner"
            className="h-full w-full rounded-[32px] object-cover"
          />
          <div className="grid gap-4">
            <img
              src="/vinoveil-lifestyle-2.png"
              alt="VinoVeil on a premium tablescape"
              className="rounded-[32px]"
            />
            <img
              src="/vinoveil-lifestyle-3.png"
              alt="VinoVeil for a cozy backyard toast"
              className="rounded-[32px]"
            />
          </div>
        </div>
      </section>

      <section className="section-container grid gap-10 rounded-[32px] border border-gold/20 bg-cocoa/80 p-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="font-serif text-3xl">The essentials in every set</h2>
          <ul className="mt-4 space-y-3 text-sm text-parchment/70">
            <li>• Soft mesh with breathable weave</li>
            <li>• Elastic edge fits standard stemware</li>
            <li>• Reusable, washable, and packable</li>
            <li>• Gift-ready packaging for special gatherings</li>
          </ul>
        </div>
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-gold/70">Testimonials</p>
          <blockquote className="text-lg text-ivory">
            “Finally, a way to protect my rosé outdoors without clunky covers.”
          </blockquote>
          <p className="text-sm text-parchment/60">— Marina L., Napa</p>
        </div>
      </section>

      <section className="section-container grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="font-serif text-3xl">Ready for your next pour?</h2>
          <p className="mt-3 text-sm text-parchment/70">
            Explore bundle sizes and keep every glass covered during dinner parties, vineyards, and
            quiet evenings on the balcony.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link to="/shop">
            <Button size="lg">Shop bundles</Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="secondary">
              Contact concierge
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
