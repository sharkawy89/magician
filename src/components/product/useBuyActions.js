import { useContext } from "react";
import { CartContext } from "../context/cartContextValue";
import { MiniCartContext } from "../context/miniCartContextValue";
import { notify } from "../ui/toast";
import { shareProduct } from "../../utils/shareProduct";
import { getStockInfo } from "../../utils/productDetails";

/**
 * Purchase actions shared by the buy box and the mobile sticky bar. Cart
 * semantics are unchanged: adding opens the mini-cart once, and an item that
 * is already in the cart becomes a "View cart" action.
 *
 * QuantityStepper can exceed one before the first add, but CartContext always
 * stores new lines with quantity 1. Calling addToCart once per chosen unit is
 * the only way to honour the stepper without changing CartContext itself.
 */
export function useBuyActions(product) {
  const {
    cartItems,
    addToCart,
    addToFavorites,
    favorites,
    removeFromFavorites,
  } = useContext(CartContext);
  const { openMiniCart } = useContext(MiniCartContext);

  const stock = getStockInfo(product);
  const isInCart = cartItems.some((item) => item.id === product?.id);
  const isInFavorites = favorites.some((item) => item.id === product?.id);

  const add = (quantity = 1) => {
    if (!product || stock.state === "out") return;

    if (isInCart) {
      openMiniCart();
      return;
    }

    const units = Math.max(1, Math.min(Number(quantity) || 1, stock.maxQuantity));

    for (let index = 0; index < units; index += 1) {
      addToCart(product);
    }

    openMiniCart();
  };

  const toggleFavorite = () => {
    if (!product) return;

    if (isInFavorites) {
      removeFromFavorites(product.id);
      notify.error(`${product.title} removed from favorites`);
    } else {
      addToFavorites(product);
      notify.success(`${product.title} added to favorites`);
    }
  };

  return {
    stock,
    isInCart,
    isInFavorites,
    add,
    toggleFavorite,
    share: () => shareProduct(product),
  };
}
