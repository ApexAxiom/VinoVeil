const steps = [
  {
    title: "Place VinoVeil over your glass",
    description: "The fine mesh settles gently on any stemmed glass.",
    icon: "🪄"
  },
  {
    title: "Sip and set it back on top",
    description: "Lightweight enough to lift with one hand, steady enough to stay put.",
    icon: "🍷"
  },
  {
    title: "Enjoy the evening",
    description: "No more fishing bugs out or worrying about falling leaves.",
    icon: "🌙"
  }
];

export const HowItWorks = () => {
  return (
    <section id="how" className="section-container space-y-12">
      <div className="flex flex-col items-center text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">Simple ritual</p>
        <h2 className="font-serif text-3xl text-parchment sm:text-4xl">How VinoVeil works</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.title}
            className="rounded-2xl border border-parchment/10 bg-cocoa/70 p-6 text-parchment shadow-lg shadow-black/20"
          >
            <div className="text-4xl">{step.icon}</div>
            <h3 className="mt-4 font-serif text-xl text-gold">{step.title}</h3>
            <p className="mt-2 text-sm text-parchment/80">{step.description}</p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-gold/30 bg-wine/30 p-6 text-center text-parchment shadow-glow">
        Perfect for patios, pools, picnics, and weddings.
      </div>
    </section>
  );
};
