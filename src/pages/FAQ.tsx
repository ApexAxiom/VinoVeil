import { Helmet } from "react-helmet-async";
import { Card } from "../components/ui/Card";
import { absoluteUrl } from "../lib/seo";

const faqItems = [
  {
    question: "Will VinoVeil fit my wine glasses?",
    answer: "Yes. The elastic edge fits most standard wine and coupe glasses."
  },
  {
    question: "Is the mesh washable?",
    answer: "Hand wash with mild soap and air dry between uses."
  },
  {
    question: "Does it affect wine aroma?",
    answer: "The breathable mesh allows aromas to remain while keeping insects out."
  }
];

export function FAQ() {
  const canonical = absoluteUrl("/faq");

  return (
    <div className="section-container space-y-8">
      <Helmet>
        <title>FAQ | VinoVeil</title>
        <meta
          name="description"
          content="Answers about fit, cleaning, and using VinoVeil mesh wine glass covers outdoors."
        />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <h1 className="font-serif text-4xl">Frequently asked</h1>
      <div className="space-y-4">
        {faqItems.map((item) => (
          <Card key={item.question} padding="lg" className="space-y-2">
            <h2 className="font-serif text-2xl text-gold">{item.question}</h2>
            <p className="text-sm text-parchment/70">{item.answer}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
