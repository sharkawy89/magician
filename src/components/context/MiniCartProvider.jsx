import { useCallback, useMemo, useState } from "react";
import { MiniCartContext } from "./miniCartContextValue";

/**
 * UI-only state for the mini-cart drawer. Cart data still lives in CartContext;
 * this provider never reads or mutates it.
 */
export default function MiniCartProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openMiniCart = useCallback(() => setOpen(true), []);
  const closeMiniCart = useCallback(() => setOpen(false), []);
  const toggleMiniCart = useCallback(() => setOpen((current) => !current), []);

  const value = useMemo(
    () => ({ open, openMiniCart, closeMiniCart, toggleMiniCart }),
    [open, openMiniCart, closeMiniCart, toggleMiniCart],
  );

  return (
    <MiniCartContext.Provider value={value}>
      {children}
    </MiniCartContext.Provider>
  );
}
