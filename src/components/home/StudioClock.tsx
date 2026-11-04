import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { business } from "@/lib/site";

// Sri Lanka is UTC+5:30 all year (no daylight saving).
const SL_OFFSET_MIN = 330;
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const pad = (n: number) => String(n).padStart(2, "0");

/** Current time in Sri Lanka, read with UTC getters from a shifted timestamp. */
const sriLankaNow = () => new Date(Date.now() + SL_OFFSET_MIN * 60_000);

/** How the visitor's clock compares with Sri Lanka, e.g. "Sri Lanka is 5h 30m ahead of you". */
const compareWithVisitor = () => {
  const visitorOffset = -new Date().getTimezoneOffset();
  const diff = SL_OFFSET_MIN - visitorOffset;
  if (diff === 0) return "You're in the same time zone as us";
  const abs = Math.abs(diff);
  const text = `${Math.floor(abs / 60)}h${abs % 60 ? ` ${abs % 60}m` : ""}`;
  return `Sri Lanka is ${text} ${diff > 0 ? "ahead of" : "behind"} you`;
};

// ---------------------------------------------------------------------------
// Analog clock face (SVG). Hands are turned directly on each animation frame
// for a smooth sweeping second hand, without re-rendering React.
// ---------------------------------------------------------------------------
const ClockFace = ({ className }: { className?: string }) => {
  const hourRef = useRef<SVGGElement>(null);
  const minuteRef = useRef<SVGGElement>(null);
  const secondRef = useRef<SVGGElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let timer = 0;

    const draw = () => {
      const d = sriLankaNow();
      const ms = d.getUTCMilliseconds();
      // Reduced motion: the second hand ticks once a second instead of sweeping
      const s = d.getUTCSeconds() + (reduced ? 0 : ms / 1000);
      const m = d.getUTCMinutes() + s / 60;
      const h = (d.getUTCHours() % 12) + m / 60;
      secondRef.current?.setAttribute("transform", `rotate(${s * 6} 100 100)`);
      minuteRef.current?.setAttribute("transform", `rotate(${m * 6} 100 100)`);
      hourRef.current?.setAttribute("transform", `rotate(${h * 30} 100 100)`);
    };

    draw();
    setReady(true);
    if (reduced) {
      timer = window.setInterval(draw, 1000);
    } else {
      const loop = () => {
        draw();
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(timer);
    };
  }, []);

  const ticks = Array.from({ length: 60 }, (_, i) => {
    const major = i % 5 === 0;
    return (
      <line
        key={i}
        x1="100"
        y1={major ? 14 : 16}
        x2="100"
        y2={major ? 26 : 21}
        transform={`rotate(${i * 6} 100 100)`}
        stroke="currentColor"
        strokeWidth={major ? 2.4 : 1}
        strokeLinecap="round"
        className={major ? "text-foreground/80" : "text-foreground/20"}
      />
    );
  });

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Analog clock showing the time in Sri Lanka">
      <defs>
        <radialGradient id="clock-face" cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor="hsl(var(--foreground) / 0.08)" />
          <stop offset="100%" stopColor="hsl(var(--foreground) / 0.01)" />
        </radialGradient>
      </defs>

      {/* Bezel and face */}
      <circle cx="100" cy="100" r="97" fill="none" stroke="hsl(var(--foreground) / 0.12)" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="90" fill="url(#clock-face)" stroke="hsl(var(--foreground) / 0.08)" />
      {ticks}

      {/* Numerals */}
      {[
        ["12", 100, 44],
        ["3", 160, 104],
        ["6", 100, 164],
        ["9", 40, 104],
      ].map(([n, x, y]) => (
        <text
          key={n as string}
          x={x as number}
          y={y as number}
          textAnchor="middle"
          className="fill-foreground/60 font-mono text-[11px] font-semibold"
        >
          {n}
        </text>
      ))}
      <text x="100" y="132" textAnchor="middle" className="fill-foreground/35 font-mono text-[7px] tracking-[0.25em]">
        COLOMBO
      </text>

      <g className={cn("transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}>
        {/* Hour hand */}
        <g ref={hourRef}>
          <rect x="96.5" y="54" width="7" height="52" rx="3.5" className="fill-foreground" />
        </g>
        {/* Minute hand */}
        <g ref={minuteRef}>
          <rect x="97.75" y="30" width="4.5" height="76" rx="2.25" className="fill-foreground/90" />
        </g>
        {/* Second hand with counterweight */}
        <g ref={secondRef}>
          <line x1="100" y1="122" x2="100" y2="24" stroke="hsl(var(--foreground) / 0.55)" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="100" cy="118" r="3.2" fill="hsl(var(--foreground) / 0.55)" />
        </g>
        <circle cx="100" cy="100" r="4.5" className="fill-background stroke-foreground" strokeWidth="2" />
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Card content: clock, digital time and how the time compares
// with the visitor's own.
// ---------------------------------------------------------------------------
export const StudioClock = () => {
  // Filled in the browser only, so pre-rendered HTML never shows a stale time.
  const [now, setNow] = useState<Date | null>(null);
  const [compare, setCompare] = useState("");

  useEffect(() => {
    setNow(sriLankaNow());
    setCompare(compareWithVisitor());
    const id = window.setInterval(() => setNow(sriLankaNow()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex h-full flex-col justify-between gap-8">
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        The Studio
      </span>

      {/* Side by side where the card is wide enough, stacked otherwise */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8 lg:flex-col lg:gap-5 xl:flex-row xl:gap-8">
        <div className="relative shrink-0">
          {/* Soft glow behind the clock */}
          <div
            aria-hidden="true"
            className="absolute inset-4 rounded-full bg-foreground/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 md:opacity-60"
          />
          <ClockFace className="relative h-44 w-44 drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-transform duration-700 ease-out group-hover:scale-[1.04] md:h-48 md:w-48" />
        </div>

        <div className="min-w-0 text-center sm:text-left lg:text-center xl:text-left">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {business.address.locality}, {business.address.country}
          </p>
          <p
            className="mt-2 whitespace-nowrap font-mono text-4xl font-bold leading-none tracking-tight tabular-nums xl:text-5xl"
            aria-live="off"
          >
            {now ? `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}` : "--:--"}
            <span className="ml-1.5 align-top text-base text-muted-foreground">
              {now ? pad(now.getUTCSeconds()) : "--"}
            </span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{now ? WEEKDAYS[now.getUTCDay()] : " "}</p>
          <p className="mt-4 text-xs text-foreground/70">{compare || " "}</p>
        </div>
      </div>

      <a
        href={business.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group/map flex items-center gap-3 border-t border-white/10 pt-5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <MapPin size={16} className="shrink-0" />
        <span>Find us on Google Maps</span>
        <ArrowUpRight
          size={16}
          className="ml-auto transition-transform duration-300 group-hover/map:-translate-y-0.5 group-hover/map:translate-x-0.5"
        />
      </a>
    </div>
  );
};

export default StudioClock;
