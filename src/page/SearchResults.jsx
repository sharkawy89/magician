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

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(Boolean(query));
  const [error, setError] = useState("");

  // The search endpoint is not category-scoped, so filter the already-fetched
  // results by the product's category slug.
  const visibleResults = category
    ? results.filter((item) => item.category === category)
    : results;

  useEffect(() => {
    if (!query) {
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
        const res = await fetch(
          `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );

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
  }, [query]);

  return (
    <PageTransition key={location.pathname + location.search}>
      <div>
        {loading ? (
          <SlideProductLoading key={query} />
        ) : (
          <div className="mx-auto w-[90%] max-w-337.5">
            <div className="relative mb-5 border-b border-border pt-3.75 pe-5 pb-5 after:absolute after:-bottom-px after:h-0.5 after:w-25 after:bg-brand after:content-['']">
              <h2 className="mb-2.5 text-[30px] font-bold text-ink capitalize">
                {query ? `Results for : ${query}` : "Search Products"}
              </h2>

              {category ? (
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
            ) : !query ? (
              <EmptyState
                icon={<FaSearch />}
                title="Search products"
                description="Enter a search term to find products."
              />
            ) : visibleResults.length === 0 ? (
              <EmptyState
                icon={<FaSearch />}
                title="No results found"
                description={
                  category
                    ? `We couldn't find anything for "${query}" in ${formatCategoryName(
                        category,
                      )}.`
                    : `We couldn't find anything for "${query}". Try a different term.`
                }
                action={
                  category ? (
                    <Button
                      as={Link}
                      to={`/search?q=${encodeURIComponent(query)}`}
                      variant="primary"
                    >
                      Search all categories
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
