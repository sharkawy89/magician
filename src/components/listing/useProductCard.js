import { useContext } from "react";
import { CartContext } from "../context/cartContextValue";
import { MiniCartContext } from "../context/miniCartContextValue";
import { shareProduct } from "../../utils/shareProduct";
import { notify } from "../ui/toast";

/**
 * Shared cart/favorites behaviour for listing cards. Mirrors the existing
 * Product card exactly: add opens the mini-cart, favorite toggles with a
 * toast, and no CartContext logic changes.
 */
export function useProductCard(item) {
  const {
    cartItems,
    addToCart,
    addToFavorites,
    favorites,
    removeFromFavorites,
  } = useContext(CartContext);
  const { openMiniCart } = useContext(MiniCartContext);

  const isInCart = cartItems.some((cartItem) => cartItem.id === item.id);
  const isInFavorites = favorites.some((favorite) => favorite.id === item.id);

  const add = () => {
    if (isInCart) return;
    addToCart(item);
    openMiniCart();
  };

  const toggleFavorite = () => {
    if (isInFavorites) {
      removeFromFavorites(item.id);
      notify.error(`${item.title} removed from favorites`);
    } else {
      addToFavorites(item);
      notify.success(`${item.title} added to favorites`);
    }
  };

  return {
    isInCart,
    isInFavorites,
    add,
    toggleFavorite,
    share: () => shareProduct(item),
  };
}
