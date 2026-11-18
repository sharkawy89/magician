import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FiCreditCard } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../components/context/cartContextValue";
import PageTransition from "../../components/PageTransition";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { notify } from "../../components/ui/toast";
import { usePromoCode } from "../../components/cart/usePromoCode";
import { formatMoney } from "../../utils/money";
import {
  calculateShipping,
  calculateDiscount,
  calculateTotals,
} from "../../utils/checkoutTotals";
import {
  checkoutContent,
  deliveryMethods,
  freeShippingThreshold,
  promoDiscountPercent,
} from "../../mocks/storefrontMock";
import CheckoutProgress from "../../components/checkout/CheckoutProgress";
import OrderSummary from "../../components/checkout/OrderSummary";
import ShippingStep from "../../components/checkout/ShippingStep";
import DeliveryStep from "../../components/checkout/DeliveryStep";
import PaymentStep from "../../components/checkout/PaymentStep";
import ReviewStep from "../../components/checkout/ReviewStep";
import SuccessScreen from "../../components/checkout/SuccessScreen";

const STEP_ORDER = ["shipping", "delivery", "payment", "review"];
const STEP_INDEX = { shipping: 0, delivery: 1, payment: 2, review: 3 };

function luhnCheck(value) {
  let sum = 0;
  let alternate = false;

  for (let i = value.length - 1; i >= 0; i -= 1) {
    let digit = Number(value[i]);

    if (alternate) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    alternate = !alternate;
  }

  return value.length > 0 && sum % 10 === 0;
}

function detectCardBrand(value) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("4")) return "Visa";
  if (/^5[1-5]/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^6(?:011|5)/.test(digits)) return "Discover";

  return "Card";
}

function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const promo = usePromoCode();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState("shipping");
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("standard");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [cardFields, setCardFields] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });
  const [cardSummary, setCardSummary] = useState({ brand: "", last4: "" });
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingData, setBillingData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  const prevStepRef = useRef(currentStep);
  const headingRef = useRef(null);
  const stepAnnouncerRef = useRef(null);
  const shouldFocusErrorsRef = useRef(false);

  const hasItems = cartItems.length > 0;
  const orderPlaced = Boolean(completedOrder);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total + (Number(item.price) || 0) * (Number(item.quantity) || 1),
        0,
      ),
    [cartItems],
  );

  const shippingPrice = useMemo(
    () =>
      calculateShipping({
        subtotal,
        method: selectedDeliveryMethod,
        freeThreshold: freeShippingThreshold,
        deliveryMethods,
      }),
    [subtotal, selectedDeliveryMethod],
  );

  const discount = useMemo(
    () =>
      promo.isApplied
        ? calculateDiscount({
            subtotal,
            discountPercent: promoDiscountPercent,
          })
        : 0,
    [subtotal, promo.isApplied],
  );

  const totals = useMemo(
    () => calculateTotals({ subtotal, shipping: shippingPrice, discount }),
    [subtotal, shippingPrice, discount],
  );

  const stepIndex = STEP_INDEX[currentStep];
  const stepTotal = STEP_ORDER.length;

  // Move focus to the new step heading after a step change and announce it.
  useEffect(() => {
    const announcer = stepAnnouncerRef.current;
    const label =
      checkoutContent.steps.find((step) => step.id === currentStep)?.label ||
      currentStep;

    if (announcer) {
      announcer.textContent = `Step ${stepIndex + 1} of ${stepTotal}: ${label}`;
    }

    if (prevStepRef.current !== currentStep) {
      prevStepRef.current = currentStep;
      document.getElementById("checkout-step-heading")?.focus();
    }
  }, [currentStep, stepIndex, stepTotal]);

  // Focus the error summary after React has rendered the new errors.
  useEffect(() => {
    if (shouldFocusErrorsRef.current && Object.keys(errors).length > 0) {
      shouldFocusErrorsRef.current = false;
      document.getElementById("checkout-error-summary")?.focus();
    }
  }, [errors]);

  // Focus the success heading once it is mounted.
  useEffect(() => {
    if (orderPlaced) headingRef.current?.focus();
  }, [orderPlaced]);

  // Card values only live while the payment step is active. Clearing them in
  // the same update as the step change avoids a window where Payment has been
  // left but stale card data is still held in React state.
  const changeStep = (nextStep) => {
    if (nextStep !== "payment") {
      setCardFields({ number: "", name: "", expiry: "", cvc: "" });
    }
    setCurrentStep(nextStep);
  };

  const goToStep = (stepId) => {
    const targetIndex = STEP_INDEX[stepId];

    // Backwards is always allowed; forward only through validated progress.
    if (targetIndex <= stepIndex) {
      changeStep(stepId);
    }
  };

  const goBack = () => {
    if (stepIndex > 0) {
      changeStep(STEP_ORDER[stepIndex - 1]);
    }
  };

  const validateShipping = () => {
    const next = {};

    if (!formData.email) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = "Enter a valid email address.";
    }

    if (!formData.fullName) next.fullName = "Full name is required.";
    if (!formData.address1) next.address1 = "Address line 1 is required.";
    if (!formData.city) next.city = "City is required.";
    if (!formData.state) next.state = "State / region is required.";

    if (!formData.postalCode) {
      next.postalCode = "Postal code is required.";
    } else if (formData.postalCode.trim().length < 3) {
      next.postalCode = "Postal code is too short.";
    }

    if (formData.phone && !/^\+?[\d\s\-()]{7,}$/.test(formData.phone)) {
      next.phone = "Enter a valid phone number.";
    }

    if (!formData.country) next.country = "Select a country.";

    return next;
  };

  const validatePayment = () => {
    const next = {};

    if (selectedPaymentMethod === "card") {
      const digits = cardFields.number.replace(/\s/g, "");

      if (!digits) {
        next.cardNumber = "Card number is required.";
      } else if (!luhnCheck(digits)) {
        next.cardNumber = "Enter a valid card number.";
      }

      if (!cardFields.name.trim()) {
        next.cardName = "Name on card is required.";
      }

      if (!/^\d{2}\/\d{2}$/.test(cardFields.expiry)) {
        next.cardExpiry = "Use MM/YY format.";
      } else {
        const [month, year] = cardFields.expiry.split("/").map(Number);

        if (month < 1 || month > 12) {
          next.cardExpiry = "Enter a month between 01 and 12.";
        } else {
          const expiresEndOfMonth = new Date(2000 + year, month, 0, 23, 59, 59);

          if (expiresEndOfMonth < new Date()) {
            next.cardExpiry = "This card has expired.";
          }
        }
      }

      if (!/^\d{3,4}$/.test(cardFields.cvc)) {
        next.cvc = "CVC must be 3 or 4 digits.";
      }

      if (!billingSameAsShipping) {
        if (!billingData.address1) {
          next.billingAddress1 = "Billing address line 1 is required.";
        }
        if (!billingData.city) {
          next.billingCity = "Billing city is required.";
        }
      }
    }

    return next;
  };

  const validateReview = () => {
    const next = {};

    if (!formData.terms) {
      next.terms = "You must agree to the terms to place an order.";
    }

    return next;
  };

  const placeOrder = async () => {
    setIsSubmitting(true);
    // Drop the last-four summary as soon as submission starts, before the
    // simulated delay, so it never survives into the confirmation state.
    setCardSummary({ brand: "", last4: "" });

    // Simulated processing only. No request, no card data anywhere.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Snapshot what is needed for the confirmation before the cart clears.
    setCompletedOrder({
      number: `MGC-${Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0")}`,
      items: cartItems.map((item) => ({ ...item })),
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      discount: totals.discount,
      total: totals.total,
      deliveryMethod,
      email: formData.email || "",
      paymentMethod: selectedPaymentMethod,
    });

    setIsSubmitting(false);
    clearCart();
    promo.remove();
    setCardFields({ number: "", name: "", expiry: "", cvc: "" });
    setCardSummary({ brand: "", last4: "" });
  };

  const handleSubmitStep = () => {
    let nextErrors = {};

    if (currentStep === "shipping") nextErrors = validateShipping();
    else if (currentStep === "delivery") nextErrors = {};
    else if (currentStep === "payment") nextErrors = validatePayment();
    else if (currentStep === "review") nextErrors = validateReview();

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      shouldFocusErrorsRef.current = true;
      notify.error("Please fix the highlighted fields.");
      return;
    }

    if (currentStep === "payment") {
      // Keep only the brand and last four digits for the review screen.
      setCardSummary({
        brand: detectCardBrand(cardFields.number),
        last4: cardFields.number.replace(/\s/g, "").slice(-4),
      });
    }

    if (currentStep === "review") {
      setCardSummary({ brand: "", last4: "" });
      placeOrder();
      return;
    }

    changeStep(STEP_ORDER[STEP_INDEX[currentStep] + 1]);
  };

  const handleEditStep = (stepId) => {
    goToStep(stepId);
  };

  const updateForm = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const updateBilling = (field, value) => {
    setBillingData((prev) => ({ ...prev, [field]: value }));

    const key = `billing${field.charAt(0).toUpperCase()}${field.slice(1)}`;

    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const updateCard = (field, value) => {
    setCardFields((prev) => ({ ...prev, [field]: value }));

    const key = field === "cvc" ? "cvc" : `card${field.charAt(0).toUpperCase()}${field.slice(1)}`;

    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const formatCardNumber = (value) =>
    value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ");

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);

    return digits.length >= 3
      ? `${digits.slice(0, 2)}/${digits.slice(2)}`
      : digits;
  };

  const continueShopping = () => {
    navigate("/");
  };

  const deliveryMethod =
    deliveryMethods.find((method) => method.id === selectedDeliveryMethod) ||
    deliveryMethods[0];

  const freeShippingMsg =
    subtotal >= freeShippingThreshold
      ? "Free shipping unlocked on this order."
      : `Add ${formatMoney(freeShippingThreshold - subtotal)} more for free shipping.`;

  if (!hasItems && !orderPlaced) {
    return (
      <PageTransition>
        <div className="mx-auto w-[90%] max-w-337.5 py-12 sm:py-16">
          <EmptyState
            icon={<FiCreditCard />}
            title={checkoutContent.emptyCart.title}
            description={checkoutContent.emptyCart.description}
            action={
              <Button as={Link} to="/" variant="primary">
                {checkoutContent.emptyCart.cta}
              </Button>
            }
          />
        </div>
      </PageTransition>
    );
  }

  if (orderPlaced) {
    return (
      <PageTransition>
        <SuccessScreen
          order={completedOrder}
          onContinueShopping={continueShopping}
          headingRef={headingRef}
        />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto w-[90%] max-w-337.5 py-6 sm:py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/cart"
            className="inline-flex min-h-10 items-center gap-2 rounded-sm text-sm font-semibold text-info underline-offset-4 hover:text-info-strong hover:underline"
          >
            Back to cart
          </Link>
          <span className="text-xs font-bold uppercase tracking-wide text-ink-secondary">
            Secure checkout
          </span>
        </div>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <aside className="mb-6 min-w-0 lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:col-start-2 lg:row-start-1 lg:mb-0">
            <OrderSummary
              subtotal={totals.subtotal}
              shipping={totals.shipping}
              discount={totals.discount}
              total={totals.total}
              taxValue={checkoutContent.review.taxValue}
              freeShippingMsg={freeShippingMsg}
              promo={promo}
              expanded={summaryExpanded}
              onToggle={() => setSummaryExpanded((current) => !current)}
            />
          </aside>

          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <CheckoutProgress
              steps={checkoutContent.steps}
              stepIndex={stepIndex}
              stepTotal={stepTotal}
              currentStep={currentStep}
              onGoToStep={goToStep}
            />

            <div
              ref={stepAnnouncerRef}
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            />

            {currentStep === "shipping" && (
              <ShippingStep
                formData={formData}
                errors={errors}
                updateForm={updateForm}
                onSubmit={handleSubmitStep}
              />
            )}

            {currentStep === "delivery" && (
              <DeliveryStep
                methods={deliveryMethods}
                selectedMethod={selectedDeliveryMethod}
                subtotal={subtotal}
                freeThreshold={freeShippingThreshold}
                freeShippingMsg={freeShippingMsg}
                onSelectMethod={setSelectedDeliveryMethod}
                onSubmit={handleSubmitStep}
                onGoBack={goBack}
              />
            )}

            {currentStep === "payment" && (
              <PaymentStep
                selectedMethod={selectedPaymentMethod}
                cardFields={cardFields}
                errors={errors}
                billingSameAsShipping={billingSameAsShipping}
                billingData={billingData}
                onSelectMethod={setSelectedPaymentMethod}
                onUpdateCard={updateCard}
                onUpdateBilling={updateBilling}
                onToggleBilling={setBillingSameAsShipping}
                formatCardNumber={formatCardNumber}
                formatExpiry={formatExpiry}
                onSubmit={handleSubmitStep}
                onGoBack={goBack}
              />
            )}

            {currentStep === "review" && (
              <ReviewStep
                cartItems={cartItems}
                formData={formData}
                paymentMethod={selectedPaymentMethod}
                cardSummary={cardSummary}
                deliveryMethod={deliveryMethod}
                totals={totals}
                promo={promo}
                errors={errors}
                termsChecked={Boolean(formData.terms)}
                onToggleTerms={() =>
                  updateForm("terms", !formData.terms)
                }
                onSubmit={handleSubmitStep}
                onGoBack={goBack}
                onEditStep={handleEditStep}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Checkout;