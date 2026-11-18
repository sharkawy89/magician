const FIELD_IDS = {
  cardNumber: "checkout-card-number",
  cardName: "checkout-card-name",
  cardExpiry: "checkout-card-expiry",
  cvc: "checkout-card-cvc",
  billingAddress1: "checkout-billing-address1",
  billingCity: "checkout-billing-city",
  terms: "checkout-terms",
};

/**
 * Visible, focusable error summary. Render at the top of a step form and focus
 * it when submit fails so keyboard and screen-reader users land on the errors.
 */
function ErrorSummary({ errors, id = "checkout-error-summary" }) {
  const entries = Object.entries(errors || {}).filter(([, message]) => message);

  if (entries.length === 0) return null;

  return (
    <div
      id={id}
      tabIndex={-1}
      role="alert"
      className="rounded-lg border border-danger bg-surface p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <p className="text-sm font-bold text-danger">
        Please fix the following before continuing:
      </p>
      <ul className="mt-2 list-none space-y-1">
        {entries.map(([field, message]) => (
          <li key={field}>
            <button
              type="button"
              onClick={() => {
                const target = document.getElementById(
                  FIELD_IDS[field] || `checkout-${field}`,
                );
                target?.focus();
              }}
              className="text-start text-sm text-danger underline underline-offset-4 hover:text-ink"
            >
              {message}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ErrorSummary;