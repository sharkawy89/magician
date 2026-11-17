import React from "react";
import { Link } from "react-router-dom";
import { IoCompassOutline } from "react-icons/io5";
import PageTransition from "../components/PageTransition";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";

function NotFound() {
  return (
    <PageTransition>
      <div className="mx-auto w-[90%] max-w-337.5 py-12.5">
        <EmptyState
          icon={<IoCompassOutline />}
          title="404 - Page Not Found"
          description="The page you are looking for doesn't exist or has been moved."
          action={
            <Button as={Link} to="/" variant="primary">
              Back to Home
            </Button>
          }
        />
      </div>
    </PageTransition>
  );
}

export default NotFound;
