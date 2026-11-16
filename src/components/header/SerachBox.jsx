import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

function SerachBox() {
  const [serachTerm, setSerachTerm] = useState("");

  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();

    const term = serachTerm.trim();

    if (term) {
      navigate(`/search?query=${encodeURIComponent(term)}`);
    }

    setSuggestions([]);
  };

  useEffect(() => {
    const term = serachTerm.trim();

    if (!term) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    let ignore = false;

    const debounce = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://dummyjson.com/products/search?q=${encodeURIComponent(term)}`,
          { signal: controller.signal },
        );

        if (!res.ok) {
          throw new Error(`Search failed (${res.status})`);
        }

        const data = await res.json();

        if (!ignore) {
          setSuggestions(
            Array.isArray(data.products) ? data.products.slice(0, 5) : [],
          );
        }
      } catch (error) {
        if (!ignore && error.name !== "AbortError") {
          console.error("Search Error :", error);
          setSuggestions([]);
        }
      }
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(debounce);
      controller.abort();
    };
  }, [serachTerm]);

  useEffect(() => {
    setSuggestions([]);
  }, [location]);

  const handleSuggestionClick = () => {
    setSerachTerm("");
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="flex w-125 items-center rounded-[30px] border border-main bg-soft"
      >
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search For Products"
          value={serachTerm}
          onChange={(e) => setSerachTerm(e.target.value)}
          autoComplete="off"
          className="h-11.25 w-110 rounded-l-[30px] bg-soft py-1.25 pr-3.75 pl-5"
        />
        <button
          type="submit"
          className="h-11.25 w-15 cursor-pointer rounded-r-[30px] bg-main text-[18px]"
        >
          <FaSearch className="fill-white" />
        </button>
      </form>

      {suggestions.length > 0 && (
        <ul className="absolute z-1000 w-full list-none border border-line bg-white">
          {suggestions.map((item) => {
            const image = item.thumbnail || item.images?.[0];

            return (
              <li key={item.id}>
                <Link
                  to={`/products/${item.id}`}
                  onClick={handleSuggestionClick}
                  className="flex items-center gap-1.25 border-b border-line px-1.25 py-1.25"
                >
                  {image && <img src={image} alt="" className="w-7.5" />}{" "}
                  <span className="text-[14px]">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default SerachBox;
