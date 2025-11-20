const steps = [
  {
    title: "Set the veil",
    description: "Place VinoVeil over your glass. The gold-weighted halo centers itself gently on the rim.",
    icon: "🪄"
  },
  {
    title: "Sip and rest",
    description: "Lift with two fingers, sip, and rest the cover back on top. No napkins, no juggling.",
    icon: "🍷"
  },
  {
    title: "Let the wine breathe",
    description: "Aroma flows freely while gnats, bees, and patio debris stay on the outside of the mesh.",
    icon: "🌙"
  }
];

export const HowItWorks = () => {
  return (
    <section id="how" className="section-container space-y-12">
      <div className="flex flex-col items-center text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-gold/70">Simple ritual</p>
        <h2 className="font-serif text-3xl text-parchment sm:text-4xl">Three quiet moves, one pristine pour.</h2>
        <p className="mt-3 max-w-2xl text-parchment/70">
          Designed with sommeliers and outdoor hosts, VinoVeil protects each glass without interrupting conversation.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.title} className="glass-card relative h-full rounded-3xl p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-2xl text-gold">
              {step.icon}
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.4em] text-parchment/40">Step {index + 1}</p>
            <h3 className="font-serif text-2xl text-parchment">{step.title}</h3>
            <p className="mt-3 text-sm text-parchment/70">{step.description}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
        <div className="glass-card relative overflow-hidden rounded-[30px] border border-gold/30">
          <img
            src="/vinoveil-product-3.jpg"
            alt="VinoVeil product in use on a wine glass"
            className="h-full w-full object-cover"
            onError={(e) => {
              // Fallback to hero image if product image doesn't exist
              const target = e.target as HTMLImageElement;
              if (target.src !== window.location.origin + "/hero-vinoveil.jpg") {
                target.src = "/hero-vinoveil.jpg";
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
        </div>
        <div className="glass-card rounded-[30px] border border-gold/40 bg-gradient-to-r from-wine/40 to-night/80 p-8 text-center text-parchment shadow-glow">
          Perfect for patios, vineyards, yachts, rooftop terraces, and every al fresco toast.
        </div>
      </div>
    </section>
  );
};
