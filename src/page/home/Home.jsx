import { lazy, Suspense } from "react";
import PageTransition from "../../components/PageTransition";
import CategoryShortcuts from "../../components/home/CategoryShortcuts";
import DealStrip from "../../components/home/DealStrip";
import HomeHero from "../../components/home/HomeHero";
import { RailSkeleton } from "../../components/home/RailSkeleton";
import PromoBanners from "../../components/home/PromoBanners";
import TrustStrip from "../../components/home/TrustStrip";
import { homeRails } from "../../mocks/storefrontMock";

// The hero stays in the first paint; the three product rails below it load on
// demand. RailSkeleton reserves their height so nothing shifts as they arrive.
const ProductRail = lazy(() => import("../../components/home/ProductRail"));

function Home() {
  return (
    <PageTransition>
      <div className="pb-16">
        <h1 className="sr-only">MAGICIAN Online Store</h1>

        <HomeHero />
        <CategoryShortcuts />
        <Suspense fallback={<RailSkeleton />}>
          <ProductRail rail={homeRails.newArrivals} />
        </Suspense>
        <DealStrip />
        <Suspense fallback={<RailSkeleton />}>
          <ProductRail rail={homeRails.bestSellers} />
        </Suspense>
        <PromoBanners />
        <Suspense fallback={<RailSkeleton />}>
          <ProductRail rail={homeRails.topRated} />
        </Suspense>
        <TrustStrip />
      </div>
    </PageTransition>
  );
}

export default Home;
