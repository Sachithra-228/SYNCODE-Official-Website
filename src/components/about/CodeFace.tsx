import { useEffect, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

// Characters from light to dense, used for the finished portrait
const RAMP = " .,:;-=+*%#@";
// Glyphs shown while a character is still "decoding"
const GLYPHS = "{}[]<>/\\;=+01#$&*";
const COLS = 72;
// Character cells are taller than they are wide
const CELL_ASPECT = 0.6;

type Cell = { lum: number; t: number };

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/** Crop as fractions of the photo: [x, y, width, height]. */
export type Crop = [number, number, number, number];

/**
 * Build the grid of brightness values from a photo. The crop frames the head and
 * shoulders; a plain background is dropped, and contrast is stretched so the face reads.
 */
const cellsFromImage = (img: HTMLImageElement, crop: Crop = [0, 0, 1, 1]): { cells: Cell[]; rows: number } => {
  const sx = crop[0] * img.naturalWidth;
  const sy = crop[1] * img.naturalHeight;
  const sw = crop[2] * img.naturalWidth;
  const sh = crop[3] * img.naturalHeight;
  const rows = Math.round(COLS * (sh / sw) * CELL_ASPECT);
  const c = document.createElement("canvas");
  c.width = COLS;
  c.height = rows;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, COLS, rows);
  const { data } = ctx.getImageData(0, 0, COLS, rows);

  const px = (x: number, y: number) => {
    const i = (y * COLS + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };

  // Background colour: the average of the left and right edges
  const edge: number[][] = [];
  for (let y = 0; y < rows; y++) edge.push(px(0, y), px(COLS - 1, y));
  const bg = [0, 1, 2].map((k) => edge.reduce((s, p) => s + p[k], 0) / edge.length);
  const spread =
    Math.sqrt(edge.reduce((s, p) => s + (p[0] - bg[0]) ** 2 + (p[1] - bg[1]) ** 2 + (p[2] - bg[2]) ** 2, 0) / edge.length) || 0;
  // Only remove the background when it is a plain, even colour
  const plainBackground = spread < 22;
  const threshold = Math.max(26, spread * 2.2);

  // Contrast stretch: map the 4th-96th percentile of brightness to 0-1
  const lums: number[] = [];
  for (let i = 0; i < data.length; i += 4) lums.push((0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255);
  const sorted = [...lums].sort((a, b) => a - b);
  const lo = sorted[Math.floor(sorted.length * 0.04)];
  const hi = sorted[Math.floor(sorted.length * 0.96)];
  const stretch = (v: number) => Math.max(0, Math.min(1, (v - lo) / Math.max(0.05, hi - lo)));

  // Edge strength (Sobel) makes eyes, brows, mouth and hairline stand out
  const L = (x: number, y: number) => lums[Math.min(rows - 1, Math.max(0, y)) * COLS + Math.min(COLS - 1, Math.max(0, x))];
  const edges: number[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < COLS; x++) {
      const gx = L(x + 1, y - 1) + 2 * L(x + 1, y) + L(x + 1, y + 1) - L(x - 1, y - 1) - 2 * L(x - 1, y) - L(x - 1, y + 1);
      const gy = L(x - 1, y + 1) + 2 * L(x, y + 1) + L(x + 1, y + 1) - L(x - 1, y - 1) - 2 * L(x, y - 1) - L(x + 1, y - 1);
      edges.push(Math.sqrt(gx * gx + gy * gy));
    }
  }
  const edgeMax = [...edges].sort((a, b) => a - b)[Math.floor(edges.length * 0.95)] || 1;

  const cells: Cell[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < COLS; x++) {
      const [r, g, b] = px(x, y);
      const dist = Math.sqrt((r - bg[0]) ** 2 + (g - bg[1]) ** 2 + (b - bg[2]) ** 2);
      const lum = stretch((0.299 * r + 0.587 * g + 0.114 * b) / 255);
      // Soft oval fade towards the edges keeps busy backgrounds quiet
      const dx = (x / COLS - 0.5) / 0.5;
      const dy = (y / rows - 0.42) / 0.6;
      const fade = Math.max(0, Math.min(1, (plainBackground ? 1.5 : 1.25) - Math.sqrt(dx * dx + dy * dy)));
      const edge = Math.min(1, edges[y * COLS + x] / edgeMax);
      const value = Math.min(1, 0.5 * Math.pow(lum, 1.2) + 0.85 * edge) * fade;
      cells.push({
        lum: (plainBackground && dist < threshold) || value < 0.04 ? -1 : value,
        // Decodes roughly top to bottom, with some randomness
        t: 0.65 * (y / rows) + 0.3 * Math.random(),
      });
    }
  }
  return { cells, rows };
};

/** Build the grid from initials, for people without a photo yet. */
const cellsFromInitials = (initials: string): { cells: Cell[]; rows: number } => {
  const rows = Math.round(COLS * 1.25 * CELL_ASPECT);
  const c = document.createElement("canvas");
  c.width = COLS * 4;
  c.height = rows * 4;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // Squash horizontally to undo the tall character cells
  ctx.save();
  ctx.scale(1, CELL_ASPECT * 1.6);
  ctx.font = `900 ${c.width * 0.42}px Inter, system-ui, sans-serif`;
  ctx.fillText(initials, c.width / 2, c.height / 2 / (CELL_ASPECT * 1.6));
  ctx.restore();
  const { data } = ctx.getImageData(0, 0, c.width, c.height);

  const cells: Cell[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < COLS; x++) {
      // Average a 4x4 block
      let sum = 0;
      for (let yy = 0; yy < 4; yy++)
        for (let xx = 0; xx < 4; xx++) sum += data[((y * 4 + yy) * c.width + (x * 4 + xx)) * 4];
      const lum = sum / 16 / 255;
      cells.push({ lum: lum < 0.05 ? -1 : lum, t: 0.65 * (y / rows) + 0.3 * Math.random() });
    }
  }
  return { cells, rows };
};

/**
 * A portrait drawn entirely with code characters. `reveal` (0 to 1) controls how
 * much of it has decoded; characters near the pointer scramble on hover.
 */
export const CodeFace = ({
  src,
  crop,
  initials,
  reveal,
  className,
}: {
  src?: string;
  crop?: Crop;
  initials: string;
  reveal: MotionValue<number>;
  className?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grid = useRef<{ cells: Cell[]; rows: number } | null>(null);
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

    // Fit the grid inside the canvas, keeping its proportions
    const cellW = Math.min(w / COLS, h / g.rows * CELL_ASPECT);
    const cellH = cellW / CELL_ASPECT;
    const ox = (w - cellW * COLS) / 2;
    const oy = (h - cellH * g.rows) / 2;
    ctx.font = `${cellH * 0.95}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.textBaseline = "top";

    const r = reveal.get();
    const p = pointer.current;
    const radius = 5;

    for (let y = 0; y < g.rows; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = g.cells[y * COLS + x];
        const near = p && Math.abs(p.x - x) < radius && Math.abs(p.y - y) < radius * CELL_ASPECT * 1.6;
        let ch: string | null = null;
        let alpha = 0;
        if (cell.lum >= 0 && r >= cell.t) {
          if ((near && Math.random() < 0.7) || Math.random() < 0.004) {
            ch = randomGlyph();
            alpha = 1;
          } else {
            ch = RAMP[Math.min(RAMP.length - 1, Math.floor(cell.lum * RAMP.length))];
            alpha = 0.18 + 0.82 * cell.lum;
          }
        } else if (r < cell.t && r >= cell.t - 0.12 && r > 0.01 && (cell.lum >= 0 || Math.random() < 0.25)) {
          // Decoding front: random glyphs just ahead of the finished area
          ch = randomGlyph();
          alpha = 0.55;
        }
        if (ch && ch !== " ") {
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.fillText(ch, ox + x * cellW, oy + y * cellH);
        }
      }
    }
  };

  const schedule = () => {
    if (!frame.current) frame.current = requestAnimationFrame(draw);
  };

  // Build the grid once the photo has loaded (or straight away for initials)
  useEffect(() => {
    let cancelled = false;
    if (src) {
      const img = new Image();
      img.src = src;
      img.decode().then(
        () => {
          if (cancelled) return;
          grid.current = cellsFromImage(img, crop);
          schedule();
        },
        () => {
          if (cancelled) return;
          grid.current = cellsFromInitials(initials);
          schedule();
        }
      );
    } else {
      grid.current = cellsFromInitials(initials);
      schedule();
    }
    const ro = new ResizeObserver(schedule);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => {
      cancelled = true;
      ro.disconnect();
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, initials]);

  // A few characters keep flickering while the portrait is on screen, like live code
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id = 0;
    const io = new IntersectionObserver(([entry]) => {
      window.clearInterval(id);
      if (entry.isIntersecting) id = window.setInterval(schedule, 140);
    });
    io.observe(canvas);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMotionValueEvent(reveal, "change", schedule);

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const g = grid.current;
    const canvas = canvasRef.current;
    if (!g || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cellW = Math.min(rect.width / COLS, (rect.height / g.rows) * CELL_ASPECT);
    const cellH = cellW / CELL_ASPECT;
    const ox = (rect.width - cellW * COLS) / 2;
    const oy = (rect.height - cellH * g.rows) / 2;
    pointer.current = { x: (e.clientX - rect.left - ox) / cellW, y: (e.clientY - rect.top - oy) / cellH };
    schedule();
  };

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      onPointerMove={onMove}
      onPointerLeave={() => {
        pointer.current = null;
        schedule();
      }}
      className={cn("block h-full w-full", className)}
    />
  );
};

export default CodeFace;
