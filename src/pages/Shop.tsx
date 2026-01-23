import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card } from "../components/ui/Card";
import { Price } from "../components/ui/Price";
import { Skeleton } from "../components/ui/Skeleton";
import { useProducts } from "../hooks/useProducts";

export function Shop() {
  const { products, variants, loading } = useProducts();

  return (
    <div className="section-container space-y-8">
      <Helmet>
        <title>Shop VinoVeil | Premium Glass Covers</title>
        <meta name="description" content="Shop VinoVeil bundles and elevate your outdoor pours." />
      </Helmet>
      <div>
        <h1 className="font-serif text-4xl">Shop VinoVeil</h1>
        <p className="mt-3 text-sm text-parchment/70">
          Explore curated bundles designed for intimate dinners or full celebrations.
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
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-parchment/70">
                      {minPrice === maxPrice ? (
                        <Price amountCents={minPrice} />
                      ) : (
                        <>
                          <Price amountCents={minPrice} /> - <Price amountCents={maxPrice} />
                        </>
                      )}
                    </p>
                    <Link to={`/product/${product.slug}`} className="text-sm text-gold">
                      View details →
                    </Link>
                  </div>
                </Card>
              );
            })}
      </div>
    </div>
  );
}
