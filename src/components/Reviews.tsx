type Review = {
  name: string;
  rating: number;
  text: string;
};

const Star = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="h-5 w-5 text-gold"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.8 6.1 20.5l1.2-6.5-4.8-4.6 6.6-.9z" />
  </svg>
);

const reviews: Review[] = [
  {
    name: "Lena M.",
    rating: 5,
    text: "We hosted a patio tasting and every guest asked where I found these covers. Zero bugs, all compliments."
  },
  {
    name: "Carlos R.",
    rating: 4,
    text: "No more balancing napkins over glasses. VinoVeil looks polished and keeps my rosé clear on breezy evenings."
  },
  {
    name: "Priya K.",
    rating: 5,
    text: "The mesh is delicate but sturdy, and the gold detail feels luxe. Perfect for our poolside happy hours."
  }
];

export const Reviews = () => {
  return (
    <section id="reviews" className="bg-gradient-to-b from-black/40 via-cocoa/40 to-black/70">
      <div className="section-container relative">
        <div className="absolute inset-x-0 -top-20 flex justify-center text-[12rem] text-gold/5">&ldquo;</div>
        <div className="relative space-y-6 text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-gold/70">Social proof</p>
          <h2 className="font-serif text-3xl text-parchment">Loved by outdoor wine lovers</h2>
          <p className="mx-auto max-w-3xl text-parchment/70">
            Hosts, sommeliers, and patio regulars swear by the calm VinoVeil brings to every glass.
          </p>
          <div className="grid gap-6 text-left md:grid-cols-3">
            {reviews.map((review) => (
              <div key={review.name} className="glass-card rounded-3xl p-6">
                <div className="flex items-center space-x-2">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} />
                  ))}
                </div>
                <p className="mt-4 text-sm text-parchment/80">{review.text}</p>
                <p className="mt-4 font-semibold text-parchment">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
