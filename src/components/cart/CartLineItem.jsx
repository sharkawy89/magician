import { useContext } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { CartContext } from "../context/cartContextValue";
import Price from "../ui/Price";
import QuantityStepper from "../ui/QuantityStepper";
import { cartContent } from "../../mocks/storefrontMock";
import { formatCategoryName } from "../../utils/categories";
import { formatMoney } from "../../utils/money";

function CartLineItem({ item, isFavorite, onRemove, onSaveForLater }) {
  const { increaseQuantity, decreaseQuantity } = useContext(CartContext);

  const quantity = Math.max(1, Number(item.quantity) || 1);
  const unitPrice = Number(item.price) || 0;
  const lineTotal = unitPrice * quantity;
  const image = item.images?.[0] || item.thumbnail;
  const category = item.category ? formatCategoryName(item.category) : "";
  const meta = [item.brand, category].filter(Boolean).join(" · ");

  const stockValue = Number(item.stock);
  const hasStock = Number.isFinite(stockValue);
  const maxQuantity = hasStock ? Math.max(1, stockValue) : undefined;
  const isLowStock = hasStock && stockValue > 0 && stockValue < 10;
  const isOutOfStock = hasStock && stockValue <= 0;

  return (
    <li className="grid grid-cols-[5rem_minmax(0,1fr)] gap-x-3 gap-y-4 border-b border-border py-5 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[6rem_minmax(0,1fr)_8.5rem] sm:gap-x-5">
      <Link
        to={`/products/${item.id}`}
        aria-label={`View ${item.title}`}
        className="group self-start"
      >
        <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-subtle sm:h-24 sm:w-24">
          {image ? (
            <img
              src={image}
              alt=""
              className="h-full w-full object-contain p-1.5 transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none"
            />
          ) : (
            <span className="px-2 text-center text-[11px] text-ink-secondary">
              No image
            </span>
          )}
        </span>
      </Link>

      <div className="min-w-0">
        {meta ? (
          <p className="line-clamp-1 text-[11px] font-bold uppercase tracking-wide text-ink-secondary">
            {meta}
          </p>
        ) : null}

        <h3 className="mt-0.5 text-sm font-semibold leading-snug sm:text-base">
          <Link
            to={`/products/${item.id}`}
            className="line-clamp-2 underline-offset-4 hover:underline"
          >
            {item.title}
          </Link>
        </h3>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-xs text-ink-secondary">
            {cartContent.unitPriceLabel}
          </span>
          <Price price={unitPrice} size="sm" />
        </div>

        {isOutOfStock ? (
          <p className="mt-1 text-xs font-medium text-danger">
            {cartContent.outOfStock}
          </p>
        ) : isLowStock ? (
          <p className="mt-1 text-xs font-medium text-warning-strong">
            {cartContent.lowStock.replace("{count}", stockValue)}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <QuantityStepper
            size="sm"
            value={quantity}
            min={1}
            max={maxQuantity}
            label={item.title}
            onDecrease={() => decreaseQuantity(item.id)}
            onIncrease={() => increaseQuantity(item.id)}
          />

          <button
            type="button"
            onClick={() => onSaveForLater(item)}
            aria-label={cartContent.moveToFavoritesLabel.replace(
              "{title}",
              item.title,
            )}
            className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-sm px-1 text-sm font-semibold text-info underline-offset-4 hover:text-info-strong hover:underline"
          >
            <FaRegHeart aria-hidden="true" className="text-[15px]" />
            {isFavorite
              ? cartContent.savedForLater
              : cartContent.saveForLater}
          </button>

          <button
            type="button"
            data-cart-remove={item.id}
            onClick={() => onRemove(item)}
            aria-label={cartContent.removeLabel.replace(
              "{title}",
              item.title,
            )}
            className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-sm px-1 text-sm font-semibold text-ink-secondary underline-offset-4 hover:text-danger hover:underline"
          >
            <FiTrash2 aria-hidden="true" className="text-[16px]" />
            Remove
          </button>
        </div>
      </div>

      <div className="col-span-2 flex items-baseline justify-between gap-3 border-t border-border pt-3 sm:col-span-1 sm:flex-col sm:items-end sm:justify-start sm:border-0 sm:pt-0">
        <span className="text-xs font-medium text-ink-secondary">
          {cartContent.lineTotalLabel}
        </span>
        <span className="text-base font-bold tabular-nums text-ink sm:text-lg">
          {formatMoney(lineTotal)}
        </span>
      </div>
    </li>
  );
}

export default CartLineItem;
