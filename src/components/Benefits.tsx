export const Benefits = () => {
  return (
    <section id="benefits" className="section-container grid gap-12 lg:grid-cols-2 lg:items-center">
      <div className="space-y-8">
        <p className="text-xs uppercase tracking-[0.5em] text-gold/70">Thoughtful design</p>
        <h2 className="font-serif text-3xl text-parchment sm:text-4xl">Crafted for evenings that stretch past sunset.</h2>
        <p className="text-parchment/70">
          Every VinoVeil cover is woven with a whisper-thin metallic halo, keeping glasses protected while letting aromas bloom. Easy to care for, effortless to show off.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { title: "Protection", text: "Blocks insects, dust, and falling leaves without suffocating your pour." },
            { title: "Experience", text: "Keeps the bouquet open and undisturbed for tastings." },
            { title: "Practical", text: "Stacks flat, rinses in seconds, and dries without water spots." },
            { title: "Aesthetic", text: "Matches crystal stems from modern to vintage." }
          ].map((benefit) => (
            <div key={benefit.title} className="glass-card rounded-3xl p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-gold">{benefit.title}</p>
              <p className="mt-2 text-parchment/80">{benefit.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="relative h-80 overflow-hidden rounded-[36px] shadow-2xl shadow-black/60">
          <img src="/mesh-detail.jpg" alt="Close up of the VinoVeil mesh detail" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <p className="text-xs uppercase tracking-[0.4em] text-parchment/60">Hand finished</p>
            <p className="font-serif text-2xl text-parchment">Tactile metallic trim</p>
          </div>
        </div>
        <div className="glass-card rounded-3xl p-6 text-sm text-parchment/90">
          <div className="grid grid-cols-5 gap-2 text-center text-xs uppercase tracking-wide text-parchment/60">
            <span />
            <span>Looks</span>
            <span>Reusability</span>
            <span>Airflow</span>
            <span>Stability</span>
          </div>
          {[
            { label: "Paper napkin", values: ["Messy", "No", "Poor", "Unreliable"] },
            { label: "Plastic lid", values: ["Clunky", "Sometimes", "Limited", "OK"] },
            { label: "VinoVeil", values: ["Elegant", "Yes", "Breathable", "Secure"] }
          ].map((row) => (
            <div key={row.label} className="mt-3 grid grid-cols-5 gap-2 rounded-2xl bg-black/40 p-3 text-center text-sm">
              <div className="text-left font-semibold text-gold">{row.label}</div>
              {row.values.map((value) => (
                <div key={value} className="text-parchment">
                  {value}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
