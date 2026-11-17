import { useId } from "react";
import { cn } from "./cn";

function Radio({
  id,
  label,
  description,
  error,
  helper,
  className = "",
  ...props
}) {
  const generatedId = useId();
  const inputId = id || `radio-${generatedId}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helper ? `${inputId}-helper` : undefined;
  const describedBy = error ? errorId : helperId;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex min-h-10 items-center gap-2.5">
        <span className="relative inline-flex h-5 w-5 shrink-0">
          <input
            {...props}
            id={inputId}
            type="radio"
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className="peer h-5 w-5 cursor-pointer appearance-none rounded-pill border border-border-strong bg-surface transition-colors duration-150 checked:border-ink disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ink"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 m-auto h-2.5 w-2.5 rounded-pill bg-ink opacity-0 transition-opacity duration-150 peer-checked:opacity-100"
          />
        </span>

        {label ? (
          <label
            htmlFor={inputId}
            className="flex flex-1 cursor-pointer select-none flex-col justify-center self-stretch text-sm text-ink"
          >
            {label}
            {description ? (
              <span className="mt-0.5 block text-caption text-ink-secondary">
                {description}
              </span>
            ) : null}
          </label>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} className="text-caption font-medium text-danger">
          {error}
        </p>
      ) : helper ? (
        <p id={helperId} className="text-caption text-ink-secondary">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

export default Radio;
