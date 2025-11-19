import { useState } from "react";

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    className={`h-5 w-5 transition ${open ? "rotate-180 text-gold" : "text-parchment/60"}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 10l6 6 6-6" />
  </svg>
);

const faqs = [
  {
    question: "Does VinoVeil fit my glasses?",
    answer: "Yes. The weighted trim drapes over most standard stemmed glasses and even coupe-style stems."
  },
  {
    question: "Can I use it for cocktails or beer?",
    answer: "Absolutely. It works with any glassware that has a rim for the mesh to rest on."
  },
  {
    question: "Is the mesh food safe?",
    answer: "Yes. We source food-safe, BPA-free mesh and trims."
  },
  {
    question: "Is it dishwasher safe?",
    answer: "Top rack only. Allow the covers to air dry before stacking."
  },
  {
    question: "Will it blow off in the wind?",
    answer: "The trim provides just enough weight to stay put in a breeze without feeling heavy."
  },
  {
    question: "Do you ship internationally?",
    answer: "We currently ship within North America with more regions coming soon."
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-container space-y-10">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-gold/70">Need to know</p>
        <h2 className="font-serif text-3xl text-parchment">FAQ</h2>
        <p className="mt-3 text-parchment/70">Details curated from our customer care inbox.</p>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.question} className="glass-card rounded-3xl p-5">
              <button
                className="flex w-full items-center justify-between text-left text-parchment"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="font-semibold">{faq.question}</span>
                <Chevron open={isOpen} />
              </button>
              {isOpen && <p className="mt-3 text-sm text-parchment/70">{faq.answer}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
};
