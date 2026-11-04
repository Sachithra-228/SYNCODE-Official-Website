import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, Code2, Lightbulb, Rocket } from "lucide-react";
import StudioClock from "@/components/home/StudioClock";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import sachithraAvatar from "@/assets/team/Sachithra.webp";
import praveenAvatar from "@/assets/team/Praveen.webp";
import pasanAvatar from "@/assets/team/Pasan.webp";
import vishwaAvatar from "@/assets/team/Vishwa.webp";
import kumodhAvatar from "@/assets/team/Kumodh.webp";
import anukAvatar from "@/assets/team/Anuk.webp";
import { Crosshairs } from "@/components/ui/crosshairs";

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------
const statement =
  "SYNCODE is a software engineering studio in Sri Lanka. We design and build websites, apps, and platforms that real businesses run on, with clean code, clear communication, and care for every detail.";

// Words drawn brighter in the statement
const highlight = new Set(["websites,", "apps,", "platforms", "real", "businesses"]);

// Team members with photos. Keep TEAM_SIZE in step with the About page.
const TEAM_SIZE = 10;
const team = [
  { name: "Sachithra", role: "Founder & Engineering Lead", avatar: sachithraAvatar },
  { name: "Praveen", role: "Data Analyst / AI Engineer", avatar: praveenAvatar },
  { name: "Pasan", role: "Data Engineer / Data Analyst", avatar: pasanAvatar },
  { name: "Vishwa", role: "Business Systems Analyst", avatar: vishwaAvatar },
  { name: "Kumodh", role: "Systems Support Engineer", avatar: kumodhAvatar },
  { name: "Anuk", role: "Team Support Member", avatar: anukAvatar },
];

const principles = [
  {
    icon: Code2,
    title: "Engineering Mindset",
    description:
      "We approach every project with precision, building robust architectures that stand the test of scale.",
  },
  {
    icon: Lightbulb,
    title: "Problem Solvers",
    description:
      "Complex challenges fuel our creativity. We turn intricate requirements into simple, elegant solutions.",
  },
  {
    icon: Rocket,
    title: "Quality Driven",
    description:
      "Excellence isn't optional. We craft software that performs reliably and keeps improving after launch.",
  },
];

// ---------------------------------------------------------------------------
// Scroll-lit statement: each word brightens as the section scrolls into view
// ---------------------------------------------------------------------------
const Word = ({
  children,
  progress,
  range,
  bright,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  bright: boolean;
}) => {
  const opacity = useTransform(progress, range, [0.12, 1]);
  // A real space follows each word so the text reads correctly for search engines
  // and screen readers.
  return (
    <>
      <motion.span style={{ opacity }} className={bright ? "text-foreground" : "text-foreground/75"}>
        {children}
      </motion.span>{" "}
    </>
  );
};

const ScrollLitStatement = () => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = statement.split(" ");

  // Only opacity changes (no movement), so this runs for reduced-motion visitors too.
  return (
    <p
      ref={ref}
      className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-semibold leading-[1.15] tracking-tight"
    >
      {words.map((word, i) => (
        <Word
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          bright={highlight.has(word)}
        >
          {word}
        </Word>
      ))}
    </p>
  );
};

// ---------------------------------------------------------------------------
// Interactive card: a soft light follows the pointer, and the card tilts in 3D
// ---------------------------------------------------------------------------
const InteractiveCard = ({
  children,
  className,
  tilt = true,
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
}) => {
  const reducedMotion = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 150, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 150, damping: 18 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--spot-x", `${x}px`);
    el.style.setProperty("--spot-y", `${y}px`);
    if (tilt && !reducedMotion) {
      ry.set(((x / r.width) - 0.5) * 8);
      rx.set(-((y / r.height) - 0.5) * 8);
    }
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] transition-colors duration-500 hover:border-white/25",
        className
      )}
    >
      {/* Pointer light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 50%), hsl(var(--foreground) / 0.09), transparent 60%)",
        }}
      />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Team card: hover or tap a face to see who it is
// ---------------------------------------------------------------------------
const TeamCard = () => {
  const [active, setActive] = useState(0);
  const member = team[active];

  return (
    <InteractiveCard tilt={false} className="h-full p-7 md:p-10">
      <div className="flex h-full flex-col justify-between gap-10">
        <div>
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            The Team
          </span>
          <h3 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.05] tracking-tight">
            {TEAM_SIZE} people.
            <br />
            <span className="gradient-text">One studio.</span>
          </h3>
          <p className="mt-4 max-w-md text-muted-foreground">
            Engineers, analysts, and designers working together on every project, from the first
            sketch to launch day and beyond.
          </p>
        </div>

        <div>
          <ul className="flex items-end" aria-label="Team members">
            {team.map((m, i) => (
              <li key={m.name} className={cn("relative", i > 0 && "-ml-3 md:-ml-4")}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-label={`${m.name}, ${m.role}`}
                  aria-pressed={i === active}
                  className={cn(
                    "relative block h-14 w-14 overflow-hidden rounded-full border-2 bg-card transition-all duration-300 ease-out md:h-16 md:w-16",
                    i === active
                      ? "z-10 -translate-y-3 scale-110 border-foreground"
                      : "border-background grayscale hover:grayscale-0"
                  )}
                >
                  <img
                    src={m.avatar}
                    alt=""
                    width={64}
                    height={64}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              </li>
            ))}
            <li className="-ml-3 md:-ml-4">
              <Link
                to="/about"
                aria-label={`Meet all ${TEAM_SIZE} team members`}
                className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-background bg-foreground text-sm font-bold text-background transition-transform duration-300 hover:scale-110 md:h-16 md:w-16"
              >
                +{TEAM_SIZE - team.length}
              </Link>
            </li>
          </ul>

          <div className="mt-5 flex min-h-[3.25rem] items-center justify-between gap-4" aria-live="polite">
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </motion.div>
            <Link
              to="/about"
              className="group/link inline-flex shrink-0 items-center gap-2 text-sm font-semibold"
            >
              Meet the team
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </InteractiveCard>
  );
};

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------
const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

// The three principle cards rise from below, one after another
const rise = {
  hidden: { opacity: 0, y: 160, rotateX: -22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring" as const, stiffness: 70, damping: 16, delay: i * 0.18 },
  }),
};

export const CompanyOverview = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Curtain reveal: the panel opens from a rounded inset to full width as it scrolls in
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "start 0.15"] });
  const insetX = useTransform(scrollYProgress, [0, 1], [6, 0]);
  const insetTop = useTransform(scrollYProgress, [0, 1], [10, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], [56, 0]);
  const clipPath = useMotionTemplate`inset(${insetTop}% ${insetX}% 0% ${insetX}% round ${radius}px)`;

  return (
    <section ref={sectionRef} className="relative bg-background">
      <motion.div
        style={{ clipPath }}
        className="section-padding relative overflow-hidden bg-[hsl(0_0%_6%)]"
      >
      {/* Ambient light and grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-radial from-foreground/[0.06] to-transparent blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--foreground) / 0.04) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground) / 0.04) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
        }}
      />

      <Crosshairs className="top-10 md:top-14" />

      <div className="container-wide relative z-10">
        {/* Statement */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <motion.div {...reveal} transition={{ duration: 0.6 }} className="lg:col-span-3">
            <span className="flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              <span className="h-px w-8 bg-foreground/40" />
              Who We Are
            </span>
          </motion.div>
          <div className="lg:col-span-9">
            <h2 className="sr-only">Who We Are</h2>
            <ScrollLitStatement />
          </div>
        </div>

        {/* Bento grid */}
        <div className="mt-16 grid gap-4 md:mt-24 md:gap-5 lg:grid-cols-12" style={{ perspective: 1400 }}>
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <TeamCard />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <InteractiveCard className="h-full p-7 md:p-10">
              <StudioClock />
            </InteractiveCard>
          </motion.div>

          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              custom={i}
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              style={{ transformOrigin: "50% 100%" }}
              className="md:col-span-1 lg:col-span-4"
            >
              <InteractiveCard className="h-full p-7 md:p-8">
                <div className="flex h-full flex-col gap-10">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] transition-all duration-500 group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:bg-foreground group-hover:text-background">
                      <p.icon size={22} />
                    </div>
                    <span
                      aria-hidden="true"
                      className="font-mono text-5xl font-bold leading-none text-transparent transition-all duration-500 group-hover:-translate-y-1"
                      style={{ WebkitTextStroke: "1px hsl(var(--foreground) / 0.25)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-xl font-semibold">{p.title}</h3>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{p.description}</p>
                  </div>
                </div>
              </InteractiveCard>
            </motion.div>
          ))}
        </div>

        <motion.div {...reveal} transition={{ duration: 0.6 }} className="mt-12 flex justify-center">
          <Link
            to="/about"
            className="group inline-flex items-center gap-2 font-semibold text-foreground link-underline"
          >
            Learn More About Us
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
      </motion.div>
    </section>
  );
};

export default CompanyOverview;
