import { Link } from "react-router-dom";
import { FaCartArrowDown, FaCheck, FaRegHeart, FaShare } from "react-icons/fa";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Price from "../ui/Price";
import Rating from "../ui/Rating";
import { cn } from "../ui/cn";
import { useProductCard } from "./useProductCard";
import { getBrandName, isProductInStock } from "../../utils/listing";

function getStockNote(item) {
  if (!isProductInStock(item)) return "Out of stock";

  const stock = Number(item.stock);

  if (item.availabilityStatus === "Low Stock") {
    return Number.isFinite(stock)
      ? `Low stock · only ${stock} left`
      : "Low stock";
  }

  return Number.isFinite(stock)
    ? `In stock · ${stock} available`
    : "In stock";
}

function ProductListCard({ item }) {
  const { isInCart, isInFavorites, add, toggleFavorite, share } =
    useProductCard(item);
  const image = item.images?.[0] || item.thumbnail;
  const inStock = isProductInStock(item);
  const reviewCount = Array.isArray(item.reviews)
    ? item.reviews.length
    : undefined;

  return (
    <Card className="relative flex gap-3 p-3 sm:gap-5 sm:p-4">
      <div className="pointer-events-none absolute start-3 top-3 z-10 flex flex-wrap gap-1.5">
        {Number(item.discountPercentage) >= 1 ? (
          <Badge variant="sale">Sale</Badge>
        ) : null}
        {isInCart ? (
          <Badge variant="freeShipping">
            <FaCheck aria-hidden="true" /> In cart
          </Badge>
        ) : null}
      </div>

      <Link
        to={`/products/${item.id}`}
        className="flex h-28 w-28 shrink-0 items-center justify-center self-start rounded-lg bg-surface-subtle p-2 sm:h-36 sm:w-36 sm:p-3"
      >
        {image ? (
          <img
            src={image}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-center text-[11px] text-ink-secondary">
            No image available
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-[11px] font-bold uppercase tracking-wide text-ink-secondary">
          {getBrandName(item)}
        </p>

        <Link
          to={`/products/${item.id}`}
          className="mt-1 focus-visible:rounded-sm"
        >
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink sm:text-base">
            {item.title}
          </h3>
        </Link>

        <Rating
          value={item.rating ?? 0}
          count={reviewCount}
          size="sm"
          className="mt-2"
        />

        <div className="mt-2">
          <Price
            price={item.price}
            discountPercent={item.discountPercentage}
            size="sm"
          />
        </div>

        <p
          className={cn(
            "mt-2 text-xs font-semibold",
            inStock ? "text-success" : "text-danger",
          )}
        >
          {getStockNote(item)}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-auto sm:pt-3">
          <Button
            variant={isInCart ? "primary" : "outline"}
            size="sm"
            leftIcon={
              isInCart ? (
                <FaCheck aria-hidden="true" />
              ) : (
                <FaCartArrowDown aria-hidden="true" />
              )
            }
            aria-label={
              isInCart
                ? `${item.title} is already in cart`
                : `Add ${item.title} to cart`
            }
            aria-disabled={isInCart || undefined}
            onClick={isInCart ? undefined : add}
          >
            <span className="sm:hidden">
              {isInCart ? "In cart" : "Add"}
            </span>
            <span className="hidden sm:inline">
              {isInCart ? "In cart" : "Add to cart"}
            </span>
          </Button>

          <Button
            variant={isInFavorites ? "primary" : "outline"}
            size="sm"
            iconOnly
            aria-label={
              isInFavorites
                ? `Remove ${item.title} from favorites`
                : `Add ${item.title} to favorites`
            }
            aria-pressed={isInFavorites}
            onClick={toggleFavorite}
          >
            <FaRegHeart aria-hidden="true" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            iconOnly
            aria-label={`Share ${item.title}`}
            onClick={share}
          >
            <FaShare aria-hidden="true" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default ProductListCard;
