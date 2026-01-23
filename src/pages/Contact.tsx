import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { useToast } from "../context/ToastContext";
import { dataClient, publicDataOptions } from "../lib/dataClient";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  message: z.string().min(10, "Message required")
});

type FormValues = z.infer<typeof schema>;

export function Contact() {
  const { notify } = useToast();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState, reset } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setError(null);
      const mutations = dataClient.mutations as unknown as {
        createContactMessage: (input: Record<string, unknown>, options: typeof publicDataOptions) =>
          | Promise<{ data: unknown }>
          | { data: unknown };
      };
      await mutations.createContactMessage(values, publicDataOptions);
      notify({ title: "Message received", description: "We will reply within one business day." });
      reset();
    } catch (err) {
      setError((err as Error).message);
    }
  });

  return (
    <div className="section-container max-w-2xl space-y-6">
      <Helmet>
        <title>Contact | VinoVeil</title>
      </Helmet>
      <h1 className="font-serif text-4xl">Contact concierge</h1>
      <p className="text-sm text-parchment/70">
        Reach us for custom orders, gifting, or product care.
      </p>
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input label="Name" {...register("name")} error={formState.errors.name?.message} />
        <Input label="Email" {...register("email")} error={formState.errors.email?.message} />
        <Textarea
          label="Message"
          {...register("message")}
          error={formState.errors.message?.message}
        />
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <Button type="submit" loading={formState.isSubmitting}>
          Send message
        </Button>
      </form>
    </div>
  );
}
