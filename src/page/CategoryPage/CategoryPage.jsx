import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Product from "../../components/slideProducts/Product";
import SlideProductLoading from "../../components/slideProducts/SlideProductLoading";
import PageTransition from "../../components/PageTransition";

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
            <div className="relative mb-5 border-b border-line pt-3.75 pr-5 pb-5 after:absolute after:-bottom-px after:h-0.5 after:w-25 after:bg-main after:content-['']">
              <h2 className="mb-2.5 text-[30px] font-bold text-main capitalize">
                {title} : {total}
              </h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestias, voluptates?
              </p>
            </div>

            {error ? (
              <div className="py-12.5">
                <p className="mb-5">{error}</p>
                <Link
                  to="/"
                  className="flex w-max items-center gap-[10px] rounded-[30px] bg-main px-[18px] py-[10px] capitalize text-white transition-all duration-300 ease-[ease] hover:scale-110"
                >
                  Back to Home
                </Link>
              </div>
            ) : categoryProducts.length === 0 ? (
              <div className="py-12.5">
                <p>No products found in this category.</p>
              </div>
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
