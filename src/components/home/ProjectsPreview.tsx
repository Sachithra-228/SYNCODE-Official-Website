import { type MouseEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { RollText } from "@/components/ui/roll-text";
import { cn } from "@/lib/utils";

type Client = {
  name: string;
  industry: string;
  /** Logo file in /public/logos */
  logo: string;
  /** The logo image's own background colour, so the tile blends with it */
  bg: string;
  /** Square logos with lots of empty space around them are drawn larger */
  large?: boolean;
};

// Ordered so light and dark tiles alternate across the grid
const clients: Client[] = [
  { name: "China Lanka Motors", industry: "Automotive", logo: "/logos/china-lanka-motors.png", bg: "#ffffff", large: true },
  { name: "Valor", industry: "Fashion E-Commerce", logo: "/logos/valor.png", bg: "#040404" },
  { name: "Jayas Victory Travels", industry: "Travel & Tourism", logo: "/logos/jayas-victory-travels.png", bg: "#fdfdfd", large: true },
  { name: "REHOB", industry: "Artist Management", logo: "/logos/rehob.png", bg: "#131315" },
  { name: "Prasanna Tailors", industry: "Tailoring", logo: "/logos/prasanna-tailors.png", bg: "#100f0c" },
  { name: "Voigue", industry: "Corporate & Careers", logo: "/logos/voigue.png", bg: "#ffffff" },
  { name: "Amara", industry: "Construction", logo: "/logos/amara.png", bg: "#1e1e1e" },
  { name: "Bloom Coffee Shop", industry: "Café", logo: "/logos/bloom.png", bg: "#000000" },
];

const pad = (n: number) => String(n).padStart(2, "0");

// ---------------------------------------------------------------------------
// Logo tile: tilts toward the pointer, the logo lifts, and a light sweeps across
// ---------------------------------------------------------------------------
const LogoTile = ({ client }: { client: Client }) => {
  const reducedMotion = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 160, damping: 16 });
  const rotateY = useSpring(ry, { stiffness: 160, damping: 16 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 14);
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
        className="group w-[220px] shrink-0 md:w-[280px]"
      >
        {/* Logo panel */}
        <div
          className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl ring-1 ring-white/10 transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] group-hover:ring-white/30"
          style={{ backgroundColor: client.bg }}
        >
          <img
            src={client.logo}
            alt={`${client.name} logo`}
            loading="lazy"
            className={client.large ? "h-[96%] w-auto object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" : "max-h-[68%] max-w-[72%] object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"}
          />
          {/* Light sweep on hover */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-1000 ease-out group-hover:left-[120%] group-hover:opacity-100"
          />
        </div>

        {/* Name */}
        <div className="mt-4 px-1">
          <h3 className="truncate text-base font-semibold transition-transform duration-500 group-hover:translate-x-1 md:text-lg">
            {client.name}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{client.industry}</p>
        </div>
      </motion.div>
  );
};

// ---------------------------------------------------------------------------
// A row of logo cards that never stops moving. The cards are repeated so the
// loop is seamless; hovering the row pauses it.
// ---------------------------------------------------------------------------
const LogoRow = ({ items, direction }: { items: Client[]; direction: "left" | "right" }) => {
  // Enough copies to fill wide screens, then the whole set twice for the -50% loop
  const set = [...items, ...items, ...items];
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === "right" ? -120 : 120 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="group/row overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
    >
      <div
        className={cn(
          "flex w-max group-hover/row:[animation-play-state:paused]",
          direction === "right"
            ? "animate-[logo-row-right_50s_linear_infinite]"
            : "animate-[logo-row-left_50s_linear_infinite]"
        )}
        style={{ perspective: 1400 }}
      >
        {[0, 1].map((half) => (
          // Trailing padding equals the gap, so the -50% loop lands exactly on the next copy
          <div key={half} className="flex gap-4 pr-4 md:gap-5 md:pr-5">
            {set.map((client, i) => (
              <LogoTile key={`${half}-${i}`} client={client} />
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Slow marquee of client names under the grid
// ---------------------------------------------------------------------------
const NameMarquee = () => (
  <div
    aria-hidden="true"
    className="group relative mt-12 overflow-hidden border-y border-white/10 py-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
  >
    <div className="flex w-max animate-[client-marquee_45s_linear_infinite] group-hover:[animation-play-state:paused]">
      {[0, 1].map((copy) => (
        <div key={copy} className="flex items-center">
          {clients.map((c) => (
            <span key={c.name} className="flex items-center">
              <span
                className="whitespace-nowrap px-8 text-[clamp(2rem,5vw,4rem)] font-black uppercase tracking-tight text-transparent transition-colors duration-300 hover:text-foreground"
                style={{ WebkitTextStroke: "1px hsl(var(--foreground) / 0.35)" }}
              >
                {c.name}
              </span>
              <span className="text-xl text-foreground/30">✦</span>
            </span>
          ))}
        </div>
      ))}
    </div>
    <style>{`
      @keyframes client-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      @media (prefers-reduced-motion: reduce) {
        [class*="client-marquee"] { animation-duration: 120s !important; }
      }
    `}</style>
  </div>
);

export const ProjectsPreview = () => (
  <section className="relative overflow-hidden bg-background pb-10 pt-24 md:pb-14 md:pt-32 lg:pt-40">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-radial from-foreground/[0.04] to-transparent blur-3xl"
    />

    <div className="container-wide relative z-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <span className="mb-4 block text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Client Trust
          </span>
          <h2 className="text-display-lg">
            Brands That
            <br />
            <span className="gradient-text">Trust Us</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Businesses across Sri Lanka that run on websites and platforms we designed and built.
          </p>
        </div>
        <div className="flex flex-col items-start gap-6 md:items-end">
          <dl className="flex gap-10">
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted-foreground">Clients</dt>
              <dd className="mt-1 font-mono text-3xl font-bold">{pad(clients.length)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted-foreground">Industries</dt>
              <dd className="mt-1 font-mono text-3xl font-bold">
                {pad(new Set(clients.map((c) => c.industry)).size)}
              </dd>
            </div>
          </dl>
          <Link to="/projects" className="btn-secondary">
            <RollText>View All Projects</RollText>
            <ArrowUpRight size={18} className="ml-2" />
          </Link>
        </div>
      </motion.div>

    </div>

    {/* Logo rows: the first drifts left to right, the second right to left */}
    <ul className="sr-only" aria-label="Our clients">
      {clients.map((c) => (
        <li key={c.name}>
          {c.name}, {c.industry}
        </li>
      ))}
    </ul>
    <div aria-hidden="true" className="relative z-10 space-y-2 md:space-y-3">
      <LogoRow items={clients.slice(0, 4)} direction="right" />
      <LogoRow items={clients.slice(4)} direction="left" />
    </div>

    <NameMarquee />
  </section>
);

export default ProjectsPreview;
