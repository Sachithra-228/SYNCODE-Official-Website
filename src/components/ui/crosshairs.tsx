import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// A row of small "+" markers across a section, like the marks on a technical drawing.
// Markers near the mouse pointer grow, turn and brighten. Decorative only.
export const Crosshairs = ({ count = 5, className }: { count?: number; className?: string }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const marks = Array.from(row.querySelectorAll<HTMLElement>(".crosshair"));
    let frame = 0;
    let px = -9999;
    let py = -9999;

    const update = () => {
      frame = 0;
      marks.forEach((m) => {
        const r = m.getBoundingClientRect();
        const d = Math.hypot(r.left + r.width / 2 - px, r.top + r.height / 2 - py);
        const t = Math.max(0, 1 - d / 260); // 1 when the pointer is on it, 0 beyond 260px
        m.style.setProperty("--s", String(1 + t * 1.6));
        m.style.setProperty("--r", `${t * 90}deg`);
        m.style.setProperty("--o", String(0.35 + t * 0.65));
      });
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rowRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-x-0 z-[1] h-0", className)}
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="crosshair"
          style={{ left: `${((i + 0.5) / count) * 100}%`, top: 0 }}
        />
      ))}
    </div>
  );
};

export default Crosshairs;
