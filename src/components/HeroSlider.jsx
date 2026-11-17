import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

import { Autoplay, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import Button from "./ui/Button";
import bannerHero1 from "../img/banner_Hero1.jpg";
import bannerHero2 from "../img/banner_Hero2.jpg";
import bannerHero3 from "../img/banner_Hero3.jpg";

const ctaClass = "capitalize";

function HeroSlider() {
  return (
    <>
      <div className="relative mb-20 pt-5">
        <div className="mx-auto w-[90%] max-w-337.5">
          <Swiper
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={true}
            modules={[Pagination, Autoplay]}
            className="mySwiper"
          >
            <SwiperSlide>
              <div className="absolute top-1/2 insert-s-[5%] -translate-y-1/2">
                <h4 className="mb-[0.4vw] text-[1vw] font-normal uppercase italic">
                  Introducing the new
                </h4>
                <h3 className="mb-7.5 text-[3vw] leading-[1.1] font-bold text-ink capitalize">
                  Microsoft Xbox <br /> 360 Controller{" "}
                </h3>
                <p className="mt-[2.5vw] mb-[2.5vw] text-[1.1vw]">
                  Windows Xp/10/7/8 Ps3, Tv Box
                </p>
                <Button
                  as={Link}
                  to="/category/smartphones"
                  variant="primary"
                  size="lg"
                  className={ctaClass}
                >
                  Shop Now
                </Button>
              </div>
              <img src={bannerHero1} alt="slider hero 1" className="w-full" />
            </SwiperSlide>

            <SwiperSlide>
              <div className="absolute top-1/2 insert-s-[5%] -translate-y-1/2">
                <h4 className="mb-[0.4vw] text-[1vw] font-normal uppercase italic">
                  Introducing the new
                </h4>
                <h3 className="mb-7.5 text-[3vw] leading-[1.1] font-bold text-ink capitalize">
                  Microsoft Xbox <br /> 360 Controller{" "}
                </h3>
                <p className="mt-[2.5vw] mb-[2.5vw] text-[1.1vw]">
                  Windows Xp/10/7/8 Ps3, Tv Box
                </p>
                <Button
                  as={Link}
                  to="/category/laptops"
                  variant="primary"
                  size="lg"
                  className={ctaClass}
                >
                  Shop Now
                </Button>
              </div>
              <img src={bannerHero2} alt="slider hero 2" className="w-full" />
            </SwiperSlide>

            <SwiperSlide>
              <div className="absolute top-1/2 insert-s-[5%] -translate-y-1/2">
                <h4 className="mb-[0.4vw] text-[1vw] font-normal uppercase italic">
                  Introducing the new
                </h4>
                <h3 className="mb-7.5 text-[3vw] leading-[1.1] font-bold text-ink capitalize">
                  Microsoft Xbox <br /> 360 Controller{" "}
                </h3>
                <p className="mt-[2.5vw] mb-[2.5vw] text-[1.1vw]">
                  Windows Xp/10/7/8 Ps3, Tv Box
                </p>
                <Button
                  as={Link}
                  to="/category/mobile-accessories"
                  variant="primary"
                  size="lg"
                  className={ctaClass}
                >
                  Shop Now
                </Button>
              </div>
              <img src={bannerHero3} alt="slider hero 3" className="w-full" />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  );
}

export default HeroSlider;
