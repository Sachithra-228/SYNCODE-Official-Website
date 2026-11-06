import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Crop } from "@/lib/code-portrait";
import CeoPortrait from "@/components/about/CeoPortrait";

export type TeamMember = {
  name: string;
  primaryRole: string;
  secondaryRoles?: string[];
  responsibilities: string[];
  /** Photo; without one, initials are shown */
  avatar?: string;
  /** Head-and-shoulders crop of the photo: [x, y, width, height] as fractions */
  crop?: Crop;
};

export type TeamGroup = {
  title: string;
  subtitle: string;
  members: TeamMember[];
};

const EASE = [0.16, 1, 0.3, 1] as const;

// ---------------------------------------------------------------------------
// Skill areas for the board. Each square's brightness comes from the person's
// own listed roles: main role (brightest), secondary roles, then responsibilities.
// ---------------------------------------------------------------------------
const SKILLS: { label: string; keys: string[] }[] = [
  { label: "Architecture", keys: ["architecture"] },
  { label: "Full-stack", keys: ["full-stack", "software engineer", "software development", "backend"] },
  { label: "Mobile apps", keys: ["mobile", "app development"] },
  { label: "Front-end", keys: ["front-end", "front end"] },
  { label: "UI/UX design", keys: ["ui/ux", "user interface", "user experience", "wireframing", "responsive design"] },
  { label: "Graphic design", keys: ["graphic", "visual content", "branding"] },
  { label: "Interactive media", keys: ["interactive media", "creative technologist", "prototyping"] },
  { label: "Data engineering", keys: ["data engineer", "data collection", "pipeline", "preprocessing", "web scraping", "data organization"] },
  { label: "Data analysis", keys: ["data analyst", "analytics", "trend analysis", "analytical"] },
  { label: "AI & ML", keys: ["ai engineer", "machine learning", "ai workflow", "ai model"] },
  { label: "BI & reporting", keys: ["business intelligence", "reporting", "dashboard", "kpi"] },
  { label: "Databases", keys: ["database", "sql"] },
  { label: "Systems analysis", keys: ["business systems", "system requirement", "requirement analysis", "business analytics"] },
  { label: "Operations", keys: ["operations", "coordination", "business process", "operational"] },
  { label: "IT support", keys: ["systems support", "hardware", "operating system", "troubleshooting", "system maintenance", "technical issue", "it problem"] },
  { label: "Team support", keys: ["team support", "assisting", "support tasks"] },
];

const LEVEL_LABEL = ["", "", "Responsibility", "Secondary role", "Main role"];
const LEVEL_CLASS = ["bg-white/[0.05]", "bg-white/[0.12]", "bg-white/25", "bg-white/55", "bg-white/90"];

const levelFor = (m: TeamMember, keys: string[]) => {
  const has = (text: string) => keys.some((k) => text.toLowerCase().includes(k));
  if (has(m.primaryRole)) return 4;
  if (m.secondaryRoles?.some(has)) return 3;
  if (m.responsibilities.some(has)) return 2;
  return 0;
};

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** Photo framed on the face, or initials. */
const Avatar = ({ member, className }: { member: TeamMember; className?: string }) =>
  member.avatar ? (
    <img
      src={member.avatar}
      alt=""
      className={cn("object-cover grayscale", className)}
      style={
        member.crop
          ? {
              objectPosition: `${(member.crop[0] + member.crop[2] / 2) * 100}% ${(member.crop[1] + member.crop[3] / 3) * 100}%`,
            }
          : undefined
      }
    />
  ) : (
    <span className={cn("flex items-center justify-center bg-white/10 font-mono font-bold", className)}>
      {initialsOf(member.name)}
    </span>
  );

// ---------------------------------------------------------------------------
// The board: a contribution-chart style grid of people by skill area
// ---------------------------------------------------------------------------
const TeamBoard = ({ people }: { people: { member: TeamMember; group: string }[] }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boardRef, { once: true, amount: 0.25 });
  const [active, setActive] = useState(0);
  const [cell, setCell] = useState<{ row: number; col: number } | null>(null);

  const levels = useMemo(
    () => people.map(({ member }) => SKILLS.map((s) => levelFor(member, s.keys))),
    [people]
  );

  const current = people[active];
  const topSkills = SKILLS.filter((_, c) => levels[active][c] >= 3).map((s) => s.label);
  const status = cell
    ? `${people[cell.row].member.name} · ${SKILLS[cell.col].label}${
        levels[cell.row][cell.col] ? ` · ${LEVEL_LABEL[levels[cell.row][cell.col]]}` : ""
      }`
    : "Hover a name or a square";

  return (
    <section className="pb-24 pt-8 md:pb-32">
      <div className="container-wide">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              <span className="h-px w-8 bg-foreground/40" />
              The team
            </span>
            <h2 className="mt-6 text-[clamp(2.25rem,5.5vw,4.5rem)] font-black leading-[0.95] tracking-tighter">
              Everyone, every skill,
              <br />
              <span className="gradient-text">at a glance.</span>
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            Each row is a person, each column a skill area. Brighter squares mean deeper involvement,
            taken from each person&apos;s listed roles.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Board */}
          <div
            ref={boardRef}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[hsl(0_0%_5%)] lg:col-span-8"
            onMouseLeave={() => setCell(null)}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5 font-mono text-[11px] text-white/50">
              <span className="text-white/70">syncode / team</span>
              <span className="ml-auto truncate" aria-live="polite">
                {status}
              </span>
            </div>

            <div className="overflow-x-auto p-4 md:p-6">
              <div className="min-w-[560px]">
                {/* Column labels */}
                <div className="mb-2 hidden h-24 items-end md:flex" aria-hidden="true">
                  <div className="w-28 shrink-0" />
                  <div className="grid flex-1 gap-1.5" style={{ gridTemplateColumns: `repeat(${SKILLS.length}, minmax(0, 1fr))` }}>
                    {SKILLS.map((s, c) => (
                      <div key={s.label} className="relative h-24">
                        <span
                          className={cn(
                            "absolute bottom-1 left-1/2 origin-bottom-left -rotate-[55deg] whitespace-nowrap text-[10px] transition-colors",
                            cell?.col === c ? "text-white" : "text-white/40"
                          )}
                        >
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rows */}
                <ul className="space-y-1.5">
                  {people.map(({ member }, r) => (
                    <li
                      key={member.name}
                      className={cn(
                        "flex items-center transition-opacity duration-300",
                        cell && cell.row !== r ? "opacity-40" : "opacity-100"
                      )}
                    >
                      <button
                        type="button"
                        onMouseEnter={() => setActive(r)}
                        onFocus={() => setActive(r)}
                        onClick={() => setActive(r)}
                        className={cn(
                          "w-28 shrink-0 truncate pr-3 text-left text-sm transition-colors",
                          active === r ? "font-semibold text-white" : "text-white/50 hover:text-white"
                        )}
                      >
                        {member.name}
                      </button>
                      <div
                        className="grid flex-1 gap-1.5"
                        style={{ gridTemplateColumns: `repeat(${SKILLS.length}, minmax(0, 1fr))` }}
                      >
                        {SKILLS.map((s, c) => {
                          const level = levels[r][c];
                          return (
                            <motion.div
                              key={s.label}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={inView ? { scale: 1, opacity: 1 } : undefined}
                              transition={{ duration: 0.4, delay: (r + c) * 0.025, ease: EASE }}
                              onMouseEnter={() => {
                                setCell({ row: r, col: c });
                                setActive(r);
                              }}
                              title={`${member.name} · ${s.label}${level ? ` · ${LEVEL_LABEL[level]}` : ""}`}
                              className={cn(
                                "aspect-square rounded-[3px] transition-[transform,background-color] duration-200 hover:scale-125",
                                LEVEL_CLASS[level],
                                active === r && level === 0 && "bg-white/[0.09]",
                                cell?.col === c && level > 0 && "ring-1 ring-white/60"
                              )}
                            />
                          );
                        })}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-2.5 text-[11px] text-white/45">
              <span>Squares come from each person&apos;s listed roles</span>
              <span className="flex items-center gap-1.5">
                Less
                {[0, 2, 3, 4].map((l) => (
                  <span key={l} className={cn("h-2.5 w-2.5 rounded-[2px]", LEVEL_CLASS[l])} />
                ))}
                More
              </span>
            </div>
          </div>

          {/* Selected person */}
          <div className="lg:col-span-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.member.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6"
              >
                <div className="flex items-center gap-4">
                  <Avatar member={current.member} className="h-16 w-16 shrink-0 rounded-2xl text-lg" />
                  <div className="min-w-0">
                    <p className="truncate text-xs uppercase tracking-widest text-muted-foreground">
                      {current.group}
                    </p>
                    <h3 className="mt-1 text-2xl font-bold tracking-tight">{current.member.name}</h3>
                  </div>
                </div>
                <p className="mt-5 text-lg font-semibold">
                  <span className="gradient-text">{current.member.primaryRole}</span>
                </p>
                {current.member.secondaryRoles && current.member.secondaryRoles.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {current.member.secondaryRoles.map((role) => (
                      <li key={role} className="rounded-full bg-white/[0.06] px-3 py-1 text-sm text-foreground/80">
                        {role}
                      </li>
                    ))}
                  </ul>
                )}
                {topSkills.length > 0 && (
                  <div className="mt-6 border-t border-white/10 pt-5">
                    <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      {"// strongest areas"}
                    </p>
                    <p className="text-sm text-foreground/80">{topSkills.join(" · ")}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Team section: the CEO's portrait typed out of code, then the whole team on
 * a contribution-chart style board.
 */
export const TeamShowcase = ({ groups, ceoFullName }: { groups: TeamGroup[]; ceoFullName: string }) => {
  const [ceo, ...rest] = groups.flatMap((g) => g.members.map((m) => ({ member: m, group: g.title })));
  return (
    <>
      {ceo && <CeoPortrait member={ceo.member} fullName={ceoFullName} />}
      <TeamBoard people={rest} />
    </>
  );
};

export default TeamShowcase;
