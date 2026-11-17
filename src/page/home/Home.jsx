import PageTransition from "../../components/PageTransition";
import CategoryShortcuts from "../../components/home/CategoryShortcuts";
import DealStrip from "../../components/home/DealStrip";
import HomeHero from "../../components/home/HomeHero";
import ProductRail from "../../components/home/ProductRail";
import PromoBanners from "../../components/home/PromoBanners";
import TrustStrip from "../../components/home/TrustStrip";
import { homeRails } from "../../mocks/storefrontMock";

function Home() {
  return (
    <PageTransition>
      <div className="pb-16">
        <h1 className="sr-only">MAGICIAN Online Store</h1>

        <HomeHero />
        <CategoryShortcuts />
        <ProductRail rail={homeRails.newArrivals} />
        <DealStrip />
        <ProductRail rail={homeRails.bestSellers} />
        <PromoBanners />
        <ProductRail rail={homeRails.topRated} />
        <TrustStrip />
      </div>
    </PageTransition>
  );
}

export default Home;
