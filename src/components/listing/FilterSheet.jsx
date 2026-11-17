import { useEffect, useState } from "react";
import Drawer from "../ui/Drawer";
import Button from "../ui/Button";
import ListingFilters from "./ListingFilters";
import { FilterSkeleton } from "./FilterSidebar";

function emptyDraft() {
  return {
    minPrice: null,
    maxPrice: null,
    rating: null,
    brands: [],
    inStock: false,
  };
}

function FilterSheet({
  open,
  onClose,
  loading,
  bounds,
  brandFacets,
  ratingFacets,
  appliedValues,
  onApply,
  activeCount = 0,
}) {
  const [draft, setDraft] = useState(() => ({
    ...emptyDraft(),
    ...appliedValues,
  }));

  useEffect(() => {
    if (!open) return;
    setDraft({ ...emptyDraft(), ...appliedValues });
  }, [open, appliedValues]);

  const handleChange = (patch) => {
    setDraft((current) => ({ ...current, ...patch }));
  };

  const handleReset = () => {
    setDraft(emptyDraft());
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="bottom"
      title={activeCount > 0 ? `Filters (${activeCount})` : "Filters"}
      description="Choose the products you want to see."
      closeLabel="Close filters"
      footer={
        <>
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full sm:w-auto"
          >
            Reset
          </Button>
          <Button
            variant="primary"
            onClick={handleApply}
            className="w-full sm:w-auto"
          >
            Apply filters
          </Button>
        </>
      }
    >
      {loading ? (
        <FilterSkeleton />
      ) : (
        <ListingFilters
          idPrefix="sheet"
          bounds={bounds}
          brandFacets={brandFacets}
          ratingFacets={ratingFacets}
          values={draft}
          onChange={handleChange}
          onReset={handleReset}
        />
      )}
    </Drawer>
  );
}

export default FilterSheet;
