import { FaRegStar, FaStar, FaStarHalfStroke } from "react-icons/fa6";
import { cn } from "./cn";

const SIZES = {
  sm: "text-[14px]",
  md: "text-[18px]",
  lg: "text-[22px]",
};

function Rating({
  value = 0,
  max = 5,
  count,
  size = "md",
  showValue = false,
  className = "",
}) {
  const safeMax = Math.max(1, Number(max) || 5);
  const safeValue = Math.min(
    Math.max(Number(value) || 0, 0),
    safeMax,
  );
  const reviewLabel = count
    ? `${count} review${Number(count) === 1 ? "" : "s"}`
    : "";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-1.5 gap-y-0.5",
        className,
      )}
    >
      <span
        role="img"
        aria-label={`Rated ${safeValue.toFixed(1)} out of ${safeMax}${
          reviewLabel ? ` from ${reviewLabel}` : ""
        }`}
        className={cn(
          "flex items-center gap-0.5 text-rating [&_svg]:stroke-warning-strong `[&_svg]:stroke-28",
          SIZES[size] ?? SIZES.md,
        )}
      >
        {Array.from({ length: safeMax }, (_, index) => {
          const fill = safeValue - index;

          if (fill >= 0.75) {
            return <FaStar key={index} aria-hidden="true" />;
          }

          if (fill >= 0.25) {
            return <FaStarHalfStroke key={index} aria-hidden="true" />;
          }

          return <FaRegStar key={index} aria-hidden="true" />;
        })}
      </span>

      {count || showValue ? (
        <span className="text-caption text-ink-secondary">
          {showValue ? (
            <span className="font-semibold text-ink">
              {safeValue.toFixed(1)}
            </span>
          ) : null}
          {showValue && reviewLabel ? " · " : null}
          {reviewLabel}
        </span>
      ) : null}
    </div>
  );
}

export default Rating;
