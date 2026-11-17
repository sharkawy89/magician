import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./page/home/Home";
import ProductDetails from "./page/productDetails/ProductDetails";
import Cart from "./page/cart/Cart";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import CategoryPage from "./page/CategoryPage/CategoryPage";
import SearchResults from "./page/SearchResults";
import Favorites from "./page/favorites/Favorites";
import StaticPage from "./page/StaticPage";
import NotFound from "./page/NotFound";
import Layout from "./components/layout/Layout";

// The dev-only page is a lazy, dead-code-eliminated import. Production builds
// replace import.meta.env.DEV with false, so neither the route nor the chunk
// is emitted.
const UiKitPage = import.meta.env.DEV
  ? lazy(() => import("./page/UiKit"))
  : null;

function App() {
  const location = useLocation();

  return (
    <>
      <Layout>
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
            {import.meta.env.DEV ? (
              <Route
                path="/ui-kit"
                element={
                  <Suspense fallback={null}>
                    <UiKitPage />
                  </Suspense>
                }
              />
            ) : null}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Layout>

      <Toaster
        position="bottom-right"
        containerStyle={{
          zIndex: "var(--z-toast)",
          bottom: "var(--toast-offset)",
        }}
        toastOptions={{
          style: {
            background: "var(--color-surface-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "14px",
            color: "var(--color-ink)",
            boxShadow: "var(--shadow-panel)",
          },
          success: {
            iconTheme: {
              primary: "var(--color-success)",
              secondary: "var(--color-surface)",
            },
          },
          error: {
            iconTheme: {
              primary: "var(--color-danger)",
              secondary: "var(--color-surface)",
            },
          },
        }}
      />
    </>
  );
}

export default App;
