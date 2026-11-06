import { useEffect, useRef, useState, type MouseEvent } from "react";
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
import { ArrowDown, ArrowLeft, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { RollText } from "@/components/ui/roll-text";

export type ServiceDetailData = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  extendedDescription?: string;
  highlights?: { label: string; value: string }[];
  heroImage: string;
  features: { title: string; description: string }[];
  process: { step: string; description: string }[];
  gallery: string[];
};

const pad = (n: number) => String(n).padStart(2, "0");
const EASE = [0.16, 1, 0.3, 1] as const;

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

/** Text whose letters scramble and settle into place when it scrolls into view. */
const ScrambleText = ({ text, className }: { text: string; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&+<>/";
    const start = performance.now();
    const duration = 900;
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const settled = Math.floor(p * text.length);
      setShown(
        Array.from(text)
          .map((ch, i) =>
            i < settled || ch === " " ? ch : glyphs[Math.floor(Math.random() * glyphs.length)]
          )
          .join("")
      );
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reducedMotion, text]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
};

/** A paragraph whose words brighten one by one as it scrolls through the screen. */
const ScrollLitText = ({ text, className }: { text: string; className?: string }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <LitWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {word}
        </LitWord>
      ))}
    </p>
  );
};

const LitWord = ({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) => {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>{" "}
    </>
  );
};

/** Section label with a short rule, used at the top of each section. */
const Eyebrow = ({ children, className }: { children: string; className?: string }) => (
  <span
    className={cn(
      "flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-muted-foreground",
      className
    )}
  >
    <span className="h-px w-8 bg-current opacity-50" />
    {children}
  </span>
);

// ---------------------------------------------------------------------------
// 1. Hero: image zooms and darkens on scroll while the title floats away
// ---------------------------------------------------------------------------
const Hero = ({ service, index, total }: { service: ServiceDetailData; index: number; total: number }) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.3]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const shade = useTransform(scrollYProgress, [0, 1], [0.35, 0.85]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const Icon = service.icon;
  const words = service.title.split(" ");

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <motion.img
        src={service.heroImage}
        alt=""
        style={{ scale: imgScale, y: imgY }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <motion.div style={{ opacity: shade }} className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-wide relative flex h-full flex-col justify-between pb-24 pt-24 md:pb-28 md:pt-28"
      >
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/services"
            className="roll-host inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm text-white backdrop-blur-md transition hover:bg-white hover:text-black"
          >
            <ArrowLeft size={16} />
            <RollText>All services</RollText>
          </Link>
          <span className="font-mono text-xs tracking-widest text-white/60">
            <span className="text-white">{pad(index + 1)}</span> / {pad(total)}
          </span>
        </div>

        <div>
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.2 }}
            className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black"
          >
            <Icon size={26} />
          </motion.div>
          <h1 className="max-w-5xl text-[clamp(2.75rem,8vw,7rem)] font-black leading-[0.95] tracking-tighter text-white">
            {/* Real spaces between the masked words keep the title readable for search engines */}
            {words.map((word, i) => (
              <span key={i}>
                <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 1, delay: 0.25 + i * 0.08, ease: EASE }}
                  >
                    {word}
                  </motion.span>
                </span>{" "}
              </span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl"
          >
            {service.subtitle}
          </motion.p>
        </div>
      </motion.div>

      <a
        href="#service-detail-content"
        aria-label="Scroll to details"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60 transition-colors hover:text-white"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-white/20">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-white"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        <ArrowDown size={14} className="sr-only" />
      </a>
    </section>
  );
};

// ---------------------------------------------------------------------------
// 2. Overview: scroll-lit description and highlight cards that decode
// ---------------------------------------------------------------------------
const HighlightCard = ({ label, value, i }: { label: string; value: string; i: number }) => {
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
      onMouseMove={onMove}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors duration-500 hover:border-white/30"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(300px circle at var(--x, 50%) var(--y, 50%), hsl(var(--foreground) / 0.09), transparent 60%)",
        }}
      />
      <p className="relative text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <ScrambleText text={value} className="relative mt-3 block font-mono text-base font-bold leading-snug md:text-lg" />
    </motion.div>
  );
};

const Overview = ({ service }: { service: ServiceDetailData }) => (
  <section id="service-detail-content" className="py-24 md:py-32">
    <div className="container-wide grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-3">
        <Eyebrow className="lg:sticky lg:top-32">Overview</Eyebrow>
      </div>
      <div className="lg:col-span-9">
        <ScrollLitText
          text={service.description}
          className="text-[clamp(1.6rem,3.2vw,2.75rem)] font-semibold leading-[1.2] tracking-tight"
        />
        {service.extendedDescription && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
            className="mt-8 max-w-3xl text-lg leading-relaxed text-muted-foreground"
          >
            {service.extendedDescription}
          </motion.p>
        )}
        {service.highlights && (
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {service.highlights.map((h, i) => (
              <HighlightCard key={h.label} label={h.label} value={h.value} i={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// 3. What We Deliver: features light up as they pass the middle of the screen
// ---------------------------------------------------------------------------
const FeatureRow = ({
  feature,
  index,
  active,
  onActive,
}: {
  feature: ServiceDetailData["features"][number];
  index: number;
  active: boolean;
  onActive: (i: number) => void;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  // "In view" only while the row crosses a thin band across the middle of the screen
  const centered = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (centered) onActive(index);
  }, [centered, index, onActive]);

  return (
    <li
      ref={ref}
      onMouseEnter={() => onActive(index)}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-6 transition-all duration-500 md:p-8",
        active ? "scale-[1.02] border-black bg-black text-white shadow-2xl" : "border-black/10 bg-white text-black"
      )}
    >
      <div className="flex items-start gap-5">
        <span className={cn("font-mono text-sm transition-colors", active ? "text-white/50" : "text-black/30")}>
          {pad(index + 1)}
        </span>
        <div>
          <h3 className="text-xl font-semibold md:text-2xl">{feature.title}</h3>
          <p
            className={cn(
              "mt-2 leading-relaxed transition-colors duration-500",
              active ? "text-white/75" : "text-black/55"
            )}
          >
            {feature.description}
          </p>
        </div>
      </div>
    </li>
  );
};

const Deliver = ({ service }: { service: ServiceDetailData }) => {
  const [active, setActive] = useState(0);
  const total = service.features.length;

  return (
    <section className="light-section bg-[hsl(0_0%_97%)] py-24 text-black md:py-32">
      <div className="container-wide grid gap-12 lg:grid-cols-12">
        {/* Sticky side: heading and the active feature number */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Eyebrow>What we deliver</Eyebrow>
            <h2 className="mt-6 text-[clamp(2.25rem,5vw,4rem)] font-black leading-[0.95] tracking-tighter">
              Everything you need, built properly.
            </h2>
            <div className="mt-10 hidden items-end gap-4 lg:flex">
              <div className="relative h-[7rem] w-[8.6rem] overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={active}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="absolute inset-0 font-mono text-[7rem] font-bold leading-none"
                  >
                    {pad(active + 1)}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="mb-3 font-mono text-sm text-black/40">/ {pad(total)}</span>
            </div>
            <div className="mt-6 hidden h-1 w-full max-w-xs overflow-hidden rounded-full bg-black/10 lg:block">
              <motion.div
                className="h-full bg-black"
                animate={{ width: `${((active + 1) / total) * 100}%` }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </div>
          </div>
        </div>

        {/* Feature rows */}
        <ul className="space-y-4 lg:col-span-7">
          {service.features.map((f, i) => (
            <FeatureRow key={f.title} feature={f} index={i} active={i === active} onActive={setActive} />
          ))}
        </ul>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// 4. Gallery: images unveil with a wipe and drift at different speeds
// ---------------------------------------------------------------------------
const GalleryImage = ({ image, index, y }: { image: string; index: number; y: MotionValue<string> }) => {
  // Watch the unclipped wrapper: a fully clipped element never counts as "in view"
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <motion.div ref={ref} style={{ y }}>
      <motion.div
        initial={{ clipPath: "inset(100% 0% 0% 0% round 1.5rem)" }}
        animate={inView ? { clipPath: "inset(0% 0% 0% 0% round 1.5rem)" } : undefined}
        transition={{ duration: 1.2, delay: index * 0.12, ease: EASE }}
        className={cn(
          "group relative overflow-hidden rounded-3xl",
          index === 1 ? "aspect-[3/4]" : "aspect-[4/5]"
        )}
      >
        <img
          src={image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover grayscale transition-all duration-1000 ease-out group-hover:scale-110 group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </motion.div>
    </motion.div>
  );
};

const Gallery = ({ service }: { service: ServiceDetailData }) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const speeds = [
    useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]),
    useTransform(scrollYProgress, [0, 1], ["22%", "-22%"]),
    useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]),
  ];

  return (
    <section ref={ref} className="overflow-hidden py-24 md:py-36">
      <div className="container-wide">
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>The craft</Eyebrow>
            <h2 className="mt-6 text-[clamp(2.25rem,5vw,4rem)] font-black leading-[0.95] tracking-tighter">
              Detail at every layer.
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            Clean code, careful design and reliable delivery, from the first sketch to launch.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {service.gallery.map((image, i) => (
            <GalleryImage key={image} image={image} index={i} y={speeds[i % 3]} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// 5. Process: a timeline whose line fills as you scroll, lighting each step
// ---------------------------------------------------------------------------
const ProcessStep = ({ item, index }: { item: ServiceDetailData["process"][number]; index: number }) => {
  const ref = useRef<HTMLLIElement>(null);
  const reached = useInView(ref, { margin: "0px 0px -45% 0px" });
  return (
    <li ref={ref} className="relative pb-14 pl-16 last:pb-0 md:pl-24">
      <span
        className={cn(
          "absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full border font-mono text-sm font-bold transition-all duration-500 md:h-14 md:w-14",
          reached
            ? "scale-110 border-white bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.25)]"
            : "border-white/20 bg-background text-white/40"
        )}
      >
        {pad(index + 1)}
      </span>
      <motion.div
        animate={{ opacity: reached ? 1 : 0.35, x: reached ? 0 : 12 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <h3 className="text-2xl font-semibold md:text-3xl">{item.step}</h3>
        <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">{item.description}</p>
      </motion.div>
    </li>
  );
};

const Process = ({ service }: { service: ServiceDetailData }) => {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.6", "end 0.6"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="border-t border-white/10 py-24 md:py-32">
      <div className="container-wide grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Eyebrow>Our process</Eyebrow>
            <h2 className="mt-6 text-[clamp(2.25rem,5vw,4rem)] font-black leading-[0.95] tracking-tighter">
              From first call to launch day.
            </h2>
            <p className="mt-6 max-w-sm text-muted-foreground">
              A clear path with regular check-ins, so you always know where your project stands.
            </p>
          </div>
        </div>
        <div className="relative lg:col-span-7">
          {/* Track and fill, centred on the step circles */}
          <span className="absolute bottom-0 left-[1.375rem] top-0 w-px bg-white/10 md:left-7" aria-hidden="true" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: fill }}
            className="absolute bottom-0 left-[1.375rem] top-0 w-px origin-top bg-white md:left-7"
          />
          <ol ref={listRef} className="relative">
            {service.process.map((item, i) => (
              <ProcessStep key={item.step} item={item} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// 6. Closing: call to action and a large link to the next service
// ---------------------------------------------------------------------------
const NextService = ({ next }: { next: { slug: string; data: ServiceDetailData } }) => (
  <section className="pb-24 pt-8 md:pb-32">
    <div className="container-wide">
      <div className="mb-16 flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:flex-row md:items-center md:p-12">
        <div>
          <h2 className="text-display-sm">Ready to get started?</h2>
          <p className="mt-2 text-muted-foreground">
            Tell us about your project and we&apos;ll show you how we can help.
          </p>
        </div>
        <Link to="/contact" className="btn-primary shrink-0">
          <RollText>Start a Conversation</RollText>
          <ArrowUpRight size={18} className="ml-2" />
        </Link>
      </div>

      <Link
        to={`/services/${next.slug}`}
        className="group relative block overflow-hidden rounded-3xl border border-white/10 px-8 py-14 md:px-12 md:py-20"
      >
        {/* Next service's image wipes in on hover */}
        <img
          src={next.data.heroImage}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-0 grayscale transition-all duration-700 [clip-path:inset(0_100%_0_0)] group-hover:opacity-100 group-hover:[clip-path:inset(0_0%_0_0)]"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        <div className="relative flex items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Next service</span>
            <p className="mt-4 text-[clamp(2rem,6vw,5rem)] font-black leading-[0.95] tracking-tighter transition-transform duration-700 ease-out group-hover:translate-x-3">
              {next.data.title}
            </p>
          </div>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/20 transition-all duration-500 group-hover:rotate-45 group-hover:border-white group-hover:bg-white group-hover:text-black md:h-20 md:w-20">
            <ArrowUpRight size={26} />
          </span>
        </div>
      </Link>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export const ServiceDetailView = ({
  service,
  index,
  total,
  next,
}: {
  service: ServiceDetailData;
  index: number;
  total: number;
  next: { slug: string; data: ServiceDetailData };
}) => (
  <>
    <Hero service={service} index={index} total={total} />
    <Overview service={service} />
    <Deliver service={service} />
    <Gallery service={service} />
    <Process service={service} />
    <NextService next={next} />
  </>
);

export default ServiceDetailView;
