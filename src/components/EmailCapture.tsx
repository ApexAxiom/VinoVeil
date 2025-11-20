import { FormEvent, useState } from "react";

export const EmailCapture = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setStatus("success");
    setEmail("");
    // eslint-disable-next-line no-console
    console.log("VinoVeil email capture (demo only, not persisted)", {
      email,
      timestamp: new Date().toISOString()
    });
    // TODO: Integrate with your email platform (Klaviyo, ConvertKit, or AWS Pinpoint).
  };

  return (
    <section className="section-container">
      <div className="glass-card rounded-[40px] border border-gold/40 px-8 py-10 text-center shadow-glow">
        <p className="text-xs uppercase tracking-[0.5em] text-gold/70">Insider list</p>
        <h3 className="mt-3 font-serif text-3xl text-parchment">Join the cellar list.</h3>
        <p className="mt-2 text-parchment/70">First access to new finishes, limited runs, and hosting notes.</p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            className="input-base flex-1 bg-night/60"
          />
          <button type="submit" className="button-primary">
            Join VinoVeil
          </button>
        </form>
        {status === "success" && (
          <p className="mt-4 text-sm text-gold/80" aria-live="polite">
            You’re in. We’ll only write when there’s something worth opening.
          </p>
        )}
      </div>
    </section>
  );
};
