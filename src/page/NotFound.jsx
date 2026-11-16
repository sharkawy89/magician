import React from "react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";

function NotFound() {
  return (
    <PageTransition>
      <div className="mx-auto w-[90%] max-w-337.5 py-12.5">
        <h2 className="mb-2.5 text-[30px] font-bold text-main">
          404 - Page Not Found
        </h2>
        <p className="mb-7.5">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          to="/"
          className="flex w-max items-center gap-[10px] rounded-[30px] bg-main px-[18px] py-[10px] capitalize text-white transition-all duration-300 ease-[ease] hover:scale-110"
        >
          Back to Home
        </Link>
      </div>
    </PageTransition>
  );
}

export default NotFound;
