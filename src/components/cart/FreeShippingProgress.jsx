import { cn } from "../ui/cn";
import {
  freeShippingThreshold,
  miniCartCopy,
} from "../../mocks/storefrontMock";
import { formatMoney } from "../../utils/money";

/**
 * Shared by the mini-cart and the cart page so the threshold, copy and visual
 * treatment stay identical in both places.
 */
function FreeShippingProgress({ subtotal, className = "" }) {
  const safeSubtotal = Math.max(0, Number(subtotal) || 0);
  const remaining = Math.max(0, freeShippingThreshold - safeSubtotal);
  const progress =
    freeShippingThreshold > 0
      ? Math.min(
          100,
          Math.round((safeSubtotal / freeShippingThreshold) * 100),
        )
      : 100;

  const message =
    remaining > 0
      ? miniCartCopy.freeShippingRemaining.replace(
          "{amount}",
          formatMoney(remaining),
        )
      : miniCartCopy.freeShippingUnlocked;

  return (
    <div className={cn(className)}>
      <p className="mb-1.5 text-xs font-medium text-ink">{message}</p>
      <div
        role="progressbar"
        aria-label={miniCartCopy.freeShippingProgressLabel}
        aria-valuemin={0}
        aria-valuemax={freeShippingThreshold}
        aria-valuenow={Math.min(safeSubtotal, freeShippingThreshold)}
        aria-valuetext={message}
        className="h-2 overflow-hidden rounded-pill bg-surface-subtle"
      >
        <div
          className="h-full rounded-pill bg-brand transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default FreeShippingProgress;
