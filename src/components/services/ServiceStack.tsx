import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { scrollToY } from "@/lib/smooth-scroll";
import { RollText } from "@/components/ui/roll-text";

export type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  features: string[];
  image: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

// ---------------------------------------------------------------------------
// One card in the stack. It pins near the top of the screen; as later cards
// slide over it, it shrinks a little and dims, so the stack reads as a deck.
// ---------------------------------------------------------------------------
const StackCard = ({
  service,
  index,
  total,
  progress,
}: {
  service: Service;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const light = index % 2 === 1;
  const last = index === total - 1;

  // Shrink and dim once the following cards start to cover this one
  const start = index / total;
  const targetScale = 1 - (total - index) * 0.04;
  const scale = useTransform(progress, [start, 1], [1, last ? 1 : targetScale]);
  const dim = useTransform(progress, [start, Math.min(1, start + 1 / total)], [0, last ? 0 : 0.55]);

  // Image parallax while the card itself scrolls into place
  const { scrollYProgress: enter } = useScroll({ target: wrapRef, offset: ["start end", "start start"] });
  const imageScale = useTransform(enter, [0, 1], [1.35, 1]);
  const imageY = useTransform(enter, [0, 1], ["-12%", "0%"]);
  const numberX = useTransform(enter, [0, 1], ["30%", "0%"]);

  const Icon = service.icon;

  return (
    <div
      ref={wrapRef}
      id={`service-${index}`}
      className="sticky top-0 flex h-[100svh] items-start justify-center px-4 md:px-8"
      style={{ paddingTop: `calc(5.5rem + ${index * 14}px)` }}
    >
      <motion.article
        style={{ scale }}
        className={cn(
          "group relative w-full max-w-6xl origin-top overflow-hidden rounded-[2rem] border shadow-[0_-30px_80px_-30px_rgba(0,0,0,0.8)]",
          light
            ? "light-section border-black/10 bg-[hsl(0_0%_97%)] text-foreground"
            : "border-white/10 bg-[hsl(0_0%_7%)] text-foreground"
        )}
      >
        {/* Same height for every card, short enough that the lowest one in the stack still fits */}
        <div
          className="grid md:grid-cols-12"
          style={{ height: `min(620px, calc(100svh - 7rem - ${(total - 1) * 14}px))` }}
        >
          {/* Phones: the image becomes a faded banner behind the top of the card */}
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[45%] overflow-hidden md:hidden">
            <img src={service.image} alt="" loading="lazy" className="h-full w-full object-cover grayscale" />
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-b",
                light
                  ? "from-[hsl(0_0%_97%/0.35)] to-[hsl(0_0%_97%)]"
                  : "from-[hsl(0_0%_7%/0.35)] to-[hsl(0_0%_7%)]"
              )}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between gap-6 p-6 md:col-span-6 md:p-10 lg:p-12">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-widest text-muted-foreground">
                <span className="text-foreground">{pad(index + 1)}</span> / {pad(total)}
              </span>
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-2xl border transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110",
                  light ? "border-black/10 bg-black text-white" : "border-white/10 bg-white text-black"
                )}
              >
                <Icon size={20} />
              </span>
            </div>

            <div>
              <h3 className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-bold leading-[1.05] tracking-tight">
                {service.title}
              </h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                {service.description}
              </p>
              <ul className="mt-6 space-y-2.5">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm md:text-base">
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                        light ? "bg-black text-white" : "bg-white text-black"
                      )}
                    >
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to={service.path}
              className={cn(
                "roll-host inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform duration-300 hover:scale-105",
                light ? "bg-black text-white" : "bg-white text-black"
              )}
            >
              <RollText>Explore service</RollText>
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* Image */}
          <div className="relative hidden overflow-hidden md:col-span-6 md:block">
            <motion.img
              src={service.image}
              alt=""
              loading="lazy"
              style={{ scale: imageScale, y: imageY }}
              className="absolute inset-0 h-full w-full object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
            />
            <div
              className={cn(
                "absolute inset-0",
                light
                  ? "bg-gradient-to-r from-[hsl(0_0%_97%)] via-[hsl(0_0%_97%/0.2)] to-transparent"
                  : "bg-gradient-to-r from-[hsl(0_0%_7%)] via-[hsl(0_0%_7%/0.2)] to-transparent"
              )}
            />
            <motion.span
              aria-hidden="true"
              style={{ x: numberX, WebkitTextStroke: "1.5px rgba(255,255,255,0.7)" }}
              className="absolute -bottom-6 right-4 select-none font-mono text-[11rem] font-bold leading-none text-transparent"
            >
              {pad(index + 1)}
            </motion.span>
          </div>
        </div>

        {/* Dims the card as the next one covers it */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: dim }}
          className="pointer-events-none absolute inset-0 bg-black"
        />
      </motion.article>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Heading with word-by-word reveal and quick-jump chips for each service
// ---------------------------------------------------------------------------
const StackHeading = ({ services, onJump }: { services: Service[]; onJump: (i: number) => void }) => (
  <div className="container-wide pb-6 pt-8 md:pt-12">
    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <div>
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-muted-foreground"
        >
          <span className="h-px w-8 bg-foreground/40" />
          What we do
        </motion.span>
        <h2 className="text-[clamp(2.5rem,7vw,6rem)] font-black leading-[0.95] tracking-tighter">
          {["Explore", "Our", "Services"].map((word, i) => (
            <span key={word}>
              <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className={cn("inline-block", i === 2 && "gradient-text")}
                  initial={{ y: "110%", rotate: 4 }}
                  whileInView={{ y: "0%", rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              </span>{" "}
            </span>
          ))}
        </h2>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-sm text-muted-foreground"
      >
        Six ways we help businesses grow, from the first idea to long-term support. Scroll through
        each one, or jump straight to what you need.
      </motion.p>
    </div>

    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.35 } } }}
      className="mt-10 flex flex-wrap gap-2"
    >
      {services.map((s, i) => (
        <motion.li
          key={s.title}
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
        >
          <button
            type="button"
            onClick={() => onJump(i)}
            className="roll-host group inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-white/40 hover:bg-white hover:text-black"
          >
            <span className="font-mono text-[10px] opacity-60">{pad(i + 1)}</span>
            <RollText>{s.title}</RollText>
          </button>
        </motion.li>
      ))}
    </motion.ul>
  </div>
);

export const ServiceStack = ({ services }: { services: Service[] }) => {
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });

  // Each card takes one screen of scrolling, so card i sits at stackTop + i * screen height
  const jumpTo = (i: number) => {
    const el = stackRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    scrollToY(top + i * window.innerHeight);
  };

  return (
    <section id="services-grid" aria-label="Our services">
      <StackHeading services={services} onJump={jumpTo} />
      <div ref={stackRef} className="relative">
        {services.map((service, i) => (
          <StackCard
            key={service.title}
            service={service}
            index={i}
            total={services.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
};

export default ServiceStack;
