import React, { useContext } from "react";
import { CartContext } from "../../components/context/cartContextValue";
import { FaTrashAlt } from "react-icons/fa";
import PageTransition from "../../components/PageTransition";
import toast from "react-hot-toast";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    clearCart();
    toast.success("Order placed successfully!");
  };

  return (
    <PageTransition>
      <div className="my-[50px]">
        <div className="mx-auto w-[45%] rounded-[5px] border border-line px-[20px] shadow-[0px_8px_10px_#c0bfbf44]">
          <h1 className="mb-[20px] border-b border-line py-[20px] text-[2em] font-bold text-main">
            Order Summary
          </h1>

          <div className="h-[350px] overflow-y-auto">
            {cartItems.length === 0 ? (
              <p>Your Cart is empty.</p>
            ) : (
              cartItems.map((item) => {
                const productImage = item.images?.[0] || item.thumbnail;

                return (
                  <div
                    className="flex h-[125px] items-center justify-between gap-[20px] border-b border-line pr-[20px] last:border-b-0"
                    key={item.id}
                  >
                    <div className="flex items-center gap-[20px]">
                      <div className="flex w-[100px] items-center justify-center">
                        {productImage ? (
                          <img
                            src={productImage}
                            alt={item.title}
                            className="h-[80px] w-auto"
                          />
                        ) : (
                          <span className="text-[12px] text-paragraph">
                            No image
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="mb-[10px] line-clamp-2 text-[16px] font-medium">
                          {item.title}
                        </h4>
                        <p>${item.price}</p>

                        <div className="mt-[5px] flex items-center gap-[5px]">
                          <button
                            type="button"
                            className="flex h-[27px] w-[27px] cursor-pointer items-center justify-center rounded-[2px] border border-line text-[20px]"
                            onClick={() => decreaseQuantity(item.id)}
                            aria-label={`Decrease quantity of ${item.title}`}
                          >
                            -
                          </button>
                          <span className="flex min-w-[40px] items-center justify-center border border-line bg-soft text-[18px]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="flex h-[27px] w-[27px] cursor-pointer items-center justify-center rounded-[2px] border border-line text-[20px]"
                            onClick={() => increaseQuantity(item.id)}
                            aria-label={`Increase quantity of ${item.title}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="group border-0 bg-transparent outline-none"
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      <FaTrashAlt className="cursor-pointer fill-[#e51a1a] text-[25px] transition-all duration-300 ease-[ease] group-hover:scale-[1.2]" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-line pt-[25px]">
            <div className="mb-[20px] flex items-center justify-between">
              <p className="text-[20px] capitalize text-heading">Total:</p>
              <span className="text-[20px] font-bold">${total.toFixed(2)}</span>
            </div>

            <div className="border-t border-line py-[30px]">
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="w-full cursor-pointer rounded-[2px] border-2 border-main bg-main py-[15px] text-[20px] font-bold text-white outline-none transition-all duration-300 ease-[ease-in-out] hover:bg-transparent hover:text-main"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Cart;
