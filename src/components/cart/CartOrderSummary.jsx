import { useState } from "react";
import { FiCheckCircle, FiLock, FiRefreshCw, FiShield } from "react-icons/fi";
import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { notify } from "../ui/toast";
import FreeShippingProgress from "./FreeShippingProgress";
import {
  cartContent,
  promoCode,
  promoDiscountPercent,
} from "../../mocks/storefrontMock";
import { formatMoney } from "../../utils/money";

const TRUST_ICONS = {
  secure: FiShield,
  returns: FiRefreshCw,
};

function CartOrderSummary({
  summaryRef,
  subtotal,
  shipping,
  discount,
  total,
  promo,
}) {
  const [code, setCode] = useState("");

  const handleApply = (event) => {
    event.preventDefault();

    if (promo.apply(code)) {
      setCode("");
      notify.success(cartContent.promo.success);
    }
  };

  const handleRemovePromo = () => {
    promo.remove();
    notify.info(cartContent.promo.removed);
  };

  return (
    <aside
      ref={summaryRef}
      aria-labelledby="cart-summary-heading"
      className="min-w-0 lg:sticky lg:top-[calc(var(--header-height)+1rem)]"
    >
      <div className="rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <h2 id="cart-summary-heading" className="text-h5 font-bold text-ink">
          {cartContent.summaryTitle}
        </h2>

        <FreeShippingProgress subtotal={subtotal} className="mt-4" />

        <dl className="mt-4 space-y-3 border-t border-border pt-4 text-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <dt className="text-ink-secondary">Subtotal</dt>
            <dd className="font-semibold tabular-nums text-ink">
              {formatMoney(subtotal)}
            </dd>
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <dt className="text-ink-secondary">{cartContent.shippingLabel}</dt>
            <dd
              className={
                shipping === 0
                  ? "font-semibold text-success"
                  : "font-semibold tabular-nums text-ink"
              }
            >
              {shipping === 0
                ? cartContent.freeShipping
                : formatMoney(shipping)}
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
            <dt className="text-ink-secondary">{cartContent.taxLabel}</dt>
            <dd className="min-w-0 break-words text-end text-xs text-ink-secondary">
              {cartContent.taxValue}
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-border pt-4">
          <span className="min-w-0 break-words text-base font-bold text-ink">
            {cartContent.totalLabel}
          </span>
          <span
            aria-live="polite"
            className="min-w-0 break-words text-h4 font-bold tabular-nums text-ink"
          >
            {formatMoney(total)}
          </span>
        </div>
        <p className="mt-1 text-xs text-ink-secondary">
          {cartContent.taxNote}
        </p>

        <div className="mt-5 border-t border-border pt-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-ink">
              {cartContent.promo.heading}
            </h3>
            <Badge variant="brand" size="sm">
              {cartContent.promo.demoLabel}
            </Badge>
          </div>

          {promo.isApplied ? (
            <div
              aria-live="polite"
              className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-subtle px-3 py-2"
            >
              <p className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-success">
                <FiCheckCircle aria-hidden="true" className="shrink-0" />
                <span className="truncate">
                  {cartContent.promo.applied.replace(
                    "{code}",
                    promo.appliedCode,
                  )}
                </span>
                <span className="shrink-0 font-normal text-ink-secondary">
                  −{promoDiscountPercent}%
                </span>
              </p>
              <button
                type="button"
                onClick={handleRemovePromo}
                aria-label={cartContent.promo.remove}
                className="min-h-9 shrink-0 cursor-pointer rounded-sm px-1 text-sm font-semibold text-info underline-offset-4 hover:text-info-strong hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <form onSubmit={handleApply} className="mt-2">
              <Input
                label={cartContent.promo.label}
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  if (promo.error) promo.setError("");
                }}
                placeholder={cartContent.promo.placeholder}
                helper={cartContent.promo.helper.replace(
                  "{code}",
                  promoCode,
                )}
                error={promo.error}
                autoComplete="off"
                spellCheck={false}
                inputClassName="pe-[5.75rem]"
                endAdornment={
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="rounded-md"
                  >
                    {cartContent.promo.apply}
                  </Button>
                }
              />
            </form>
          )}
        </div>

        <div className="mt-5">
          <Button
            as={Link}
            to="/checkout"
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<FiLock aria-hidden="true" />}
          >
            {cartContent.checkout}
          </Button>
          <Button
            as={Link}
            to="/"
            variant="link"
            size="md"
            fullWidth
            className="mt-1"
          >
            {cartContent.continueShopping}
          </Button>
        </div>

        <ul className="mt-5 list-none space-y-2 border-t border-border pt-4">
          {cartContent.trust.map((note) => {
            const Icon = TRUST_ICONS[note.id] ?? FiShield;

            return (
              <li
                key={note.id}
                className="flex gap-2 text-xs leading-relaxed text-ink-secondary"
              >
                <Icon
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-success"
                />
                <span>
                  <span className="font-semibold text-ink">
                    {note.title}
                  </span>{" "}
                  {note.description}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

export default CartOrderSummary;
