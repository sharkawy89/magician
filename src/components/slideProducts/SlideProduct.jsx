import React from "react";
import Product from "./Product";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";

function SlideProduct({ data = [], title }) {
  const products = Array.isArray(data) ? data : [];

  if (products.length === 0) return null;

  return (
    <div className="py-12.5">
      <div className="mx-auto w-[90%] max-w-337.5">
        <div className="relative mb-5 border-b border-border pt-3.75 pe-5 pb-5 after:absolute after:-bottom-px after:h-0.5 after:w-25 after:bg-brand after:content-['']">
          <h2 className="mb-2.5 text-[30px] font-bold text-ink capitalize">
            {title}
          </h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias,
            voluptates?
          </p>
        </div>

        <Swiper
          loop={products.length > 5}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          slidesPerView={5}
          navigation={true}
          modules={[Navigation, Autoplay]}
          className="mySwiper"
        >
          {products.map((item) => {
            return (
              <SwiperSlide key={item.id}>
                {" "}
                <Product item={item} />{" "}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

export default SlideProduct;
