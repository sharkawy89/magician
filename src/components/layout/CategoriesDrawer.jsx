import { useContext, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { CategoryContext } from "../category/categoryContextValue";
import Button from "../ui/Button";
import Drawer from "../ui/Drawer";
import { cn } from "../ui/cn";
import { groupCategories } from "../../utils/categories";

function CategoriesDrawer({ open, onClose }) {
  const { categories, status, isOffline, retry } = useContext(CategoryContext);
  const location = useLocation();
  const groups = useMemo(() => groupCategories(categories), [categories]);

  const showNotice = isOffline || status === "fallback";
  const showEmpty = status === "empty" && groups.length === 0;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="All categories"
      side="bottom"
    >
      {status === "loading" ? (
        <p className="py-6 text-sm text-ink-secondary">
          Loading categories…
        </p>
      ) : showEmpty ? (
        <div className="flex flex-col items-start gap-4 py-6">
          <p className="text-sm text-ink-secondary">
            No categories are available right now.
          </p>
          <Button variant="outline" size="sm" onClick={retry}>
            Retry loading categories
          </Button>
        </div>
      ) : (
        <div className="space-y-6 pb-2">
          {showNotice ? (
            <div className="rounded-lg border border-border bg-surface-subtle p-3">
              <p className="text-sm text-ink-secondary">
                {isOffline
                  ? "You're offline. Showing your saved categories."
                  : "We couldn't refresh categories. Showing your saved list."}
              </p>
              {!isOffline ? (
                <Button
                  variant="link"
                  size="sm"
                  onClick={retry}
                  className="mt-1"
                >
                  Try again
                </Button>
              ) : null}
            </div>
          ) : null}

          {groups.map((group) => (
            <section key={group.id}>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted">
                {group.title}
              </p>
              <ul className="grid list-none grid-cols-2 gap-x-4">
                {group.items.map((category) => {
                  const active =
                    location.pathname === `/category/${category.slug}`;

                  return (
                    <li key={category.slug}>
                      <Link
                        to={`/category/${category.slug}`}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex min-h-10 items-center border-b border-border py-2 text-sm text-ink-secondary",
                          active && "font-semibold text-ink",
                        )}
                      >
                        {category.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </Drawer>
  );
}

export default CategoriesDrawer;
