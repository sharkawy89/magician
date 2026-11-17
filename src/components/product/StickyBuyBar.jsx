import { FaCheck } from "react-icons/fa6";
import { TiShoppingCart } from "react-icons/ti";
import Button from "../ui/Button";
import Price from "../ui/Price";
import { miniCartCopy } from "../../mocks/storefrontMock";
import { useBuyActions } from "./useBuyActions";

function StickyBuyBar({ product, visible }) {
  const { stock, isInCart, add } = useBuyActions(product);
  const outOfStock = stock.state === "out";

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-header border-t border-border bg-surface px-4 py-3 shadow-tabbar md:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-xs font-medium text-ink-secondary">
            {product.title}
          </p>
          <Price
            price={product.price}
            size="sm"
            className="mt-1"
          />
        </div>

        <Button
          type="button"
          onClick={() => add(1)}
          disabled={outOfStock}
          variant={isInCart ? "outline" : "primary"}
          size="md"
          aria-haspopup={isInCart ? "dialog" : undefined}
          aria-label={
            outOfStock
              ? `${product.title} is out of stock`
              : isInCart
                ? `View cart with ${product.title}`
                : `Add ${product.title} to cart`
          }
          leftIcon={
            isInCart ? (
              <FaCheck aria-hidden="true" />
            ) : (
              <TiShoppingCart aria-hidden="true" className="text-[18px]" />
            )
          }
        >
          {outOfStock
            ? "Out of stock"
            : isInCart
              ? miniCartCopy.viewCart
              : "Add to cart"}
        </Button>
      </div>
    </div>
  );
}

export default StickyBuyBar;
