import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

import { Autoplay , Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import bannerHero1 from '../img/banner_Hero1.jpg';
import bannerHero2 from '../img/banner_Hero2.jpg';
import bannerHero3 from '../img/banner_Hero3.jpg';

const btnClasses = "flex w-max cursor-pointer items-center gap-[10px] rounded-[30px] bg-main px-[18px] py-[10px] capitalize text-white transition-all duration-300 ease-[ease] hover:scale-110";

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
            modules={[Pagination , Autoplay]}
            className="mySwiper"
          >
            <SwiperSlide>
              <div className="absolute top-1/2 left-[5%] -translate-y-1/2">
                <h4 className="mb-[0.4vw] text-[1vw] font-normal uppercase italic">Introducing the new</h4>
                <h3 className="mb-7.5 text-[3vw] leading-[1.1] font-bold text-main capitalize">
                  Microsoft Xbox <br /> 360 Controller{" "}
                </h3>
                <p className="mt-[2.5vw] mb-[2.5vw] text-[1.1vw]">Windows Xp/10/7/8 Ps3, Tv Box</p>
                <Link to="/category/smartphones" className={btnClasses}>
                  Shop Now
                </Link>
              </div>
              <img src={bannerHero1} alt="slider hero 1" />
            </SwiperSlide>

            <SwiperSlide>
              <div className="absolute top-1/2 left-[5%] -translate-y-1/2">
                <h4 className="mb-[0.4vw] text-[1vw] font-normal uppercase italic">Introducing the new</h4>
                <h3 className="mb-7.5 text-[3vw] leading-[1.1] font-bold text-main capitalize">
                  Microsoft Xbox <br /> 360 Controller{" "}
                </h3>
                <p className="mt-[2.5vw] mb-[2.5vw] text-[1.1vw]">Windows Xp/10/7/8 Ps3, Tv Box</p>
                <Link to="/category/laptops" className={btnClasses}>
                  Shop Now
                </Link>
              </div>
              <img src={bannerHero2} alt="slider hero 2" />
            </SwiperSlide>

            <SwiperSlide>
              <div className="absolute top-1/2 left-[5%] -translate-y-1/2">
                <h4 className="mb-[0.4vw] text-[1vw] font-normal uppercase italic">Introducing the new</h4>
                <h3 className="mb-7.5 text-[3vw] leading-[1.1] font-bold text-main capitalize">
                  Microsoft Xbox <br /> 360 Controller{" "}
                </h3>
                <p className="mt-[2.5vw] mb-[2.5vw] text-[1.1vw]">Windows Xp/10/7/8 Ps3, Tv Box</p>
                <Link to="/category/mobile-accessories" className={btnClasses}>
                  Shop Now
                </Link>
              </div>
              <img src={bannerHero3} alt="slider hero 3" />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  );
}

export default HeroSlider;
