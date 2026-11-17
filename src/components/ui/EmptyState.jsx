import { cn } from "./cn";

function EmptyState({ icon, title, description, action, className = "" }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-12 text-center",
        className,
      )}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-pill bg-brand-soft text-[26px] text-ink"
        >
          {icon}
        </span>
      ) : null}

      <h3 className="text-h5 font-bold text-ink">{title}</h3>

      {description ? (
        <p className="mt-2 max-w-md text-sm text-ink-secondary">
          {description}
        </p>
      ) : null}

      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
