import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Price } from "../components/ui/Price";
import { useCart } from "../context/CartContext";
import { useProducts } from "../hooks/useProducts";
import { calculateTotals } from "../lib/cartTotals";
import { createCheckoutSession, createDraftOrder } from "../lib/checkout";

const shippingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email required"),
  address: z.string().min(2, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(2, "ZIP is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().optional(),
  saveDefault: z.boolean().optional()
});

type ShippingForm = z.infer<typeof shippingSchema>;

export function Checkout() {
  const { items, clearCart } = useCart();
  const { products, variants } = useProducts();
  const { register, handleSubmit, formState } = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { country: "United States" }
  });

  const cartVariants = variants.filter((variant) =>
    items.some((item) => item.variantId === variant.id)
  );
  const totals = useMemo(() => calculateTotals(items, cartVariants), [items, cartVariants]);

  if (items.length === 0) {
    return (
      <div className="section-container space-y-4">
        <Helmet>
          <title>Checkout | VinoVeil</title>
        </Helmet>
        <p className="text-parchment/70">Your cart is empty.</p>
      </div>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    const order = await createDraftOrder({
      items,
      shippingAddress: values,
      email: values.email,
      products,
      variants
    });
    const session = await createCheckoutSession(order.id);
    clearCart();
    window.location.href = session.url;
  });

  return (
    <div className="section-container space-y-10">
      <Helmet>
        <title>Checkout | VinoVeil</title>
      </Helmet>
      <h1 className="font-serif text-4xl">Checkout</h1>
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input label="Full name" {...register("fullName")} error={formState.errors.fullName?.message} />
          <Input label="Email" {...register("email")} error={formState.errors.email?.message} />
          <Input label="Address" {...register("address")} error={formState.errors.address?.message} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="City" {...register("city")} error={formState.errors.city?.message} />
            <Input label="State" {...register("state")} error={formState.errors.state?.message} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="ZIP" {...register("zip")} error={formState.errors.zip?.message} />
            <Input label="Country" {...register("country")} error={formState.errors.country?.message} />
          </div>
          <Input label="Phone (optional)" {...register("phone")} />
          <label className="flex items-center gap-2 text-sm text-parchment/70">
            <input type="checkbox" className="accent-gold" {...register("saveDefault")} />
            Save as default shipping address
          </label>
          <Button type="submit" loading={formState.isSubmitting}>
            Continue to payment
          </Button>
        </form>
        <div className="rounded-[32px] border border-gold/20 bg-cocoa/80 p-6 text-sm text-parchment/70">
          <h2 className="font-serif text-2xl text-ivory">Order summary</h2>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <Price amountCents={totals.subtotalCents} />
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <Price amountCents={totals.shippingCents} />
            </div>
            <div className="flex items-center justify-between">
              <span>Tax</span>
              <Price amountCents={totals.taxCents} />
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base text-ivory">
              <span>Total</span>
              <Price amountCents={totals.totalCents} />
            </div>
          </div>
          <p className="mt-4 text-xs text-parchment/60">
            Payment placeholder: Stripe integration coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
