import { FiGrid, FiList, FiSliders } from "react-icons/fi";
import Button from "../ui/Button";
import Select from "../ui/Select";
import { cn } from "../ui/cn";
import { LISTING_SORTS } from "../../utils/listing";

function ListingToolbar({
  total,
  baseTotal,
  isFiltered,
  activeCount,
  sort,
  view,
  onSortChange,
  onViewChange,
  onOpenFilters,
  loading,
}) {
  const countText = loading
    ? "Loading products…"
    : isFiltered
      ? `${total} of ${baseTotal} product${baseTotal === 1 ? "" : "s"}`
      : `${total} product${total === 1 ? "" : "s"}`;

  return (
    <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          id="listing-filters-button"
          variant="outline"
          size="sm"
          leftIcon={<FiSliders aria-hidden="true" />}
          onClick={onOpenFilters}
          aria-label={
            activeCount > 0
              ? `Open filters, ${activeCount} active`
              : "Open filters"
          }
          className="lg:hidden"
        >
          Filters
          {activeCount > 0 ? (
            <span
              aria-hidden="true"
              className="inline-flex h-5 min-w-5 items-center justify-center rounded-pill bg-ink px-1.5 text-[11px] font-bold text-white"
            >
              {activeCount}
            </span>
          ) : null}
        </Button>

        <p
          aria-live="polite"
          aria-atomic="true"
          className="text-sm font-medium text-ink-secondary"
        >
          {countText}
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <Select
          label="Sort by"
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          options={LISTING_SORTS}
          className="w-full min-w-52 sm:w-56"
        />

        <div
          role="group"
          aria-label="View mode"
          className="flex items-center gap-1 rounded-pill border border-border bg-surface p-1"
        >
          <button
            type="button"
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            onClick={() => onViewChange("grid")}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-pill transition-colors duration-150 motion-reduce:transition-none",
              view === "grid"
                ? "bg-ink text-white"
                : "text-ink-secondary hover:bg-surface-subtle hover:text-ink",
            )}
          >
            <FiGrid aria-hidden="true" className="text-[18px]" />
          </button>

          <button
            type="button"
            aria-label="List view"
            aria-pressed={view === "list"}
            onClick={() => onViewChange("list")}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-pill transition-colors duration-150 motion-reduce:transition-none",
              view === "list"
                ? "bg-ink text-white"
                : "text-ink-secondary hover:bg-surface-subtle hover:text-ink",
            )}
          >
            <FiList aria-hidden="true" className="text-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListingToolbar;
