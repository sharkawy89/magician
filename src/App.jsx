import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./page/home/Home";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, LazyMotion } from "framer-motion";
import Layout from "./components/layout/Layout";
import RouteFallback from "./components/ui/RouteFallback";

// Home and the Layout shell stay in the main chunk so the landing page paints
// immediately. Everything else is split into a route-level chunk.
const ProductDetails = lazy(
  () => import("./page/productDetails/ProductDetails"),
);
const Cart = lazy(() => import("./page/cart/Cart"));
const Checkout = lazy(() => import("./page/checkout/Checkout"));
const CategoryPage = lazy(() => import("./page/CategoryPage/CategoryPage"));
const SearchResults = lazy(() => import("./page/SearchResults"));
const Favorites = lazy(() => import("./page/favorites/Favorites"));
const Blog = lazy(() => import("./page/blog/Blog"));
const BlogPost = lazy(() => import("./page/blog/BlogPost"));
const About = lazy(() => import("./page/about/About"));
const Contact = lazy(() => import("./page/contact/Contact"));
const StaticPage = lazy(() => import("./page/StaticPage"));
const NotFound = lazy(() => import("./page/NotFound"));

// The dev-only page is a lazy, dead-code-eliminated import. Production builds
// replace import.meta.env.DEV with false, so neither the route nor the chunk
// is emitted.
const UiKitPage = import.meta.env.DEV
  ? lazy(() => import("./page/UiKit"))
  : null;

// Feature bundle loads after first paint; m + domAnimation keeps the same
// enter/exit/opacity/transform and reduced-motion behaviour without layout
// projection or drag code in the main chunk.
const loadFeatures = () =>
  import("./components/motion/features").then((module) => module.default);

function App() {
  const location = useLocation();

  return (
    <LazyMotion features={loadFeatures} strict>
      <>
        <Layout>
        <Suspense fallback={<RouteFallback />}>
          <AnimatePresence mode="wait">
            {/* Key by path only: listing filters live in search params and must
                update in place instead of remounting the route. */}
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
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
        </Suspense>
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
    </LazyMotion>
  );
}

export default App;
