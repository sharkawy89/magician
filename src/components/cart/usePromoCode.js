import { useCallback, useState } from "react";
import {
  cartContent,
  promoCode,
  promoDiscountPercent,
  promoStorageKey,
} from "../../mocks/storefrontMock";

function readStoredCode() {
  try {
    const stored = sessionStorage.getItem(promoStorageKey);
    return stored && stored.trim().toUpperCase() === promoCode
      ? promoCode
      : "";
  } catch {
    return "";
  }
}

/**
 * UI-only promo state. The applied code lives in sessionStorage under
 * `magician:promo`, never in the cart items key, so CartContext totals remain
 * untouched. Checkout can read the same store later.
 */
export function usePromoCode() {
  const [appliedCode, setAppliedCode] = useState(readStoredCode);
  const [error, setError] = useState("");

  const apply = useCallback((rawCode) => {
    const candidate = String(rawCode ?? "").trim().toUpperCase();

    if (!candidate) {
      setError(cartContent.promo.empty);
      return false;
    }

    if (candidate !== promoCode) {
      setError(cartContent.promo.invalid.replace("{code}", promoCode));
      return false;
    }

    try {
      sessionStorage.setItem(promoStorageKey, promoCode);
    } catch {
      // Session storage can be unavailable in private modes; the applied
      // state still works for this visit.
    }

    setAppliedCode(promoCode);
    setError("");
    return true;
  }, []);

  const remove = useCallback(() => {
    try {
      sessionStorage.removeItem(promoStorageKey);
    } catch {
      // Nothing to clean up when storage is unavailable.
    }

    setAppliedCode("");
    setError("");
  }, []);

  return {
    appliedCode,
    isApplied: Boolean(appliedCode),
    discountPercent: appliedCode ? promoDiscountPercent : 0,
    error,
    setError,
    apply,
    remove,
  };
}
