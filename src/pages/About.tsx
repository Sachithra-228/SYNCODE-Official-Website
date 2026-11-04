import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Code2, Users, Lightbulb, Award } from "lucide-react";
import { SplineSceneBasic } from "@/components/ui/demo";
import TeamFileViewer, { TeamGroup } from "@/components/about/TeamFileViewer";
import Footer from "@/components/layout/Footer";
import sachithraAvatar from "@/assets/team/Sachithra.webp";
import praveenAvatar from "@/assets/team/Praveen.webp";
import pasanAvatar from "@/assets/team/Pasan.webp";
import vishwaAvatar from "@/assets/team/Vishwa.webp";
import kumodhAvatar from "@/assets/team/Kumodh.webp";
import anukAvatar from "@/assets/team/Anuk.webp";
import placeholderAvatar from "@/assets/syncode-logo-round.png";
import { RollText } from "@/components/ui/roll-text";

const stats = [
  { value: "175+", label: "Projects Delivered" },
  { value: "20+", label: "Team Members" },
  { value: "4+", label: "Years Experience" },
  { value: "100%", label: "Client Satisfaction" },
];

const values = [
  {
    icon: Code2,
    title: "Engineering Excellence",
    description: "We build software that works - cleanly architected, thoroughly tested, and built to last.",
  },
  {
    icon: Users,
    title: "Collaborative Partnership",
    description: "We work alongside your team, sharing knowledge and building together for lasting success.",
  },
  {
    icon: Lightbulb,
    title: "Innovation Driven",
    description: "We embrace modern technologies and methodologies to deliver cutting-edge solutions.",
  },
  {
    icon: Award,
    title: "Quality Commitment",
    description: "Every line of code, every design decision - quality is non-negotiable in everything we do.",
  },
];

const teamGroups: TeamGroup[] = [
  {
    title: "CEO",
    subtitle: "Product vision, architecture, and engineering leadership.",
    members: [
      {
        name: "Sachithra",
        primaryRole: "Founder & Engineering Lead",
        secondaryRoles: ["Mobile Application Developer", "Software Engineer"],
        responsibilities: [
          "Product vision and strategic direction",
          "System architecture decisions",
          "Full-stack/software engineering",
          "App development coordination",
          "Technical leadership",
        ],
        avatar: sachithraAvatar,
      },
    ],
  },
  {
    title: "Data, AI & Analytics Team",
    subtitle: "Data systems, AI workflows, analytics, and intelligence.",
    members: [
      {
        name: "Praveen",
        primaryRole: "Data Analyst / AI Engineer",
        secondaryRoles: ["Software Engineer", "Machine Learning Engineer"],
        responsibilities: [
          "Business/data analytics",
          "Predictive modeling",
          "AI/ML solutions",
          "Data-driven insights",
          "Backend analytical systems",
        ],
        avatar: praveenAvatar,
      },
      {
        name: "Pasan",
        primaryRole: "Data Engineer / Data Analyst",
        secondaryRoles: ["Web Scraping Specialist", "Machine Learning Engineer"],
        responsibilities: [
          "Data collection pipelines",
          "Web scraping systems",
          "Data preprocessing",
          "Machine learning workflows",
          "Analytics dashboards and insights",
        ],
        avatar: pasanAvatar,
      },
      {
        name: "Rahul",
        primaryRole: "Business Intelligence Analyst",
        responsibilities: [
          "Data reporting",
          "Trend analysis",
          "Dashboard preparation",
          "KPI monitoring",
          "Analytical support",
        ],
        avatar: placeholderAvatar,
        imagePending: true,
      },
      {
        name: "Vishwa",
        primaryRole: "Business Systems Analyst",
        secondaryRoles: ["Database Administrator", "Software Engineer"],
        responsibilities: [
          "Business analytics",
          "Database management",
          "System requirement analysis",
          "Backend support",
          "Software development assistance",
        ],
        avatar: vishwaAvatar,
      },
    ],
  },
  {
    title: "Business & Database Operations",
    subtitle: "Operational coordination and database execution.",
    members: [
      {
        name: "Ravindu",
        primaryRole: "Operations Coordinator",
        secondaryRoles: ["SQL Developer", "Database Support Specialist"],
        responsibilities: [
          "SQL/database operations",
          "Business process coordination",
          "Data organization",
          "Operational management",
          "Reporting support",
        ],
        avatar: placeholderAvatar,
        imagePending: true,
      },
    ],
  },
  {
    title: "Design & Creative Team",
    subtitle: "Brand visuals, user experience, and interface execution.",
    members: [
      {
        name: "Chamath",
        primaryRole: "Creative Technologist",
        secondaryRoles: ["Graphic Designer", "Interactive Media Developer"],
        responsibilities: [
          "Graphic design",
          "Visual content creation",
          "Interactive media production",
          "Creative prototyping",
          "Digital branding assets",
        ],
        avatar: placeholderAvatar,
        imagePending: true,
      },
      {
        name: "Milinda",
        primaryRole: "UI/UX Designer",
        secondaryRoles: ["Front-End Developer"],
        responsibilities: [
          "User interface design",
          "User experience optimization",
          "Front-end implementation",
          "Wireframing and prototyping",
          "Responsive design systems",
        ],
        avatar: placeholderAvatar,
        imagePending: true,
      },
    ],
  },
  {
    title: "Infrastructure & Technical Support",
    subtitle: "IT troubleshooting, maintenance, and systems support.",
    members: [
      {
        name: "Kumodh",
        primaryRole: "Systems Support Engineer",
        secondaryRoles: ["Hardware Technician", "OS Support Specialist"],
        responsibilities: [
          "Hardware troubleshooting",
          "Operating system support",
          "Technical issue resolution",
          "System maintenance",
          "General IT problem-solving",
        ],
        avatar: kumodhAvatar,
      },
    ],
  },
  {
    title: "General/Support Member",
    subtitle: "Cross-team operational and coordination support.",
    members: [
      {
        name: "Anuk",
        primaryRole: "Team Support Member",
        responsibilities: [
          "Assisting team operations",
          "General support tasks",
          "Coordination assistance",
        ],
        avatar: anukAvatar,
      },
    ],
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
        <section className="py-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SplineSceneBasic />
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="relative z-10 bg-background pt-14 pb-24 md:pt-20 md:pb-32">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-8 rounded-3xl bg-card border border-border/50"
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2 gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Curved Divider */}
        <section aria-hidden="true" className="relative h-20 bg-background md:h-28">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1440 140"
            preserveAspectRatio="none"
          >
            <path
              d="M0,100 C320,20 1120,20 1440,100 L1440,140 L0,140 Z"
              fill="white"
            />
          </svg>
        </section>

        {/* Story Section */}
        <section className="bg-white pb-24 pt-16 text-black md:pb-32 md:pt-20">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-display-lg mb-6 font-display text-black">Our Story</h2>
                <p className="max-w-2xl text-xl leading-relaxed text-zinc-700 md:text-2xl">
                  SYNCODE was built to fix what businesses struggle with most: technology that
                  slows growth instead of accelerating it. We combine deep engineering experience
                  with true partnership to deliver software that solves real problems, moves fast,
                  and creates measurable impact.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-6"
              >
                {values.map((value) => (
                  <div
                    key={value.title}
                    className="rounded-2xl border border-zinc-800/70 bg-black p-6"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                      <value.icon size={20} className="text-white" />
                    </div>
                    <h3 className="mb-2 text-sm font-semibold text-white">{value.title}</h3>
                    <p className="text-xs leading-relaxed text-white/80">
                      {value.description}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section-padding">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-4 block">
                The Team
              </span>
              <h2 className="text-display-lg">
                SYNCODE
                <br />
                <span className="gradient-text">Team Explorer</span>
              </h2>
            </motion.div>

            <TeamFileViewer groups={teamGroups} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-card border-t border-border">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-display-md mb-6">Want to Work With Us?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We are always looking for talented individuals and exciting projects.
                Let&apos;s start a conversation.
              </p>
              <Link to="/contact" className="btn-primary">
                <RollText>Get in Touch</RollText>
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

export default About;
