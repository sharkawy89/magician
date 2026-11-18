import { Skeleton, SkeletonText } from "../ui/Skeleton";

/**
 * Reserves the exact height of a product rail while its chunk and data load.
 * Kept free of Swiper imports so Home can use it as a Suspense fallback
 * without pulling the carousel into the first paint.
 */
export function RailSkeleton() {
  return (
    <div aria-hidden="true" className="flex gap-4 overflow-hidden">
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className="w-62.5 shrink-0 rounded-xl border border-border bg-surface p-4"
        >
          <Skeleton rounded="rounded-lg" className="h-40 w-full" />
          <SkeletonText lines={2} className="mt-4" />
          <Skeleton className="mt-4 h-6 w-24" />
        </div>
      ))}
    </div>
  );
}

export default RailSkeleton;
