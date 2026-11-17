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

function ProductGridCard({ item }) {
  const { isInCart, isInFavorites, add, toggleFavorite, share } =
    useProductCard(item);
  const image = item.images?.[0] || item.thumbnail;
  const inStock = isProductInStock(item);
  const reviewCount = Array.isArray(item.reviews)
    ? item.reviews.length
    : undefined;

  return (
    <Card
      hover
      className="group relative flex h-full w-full flex-col overflow-hidden p-4"
    >
      <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2">
        {Number(item.discountPercentage) >= 1 ? (
          <Badge variant="sale">Sale</Badge>
        ) : (
          <span />
        )}
        {isInCart ? (
          <Badge variant="freeShipping">
            <FaCheck aria-hidden="true" /> In cart
          </Badge>
        ) : null}
      </div>

      <Link
        to={`/products/${item.id}`}
        className="flex flex-1 flex-col focus-visible:rounded-lg"
      >
        <div className="mb-4 flex aspect-4/3 items-center justify-center rounded-lg bg-surface-subtle p-4">
          {image ? (
            <img
              src={image}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-[13px] text-ink-secondary">
              No image available
            </span>
          )}
        </div>

        <p className="text-[11px] font-bold uppercase tracking-wide text-ink-secondary">
          {getBrandName(item)}
        </p>

        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-ink sm:text-base">
          {item.title}
        </h3>

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
          {inStock ? item.availabilityStatus || "In stock" : "Out of stock"}
        </p>
      </Link>

      <div className="mt-4 flex items-center gap-2">
        <div className="flex min-w-0 flex-1">
          <Button
            variant={isInCart ? "primary" : "outline"}
            size="sm"
            fullWidth
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
            className="min-w-0"
          >
            {isInCart ? "In cart" : "Add"}
          </Button>
        </div>

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
    </Card>
  );
}

export default ProductGridCard;
