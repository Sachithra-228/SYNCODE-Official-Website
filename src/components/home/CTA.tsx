import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { RollText } from "@/components/ui/roll-text";

// The last word of the headline keeps changing: "Ready to Build Something ___?"
const WORDS = ["Remarkable", "Scalable", "Beautiful", "Secure", "Lightning-Fast", "Unforgettable"];
const INTERVAL_MS = 2200;

const RotatingWord = () => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % WORDS.length), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [inView]);

  const word = WORDS[index];

  return (
    <span ref={ref} className="relative inline-flex items-baseline">
      {/* Screen readers hear one stable word instead of a changing one */}
      <span className="sr-only">{WORDS[0]}?</span>
      <motion.span
        layout
        aria-hidden="true"
        transition={{ layout: { duration: 0.5, ease: [0.65, 0, 0.35, 1] } }}
        className="relative inline-block overflow-hidden pb-[0.12em] align-bottom"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={word}
            className="gradient-text inline-block whitespace-nowrap"
            initial={reducedMotion ? { opacity: 0 } : { y: "100%", opacity: 0, filter: "blur(8px)" }}
            animate={reducedMotion ? { opacity: 1 } : { y: "0%", opacity: 1, filter: "blur(0px)" }}
            exit={reducedMotion ? { opacity: 0 } : { y: "-100%", opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        </AnimatePresence>
      </motion.span>
      <motion.span layout aria-hidden="true" className="gradient-text inline-block">
        ?
      </motion.span>
      {/* Blinking build cursor */}
      <span
        aria-hidden="true"
        className="ml-2 inline-block h-[0.8em] w-[0.08em] self-center bg-foreground/70 animate-[pulse_1s_steps(2)_infinite]"
      />
    </span>
  );
};

export const CTA = () => {
  return (
    <section className="relative overflow-hidden bg-background pb-24 pt-16 md:pb-32 md:pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-background/10 via-transparent to-transparent opacity-50" />
        <div className="absolute inset-0 noise opacity-[0.03]" />
      </div>

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-display-lg text-foreground mb-6"
          >
            Ready to Build Something
            <br />
            <RotatingWord />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Let's discuss your vision and explore how we can bring it to life.
            Our team is ready to partner with you on your next digital venture.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link
              to="/contact"
              className="roll-host inline-flex items-center justify-center gap-2 px-10 py-5
                         bg-foreground text-background text-lg font-semibold rounded-full
                         transition-all duration-300 hover:scale-105 hover:shadow-glow group"
            >
              <RollText>Start a Conversation</RollText>
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
