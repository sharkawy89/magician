import Badge from "./Badge";
import { cn } from "./cn";

const SIZES = {
  sm: "text-base",
  md: "text-price",
  lg: "text-h3",
};

function formatAmount(value) {
  if (typeof value === "string") return value;

  const number = Number(value);

  if (!Number.isFinite(number)) return String(value ?? "");

  return number.toLocaleString("en-US", {
    minimumFractionDigits: number % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function Price({
  price,
  oldPrice,
  discountPercent,
  currency = "$",
  size = "md",
  className = "",
}) {
  const numericPrice = Number(price) || 0;
  let discount = Number(discountPercent) || 0;
  let original = oldPrice;

  if (!original && discount > 0 && discount < 100) {
    original = numericPrice / (1 - discount / 100);
  }

  if (!discount && original && numericPrice > 0) {
    discount = Math.round(
      (1 - numericPrice / Number(original)) * 100,
    );
  }

  const hasDiscount = Boolean(original) && Number(original) > numericPrice;

  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline gap-x-2 gap-y-1",
        className,
      )}
    >
      <span
        className={cn(
          "font-bold leading-none text-ink",
          SIZES[size] ?? SIZES.md,
        )}
      >
        <span className="sr-only">Current price </span>
        {currency} {formatAmount(price)}
      </span>

      {hasDiscount ? (
        <span className="text-sm text-muted line-through">
          <span className="sr-only">Original price </span>
          {currency} {formatAmount(original)}
        </span>
      ) : null}

      {hasDiscount && discount > 0 ? (
        <Badge variant="sale" size="sm">
          -{Math.round(discount)}%
        </Badge>
      ) : null}
    </div>
  );
}

export default Price;
