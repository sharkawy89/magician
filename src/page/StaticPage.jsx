import React from "react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";

function StaticPage({ title, description }) {
  return (
    <PageTransition>
      <div className="mx-auto w-[90%] max-w-337.5">
        <div className="relative mb-5 border-b border-line pt-3.75 pr-5 pb-5 after:absolute after:-bottom-px after:h-0.5 after:w-25 after:bg-main after:content-['']">
          <h2 className="mb-2.5 text-[30px] font-bold text-main capitalize">
            {title}
          </h2>
          <p>{description}</p>
        </div>

        <div className="py-12.5">
          <p className="mb-7.5 leading-[1.8]">
            This page is currently under construction. In the meantime, you can
            browse our latest products from the home page.
          </p>
          <Link
            to="/"
            className="flex w-max items-center gap-[10px] rounded-[30px] bg-main px-[18px] py-[10px] capitalize text-white transition-all duration-300 ease-[ease] hover:scale-110"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}

export default StaticPage;
