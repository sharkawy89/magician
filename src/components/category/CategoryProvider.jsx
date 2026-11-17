import { useEffect, useMemo, useState } from "react";
import { CategoryContext } from "./categoryContextValue";
import { normalizeCategories } from "../../utils/categories";

/**
 * One shared fetch for every category consumer (header search scope, category
 * row, mega menu and the mobile category drawer). The endpoint is the same one
 * the old BtmHeader used, so this removes duplicate requests without adding a
 * new data source.
 */
export default function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;

    const fetchCategories = async () => {
      try {
        const res = await fetch("https://dummyjson.com/products/categories", {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Failed to load categories (${res.status})`);
        }

        const data = await res.json();

        if (!ignore) {
          setCategories(normalizeCategories(data));
          setStatus("ready");
        }
      } catch (error) {
        if (!ignore && error.name !== "AbortError") {
          console.error("Could not load categories", error);
          setCategories([]);
          setStatus("error");
        }
      }
    };

    fetchCategories();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, []);

  const value = useMemo(() => ({ categories, status }), [categories, status]);

  return (
    <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>
  );
}
