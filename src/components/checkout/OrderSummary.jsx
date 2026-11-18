import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { cn } from "../ui/cn";
import FreeShippingProgress from "../cart/FreeShippingProgress";
import { formatMoney } from "../../utils/money";

function OrderSummary({
  subtotal,
  shipping,
  discount,
  total,
  taxValue,
  freeShippingMsg,
  promo,
  expanded,
  onToggle,
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls="checkout-order-summary"
        className="flex min-h-10 w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent p-0 text-left lg:hidden"
      >
        <span className="text-sm font-semibold text-ink">
          Order total — {formatMoney(total)}
        </span>
        {expanded ? (
          <FiChevronUp aria-hidden="true" className="shrink-0 text-info" />
        ) : (
          <FiChevronDown aria-hidden="true" className="shrink-0 text-info" />
        )}
      </button>

      <h2 className="hidden text-h5 font-bold text-ink lg:block">
        Order summary
      </h2>

      <div
        id="checkout-order-summary"
        className={cn("mt-4 lg:mt-4 lg:block", expanded ? "block" : "hidden")}
      >
        <FreeShippingProgress subtotal={subtotal} />
        <p className="mt-1.5 text-xs text-ink-secondary">{freeShippingMsg}</p>

        <dl className="mt-4 space-y-3 border-t border-border pt-4 text-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <dt className="text-ink-secondary">Subtotal</dt>
            <dd className="font-semibold tabular-nums text-ink">
              {formatMoney(subtotal)}
            </dd>
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <dt className="text-ink-secondary">Shipping</dt>
            <dd
              className={
                shipping === 0
                  ? "font-semibold text-success"
                  : "font-semibold tabular-nums text-ink"
              }
            >
              {shipping === 0 ? "Free" : formatMoney(shipping)}
            </dd>
          </div>

          {discount > 0 ? (
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <dt className="font-semibold text-success">
                Promo ({promo.appliedCode})
              </dt>
              <dd className="font-semibold tabular-nums text-success">
                −{formatMoney(discount)}
              </dd>
            </div>
          ) : null}

          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <dt className="text-ink-secondary">Estimated tax</dt>
            <dd className="min-w-0 break-words text-end text-xs text-ink-secondary">{taxValue}</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-border pt-4">
          <span className="text-base font-bold text-ink">Order total</span>
          <span
            aria-live="polite"
            className="text-h4 font-bold tabular-nums text-ink"
          >
            {formatMoney(total)}
          </span>
        </div>
        <p className="mt-1 text-xs text-ink-secondary">
          Tax is calculated at checkout.
        </p>
      </div>
    </div>
  );
}

export default OrderSummary;