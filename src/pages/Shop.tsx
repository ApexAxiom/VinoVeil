import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CommerceCta } from "../components/commerce/CommerceCta";
import { Card } from "../components/ui/Card";
import { Price } from "../components/ui/Price";
import { Skeleton } from "../components/ui/Skeleton";
import { useProducts } from "../hooks/useProducts";
import { absoluteUrl } from "../lib/seo";

export function Shop() {
  const { products, variants, loading } = useProducts();
  const canonical = absoluteUrl("/shop");

  return (
    <div className="section-container space-y-10 pb-8">
      <Helmet>
        <title>Catalog | VinoVeil</title>
        <meta
          name="description"
          content="Browse VinoVeil bundles on the brand catalog. Primary checkout can be connected to Shopify from site settings."
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content="Catalog | VinoVeil" />
        <meta
          property="og:description"
          content="Browse VinoVeil bundles. Shopify checkout can be enabled via environment configuration."
        />
        <meta property="og:url" content={canonical} />
      </Helmet>

      <div className="rounded-[28px] border border-gold/20 bg-cocoa/50 p-8 sm:flex sm:items-center sm:justify-between sm:gap-8">
        <div className="max-w-xl space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-gold/75">Shopify-ready checkout</p>
          <h2 className="font-serif text-2xl text-ivory sm:text-3xl">Prefer to buy directly?</h2>
          <p className="text-sm leading-relaxed text-parchment/75">
            When your Shopify URLs are configured, this button opens your live product or checkout
            flow. Otherwise it switches to the waitlist path—no broken links.
          </p>
        </div>
        <div className="mt-6 shrink-0 sm:mt-0">
          <CommerceCta size="lg" />
        </div>
      </div>

      <div>
        <h1 className="font-serif text-4xl text-ivory">Catalog</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-parchment/75">
          Preview bundles here. For the full brand story, specifications, and FAQ, visit the{" "}
          <Link to="/vino-veil" className="text-gold underline-offset-4 hover:underline">
            VinoVeil product page
          </Link>
          .
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {loading
          ? Array.from({ length: 2 }).map((_, index) => (
              <Card key={index} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            ))
          : products.map((product) => {
              const productVariants = variants.filter((variant) => variant.productId === product.id);
              const prices = productVariants.map((variant) => variant.priceCents);
              const minPrice = prices.length ? Math.min(...prices) : 0;
              const maxPrice = prices.length ? Math.max(...prices) : 0;

              return (
                <Card key={product.id} className="flex flex-col gap-5">
                  <img
                    src={product.primaryImage}
                    alt={product.name}
                    className="h-56 w-full rounded-3xl object-cover"
                  />
                  <div className="space-y-3">
                    <h2 className="font-serif text-2xl text-ivory">{product.name}</h2>
                    <p className="text-sm text-parchment/70">{product.shortDescription}</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-parchment/70">
                      {minPrice === maxPrice ? (
                        <Price amountCents={minPrice} />
                      ) : (
                        <>
                          <Price amountCents={minPrice} /> – <Price amountCents={maxPrice} />
                        </>
                      )}
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <CommerceCta size="sm" />
                      <Link to={`/product/${product.slug}`} className="text-sm text-gold">
                        View details →
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
      </div>
    </div>
  );
}
