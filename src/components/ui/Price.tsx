export interface PriceProps {
  amountCents: number;
  currency?: string;
}

/** Render formatted currency values. */
export function Price({ amountCents, currency = "USD" }: PriceProps) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  });

  return <span>{formatter.format(amountCents / 100)}</span>;
}
