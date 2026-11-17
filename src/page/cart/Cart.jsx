import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { TiShoppingCart } from "react-icons/ti";
import { Link } from "react-router-dom";
import { CartContext } from "../../components/context/cartContextValue";
import PageTransition from "../../components/PageTransition";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import { notify } from "../../components/ui/toast";
import ProductRail, {
  RailSkeleton,
} from "../../components/home/ProductRail";
import CartLineItem from "../../components/cart/CartLineItem";
import CartOrderSummary from "../../components/cart/CartOrderSummary";
import CartStickyBar from "../../components/cart/CartStickyBar";
import LazyMount from "../../components/product/LazyMount";
import { showUndoToast } from "../../components/cart/undoToast";
import { usePromoCode } from "../../components/cart/usePromoCode";
import {
  cartContent,
  flatShippingRate,
  freeShippingThreshold,
  homeRails,
} from "../../mocks/storefrontMock";
import { formatCategoryName } from "../../utils/categories";
import { roundMoney } from "../../utils/money";

function Cart() {
  const {
    cartItems,
    addToCart,
    addToFavorites,
    favorites,
    removeFromCart,
  } = useContext(CartContext);
  const promo = usePromoCode();

  const headingRef = useRef(null);
  const summaryRef = useRef(null);
  const [summaryInView, setSummaryInView] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [focusAfterRemoval, setFocusAfterRemoval] = useState(null);

  const hasItems = cartItems.length > 0;

  const cartCount = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + (Number(item.quantity) || 1),
        0,
      ),
    [cartItems],
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total +
          (Number(item.price) || 0) * (Number(item.quantity) || 1),
        0,
      ),
    [cartItems],
  );

  const shipping =
    subtotal >= freeShippingThreshold ? 0 : flatShippingRate;
  const discount = promo.isApplied
    ? roundMoney((subtotal * promo.discountPercent) / 100)
    : 0;
  const total = roundMoney(Math.max(0, subtotal + shipping - discount));

  // Hide the mobile checkout bar once any part of the real summary is visible.
  useEffect(() => {
    if (!hasItems) {
      setSummaryInView(false);
      return undefined;
    }

    const target = summaryRef.current;

    if (!target || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setSummaryInView(entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasItems]);

  // Keep the bar out of the footer, including jumps straight to the bottom.
  useEffect(() => {
    if (!hasItems) {
      setFooterVisible(false);
      return undefined;
    }

    const footer = document.querySelector("footer");

    if (!footer || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { rootMargin: "0px 0px 120px 0px", threshold: 0 },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, [hasItems]);

  const showStickyBar = hasItems && !summaryInView && !footerVisible;

  useEffect(() => {
    if (!showStickyBar) return undefined;

    document.body.classList.add("cart-sticky-bar-visible");

    return () => {
      document.body.classList.remove("cart-sticky-bar-visible");
    };
  }, [showStickyBar]);

  // Move focus to the next item's Remove button (or the page heading) after a
  // line is removed. The target is resolved after the list re-renders.
  useEffect(() => {
    if (focusAfterRemoval === null) return;

    const target =
      focusAfterRemoval === "heading"
        ? headingRef.current
        : document.querySelector(
            `[data-cart-remove="${focusAfterRemoval}"]`,
          );

    target?.focus();
    setFocusAfterRemoval(null);
  }, [cartItems, focusAfterRemoval]);

  const moveFocusAfterItem = (item) => {
    const index = cartItems.findIndex(
      (entry) => entry.id === item.id,
    );
    const next =
      cartItems[index + 1] ?? cartItems[index - 1] ?? null;

    setFocusAfterRemoval(next ? next.id : "heading");
  };

  const handleRemove = (item) => {
    moveFocusAfterItem(item);
    removeFromCart(item.id);

    showUndoToast({
      title: item.title,
      onUndo: () => {
        const units = Math.max(1, Number(item.quantity) || 1);

        for (let index = 0; index < units; index += 1) {
          addToCart(item);
        }
      },
    });
  };

  const handleSaveForLater = (item) => {
    moveFocusAfterItem(item);
    const wasFavorite = favorites.some(
      (favorite) => favorite.id === item.id,
    );

    addToFavorites(item);
    removeFromCart(item.id);

    if (wasFavorite) {
      notify.info(
        `${item.title} removed from cart. It was already in your favorites.`,
      );
    } else {
      notify.success(`${item.title} moved to favorites.`);
    }
  };

  const firstCategory = cartItems[0]?.category || "";

  const suggestions = useMemo(() => {
    if (firstCategory) {
      return {
        id: "cart-suggestions",
        title: cartContent.suggestions.title,
        subtitle: cartContent.suggestions.subtitleCategory.replace(
          "{category}",
          formatCategoryName(firstCategory),
        ),
        endpoint: `https://dummyjson.com/products/category/${encodeURIComponent(
          firstCategory,
        )}?limit=12`,
      };
    }

    return {
      ...homeRails.bestSellers,
      id: "cart-suggestions",
      title: cartContent.suggestions.title,
      subtitle: cartContent.suggestions.subtitle,
    };
  }, [firstCategory]);

  const unitLabel = cartCount === 1 ? "item" : "items";

  return (
    <PageTransition>
      <div className="pb-24 md:pb-16">
        <div className="mx-auto w-[90%] max-w-337.5 pt-6 sm:pt-8">
          <header className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-wide text-ink-secondary">
              Shopping cart
            </p>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="mt-1 text-h3 font-bold leading-tight text-ink sm:text-h2"
            >
              {cartContent.title}{" "}
              <span className="text-ink-secondary">
                ({cartCount} {unitLabel})
              </span>
            </h1>
          </header>

          {!hasItems ? (
            <Card>
              <EmptyState
                icon={<TiShoppingCart />}
                title={cartContent.empty.title}
                description={cartContent.empty.description}
                action={
                  <Button as={Link} to="/" variant="primary">
                    {cartContent.empty.cta}
                  </Button>
                }
              />
            </Card>
          ) : (
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_25rem]">
              <section
                aria-labelledby="cart-items-heading"
                className="min-w-0"
              >
                <Card className="px-4 sm:px-6">
                  <div className="flex items-center justify-between gap-3 border-b border-border py-4">
                    <h2
                      id="cart-items-heading"
                      className="text-h5 font-bold text-ink"
                    >
                      {cartContent.itemsLabel}{" "}
                      <span className="text-ink-secondary">
                        ({cartCount})
                      </span>
                    </h2>
                    <p className="text-xs text-ink-secondary">
                      Prices in USD
                    </p>
                  </div>

                  <ul aria-label="Cart items" className="list-none">
                    {cartItems.map((item) => (
                      <CartLineItem
                        key={item.id}
                        item={item}
                        isFavorite={favorites.some(
                          (favorite) => favorite.id === item.id,
                        )}
                        onRemove={handleRemove}
                        onSaveForLater={handleSaveForLater}
                      />
                    ))}
                  </ul>
                </Card>
              </section>

              <CartOrderSummary
                summaryRef={summaryRef}
                subtotal={subtotal}
                shipping={shipping}
                discount={discount}
                total={total}
                promo={promo}
              />
            </div>
          )}
        </div>

        <LazyMount
          rootMargin="320px 0px"
          fallback={
            <div className="mt-12">
              <div className="mx-auto w-[90%] max-w-337.5">
                <RailSkeleton />
              </div>
            </div>
          }
        >
          <ProductRail
            rail={suggestions}
            excludeIds={cartItems.map((item) => item.id)}
          />
        </LazyMount>

        <CartStickyBar visible={showStickyBar} total={total} />
      </div>
    </PageTransition>
  );
}

export default Cart;
