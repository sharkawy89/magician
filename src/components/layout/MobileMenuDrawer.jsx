import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from "../context/cartContextValue";
import Drawer from "../ui/Drawer";
import Badge from "../ui/Badge";
import { cn } from "../ui/cn";
import { accountLinks, mobileMenuLinks } from "../../mocks/storefrontMock";

const ITEM_CLASS =
  "flex min-h-12 items-center justify-between gap-3 border-b border-border text-sm font-medium text-ink-secondary";
const ACTIVE_CLASS = "font-bold text-ink";

function MobileMenuDrawer({ open, onClose }) {
  const location = useLocation();
  const { favorites } = useContext(CartContext);

  return (
    <Drawer open={open} onClose={onClose} title="Menu" side="left">
      <nav aria-label="Mobile menu">
        <ul className="list-none">
          {mobileMenuLinks.map((item) => {
            const active = location.pathname === item.to;

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={cn(ITEM_CLASS, "hover:text-ink", active && ACTIVE_CLASS)}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}

          <li>
            <Link
              to="/favorites"
              onClick={onClose}
              aria-current={
                location.pathname === "/favorites" ? "page" : undefined
              }
              className={cn(
                ITEM_CLASS,
                "hover:text-ink",
                location.pathname === "/favorites" && ACTIVE_CLASS,
              )}
            >
              <span>Wishlist</span>
              <Badge variant="neutral" size="sm">
                {favorites.length}
              </Badge>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-6">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-muted">
          Account
        </p>
        <ul className="list-none">
          {accountLinks.map((item) => {
            const active = location.pathname === item.to;

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={cn(ITEM_CLASS, "hover:text-ink", active && ACTIVE_CLASS)}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </Drawer>
  );
}

export default MobileMenuDrawer;
