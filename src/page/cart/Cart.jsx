import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { CartContext } from "../../components/context/cartContextValue";
import PageTransition from "../../components/PageTransition";
import { notify } from "../../components/ui/toast";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Price from "../../components/ui/Price";
import QuantityStepper from "../../components/ui/QuantityStepper";

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
      notify.error("Your cart is empty");
      return;
    }

    clearCart();
    notify.success("Order placed successfully!");
  };

  return (
    <PageTransition>
      <div className="my-12.5">
        <Card className="mx-auto w-[92%] max-w-150 px-5">
          <h1 className="mb-5 border-b border-border py-5 text-[2em] font-bold text-ink">
            Order Summary
          </h1>

          <div className="h-87.5 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <EmptyState
                  icon={<TiShoppingCart />}
                  title="Your cart is empty"
                  description="Add a product to your cart and it will show up here."
                  action={
                    <Button as={Link} to="/" variant="primary">
                      Browse products
                    </Button>
                  }
                />
              </div>
            ) : (
              cartItems.map((item) => {
                const productImage = item.images?.[0] || item.thumbnail;

                return (
                  <div
                    className="flex h-31.25 items-center justify-between gap-5 border-b border-border pe-5 last:border-b-0"
                    key={item.id}
                  >
                    <div className="flex items-center gap-5">
                      <div className="flex w-25 items-center justify-center">
                        {productImage ? (
                          <img
                            src={productImage}
                            alt={item.title}
                            className="h-20 w-auto"
                          />
                        ) : (
                          <span className="text-[12px] text-ink-secondary">
                            No image
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="mb-2.5 line-clamp-2 text-[16px] font-medium">
                          {item.title}
                        </h4>
                        <Price price={item.price} size="sm" />

                        <QuantityStepper
                          className="mt-1.25"
                          value={item.quantity}
                          min={1}
                          size="sm"
                          label={item.title}
                          onDecrease={() => decreaseQuantity(item.id)}
                          onIncrease={() => increaseQuantity(item.id)}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="md"
                      iconOnly
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      <FaTrashAlt
                        aria-hidden="true"
                        className="text-[22px] text-danger"
                      />
                    </Button>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-border pt-6.25">
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-[20px] capitalize text-ink">Total:</p>
              <Price price={total.toFixed(2)} size="md" />
            </div>

            <div className="border-t border-border py-7.5">
              <Button
                type="button"
                onClick={handlePlaceOrder}
                variant="primary"
                size="lg"
                fullWidth
              >
                Place Order
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}

export default Cart;
