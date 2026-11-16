import { Route, Routes, useLocation } from "react-router-dom";
import BtmHeader from "./components/header/BtmHeader";
import TopHeader from "./components/header/TopHeader";
import Home from "./page/home/Home";
import ProductDetails from "./page/productDetails/ProductDetails";
import Cart from "./page/cart/Cart";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import { AnimatePresence } from "framer-motion";
import CategoryPage from "./page/CategoryPage/CategoryPage";
import SearchResults from "./page/SearchResults";
import Favorites from "./page/favorites/Favorites";
import StaticPage from "./page/StaticPage";
import NotFound from "./page/NotFound";

function App() {
  const location = useLocation();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-10000 bg-white">
        <TopHeader />
        <BtmHeader />
      </header>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#e9e9e9",
            borderRadius: "5px",
            padding: "14px",
          },
        }}
      />

      <ScrollToTop />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.key}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route
            path="/about"
            element={
              <StaticPage
                title="About Us"
                description="Learn more about our store and what we do."
              />
            }
          />
          <Route
            path="/accessories"
            element={
              <StaticPage
                title="Accessories"
                description="Explore the accessories we have available."
              />
            }
          />
          <Route
            path="/blog"
            element={
              <StaticPage
                title="Blog"
                description="News, guides and stories from our store."
              />
            }
          />
          <Route
            path="/contact"
            element={
              <StaticPage
                title="Contact"
                description="Get in touch with our team."
              />
            }
          />
          <Route
            path="/login"
            element={
              <StaticPage
                title="Sign In"
                description="Sign in to your account to continue shopping."
              />
            }
          />
          <Route
            path="/register"
            element={
              <StaticPage
                title="Create Account"
                description="Create an account to save your cart and favorites."
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
