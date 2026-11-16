import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Logo from "../../img/logo.png";
import { FaRegHeart } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { CartContext } from "../context/cartContextValue";
import SerachBox from "./SerachBox";

function TopHeader() {
  const { cartItems, favorites } = useContext(CartContext);

  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0,
  );

  return (
    <div>
      <div className="mx-auto flex w-[90%] max-w-337.5 items-center justify-between py-3.75">
        <Link className="w-40" to="/">
          {" "}
          <img src={Logo} alt="Logo" />
        </Link>

        <SerachBox />

        <div className="flex gap-7.5">
          <div className="relative cursor-pointer">
            <Link to="/favorites">
              <FaRegHeart className="text-[30px]" />
              <span className="absolute -top-1.25 -right-2.5 h-5 w-5 rounded-full bg-main text-center text-[11px] leading-5 text-white">
                {favorites.length}
              </span>
            </Link>
          </div>

          <div className="relative cursor-pointer">
            <Link to="/cart">
              <TiShoppingCart className="text-[30px]" />
              <span className="absolute -top-1.25 -right-2.5 h-5 w-5 rounded-full bg-main text-center text-[11px] leading-5 text-white">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopHeader;
