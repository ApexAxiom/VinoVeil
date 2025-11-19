export const Benefits = () => {
  return (
    <section id="benefits" className="section-container grid gap-10 lg:grid-cols-2 lg:items-center">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">Thoughtful design</p>
        <h2 className="font-serif text-3xl text-parchment">Designed for real life outdoor moments.</h2>
        <div className="grid gap-4">
          {[
            { title: "Protection", text: "Blocks bugs, dust, and leaves." },
            { title: "Experience", text: "Keeps aromas open while your wine stays clean." },
            { title: "Practical", text: "Lightweight, stackable, and easy to rinse." },
            { title: "Aesthetic", text: "Minimal look that matches any stemmed glass." }
          ].map((benefit) => (
            <div key={benefit.title} className="rounded-2xl border border-parchment/10 p-4">
              <p className="text-sm text-gold">{benefit.title}</p>
              <p className="text-parchment/80">{benefit.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="h-72 rounded-3xl bg-[url('/mesh-detail.jpg')] bg-cover bg-center shadow-2xl shadow-black/50" />
        <div className="rounded-2xl border border-parchment/10 bg-cocoa/70 p-4 text-sm text-parchment/90">
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
            <div key={row.label} className="mt-2 grid grid-cols-5 gap-2 rounded-xl bg-night/40 p-3 text-center text-sm">
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
