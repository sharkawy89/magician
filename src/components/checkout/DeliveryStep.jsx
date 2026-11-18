import Button from "../ui/Button";
import { formatMoney } from "../../utils/money";
import { cn } from "../ui/cn";

function DeliveryStep({
  methods,
  selectedMethod,
  subtotal,
  freeThreshold,
  freeShippingMsg,
  onSelectMethod,
  onSubmit,
  onGoBack,
}) {
  return (
    <form
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
          Delivery
        </h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Choose how quickly you would like your order to arrive.
        </p>
      </div>

      <fieldset className="min-w-0 border-0 p-0">
        <legend className="sr-only">Delivery method</legend>

        <div className="flex flex-col gap-3">
          {methods.map((method) => {
            const isFree = method.freeOverThreshold && subtotal >= freeThreshold;
            const price = method.price || 0;
            const isSelected = selectedMethod === method.id;

            return (
              <label
                key={method.id}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors duration-200 motion-reduce:transition-none",
                  isSelected
                    ? "border-info bg-surface-subtle"
                    : "border-border-strong bg-surface hover:bg-surface-subtle",
                )}
              >
                <input
                  type="radio"
                  name="delivery-method"
                  value={method.id}
                  checked={isSelected}
                  onChange={() => onSelectMethod(method.id)}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer"
                />

                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="text-sm font-semibold text-ink">
                      {method.label}
                    </span>
                    <span
                      className={cn(
                        "min-w-0 break-words text-sm font-bold tabular-nums",
                        isFree ? "text-success" : "text-ink",
                      )}
                    >
                      {isFree || price === 0 ? "Free" : formatMoney(price)}
                    </span>
                  </span>
                  <span className="text-xs text-ink-secondary">
                    {method.description}
                  </span>
                  {method.freeOverThreshold ? (
                    <span className="text-[11px] text-ink-secondary">
                      Free over {formatMoney(freeThreshold)}
                    </span>
                  ) : null}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <p className="text-xs font-medium text-ink-secondary">
        {freeShippingMsg}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onGoBack}
          className="sm:w-auto"
        >
          Back
        </Button>
        <Button type="submit" variant="primary" size="lg" className="sm:w-auto">
          Continue to payment
        </Button>
      </div>
    </form>
  );
}

export default DeliveryStep;