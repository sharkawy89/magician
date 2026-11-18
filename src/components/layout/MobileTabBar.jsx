import { useContext } from "react";
import { FiGrid, FiHome, FiSearch, FiUser } from "react-icons/fi";
import { TiShoppingCart } from "react-icons/ti";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from "../context/cartContextValue";
import { MiniCartContext } from "../context/miniCartContextValue";
import Badge from "../ui/Badge";
import { cn } from "../ui/cn";

function TabIcon({ active, children, count }) {
  return (
    <span
      className={cn(
        "relative flex h-7 w-12 items-center justify-center rounded-pill",
        active && "bg-brand",
      )}
    >
      {children}
      {typeof count === "number" && count > 0 ? (
        <span aria-hidden="true" className="absolute -top-1.5 end-0">
          <Badge
            variant="ink"
            size="sm"
            className="h-5 min-w-5 justify-center px-1"
          >
            {count > 99 ? "99+" : count}
          </Badge>
        </span>
      ) : null}
    </span>
  );
}

function tabClass(active) {
  return cn(
    "flex h-14 min-h-12 w-full flex-col items-center justify-center gap-0.5",
    active ? "text-ink" : "text-ink-secondary",
  );
}

function tabLabelClass(active) {
  return cn(
    "text-[11px] leading-none",
    active ? "font-bold text-ink" : "font-medium text-ink-secondary",
  );
}

function MobileTabBar({ onOpenCategories, onFocusSearch }) {
  const location = useLocation();
  const { cartItems } = useContext(CartContext);
  const { openMiniCart } = useContext(MiniCartContext);

  const path = location.pathname;
  const homeActive = path === "/";
  const categoriesActive = path.startsWith("/category/");
  const searchActive = path === "/search";
  const cartActive = path === "/cart";
  const accountActive = path === "/login" || path === "/register";

  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0,
  );

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-header overflow-x-auto bg-surface pb-[env(safe-area-inset-bottom)] shadow-tabbar md:hidden"
    >
      <ul className="mx-auto grid h-14 max-w-lg list-none grid-cols-5">
        <li>
          <Link
            to="/"
            aria-current={homeActive ? "page" : undefined}
            className={tabClass(homeActive)}
          >
            <TabIcon active={homeActive}>
              <FiHome aria-hidden="true" className="text-[20px]" />
            </TabIcon>
            <span className={tabLabelClass(homeActive)}>Home</span>
          </Link>
        </li>

        <li>
          <button
            type="button"
            onClick={onOpenCategories}
            aria-label="Browse all categories"
            aria-haspopup="dialog"
            aria-current={categoriesActive ? "page" : undefined}
            className={tabClass(categoriesActive)}
          >
            <TabIcon active={categoriesActive}>
              <FiGrid aria-hidden="true" className="text-[20px]" />
            </TabIcon>
            <span className={tabLabelClass(categoriesActive)}>Categories</span>
          </button>
        </li>

        <li>
          <button
            type="button"
            onClick={onFocusSearch}
            aria-label="Focus search"
            aria-current={searchActive ? "page" : undefined}
            className={tabClass(searchActive)}
          >
            <TabIcon active={searchActive}>
              <FiSearch aria-hidden="true" className="text-[20px]" />
            </TabIcon>
            <span className={tabLabelClass(searchActive)}>Search</span>
          </button>
        </li>

        <li>
          <button
            type="button"
            onClick={openMiniCart}
            aria-label={`Open cart, ${cartCount} ${
              cartCount === 1 ? "item" : "items"
            }`}
            aria-haspopup="dialog"
            aria-current={cartActive ? "page" : undefined}
            className={tabClass(cartActive)}
          >
            <TabIcon active={cartActive} count={cartCount}>
              <TiShoppingCart aria-hidden="true" className="text-[22px]" />
            </TabIcon>
            <span className={tabLabelClass(cartActive)}>Cart</span>
          </button>
        </li>

        <li>
          <Link
            to="/login"
            aria-current={path === "/login" ? "page" : undefined}
            className={tabClass(accountActive)}
          >
            <TabIcon active={accountActive}>
              <FiUser aria-hidden="true" className="text-[20px]" />
            </TabIcon>
            <span className={tabLabelClass(accountActive)}>Account</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default MobileTabBar;
