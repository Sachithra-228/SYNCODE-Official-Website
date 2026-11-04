import { cn } from "@/lib/utils";

// Text whose letters roll up to a copy of themselves when the nearest
// `.roll-host`, `.btn-primary` or `.btn-secondary` ancestor is hovered or focused.
// Screen readers get the plain text; the animated letters are hidden from them.
export const RollText = ({ children, className }: { children: string; className?: string }) => (
  <span className={cn("roll-text", className)}>
    <span className="sr-only">{children}</span>
    <span aria-hidden="true" className="inline-flex">
      {Array.from(children).map((char, i) => {
        const c = char === " " ? " " : char;
        return (
          <span key={i} className="roll-char" data-char={c} style={{ ["--i" as string]: i }}>
            {c}
          </span>
        );
      })}
    </span>
  </span>
);

export default RollText;
