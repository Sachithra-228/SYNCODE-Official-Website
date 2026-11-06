import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Hand } from "lucide-react";
import { cn } from "@/lib/utils";

// Tools we build with. Positions are percentages inside the play area.
const TOOLS: { name: string; x: number; y: number; r: number; big?: boolean; light?: boolean }[] = [
  { name: "React", x: 6, y: 12, r: -8, big: true, light: true },
  { name: "Next.js", x: 30, y: 6, r: 6, big: true },
  { name: "TypeScript", x: 56, y: 14, r: -4 },
  { name: "Tailwind CSS", x: 76, y: 8, r: 9, light: true },
  { name: "Node.js", x: 14, y: 42, r: 5 },
  { name: "Vite", x: 38, y: 36, r: -12, light: true },
  { name: "Framer Motion", x: 58, y: 44, r: 4, big: true },
  { name: "GSAP", x: 84, y: 38, r: -6 },
  { name: "MongoDB", x: 4, y: 72, r: -5, light: true },
  { name: "Supabase", x: 26, y: 70, r: 8 },
  { name: "PostgreSQL", x: 48, y: 76, r: -3 },
  { name: "Vercel", x: 70, y: 70, r: 11, big: true, light: true },
  { name: "Figma", x: 88, y: 76, r: -9 },
  { name: "React Native", x: 66, y: 26, r: -14 },
];

/**
 * "Built with" playground: the tools drop into the box when it scrolls into
 * view, and visitors can grab and throw them around.
 */
export const ToolPlayground = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boxRef, { once: true, amount: 0.4 });

  return (
    <section className="py-24 md:py-32">
      <div className="container-wide">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              <span className="h-px w-8 bg-foreground/40" />
              Built with
            </span>
            <h2 className="mt-6 text-[clamp(2.25rem,5vw,4rem)] font-black leading-[0.95] tracking-tighter">
              The tools behind
              <br />
              <span className="gradient-text">the work.</span>
            </h2>
          </div>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Hand size={16} className="animate-bounce" />
            Grab a tool and throw it around
          </p>
        </div>

        <div
          ref={boxRef}
          className="relative h-[460px] touch-none overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(ellipse_at_top,hsl(0_0%_100%/0.06),transparent_60%)] md:h-[420px]"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--foreground) / 0.04) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground) / 0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        >
          {/* Screen readers get a plain list */}
          <ul className="sr-only">
            {TOOLS.map((t) => (
              <li key={t.name}>{t.name}</li>
            ))}
          </ul>

          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.name}
              aria-hidden="true"
              drag
              dragConstraints={boxRef}
              dragElastic={0.25}
              dragTransition={{ bounceStiffness: 300, bounceDamping: 18, power: 0.4 }}
              initial={{ y: -520, rotate: 0, opacity: 0 }}
              animate={inView ? { y: 0, rotate: tool.r, opacity: 1 } : undefined}
              transition={{ type: "spring", stiffness: 120, damping: 11, delay: i * 0.07 }}
              whileHover={{ scale: 1.08 }}
              whileDrag={{ scale: 1.15, rotate: 0, zIndex: 50, cursor: "grabbing" }}
              // Keep each chip fully inside the box on narrow screens
              style={{ left: `min(${tool.x}%, calc(100% - ${tool.big ? 11 : 9}rem))`, top: `${tool.y}%` }}
              className={cn(
                "absolute cursor-grab select-none whitespace-nowrap rounded-full border font-semibold shadow-[0_15px_40px_-12px_rgba(0,0,0,0.8)]",
                tool.big ? "px-6 py-3 text-base md:px-7 md:py-4 md:text-lg" : "px-4 py-2 text-sm md:px-5 md:py-2.5",
                tool.light ? "border-white bg-white text-black" : "border-white/15 bg-[hsl(0_0%_10%)] text-white"
              )}
            >
              {tool.name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolPlayground;
