import { useContext } from "react";
import { FiTrash2 } from "react-icons/fi";
import { TiShoppingCart } from "react-icons/ti";
import { Link } from "react-router-dom";
import { CartContext } from "../context/cartContextValue";
import { MiniCartContext } from "../context/miniCartContextValue";
import Button from "../ui/Button";
import Drawer from "../ui/Drawer";
import EmptyState from "../ui/EmptyState";
import Price from "../ui/Price";
import QuantityStepper from "../ui/QuantityStepper";
import {
  freeShippingThreshold,
  miniCartCopy,
  miniCartEmpty,
} from "../../mocks/storefrontMock";

function formatMoney(value) {
  return `$${Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function MiniCartDrawer() {
  const { open, closeMiniCart } = useContext(MiniCartContext);
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useContext(CartContext);

  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0,
  );

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0,
  );

  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const progress =
    freeShippingThreshold > 0
      ? Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))
      : 100;

  const hasItems = cartItems.length > 0;

  return (
    <Drawer
      open={open}
      onClose={closeMiniCart}
      title={hasItems ? `${miniCartCopy.title} (${cartCount})` : miniCartCopy.title}
      side="right"
      className="sm:max-w-[420px]"
    >
      {!hasItems ? (
        <EmptyState
          icon={<TiShoppingCart />}
          title={miniCartEmpty.title}
          description={miniCartEmpty.description}
          action={
            <Button
              as={Link}
              to="/"
              variant="primary"
              onClick={closeMiniCart}
            >
              {miniCartEmpty.cta}
            </Button>
          }
        />
      ) : (
        <ul className="list-none divide-y divide-border">
          {cartItems.map((item) => {
            const image = item.thumbnail || item.images?.[0];

            return (
              <li key={item.id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                <Link
                  to={`/products/${item.id}`}
                  onClick={closeMiniCart}
                  className="shrink-0"
                >
                  {image ? (
                    <img
                      src={image}
                      alt=""
                      className="h-16 w-16 rounded-md border border-border object-contain"
                    />
                  ) : (
                    <span className="flex h-16 w-16 items-center justify-center rounded-md border border-border bg-surface-subtle text-ink-secondary">
                      <TiShoppingCart aria-hidden="true" className="text-[24px]" />
                    </span>
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/products/${item.id}`}
                      onClick={closeMiniCart}
                      className="line-clamp-2 text-sm font-semibold text-ink underline-offset-4 hover:underline"
                    >
                      {item.title}
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={miniCartCopy.removeLabel.replace(
                        "{title}",
                        item.title,
                      )}
                      className="-mt-1 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-pill text-ink-secondary transition-colors hover:bg-surface-subtle hover:text-danger"
                    >
                      <FiTrash2 aria-hidden="true" className="text-[18px]" />
                    </button>
                  </div>

                  <Price price={item.price} size="sm" className="mt-1" />

                  <div className="mt-2">
                    <QuantityStepper
                      value={item.quantity}
                      min={1}
                      label={item.title}
                      size="sm"
                      onIncrease={() => increaseQuantity(item.id)}
                      onDecrease={() => decreaseQuantity(item.id)}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {hasItems ? (
        <div className="w-full">
          <div>
            <p className="mb-1.5 text-xs font-medium text-ink">
              {remaining > 0
                ? miniCartCopy.freeShippingRemaining.replace(
                    "{amount}",
                    formatMoney(remaining),
                  )
                : miniCartCopy.freeShippingUnlocked}
            </p>
            <div
              role="progressbar"
              aria-label={miniCartCopy.freeShippingProgressLabel}
              aria-valuemin={0}
              aria-valuemax={freeShippingThreshold}
              aria-valuenow={Math.min(subtotal, freeShippingThreshold)}
              className="h-2 overflow-hidden rounded-pill bg-surface-subtle"
            >
              <div
                className="h-full rounded-pill bg-brand transition-[width] duration-300 motion-reduce:transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-ink">
              {miniCartCopy.subtotalLabel}
            </span>
            <Price price={subtotal} size="sm" />
          </div>
          <p className="mt-1 text-xs text-ink-secondary">
            {miniCartCopy.taxNote}
          </p>

          <div className="mt-3 flex flex-col gap-2">
            <Button
              as={Link}
              to="/cart"
              variant="primary"
              fullWidth
              onClick={closeMiniCart}
            >
              {miniCartCopy.viewCart}
            </Button>

            <Button
              as={Link}
              to="/checkout"
              variant="secondary"
              fullWidth
              onClick={closeMiniCart}
            >
              {miniCartCopy.checkout}
            </Button>
          </div>
        </div>
      ) : null}
    </Drawer>
  );
}

export default MiniCartDrawer;
