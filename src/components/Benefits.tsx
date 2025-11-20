const highlights = [
  {
    pill: "Mesh",
    title: "Fine stainless mesh",
    description: "Ultra-fine, taste-neutral mesh keeps insects out while allowing wine to open in the glass."
  },
  {
    pill: "Halo",
    title: "Weighted halo",
    description: "A chamfered, gold-tone ring echoes the curve of crystal stemware and stays steady on breezy nights."
  },
  {
    pill: "Fit",
    title: "Universal fit",
    description: "Sized to sit within the lip of most Bordeaux, Burgundy, and all-purpose stems, plus coupes and select flutes."
  },
  {
    pill: "Care",
    title: "Reusable & effortless",
    description: "Rinse under warm water or place on the top rack. Stack the set in its pouch until the next gathering."
  }
];

const occasions = [
  { title: "For patio dinners", copy: "Serve a full bottle without hovering over each glass.", icon: "🌿" },
  { title: "For poolside pours", copy: "Keep splashes, sunscreen, and stray leaves out of delicate whites and rosés.", icon: "🏖️" },
  { title: "For vineyard tastings", copy: "Offer flights outdoors without a single gnat marring the experience.", icon: "🍇" },
  { title: "For weddings & events", copy: "Protect every glass on the table while guests roam between conversations.", icon: "💍" }
];

export const Benefits = () => {
  return (
    <div className="space-y-16">
      <section id="craft" className="section-container grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.5em] text-gold/70">Crafted details</p>
          <h2 className="font-serif text-3xl text-parchment sm:text-4xl">Engineered like stemware. Finished like jewelry.</h2>
          <p className="text-parchment/75">
            Each VinoVeil is treated as a piece of tableware: balanced, tactile, and built to disappear into the ritual of
            pouring—except when guests ask where you found it.
          </p>
          <div className="space-y-4">
            {highlights.map((item) => (
              <div key={item.title} className="glass-card rounded-3xl p-5">
                <span className="pill-tag">{item.pill}</span>
                <h3 className="mt-3 font-serif text-xl text-parchment">{item.title}</h3>
                <p className="mt-2 text-sm text-parchment/75">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-[36px] border border-gold/20 shadow-2xl shadow-black/60">
            <img
              src="/vinoveil-mesh-gold-halo.png"
              alt="Close up of the VinoVeil mesh and gold halo"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section id="benefits" className="section-container space-y-10">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-gold/70">Why hosts love it</p>
          <h2 className="font-serif text-3xl text-parchment sm:text-4xl">More time in the moment, less time fishing out bugs.</h2>
          <p className="mt-3 text-parchment/70">Designed for patios, terraces, and every place you open a bottle under the sky.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {occasions.map((occasion) => (
            <div key={occasion.title} className="glass-card flex h-full flex-col rounded-3xl p-5">
              <div className="flex items-center gap-3 text-2xl text-gold">
                <span aria-hidden="true">{occasion.icon}</span>
                <p className="text-sm uppercase tracking-[0.3em] text-gold/80">Occasion</p>
              </div>
              <h3 className="mt-4 font-serif text-xl text-parchment">{occasion.title}</h3>
              <p className="mt-2 text-sm text-parchment/75">{occasion.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
