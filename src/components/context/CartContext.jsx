import React, { useEffect, useState } from "react";
import { CartContext } from "./cartContextValue";

const CART_STORAGE_KEY = "cartItems";
const FAVORITES_STORAGE_KEY = "favoritesItems";

function readStorageArray(key) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Could not read "${key}" from localStorage`, error);
    return [];
  }
}

function writeStorageArray(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Could not save "${key}" to localStorage`, error);
  }
}

function normalizeFavorites(items) {
  const seen = new Set();

  return items.filter((item) => {
    if (!item || item.id === undefined || item.id === null) return false;
    if (seen.has(item.id)) return false;

    seen.add(item.id);
    return true;
  });
}

function normalizeCart(items) {
  const itemsById = new Map();

  for (const item of items) {
    if (!item || item.id === undefined || item.id === null) continue;

    const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
    const existing = itemsById.get(item.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      itemsById.set(item.id, { ...item, quantity });
    }
  }

  return [...itemsById.values()];
}

export default function CartProvider({ children }) {
  // Favorites
  const [favorites, setFavorites] = useState(() =>
    normalizeFavorites(readStorageArray(FAVORITES_STORAGE_KEY)),
  );

  const addToFavorites = (item) => {
    if (!item || item.id === undefined || item.id === null) return;

    setFavorites((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  useEffect(() => {
    writeStorageArray(FAVORITES_STORAGE_KEY, favorites);
  }, [favorites]);

  const removeFromFavorites = (id) => {
    setFavorites((prev) => prev.filter((i) => i.id !== id));
  };

  // Cart
  const [cartItems, setCartItems] = useState(() =>
    normalizeCart(readStorageArray(CART_STORAGE_KEY)),
  );

  const increaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: (Number(item.quantity) || 1) + 1 }
          : item,
      ),
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const addToCart = (item) => {
    if (!item || item.id === undefined || item.id === null) return;

    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === item.id);

      if (existing) {
        return prevItems.map((i) =>
          i.id === item.id
            ? { ...i, quantity: (Number(i.quantity) || 1) + 1 }
            : i,
        );
      }

      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  useEffect(() => {
    writeStorageArray(CART_STORAGE_KEY, cartItems);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        addToFavorites,
        favorites,
        removeFromFavorites,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
