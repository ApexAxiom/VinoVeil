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
import { CheckoutPreview } from "./components/CheckoutPreview";

const modalCopy: Record<string, string> = {
  Contact:
    "Reach us at hello@vinoveil.com. We typically reply within one business day with sizing, care, or order support.",
  "Privacy Policy":
    "We only use your email for VinoVeil product updates and limited releases. Your information is never sold or shared.",
  Terms:
    "All purchases include a 30-day satisfaction promise. Returns and exchanges are handled with care—email us to start the process."
};

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<null | { title: string; body: string }>(null);

  return (
    <div className="relative min-h-screen overflow-hidden bg-night text-parchment">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-20 h-96 w-96 rounded-full bg-wine/30 blur-[140px]" />
        <div className="absolute right-0 top-0 h-[32rem] w-[32rem] rounded-full border border-gold/20 opacity-60 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
      <div className="relative z-10">
        <Header onOpenCart={() => setCartOpen(true)} />
        <main className="space-y-28 pb-24 pt-6">
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
      </div>
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onBeginCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />
      <CheckoutPreview open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      {activeModal && (
        <>
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="glass-card max-w-lg rounded-[32px] border border-gold/30 p-8">
              <h3 className="font-serif text-3xl text-gold">{activeModal.title}</h3>
              <p className="mt-4 text-parchment/80">{activeModal.body}</p>
              <button className="button-secondary mt-8" onClick={() => setActiveModal(null)}>
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
