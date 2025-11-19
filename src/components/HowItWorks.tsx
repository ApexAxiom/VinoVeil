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
        <p className="text-xs uppercase tracking-[0.5em] text-gold/70">Simple ritual</p>
        <h2 className="font-serif text-3xl text-parchment sm:text-4xl">How VinoVeil works</h2>
        <p className="mt-3 max-w-2xl text-parchment/70">
          A three-step ritual designed by sommeliers to protect delicate pours without interrupting conversation.
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
      <div className="rounded-[30px] border border-gold/40 bg-gradient-to-r from-wine/40 to-night/70 p-8 text-center text-parchment shadow-glow">
        Perfect for patios, pools, vineyards, yachts, and any alfresco soirée.
      </div>
    </section>
  );
};
