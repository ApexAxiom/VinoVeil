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
    <section className="section-container rounded-3xl border border-gold/30 bg-night/80 p-8 text-center shadow-glow">
      <h3 className="font-serif text-2xl text-parchment">Be first to know when new colors drop.</h3>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          className="input-base flex-1"
        />
        <button type="submit" className="button-primary">
          Join the VinoVeil list
        </button>
      </form>
      {status === "success" && (
        <p className="mt-4 text-sm text-gold/80">Thanks for joining! We'll keep you posted.</p>
      )}
    </section>
  );
};
