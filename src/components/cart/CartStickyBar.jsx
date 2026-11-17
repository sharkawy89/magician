import { FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { cartContent } from "../../mocks/storefrontMock";
import { formatMoney } from "../../utils/money";

function CartStickyBar({ visible, total }) {
  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cart total"
      className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-header border-t border-border bg-surface px-4 py-3 shadow-tabbar md:hidden"
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-ink-secondary">Total</p>
          <p className="line-clamp-1 text-h5 font-bold tabular-nums text-ink">
            {formatMoney(total)}
          </p>
        </div>

        <Button
          as={Link}
          to="/checkout"
          variant="primary"
          size="md"
          leftIcon={<FiLock aria-hidden="true" />}
          className="shrink-0"
        >
          {cartContent.checkoutShort}
        </Button>
      </div>
    </div>
  );
}

export default CartStickyBar;
