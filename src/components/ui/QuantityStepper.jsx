import { FiMinus, FiPlus } from "react-icons/fi";
import { cn } from "./cn";

const SIZES = {
  sm: {
    container: "h-10",
    button: "h-10 w-10",
    value: "min-w-8 text-sm",
  },
  md: {
    container: "h-10 sm:h-11",
    button: "h-10 w-10 sm:h-11 sm:w-11",
    value: "min-w-10 text-base",
  },
};

function QuantityStepper({
  value,
  min = 1,
  max = Infinity,
  onChange,
  onDecrease,
  onIncrease,
  label,
  size = "md",
  className = "",
}) {
  const numeric = Number(value) || min;
  const decreaseDisabled = numeric <= min;
  const increaseDisabled = Number.isFinite(max) && numeric >= max;
  const sizeClasses = SIZES[size] ?? SIZES.md;

  const step = (next) => {
    if (next < min || (Number.isFinite(max) && next > max)) return;

    if (typeof onChange === "function") {
      onChange(next);
    }

    if (next > numeric) {
      onIncrease?.();
    } else if (next < numeric) {
      onDecrease?.();
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-border-strong bg-surface",
        sizeClasses.container,
        className,
      )}
    >
      <button
        type="button"
        className={cn(
          "flex shrink-0 cursor-pointer items-center justify-center text-ink transition-colors duration-150 first:rounded-s-lg last:rounded-e-lg hover:bg-surface-subtle disabled:cursor-not-allowed disabled:text-muted",
          sizeClasses.button,
        )}
        onClick={() => step(numeric - 1)}
        disabled={decreaseDisabled}
        aria-label={
          label ? `Decrease quantity of ${label}` : "Decrease quantity"
        }
      >
        <FiMinus aria-hidden="true" className="text-[16px]" />
      </button>

      <span
        aria-live="polite"
        aria-label={label ? `Quantity of ${label}` : "Quantity"}
        className={cn(
          "flex h-full items-center justify-center border-x border-border font-semibold tabular-nums text-ink",
          sizeClasses.value,
        )}
      >
        {numeric}
      </span>

      <button
        type="button"
        className={cn(
          "flex shrink-0 cursor-pointer items-center justify-center text-ink transition-colors duration-150 first:rounded-s-lg last:rounded-e-lg hover:bg-surface-subtle disabled:cursor-not-allowed disabled:text-muted",
          sizeClasses.button,
        )}
        onClick={() => step(numeric + 1)}
        disabled={increaseDisabled}
        aria-label={
          label ? `Increase quantity of ${label}` : "Increase quantity"
        }
      >
        <FiPlus aria-hidden="true" className="text-[16px]" />
      </button>
    </div>
  );
}

export default QuantityStepper;
