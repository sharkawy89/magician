import React, { useContext } from "react";
import { FaStar, FaRegStarHalfStroke } from "react-icons/fa6";
import { FaCartArrowDown, FaRegHeart, FaShare } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/cartContextValue";
import { FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";
import { shareProduct } from "../../utils/shareProduct";

function Product({ item }) {
  const navigate = useNavigate();

  const {
    cartItems,
    addToCart,
    addToFavorites,
    favorites,
    removeFromFavorites,
  } = useContext(CartContext);

  const isInCart = cartItems.some((i) => i.id === item.id);
  const productImage = item.images?.[0] || item.thumbnail;

  const handleAddToCart = () => {
    addToCart(item);

    toast.success(
      <div className="flex max-w-75 min-w-75 items-center gap-5">
        {productImage && (
          <img
            src={productImage}
            alt=""
            className="h-12.5 w-auto object-cover"
          />
        )}

        <div className="flex flex-col gap-1.25 text-[14px]">
          <strong className="line-clamp-1">{item.title}</strong>
          added to Cart
          <div>
            <button
              type="button"
              className="mt-1.25 flex w-max cursor-pointer items-center gap-2.5 rounded-[30px] bg-main px-4.5 py-2.5 text-[13px] capitalize text-white transition-all duration-300 ease-[ease] hover:scale-110"
              onClick={() => navigate("/cart")}
            >
              {" "}
              View Cart
            </button>
          </div>
        </div>
      </div>,
      { duration: 3500 },
    );
  };

  // favorites
  const isInFav = favorites.some((i) => i.id === item.id);

  const handleAddToFav = () => {
    if (isInFav) {
      removeFromFavorites(item.id);
      toast.error(`${item.title} Removed from favorites`);
    } else {
      addToFavorites(item);
      toast.success(`${item.title} added To favorites`);
    }
  };

  return (
    <div className="group relative w-62.5 overflow-hidden rounded-[5px] border border-line bg-white px-3.75 py-6.25 transition-all duration-300 ease-[ease] hover:border-main hover:shadow-[10px_10px_15px_#94949429]">
      <Link to={`/products/${item.id}`}>
        <span
          className={`absolute left-1/2 flex -translate-x-1/2 items-center gap-1.25 text-[13px] text-heading transition-all duration-300 ease-[ease] [&_svg]:text-[#2cfc03] ${isInCart ? "top-2.5" : "-top-7.5"}`}
        >
          <FaCheck /> in cart
        </span>

        <div className="relative mb-7.5 flex h-45 items-center justify-center px-5">
          {productImage ? (
            <img src={productImage} alt={item.title} className="h-40 w-auto" />
          ) : (
            <span className="flex h-40 w-full items-center justify-center text-[13px] text-paragraph">
              No image available
            </span>
          )}
        </div>

        <p className="mb-2.5 line-clamp-1 text-heading">{item.title}</p>

        <div className="my-3.75 flex gap-1.25 [&_svg]:fill-[#f8d941] [&_svg]:text-[18px]">
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaRegStarHalfStroke />
        </div>

        <p className="text-[20px] font-bold">
          <span>$ {item.price}</span>
        </p>
      </Link>

      <div className="absolute top-1/2 -right-12.5 flex -translate-y-1/2 flex-col gap-2.5 transition-all duration-300 ease-[ease] group-hover:right-5">
        <span
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full ${isInCart ? "pointer-events-none bg-main [&_svg]:fill-white" : "bg-soft"}`}
          onClick={handleAddToCart}
        >
          <FaCartArrowDown />
        </span>
        <span
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full ${isInFav ? "bg-main [&_svg]:fill-white" : "bg-soft"}`}
          onClick={handleAddToFav}
        >
          <FaRegHeart />
        </span>
        <span
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-soft"
          onClick={() => shareProduct(item)}
        >
          <FaShare />
        </span>
      </div>
    </div>
  );
}

export default Product;
