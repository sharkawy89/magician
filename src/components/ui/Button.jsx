import { cn } from "./cn";

const VARIANTS = {
  primary:
    "border border-transparent bg-brand text-ink hover:bg-brand-hover active:bg-brand-hover",
  secondary:
    "border border-transparent bg-ink text-white hover:bg-ink-secondary active:bg-ink-secondary",
  outline:
    "border border-border-strong bg-surface text-ink hover:border-ink hover:bg-surface-subtle",
  ghost:
    "border border-transparent bg-transparent text-ink hover:bg-surface-subtle",
  link: "border border-transparent bg-transparent text-info underline-offset-4 hover:underline",
};

const SIZES = {
  sm: "h-10 px-4 text-sm sm:h-9",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

const LINK_SIZES = {
  sm: "min-h-10 text-sm",
  md: "min-h-11 text-sm",
  lg: "min-h-12 text-base",
};

const ICON_SIZES = {
  sm: "h-10 w-10 sm:h-9 sm:w-9",
  md: "h-11 w-11",
  lg: "h-12 w-12",
};

function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  iconOnly = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  className = "",
  children,
  type = "button",
  "aria-label": ariaLabel,
  ...props
}) {
  const isNativeButton = Component === "button";
  const isDisabled = disabled || (isNativeButton && loading);

  if (import.meta.env.DEV && iconOnly && !ariaLabel) {
    console.warn("Button: icon-only buttons require an aria-label.");
  }

  return (
    <Component
      {...props}
      type={isNativeButton ? type : undefined}
      disabled={isNativeButton ? isDisabled : undefined}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-pill font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        fullWidth && "w-full",
        iconOnly
          ? ICON_SIZES[size] ?? ICON_SIZES.md
          : variant === "link"
            ? LINK_SIZES[size] ?? LINK_SIZES.md
            : SIZES[size] ?? SIZES.md,
        VARIANTS[variant] ?? VARIANTS.primary,
        className,
      )}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-e-transparent motion-reduce:animate-none"
        />
      ) : (
        leftIcon
      )}
      {iconOnly && loading ? null : children}
      {!loading && rightIcon}
    </Component>
  );
}

export default Button;
