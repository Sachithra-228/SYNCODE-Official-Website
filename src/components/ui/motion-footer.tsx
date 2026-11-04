import * as React from "react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp, ArrowUpRight, Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { addressLine, business } from "@/lib/site";
import { scrollToTop } from "@/lib/smooth-scroll";
import { RollText } from "@/components/ui/roll-text";

// Register only in the browser: components also render in Node during pre-rendering.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// -------------------------------------------------------------------------
// Styles. The theme tokens in index.css are HSL triplets ("0 0% 98%"),
// so colours are written as hsl(var(--token) / alpha).
// -------------------------------------------------------------------------
const STYLES = `
.cinematic-footer-wrapper {
  -webkit-font-smoothing: antialiased;
  --pill-bg-1: hsl(var(--foreground) / 0.03);
  --pill-bg-2: hsl(var(--foreground) / 0.01);
  --pill-shadow: hsl(var(--background) / 0.5);
  --pill-highlight: hsl(var(--foreground) / 0.1);
  --pill-inset-shadow: hsl(var(--background) / 0.8);
  --pill-border: hsl(var(--foreground) / 0.08);
  --pill-bg-1-hover: hsl(var(--foreground) / 0.08);
  --pill-bg-2-hover: hsl(var(--foreground) / 0.02);
  --pill-border-hover: hsl(var(--foreground) / 0.2);
  --pill-shadow-hover: hsl(var(--background) / 0.7);
  --pill-highlight-hover: hsl(var(--foreground) / 0.2);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}
@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.animate-footer-breathe { animation: footer-breathe 8s ease-in-out infinite alternate; }
.animate-footer-scroll-marquee { animation: footer-scroll-marquee 40s linear infinite; }

@media (prefers-reduced-motion: reduce) {
  .animate-footer-breathe,
  .animate-footer-scroll-marquee { animation: none; }
}

.footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, hsl(var(--foreground) / 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, hsl(var(--foreground) / 0.03) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}
.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    hsl(var(--primary) / 0.12) 0%,
    hsl(var(--secondary) / 0.15) 40%,
    transparent 70%
  );
}
.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow:
    0 10px 30px -10px var(--pill-shadow),
    inset 0 1px 1px var(--pill-highlight),
    inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow:
    0 20px 40px -10px var(--pill-shadow-hover),
    inset 0 1px 1px var(--pill-highlight-hover);
  color: hsl(var(--foreground));
}
.footer-giant-bg-text {
  font-size: 22vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px hsl(var(--foreground) / 0.05);
  background: linear-gradient(180deg, hsl(var(--foreground) / 0.1) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}
.footer-text-glow {
  background: linear-gradient(180deg, hsl(var(--foreground)) 0%, hsl(var(--foreground) / 0.4) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px hsl(var(--foreground) / 0.15));
}
`;

// -------------------------------------------------------------------------
// Magnetic button: follows the pointer slightly on hover (mouse only).
// -------------------------------------------------------------------------
export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
    to?: string;
  };

export const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
      const element = localRef.current;
      if (!element || prefersReducedMotion()) return;
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(element, {
          x: x * 0.4,
          y: y * 0.4,
          rotationX: -y * 0.15,
          rotationY: x * 0.15,
          scale: 1.05,
          ease: "power2.out",
          duration: 0.4,
        });
      };

      const handleMouseLeave = () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          ease: "elastic.out(1, 0.3)",
          duration: 1.2,
        });
      };

      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
        gsap.killTweensOf(element);
      };
    }, []);

    return (
      <Component
        ref={(node: HTMLElement | null) => {
          localRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// Content
// -------------------------------------------------------------------------
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
  </svg>
);

const marqueeWords = [
  "Custom Software",
  "Web & Mobile Apps",
  "E-Commerce",
  "AI Systems",
  "UI/UX Design",
  "Hosting & Support",
];

const pageLinks = [
  { name: "Services", path: "/services" },
  { name: "Projects", path: "/projects" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Privacy Policy", path: "/privacy-policy" },
];

const socialLinks = [
  { name: "Facebook", href: business.social.facebook, icon: Facebook },
  { name: "Instagram", href: business.social.instagram, icon: Instagram },
  { name: "LinkedIn", href: business.social.linkedin, icon: Linkedin },
  { name: "TikTok", href: business.social.tiktok, icon: TikTokIcon },
];

const HEADLINE = "Let's build together.";

const MarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6" aria-hidden="true">
    {marqueeWords.map((word, i) => (
      <React.Fragment key={word}>
        <span>{word}</span>
        <span className={i % 2 ? "text-foreground/30" : "text-foreground/60"}>✦</span>
      </React.Fragment>
    ))}
  </div>
);

// -------------------------------------------------------------------------
// Footer. It sits fixed behind the page and is revealed like a curtain as
// the last section scrolls away.
// -------------------------------------------------------------------------
export function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const backToTop = () => scrollToTop(!prefersReducedMotion());

  const year = new Date().getFullYear();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Curtain wrapper: the clip-path limits the fixed footer to this box. */}
      <div
        ref={wrapperRef}
        className="relative h-[100svh] min-h-[640px] w-full"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <footer className="cinematic-footer-wrapper fixed bottom-0 left-0 flex h-[100svh] min-h-[640px] w-full flex-col justify-between overflow-hidden bg-background text-foreground">
          {/* Ambient light and grid */}
          <div className="footer-aurora pointer-events-none absolute left-1/2 top-1/2 z-0 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px]" />
          <div className="footer-bg-grid pointer-events-none absolute inset-0 z-0" />

          {/* Giant background word */}
          <div
            ref={giantTextRef}
            aria-hidden="true"
            className="footer-giant-bg-text pointer-events-none absolute -bottom-[3vh] left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap"
          >
            SYNCODE
          </div>

          {/* Diagonal marquee */}
          <div className="absolute left-0 top-12 z-10 w-full -rotate-2 scale-110 overflow-hidden border-y border-border/50 bg-background/60 py-4 shadow-2xl backdrop-blur-md">
            <div className="flex w-max animate-footer-scroll-marquee text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground md:text-sm">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* Centre content */}
          <div className="relative z-10 mx-auto mt-24 flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6">
            <h2
              ref={headingRef}
              className="wave-host mb-8 cursor-default text-center text-5xl font-black tracking-tighter md:mb-12 md:text-8xl"
            >
              <span className="sr-only">{HEADLINE}</span>
              <span aria-hidden="true">
                {HEADLINE.split(" ").map((word, w, words) => {
                  const offset = words.slice(0, w).join(" ").length + (w ? 1 : 0);
                  return (
                    <React.Fragment key={w}>
                      <span className="inline-block whitespace-nowrap">
                        {Array.from(word).map((char, i) => (
                          // Each letter carries the glow, since background-clip text
                          // does not reach into transformed children.
                          <span
                            key={i}
                            className="wave-char footer-text-glow"
                            style={{ ["--i" as string]: offset + i }}
                          >
                            {char}
                          </span>
                        ))}
                      </span>
                      {w < words.length - 1 && " "}
                    </React.Fragment>
                  );
                })}
              </span>
            </h2>

            <div ref={linksRef} className="flex w-full flex-col items-center gap-5 md:gap-6">
              {/* Primary actions */}
              <div className="flex w-full flex-wrap justify-center gap-3 md:gap-4">
                <MagneticButton
                  as={Link}
                  to="/contact"
                  className="footer-glass-pill roll-host group flex items-center gap-3 rounded-full px-8 py-4 text-sm font-bold text-foreground md:px-10 md:py-5 md:text-base"
                >
                  <RollText>Start a Project</RollText>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href={business.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-glass-pill roll-host group flex items-center gap-3 rounded-full px-8 py-4 text-sm font-bold text-foreground md:px-10 md:py-5 md:text-base"
                >
                  <MessageCircle className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
                  <RollText>WhatsApp Us</RollText>
                </MagneticButton>
              </div>

              {/* Page links */}
              <nav aria-label="Footer" className="flex w-full flex-wrap justify-center gap-2 md:gap-4">
                {pageLinks.map((link) => (
                  <MagneticButton
                    key={link.path}
                    as={Link}
                    to={link.path}
                    className="footer-glass-pill roll-host rounded-full px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground md:px-6 md:py-3 md:text-sm"
                  >
                    <RollText>{link.name}</RollText>
                  </MagneticButton>
                ))}
              </nav>

              {/* Contact details and social links */}
              <address className="flex flex-col items-center gap-1 text-center text-xs not-italic text-muted-foreground md:text-sm">
                <span>
                  <a href={business.phoneHref} className="transition-colors hover:text-foreground">
                    {business.phone}
                  </a>
                  <span className="mx-2 text-foreground/20">·</span>
                  <a href={`mailto:${business.email}`} className="transition-colors hover:text-foreground">
                    {business.email}
                  </a>
                </span>
                <span>
                  {addressLine}, {business.address.country}
                </span>
              </address>

              <div className="flex items-center gap-3">
                {socialLinks.map(({ name, href, icon: Icon }) => (
                  <MagneticButton
                    key={name}
                    as="a"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="footer-glass-pill flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </MagneticButton>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar. Extra bottom padding on mobile and right padding on desktop
              keep it clear of the floating WhatsApp button. */}
          <div className="relative z-20 flex w-full flex-col items-center justify-between gap-4 px-6 pb-24 md:flex-row md:gap-6 md:px-12 md:pb-8 md:pr-28">
            <div className="order-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground md:order-1 md:text-xs">
              © {year} {business.name}. All rights reserved.
            </div>

            <MagneticButton
              as="button"
              type="button"
              onClick={backToTop}
              aria-label="Back to top"
              className="footer-glass-pill group order-3 hidden h-12 w-12 items-center justify-center rounded-full text-muted-foreground hover:text-foreground md:flex"
            >
              <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1.5" />
            </MagneticButton>
          </div>
        </footer>
      </div>
    </>
  );
}

export default CinematicFooter;
