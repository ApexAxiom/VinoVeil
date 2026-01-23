import { FormEvent, useEffect, useRef, useState, type MouseEvent } from "react";
import { useCart } from "../context/CartContext";
import { useProducts } from "../hooks/useProducts";
import { calculateTotals } from "../lib/cartTotals";

const focusSelectors = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';

type CheckoutPreviewProps = {
  open: boolean;
  onClose: () => void;
};

type FormState = {
  email: string;
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateRegion: string;
  postalCode: string;
  country: string;
  notes: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialFormState: FormState = {
  email: "",
  fullName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  stateRegion: "",
  postalCode: "",
  country: "",
  notes: ""
};

export const CheckoutPreview = ({ open, onClose }: CheckoutPreviewProps) => {
  const { items, clearCart } = useCart();
  const { products, variants } = useProducts();
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const dialogRef = useRef<HTMLDivElement>(null);

  const { subtotalCents } = calculateTotals(items, variants, 0, 0);
  const subtotal = subtotalCents / 100;
  const estimatedTotal = subtotal;

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = dialog.querySelectorAll<HTMLElement>(focusSelectors);
    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }

      if (event.key === "Tab") {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setErrors({});
      setStatus("idle");
      setForm(initialFormState);
    }
  }, [open]);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    if (!form.fullName) newErrors.fullName = "Full name is required";
    if (!form.addressLine1) newErrors.addressLine1 = "Address is required";
    if (!form.city) newErrors.city = "City is required";
    if (!form.postalCode) newErrors.postalCode = "Postal code is required";
    if (!form.country) newErrors.country = "Country is required";
    return newErrors;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const order = {
      id: `VV-${Date.now()}`,
      createdAt: new Date().toISOString(),
      totals: {
        subtotal,
        estimatedTotal
      },
      items: items.map((item) => {
        const variant = variants.find((entry) => entry.id === item.variantId);
        const product = products.find((entry) => entry.id === variant?.productId);
        const unitPrice = variant ? variant.priceCents / 100 : 0;
        return {
          id: item.variantId,
          name: product?.name ?? "VinoVeil Glass Cover",
          quantity: item.quantity,
          unitPrice,
          lineTotal: item.quantity * unitPrice
        };
      }),
      customer: {
        email: form.email,
        fullName: form.fullName,
        address: {
          line1: form.addressLine1,
          line2: form.addressLine2,
          city: form.city,
          stateRegion: form.stateRegion,
          postalCode: form.postalCode,
          country: form.country
        },
        notes: form.notes
      }
    };

    // eslint-disable-next-line no-console
    console.log("VinoVeil test order (no payment processed)", order);

    clearCart();
    setStatus("success");
  };

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBackToShop = () => {
    onClose();
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Checkout preview"
          className="glass-card relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-[32px] border border-gold/30 bg-night/90 p-8 shadow-2xl shadow-black/60"
        >
          <button
            onClick={onClose}
            aria-label="Close checkout preview"
            className="absolute right-4 top-4 rounded-full border border-gold/30 p-2 text-parchment transition hover:border-gold hover:text-gold"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M6 18 18 6" strokeLinecap="round" />
            </svg>
          </button>

          {status === "success" ? (
            <div className="flex flex-col items-center gap-4 text-center text-parchment">
              <p className="text-xs uppercase tracking-[0.35em] text-gold/70">Order preview</p>
              <h2 className="font-serif text-3xl text-gold">Order preview complete</h2>
              <p className="max-w-2xl text-parchment/80">
                This is a test checkout. Payments are not yet enabled. We’ll notify you when full checkout is live.
              </p>
              <button className="button-primary" onClick={handleBackToShop}>
                Back to shop
              </button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.35em] text-gold/70">Your order</p>
                <h2 className="font-serif text-3xl text-parchment">Checkout preview</h2>
                <div className="rounded-3xl border border-gold/20 bg-night/60 p-4 shadow-inner shadow-black/30">
                  {items.length === 0 ? (
                    <p className="text-parchment/70">Your cart is empty.</p>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => {
                        const variant = variants.find((entry) => entry.id === item.variantId);
                        const product = products.find((entry) => entry.id === variant?.productId);
                        const unitPrice = variant ? variant.priceCents / 100 : 0;
                        const productName = product?.name ?? "VinoVeil Glass Cover";
                        const variantTitle = variant?.title ? ` · ${variant.title}` : "";

                        return (
                          <div key={item.variantId} className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-parchment">
                                {productName}
                                <span className="text-parchment/60">{variantTitle}</span>
                              </p>
                              <p className="text-sm text-parchment/60">Qty {item.quantity}</p>
                            </div>
                            <p className="text-parchment">${(item.quantity * unitPrice).toFixed(2)}</p>
                          </div>
                        );
                      })}
                      <div className="border-t border-gold/20 pt-4 text-parchment">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-parchment/70">
                          <span>Shipping & tax</span>
                          <span>Calculated later</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold text-gold">
                          <span>Estimated total</span>
                          <span>${estimatedTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm text-parchment/80">
                    Email*
                    <input
                      className="input-base bg-night/60"
                      type="email"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      required
                    />
                    {errors.email && <span className="text-xs text-amber">{errors.email}</span>}
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-parchment/80">
                    Full name*
                    <input
                      className="input-base bg-night/60"
                      type="text"
                      value={form.fullName}
                      onChange={(event) => updateField("fullName", event.target.value)}
                      required
                    />
                    {errors.fullName && <span className="text-xs text-amber">{errors.fullName}</span>}
                  </label>
                </div>

                <label className="flex flex-col gap-2 text-sm text-parchment/80">
                  Address line 1*
                  <input
                    className="input-base bg-night/60"
                    type="text"
                    value={form.addressLine1}
                    onChange={(event) => updateField("addressLine1", event.target.value)}
                    required
                  />
                  {errors.addressLine1 && <span className="text-xs text-amber">{errors.addressLine1}</span>}
                </label>

                <label className="flex flex-col gap-2 text-sm text-parchment/80">
                  Address line 2
                  <input
                    className="input-base bg-night/60"
                    type="text"
                    value={form.addressLine2}
                    onChange={(event) => updateField("addressLine2", event.target.value)}
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm text-parchment/80">
                    City*
                    <input
                      className="input-base bg-night/60"
                      type="text"
                      value={form.city}
                      onChange={(event) => updateField("city", event.target.value)}
                      required
                    />
                    {errors.city && <span className="text-xs text-amber">{errors.city}</span>}
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-parchment/80">
                    State / Region
                    <input
                      className="input-base bg-night/60"
                      type="text"
                      value={form.stateRegion}
                      onChange={(event) => updateField("stateRegion", event.target.value)}
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm text-parchment/80">
                    Postal code*
                    <input
                      className="input-base bg-night/60"
                      type="text"
                      value={form.postalCode}
                      onChange={(event) => updateField("postalCode", event.target.value)}
                      required
                    />
                    {errors.postalCode && <span className="text-xs text-amber">{errors.postalCode}</span>}
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-parchment/80">
                    Country*
                    <input
                      className="input-base bg-night/60"
                      type="text"
                      value={form.country}
                      onChange={(event) => updateField("country", event.target.value)}
                      required
                    />
                    {errors.country && <span className="text-xs text-amber">{errors.country}</span>}
                  </label>
                </div>

                <label className="flex flex-col gap-2 text-sm text-parchment/80">
                  Delivery notes (optional)
                  <textarea
                    className="input-base min-h-[96px] bg-night/60"
                    value={form.notes}
                    onChange={(event) => updateField("notes", event.target.value)}
                  />
                </label>

                <p className="text-xs uppercase tracking-[0.3em] text-parchment/50">
                  Checkout preview · Secure Stripe checkout coming soon
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <button type="button" className="button-secondary" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="button-primary">
                    Place test order
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
