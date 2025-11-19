import { FormEvent, useState } from "react";

export const EmailCapture = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setStatus("success");
    setEmail("");
  };

  return (
    <section className="section-container">
      <div className="glass-card rounded-[40px] border border-gold/40 px-8 py-10 text-center shadow-glow">
        <p className="text-xs uppercase tracking-[0.5em] text-gold/70">Insider list</p>
        <h3 className="mt-3 font-serif text-3xl text-parchment">Be first to know when new colors drop.</h3>
        <p className="mt-2 text-parchment/70">Limited runs sell out quickly—join the list for advance notice.</p>
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
            Join the VinoVeil list
          </button>
        </form>
        {status === "success" && (
          <p className="mt-4 text-sm text-gold/80">Thanks for joining! We'll keep you posted.</p>
        )}
      </div>
    </section>
  );
};
