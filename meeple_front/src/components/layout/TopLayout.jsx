import React from "react";
import { useLocation } from "react-router-dom";
import TopNavbar from "../Navbar/TopNavBar";

const TopLayout = ({ children }) => {
  const location = useLocation();
  const showNavbar =
    location.pathname !== "/" &&
    !location.pathname.match(/^\/game\/burumabul\/[\w-]+(\/\d+)?$/) &&
    !location.pathname.match(/^\/catch-mind\/[\w-]+$/) &&
    !location.pathname.match(/^\/game\/cockroach\/[\w-]+$/) &&
    location.pathname !== "/errorpage"

  return (
    <div className="min-h-screen">
      {showNavbar && <TopNavbar />}
      <main className={showNavbar ? "pt-16" : ""}>{children}</main>
    </div>
  );
};

export default TopLayout;
