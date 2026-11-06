import { useEffect, useRef } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cellsFromImage, type Crop } from "@/lib/code-portrait";
import type { TeamMember } from "@/components/about/TeamShowcase";

// The portrait is drawn from this code, character by character, in reading order
const CODE = `import { design, engineer, test, deploy } from "@syncode/studio";
const studio = { name: "SYNCODE", home: "Pannipitiya, Sri Lanka", mission: "software that scales" };
export async function ship(idea) {
  const plan = await design(idea, { usersFirst: true, accessible: true });
  const app = engineer(plan).with(["react", "node", "typescript", "ai"]);
  await test(app, { unit: true, e2e: true, performance: "fast" });
  return deploy(app, { region: "global" }).monitor({ alerts: true });
}
function engineer(plan) {
  return plan.modules.map((module) => module.compose({ clean: true })).reduce(merge);
}
const team = ["engineers", "analysts", "designers"].map((role) => hire(role, { curious: true }));
while (client.hasIdeas()) { ship(client.nextIdea()).then(celebrate); }
export default studio;
`;
const FLAT = CODE.replace(/\s+/g, " ");
const COLS = 104;
const CELL_ASPECT = 0.6;

type Grid = { cells: { lum: number }[]; rows: number; order: number[] };

/** Canvas that types the portrait out of code as `progress` goes from 0 to 1. */
const CodeCanvas = ({ src, crop, progress }: { src: string; crop?: Crop; progress: MotionValue<number> }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grid = useRef<Grid | null>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const frame = useRef(0);

  const draw = () => {
    frame.current = 0;
    const canvas = canvasRef.current;
    const g = grid.current;
    if (!canvas || !g) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const cellW = Math.min(w / COLS, (h / g.rows) * CELL_ASPECT);
    const cellH = cellW / CELL_ASPECT;
    const ox = (w - cellW * COLS) / 2;
    const oy = (h - cellH * g.rows) / 2;
    ctx.textBaseline = "top";

    const typed = Math.floor(progress.get() * g.order.length);
    const p = pointer.current;

    // Two passes: light areas in bold, darker areas in a light weight, so the
    // face reads clearly even though every character is real code.
    for (const bold of [false, true]) {
      ctx.font = `${bold ? 800 : 400} ${cellH * 0.95}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      for (let k = 0; k < typed; k++) {
        const i = g.order[k];
        const cell = g.cells[i];
        if (cell.lum >= 0.5 !== bold) continue;
        const ch = FLAT[k % FLAT.length];
        if (ch === " ") continue;
        const x = i % COLS;
        const y = Math.floor(i / COLS);
        // Steeper curve: dark areas fade right back, bright areas pop
        let alpha = 0.03 + 0.97 * Math.pow(cell.lum, 1.7);
        if (p && Math.abs(p.x - x) < 7 && Math.abs(p.y - y) < 4) alpha = Math.max(alpha, 0.95);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillText(ch, ox + x * cellW, oy + y * cellH);
      }
    }

    // Typing cursor
    if (typed < g.order.length) {
      const i = g.order[typed];
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fillRect(ox + (i % COLS) * cellW, oy + Math.floor(i / COLS) * cellH, cellW, cellH);
    }
  };

  const schedule = () => {
    if (!frame.current) frame.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.src = src;
    img.decode().then(() => {
      if (cancelled) return;
      const { cells, rows } = cellsFromImage(img, crop, COLS);
      // Reading order, skipping empty background cells so the code flows across the face
      const order: number[] = [];
      cells.forEach((c, i) => {
        if (c.lum >= 0) order.push(i);
      });
      grid.current = { cells, rows, order };
      schedule();
    });
    const ro = new ResizeObserver(schedule);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => {
      cancelled = true;
      ro.disconnect();
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useMotionValueEvent(progress, "change", schedule);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="block h-full w-full cursor-crosshair"
      onPointerMove={(e) => {
        const g = grid.current;
        const canvas = canvasRef.current;
        if (!g || !canvas) return;
        const r = canvas.getBoundingClientRect();
        const cellW = Math.min(r.width / COLS, (r.height / g.rows) * CELL_ASPECT);
        const cellH = cellW / CELL_ASPECT;
        pointer.current = {
          x: (e.clientX - r.left - (r.width - cellW * COLS) / 2) / cellW,
          y: (e.clientY - r.top - (r.height - cellH * g.rows) / 2) / cellH,
        };
        schedule();
      }}
      onPointerLeave={() => {
        pointer.current = null;
        schedule();
      }}
    />
  );
};

const LOG = [
  "fetching portrait",
  "mapping light to characters",
  "writing code",
  "compiling face",
];

/**
 * The CEO's portrait, typed out of real code while the section is pinned:
 * the page holds still until the image is complete, then carries on.
 */
export const CeoPortrait = ({ member, fullName }: { member: TeamMember; fullName: string }) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const typing = useTransform(p, [0.04, 0.78], [0, 1], { clamp: true });
  const percent = useTransform(typing, (v) => `${Math.round(v * 100)}%`);
  const line = useTransform(typing, (v) => `Ln ${Math.max(1, Math.round(v * 62))}`);
  const detailsOpacity = useTransform(p, [0.8, 0.9], [0, 1]);
  const detailsY = useTransform(p, [0.8, 0.9], [40, 0]);
  const logOpacity = useTransform(p, [0.76, 0.84], [1, 0]);

  return (
    <section ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="container-wide grid w-full items-center gap-8 pt-16 lg:grid-cols-12 lg:gap-16">
          {/* Editor window */}
          <div className="lg:col-span-6">
            <div className="mx-auto w-full max-w-[520px] overflow-hidden rounded-2xl border border-white/10 bg-[hsl(0_0%_5%)] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                </div>
                <span className="font-mono text-[11px] text-white/60">founder.ts</span>
                <motion.span className="ml-auto font-mono text-[11px] text-white/50">{percent}</motion.span>
              </div>
              <div className="relative aspect-[4/5] max-h-[52svh] w-full lg:max-h-[68svh]">
                <CodeCanvas src={member.avatar!} crop={member.crop} progress={typing} />
              </div>
              <div className="flex items-center justify-between border-t border-white/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/40">
                <motion.span>{line}</motion.span>
                <span>TypeScript · UTF-8</span>
              </div>
            </div>
          </div>

          {/* Build log, then the person */}
          <div className="relative min-h-[14rem] lg:col-span-6">
            <motion.ul
              style={{ opacity: logOpacity }}
              className="absolute inset-0 space-y-2 font-mono text-sm text-muted-foreground"
              aria-hidden="true"
            >
              <li className="mb-6 flex items-center gap-3 font-sans text-sm font-medium uppercase tracking-widest">
                <span className="h-px w-8 bg-foreground/40" />
                The people behind the code
              </li>
              {LOG.map((entry, i) => (
                <LogLine key={entry} text={entry} at={i / LOG.length} progress={typing} />
              ))}
            </motion.ul>

            <motion.div style={{ opacity: detailsOpacity, y: detailsY }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
                CEO
              </span>
              <h2 className="mt-6 text-[clamp(2.75rem,6.5vw,6rem)] font-black leading-[0.9] tracking-tighter">
                {fullName}
              </h2>
              <p className="mt-4 text-xl font-semibold md:text-2xl">
                <span className="gradient-text">{member.primaryRole}</span>
              </p>
              {member.secondaryRoles && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {member.secondaryRoles.map((role) => (
                    <li key={role} className="rounded-full bg-white/[0.06] px-3 py-1.5 text-sm text-foreground/80">
                      {role}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const LogLine = ({ text, at, progress }: { text: string; at: number; progress: MotionValue<number> }) => {
  const opacity = useTransform(progress, [at, at + 0.05], [0.2, 1]);
  const mark = useTransform(progress, (v) => (v >= at + 0.25 || v >= 1 ? "✓" : v >= at ? "›" : " "));
  return (
    <motion.li style={{ opacity }} className="flex gap-3">
      <motion.span className="w-3 text-foreground">{mark}</motion.span>
      {text}
    </motion.li>
  );
};

export default CeoPortrait;
