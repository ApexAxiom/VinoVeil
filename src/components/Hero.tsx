type HeroProps = {
  onLearnMore: () => void;
};

export const Hero = ({ onLearnMore }: HeroProps) => {
  return (
    <section className="relative">
      <div className="section-container grid gap-12 rounded-[40px] border border-white/5 bg-night/70 px-6 py-16 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <p className="text-xs uppercase tracking-[0.8em] text-gold/80">Al fresco winekeeping</p>
          <h1 className="font-serif text-4xl text-parchment sm:text-5xl lg:text-6xl">
            The elegance of a tasting room, without the walls.
          </h1>
          <p className="text-lg text-parchment/80">
            Inspired by boutique hotel service, VinoVeil is a hand-finished mesh cover that keeps every pour pristine while your guests linger outdoors.
          </p>
          <div className="grid gap-4 text-sm text-parchment/75 sm:grid-cols-2">
            {[
              "Gold-weighted halo keeps the mesh in place.",
              "Breathable weave respects aroma development.",
              "Sized for coupes, Burgundy bowls, and flutes.",
              "Rinse, stack, and tuck away in moments."
            ].map((copy) => (
              <div key={copy} className="flex items-start space-x-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-gold" />
                <span>{copy}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <a href="#shop" className="button-primary">
              Shop the collection
            </a>
            <button className="button-secondary" onClick={onLearnMore}>
              See the craftsmanship
            </button>
            <p className="text-xs uppercase tracking-[0.5em] text-parchment/60">Ships in 3 business days</p>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-3 rounded-[40px] border border-gold/20" />
          <figure className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-black/40 to-black/90">
            <img
              src="/hero-vinoveil.jpg"
              alt="VinoVeil mesh cover resting on a glass of wine"
              className="h-full w-full object-cover"
            />
            <figcaption className="sr-only">Fine mesh cover styled with deep burgundy wine.</figcaption>
          </figure>
          <div className="glass-card absolute -bottom-10 left-1/2 w-64 -translate-x-1/2 rounded-3xl border border-gold/30 p-5 text-sm text-parchment">
            <p className="font-serif text-xl text-gold">Vintner approved</p>
            <p className="mt-2 text-parchment/70">“The easiest way to keep tasting flights untouched by the evening air.”</p>
            <p className="mt-3 text-xs uppercase tracking-[0.4em] text-parchment/50">Sommelier Circle</p>
          </div>
        </div>
      </div>
    </section>
  );
};
