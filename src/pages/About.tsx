import { Code2, Users, Lightbulb, Award } from "lucide-react";
import Footer from "@/components/layout/Footer";
import TeamShowcase, { type TeamGroup } from "@/components/about/TeamShowcase";
import { AboutCTA, AboutHero, StorySection, ValuesSection, type Value } from "@/components/about/AboutSections";
import sachithraAvatar from "@/assets/team/Sachithra.webp";
import praveenAvatar from "@/assets/team/Praveen.webp";
import pasanAvatar from "@/assets/team/Pasan.webp";
import vishwaAvatar from "@/assets/team/Vishwa.webp";
import kumodhAvatar from "@/assets/team/Kumodh.webp";
import anukAvatar from "@/assets/team/Anuk.webp";


const story =
  "SYNCODE was built to fix what businesses struggle with most: technology that slows growth instead of accelerating it. We combine deep engineering experience with true partnership to deliver software that solves real problems, moves fast, and creates measurable impact.";

const values: Value[] = [
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
        crop: [0.29, 0, 0.4, 0.38],
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
        crop: [0.15, 0, 0.7, 0.875],
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
        crop: [0.15, 0.1, 0.7, 0.7],
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
        crop: [0.15, 0.05, 0.667, 0.667],
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
        crop: [0.28, 0.07, 0.667, 0.826],
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
        crop: [0.14, 0.07, 0.7, 0.656],
      },
    ],
  },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <main>
      <AboutHero />
      <StorySection text={story} />
      <ValuesSection values={values} />
      <TeamShowcase groups={teamGroups} ceoFullName="Sachithra Wijesinghe" />
      <AboutCTA />
    </main>
    <Footer />
  </div>
);

export default About;
