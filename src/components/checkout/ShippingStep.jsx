import Input from "../ui/Input";
import Button from "../ui/Button";
import ErrorSummary from "./ErrorSummary";
import { checkoutContent } from "../../mocks/storefrontMock";
import { cn } from "../ui/cn";

const SHIPPING_FIELDS = [
  {
    id: "email",
    label: checkoutContent.form.email.label,
    type: "email",
    inputMode: "email",
    autoComplete: "email",
    required: true,
  },
  {
    id: "fullName",
    label: checkoutContent.form.fullName.label,
    type: "text",
    inputMode: "text",
    autoComplete: "name",
    required: true,
  },
  {
    id: "phone",
    label: checkoutContent.form.phone.label,
    type: "tel",
    inputMode: "tel",
    autoComplete: "tel",
    required: false,
  },
  {
    id: "address1",
    label: checkoutContent.form.address1.label,
    type: "text",
    inputMode: "text",
    autoComplete: "address-line1",
    required: true,
  },
  {
    id: "address2",
    label: checkoutContent.form.address2.label,
    type: "text",
    inputMode: "text",
    autoComplete: "address-line2",
    required: false,
  },
  {
    id: "city",
    label: checkoutContent.form.city.label,
    type: "text",
    inputMode: "text",
    autoComplete: "address-level2",
    required: true,
  },
  {
    id: "state",
    label: checkoutContent.form.state.label,
    type: "text",
    inputMode: "text",
    autoComplete: "address-level1",
    required: true,
  },
  {
    id: "postalCode",
    label: checkoutContent.form.postalCode.label,
    type: "text",
    inputMode: "text",
    autoComplete: "postal-code",
    required: true,
  },
];

function ShippingStep({ formData, errors, updateForm, onSubmit }) {
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
          Shipping address
        </h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Where should we ship your order?
        </p>
      </div>

      <ErrorSummary errors={errors} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SHIPPING_FIELDS.map((field) => (
          <div
            key={field.id}
            className={cn(
              field.id === "address1" || field.id === "address2"
                ? "sm:col-span-2"
                : "",
            )}
          >
            <Input
              id={`checkout-${field.id}`}
              label={field.label}
              type={field.type}
              inputMode={field.inputMode}
              autoComplete={field.autoComplete}
              value={formData[field.id] || ""}
              onChange={(event) => updateForm(field.id, event.target.value)}
              error={errors[field.id]}
              required={field.required}
            />
          </div>
        ))}

        <div className="sm:col-span-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="checkout-country"
              className="text-sm font-semibold text-ink"
            >
              {checkoutContent.form.country.label}
              <span className="text-danger" aria-hidden="true">
                {" "}
                *
              </span>
            </label>
            <select
              id="checkout-country"
              value={formData.country || ""}
              onChange={(event) => updateForm("country", event.target.value)}
              aria-invalid={errors.country ? true : undefined}
              aria-describedby={
                errors.country ? "checkout-country-error" : undefined
              }
              className={cn(
                "h-11 w-full rounded-lg border bg-surface px-3.5 text-body text-ink transition-colors duration-150 focus-visible:border-ink",
                errors.country ? "border-danger" : "border-border-strong",
              )}
            >
              <option value="">{checkoutContent.form.country.placeholder}</option>
              {checkoutContent.countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country ? (
              <p
                id="checkout-country-error"
                className="text-caption font-medium text-danger"
              >
                {errors.country}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Button type="submit" variant="primary" size="lg" fullWidth>
          Continue to delivery
        </Button>
      </div>
    </form>
  );
}

export default ShippingStep;