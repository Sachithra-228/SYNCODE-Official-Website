import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    id: 3,
    title: "China Lanka Motors",
    category: "Automotive Website",
    description: "Conversion-focused automotive platform with clear inventory and lead capture.",
    image: "/chinalankamotors.webp",
    path: "https://www.chinalankamotors.com/",
    isExternal: true,
  },
  {
    id: 4,
    title: "Jayas Victory Travels",
    category: "Travel Platform",
    description: "Travel-focused web experience that highlights tours and simplifies enquiries.",
    image: "/jayasvictorytravel.webp",
    path: "https://www.jayasvictorytravels.com/",
    isExternal: true,
  },
  {
    id: 7,
    title: "Unicare Connect",
    category: "Healthcare Platform",
    description: "Healthcare-oriented digital platform built for clarity, accessibility, and trust.",
    image: "/unicareconnect.webp",
    path: "https://www.unicareconnect.com/",
    isExternal: true,
  },
];

export const ProjectsPreview = () => {
  return (
    <section className="section-padding relative overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] 
                      bg-gradient-radial from-foreground/3 to-transparent rounded-full blur-3xl" />
      
      <div className="container-wide relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div>
            <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-4 block">
              Featured Work
            </span>
            <h2 className="text-display-lg">
              Selected
              <br />
              <span className="gradient-text">Projects</span>
            </h2>
          </div>
          <Link
            to="/projects"
            className="btn-secondary self-start md:self-auto"
          >
            View All Projects
            <ArrowUpRight size={18} className="ml-2" />
          </Link>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              {project.isExternal ? (
                <a
                  href={project.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-3xl mb-6 aspect-[4/3]">
                    {/* Image */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 
                               group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-background/60 opacity-0 
                                  group-hover:opacity-100 transition-opacity duration-500
                                  flex items-center justify-center">
                      <span className="flex items-center gap-2 text-foreground font-semibold">
                        View Project
                        <ArrowUpRight size={18} />
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 glass rounded-full text-xs font-medium text-foreground">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-semibold mb-2 group-hover:text-foreground/80 
                               transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {project.description}
                  </p>
                </a>
              ) : (
                <Link
                  to={project.path}
                  className="group block"
                >
                <div className="relative overflow-hidden rounded-3xl mb-6 aspect-[4/3]">
                  {/* Image */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 
                               group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-background/60 opacity-0 
                                  group-hover:opacity-100 transition-opacity duration-500
                                  flex items-center justify-center">
                    <span className="flex items-center gap-2 text-foreground font-semibold">
                      View Project
                      <ArrowUpRight size={18} />
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 glass rounded-full text-xs font-medium text-foreground">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-semibold mb-2 group-hover:text-foreground/80 
                               transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-muted-foreground">
                  {project.description}
                </p>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsPreview;
