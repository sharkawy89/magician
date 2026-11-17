import React, { useContext } from "react";
import { FaCartArrowDown, FaCheck, FaRegHeart, FaShare } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartContext } from "../context/cartContextValue";
import { MiniCartContext } from "../context/miniCartContextValue";
import { shareProduct } from "../../utils/shareProduct";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Price from "../ui/Price";
import Rating from "../ui/Rating";
import { notify } from "../ui/toast";

function Product({ item }) {
  const {
    cartItems,
    addToCart,
    addToFavorites,
    favorites,
    removeFromFavorites,
  } = useContext(CartContext);
  const { openMiniCart } = useContext(MiniCartContext);

  const isInCart = cartItems.some((i) => i.id === item.id);
  const productImage = item.images?.[0] || item.thumbnail;
  const reviewCount = Array.isArray(item.reviews)
    ? item.reviews.length
    : undefined;

  const handleAddToCart = () => {
    addToCart(item);
    openMiniCart();
  };

  // favorites
  const isInFav = favorites.some((i) => i.id === item.id);

  const handleAddToFav = () => {
    if (isInFav) {
      removeFromFavorites(item.id);
      notify.error(`${item.title} removed from favorites`);
    } else {
      addToFavorites(item);
      notify.success(`${item.title} added to favorites`);
    }
  };

  return (
    <Card
      hover
      className="group relative w-62.5 overflow-hidden px-3.75 py-6.25"
    >
      {Number(item.discountPercentage) >= 1 ? (
        <Badge
          variant="sale"
          className="absolute start-2.5 top-2.5 z-10"
        >
          Sale
        </Badge>
      ) : null}

      <Link to={`/products/${item.id}`}>
        {isInCart ? (
          <Badge
            variant="freeShipping"
            className="absolute left-1/2 top-2.5 -translate-x-1/2"
          >
            <FaCheck aria-hidden="true" /> In cart
          </Badge>
        ) : null}

        <div className="relative mb-7.5 flex h-45 items-center justify-center px-5">
          {productImage ? (
            <img src={productImage} alt={item.title} className="h-40 w-auto" />
          ) : (
            <span className="flex h-40 w-full items-center justify-center text-[13px] text-ink-secondary">
              No image available
            </span>
          )}
        </div>

        <p className="mb-2.5 line-clamp-1 text-ink">{item.title}</p>

        <Rating
          value={item.rating ?? 0}
          count={reviewCount}
          size="sm"
          className="my-3.75"
        />

        <Price
          price={item.price}
          discountPercent={item.discountPercentage}
        />
      </Link>

      <div className="mt-4 flex items-center gap-2.5 sm:absolute sm:top-1/2 sm:-end-12.5 sm:mt-0 sm:-translate-y-1/2 sm:flex-col sm:transition-all sm:duration-200 sm:ease-out sm:group-hover:end-5 sm:focus-within:end-5">
        <Button
          variant={isInCart ? "primary" : "outline"}
          size="sm"
          iconOnly
          aria-label={
            isInCart
              ? `${item.title} is already in cart`
              : `Add ${item.title} to cart`
          }
          aria-disabled={isInCart || undefined}
          onClick={isInCart ? undefined : handleAddToCart}
        >
          <FaCartArrowDown aria-hidden="true" />
        </Button>

        <Button
          variant={isInFav ? "primary" : "outline"}
          size="sm"
          iconOnly
          aria-label={
            isInFav
              ? `Remove ${item.title} from favorites`
              : `Add ${item.title} to favorites`
          }
          aria-pressed={isInFav}
          onClick={handleAddToFav}
        >
          <FaRegHeart aria-hidden="true" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          iconOnly
          aria-label={`Share ${item.title}`}
          onClick={() => shareProduct(item)}
        >
          <FaShare aria-hidden="true" />
        </Button>
      </div>
    </Card>
  );
}

export default Product;
