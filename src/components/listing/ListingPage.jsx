import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import PageTransition from "../PageTransition";
import ActiveFilterChips from "./ActiveFilterChips";
import FilterSheet from "./FilterSheet";
import FilterSidebar from "./FilterSidebar";
import ListingToolbar from "./ListingToolbar";
import Pagination from "./Pagination";
import ProductGridCard from "./ProductGridCard";
import ProductListCard from "./ProductListCard";
import { ProductGridSkeleton, ProductListSkeleton } from "./ListingSkeletons";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import { cn } from "../ui/cn";
import { formatCategoryName } from "../../utils/categories";
import {
  LISTING_PAGE_SIZE,
  filterProducts,
  getActiveFilterCount,
  getBrandFacets,
  getListingCacheKey,
  getPriceBounds,
  getRatingFacets,
  getSortParams,
  normalizeFilters,
  readCachedFullSet,
  readListingParams,
  sortProducts,
  stripInvalidListingParams,
  writeCachedFullSet,
  writeListingParams,
} from "../../utils/listing";

const API_ROOT = "https://dummyjson.com/products";

function buildFullEndpoint(query, category) {
  return query
    ? `${API_ROOT}/search?q=${encodeURIComponent(query)}&limit=0`
    : `${API_ROOT}/category/${encodeURIComponent(category)}?limit=0`;
}

function buildPageEndpoint(query, category, page, sort) {
  const { sortBy, order } = getSortParams(sort);
  const skip = (page - 1) * LISTING_PAGE_SIZE;
  const params = `limit=${LISTING_PAGE_SIZE}&skip=${skip}&sortBy=${sortBy}&order=${order}`;

  return query
    ? `${API_ROOT}/search?q=${encodeURIComponent(query)}&${params}`
    : `${API_ROOT}/category/${encodeURIComponent(category)}?${params}`;
}

function ListingPage({ query = "", category = "" }) {
  const hasQuery = Boolean(query);
  const hasCategory = Boolean(category);
  const hasCriteria = hasQuery || hasCategory;
  const isScopedSearch = hasQuery && hasCategory;
  const reduceMotion = useReducedMotion();

  const [searchParams, setSearchParams] = useSearchParams();
  const paramsKey = searchParams.toString();

  const [allProducts, setAllProducts] = useState([]);
  const [allLoading, setAllLoading] = useState(hasCriteria);
  const [allError, setAllError] = useState("");

  const [pageProducts, setPageProducts] = useState([]);
  const [pageTotal, setPageTotal] = useState(0);
  const [pageLoading, setPageLoading] = useState(hasCriteria);
  const [pageError, setPageError] = useState("");

  const [sheetOpen, setSheetOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const resultsRef = useRef(null);

  // Full result set: facets and client-side filtering are always derived from
  // this, never from the current page.
  useEffect(() => {
    if (!hasCriteria) {
      setAllProducts([]);
      setAllLoading(false);
      setAllError("");
      return undefined;
    }

    const controller = new AbortController();
    let ignore = false;
    const cacheKey = getListingCacheKey(query, category);

    setAllProducts([]);
    setAllLoading(true);
    setAllError("");
    setPageProducts([]);
    setPageTotal(0);
    setPageLoading(true);
    setPageError("");

    const cached = readCachedFullSet(cacheKey);

    if (cached) {
      setAllProducts(cached);
      setAllLoading(false);
      return undefined;
    }

    const fetchAll = async () => {
      try {
        const res = await fetch(buildFullEndpoint(query, category), {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Failed to load products (${res.status})`);
        }

        const data = await res.json();

        if (!ignore) {
          const products = Array.isArray(data.products) ? data.products : [];
          writeCachedFullSet(cacheKey, products);
          setAllProducts(products);
        }
      } catch (error) {
        if (!ignore && error.name !== "AbortError") {
          console.error("Could not load the product set", error);
          setAllError("We couldn't load these products. Please try again.");
        }
      } finally {
        if (!ignore) setAllLoading(false);
      }
    };

    fetchAll();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [hasCriteria, query, category, reloadKey]);

  const baseProducts = useMemo(() => {
    if (!isScopedSearch) return allProducts;
    return allProducts.filter((product) => product.category === category);
  }, [allProducts, isScopedSearch, category]);

  const bounds = useMemo(() => getPriceBounds(baseProducts), [baseProducts]);
  const brandFacets = useMemo(() => getBrandFacets(baseProducts), [baseProducts]);
  const ratingFacets = useMemo(
    () => getRatingFacets(baseProducts),
    [baseProducts],
  );

  const allLoaded = !allLoading && !allError;

  // Drop syntactically invalid params (and unknown brands) once facets are
  // known. Only the listing keys are touched; q / category / query and any
  // unrelated params survive. replace keeps Back history clean.
  useEffect(() => {
    if (!allLoaded) return;

    const cleaned = stripInvalidListingParams(
      new URLSearchParams(paramsKey),
      brandFacets.map((facet) => facet.name),
    );

    if (cleaned.toString() !== paramsKey) {
      setSearchParams(cleaned, { replace: true });
    }
  }, [allLoaded, paramsKey, brandFacets, setSearchParams]);

  const rawParams = useMemo(
    () => readListingParams(new URLSearchParams(paramsKey)),
    [paramsKey],
  );

  const filters = useMemo(
    () => normalizeFilters(rawParams, bounds, brandFacets),
    [rawParams, bounds, brandFacets],
  );

  const activeCount = getActiveFilterCount(filters);
  const isFiltered = activeCount > 0;

  const filteredProducts = useMemo(
    () => (isFiltered ? filterProducts(baseProducts, filters) : baseProducts),
    [baseProducts, filters, isFiltered],
  );

  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, filters.sort),
    [filteredProducts, filters.sort],
  );

  const serverPaging =
    hasCriteria && !isScopedSearch && allLoaded && !isFiltered;

  const unfilteredPages = Math.max(
    1,
    Math.ceil(baseProducts.length / LISTING_PAGE_SIZE),
  );
  const filteredPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / LISTING_PAGE_SIZE),
  );
  const totalPages = serverPaging ? unfilteredPages : filteredPages;
  const page = Math.min(filters.page, totalPages);

  // Unfiltered requests use DummyJSON limit/skip + server sort. Filtered and
  // category-scoped search views paginate the full client-side set instead.
  useEffect(() => {
    if (!serverPaging) {
      if (!allLoading) setPageLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    let ignore = false;

    setPageLoading(true);
    setPageError("");

    const fetchPage = async () => {
      try {
        const res = await fetch(
          buildPageEndpoint(query, category, page, filters.sort),
          { signal: controller.signal },
        );

        if (!res.ok) {
          throw new Error(`Failed to load page (${res.status})`);
        }

        const data = await res.json();

        if (!ignore) {
          setPageProducts(Array.isArray(data.products) ? data.products : []);
          setPageTotal(Number(data.total) || 0);
        }
      } catch (error) {
        if (!ignore && error.name !== "AbortError") {
          console.error("Could not load this page", error);
          setPageError("We couldn't load this page. Please try again.");
        }
      } finally {
        if (!ignore) setPageLoading(false);
      }
    };

    fetchPage();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [serverPaging, allLoading, query, category, page, filters.sort, reloadKey]);

  const commitFilters = useCallback(
    (nextFilters) => {
      setSearchParams(writeListingParams(searchParams, nextFilters, bounds), {
        replace: true,
      });
    },
    [searchParams, bounds, setSearchParams],
  );

  const applyFilterPatch = useCallback(
    (patch) => {
      const merged = normalizeFilters(
        { ...filters, ...patch, page: 1 },
        bounds,
        brandFacets,
      );
      commitFilters(merged);
    },
    [filters, bounds, brandFacets, commitFilters],
  );

  const clearFilters = useCallback(() => {
    applyFilterPatch({
      minPrice: null,
      maxPrice: null,
      rating: null,
      brands: [],
      inStock: false,
    });
  }, [applyFilterPatch]);

  // The Filters trigger is display:none on desktop, so returning focus is only
  // meaningful for the mobile sheet. Focusing explicitly (rather than relying
  // on the overlay's "previously focused" element) covers opening via touch or
  // a programmatic click, where the button may never have held focus.
  const closeFilterSheet = useCallback(() => {
    setSheetOpen(false);
    window.requestAnimationFrame(() => {
      document.getElementById("listing-filters-button")?.focus();
    });
  }, []);

  const handlePageChange = (nextPage) => {
    if (nextPage === page) return;

    commitFilters({ ...filters, page: nextPage });

    window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  };

  const handleSortChange = (sort) => {
    const merged = normalizeFilters(
      { ...filters, sort, page: 1 },
      bounds,
      brandFacets,
    );
    commitFilters(merged);
  };

  const handleViewChange = (view) => {
    commitFilters({ ...filters, view });
  };

  const displayProducts = serverPaging
    ? pageProducts
    : sortedProducts.slice(
        (page - 1) * LISTING_PAGE_SIZE,
        page * LISTING_PAGE_SIZE,
      );

  const displayTotal = serverPaging ? pageTotal || baseProducts.length : sortedProducts.length;
  const gridLoading = allLoading || (serverPaging && pageLoading);
  const gridError = allError || (serverPaging && pageError);

  const title = hasQuery
    ? `Results for “${query}”`
    : hasCategory
      ? formatCategoryName(category)
      : "Search products";

  const scopedNote = isScopedSearch
    ? `Showing matches in ${formatCategoryName(category)}.`
    : hasCategory
      ? `Showing all products in ${formatCategoryName(category)}.`
      : null;

  const clearScopedHref = isScopedSearch
    ? `/search?q=${encodeURIComponent(query)}`
    : "/search";

  const emptyState = isFiltered ? (
    <EmptyState
      icon={<FaSearch />}
      title="No products match your filters"
      description="Try removing a filter or widening the price range."
      action={
        <Button variant="primary" onClick={clearFilters}>
          Clear filters
        </Button>
      }
    />
  ) : isScopedSearch ? (
    <EmptyState
      icon={<FaSearch />}
      title={`No results for "${query}" in ${formatCategoryName(category)}`}
      description="Try a different search term, or search across every category."
      action={
        <Button as={Link} to={clearScopedHref} variant="primary">
          Search all categories
        </Button>
      }
    />
  ) : hasQuery ? (
    <EmptyState
      icon={<FaSearch />}
      title={`No results for "${query}"`}
      description="Try a different term or browse the full catalog."
      action={
        <Button as={Link} to="/" variant="primary">
          Browse products
        </Button>
      }
    />
  ) : (
    <EmptyState
      icon={<FaSearch />}
      title={`No products in ${formatCategoryName(category)}`}
      description="This category has no products right now."
      action={
        <Button as={Link} to="/" variant="primary">
          Browse all products
        </Button>
      }
    />
  );

  return (
    <PageTransition>
      <div className="pb-16">
        <div className="mx-auto w-[90%] max-w-337.5">
          <header className="border-b border-border pt-6 pb-5">
            <h1 className="text-h3 font-bold text-ink sm:text-h2">{title}</h1>

            {scopedNote ? (
              <p className="mt-2 text-sm text-ink-secondary">
                {scopedNote}{" "}
                {isScopedSearch ? (
                  <Link
                    to={clearScopedHref}
                    className="font-semibold text-info underline underline-offset-2"
                  >
                    Search all categories
                  </Link>
                ) : null}
              </p>
            ) : null}
          </header>

          {!hasCriteria ? (
            <EmptyState
              icon={<FaSearch />}
              title="Search products"
              description="Enter a search term to find products."
            />
          ) : (
            <div
              ref={resultsRef}
              className={cn(
                "mt-6 scroll-mt-24",
                !gridError &&
                  "lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8",
              )}
            >
              {!gridError ? (
                <FilterSidebar
                  loading={allLoading}
                  idPrefix="sidebar"
                  bounds={bounds}
                  brandFacets={brandFacets}
                  ratingFacets={ratingFacets}
                  values={filters}
                  onChange={applyFilterPatch}
                  onReset={clearFilters}
                />
              ) : null}

              <div className="min-w-0">
                <ListingToolbar
                  total={displayTotal}
                  baseTotal={baseProducts.length}
                  isFiltered={isFiltered}
                  activeCount={activeCount}
                  sort={filters.sort}
                  view={filters.view}
                  onSortChange={handleSortChange}
                  onViewChange={handleViewChange}
                  onOpenFilters={() => setSheetOpen(true)}
                  loading={gridLoading && !gridError}
                />

                <ActiveFilterChips
                  filters={filters}
                  onRemove={applyFilterPatch}
                  onClearAll={clearFilters}
                />

                <div className="pt-5">
                  {gridError ? (
                    <ErrorState
                      title="Products unavailable"
                      description={gridError}
                      action={
                        <Button
                          variant="primary"
                          onClick={() => setReloadKey((key) => key + 1)}
                        >
                          Try again
                        </Button>
                      }
                    />
                  ) : gridLoading ? (
                    filters.view === "list" ? (
                      <ProductListSkeleton />
                    ) : (
                      <ProductGridSkeleton />
                    )
                  ) : displayProducts.length === 0 ? (
                    emptyState
                  ) : filters.view === "list" ? (
                    <div className="flex flex-col gap-4">
                      {displayProducts.map((item) => (
                        <ProductListCard key={item.id} item={item} />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {displayProducts.map((item) => (
                        <ProductGridCard key={item.id} item={item} />
                      ))}
                    </div>
                  )}
                </div>

                {!gridError && !gridLoading ? (
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onChange={handlePageChange}
                  />
                ) : null}
              </div>
            </div>
          )}
        </div>

        <FilterSheet
          open={sheetOpen}
          onClose={closeFilterSheet}
          loading={allLoading}
          bounds={bounds}
          brandFacets={brandFacets}
          ratingFacets={ratingFacets}
          appliedValues={filters}
          activeCount={activeCount}
          onApply={applyFilterPatch}
        />
      </div>
    </PageTransition>
  );
}

export default ListingPage;
