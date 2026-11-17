import { useContext } from "react";
import { FaRegHeart, FaRegUser } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { TiShoppingCart } from "react-icons/ti";
import { Link } from "react-router-dom";
import Logo from "../brand/Logo";
import { CartContext } from "../context/cartContextValue";
import { MiniCartContext } from "../context/miniCartContextValue";
import Badge from "../ui/Badge";
import CategoryNav from "./CategoryNav";
import SearchBar from "./SearchBar";

function CountBadge({ count }) {
  if (!count || count < 1) return null;

  const label = count > 99 ? "99+" : String(count);

  return (
    <span aria-hidden="true" className="absolute -top-0.5 -end-1">
      <Badge
        variant="ink"
        size="sm"
        className="h-5 min-w-5 justify-center px-1.5"
      >
        {label}
      </Badge>
    </span>
  );
}

function Tooltip({ label }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute start-1/2 top-full z-dropdown mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs font-medium text-white shadow-panel lg:group-hover:block lg:group-focus-within:block"
    >
      {label}
    </span>
  );
}

function IconLink({ to, label, ariaLabel, children, count }) {
  return (
    <div className="group relative">
      <Link
        to={to}
        aria-label={ariaLabel}
        className="flex h-11 w-11 items-center justify-center rounded-pill text-ink transition-colors hover:bg-brand-hover"
      >
        {children}
        {typeof count === "number" ? <CountBadge count={count} /> : null}
      </Link>
      <Tooltip label={label} />
    </div>
  );
}

function Header({ onOpenMenu, onOpenCategories, searchFocusSignal }) {
  const { cartItems, favorites } = useContext(CartContext);
  const { openMiniCart } = useContext(MiniCartContext);

  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0,
  );
  const favoriteCount = favorites.length;

  return (
    <>
      <header className="sticky top-0 z-header bg-brand text-ink shadow-header">
        <div className="mx-auto w-[90%] max-w-337.5">
          <div className="flex items-center justify-between gap-2 py-2 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-8 lg:py-3">
            <div className="flex min-w-0 items-center gap-1">
              <button
                type="button"
                onClick={onOpenMenu}
                aria-label="Open menu"
                aria-haspopup="dialog"
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-pill text-ink transition-colors hover:bg-brand-hover lg:hidden"
              >
                <FiMenu aria-hidden="true" className="text-[24px]" />
              </button>

              <Link
                to="/"
                aria-label="MAGICIAN Online Store home"
                className="flex shrink-0 items-center text-ink"
              >
                <Logo variant="icon" className="sm:hidden" />
                <Logo variant="compact" className="hidden sm:block lg:hidden" />
                <Logo variant="full" className="hidden lg:block" />
              </Link>
            </div>

            <div className="hidden min-w-0 lg:block">
              <SearchBar
                variant="desktop"
                focusSignal={searchFocusSignal}
              />
            </div>

            <div className="flex items-center gap-0.5 lg:gap-1">
              <div className="hidden items-center gap-0.5 lg:flex">
                <IconLink
                  to="/login"
                  label="Account"
                  ariaLabel="Account, sign in"
                >
                  <FaRegUser aria-hidden="true" className="text-[22px]" />
                </IconLink>

                <IconLink
                  to="/favorites"
                  label="Wishlist"
                  ariaLabel={`Wishlist, ${favoriteCount} ${
                    favoriteCount === 1 ? "saved item" : "saved items"
                  }`}
                  count={favoriteCount}
                >
                  <FaRegHeart aria-hidden="true" className="text-[22px]" />
                </IconLink>
              </div>

              <div className="group relative">
                <button
                  type="button"
                  onClick={openMiniCart}
                  aria-label={`Open cart, ${cartCount} ${
                    cartCount === 1 ? "item" : "items"
                  }`}
                  aria-haspopup="dialog"
                  className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-pill text-ink transition-colors hover:bg-brand-hover"
                >
                  <TiShoppingCart
                    aria-hidden="true"
                    className="text-[26px]"
                  />
                  <CountBadge count={cartCount} />
                </button>
                <Tooltip label="Cart" />
              </div>
            </div>
          </div>

          <div className="pb-2 lg:hidden">
            <SearchBar variant="mobile" focusSignal={searchFocusSignal} />
          </div>
        </div>
      </header>

      <CategoryNav onOpenCategories={onOpenCategories} />
    </>
  );
}

export default Header;
