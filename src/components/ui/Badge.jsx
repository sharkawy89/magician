import { cn } from "./cn";

const VARIANTS = {
  sale: "bg-danger text-white",
  new: "bg-info text-white",
  bestseller: "bg-warning text-ink",
  freeShipping: "bg-success text-white",
  neutral: "border border-border bg-surface-subtle text-ink-secondary",
  brand: "bg-brand text-ink",
  ink: "bg-ink text-white",
};

const SIZES = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-[11px]",
};

function Badge({
  variant = "neutral",
  size = "md",
  className = "",
  children,
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill font-bold uppercase leading-none tracking-wide",
        VARIANTS[variant] ?? VARIANTS.neutral,
        SIZES[size] ?? SIZES.md,
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
