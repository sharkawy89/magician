import { useCallback, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MiniCartContext } from "../context/miniCartContextValue";
import ScrollToTop from "../ScrollToTop";
import AnnouncementBar from "./AnnouncementBar";
import CategoriesDrawer from "./CategoriesDrawer";
import Footer from "./Footer";
import Header from "./Header";
import MiniCartDrawer from "./MiniCartDrawer";
import MobileMenuDrawer from "./MobileMenuDrawer";
import MobileTabBar from "./MobileTabBar";

function Layout({ children }) {
  const location = useLocation();
  const { closeMiniCart } = useContext(MiniCartContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchFocusSignal, setSearchFocusSignal] = useState(0);

  useEffect(() => {
    closeMiniCart();
    setMenuOpen(false);
    setCategoriesOpen(false);
  }, [location.pathname, location.search, closeMiniCart]);

  const openMenu = () => {
    setCategoriesOpen(false);
    setMenuOpen(true);
  };

  const openCategories = () => {
    setMenuOpen(false);
    setCategoriesOpen(true);
  };

  const focusSearch = useCallback(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    setSearchFocusSignal((current) => current + 1);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="fixed inset-s-3 top-3 z-modal translate-y-[-200%] rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white shadow-panel transition-transform focus:translate-y-0 motion-reduce:transition-none"
      >
        Skip to content
      </a>

      <AnnouncementBar />

      <Header
        onOpenMenu={openMenu}
        onOpenCategories={openCategories}
        searchFocusSignal={searchFocusSignal}
      />

      <main id="main" tabIndex={-1} className="tabbar-clearance flex-1">
        {children}
      </main>

      <Footer />

      {location.pathname !== "/checkout" && (
        <MobileTabBar
          onOpenCategories={openCategories}
          onFocusSearch={focusSearch}
        />
      )}

      <MobileMenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
      <CategoriesDrawer
        open={categoriesOpen}
        onClose={() => setCategoriesOpen(false)}
      />
      <MiniCartDrawer />

      <ScrollToTop />
    </div>
  );
}

export default Layout;
