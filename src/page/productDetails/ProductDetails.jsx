import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SlideProduct from "../../components/slideProducts/SlideProduct";
import ProductDetailsLoading from "./ProductDetailsLoading";
import SlideProductLoading from "../../components/slideProducts/SlideProductLoading";
import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";
import PageTransition from "../../components/PageTransition";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelatedProducts, setLoadingRelatedProducts] = useState(false);

  const relatedCategory = product?.category;
  const relatedId = product?.id;

  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;

    setProduct(null);
    setError("");
    setLoading(true);
    setRelatedProducts([]);
    setLoadingRelatedProducts(false);

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://dummyjson.com/products/${encodeURIComponent(id ?? "")}`,
          { signal: controller.signal },
        );

        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? "Product not found."
              : `Failed to load product (${res.status})`,
          );
        }

        const data = await res.json();

        if (!data || data.id === undefined || data.id === null) {
          throw new Error("Unexpected product response.");
        }

        if (!ignore) {
          setProduct(data);
        }
      } catch (error) {
        if (!ignore && error.name !== "AbortError") {
          console.error("Error fetching product", error);
          setError(error.message || "Could not load this product.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [id]);

  useEffect(() => {
    if (!relatedCategory) {
      setRelatedProducts([]);
      setLoadingRelatedProducts(false);
      return;
    }

    const controller = new AbortController();
    let ignore = false;

    setLoadingRelatedProducts(true);

    const fetchRelatedProducts = async () => {
      try {
        const res = await fetch(
          `https://dummyjson.com/products/category/${encodeURIComponent(relatedCategory)}`,
          { signal: controller.signal },
        );

        if (!res.ok) {
          throw new Error(`Failed to load related products (${res.status})`);
        }

        const data = await res.json();

        if (!ignore) {
          const items = Array.isArray(data.products) ? data.products : [];

          setRelatedProducts(items.filter((item) => item.id !== relatedId));
        }
      } catch (error) {
        if (!ignore && error.name !== "AbortError") {
          console.error("Error fetching related products", error);
          setRelatedProducts([]);
        }
      } finally {
        if (!ignore) {
          setLoadingRelatedProducts(false);
        }
      }
    };

    fetchRelatedProducts();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [relatedCategory, relatedId]);

  return (
    <PageTransition key={id}>
      <div>
        {loading ? (
          <ProductDetailsLoading />
        ) : error || !product ? (
          <div className="mx-auto w-[90%] max-w-337.5 py-12.5">
            <h2 className="mb-2.5 text-[30px] font-bold text-main">
              Product Unavailable
            </h2>
            <p className="mb-5">
              {error || "The product you are looking for does not exist."}
            </p>
            <Link
              to="/"
              className="flex w-max items-center gap-2.5 rounded-[30px] bg-main px-4.5 py-2.5 capitalize text-white transition-all duration-300 ease-[ease] hover:scale-110"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            <div className="py-12.5">
              <div className="mx-auto flex w-[90%] max-w-337.5 items-center justify-between">
                <ProductImages product={product} />
                <ProductInfo product={product} />
              </div>
            </div>

            {loadingRelatedProducts ? (
              <SlideProductLoading />
            ) : relatedProducts.length > 0 ? (
              <SlideProduct
                key={relatedCategory}
                data={relatedProducts}
                title={(relatedCategory || "").replaceAll("-", " ")}
              />
            ) : null}
          </>
        )}
      </div>
    </PageTransition>
  );
}

export default ProductDetails;
