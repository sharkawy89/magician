import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import PageTransition from "../components/PageTransition";
import SlideProductLoading from "../components/slideProducts/SlideProductLoading";
import Product from "../components/slideProducts/Product";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import { formatCategoryName } from "../utils/categories";

function SearchResults() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // `q` is the storefront search parameter. `query` stays supported so old
  // links keep working.
  const query = (params.get("q") || params.get("query") || "").trim();
  const category = (params.get("category") || "").trim();
  const hasCriteria = Boolean(query || category);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(hasCriteria);
  const [error, setError] = useState("");

  // The search endpoint is not category-scoped, so when both a query and a
  // category are present, filter the fetched search results by category slug.
  // With only a category, the category endpoint below already returns the
  // whole category, so no extra filtering is needed.
  const visibleResults =
    query && category
      ? results.filter((item) => item.category === category)
      : results;

  useEffect(() => {
    if (!query && !category) {
      setResults([]);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let ignore = false;

    setLoading(true);
    setError("");
    setResults([]);

    const fetchResults = async () => {
      try {
        // DummyJSON has no category-scoped search endpoint, so:
        // - query only: normal search;
        // - query + category: search, then filtered client-side above;
        // - category only: the category endpoint, which returns its products.
        const endpoint = query
          ? `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`
          : `https://dummyjson.com/products/category/${encodeURIComponent(category)}`;

        const res = await fetch(endpoint, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`Search failed (${res.status})`);
        }

        const data = await res.json();

        if (!ignore) {
          setResults(Array.isArray(data.products) ? data.products : []);
        }
      } catch (error) {
        if (!ignore && error.name !== "AbortError") {
          console.error("Search Error :", error);
          setError("We couldn't load search results. Please try again.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [query, category]);

  return (
    <PageTransition key={location.pathname + location.search}>
      <div>
        {loading ? (
          <SlideProductLoading key={`${query}:${category}`} />
        ) : (
          <div className="mx-auto w-[90%] max-w-337.5">
            <div className="relative mb-5 border-b border-border pt-3.75 pe-5 pb-5 after:absolute after:-bottom-px after:h-0.5 after:w-25 after:bg-brand after:content-['']">
              <h2 className="mb-2.5 text-[30px] font-bold text-ink capitalize">
                {query
                  ? `Results for : ${query}`
                  : category
                    ? formatCategoryName(category)
                    : "Search Products"}
              </h2>

              {query && category ? (
                <p className="text-sm text-ink-secondary">
                  Filtered to{" "}
                  <span className="font-semibold text-ink">
                    {formatCategoryName(category)}
                  </span>
                  .{" "}
                  <Link
                    to={`/search?q=${encodeURIComponent(query)}`}
                    className="font-semibold text-info underline underline-offset-2"
                  >
                    Clear filter
                  </Link>
                </p>
              ) : category ? (
                <p className="text-sm text-ink-secondary">
                  Showing all products in{" "}
                  <span className="font-semibold text-ink">
                    {formatCategoryName(category)}
                  </span>
                  .{" "}
                  <Link
                    to="/search"
                    className="font-semibold text-info underline underline-offset-2"
                  >
                    Clear category
                  </Link>
                </p>
              ) : null}
            </div>

            {error ? (
              <ErrorState
                title="Search unavailable"
                description={error}
                action={
                  <Button as={Link} to="/" variant="primary">
                    Back to Home
                  </Button>
                }
              />
            ) : !hasCriteria ? (
              <EmptyState
                icon={<FaSearch />}
                title="Search products"
                description="Enter a search term to find products."
              />
            ) : visibleResults.length === 0 ? (
              <EmptyState
                icon={<FaSearch />}
                title={
                  query && category
                    ? `No results for "${query}" in ${formatCategoryName(category)}`
                    : category
                      ? `No products in ${formatCategoryName(category)}`
                      : `No results for "${query}"`
                }
                description={
                  query && category
                    ? "Try a different search term, or search across every category."
                    : category
                      ? "This category has no products right now."
                      : "Try a different term or browse the full catalog."
                }
                action={
                  category ? (
                    <Button
                      as={Link}
                      to={
                        query ? `/search?q=${encodeURIComponent(query)}` : "/search"
                      }
                      variant="primary"
                    >
                      {query ? "Search all categories" : "Browse all products"}
                    </Button>
                  ) : (
                    <Button as={Link} to="/" variant="primary">
                      Browse products
                    </Button>
                  )
                }
              />
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-5 py-12.5">
                {visibleResults.map((item) => (
                  <Product item={item} key={item.id} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

export default SearchResults;
