import { useId } from "react";
import { cn } from "./cn";

function Input({
  id,
  label,
  error,
  helper,
  shape = "default",
  startIcon = null,
  endIcon = null,
  endAdornment = null,
  required = false,
  bare = false,
  inputRef = null,
  className = "",
  inputClassName = "",
  "aria-describedby": describedByProp,
  "aria-invalid": invalidProp,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || `input-${generatedId}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helper ? `${inputId}-helper` : undefined;
  const describedBy =
    [describedByProp, error ? errorId : helperId].filter(Boolean).join(" ") ||
    undefined;

  const hasEnd = Boolean(endIcon || endAdornment);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-ink"
        >
          {label}
          {required ? (
            <span className="text-danger" aria-hidden="true">
              {" "}
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <div className="relative">
        {startIcon ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted"
          >
            {startIcon}
          </span>
        ) : null}

        <input
          {...props}
          ref={inputRef}
          id={inputId}
          required={required}
          aria-invalid={error ? true : invalidProp}
          aria-describedby={describedBy}
          className={cn(
            bare
              ? "h-11 w-full min-w-0 bg-transparent text-body text-ink placeholder:text-muted disabled:cursor-not-allowed disabled:text-muted"
              : cn(
                  "h-11 w-full border bg-surface text-body text-ink transition-colors duration-150 placeholder:text-muted disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-muted",
                  shape === "pill" ? "rounded-pill" : "rounded-lg",
                  error ? "border-danger" : "border-border-strong",
                  startIcon ? "ps-10" : "ps-3.5",
                  hasEnd ? "pe-12" : "pe-3.5",
                  "focus-visible:border-ink",
                ),
            inputClassName,
          )}
        />

        {endIcon && !endAdornment ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-muted"
          >
            {endIcon}
          </span>
        ) : null}

        {endAdornment ? (
          <span className="absolute end-1 top-1/2 -translate-y-1/2">
            {endAdornment}
          </span>
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

export default Input;
