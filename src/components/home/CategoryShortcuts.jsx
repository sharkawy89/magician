import {
  FiActivity,
  FiBox,
  FiSmartphone,
  FiStar,
  FiSun,
  FiShoppingBag,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { homeCategoryTiles } from "../../mocks/storefrontMock";

const ICONS = {
  beauty: FiStar,
  phone: FiSmartphone,
  chair: FiBox,
  home: FiSun,
  basket: FiShoppingBag,
  sports: FiActivity,
};

function CategoryShortcuts() {
  return (
    <section aria-labelledby="home-categories-heading" className="mt-10 sm:mt-12">
      <div className="mx-auto w-[90%] max-w-337.5">
        <h2
          id="home-categories-heading"
          className="mb-4 text-h4 font-bold text-ink sm:text-h3"
        >
          Shop by category
        </h2>

        <ul className="grid list-none grid-cols-3 gap-3 sm:grid-cols-6">
          {homeCategoryTiles.map((tile) => {
            const Icon = ICONS[tile.icon] ?? FiBox;

            return (
              <li key={tile.slug}>
                <Link
                  to={`/category/${tile.slug}`}
                  className="group flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-surface px-2 py-4 text-center transition-colors duration-200 hover:border-ink hover:bg-brand-soft motion-reduce:transition-none"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-pill bg-surface-subtle text-ink transition-colors duration-200 group-hover:bg-brand motion-reduce:transition-none">
                    <Icon aria-hidden="true" className="text-[20px]" />
                  </span>
                  <span className="text-xs font-semibold text-ink sm:text-sm">
                    {tile.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default CategoryShortcuts;
