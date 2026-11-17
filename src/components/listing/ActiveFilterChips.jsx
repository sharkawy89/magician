import { FiX } from "react-icons/fi";
import { formatMoney } from "../../utils/listing";

function ActiveFilterChips({ filters, onRemove, onClearAll }) {
  const chips = [];

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    const label =
      filters.minPrice !== null && filters.maxPrice !== null
        ? `${formatMoney(filters.minPrice)} – ${formatMoney(filters.maxPrice)}`
        : filters.minPrice !== null
          ? `From ${formatMoney(filters.minPrice)}`
          : `Up to ${formatMoney(filters.maxPrice)}`;

    chips.push({
      id: "price",
      label,
      onRemove: () => onRemove({ minPrice: null, maxPrice: null }),
    });
  }

  if (filters.rating) {
    chips.push({
      id: "rating",
      label: `${filters.rating} stars & up`,
      onRemove: () => onRemove({ rating: null }),
    });
  }

  for (const brand of filters.brands) {
    chips.push({
      id: `brand-${brand}`,
      label: brand,
      onRemove: () =>
        onRemove({
          brands: filters.brands.filter((item) => item !== brand),
        }),
    });
  }

  if (filters.inStock) {
    chips.push({
      id: "in-stock",
      label: "In stock only",
      onRemove: () => onRemove({ inStock: false }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-4">
      <ul className="flex list-none flex-wrap items-center gap-2">
        {chips.map((chip) => (
          <li key={chip.id}>
            <button
              type="button"
              onClick={chip.onRemove}
              aria-label={`Remove filter: ${chip.label}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-pill border border-border-strong bg-surface ps-3 pe-2 text-xs font-semibold text-ink transition-colors duration-150 hover:border-ink hover:bg-surface-subtle motion-reduce:transition-none"
            >
              {chip.label}
              <FiX aria-hidden="true" className="text-[14px]" />
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-bold text-info underline underline-offset-2"
      >
        Clear all
      </button>
    </div>
  );
}

export default ActiveFilterChips;
