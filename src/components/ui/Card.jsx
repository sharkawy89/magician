import { cn } from "./cn";

function Card({
  as = "div",
  hover = false,
  className = "",
  children,
  ...props
}) {
  const Tag = as || "div";

  return (
    <Tag
      {...props}
      className={cn(
        "rounded-xl border border-border bg-surface shadow-card",
        hover &&
          "transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card-hover",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export default Card;
