import { FiArrowLeft, FiCreditCard } from "react-icons/fi";
import { Link } from "react-router-dom";
import PageTransition from "../../components/PageTransition";
import Button from "../../components/ui/Button";

/**
 * Placeholder checkout route. The multi-step checkout (Part C5) replaces this
 * page; until then the mini-cart CTA has a real destination.
 */
function Checkout() {
  return (
    <PageTransition>
      <div className="mx-auto w-[90%] max-w-337.5 py-12 sm:py-16">
        <div className="mx-auto max-w-xl rounded-xl border border-border bg-surface p-6 text-center shadow-card sm:p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-pill bg-brand-soft text-ink">
            <FiCreditCard aria-hidden="true" className="text-[26px]" />
          </span>

          <h1 className="mt-5 text-h3 font-bold text-ink">
            Checkout coming next
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm text-ink-secondary">
            Secure checkout is being built as the next step. Your cart is saved,
            so you can review it and come right back.
          </p>

          <Button
            as={Link}
            to="/cart"
            variant="primary"
            className="mt-6 inline-flex items-center gap-2"
          >
            <FiArrowLeft aria-hidden="true" />
            Back to cart
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}

export default Checkout;
