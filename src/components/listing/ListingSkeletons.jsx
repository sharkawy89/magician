import { Skeleton, SkeletonText } from "../ui/Skeleton";

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="rounded-xl border border-border bg-surface p-4 shadow-card"
        >
          <Skeleton rounded="rounded-lg" className="aspect-4/3 w-full" />
          <Skeleton rounded="rounded-sm" className="mt-4 h-3 w-16" />
          <SkeletonText lines={2} className="mt-2" />
          <Skeleton rounded="rounded-sm" className="mt-3 h-4 w-28" />
          <Skeleton rounded="rounded-sm" className="mt-2 h-5 w-20" />
          <div className="mt-4 flex gap-2">
            <Skeleton rounded="rounded-pill" className="h-10 flex-1" />
            <Skeleton rounded="rounded-pill" className="h-10 w-10" />
            <Skeleton rounded="rounded-pill" className="h-10 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductListSkeleton({ count = 4 }) {
  return (
    <div aria-hidden="true" className="flex flex-col gap-4">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex gap-3 rounded-xl border border-border bg-surface p-3 shadow-card sm:gap-5 sm:p-4"
        >
          <Skeleton rounded="rounded-lg" className="h-28 w-28 shrink-0 sm:h-36 sm:w-36" />
          <div className="min-w-0 flex-1">
            <Skeleton rounded="rounded-sm" className="h-3 w-20" />
            <SkeletonText lines={2} className="mt-2" />
            <Skeleton rounded="rounded-sm" className="mt-3 h-4 w-32" />
            <Skeleton rounded="rounded-sm" className="mt-2 h-5 w-24" />
            <div className="mt-3 flex gap-2">
              <Skeleton rounded="rounded-pill" className="h-10 w-32" />
              <Skeleton rounded="rounded-pill" className="h-10 w-10" />
              <Skeleton rounded="rounded-pill" className="h-10 w-10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
