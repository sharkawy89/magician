import { FiCheckCircle } from "react-icons/fi";
import Button from "../ui/Button";
import { checkoutContent } from "../../mocks/storefrontMock";
import { formatMoney } from "../../utils/money";

function SuccessScreen({ order, onContinueShopping, headingRef }) {
  const itemCount = order.items.reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0,
  );

  return (
    <div className="mx-auto w-[90%] max-w-337.5 py-12 text-center sm:py-16">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-pill bg-success text-white">
        <FiCheckCircle aria-hidden="true" className="text-[32px]" />
      </span>

      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-5 text-h3 font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:text-h2"
      >
        {checkoutContent.success.heading}
      </h1>
      <p className="mt-3 text-sm text-ink-secondary">
        Thank you. Your order is confirmed and on its way.
      </p>

      <div className="mx-auto mt-8 w-full max-w-md rounded-xl border border-border bg-surface p-6 text-left shadow-card sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-h5 font-bold text-ink">
            {checkoutContent.success.orderNumber}
            {order.number}
          </h2>
          <span className="text-xs font-semibold uppercase tracking-wide text-success">
            Confirmed
          </span>
        </div>

        <p className="mt-1 text-xs text-ink-secondary">
          {checkoutContent.success.estimatedDelivery}:{" "}
          {order.deliveryMethod.label} ({order.deliveryMethod.description})
        </p>

        <ul className="mt-5 list-none space-y-3 border-t border-border pt-4">
          {order.items.map((item) => {
            const image = item.images?.[0] || item.thumbnail;
            const lineTotal =
              (Number(item.price) || 0) * (Number(item.quantity) || 1);

            return (
              <li key={item.id} className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-subtle">
                  {image ? (
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-contain p-1"
                    />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 block text-sm font-medium text-ink">
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
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-ink-secondary">
              {checkoutContent.success.itemsLabel} ({itemCount})
            </dt>
            <dd className="font-semibold tabular-nums text-ink">
              {formatMoney(order.subtotal)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-ink-secondary">Shipping</dt>
            <dd className="font-semibold tabular-nums text-ink">
              {order.shipping === 0 ? "Free" : formatMoney(order.shipping)}
            </dd>
          </div>
          {order.discount > 0 ? (
            <div className="flex items-baseline justify-between gap-3">
              <dt className="font-semibold text-success">Promo discount</dt>
              <dd className="font-semibold tabular-nums text-success">
                −{formatMoney(order.discount)}
              </dd>
            </div>
          ) : null}
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-border pt-3">
            <dt className="text-base font-bold text-ink">
              {checkoutContent.success.totalLabel}
            </dt>
            <dd className="text-h4 font-bold tabular-nums text-ink">
              {formatMoney(order.total)}
            </dd>
          </div>
        </dl>

        <p className="mt-4 text-xs text-ink-secondary">
          {checkoutContent.success.emailNote.replace(
            "{email}",
            order.email || "your inbox",
          )}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center">
        <Button
          type="button"
          variant="primary"
          size="lg"
          className="max-w-full whitespace-normal"
          onClick={onContinueShopping}
        >
          {checkoutContent.success.continueShopping}
        </Button>
      </div>
      {/* "View order" is omitted because /account/orders does not exist. */}
    </div>
  );
}

export default SuccessScreen;