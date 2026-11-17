import React from "react";
import Skeleton from "../../components/ui/Skeleton";

function ProductDetailsLoading() {
  return (
    <div role="status">
      <span className="sr-only">Loading product details...</span>

      <div className="py-12.5">
        <div className="mx-auto flex w-[90%] max-w-337.5 flex-col items-center gap-10 md:flex-row md:items-center md:justify-between md:gap-0">
          <Skeleton
            rounded="rounded-lg"
            className="h-72 w-full md:h-150 md:w-[40%]"
          />

          <div className="w-full space-y-5 md:w-[58%] md:pt-25">
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton rounded="rounded-pill" className="h-12 w-48" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsLoading;
