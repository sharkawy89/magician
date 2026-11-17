import Card from "./Card";
import { cn } from "./cn";

function Skeleton({ className = "", rounded = "rounded-md", ...props }) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cn("skeleton", rounded, className)}
    />
  );
}

function SkeletonText({ lines = 1, className = "", lineClassName = "" }) {
  return (
    <div aria-hidden="true" className={cn("space-y-2", className)}>
      {Array.from({ length: Math.max(1, lines) }, (_, index) => (
        <Skeleton
          key={index}
          rounded="rounded-sm"
          className={cn(
            "h-4 w-full",
            lines > 1 && index === lines - 1 && "w-2/3",
            lineClassName,
          )}
        />
      ))}
    </div>
  );
}

function SkeletonCard({ className = "" }) {
  return (
    <Card className={cn("w-full overflow-hidden p-4", className)}>
      <Skeleton
        rounded="rounded-lg"
        className="mb-4 aspect-4/3 w-full"
      />
      <SkeletonText lines={2} />
      <div className="mt-4 flex items-center justify-between gap-3">
        <Skeleton className="h-6 w-20" />
        <Skeleton rounded="rounded-pill" className="h-8 w-8" />
      </div>
    </Card>
  );
}

const AVATAR_SIZES = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
  xl: "h-20 w-20",
};

function SkeletonAvatar({ size = "md", className = "" }) {
  return (
    <Skeleton
      rounded="rounded-pill"
      className={cn(AVATAR_SIZES[size] ?? AVATAR_SIZES.md, className)}
    />
  );
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonAvatar };
export default Skeleton;
