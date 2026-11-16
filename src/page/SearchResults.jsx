import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import SlideProductLoading from "../components/slideProducts/SlideProductLoading";
import Product from "../components/slideProducts/Product";

function SearchResults() {
  const location = useLocation();

  const query = (new URLSearchParams(location.search).get("query") || "").trim();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(Boolean(query));
  const [error, setError] = useState("");

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
            <div className="relative mb-5 border-b border-line pt-3.75 pr-5 pb-5 after:absolute after:-bottom-px after:h-0.5 after:w-25 after:bg-main after:content-['']">
              <h2 className="mb-2.5 text-[30px] font-bold text-main capitalize">
                {query ? `Results for : ${query}` : "Search Products"}
              </h2>
            </div>

            {error ? (
              <div className="py-12.5">
                <p>{error}</p>
              </div>
            ) : !query ? (
              <div className="py-12.5">
                <p>Enter a search term to find products.</p>
              </div>
            ) : results.length === 0 ? (
              <div className="py-12.5">
                <p>No Results found.</p>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-5 py-12.5">
                {results.map((item) => (
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
