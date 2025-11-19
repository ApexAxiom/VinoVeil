type HeroProps = {
  onLearnMore: () => void;
};

export const Hero = ({ onLearnMore }: HeroProps) => {
  return (
    <section className="bg-[url('/hero-vinoveil.jpg')] bg-cover bg-right-top bg-no-repeat">
      <div className="section-container flex flex-col gap-10 rounded-3xl bg-night/90 px-6 py-16 backdrop-blur-lg lg:flex-row lg:items-center">
        <div className="max-w-xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">
            Elevate your pour. Guard every glass.
          </p>
          <h1 className="font-serif text-4xl font-semibold text-parchment sm:text-5xl">
            Keep the wine. Stop the bugs.
          </h1>
          <p className="text-lg text-parchment/80">
            VinoVeil is a premium mesh cover that lets you enjoy every sip outside without flies, leaves, or debris in your glass.
          </p>
          <ul className="space-y-3 text-parchment/80">
            {[
              "Fine mesh keeps insects out",
              "Breathable so your wine can open up",
              "Elegant enough for patios, parties, and weddings"
            ].map((item) => (
              <li key={item} className="flex items-start space-x-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-gold" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a href="#shop" className="button-primary">
              Shop VinoVeil Sets
            </a>
            <button className="button-secondary" onClick={onLearnMore}>
              See how it works
            </button>
          </div>
        </div>
        <div className="flex-1 text-right text-sm text-parchment/70">
          <p>Right-aligned hero image shows the product in action.</p>
        </div>
      </div>
    </section>
  );
};
