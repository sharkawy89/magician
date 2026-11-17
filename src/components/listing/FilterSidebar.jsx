import ListingFilters from "./ListingFilters";
import { Skeleton, SkeletonText } from "../ui/Skeleton";

export function FilterSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <Skeleton rounded="rounded-sm" className="h-6 w-20" />
        <Skeleton rounded="rounded-sm" className="h-4 w-16" />
      </div>

      <div>
        <Skeleton rounded="rounded-sm" className="h-5 w-14" />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Skeleton rounded="rounded-lg" className="h-10 w-full" />
          <Skeleton rounded="rounded-lg" className="h-10 w-full" />
        </div>
        <Skeleton rounded="rounded-pill" className="mt-4 h-2 w-full" />
        <Skeleton rounded="rounded-pill" className="mt-4 h-2 w-full" />
      </div>

      <div className="border-t border-border pt-5">
        <Skeleton rounded="rounded-sm" className="h-5 w-16" />
        <SkeletonText lines={4} className="mt-3" />
      </div>

      <div className="border-t border-border pt-5">
        <Skeleton rounded="rounded-sm" className="h-5 w-16" />
        <SkeletonText lines={5} className="mt-3" />
      </div>
    </div>
  );
}

function FilterSidebar({ loading, ...filterProps }) {
  return (
    <aside aria-label="Product filters" className="hidden lg:block">
      <div className="sticky top-[calc(var(--header-height)+1rem)] max-h-[calc(100dvh-var(--header-height)-2rem)] overflow-y-auto rounded-xl border border-border bg-surface p-5 shadow-card">
        {loading ? <FilterSkeleton /> : <ListingFilters {...filterProps} />}
      </div>
    </aside>
  );
}

export default FilterSidebar;
