import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaRegHeart,
  FaShare,
  FaCheck,
  FaCartArrowDown,
} from "react-icons/fa6";
import {
  FiRotateCcw,
  FiShield,
  FiTruck,
} from "react-icons/fi";
import { TiShoppingCart } from "react-icons/ti";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Price from "../ui/Price";
import QuantityStepper from "../ui/QuantityStepper";
import Rating from "../ui/Rating";
import { cn } from "../ui/cn";
import { miniCartCopy } from "../../mocks/storefrontMock";
import { formatCategoryName } from "../../utils/categories";
import { getDeliveryEstimate, getPolicyRows, getReviewsSummary } from "../../utils/productDetails";
import { useBuyActions } from "./useBuyActions";

const POLICY_ICONS = {
  shipping: FiTruck,
  returns: FiRotateCcw,
  warranty: FiShield,
};

const STOCK_VARIANTS = {
  in: "freeShipping",
  low: "bestseller",
  out: "sale",
};

function ProductBuyBox({ product }) {
  const {
    stock,
    isInCart,
    isInFavorites,
    add,
    toggleFavorite,
    share,
  } = useBuyActions(product);
  const [quantity, setQuantity] = useState(1);

  const reviews = useMemo(
    () => (Array.isArray(product.reviews) ? product.reviews : []),
    [product.reviews],
  );
  const summary = useMemo(() => getReviewsSummary(reviews), [reviews]);
  const policies = useMemo(() => getPolicyRows(product), [product]);
  const deliveryEstimate = useMemo(() => getDeliveryEstimate(), []);
  const outOfStock = stock.state === "out";

  const stockDetailClass = cn(
    "mt-1 text-sm font-medium",
    stock.state === "in"
      ? "text-success"
      : stock.state === "low"
        ? "text-warning-strong"
        : "text-danger",
  );

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-wide text-ink-secondary">
        {product.brand ? <span>{product.brand}</span> : null}
        {product.brand && product.category ? (
          <span aria-hidden="true">/</span>
        ) : null}
        {product.category ? (
          <Link
            to={`/category/${product.category}`}
            className="text-info underline-offset-2 hover:underline"
          >
            {formatCategoryName(product.category)}
          </Link>
        ) : null}
      </div>

      <h1 className="mt-2 text-h3 font-bold leading-tight text-ink sm:text-h2">
        {product.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <Rating
          value={reviews.length > 0 ? summary.average : (product.rating ?? 0)}
          count={reviews.length || undefined}
          showValue
        />
        {reviews.length === 0 && !product.rating ? (
          <span className="text-caption text-ink-secondary">No reviews yet</span>
        ) : null}
      </div>

      <div className="mt-5">
        <Price
          price={product.price}
          discountPercent={product.discountPercentage}
          size="lg"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
        <Badge variant={STOCK_VARIANTS[stock.state] ?? "neutral"}>
          {stock.label}
        </Badge>
        <span className={stockDetailClass}>{stock.detail}</span>
      </div>

      {product.sku ? (
        <p className="mt-2 text-xs text-ink-secondary">
          SKU: <span className="font-semibold text-ink">{product.sku}</span>
        </p>
      ) : null}

      <div className="mt-5 rounded-lg border border-border bg-surface-subtle p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          <FiTruck aria-hidden="true" className="text-[18px]" />
          {deliveryEstimate}
        </p>
        <p className="mt-1 text-caption text-ink-secondary">
          Sample delivery estimate for this demo. No address is collected.
        </p>
      </div>

      {!isInCart && !outOfStock ? (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-ink">Quantity</span>
          <QuantityStepper
            value={quantity}
            min={1}
            max={stock.maxQuantity}
            onChange={setQuantity}
            label={product.title}
          />
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={() => add(quantity)}
          className="w-full sm:w-auto"
          disabled={outOfStock}
          variant={isInCart ? "outline" : "primary"}
          size="lg"
          aria-haspopup={isInCart ? "dialog" : undefined}
          leftIcon={
            isInCart ? (
              <FaCheck aria-hidden="true" className="text-[18px]" />
            ) : (
              <TiShoppingCart aria-hidden="true" className="text-[20px]" />
            )
          }
        >
          {outOfStock
            ? "Out of stock"
            : isInCart
              ? miniCartCopy.viewCart
              : "Add to cart"}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={isInFavorites ? "primary" : "outline"}
            size="lg"
            iconOnly
            aria-label={
              isInFavorites
                ? `Remove ${product.title} from favorites`
                : `Add ${product.title} to favorites`
            }
            aria-pressed={isInFavorites}
            onClick={toggleFavorite}
          >
            <FaRegHeart aria-hidden="true" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            iconOnly
            aria-label={`Share ${product.title}`}
            onClick={share}
          >
            <FaShare aria-hidden="true" />
          </Button>
        </div>
      </div>

      {isInCart ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-success">
          <FaCartArrowDown aria-hidden="true" />
          This item is in your cart. Open the cart to change its quantity.
        </p>
      ) : null}

      <dl className="mt-7 grid gap-3 border-t border-border pt-5 text-sm">
        {policies.map((policy) => {
          const Icon = POLICY_ICONS[policy.id];

          return (
            <div key={policy.id}>
              <dt className="flex items-start gap-3 font-semibold text-ink">
                {Icon ? (
                  <Icon
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-[18px] text-ink-secondary"
                  />
                ) : null}
                <span>{policy.label}</span>
              </dt>
              <dd className="ps-[30px] text-ink-secondary">{policy.value}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

export default ProductBuyBox;
