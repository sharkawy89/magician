import React from "react";

const LABELS = {
  full: "MAGICIAN Online Store",
  compact: "MAGICIAN",
  icon: "MAGICIAN",
};

const SIZE_CLASSES = {
  full: "h-11 w-auto sm:h-12",
  compact: "h-10 w-auto sm:h-11",
  icon: "h-10 w-10 sm:h-11 sm:w-11",
};

const WORDMARK_FONT =
  "'Plus Jakarta Sans', 'Segoe UI', system-ui, -apple-system, sans-serif";

/**
 * The yellow tilted badge, dark cart and sparkle accent used by every variant.
 * The 64x64 coordinate space matches the icon-only viewBox.
 */
function BrandMark() {
  return (
    <g transform="rotate(-8 32 32)">
      <rect
        x="6"
        y="6"
        width="52"
        height="52"
        rx="16"
        fill="var(--color-brand)"
      />

      <g
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 24h4.4l4 16.5h15.2l3.4-11.8H25.8" />
        <circle cx="31" cy="45.5" r="2.4" fill="var(--color-ink)" stroke="none" />
        <circle cx="42" cy="45.5" r="2.4" fill="var(--color-ink)" stroke="none" />
      </g>

      {/* large sparkle: magic + shopping */}
      <path
        d="M50 4l1.8 4.2L56 10l-4.2 1.8L50 16l-1.8-4.2L44 10l4.2-1.8L50 4Z"
        fill="var(--color-ink)"
      />
      {/* small counter-sparkle */}
      <path
        d="M13 8.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6Z"
        fill="var(--color-ink)"
      />
    </g>
  );
}

function Logo({ variant = "full", className = "", ...props }) {
  const safeVariant = SIZE_CLASSES[variant] ? variant : "full";
  const classes = `${SIZE_CLASSES[safeVariant]} ${className}`.trim();
  const commonProps = {
    role: "img",
    "aria-label": LABELS[safeVariant],
    focusable: "false",
    className: classes,
    ...props,
  };

  if (safeVariant === "icon") {
    return (
      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" {...commonProps}>
        <BrandMark />
      </svg>
    );
  }

  if (safeVariant === "compact") {
    return (
      <svg
        viewBox="0 0 244 64"
        xmlns="http://www.w3.org/2000/svg"
        {...commonProps}
      >
        <BrandMark />
        <text
          x="82"
          y="40"
          fill="currentColor"
          fontFamily={WORDMARK_FONT}
          fontSize="26"
          fontWeight="800"
          letterSpacing="2.2"
        >
          MAGICIAN
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 252 64" xmlns="http://www.w3.org/2000/svg" {...commonProps}>
      <BrandMark />
      <text
        x="82"
        y="36"
        fill="currentColor"
        fontFamily={WORDMARK_FONT}
        fontSize="25"
        fontWeight="800"
        letterSpacing="2.2"
      >
        MAGICIAN
      </text>
      <text
        x="83"
        y="55"
        fill="currentColor"
        fillOpacity="0.65"
        fontFamily={WORDMARK_FONT}
        fontSize="10.5"
        fontWeight="600"
        letterSpacing="1.8"
      >
        Online Store
      </text>
    </svg>
  );
}

export default Logo;
