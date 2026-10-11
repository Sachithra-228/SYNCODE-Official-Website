import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "China Lanka Motors",
    category: "Automotive Website",
    description: "Conversion-focused automotive platform with clear inventory and lead capture.",
    image: "/screens/chinalankamotors.webp",
    url: "https://www.chinalankamotors.com/",
    domain: "chinalankamotors.com",
  },
  {
    title: "Jayas Victory Travels",
    category: "Travel Platform",
    description: "Travel-focused web experience that highlights tours and simplifies enquiries.",
    image: "/screens/jayasvictorytravel.webp",
    url: "https://www.jayasvictorytravels.com/",
    domain: "jayasvictorytravels.com",
  },
  {
    title: "Valor Clothing",
    category: "Fashion E-Commerce",
    description: "Premium fashion storefront for luxury clothing essentials and limited capsules.",
    image: "/screens/valorclothing.webp",
    url: "https://www.valorclothing.lk/",
    domain: "valorclothing.lk",
  },
  {
    title: "Unicare Connect",
    category: "Student Support Platform",
    description: "Financial aid, career growth, wellness services, and mentorship for university students in one platform.",
    image: "/screens/unicareconnect.webp",
    url: "https://www.unicareconnect.com/",
    domain: "unicareconnect.com",
  },
  {
    title: "Hotel Seven Way",
    category: "Hospitality Website",
    description: "Modern hotel website focused on visual storytelling and room discovery.",
    image: "/screens/hotelsevenway.webp",
    url: "https://hotel-seven-way.vercel.app/",
    domain: "hotel-seven-way.vercel.app",
  },
  {
    title: "Maison Ashri",
    category: "Lifestyle Brand Site",
    description: "Refined, brand-forward web experience with minimal design and smooth storytelling.",
    image: "/screens/maisonashri.webp",
    url: "https://maisonashri.vercel.app/",
    domain: "maisonashri.vercel.app",
  },
];

const ROTATE_MS = 5000;
const pad = (n: number) => String(n).padStart(2, "0");

export const ProjectsPreview = () => {
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState([0]);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  // Auto-rotation stops for good once a visitor picks a client by tapping
  const [auto, setAuto] = useState(true);
  // True while a press started on an inactive row, so a tap selects it instead of opening the site
  const pressedInactive = useRef(false);

  const showcaseRef = useRef<HTMLDivElement>(null);
  const inView = useInView(showcaseRef, { amount: 0.3 });
  const reducedMotion = useReducedMotion();
  const playing = auto && inView && !hovered && !focused && !reducedMotion;

  useEffect(() => {
    setSeen((prev) => (prev.includes(active) ? prev : [...prev, active]));
  }, [active]);

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => setActive((i) => (i + 1) % projects.length), ROTATE_MS);
    return () => clearTimeout(timer);
  }, [active, playing]);

  const current = projects[active];
  const next = (active + 1) % projects.length;

  return (
    <section className="section-padding relative overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px]
                      bg-gradient-radial from-foreground/3 to-transparent rounded-full blur-3xl" />

      <div className="container-wide relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16"
        >
          <div>
            <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-4 block">
              Client Trust
            </span>
            <h2 className="text-display-lg">
              Brands That
              <br />
              <span className="gradient-text">Trust Us</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Real businesses running on websites we designed and built. Every one of them is
              live, so you can visit it yourself.
            </p>
          </div>
          <Link
            to="/projects"
            className="btn-secondary self-start md:self-auto"
          >
            View All Projects
            <ArrowUpRight size={18} className="ml-2" />
          </Link>
        </motion.div>

        <motion.div
          ref={showcaseRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="grid gap-10 lg:grid-cols-12 lg:gap-14 lg:items-center"
        >
          {/* Client list: hover, focus or tap a name to preview it */}
          <ul className="order-2 lg:order-1 lg:col-span-5 border-t border-border">
            {projects.map((project, index) => {
              const isActive = index === active;
              return (
                <li key={project.title}>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(index)}
                    onPointerDown={() => { pressedInactive.current = !isActive; }}
                    onFocus={() => setActive(index)}
                    onClick={(e) => {
                      if (pressedInactive.current) {
                        e.preventDefault();
                        setActive(index);
                        setAuto(false);
                      }
                      pressedInactive.current = false;
                    }}
                    className="group relative flex items-center gap-5 py-5 border-b border-border
                               focus:outline-none focus-visible:bg-foreground/5"
                  >
                    <span
                      className={`font-mono text-sm transition-colors duration-300
                                  ${isActive ? "text-foreground" : "text-foreground/30"}`}
                    >
                      {pad(index + 1)}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span
                        className={`block truncate text-2xl md:text-3xl font-semibold tracking-tight
                                    transition-all duration-300
                                    ${isActive ? "text-foreground translate-x-2" : "text-foreground/35"}`}
                      >
                        {project.title}
                      </span>
                      <span
                        className={`block text-sm transition-all duration-300
                                    ${isActive ? "text-muted-foreground translate-x-2" : "text-foreground/25"}`}
                      >
                        {project.category}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={22}
                      className={`flex-shrink-0 transition-all duration-300
                                  ${isActive ? "opacity-100 text-foreground" : "opacity-0 -translate-x-2"}`}
                    />

                    {/* Progress line: fills while this client is on show */}
                    {isActive && (
                      playing ? (
                        <motion.span
                          key={`run-${index}`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
                          className="absolute -bottom-px left-0 h-px w-full origin-left bg-foreground"
                        />
                      ) : (
                        <span className="absolute -bottom-px left-0 h-px w-full bg-foreground" />
                      )
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Showcase */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <a
              href={current.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${current.title} (${current.domain})`}
              className="group relative block aspect-[16/9] overflow-hidden rounded-3xl bg-card
                         border border-border/50 shadow-card"
            >
              {projects.map((project, index) => {
                const isActive = index === active;
                // Only load the images that have been shown, plus the one coming up next
                if (!isActive && !seen.includes(index) && !(inView && index === next)) return null;
                return (
                  <img
                    key={project.title}
                    src={project.image}
                    alt={isActive ? `Screenshot of the ${project.title} website` : ""}
                    loading="lazy"
                    className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-700
                                group-hover:scale-105
                                ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
                  />
                );
              })}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

              {/* Live domain */}
              <div className="absolute top-4 left-4 flex items-center gap-2.5 px-4 py-2 glass rounded-full
                              text-xs font-medium text-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                {current.domain}
              </div>

              <span className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full
                               bg-foreground text-background transition-transform duration-300
                               group-hover:rotate-45">
                <ArrowUpRight size={20} />
              </span>

              <span className="absolute bottom-4 right-5 font-mono text-sm text-white/80">
                {`${pad(active + 1)} / ${pad(projects.length)}`}
              </span>
            </a>

            {/* Caption */}
            <div className="mt-6 min-h-[5.5rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3 className="text-xl font-semibold mb-2">{current.title}</h3>
                  <p className="text-muted-foreground max-w-xl">{current.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsPreview;
