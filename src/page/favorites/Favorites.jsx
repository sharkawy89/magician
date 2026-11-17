import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { CartContext } from "../../components/context/cartContextValue";
import PageTransition from "../../components/PageTransition";
import Product from "../../components/slideProducts/Product";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";

function Favorites() {
  const { favorites } = useContext(CartContext);

  return (
    <PageTransition>
      <div className="mx-auto w-[90%] max-w-337.5">
        <div className="relative mb-5 border-b border-border pt-3.75 pe-5 pb-5 after:absolute after:-bottom-px after:h-0.5 after:w-25 after:bg-brand after:content-['']">
          <h2 className="mb-2.5 text-[30px] font-bold text-ink capitalize">
            Your Favorites
          </h2>
        </div>

        {favorites.length === 0 ? (
          <EmptyState
            icon={<FaRegHeart />}
            title="No favorites yet"
            description="Tap the heart on a product to save it here."
            action={
              <Button as={Link} to="/" variant="primary">
                Browse products
              </Button>
            }
          />
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-5 py-12.5">
            {favorites.map((item) => (
              <Product item={item} key={item.id} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

export default Favorites;
