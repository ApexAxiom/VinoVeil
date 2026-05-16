import { Link } from "react-router-dom";
import { Button, buttonSurfaceClassName } from "../ui/Button";
import {
  isShopifyPurchaseConfigured,
  resolveShopifyPrimaryPurchaseUrl,
  resolveWaitlistHref
} from "../../config/commerce";

type CommerceCtaMode = "purchase" | "waitlist" | "auto";

type CommerceCtaProps = {
  mode?: CommerceCtaMode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Overrides default label for the active mode */
  label?: string;
};

const defaultPurchaseLabel = "Shop VinoVeil";
const defaultWaitlistLabel = "Join the waitlist";

/**
 * Site-wide commerce CTA: links to Shopify when configured, otherwise waitlist (mailto or contact).
 */
export function CommerceCta({
  mode = "auto",
  variant = "primary",
  size = "md",
  className,
  label
}: CommerceCtaProps) {
  const shopifyReady = isShopifyPurchaseConfigured();
  const purchaseUrl = resolveShopifyPrimaryPurchaseUrl();
  const waitlistHref = resolveWaitlistHref();
  const isExternalWaitlist = waitlistHref.startsWith("mailto:");

  const effectiveMode: "purchase" | "waitlist" =
    mode === "auto" ? (shopifyReady && purchaseUrl ? "purchase" : "waitlist") : mode;

  if (effectiveMode === "purchase" && purchaseUrl) {
    const text = label ?? defaultPurchaseLabel;
    return (
      <Button
        href={purchaseUrl}
        target="_blank"
        rel="noopener noreferrer"
        variant={variant}
        size={size}
        className={className}
      >
        {text}
      </Button>
    );
  }

  const text = label ?? defaultWaitlistLabel;

  if (isExternalWaitlist) {
    return (
      <Button href={waitlistHref} variant={variant} size={size} className={className}>
        {text}
      </Button>
    );
  }

  return (
    <Link to={waitlistHref} className={buttonSurfaceClassName({ variant, size, className })}>
      {text}
    </Link>
  );
}
