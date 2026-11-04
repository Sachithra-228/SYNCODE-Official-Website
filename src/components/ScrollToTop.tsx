import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToTop, startSmoothScroll } from "@/lib/smooth-scroll";

// Starts site-wide smooth scrolling and returns to the top on every page change.
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => startSmoothScroll(), []);

  useEffect(() => {
    scrollToTop(false);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
