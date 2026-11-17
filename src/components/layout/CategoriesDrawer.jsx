import { useContext, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { CategoryContext } from "../category/categoryContextValue";
import Drawer from "../ui/Drawer";
import { cn } from "../ui/cn";
import { groupCategories } from "../../utils/categories";

function CategoriesDrawer({ open, onClose }) {
  const { categories, status } = useContext(CategoryContext);
  const location = useLocation();
  const groups = useMemo(() => groupCategories(categories), [categories]);

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
      ) : groups.length === 0 ? (
        <p className="py-6 text-sm text-ink-secondary">
          Categories are unavailable right now.
        </p>
      ) : (
        <div className="space-y-6 pb-2">
          {groups.map((group) => (
            <section key={group.id}>
              <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted">
                {group.title}
              </h3>
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
