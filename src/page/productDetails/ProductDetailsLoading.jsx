import { Skeleton, SkeletonText } from "../../components/ui/Skeleton";

function ProductDetailsLoading() {
  return (
    <div
      role="status"
      className="mx-auto w-[90%] max-w-337.5 pt-5 sm:pt-7"
    >
      <span className="sr-only">Loading product details…</span>

      <Skeleton rounded="rounded-sm" className="h-4 w-56 max-w-full" />

      <div className="mt-5 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <Skeleton rounded="rounded-xl" className="aspect-square w-full" />
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton
                key={index}
                rounded="rounded-lg"
                className="h-14 w-14 shrink-0 sm:h-20 sm:w-20"
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <Skeleton rounded="rounded-sm" className="h-4 w-32 max-w-full" />
          <Skeleton rounded="rounded-sm" className="h-9 w-4/5" />
          <Skeleton rounded="rounded-sm" className="h-5 w-48 max-w-full" />
          <Skeleton rounded="rounded-sm" className="h-8 w-40 max-w-full" />
          <Skeleton rounded="rounded-pill" className="h-6 w-32 max-w-full" />
          <Skeleton rounded="rounded-lg" className="h-20 w-full" />
          <div className="flex flex-wrap gap-3">
            <Skeleton rounded="rounded-lg" className="h-11 w-full max-w-36" />
            <Skeleton rounded="rounded-pill" className="h-12 w-full max-w-40" />
            <Skeleton rounded="rounded-pill" className="h-12 w-12 shrink-0" />
          </div>
          <SkeletonText lines={3} />
        </div>
      </div>

      <div className="mt-10 sm:mt-14">
        <Skeleton rounded="rounded-sm" className="h-10 w-full" />
        <SkeletonText lines={4} className="mt-6 max-w-3xl" />
      </div>
    </div>
  );
}

export default ProductDetailsLoading;
