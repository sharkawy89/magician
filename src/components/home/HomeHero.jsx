import { useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Button from "../ui/Button";
import { cn } from "../ui/cn";
import { homeHeroSlides } from "../../mocks/storefrontMock";
import heroConsole from "../../img/banner_Hero1.jpg";
import heroPurifier from "../../img/banner_Hero2.jpg";
import heroAudio from "../../img/banner_Hero3.jpg";

const HERO_IMAGES = {
  console: heroConsole,
  purifier: heroPurifier,
  audio: heroAudio,
};

function HomeHero() {
  const reduceMotion = useReducedMotion();
  const swiperRef = useRef(null);
  const [active, setActive] = useState(0);

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured offers"
      className="pt-5"
      onFocusCapture={() => swiperRef.current?.autoplay?.stop()}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          swiperRef.current?.autoplay?.start();
        }
      }}
    >
      <div className="mx-auto w-[90%] max-w-337.5">
        <Swiper
          modules={[Autoplay, A11y]}
          loop
          autoplay={
            reduceMotion
              ? false
              : {
                  delay: 6000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
          }
          speed={reduceMotion ? 0 : 500}
          slidesPerView={1}
          a11y={{ enabled: true }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setActive(swiper.realIndex)}
          className="[&_.swiper-slide]:h-auto"
        >
          {homeHeroSlides.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <div className="grid overflow-hidden rounded-xl border border-border bg-brand-soft md:grid-cols-[1.05fr_1fr]">
                <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-12">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-secondary">
                    {slide.eyebrow}
                  </p>
                  <h2 className="mt-2 text-h3 font-bold text-ink sm:text-h2 lg:text-h1">
                    {slide.title}
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-secondary sm:text-base">
                    {slide.description}
                  </p>
                  <Button
                    as={Link}
                    to={slide.ctaTo}
                    variant="secondary"
                    size="md"
                    className="mt-5 self-start"
                  >
                    {slide.ctaLabel}
                  </Button>
                </div>

                <div className="relative h-36 sm:h-52 md:h-auto md:min-h-85">
                  <img
                    src={HERO_IMAGES[slide.image]}
                    alt=""
                    loading={index === 0 ? "eager" : "lazy"}
                    className="absolute inset-0 h-full w-full object-cover object-[72%_center]"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-4 flex items-center justify-center gap-1">
          {homeHeroSlides.map((slide, index) => {
            const selected = index === active;

            return (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show offer: ${slide.title}`}
                aria-current={selected ? "true" : undefined}
                onClick={() => swiperRef.current?.slideToLoop(index)}
                className="flex h-8 w-8 items-center justify-center rounded-pill"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-2 rounded-pill transition-all duration-200 motion-reduce:transition-none",
                    selected
                      ? "w-7 bg-ink"
                      : "w-2 bg-border-strong hover:bg-ink-secondary",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HomeHero;
