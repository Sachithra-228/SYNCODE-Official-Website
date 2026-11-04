import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Site-wide inertia scrolling. One Lenis instance drives the page and keeps GSAP
// ScrollTrigger in step with it. It is skipped for visitors who prefer reduced
// motion, and touch devices keep their native scrolling (Lenis default).

let lenis: Lenis | null = null;

export const startSmoothScroll = () => {
  if (typeof window === "undefined" || lenis) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  gsap.registerPlugin(ScrollTrigger);

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    anchors: true,
  });

  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
};

/** Jump or glide to the top, through Lenis when it is running. */
export const scrollToTop = (smooth = true) => {
  if (lenis) {
    lenis.scrollTo(0, { immediate: !smooth });
  } else {
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  }
};
