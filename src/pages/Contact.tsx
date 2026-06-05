import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { CommerceCta } from "../components/commerce/CommerceCta";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { WAITLIST_EMAIL } from "../config/commerce";
import { useToast } from "../context/ToastContext";
import { sendContactMessage } from "../lib/contact";
import { absoluteUrl } from "../lib/seo";

const schema = z.object({
  name: z.string().trim().min(1, "Name required"),
  email: z.string().trim().email("Valid email required"),
  message: z.string().trim().min(1, "Message required")
});

type FormValues = z.infer<typeof schema>;

const contactFailureMessage =
  "We couldn't send your message just now. Please try again in a minute.";

export function Contact() {
  const { notify } = useToast();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState, reset } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setError(null);
      await sendContactMessage(values);
      notify({
        title: "Message sent",
        description: "Thanks for reaching out. We'll be in touch soon.",
        tone: "success"
      });
      reset();
    } catch (err) {
      console.error("Contact form submission failed", err);
      setError(contactFailureMessage);
      notify({
        title: "Message not sent",
        description: contactFailureMessage,
        tone: "error"
      });
    }
  });

  const canonical = absoluteUrl("/contact");

  return (
    <div className="section-container max-w-2xl space-y-12 pb-12">
      <Helmet>
        <title>Contact | VinoVeil</title>
        <meta
          name="description"
          content="Contact VinoVeil for gifting questions, waitlist notes, and concierge support."
        />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <section id="waitlist" className="scroll-mt-28 space-y-4 rounded-[28px] border border-gold/20 bg-cocoa/50 p-8">
        <h2 className="font-serif text-2xl text-ivory">Waitlist &amp; launch updates</h2>
        <p className="text-sm leading-relaxed text-parchment/75">
          There is no separate automated waitlist database on this static site. Use the button below
          {WAITLIST_EMAIL ? " to open your email client" : " to reach the contact form"}—or send a
          message in the form and mention you would like to be notified when Shopify ordering is live.
        </p>
        <CommerceCta mode="waitlist" />
      </section>

      <div>
        <h1 className="font-serif text-4xl">Contact concierge</h1>
        <p className="mt-3 text-sm leading-relaxed text-parchment/75">
          Reach us for gifting, table quantities, or care questions. Send a note and our concierge
          team will follow up soon.
        </p>
        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <Input label="Name" {...register("name")} error={formState.errors.name?.message} />
          <Input label="Email" {...register("email")} error={formState.errors.email?.message} />
          <Textarea
            label="Message"
            {...register("message")}
            error={formState.errors.message?.message}
          />
          {error ? (
            <p className="text-sm text-red-300" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" loading={formState.isSubmitting}>
            Send message
          </Button>
        </form>
      </div>
    </div>
  );
}
