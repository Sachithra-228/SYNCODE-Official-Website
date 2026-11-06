import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { CodeFace, type Crop } from "@/components/about/CodeFace";

export type TeamMember = {
  name: string;
  primaryRole: string;
  secondaryRoles?: string[];
  responsibilities: string[];
  /** Photo; without one, the portrait is drawn from the person's initials */
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

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// ---------------------------------------------------------------------------
// One person: their face decodes out of code characters as it scrolls into
// view, then their name, position and responsibilities appear.
// ---------------------------------------------------------------------------
const MemberBlock = ({ member, group, flip }: { member: TeamMember; group: string; flip: boolean }) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "center 0.55"] });
  const percent = useTransform(scrollYProgress, (v) => `${String(Math.round(v * 100)).padStart(3, "0")}%`);
  const slug = member.name.toLowerCase().replace(/[^a-z]+/g, "-");

  return (
    <article
      ref={ref}
      className="grid items-center gap-10 py-16 md:py-24 lg:min-h-[88svh] lg:grid-cols-12 lg:gap-16"
    >
      {/* Code portrait */}
      <div className={cn("lg:col-span-5", flip && "lg:order-2")}>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-[2rem] border border-white/10 bg-black">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(to right, hsl(var(--foreground) / 0.05) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground) / 0.05) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <CodeFace
            src={member.avatar}
            crop={member.crop}
            initials={initialsOf(member.name)}
            reveal={scrollYProgress}
            className="relative cursor-crosshair"
          />
          {/* Terminal-style labels */}
          <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/50">
            <span>syncode://team/{slug}</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70" />
              render
            </span>
          </div>
          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/50">
            <span>{member.avatar ? "source: photo" : "source: initials"}</span>
            <motion.span className="text-white/80">{percent}</motion.span>
          </div>
        </div>
      </div>

      {/* Details */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
        className={cn("lg:col-span-7", flip && "lg:order-1")}
      >
        <motion.span
          variants={reveal}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground"
        >
          {group}
        </motion.span>
        <motion.h3
          variants={reveal}
          className="mt-6 text-[clamp(3rem,8vw,7rem)] font-black leading-[0.9] tracking-tighter"
        >
          {member.name}
        </motion.h3>
        <motion.p variants={reveal} className="mt-4 text-xl font-semibold md:text-2xl">
          <span className="gradient-text">{member.primaryRole}</span>
        </motion.p>
        {member.secondaryRoles && member.secondaryRoles.length > 0 && (
          <motion.ul variants={reveal} className="mt-5 flex flex-wrap gap-2">
            {member.secondaryRoles.map((role) => (
              <li
                key={role}
                className="rounded-full bg-white/[0.06] px-3 py-1.5 text-sm text-foreground/80"
              >
                {role}
              </li>
            ))}
          </motion.ul>
        )}
        <motion.div variants={reveal} className="mt-8 border-t border-white/10 pt-6">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {"// responsibilities"}
          </p>
          <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {member.responsibilities.map((item) => (
              <li key={item} className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-[0.55em] h-1 w-3 shrink-0 bg-foreground/50" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </article>
  );
};

export const TeamShowcase = ({ groups }: { groups: TeamGroup[] }) => {
  const people = groups.flatMap((g) => g.members.map((m) => ({ member: m, group: g.title })));

  return (
    <section className="relative">
      <div className="container-wide pt-24 md:pt-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              <span className="h-px w-8 bg-foreground/40" />
              The team
            </span>
            <h2 className="mt-6 text-[clamp(2.5rem,7vw,6rem)] font-black leading-[0.92] tracking-tighter">
              The people
              <br />
              <span className="gradient-text">behind the code.</span>
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            Scroll to compile each member of the team. Move your cursor over a portrait to stir up
            the code.
          </p>
        </div>

        <div className="divide-y divide-white/10">
          {people.map(({ member, group }, i) => (
            <MemberBlock key={member.name} member={member} group={group} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamShowcase;
