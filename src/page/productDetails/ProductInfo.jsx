import React, { useContext } from "react";
import {
  FaRegHeart,
  FaRegStarHalfStroke,
  FaShare,
  FaStar,
} from "react-icons/fa6";
import { TiShoppingCart } from "react-icons/ti";
import { CartContext } from "../../components/context/cartContextValue";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { shareProduct } from "../../utils/shareProduct";

function ProductInfo({ product }) {
  const {
    cartItems,
    addToCart,
    addToFavorites,
    favorites,
    removeFromFavorites,
  } = useContext(CartContext);

  const isInCart = cartItems.some((i) => i.id === product.id);
  const isInFav = favorites.some((i) => i.id === product.id);
  const productImage = product.images?.[0] || product.thumbnail;

  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product);

    toast.success(
      <div className="flex max-w-[300px] min-w-[300px] items-center gap-[20px]">
        {productImage && (
          <img
            src={productImage}
            alt=""
            className="h-[50px] w-auto object-cover"
          />
        )}

        <div className="flex flex-col gap-[5px] text-[14px]">
          <strong className="line-clamp-1">{product.title}</strong>
          added to Cart
          <div>
            <button
              type="button"
              className="mt-[5px] flex w-max cursor-pointer items-center gap-[10px] rounded-[30px] bg-main px-[18px] py-[10px] text-[13px] capitalize text-white transition-all duration-300 ease-[ease] hover:scale-110"
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
  const handleAddToFav = () => {
    if (isInFav) {
      removeFromFavorites(product.id);
      toast.error(`${product.title} Removed from favorites`);
    } else {
      addToFavorites(product);
      toast.success(`${product.title} added To favorites`);
    }
  };

  return (
    <div className="w-[58%]">
      <h1 className="mb-[30px] text-[2em] font-bold text-main">
        {product.title}
      </h1>
      <div className="my-[15px] flex gap-[5px] [&_svg]:fill-[#f8d941] [&_svg]:text-[20px]">
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
        <FaRegStarHalfStroke />
      </div>

      <p className="my-[20px] text-[22px]">$ {product.price}</p>

      <h5 className="mb-[20px] text-[16px] font-medium">
        Availability: <span>{product.availabilityStatus}</span>
      </h5>
      <h5 className="mb-[20px] text-[16px] font-medium">
        Brand: <span>{product.brand}</span>
      </h5>
      <p className="leading-[1.5]">{product.description}</p>
      <h5 className="mt-[20px] mb-[20px] text-[20px] font-medium">
        <span>Hurry Up! Only {product.stock} products left in stock.</span>{" "}
      </h5>

      <button
        type="button"
        onClick={handleAddToCart}
        className={`flex w-max cursor-pointer items-center gap-[10px] rounded-[2px] border border-main px-[15px] py-[12px] text-[16px] capitalize transition-all duration-300 ease-[ease] hover:scale-110 ${isInCart ? "pointer-events-none bg-transparent text-main" : "bg-main text-white"}`}
      >
        {isInCart ? "item in cart" : "Add to cart"}{" "}
        <TiShoppingCart className="text-[20px]" />
      </button>

      <div className="my-[20px] flex gap-[10px] transition-all duration-300 ease-[ease]">
        <span
          className={`flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full transition-all duration-300 ease-[ease] hover:bg-main ${isInFav ? "bg-main [&_svg]:fill-white" : "bg-soft"}`}
          onClick={handleAddToFav}
        >
          <FaRegHeart className="transition-all duration-300 ease-[ease] hover:fill-white" />
        </span>
        <span
          className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full bg-soft transition-all duration-300 ease-[ease] hover:bg-main"
          onClick={() => shareProduct(product)}
        >
          <FaShare className="transition-all duration-300 ease-[ease] hover:fill-white" />
        </span>
      </div>
    </div>
  );
}

export default ProductInfo;
