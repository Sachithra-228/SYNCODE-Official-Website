import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Footer from "@/components/layout/Footer";
import { RollText } from "@/components/ui/roll-text";
import { Crosshairs } from "@/components/ui/crosshairs";
import WorkWindow from "@/components/projects/WorkWindow";
import ToolPlayground from "@/components/projects/ToolPlayground";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Project = {
  title: string;
  category: string;
  description: string;
  image: string;
  url: string;
  domain: string;
  tags: string[];
};

const projects: Project[] = [
  {
    title: "China Lanka Motors",
    category: "Automotive Website",
    description:
      "A conversion-focused automotive platform built for trust, inventory clarity, and smooth lead capture across desktop and mobile.",
    image: "/screens/chinalankamotors.webp",
    url: "https://www.chinalankamotors.com/",
    domain: "chinalankamotors.com",
    tags: ["Web Design", "Lead Generation", "Performance"],
  },
  {
    title: "Jayas Victory Travels",
    category: "Travel Platform",
    description:
      "A travel web experience designed to highlight tours, simplify enquiries, and increase booking intent with a clear user journey.",
    image: "/screens/jayasvictorytravel.webp",
    url: "https://www.jayasvictorytravels.com/",
    domain: "jayasvictorytravels.com",
    tags: ["Travel UX", "Responsive UI", "Brand Website"],
  },
  {
    title: "Valor Clothing",
    category: "Fashion E-Commerce",
    description:
      "A premium fashion shopping experience for luxury clothing essentials, limited capsules, and editorial collections.",
    image: "/screens/valorclothing.webp",
    url: "https://www.valorclothing.lk/",
    domain: "valorclothing.lk",
    tags: ["E-Commerce", "Fashion", "Brand Experience"],
  },
  {
    title: "Unicare Connect",
    category: "Student Support Platform",
    description:
      "Financial aid, career growth, wellness services, and mentorship for university students, brought together in one platform.",
    image: "/screens/unicareconnect.webp",
    url: "https://www.unicareconnect.com/",
    domain: "unicareconnect.com",
    tags: ["Platform", "Accessibility", "Product Design"],
  },
  {
    title: "Hotel Seven Way",
    category: "Hospitality Website",
    description:
      "A modern hotel website focused on visual storytelling, room discovery, and conversion-ready booking flows.",
    image: "/screens/hotelsevenway.webp",
    url: "https://hotel-seven-way.vercel.app/",
    domain: "hotel-seven-way.vercel.app",
    tags: ["Hospitality", "UI/UX", "Conversion"],
  },
  {
    title: "Maison Ashri",
    category: "Lifestyle Brand Site",
    description:
      "A refined, brand-forward web experience balancing minimal design, visual hierarchy, and smooth storytelling.",
    image: "/screens/maisonashri.webp",
    url: "https://maisonashri.vercel.app/",
    domain: "maisonashri.vercel.app",
    tags: ["Branding", "Visual Design", "Front-End"],
  },
];


// The pinned horizontal gallery runs on wide screens. Phones, tablets and the
// pre-rendered HTML get a vertical stack. The sideways movement follows the visitor's
// own scrolling; with reduced motion on, the extra parallax and reveal effects are skipped.
const HORIZONTAL_QUERY = "(min-width: 1024px)";

const useHorizontal = () => {
  const [horizontal, setHorizontal] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(HORIZONTAL_QUERY);
    const update = () => setHorizontal(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return horizontal;
};

const BrowserFrame = ({
  project,
  active = true,
  className,
}: {
  project: Project;
  active?: boolean;
  className?: string;
}) => (
  <div
    className={cn(
      "overflow-hidden rounded-2xl border border-white/10 bg-card shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]",
      className
    )}
  >
    <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="flex gap-1.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
      </div>
      <div className="mx-auto max-w-[60%] truncate rounded-full bg-white/[0.06] px-4 py-1 text-center font-mono text-[11px] text-white/50">
        {project.domain}
      </div>
      <span className="w-[42px]" aria-hidden="true" />
    </div>
    <div className="relative aspect-video overflow-hidden">
      <img
        data-parallax
        src={project.image}
        alt={`${project.title} website`}
        width={1600}
        height={900}
        loading="lazy"
        className={cn(
          "absolute inset-0 h-full w-[116%] max-w-none object-cover object-top transition-[filter] duration-700",
          !active && "grayscale group-hover:grayscale-0"
        )}
        style={{ left: "-8%" }}
      />
    </div>
  </div>
);

const VisitButton = ({ project }: { project: Project }) => (
  <a
    href={project.url}
    target="_blank"
    rel="noopener noreferrer"
    className="roll-host group/btn inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform duration-300 hover:scale-105"
  >
    <RollText>Visit live site</RollText>
    <ArrowUpRight
      size={16}
      className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
    />
    <span className="sr-only">: {project.title} (opens in a new tab)</span>
  </a>
);

const Tags = ({ tags }: { tags: string[] }) => (
  <ul className="flex flex-wrap gap-2">
    {tags.map((tag) => (
      <li
        key={tag}
        className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground"
      >
        {tag}
      </li>
    ))}
  </ul>
);

/** First letters of the first two words, e.g. "China Lanka Motors" -> "CL". */
const initials = (title: string) =>
  title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const OutlineMark = ({ text, className }: { text: string; className?: string }) => (
  <span
    aria-hidden="true"
    className={cn(
      "pointer-events-none select-none font-black leading-none tracking-tighter text-transparent",
      className
    )}
    style={{ WebkitTextStroke: "1px hsl(var(--foreground) / 0.12)" }}
  >
    {text}
  </span>
);

// ---------------------------------------------------------------------------
// Horizontal pinned gallery (desktop)
// ---------------------------------------------------------------------------
const HorizontalGallery = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth;
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");

      // Runs on every frame of the (smoothed) slide, so the counter matches what is on screen.
      const syncIndicator = (progress: number) => {
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${progress})`;
        }
        // The project whose panel centre is closest to the screen centre
        const centre = window.innerWidth / 2;
        let closest = 0;
        let best = Infinity;
        panels.forEach((panel, i) => {
          const r = panel.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - centre);
          if (d < best) {
            best = d;
            closest = i;
          }
        });
        setActive(closest);
      };

      const slide = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        onUpdate() {
          syncIndicator(this.progress());
        },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) return;

      panels.forEach((panel) => {
        const img = panel.querySelector("[data-parallax]");
        const content = panel.querySelectorAll("[data-reveal]");
        const number = panel.querySelector("[data-number]");

        if (img) {
          gsap.fromTo(
            img,
            { xPercent: 6 },
            {
              xPercent: -6,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: slide,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        }

        if (number) {
          gsap.fromTo(
            number,
            { xPercent: 30 },
            {
              xPercent: -30,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: slide,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        }

        if (content.length) {
          gsap.fromTo(
            content,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              ease: "power2.out",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: slide,
                start: "left 75%",
                end: "left 30%",
                scrub: true,
              },
            }
          );
        }
      });
    }, section);

    // Triggers further down the page (the footer) were created first; re-sort so
    // they account for the space this pinned section adds.
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return (
    // GSAP wraps the pinned section in a spacer element. This wrapper keeps that
    // spacer out of React's way, so the page can update or unmount safely.
    <div>
      <section ref={sectionRef} aria-label="Projects" className="relative h-screen overflow-hidden">
      <div ref={trackRef} className="flex h-full w-max items-center will-change-transform">
        {/* Intro panel */}
        <div className="flex h-full w-[42vw] shrink-0 flex-col justify-center pl-[6vw] pr-[4vw]">
          <p className="mb-6 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Selected projects
          </p>
          <p className="text-display-md text-foreground/80">
            Scroll to travel through the work. Every site here is live, so you can visit it.
          </p>
          <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/15">
              <ArrowRight size={18} className="animate-pulse" />
            </span>
            Keep scrolling
          </div>
        </div>

        {projects.map((project, i) => (
          <article
            key={project.title}
            data-panel
            className="group relative flex h-full w-[86vw] max-w-[1400px] shrink-0 items-center px-[3vw]"
          >
            <div data-number className="absolute -top-[2vh] right-[2vw]">
              <OutlineMark text={initials(project.title)} className="text-[24vw]" />
            </div>
            <div className="relative z-10 grid w-full grid-cols-12 items-center gap-10 pt-16">
              <div className="col-span-4 flex flex-col gap-6">
                <div data-reveal className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                  <span className="h-px w-10 bg-white/20" />
                  <span className="uppercase tracking-widest">{project.category}</span>
                </div>
                <h2 data-reveal className="text-[clamp(2.25rem,3.6vw,3.75rem)] font-bold leading-[1.02] tracking-tight">
                  {project.title}
                </h2>
                <p data-reveal className="max-w-md text-base leading-relaxed text-muted-foreground xl:text-lg">
                  {project.description}
                </p>
                <div data-reveal>
                  <Tags tags={project.tags} />
                </div>
                <div data-reveal>
                  <VisitButton project={project} />
                </div>
              </div>
              <div className="col-span-8">
                <BrowserFrame project={project} active={i === active} />
              </div>
            </div>
          </article>
        ))}

        {/* Outro panel */}
        <div className="flex h-full w-[60vw] shrink-0 flex-col items-start justify-center px-[6vw]">
          <p className="mb-6 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            What&apos;s next
          </p>
          <h2 className="text-display-lg">
            Your project
            <br />
            <span className="gradient-text">could be next.</span>
          </h2>
          <Link to="/contact" className="btn-primary mt-10">
            <RollText>Start Your Project</RollText>
            <ArrowUpRight size={18} className="ml-2" />
          </Link>
        </div>
      </div>

      {/* Progress */}
      <div className="pointer-events-none absolute bottom-8 left-[6vw] right-[6vw] flex items-center gap-6">
        <div className="h-px flex-1 bg-white/10">
          <div ref={progressRef} className="h-px origin-left scale-x-0 bg-foreground" />
        </div>
        <span className="w-48 truncate text-right text-xs uppercase tracking-widest text-muted-foreground">
          {projects[active].title}
        </span>
      </div>
      </section>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Vertical stack (mobile, tablet, reduced motion)
// ---------------------------------------------------------------------------
const StackedGallery = () => (
  <section aria-label="Projects" className="container-wide space-y-24 pb-24 md:space-y-32">
    {projects.map((project, i) => (
      <motion.article
        key={project.title}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="group relative"
      >
        <OutlineMark text={initials(project.title)} className="absolute -top-14 right-0 text-[30vw] md:-top-20 md:text-[20vw]" />
        <div className="relative z-10">
          <BrowserFrame project={project} />
          <div className="mt-8 flex flex-col gap-5">
            <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
              <span className="h-px w-10 bg-white/20" />
              <span className="uppercase tracking-widest">{project.category}</span>
            </div>
            <h2 className="text-display-md">{project.title}</h2>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {project.description}
            </p>
            <Tags tags={project.tags} />
            <div>
              <VisitButton project={project} />
            </div>
          </div>
        </div>
      </motion.article>
    ))}

    <div className="border-t border-border pt-20 text-center">
      <h2 className="text-display-md">
        Your project <span className="gradient-text">could be next.</span>
      </h2>
      <Link to="/contact" className="btn-primary mt-8">
        <RollText>Start Your Project</RollText>
        <ArrowUpRight size={18} className="ml-2" />
      </Link>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const Projects = () => {
  const horizontal = useHorizontal();

  return (
    <div className="min-h-screen bg-background">
      <main className="relative bg-background">
        <section className="relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-44">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-radial from-foreground/5 to-transparent blur-3xl"
          />
          <Crosshairs className="bottom-6" />
          <div className="container-wide relative">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 block text-sm font-medium uppercase tracking-widest text-muted-foreground"
            >
              Our Work
            </motion.span>

            <h1 className="text-[clamp(3.5rem,13vw,12rem)] font-black leading-[0.85] tracking-tighter">
              {["Selected", "Work"].map((word, i) => (
                <span key={word} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className={cn("block", i === 1 && "gradient-text")}
                    initial={{ y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {word}
                  </motion.span>
                  {/* Space for search engines and screen readers; the words sit on separate lines */}
                  {i === 0 && <span className="sr-only"> </span>}
                </span>
              ))}
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-12 flex flex-col gap-10 border-t border-border pt-8 md:flex-row md:items-end md:justify-between"
            >
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Websites, platforms, and online stores we designed and built for real businesses in
                automotive, travel, fashion, education, hospitality, and lifestyle.
              </p>
              <a
                href="#project-showcase"
                className="group flex shrink-0 items-center gap-4 text-xs uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Scroll to explore
                <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/15 transition-colors group-hover:border-white/40">
                  <motion.span
                    animate={{ y: ["-150%", "150%"] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowDown size={16} />
                  </motion.span>
                </span>
              </a>
            </motion.div>
          </div>
        </section>

        <WorkWindow />

        {horizontal ? <HorizontalGallery /> : <StackedGallery />}

        <ToolPlayground />
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
