import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown, FiGrid } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { CategoryContext } from "../category/categoryContextValue";
import Button from "../ui/Button";
import { cn } from "../ui/cn";
import {
  getFeaturedCategories,
  groupCategories,
} from "../../utils/categories";
import { megaMenuPromo, pageLinks } from "../../mocks/storefrontMock";

const DESKTOP_LINK =
  "relative flex h-12 shrink-0 items-center gap-1 border-b-[3px] px-2 text-sm font-medium text-ink-secondary transition-colors hover:text-ink";
const ACTIVE_LINK = "border-brand font-semibold text-ink";
const INACTIVE_LINK = "border-transparent";

function CategoryNav({ onOpenCategories }) {
  const { categories } = useContext(CategoryContext);
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const rowRef = useRef(null);
  const triggerRef = useRef(null);
  const openTimer = useRef(null);
  const closeTimer = useRef(null);

  const featured = useMemo(
    () => getFeaturedCategories(categories),
    [categories],
  );
  const groups = useMemo(() => groupCategories(categories), [categories]);

  const activePath = location.pathname;

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    return () => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!rowRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const clearTimers = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  };

  const scheduleOpen = () => {
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => setOpen(true), 120);
  };

  const scheduleClose = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 200);
  };

  const cancelClose = () => {
    window.clearTimeout(closeTimer.current);
  };

  const toggleMenu = () => {
    clearTimers();
    setOpen((current) => !current);
  };

  const closeMenu = () => setOpen(false);

  return (
    <div
      ref={rowRef}
      className="relative border-b border-border bg-surface shadow-nav"
    >
      <div className="mx-auto flex w-[90%] max-w-337.5 items-center justify-between gap-4">
        <nav
          aria-label="Product categories"
          className="hidden min-w-0 flex-1 items-center gap-1 lg:flex"
        >
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={open}
            aria-controls="category-mega-menu"
            onClick={toggleMenu}
            onMouseEnter={scheduleOpen}
            onMouseLeave={scheduleClose}
            className={cn(
              "flex h-12 shrink-0 cursor-pointer items-center gap-2 border-b-[3px] px-2 text-sm font-semibold text-ink transition-colors hover:text-ink-secondary",
              open ? "border-brand" : "border-transparent",
            )}
          >
            <FiGrid aria-hidden="true" className="text-[18px]" />
            <span>All categories</span>
            <FiChevronDown
              aria-hidden="true"
              className={cn(
                "text-[16px] transition-transform duration-200 motion-reduce:transition-none",
                open && "rotate-180",
              )}
            />
          </button>

          {featured.map((category, index) => {
            const active = activePath === `/category/${category.slug}`;

            return (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  DESKTOP_LINK,
                  index >= 4 && "hidden xl:flex",
                  active ? ACTIVE_LINK : INACTIVE_LINK,
                )}
              >
                {category.name}
              </Link>
            );
          })}
        </nav>

        <nav
          aria-label="Store pages"
          className="hidden shrink-0 items-center gap-1 lg:flex"
        >
          {pageLinks.map((item) => {
            const active = activePath === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  DESKTOP_LINK,
                  active ? ACTIVE_LINK : INACTIVE_LINK,
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="relative w-full min-w-0 lg:hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 start-0 z-10 w-6 bg-gradient-to-r from-surface to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 end-0 z-10 w-6 bg-gradient-to-l from-surface to-transparent"
          />

          <div className="flex snap-x snap-mandatory items-center gap-1 overflow-x-auto overscroll-x-contain scroll-px-2 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={onOpenCategories}
              className="flex h-12 shrink-0 snap-start cursor-pointer items-center gap-2 border-b-[3px] border-transparent px-2 text-sm font-semibold text-ink"
              aria-haspopup="dialog"
            >
              <FiGrid aria-hidden="true" className="text-[18px]" />
              All categories
            </button>

            {categories.map((category) => {
              const active = activePath === `/category/${category.slug}`;

              return (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-12 shrink-0 snap-start items-center border-b-[3px] px-2 text-sm font-medium text-ink-secondary",
                    active ? ACTIVE_LINK : INACTIVE_LINK,
                  )}
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5.5rem above the panel: 2.5rem announcement bar + 3rem category row. */}
      <div
        id="category-mega-menu"
        aria-hidden={!open}
        inert={!open}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        className={cn(
          "absolute inset-x-0 top-full z-dropdown max-h-[calc(100dvh_-_var(--header-height)_-_5.5rem)] overflow-y-auto border-b border-border bg-surface shadow-nav transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none",
          open
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-1 opacity-0",
        )}
      >
        <div className="mx-auto w-[90%] max-w-337.5 py-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-7 md:grid-cols-3 lg:grid-cols-6">
            {groups.map((group) => (
              <div key={group.id}>
                <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted">
                  {group.title}
                </h3>
                <ul className="list-none space-y-0.5">
                  {group.items.map((category) => {
                    const active =
                      activePath === `/category/${category.slug}`;

                    return (
                      <li key={category.slug}>
                        <Link
                          to={`/category/${category.slug}`}
                          onClick={closeMenu}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex min-h-10 items-center rounded-sm px-2 text-sm text-ink-secondary hover:bg-surface-subtle hover:text-ink",
                            active && "bg-surface-subtle font-semibold text-ink",
                          )}
                        >
                          {category.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <div className="col-span-2 md:col-span-3 lg:col-span-2">
              <div className="flex h-full flex-col justify-between rounded-xl bg-gradient-to-br from-brand-soft via-brand to-brand-hover p-4 text-ink">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-ink">
                    {megaMenuPromo.eyebrow}
                  </p>
                  <p className="mt-2 text-h5 font-bold">{megaMenuPromo.title}</p>
                  <p className="mt-2 text-sm text-ink/80">
                    {megaMenuPromo.description}
                  </p>
                </div>

                <Button
                  as={Link}
                  to={megaMenuPromo.ctaTo}
                  variant="secondary"
                  size="sm"
                  onClick={closeMenu}
                  className="mt-4 w-full"
                >
                  {megaMenuPromo.ctaLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryNav;
