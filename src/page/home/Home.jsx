import React, { useEffect, useState } from "react";
import HeroSlider from "../../components/HeroSlider";

import SlideProduct from "../../components/slideProducts/SlideProduct";
import SlideProductLoading from "../../components/slideProducts/SlideProductLoading";
import PageTransition from "../../components/PageTransition";

const categories = [
  "smartphones",
  "mobile-accessories",
  "laptops",
  "tablets",
  "sunglasses",
  "sports-accessories",
];

function Home() {
  const [products, setProducts] = useState({});

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;

    const fetchProducts = async () => {
      try {
        const results = await Promise.all(
          categories.map(async (category) => {
            try {
              const res = await fetch(
                `https://dummyjson.com/products/category/${encodeURIComponent(category)}`,
                { signal: controller.signal },
              );

              if (!res.ok) {
                throw new Error(`Failed to load ${category} (${res.status})`);
              }

              const data = await res.json();

              return [
                category,
                Array.isArray(data.products) ? data.products : [],
              ];
            } catch (error) {
              if (error.name === "AbortError") throw error;

              console.error(`Could not load ${category}`, error);
              return [category, []];
            }
          }),
        );

        if (ignore) return;

        const productsData = Object.fromEntries(results);

        setProducts(productsData);
        setError(
          results.every(([, items]) => items.length === 0)
            ? "We couldn't load products right now. Please try again later."
            : "",
        );
      } catch (error) {
        if (!ignore && error.name !== "AbortError") {
          console.error("Error Fetching", error);
          setError("We couldn't load products right now. Please try again later.");
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
  }, []);

  const availableCategories = categories.filter(
    (category) => products[category]?.length > 0,
  );

  return (
    <PageTransition>
      <div>
        <HeroSlider />

        {loading ? (
          categories.map((category) => (
            <SlideProductLoading key={category} />
          ))
        ) : error ? (
          <div className="mx-auto w-[90%] max-w-337.5 py-12.5">
            <p>{error}</p>
          </div>
        ) : (
          availableCategories.map((category) => (
            <SlideProduct
              key={category}
              data={products[category]}
              title={category.replaceAll("-", " ")}
            />
          ))
        )}
      </div>
    </PageTransition>
  );
}

export default Home;
