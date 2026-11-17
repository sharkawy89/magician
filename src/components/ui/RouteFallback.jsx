import { Skeleton, SkeletonText } from "./Skeleton";

/**
 * Accessible fallback for lazily loaded routes. Uses the same skeleton shimmer
 * as the listing pages and drops its animation under reduced motion (see
 * index.css).
 */
function RouteFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto w-[90%] max-w-337.5 py-10 sm:py-12"
    >
      <span className="sr-only">Loading page…</span>

      <Skeleton rounded="rounded-lg" className="h-8 w-52 max-w-full" />
      <SkeletonText lines={2} className="mt-4 max-w-xl" />

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="rounded-xl border border-border bg-surface p-4 shadow-card"
          >
            <Skeleton rounded="rounded-lg" className="aspect-4/3 w-full" />
            <SkeletonText lines={2} className="mt-4" />
            <Skeleton rounded="rounded-sm" className="mt-3 h-5 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default RouteFallback;
