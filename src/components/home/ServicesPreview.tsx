import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Plus } from "lucide-react";

const services = [
  {
    title: "Custom Software Development",
    description: "Full-stack applications and enterprise platforms tailored to your needs.",
    path: "/services/custom-software",
    features: ["Enterprise Platforms", "Internal Tools", "API Development"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&h=800&fit=crop&auto=format&q=70",
  },
  {
    title: "Web & Mobile Development",
    description: "Cross-platform experiences that perform beautifully on any device.",
    path: "/services/web-mobile",
    features: ["Responsive Web Apps", "iOS & Android", "Progressive Web Apps"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1000&h=800&fit=crop&auto=format&q=70",
  },
  {
    title: "E-Commerce Solutions",
    description: "Scalable stores and marketplaces built for conversion and growth.",
    path: "/services/ecommerce",
    features: ["Custom Stores", "Shopify & Headless", "Payment Integration"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1000&h=800&fit=crop&auto=format&q=70",
  },
  {
    title: "AI & Intelligent Systems",
    description: "AI agents, chatbots, and automation that transform workflows.",
    path: "/services/ai-systems",
    features: ["AI Agents", "Chatbot Development", "Process Automation"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000&h=800&fit=crop&auto=format&q=70",
  },
  {
    title: "UI/UX & Website Design",
    description: "User-centered design that balances beauty with usability.",
    path: "/services/design",
    features: ["Product Design", "Marketing Websites", "Design Systems"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1000&h=800&fit=crop&auto=format&q=70",
  },
  {
    title: "Hosting & Support",
    description: "Reliable infrastructure and ongoing maintenance you can count on.",
    path: "/services/hosting",
    features: ["Web Hosting", "Performance Optimization", "SLA-Based Support"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&h=800&fit=crop&auto=format&q=70",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

export const ServicesPreview = () => {
  const [active, setActive] = useState(0);
  // True while a press started on a collapsed panel, so a tap expands it instead of navigating
  const pressedCollapsed = useRef(false);

  return (
    <section className="section-padding bg-foreground text-background relative overflow-hidden">
      {/* Noise texture */}
      <div className="absolute inset-0 noise opacity-[0.03]" />

      <div className="container-wide relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between mb-12 md:mb-16"
        >
          <div>
            <span className="text-sm font-medium text-background/60 tracking-widest uppercase mb-4 block">
              What We Do
            </span>
            <h2 className="text-display-lg text-background">
              Comprehensive
              <br />
              <span className="text-background/70">Digital Services</span>
            </h2>
          </div>
          <div className="flex items-end justify-between gap-8 lg:max-w-md">
            <p className="text-lg text-background/60">
              End-to-end solutions for every stage of your digital journey.
            </p>
            <p className="font-mono text-sm text-background/50 whitespace-nowrap" aria-hidden="true">
              <span className="text-3xl font-semibold text-background">{pad(active + 1)}</span>
              {` / ${pad(services.length)}`}
            </p>
          </div>
        </motion.div>

        {/* Expanding panels: hover, focus or tap a service to open it */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-col gap-3 lg:flex-row lg:h-[560px]"
        >
          {services.map((service, index) => {
            const isActive = index === active;
            return (
              <Link
                key={service.title}
                to={service.path}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(index)}
                onPointerDown={() => { pressedCollapsed.current = !isActive; }}
                onFocus={() => setActive(index)}
                onClick={(e) => {
                  if (pressedCollapsed.current) {
                    e.preventDefault();
                    setActive(index);
                  }
                  pressedCollapsed.current = false;
                }}
                className={`
                  group relative block overflow-hidden rounded-3xl bg-black
                  transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2
                  focus-visible:ring-offset-foreground lg:h-auto
                  ${isActive ? "h-[440px] lg:flex-[5]" : "h-[76px] lg:flex-1"}
                `}
              >
                {/* Image */}
                <img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700
                              ${isActive ? "scale-100 grayscale-0" : "scale-110 grayscale"}`}
                />
                <div
                  className={`absolute inset-0 transition-colors duration-700
                              ${isActive ? "bg-black/30" : "bg-black/65 group-hover:bg-black/50"}`}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent
                              transition-opacity duration-700 ${isActive ? "opacity-100" : "opacity-0"}`}
                />

                {/* Collapsed label */}
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 flex items-center gap-4 px-6 text-white
                              lg:flex-col lg:justify-between lg:px-0 lg:py-7
                              transition-opacity duration-300
                              ${isActive ? "opacity-0" : "opacity-100 delay-300"}`}
                >
                  <span className="font-mono text-sm text-white/60">{pad(index + 1)}</span>
                  <span className="flex-1 text-base font-semibold lg:flex-none lg:whitespace-nowrap
                                   lg:[writing-mode:vertical-rl] lg:rotate-180">
                    {service.title}
                  </span>
                  <Plus size={18} className="text-white/60 lg:hidden" />
                </div>

                {/* Expanded content */}
                <div
                  className={`absolute inset-0 flex flex-col justify-between p-6 md:p-8 text-white
                              transition-opacity duration-500
                              ${isActive ? "opacity-100 delay-300" : "opacity-0 pointer-events-none"}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-sm text-white/70">{pad(index + 1)}</span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black
                                     transition-transform duration-300 group-hover:rotate-45">
                      <ArrowUpRight size={20} />
                    </span>
                  </div>

                  {/* Fixed width so the text doesn't re-wrap while the panel grows */}
                  <div className="w-[min(26rem,calc(100vw-5rem))]">
                    <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-white">
                      {service.title}
                    </h3>
                    <p className="text-white/75 leading-relaxed mb-5">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1.5 text-xs font-medium text-white/90
                                     bg-white/10 border border-white/15 rounded-full backdrop-blur-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 px-8 py-4
                       bg-background text-foreground font-semibold rounded-full
                       transition-all duration-300 hover:scale-105"
          >
            View All Services
            <ArrowUpRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesPreview;
