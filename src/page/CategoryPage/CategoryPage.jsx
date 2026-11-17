import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoPricetagsOutline } from "react-icons/io5";
import Product from "../../components/slideProducts/Product";
import SlideProductLoading from "../../components/slideProducts/SlideProductLoading";
import PageTransition from "../../components/PageTransition";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";

function CategoryPage() {
  const { category } = useParams();

  const [categoryProducts, setCategoryProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;

    setLoading(true);
    setError("");
    setCategoryProducts([]);
    setTotal(0);

    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `https://dummyjson.com/products/category/${encodeURIComponent(category ?? "")}`,
          { signal: controller.signal },
        );

        if (!res.ok) {
          throw new Error(`Failed to load this category (${res.status})`);
        }

        const data = await res.json();

        if (ignore) return;

        const items = Array.isArray(data.products) ? data.products : [];

        setCategoryProducts(items);
        setTotal(Number(data.total) || items.length);
      } catch (error) {
        if (!ignore && error.name !== "AbortError") {
          console.error("Error fetching category products", error);
          setError(
            "We couldn't load products for this category. Please try again.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [category]);

  const title = (category || "").replaceAll("-", " ");

  return (
    <PageTransition key={category}>
      <div>
        {loading ? (
          <SlideProductLoading key={category} />
        ) : (
          <div className="mx-auto w-[90%] max-w-337.5">
            <div className="relative mb-5 border-b border-border pt-3.75 pe-5 pb-5 after:absolute after:-bottom-px after:h-0.5 after:w-25 after:bg-brand after:content-['']">
              <h2 className="mb-2.5 text-[30px] font-bold text-ink capitalize">
                {title} : {total}
              </h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestias, voluptates?
              </p>
            </div>

            {error ? (
              <ErrorState
                title="Category unavailable"
                description={error}
                action={
                  <Button as={Link} to="/" variant="primary">
                    Back to Home
                  </Button>
                }
              />
            ) : categoryProducts.length === 0 ? (
              <EmptyState
                icon={<IoPricetagsOutline />}
                title="No products found"
                description="This category does not have any products right now."
                action={
                  <Button as={Link} to="/" variant="primary">
                    Browse products
                  </Button>
                }
              />
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-5 py-12.5">
                {categoryProducts.map((item) => (
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

export default CategoryPage;
