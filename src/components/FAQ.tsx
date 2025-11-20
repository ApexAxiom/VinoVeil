import { useState } from "react";

const faqs = [
  {
    question: "Will VinoVeil change how my wine smells or tastes?",
    answer:
      "No. The fine stainless mesh is taste-neutral and allows aroma to flow while keeping bugs and debris out of the glass."
  },
  {
    question: "What glasses does VinoVeil fit?",
    answer:
      "The halo rests within most Bordeaux, Burgundy, all-purpose stems, coupes, and select flutes. If there is a rim, it likely fits."
  },
  {
    question: "How do I clean and store the covers?",
    answer:
      "Rinse under warm water or place on the top rack. Dry fully, then stack in the included pouch until the next gathering."
  },
  {
    question: "Can I use them with sparkling wine or cocktails?",
    answer:
      "Yes. They complement Champagne flutes, coupes, and stirred or shaken cocktails while letting bubbles and aromatics rise."
  },
  {
    question: "Where do you ship, and how long does it take?",
    answer: "We ship from the U.S. Most orders leave within 3 business days. Complimentary U.S. shipping over $50."
  },
  {
    question: "What if I’m not satisfied?",
    answer: "We offer a 30-day satisfaction promise. Reach out and we’ll make it right."
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-container space-y-10">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-gold/70">Questions, answered</p>
        <h2 className="font-serif text-3xl text-parchment">Everything you’d ask before opening a bottle outdoors.</h2>
        <p className="mt-3 text-parchment/70">Details curated from hosts, sommeliers, and our customer care inbox.</p>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.question} className="glass-card rounded-3xl p-5">
              <button
                className="flex w-full items-center justify-between text-left text-parchment"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                id={`faq-control-${index}`}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="font-semibold">{faq.question}</span>
                <svg
                  className={`h-5 w-5 transition ${isOpen ? "rotate-180 text-gold" : "text-parchment/60"}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 10l6 6 6-6" />
                </svg>
              </button>
              <div
                id={`faq-panel-${index}`}
                role="region"
                aria-labelledby={`faq-control-${index}`}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="mt-3 text-sm text-parchment/70">{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
