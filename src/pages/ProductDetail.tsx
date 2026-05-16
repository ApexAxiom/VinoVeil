import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CommerceCta } from "../components/commerce/CommerceCta";
import { Button, buttonSurfaceClassName } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Price } from "../components/ui/Price";
import { QuantityStepper } from "../components/ui/QuantityStepper";
import { isShopifyPurchaseConfigured } from "../config/commerce";
import { useCart } from "../context/CartContext";
import { useProducts } from "../hooks/useProducts";
import { absoluteUrl } from "../lib/seo";

export function ProductDetail() {
  const { slug } = useParams();
  const { products, variants } = useProducts();
  const { addItem } = useCart();
  const product = useMemo(() => products.find((item) => item.slug === slug), [products, slug]);
  const productVariants = useMemo(
    () => variants.filter((variant) => variant.productId === product?.id),
    [variants, product?.id]
  );
  const [activeVariantId, setActiveVariantId] = useState(productVariants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);

  const activeVariant = productVariants.find((variant) => variant.id === activeVariantId);

  useEffect(() => {
    if (!activeVariantId && productVariants.length > 0) {
      setActiveVariantId(productVariants[0].id);
    }
  }, [activeVariantId, productVariants]);

  if (!product) {
    return (
      <div className="section-container">
        <p className="text-parchment/70">Product not found.</p>
        <Link to="/shop" className="text-gold">
          Back to catalog
        </Link>
      </div>
    );
  }

  const canonical = absoluteUrl(`/product/${product.slug}`);
  const ogImage = absoluteUrl(product.primaryImage);
  const shopifyLine = isShopifyPurchaseConfigured()
    ? "Prefer Shopify? Use the button below—checkout opens in a new tab."
    : "Online ordering through Shopify is not wired up yet. Join the waitlist or use the catalog flow if available.";

  return (
    <div className="section-container space-y-10 pb-12">
      <Helmet>
        <title>{product.name} | VinoVeil</title>
        <meta name="description" content={product.shortDescription} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${product.name} | VinoVeil`} />
        <meta property="og:description" content={product.shortDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta
          property="og:image:alt"
          content={`${product.name} — VinoVeil glass cover photography`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} | VinoVeil`} />
        <meta name="twitter:description" content={product.shortDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4">
          <img
            src={product.primaryImage}
            alt={`${product.name} — primary product photo`}
            className="h-[420px] w-full rounded-[32px] object-cover"
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {product.galleryImages.map((image, index) => (
              <img
                key={image}
                src={image}
                alt={`${product.name} — gallery image ${index + 1}`}
                className="rounded-3xl"
              />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="font-serif text-4xl">{product.name}</h1>
          <p className="text-sm leading-relaxed text-parchment/75">{product.description}</p>

          <Card padding="md" className="border-gold/20 bg-cocoa/50">
            <p className="text-xs uppercase tracking-[0.2em] text-gold/70">Checkout</p>
            <p className="mt-2 text-sm leading-relaxed text-parchment/75">{shopifyLine}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <CommerceCta />
              <Link
                to="/vino-veil"
                className={buttonSurfaceClassName({ variant: "secondary", size: "md" })}
              >
                Full product page
              </Link>
            </div>
          </Card>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-gold/70">Choose a set size</p>
            <div className="grid gap-3">
              {productVariants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setActiveVariantId(variant.id)}
                  className={`flex items-center justify-between rounded-3xl border px-4 py-3 text-sm transition ${
                    variant.id === activeVariantId
                      ? "border-gold bg-gold/10"
                      : "border-white/10 hover:border-gold/50"
                  }`}
                >
                  <span>{variant.title}</span>
                  <Price amountCents={variant.priceCents} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <QuantityStepper value={quantity} onChange={setQuantity} />
            <Button
              onClick={() => {
                if (!activeVariant) return;
                addItem(activeVariant.id, quantity);
              }}
            >
              Add to cart
            </Button>
          </div>
          <Card padding="md">
            <h2 className="font-serif text-2xl text-gold">Why you will love it</h2>
            <ul className="mt-4 space-y-2 text-sm text-parchment/75">
              {product.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
