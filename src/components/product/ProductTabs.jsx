import { useId, useRef, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { cn } from "../ui/cn";
import { getSpecRows } from "../../utils/productDetails";
import ProductReviews from "./ProductReviews";

const TABS = [
  { id: "description", label: "Description" },
  { id: "specs", label: "Specs" },
  { id: "reviews", label: "Reviews" },
];

// PLACEHOLDER: store-level highlights, not product-specific claims from the API.
const SAMPLE_HIGHLIGHTS = [
  "Selected by the MAGICIAN buying team for everyday use.",
  "Ships in protective, recyclable packaging.",
  "Covered by our demo 30-day return promise.",
];

function DescriptionPanel({ product }) {
  return (
    <div className="max-w-3xl">
      <p className="text-body leading-relaxed text-ink-secondary">
        {product.description}
      </p>

      <h2 className="mt-6 text-h5 font-bold text-ink">Highlights</h2>
      <ul className="mt-3 grid list-none gap-2 sm:grid-cols-2">
        {SAMPLE_HIGHLIGHTS.map((highlight) => (
          <li key={highlight} className="flex items-start gap-2 text-sm text-ink">
            <FiCheck
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-success"
            />
            {highlight}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-caption text-muted">
        Highlights are sample storefront copy for this demo.
      </p>
    </div>
  );
}

function SpecsPanel({ product }) {
  const rows = getSpecRows(product);

  if (rows.length === 0) {
    return (
      <p className="text-sm text-ink-secondary">
        No specifications are available for this product.
      </p>
    );
  }

  return (
    <div className="max-w-3xl overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">
          Specifications for {product.title}
        </caption>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border last:border-0">
              <th
                scope="row"
                className="w-2/5 py-3 pe-4 text-start align-top font-semibold text-ink"
              >
                {row.label}
              </th>
              <td className="break-words py-3 text-ink-secondary">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductTabs({ product }) {
  const baseId = useId();
  const [active, setActive] = useState("description");
  const tabRefs = useRef([]);

  const tabId = (id) => `${baseId}-tab-${id}`;
  const panelId = (id) => `${baseId}-panel-${id}`;

  const selectTab = (index) => {
    const tab = TABS[index];
    if (!tab) return;
    setActive(tab.id);
    tabRefs.current[index]?.focus();
  };

  const handleKeyDown = (event, index) => {
    let nextIndex = null;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % TABS.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + TABS.length) % TABS.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = TABS.length - 1;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    selectTab(nextIndex);
  };

  return (
    <section className="mt-10 sm:mt-14" aria-label="Product information">
      <div
        role="tablist"
        aria-label="Product information"
        className="flex list-none gap-1 overflow-x-auto border-b border-border"
      >
        {TABS.map((tab, index) => {
          const selected = tab.id === active;

          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={tabId(tab.id)}
              aria-selected={selected}
              aria-controls={panelId(tab.id)}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "-mb-px shrink-0 cursor-pointer border-b-2 px-4 py-3 text-sm font-semibold transition-colors duration-150 motion-reduce:transition-none",
                selected
                  ? "border-ink text-ink"
                  : "border-transparent text-ink-secondary hover:text-ink",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {TABS.map((tab) => {
        const selected = tab.id === active;

        return (
          <div
            key={tab.id}
            role="tabpanel"
            id={panelId(tab.id)}
            aria-labelledby={tabId(tab.id)}
            tabIndex={selected ? 0 : -1}
            hidden={!selected}
            className="pt-6"
          >
            {tab.id === "description" ? (
              <DescriptionPanel product={product} />
            ) : null}
            {tab.id === "specs" ? <SpecsPanel product={product} /> : null}
            {tab.id === "reviews" ? <ProductReviews product={product} /> : null}
          </div>
        );
      })}
    </section>
  );
}

export default ProductTabs;
