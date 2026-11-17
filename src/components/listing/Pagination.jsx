import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Button from "../ui/Button";

function getPageItems(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set([1, total, current - 1, current, current + 1]);

  if (current <= 4) {
    [2, 3, 4, 5].forEach((page) => pages.add(page));
  }

  if (current >= total - 3) {
    [total - 1, total - 2, total - 3, total - 4].forEach((page) =>
      pages.add(page),
    );
  }

  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const items = [];

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      items.push(`gap-${page}`);
    }

    items.push(page);
  });

  return items;
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const items = getPageItems(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
    >
      <p className="sr-only" aria-live="polite">
        Page {page} of {totalPages}
      </p>

      <Button
        variant="outline"
        size="sm"
        iconOnly
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <FiChevronLeft aria-hidden="true" className="text-[20px]" />
      </Button>

      <ul className="flex list-none flex-wrap items-center gap-2">
        {items.map((item) =>
          typeof item === "number" ? (
            <li key={item}>
              <Button
                variant={item === page ? "secondary" : "outline"}
                size="sm"
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                onClick={() => onChange(item)}
                className="min-w-10 px-2"
              >
                {item}
              </Button>
            </li>
          ) : (
            <li
              key={item}
              aria-hidden="true"
              className="px-1 text-sm text-ink-secondary"
            >
              &hellip;
            </li>
          ),
        )}
      </ul>

      <Button
        variant="outline"
        size="sm"
        iconOnly
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        <FiChevronRight aria-hidden="true" className="text-[20px]" />
      </Button>
    </nav>
  );
}

export default Pagination;
