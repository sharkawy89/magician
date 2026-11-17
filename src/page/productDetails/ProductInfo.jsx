import React, { useContext } from "react";
import { FaRegHeart, FaShare } from "react-icons/fa6";
import { TiShoppingCart } from "react-icons/ti";
import { CartContext } from "../../components/context/cartContextValue";
import { MiniCartContext } from "../../components/context/miniCartContextValue";
import { shareProduct } from "../../utils/shareProduct";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Price from "../../components/ui/Price";
import Rating from "../../components/ui/Rating";
import { notify } from "../../components/ui/toast";
import { miniCartCopy } from "../../mocks/storefrontMock";

function ProductInfo({ product }) {
  const {
    cartItems,
    addToCart,
    addToFavorites,
    favorites,
    removeFromFavorites,
  } = useContext(CartContext);
  const { openMiniCart } = useContext(MiniCartContext);

  const isInCart = cartItems.some((i) => i.id === product.id);
  const isInFav = favorites.some((i) => i.id === product.id);
  const reviewCount = Array.isArray(product.reviews)
    ? product.reviews.length
    : undefined;
  const inStock = Number(product.stock) > 10;

  const handleAddToCart = () => {
    addToCart(product);
    openMiniCart();
  };

  // favorites
  const handleAddToFav = () => {
    if (isInFav) {
      removeFromFavorites(product.id);
      notify.error(`${product.title} removed from favorites`);
    } else {
      addToFavorites(product);
      notify.success(`${product.title} added to favorites`);
    }
  };

  return (
    <div className="w-[58%]">
      <h1 className="mb-[30px] text-[2em] font-bold text-ink">
        {product.title}
      </h1>

      <Rating
        value={product.rating ?? 0}
        count={reviewCount}
        showValue
        className="my-[15px]"
      />

      <Price
        price={product.price}
        discountPercent={product.discountPercentage}
        className="my-[20px]"
      />

      <div className="mb-[20px] flex flex-wrap items-center gap-2 text-[16px] font-medium">
        <span>Availability:</span>
        <Badge variant={inStock ? "freeShipping" : "bestseller"}>
          {product.availabilityStatus ||
            (inStock ? "In stock" : "Low stock")}
        </Badge>
      </div>

      <h5 className="mb-[20px] text-[16px] font-medium">
        Brand: <span className="font-semibold text-ink">{product.brand}</span>
      </h5>

      <p className="leading-[1.5]">{product.description}</p>

      <p className="mt-[20px] mb-[20px] text-[20px] font-semibold text-danger">
        Hurry up! Only {product.stock} products left in stock.
      </p>

      {/* Keep this button focusable after adding: the mini-cart returns focus
          to its trigger on close, and a disabled button cannot receive it. */}
      <Button
        type="button"
        onClick={isInCart ? openMiniCart : handleAddToCart}
        variant={isInCart ? "outline" : "primary"}
        size="lg"
        aria-haspopup={isInCart ? "dialog" : undefined}
        leftIcon={<TiShoppingCart aria-hidden="true" className="text-[20px]" />}
      >
        {isInCart ? miniCartCopy.viewCart : "Add to cart"}
      </Button>

      <div className="my-[20px] flex gap-[10px]">
        <Button
          type="button"
          variant={isInFav ? "primary" : "outline"}
          size="md"
          iconOnly
          aria-label={
            isInFav
              ? `Remove ${product.title} from favorites`
              : `Add ${product.title} to favorites`
          }
          aria-pressed={isInFav}
          onClick={handleAddToFav}
        >
          <FaRegHeart aria-hidden="true" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="md"
          iconOnly
          aria-label={`Share ${product.title}`}
          onClick={() => shareProduct(product)}
        >
          <FaShare aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

export default ProductInfo;
