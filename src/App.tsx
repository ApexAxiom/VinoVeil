import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Benefits } from "./components/Benefits";
import { Shop } from "./components/Shop";
import { Reviews } from "./components/Reviews";
import { FAQ } from "./components/FAQ";
import { EmailCapture } from "./components/EmailCapture";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";

const modalCopy: Record<string, string> = {
  Contact: "Reach us anytime at hello@vinoveil.com. We typically reply within one business day.",
  "Privacy Policy":
    "We respect your privacy. Your details stay with us and are only used to share updates about VinoVeil.",
  Terms: "All purchases are subject to our standard terms of sale, including a 30-day satisfaction promise."
};

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<null | { title: string; body: string }>(null);

  return (
    <div className="min-h-screen bg-night text-parchment">
      <Header onOpenCart={() => setCartOpen(true)} />
      <main className="space-y-16 pb-20">
        <Hero onLearnMore={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })} />
        <HowItWorks />
        <Benefits />
        <Shop />
        <Reviews />
        <FAQ />
        <EmailCapture />
      </main>
      <Footer
        onOpenModal={(title) => {
          setActiveModal({ title, body: modalCopy[title] });
        }}
      />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      {activeModal && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setActiveModal(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="max-w-lg rounded-3xl border border-gold/30 bg-cocoa/90 p-6 shadow-glow">
              <h3 className="font-serif text-2xl text-gold">{activeModal.title}</h3>
              <p className="mt-4 text-parchment/80">{activeModal.body}</p>
              <button className="button-secondary mt-6" onClick={() => setActiveModal(null)}>
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
