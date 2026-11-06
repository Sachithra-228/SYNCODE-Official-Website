import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { Crosshairs } from "@/components/ui/crosshairs";
import { RollText } from "@/components/ui/roll-text";

const EASE = [0.16, 1, 0.3, 1] as const;

const Eyebrow = ({ children }: { children: string }) => (
  <span className="flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
    <span className="h-px w-8 bg-current opacity-50" />
    {children}
  </span>
);

// ---------------------------------------------------------------------------
// Hero: "We are ___" with a cycling word, beside the 3D robot
// ---------------------------------------------------------------------------
const HERO_WORDS = ["engineers.", "designers.", "problem solvers.", "SYNCODE."];

export const AboutHero = () => {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [i, setI] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const robotScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % HERO_WORDS.length), 2200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section ref={ref} className="relative min-h-[100svh] w-full overflow-hidden bg-black">
      <Spotlight className="-top-48 -left-32 md:-top-28 md:left-20" fill="white" />
      <Crosshairs className="bottom-10" />

      <div className="grid min-h-[100svh] w-full items-center gap-8 px-6 pb-16 pt-28 md:grid-cols-2 md:px-12 lg:px-20">
        <motion.div style={{ y: contentY, opacity: fade }} className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Eyebrow>About SYNCODE</Eyebrow>
          </motion.div>
          <h1 className="mt-6 text-[clamp(3rem,7.5vw,7rem)] font-black leading-[0.95] tracking-tighter">
            <span className="sr-only">We are SYNCODE: engineers, designers and problem solvers.</span>
            <span aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className="block"
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                We are
              </motion.span>
            </span>
            <span aria-hidden="true" className="relative block h-[1.18em] overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={HERO_WORDS[i]}
                  className="gradient-text absolute left-0 top-0 block whitespace-nowrap"
                  initial={reducedMotion ? { opacity: 0 } : { y: "100%", opacity: 0 }}
                  animate={reducedMotion ? { opacity: 1 } : { y: "0%", opacity: 1 }}
                  exit={reducedMotion ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  {HERO_WORDS[i]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-neutral-300 md:text-xl"
          >
            We engineer scalable web, mobile, and AI solutions for businesses that need reliable
            technology, faster delivery, and measurable outcomes.
          </motion.p>
        </motion.div>

        <motion.div style={{ scale: robotScale }} className="relative h-[340px] w-full md:h-[78vh]">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="h-full w-full"
          />
        </motion.div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Story: a statement whose words light up as you scroll
// ---------------------------------------------------------------------------
const LitWord = ({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) => {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>{" "}
    </>
  );
};

export const StorySection = ({ text }: { text: string }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");
  return (
    <section className="py-24 md:py-36">
      <div className="container-wide grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-32">
            <Eyebrow>Our story</Eyebrow>
          </div>
        </div>
        <p
          ref={ref}
          className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-semibold leading-[1.18] tracking-tight lg:col-span-9"
        >
          {words.map((w, i) => (
            <LitWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {w}
            </LitWord>
          ))}
        </p>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Values: big-letter tiles that flip over on hover, focus or tap
// ---------------------------------------------------------------------------
export type Value = { icon: LucideIcon; title: string; description: string };

const ValueTile = ({ value, index }: { value: Value; index: number }) => {
  const [flipped, setFlipped] = useState(false);
  const Icon = value.icon;
  return (
    <motion.li
      initial={{ opacity: 0, y: 120, rotateX: -25 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 70, damping: 15, delay: index * 0.12 }}
      style={{ perspective: 1200, transformOrigin: "50% 100%" }}
      className="list-none"
    >
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        onFocus={() => setFlipped(true)}
        onBlur={() => setFlipped(false)}
        aria-pressed={flipped}
        className="group relative block h-80 w-full text-left [transform-style:preserve-3d]"
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative h-full w-full [transform-style:preserve-3d]"
        >
          {/* Front: giant letter */}
          <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl border border-black/10 bg-white p-7 text-black [backface-visibility:hidden]">
            <span className="font-mono text-xs uppercase tracking-widest text-black/40">Value</span>
            <span className="absolute -right-4 -top-10 select-none text-[13rem] font-black leading-none text-black/[0.06]">
              {value.title[0]}
            </span>
            <span className="text-[7rem] font-black leading-[0.8] tracking-tighter">{value.title[0]}</span>
            <span className="text-xl font-semibold">{value.title}</span>
          </div>
          {/* Back: description */}
          <div className="absolute inset-0 flex flex-col justify-between rounded-3xl bg-black p-7 text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
              <Icon size={22} />
            </span>
            <div>
              <h3 className="text-xl font-semibold">{value.title}</h3>
              <p className="mt-3 leading-relaxed text-white/75">{value.description}</p>
            </div>
          </div>
        </motion.div>
      </button>
    </motion.li>
  );
};

export const ValuesSection = ({ values }: { values: Value[] }) => (
  <section className="light-section bg-[hsl(0_0%_97%)] py-24 text-black md:py-32">
    <div className="container-wide">
      <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>What we stand for</Eyebrow>
          <h2 className="mt-6 text-[clamp(2.25rem,5vw,4rem)] font-black leading-[0.95] tracking-tighter">
            Values we build on.
          </h2>
        </div>
        <p className="max-w-sm text-black/60">Hover or tap a card to turn it over.</p>
      </div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((v, i) => (
          <ValueTile key={v.title} value={v} index={i} />
        ))}
      </ul>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// Closing call to action with a slow marquee
// ---------------------------------------------------------------------------
export const AboutCTA = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const words = ["Build with us", "Join the team", "Let's talk", "Start a project"];
  return (
    <section className="overflow-hidden border-t border-white/10 py-24 md:py-32">
      <div
        aria-hidden="true"
        className="mb-16 flex w-max animate-[logo-row-left_40s_linear_infinite] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        {[0, 1].map((c) => (
          <div key={c} className="flex items-center pr-10">
            {[...words, ...words].map((w, i) => (
              <span key={i} className="flex items-center">
                <span
                  className="whitespace-nowrap px-10 text-[clamp(2.5rem,6vw,5rem)] font-black uppercase tracking-tight text-transparent"
                  style={{ WebkitTextStroke: "1px hsl(var(--foreground) / 0.3)" }}
                >
                  {w}
                </span>
                <span className="text-2xl text-foreground/30">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.7, ease: EASE }}
        className="container-wide mx-auto max-w-2xl text-center"
      >
        <h2 className="text-display-md">Want to work with us?</h2>
        <p className="mb-8 mt-6 text-lg text-muted-foreground">
          We are always looking for talented people and exciting projects. Let&apos;s start a
          conversation.
        </p>
        <Link to="/contact" className={cn("btn-primary")}>
          <RollText>Get in Touch</RollText>
          <ArrowUpRight size={18} className="ml-2" />
        </Link>
      </motion.div>
    </section>
  );
};
