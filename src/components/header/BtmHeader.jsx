import React, { useEffect, useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { PiSignInBold } from "react-icons/pi";
import { FaUserPlus } from "react-icons/fa6";

const NavLinks = [
  { title: "Home", link: "/" },
  { title: "About", link: "/about" },
  { title: "Accessories", link: "/accessories" },
  { title: "Blog", link: "/blog" },
  { title: "Contact", link: "/contact" },
];

function normalizeCategories(data) {
  if (!Array.isArray(data)) return [];

  return data
    .map((category) => {
      if (typeof category === "string") {
        return { slug: category, name: category.replaceAll("-", " ") };
      }

      if (!category?.slug) return null;

      return {
        slug: category.slug,
        name: category.name || category.slug.replaceAll("-", " "),
      };
    })
    .filter(Boolean);
}

function BtmHeader() {
  const location = useLocation();
  const [categories, setCategories] = useState([]);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    setIsCategoryOpen(false);
  }, [location]);

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
        }
      } catch (error) {
        if (!ignore && error.name !== "AbortError") {
          console.error("Could not load categories", error);
          setCategories([]);
        }
      }
    };

    fetchCategories();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, []);

  return (
    <div className="bg-main">
      <div className="mx-auto flex w-[90%] max-w-337.5 items-center justify-between">
        <nav className="flex h-12.5 items-center gap-12.5">
          <div className="relative h-full w-55">
            <div
              className="flex h-full w-full cursor-pointer items-center justify-between bg-main px-3.75"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <IoMdMenu className="fill-white" />
              <p className="text-[15px] font-semibold text-white">
                Browse Category
              </p>
              <MdOutlineArrowDropDown className="fill-white" />
            </div>

            <div
              className={`absolute top-full left-0 z-1000 flex max-h-100 w-full flex-col overflow-y-auto border-x border-b border-[#999] bg-white transition-all duration-300 ease-in-out ${isCategoryOpen ? "[clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]" : "[clip-path:polygon(0_0,100%_0,100%_0,0_0)]"}`}
            >
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  className="border-b border-line px-2.5 py-3.5 text-[14px] last:border-b-0"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <ul className="flex h-full list-none">
            {NavLinks.map((item) => (
              <li
                key={item.link}
                className={`flex h-full items-center px-6.25 ${location.pathname === item.link ? "bg-[#0079ca]" : ""}`}
              >
                <Link to={item.link} className="text-white">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex gap-5">
          <Link to="/login" aria-label="Sign in">
            <PiSignInBold className="fill-white text-[22px]" />
          </Link>
          <Link to="/register" aria-label="Create an account">
            <FaUserPlus className="fill-white text-[22px]" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BtmHeader;
