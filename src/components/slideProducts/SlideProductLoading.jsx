import React from "react";
import Card from "../ui/Card";
import Skeleton, { SkeletonText } from "../ui/Skeleton";

function SlideProductLoading() {
  return (
    <div role="status">
      <span className="sr-only">Loading products...</span>

      <div className="py-12.5">
        <div className="mx-auto w-[90%] max-w-337.5">
          <div className="relative mb-5 h-26.25 border-b border-border pt-3.75 pe-5 pb-5 after:absolute after:-bottom-px after:h-0.5 after:w-25 after:bg-brand after:content-['']">
            <Skeleton className="mb-2.5 h-8.75 w-62.5" />
            <Skeleton className="h-6.25 w-87.5 max-w-full" />
          </div>

          <div className="flex gap-7.5 overflow-hidden">
            {[0, 1, 2].map((index) => (
              <Card
                key={index}
                className="w-62.5 shrink-0 px-3.75 py-6.25"
              >
                <Skeleton className="mb-7.5 h-45 w-full" />
                <SkeletonText lines={2} />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SlideProductLoading;
