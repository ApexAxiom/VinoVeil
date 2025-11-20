import React from "react";

type HeroProps = {
  onLearnMore: () => void;
};

export const Hero: React.FC<HeroProps> = ({ onLearnMore }) => {
  const features = [
    "Weighted halo inspired by stemware rims.",
    "Fine mesh that keeps insects out, not aroma.",
    "Fits most wine glasses, coupes, and flutes.",
    "Rinse, dry, and stack—ready for the next evening."
  ];

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-gold/10 blur-[160px]" aria-hidden="true" />
      <div className="absolute right-[-10%] top-0 h-[28rem] w-[28rem] rounded-full bg-wine/30 blur-[200px]" aria-hidden="true" />
      <div className="section-container relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <p className="text-xs uppercase tracking-[0.6em] text-gold/80">Al fresco cellar essentials</p>
          <h1 className="font-serif text-4xl leading-[1.05] text-parchment sm:text-5xl lg:text-6xl">
            A golden veil for every glass.
          </h1>
          <p className="max-w-2xl text-lg text-parchment/80">
            VinoVeil is a hand-finished mesh cover that keeps gnats, pollen, and patio debris out while your wine breathes as the
            evening unfolds.
          </p>
          <div className="grid gap-4 text-sm text-parchment/75 sm:grid-cols-2">
            {features.map((copy) => (
              <div key={copy} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-gold" />
                <span>{copy}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <a href="#shop" className="button-primary">
              Shop the sets
            </a>
            <button className="button-secondary" onClick={onLearnMore}>
              See the ritual
            </button>
            <p className="text-[0.7rem] uppercase tracking-[0.45em] text-parchment/55">Ships in 3 business days</p>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 rounded-[40px] border border-gold/30 opacity-80" aria-hidden="true" />
          <div className="glass-card relative overflow-hidden rounded-[32px] bg-gradient-to-b from-black/40 to-black/80">
            <figure className="relative h-full w-full">
              <img
                src="/hero-vinoveil.jpg"
                alt="A glass of wine covered with the gold VinoVeil mesh"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
              <figcaption className="sr-only">VinoVeil protecting a glass of red wine with a gold halo.</figcaption>
            </figure>
          </div>
          <div className="glass-card absolute -bottom-12 left-1/2 w-[84%] -translate-x-1/2 rounded-[28px] border border-gold/30 p-6 text-sm text-parchment shadow-glow">
            <p className="font-serif text-xl text-gold">4.9 average rating</p>
            <p className="mt-2 text-parchment/75">Hosts and sommeliers approve the calm, uninterrupted pour.</p>
            <p className="mt-3 text-[0.65rem] uppercase tracking-[0.32em] text-parchment/50">Patio-tested luxury</p>
          </div>
        </div>
      </div>
    </section>
  );
};
