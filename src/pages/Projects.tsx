import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import Footer from "@/components/layout/Footer";

type ProjectItem = {
  id: number;
  title: string;
  category: string;
  description: string;
  mediaSrc: string;
  bgImageSrc: string;
  href: string;
  hrefExternal?: boolean;
  tags: string[];
};

const projects: ProjectItem[] = [
  {
    id: 3,
    title: "China Lanka Motors",
    category: "Automotive Website",
    description:
      "A conversion-focused automotive platform built for trust, inventory clarity, and smooth lead capture across desktop and mobile touchpoints.",
    mediaSrc: "/chinalankamotors.webp",
    bgImageSrc: "/chinalankamotors.webp",
    href: "https://www.chinalankamotors.com/",
    hrefExternal: true,
    tags: ["Web Design", "Lead Generation", "Performance"],
  },
  {
    id: 4,
    title: "Jayas Victory Travels",
    category: "Travel Platform",
    description:
      "A travel-focused web experience designed to highlight tours, simplify enquiries, and increase booking intent with a clear user journey.",
    mediaSrc: "/jayasvictorytravel.webp",
    bgImageSrc: "/jayasvictorytravel.webp",
    href: "https://www.jayasvictorytravels.com/",
    hrefExternal: true,
    tags: ["Travel UX", "Responsive UI", "Brand Website"],
  },
  {
    id: 5,
    title: "Hotel Seven Way",
    category: "Hospitality Website",
    description:
      "A modern hotel website experience focused on visual storytelling, room discovery, and direct conversion-ready booking flows.",
    mediaSrc: "/hotelsevenway.webp",
    bgImageSrc: "/hotelsevenway.webp",
    href: "https://hotel-seven-way.vercel.app/",
    hrefExternal: true,
    tags: ["Hospitality", "UI/UX", "Conversion"],
  },
  {
    id: 6,
    title: "Maison Ashri",
    category: "Lifestyle Brand Site",
    description:
      "A refined brand-forward web experience balancing minimal design, visual hierarchy, and smooth storytelling for premium positioning.",
    mediaSrc: "/maisonashri.webp",
    bgImageSrc: "/maisonashri.webp",
    href: "https://maisonashri.vercel.app/",
    hrefExternal: true,
    tags: ["Branding", "Visual Design", "Front-End"],
  },
  {
    id: 7,
    title: "Unicare Connect",
    category: "Healthcare Platform",
    description:
      "A healthcare-oriented digital platform built for clarity, accessibility, and trust with patient-first information architecture.",
    mediaSrc: "/unicareconnect.webp",
    bgImageSrc: "/unicareconnect.webp",
    href: "https://www.unicareconnect.com/",
    hrefExternal: true,
    tags: ["Healthcare", "Accessibility", "Product Design"],
  },
  {
    id: 8,
    title: "Valor Clothing",
    category: "Fashion E-Commerce",
    description:
      "A premium fashion shopping experience for luxury clothing essentials, limited capsules, and editorial collections.",
    mediaSrc: "/screens/valorclothing.webp",
    bgImageSrc: "/screens/valorclothing.webp",
    href: "https://www.valorclothing.lk/",
    hrefExternal: true,
    tags: ["E-Commerce", "Fashion", "Brand Experience"],
  },
];

const Projects = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <section className="pt-36 pb-16 md:pt-44 md:pb-24">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <span className="mb-4 block text-sm font-medium uppercase tracking-widest text-muted-foreground">
                Our Work
              </span>
              <h1 className="mb-6 text-display-xl">
                Selected
                <br />
                <span className="gradient-text">Projects</span>
              </h1>
              <p className="max-w-3xl text-xl leading-relaxed text-muted-foreground">
                Scroll through each project to expand the visuals and explore the story behind the
                product, platform, or brand experience.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="pb-10">
          <div className="space-y-0">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <ScrollExpandMedia
                  mediaType="image"
                  mediaSrc={project.mediaSrc}
                  bgImageSrc={project.bgImageSrc}
                  title={project.title}
                  category={project.category}
                  description={project.description}
                  tags={project.tags}
                  href={project.href}
                  hrefExternal={project.hrefExternal}
                />
              </motion.div>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-card py-24">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 className="mb-6 text-display-md">Have a Project in Mind?</h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Let&apos;s build your next product with the same quality, attention to detail, and
                measurable outcomes.
              </p>
              <Link to="/contact" className="btn-primary">
                Start Your Project
                <ArrowUpRight size={18} className="ml-2" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
