import Input from "../ui/Input";
import Button from "../ui/Button";
import ErrorSummary from "./ErrorSummary";
import { checkoutContent } from "../../mocks/storefrontMock";
import { cn } from "../ui/cn";

const PAYMENT_OPTIONS = [
  { id: "card", label: checkoutContent.payment.card },
  { id: "cash", label: checkoutContent.payment.cash },
  { id: "paypal", label: checkoutContent.payment.paypal },
];

function PaymentStep({
  selectedMethod,
  cardFields,
  errors,
  billingSameAsShipping,
  billingData,
  onSelectMethod,
  onUpdateCard,
  onUpdateBilling,
  onToggleBilling,
  formatCardNumber,
  formatExpiry,
  onSubmit,
  onGoBack,
}) {
  const showCardFields = selectedMethod === "card";
  const showBillingForm = showCardFields && !billingSameAsShipping;

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
          Payment
        </h1>
        <p className="mt-1 text-sm font-medium text-warning-strong">
          {checkoutContent.demoNote}
        </p>
      </div>

      <ErrorSummary errors={errors} />

      <fieldset className="min-w-0 border-0 p-0">
        <legend className="sr-only">Payment method</legend>

        <div className="flex flex-col gap-3">
          {PAYMENT_OPTIONS.map((option) => (
            <label
              key={option.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors duration-200 motion-reduce:transition-none",
                selectedMethod === option.id
                  ? "border-info bg-surface-subtle"
                  : "border-border-strong bg-surface hover:bg-surface-subtle",
              )}
            >
              <input
                type="radio"
                name="payment-method"
                value={option.id}
                checked={selectedMethod === option.id}
                onChange={() => onSelectMethod(option.id)}
                className="h-4 w-4 shrink-0 cursor-pointer"
              />
              <span className="text-sm font-semibold text-ink">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {showCardFields ? (
        <fieldset className="min-w-0 rounded-lg border border-border p-4">
          <legend className="px-2 text-sm font-semibold text-ink">
            Card details
          </legend>

          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="checkout-card-number"
              label={checkoutContent.payment.cardNumber.label}
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              value={cardFields.number}
              onChange={(event) =>
                onUpdateCard("number", formatCardNumber(event.target.value))
              }
              error={errors.cardNumber}
              required
              inputClassName="tracking-widest"
            />

            <Input
              id="checkout-card-name"
              label={checkoutContent.payment.cardName.label}
              type="text"
              inputMode="text"
              autoComplete="cc-name"
              value={cardFields.name}
              onChange={(event) => onUpdateCard("name", event.target.value)}
              error={errors.cardName}
              required
            />

            <Input
              id="checkout-card-expiry"
              label={checkoutContent.payment.cardExpiry.label}
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder={checkoutContent.payment.cardExpiry.placeholder}
              value={cardFields.expiry}
              onChange={(event) =>
                onUpdateCard("expiry", formatExpiry(event.target.value))
              }
              error={errors.cardExpiry}
              required
              inputClassName="tracking-widest"
            />

            <Input
              id="checkout-card-cvc"
              label={checkoutContent.payment.cardCvc.label}
              type="text"
              inputMode="numeric"
              autoComplete="cc-csc"
              value={cardFields.cvc}
              onChange={(event) =>
                onUpdateCard(
                  "cvc",
                  event.target.value.replace(/\D/g, "").slice(0, 4),
                )
              }
              error={errors.cvc}
              required
              inputClassName="tracking-widest"
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              id="checkout-billing-same"
              checked={billingSameAsShipping}
              onChange={(event) => onToggleBilling(event.target.checked)}
              className="h-4 w-4 shrink-0 cursor-pointer"
            />
            <label
              htmlFor="checkout-billing-same"
              className="cursor-pointer text-sm text-ink"
            >
              {checkoutContent.billing.sameAsShipping}
            </label>
          </div>

          {showBillingForm ? (
            <div className="mt-5 border-t border-border pt-4">
              <h2 className="mb-3 text-sm font-semibold text-ink">
                {checkoutContent.billing.heading}
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  id="checkout-billing-address1"
                  label="Address line 1"
                  type="text"
                  inputMode="text"
                  autoComplete="billing address-line1"
                  value={billingData.address1 || ""}
                  onChange={(event) =>
                    onUpdateBilling("address1", event.target.value)
                  }
                  error={errors.billingAddress1}
                  required
                />

                <Input
                  id="checkout-billing-address2"
                  label="Address line 2 (optional)"
                  type="text"
                  inputMode="text"
                  autoComplete="billing address-line2"
                  value={billingData.address2 || ""}
                  onChange={(event) =>
                    onUpdateBilling("address2", event.target.value)
                  }
                />

                <Input
                  id="checkout-billing-city"
                  label="City"
                  type="text"
                  inputMode="text"
                  autoComplete="billing address-level2"
                  value={billingData.city || ""}
                  onChange={(event) =>
                    onUpdateBilling("city", event.target.value)
                  }
                  error={errors.billingCity}
                  required
                />

                <Input
                  id="checkout-billing-state"
                  label="State / region"
                  type="text"
                  inputMode="text"
                  autoComplete="billing address-level1"
                  value={billingData.state || ""}
                  onChange={(event) =>
                    onUpdateBilling("state", event.target.value)
                  }
                />
              </div>
            </div>
          ) : null}
        </fieldset>
      ) : null}

      {showCardFields ? (
        <p className="rounded-lg border border-border bg-surface-subtle p-3 text-xs leading-relaxed text-ink-secondary">
          Card values are never stored, logged, or transmitted, and they are
          cleared when you leave this step.
        </p>
      ) : null}

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
          Continue to review
        </Button>
      </div>
    </form>
  );
}

export default PaymentStep;