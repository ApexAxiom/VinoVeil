type Review = {
  name: string;
  rating: number;
  text: string;
  detail: string;
};

const Star = () => (
  <svg aria-hidden="true" focusable="false" className="h-5 w-5 text-gold" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.8 6.1 20.5l1.2-6.5-4.8-4.6 6.6-.9z" />
  </svg>
);

const reviews: Review[] = [
  {
    name: "Lena M.",
    rating: 5,
    text: "Zero buzz, zero bugs. The halo feels like jewelry for the glass.",
    detail: "Hosted a patio tasting and every guest asked where to buy."
  },
  {
    name: "Carlos R.",
    rating: 5,
    text: "Napkins over glasses are gone. VinoVeil looks polished and works in the breeze.",
    detail: "Rosé on the terrace stayed clear all evening."
  },
  {
    name: "Priya K.",
    rating: 5,
    text: "Delicate mesh, sturdy halo. Luxe enough for the pool cabana.",
    detail: "Pairs beautifully with our coupe collection."
  },
  {
    name: "Sommelier Circle",
    rating: 5,
    text: "Aroma stays open while the glass stays pristine—ideal for flights outdoors.",
    detail: "4.9 / 5 from hosts, sommeliers, and patio regulars."
  }
];

export const Reviews = () => {
  return (
    <section id="reviews" className="bg-gradient-to-b from-black/40 via-cocoa/40 to-black/90">
      <div className="section-container relative">
        <div className="absolute inset-x-0 -top-20 flex justify-center text-[12rem] text-gold/5" aria-hidden="true">
          &ldquo;
        </div>
        <div className="relative space-y-6 text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-gold/70">Voices from the patio</p>
          <h2 className="font-serif text-3xl text-parchment">Editorial praise & calm hosts.</h2>
          <p className="mx-auto max-w-3xl text-parchment/70">
            4.9 / 5 · Hosts, sommeliers, and patio regulars share how VinoVeil keeps every pour serene.
          </p>
          <div className="grid gap-6 text-left md:grid-cols-2">
            {reviews.map((review) => (
              <article key={review.name} className="glass-card rounded-3xl p-6" aria-label={`Review from ${review.name}`}>
                <div className="flex items-center gap-2" aria-hidden="true">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} />
                  ))}
                </div>
                <span className="sr-only">{review.rating} out of 5 stars</span>
                <p className="mt-4 text-sm text-parchment/80">{review.text}</p>
                <p className="mt-2 text-sm text-parchment/60">{review.detail}</p>
                <p className="mt-4 font-semibold text-parchment">{review.name}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
