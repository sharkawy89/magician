import { FiLock, FiMapPin, FiTruck } from "react-icons/fi";
import Button from "../ui/Button";
import ErrorSummary from "./ErrorSummary";
import { checkoutContent } from "../../mocks/storefrontMock";
import { formatMoney } from "../../utils/money";

function ReviewStep({
  cartItems,
  formData,
  paymentMethod,
  cardSummary,
  deliveryMethod,
  totals,
  promo,
  errors,
  termsChecked,
  onToggleTerms,
  onSubmit,
  onGoBack,
  onEditStep,
  isSubmitting,
}) {
  const itemCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0,
  );

  const paymentLabel = (() => {
    if (paymentMethod === "card") {
      const brand = cardSummary?.brand || "Card";
      const last4 = cardSummary?.last4;

      return last4 ? `${brand} ending in ${last4}` : brand;
    }

    return paymentMethod === "cash" ? "Cash on delivery" : "PayPal (stub)";
  })();

  const editLink = (stepId) => (
    <button
      type="button"
      onClick={() => onEditStep(stepId)}
      className="mt-3 inline-flex min-h-9 items-center rounded-sm text-xs font-semibold text-info underline-offset-4 hover:text-info-strong hover:underline"
    >
      Edit
    </button>
  );

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="space-y-5"
    >
      <div>
        <h1
          id="checkout-step-heading"
          tabIndex={-1}
          className="text-h4 font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          Review and place order
        </h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Check everything below before placing your order.
        </p>
      </div>

      <ErrorSummary errors={errors} />

      <section
        aria-labelledby="review-shipping-heading"
        className="rounded-lg border border-border bg-surface p-4"
      >
        <div className="flex items-center gap-2">
          <FiMapPin aria-hidden="true" className="shrink-0 text-info" />
          <h2
            id="review-shipping-heading"
            className="min-w-0 break-words text-sm font-semibold text-ink"
          >
            Ship to {formData.fullName || "—"}
          </h2>
        </div>
        <p className="mt-2 text-xs text-ink-secondary">
          {formData.address1 || "—"}
          {formData.address2 ? `, ${formData.address2}` : ""}
        </p>
        <p className="text-xs text-ink-secondary">
          {formData.city || "—"}, {formData.state || "—"}{" "}
          {formData.postalCode || ""}
        </p>
        <p className="text-xs text-ink-secondary">
          {formData.country || "—"}
        </p>
        <p className="mt-1 text-xs text-ink-secondary">
          {formData.email || "—"}
          {formData.phone ? ` · ${formData.phone}` : ""}
        </p>
        {editLink("shipping")}
      </section>

      <section
        aria-labelledby="review-delivery-heading"
        className="rounded-lg border border-border bg-surface p-4"
      >
        <div className="flex items-center gap-2">
          <FiTruck aria-hidden="true" className="shrink-0 text-info" />
          <h2
            id="review-delivery-heading"
            className="min-w-0 break-words text-sm font-semibold text-ink"
          >
            {deliveryMethod.label} — {deliveryMethod.description}
          </h2>
        </div>
        <p className="mt-1 text-xs text-ink-secondary">
          {totals.shipping === 0
            ? "Free shipping"
            : `${formatMoney(totals.shipping)} shipping`}
        </p>
        {editLink("delivery")}
      </section>

      <section
        aria-labelledby="review-payment-heading"
        className="rounded-lg border border-border bg-surface p-4"
      >
        <div className="flex items-center gap-2">
          <FiLock aria-hidden="true" className="shrink-0 text-info" />
          <h2
            id="review-payment-heading"
            className="min-w-0 break-words text-sm font-semibold text-ink"
          >
            {paymentLabel}
          </h2>
        </div>
        <p className="mt-1 text-xs text-ink-secondary">
          Demo payment only. No real charge is made.
        </p>
        {editLink("payment")}
      </section>

      <section
        aria-labelledby="review-items-heading"
        className="rounded-lg border border-border bg-surface p-4"
      >
        <h2
          id="review-items-heading"
          className="text-sm font-semibold text-ink"
        >
          Items ({itemCount})
        </h2>

        <ul className="mt-3 list-none space-y-3">
          {cartItems.map((item) => {
            const image = item.images?.[0] || item.thumbnail;
            const lineTotal =
              (Number(item.price) || 0) * (Number(item.quantity) || 1);

            return (
              <li key={item.id} className="flex items-center gap-3">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-subtle">
                  {image ? (
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <span className="text-[10px] text-ink-secondary">
                      No image
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 block text-sm font-medium text-ink">
                    {item.title}
                  </span>
                  <span className="text-xs text-ink-secondary">
                    ×{item.quantity}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-ink">
                  {formatMoney(lineTotal)}
                </span>
              </li>
            );
          })}
        </ul>

        <dl className="mt-4 space-y-3 border-t border-border pt-4 text-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <dt className="text-ink-secondary">Subtotal</dt>
            <dd className="font-semibold tabular-nums text-ink">
              {formatMoney(totals.subtotal)}
            </dd>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <dt className="text-ink-secondary">Shipping</dt>
            <dd
              className={
                totals.shipping === 0
                  ? "font-semibold text-success"
                  : "font-semibold tabular-nums text-ink"
              }
            >
              {totals.shipping === 0 ? "Free" : formatMoney(totals.shipping)}
            </dd>
          </div>
          {totals.discount > 0 ? (
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <dt className="font-semibold text-success">
                Promo ({promo.appliedCode})
              </dt>
              <dd className="font-semibold tabular-nums text-success">
                −{formatMoney(totals.discount)}
              </dd>
            </div>
          ) : null}
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <dt className="text-ink-secondary">Estimated tax</dt>
            <dd className="min-w-0 break-words text-end text-xs text-ink-secondary">
              {checkoutContent.review.taxValue}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 border-t border-border pt-3">
            <dt className="text-base font-bold text-ink">Order total</dt>
            <dd className="text-h4 font-bold tabular-nums text-ink">
              {formatMoney(totals.total)}
            </dd>
          </div>
        </dl>
      </section>

      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="checkout-terms"
            checked={termsChecked}
            onChange={onToggleTerms}
            aria-invalid={errors.terms ? true : undefined}
            aria-describedby={errors.terms ? "checkout-terms-error" : undefined}
            className="mt-1 h-4 w-4 shrink-0 cursor-pointer"
          />
          <label
            htmlFor="checkout-terms"
            className="cursor-pointer text-sm leading-relaxed text-ink"
          >
            {checkoutContent.review.terms}
          </label>
        </div>
        {errors.terms ? (
          <p
            id="checkout-terms-error"
            className="ms-7 text-caption font-medium text-danger"
          >
            {errors.terms}
          </p>
        ) : null}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onGoBack}
          className="sm:w-auto"
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          className="sm:w-auto"
        >
          {isSubmitting
            ? checkoutContent.review.placing
            : checkoutContent.review.placeOrder}
        </Button>
      </div>
    </form>
  );
}

export default ReviewStep;