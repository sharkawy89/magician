import React from "react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import Button from "../components/ui/Button";

function StaticPage({ title, description }) {
  return (
    <PageTransition>
      <div className="mx-auto w-[90%] max-w-337.5">
        <div className="relative mb-5 border-b border-border pt-3.75 pe-5 pb-5 after:absolute after:-bottom-px after:h-0.5 after:w-25 after:bg-brand after:content-['']">
          <h2 className="mb-2.5 text-[30px] font-bold text-ink capitalize">
            {title}
          </h2>
          <p>{description}</p>
        </div>

        <div className="py-12.5">
          <p className="mb-7.5 leading-[1.8]">
            This page is currently under construction. In the meantime, you can
            browse our latest products from the home page.
          </p>
          <Button as={Link} to="/" variant="primary">
            Continue Shopping
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}

export default StaticPage;
