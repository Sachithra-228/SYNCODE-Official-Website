import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

// Screenshots shown in the mosaic inside the window
const SHOTS = [
  "/screens/jayasvictorytravel.webp",
  "/screens/chinalankamotors.webp",
  "/screens/valorclothing.webp",
  "/screens/hotelsevenway.webp",
  "/screens/unicareconnect.webp",
  "/screens/maisonashri.webp",
];

/**
 * Scroll-driven opener for the Projects page. A small window of project
 * screenshots grows to fill the screen while the headline splits apart
 * around it, then hands over to the project gallery below.
 */
export const WorkWindow = () => {
  const ref = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const width = useTransform(p, [0, 0.7], isMobile ? ["72vw", "100vw"] : ["32vw", "100vw"]);
  const height = useTransform(p, [0, 0.7], isMobile ? ["30vh", "100vh"] : ["42vh", "100vh"]);
  const radius = useTransform(p, [0, 0.7], [28, 0]);
  const mosaicScale = useTransform(p, [0, 0.7], [1.7, 1]);
  const shade = useTransform(p, [0.55, 0.85], [0, 0.82]);

  // Headline halves move apart and fade as the window grows
  const leftX = useTransform(p, [0, 0.5], ["0vw", isMobile ? "-20vw" : "-28vw"]);
  const rightX = useTransform(p, [0, 0.5], ["0vw", isMobile ? "20vw" : "28vw"]);
  const textOpacity = useTransform(p, [0.1, 0.45], [1, 0]);

  // Closing line appears over the full-screen mosaic
  const captionOpacity = useTransform(p, [0.72, 0.88], [0, 1]);
  const captionY = useTransform(p, [0.72, 0.88], [40, 0]);

  return (
    <section ref={ref} id="project-showcase" aria-label="Our work" className="relative h-[260vh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        {/* Headline, split around the window */}
        <div className="pointer-events-none absolute left-6 top-[16%] z-10 md:left-[5vw] md:top-1/2 md:-translate-y-1/2">
          <motion.p
            style={{ x: leftX, opacity: textOpacity }}
            className="text-[clamp(2rem,4.6vw,4.5rem)] font-black leading-[0.95] tracking-tighter"
          >
            Websites
            <br />
            that real
          </motion.p>
        </div>
        <div className="pointer-events-none absolute bottom-[16%] right-6 z-10 text-right md:bottom-auto md:right-[5vw] md:top-1/2 md:-translate-y-1/2">
          <motion.p
            style={{ x: rightX, opacity: textOpacity }}
            className="text-[clamp(2rem,4.6vw,4.5rem)] font-black leading-[0.95] tracking-tighter"
          >
            businesses
            <br />
            <span className="gradient-text">run on.</span>
          </motion.p>
        </div>

        {/* The growing window */}
        <motion.div
          style={{ width, height, borderRadius: radius }}
          className="relative overflow-hidden bg-card shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
        >
          <motion.div
            style={{ scale: mosaicScale }}
            className="absolute inset-[-2%] grid grid-cols-3 grid-rows-2 gap-2 p-2"
          >
            {SHOTS.map((src) => (
              <div key={src} className="overflow-hidden rounded-xl">
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
              </div>
            ))}
          </motion.div>
          <motion.div style={{ opacity: shade }} className="absolute inset-0 bg-black" />

          <motion.div
            style={{ opacity: captionOpacity, y: captionY }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">Designed, built and live</p>
            <p className="mt-4 max-w-4xl text-[clamp(2.25rem,6vw,5.5rem)] font-black leading-[0.95] tracking-tighter text-white">
              Real brands. Real results.
            </p>
            <p className="mt-6 text-sm text-white/70">Keep scrolling to explore each one</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WorkWindow;
