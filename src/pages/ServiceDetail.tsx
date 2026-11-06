import { useParams, Link } from "react-router-dom";
import { Code, Smartphone, ShoppingCart, Brain, Palette, Server } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { RollText } from "@/components/ui/roll-text";
import ServiceDetailView, { type ServiceDetailData } from "@/components/services/ServiceDetailView";

const servicesData = {
  "custom-software": {
    icon: Code,
    title: "Custom Software Development",
    subtitle: "Full-stack applications and enterprise platforms tailored to your needs.",
    description: "We design and build custom software solutions that solve real business problems. From internal tools to customer-facing platforms, we engineer systems that scale with your business growth.",
    extendedDescription: "Our engineering team specializes in crafting bespoke software that aligns perfectly with your business objectives. We combine cutting-edge technologies with proven architectural patterns to deliver solutions that are not only powerful today but remain maintainable and scalable for years to come.",
    highlights: [
      { label: "Technologies", value: "React, Node.js, Python, Go" },
      { label: "Delivery Model", value: "Agile Sprints" },
      { label: "Avg. Project Duration", value: "3-8 Months" },
    ],
    heroImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80",
    features: [
      { title: "Full-stack Web Applications", description: "End-to-end development with modern frameworks and technologies." },
      { title: "Enterprise Platforms", description: "Robust, scalable solutions designed for complex business operations." },
      { title: "Internal Tools & Dashboards", description: "Custom admin panels and analytics dashboards for your team." },
      { title: "API Development & Integration", description: "RESTful and GraphQL APIs with seamless third-party integrations." },
      { title: "Database Design & Optimization", description: "Efficient data architecture for performance and scalability." },
      { title: "Legacy System Modernization", description: "Transform outdated systems into modern, maintainable solutions." },
    ],
    process: [
      { step: "Discovery & Requirements", description: "Deep dive into your business needs and technical requirements." },
      { step: "Architecture & Planning", description: "Design scalable architecture and create detailed project roadmap." },
      { step: "Iterative Development", description: "Agile development with regular demos and feedback cycles." },
      { step: "Testing & QA", description: "Comprehensive testing to ensure reliability and performance." },
      { step: "Deployment & Launch", description: "Smooth deployment with monitoring and support." },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&q=80",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80",
    ],
  },
  "web-mobile": {
    icon: Smartphone,
    title: "Web & Mobile Development",
    subtitle: "Cross-platform experiences with native performance on every device.",
    description: "We create responsive web applications and native mobile apps that deliver exceptional user experiences across all platforms, ensuring your product reaches users wherever they are.",
    extendedDescription: "From sleek consumer apps to complex enterprise mobile solutions, we build products that users love. Our cross-platform expertise means faster time-to-market without sacrificing quality or native feel.",
    highlights: [
      { label: "Platforms", value: "iOS, Android, Web" },
      { label: "Frameworks", value: "React Native, Flutter" },
      { label: "App Store Success", value: "50+ Published Apps" },
    ],
    heroImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1600&q=80",
    features: [
      { title: "Responsive Web Applications", description: "Pixel-perfect websites that work flawlessly on any screen size." },
      { title: "iOS & Android Apps", description: "Native and cross-platform mobile apps with smooth performance." },
      { title: "Progressive Web Apps (PWA)", description: "Web apps with native-like experience and offline capabilities." },
      { title: "Cross-platform Development", description: "Single codebase solutions with React Native and Flutter." },
      { title: "Performance Optimization", description: "Fast load times and smooth interactions for better engagement." },
      { title: "Offline-first Architecture", description: "Apps that work reliably even without internet connection." },
    ],
    process: [
      { step: "Platform Strategy", description: "Define the right platforms and technologies for your audience." },
      { step: "UI/UX Design", description: "Create intuitive interfaces optimized for each platform." },
      { step: "Development", description: "Build with modern frameworks and best practices." },
      { step: "Testing Across Devices", description: "Rigorous testing on multiple devices and browsers." },
      { step: "App Store Deployment", description: "Handle submission and approval processes seamlessly." },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80",
      "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&q=80",
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&q=80",
    ],
  },
  "ecommerce": {
    icon: ShoppingCart,
    title: "E-Commerce Solutions",
    subtitle: "Scalable storefronts and marketplaces optimized for conversion.",
    description: "We build e-commerce platforms that drive sales—from custom storefronts to multi-vendor marketplaces with seamless checkout experiences that convert visitors into loyal customers.",
    extendedDescription: "Whether you're launching your first online store or scaling a global marketplace, we engineer e-commerce experiences that maximize conversions and customer lifetime value. Every pixel and every interaction is designed with your revenue in mind.",
    highlights: [
      { label: "Platforms", value: "Shopify, Custom, Headless" },
      { label: "Payment Gateways", value: "Stripe, PayPal, etc." },
      { label: "Avg. Conversion Lift", value: "+35%" },
    ],
    heroImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=80",
    features: [
      { title: "Custom E-commerce Platforms", description: "Tailored online stores built for your unique business model." },
      { title: "Shopify & Headless Commerce", description: "Expert Shopify development and headless CMS integrations." },
      { title: "Payment Gateway Integration", description: "Secure, seamless checkout with multiple payment options." },
      { title: "Inventory Management", description: "Real-time stock tracking and automated reordering systems." },
      { title: "Multi-currency Support", description: "Sell globally with localized pricing and payment methods." },
      { title: "Analytics & Reporting", description: "Data-driven insights to optimize your sales funnel." },
    ],
    process: [
      { step: "Business Analysis", description: "Understand your products, customers, and sales goals." },
      { step: "Platform Selection", description: "Choose the right e-commerce stack for your needs." },
      { step: "Store Development", description: "Build and customize your online store experience." },
      { step: "Payment Setup", description: "Integrate secure payment processing and checkout." },
      { step: "Launch & Optimization", description: "Go live and continuously improve conversions." },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    ],
  },
  "ai-systems": {
    icon: Brain,
    title: "AI & Intelligent Systems",
    subtitle: "AI agents, chatbots, and automation that transform business operations.",
    description: "We develop practical AI solutions that automate workflows, enhance customer interactions, and provide intelligent insights for better decision-making across your organization.",
    extendedDescription: "Our AI solutions are built for real-world impact—not just demos. We focus on practical applications that deliver measurable ROI, from intelligent automation that saves hours of manual work to predictive systems that unlock new business opportunities.",
    highlights: [
      { label: "AI Stack", value: "OpenAI, LangChain, TensorFlow" },
      { label: "Specialties", value: "NLP, Vision, Automation" },
      { label: "Avg. Efficiency Gain", value: "+60%" },
    ],
    heroImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80",
    features: [
      { title: "AI Agent Development", description: "Autonomous agents that handle complex tasks and workflows." },
      { title: "Chatbot Systems", description: "Intelligent conversational interfaces for customer support." },
      { title: "Workflow Automation", description: "AI-powered automation for repetitive business processes." },
      { title: "Natural Language Processing", description: "Extract insights and meaning from text data." },
      { title: "Predictive Analytics", description: "Forecast trends and make data-driven decisions." },
      { title: "Computer Vision Solutions", description: "Image and video analysis for various applications." },
    ],
    process: [
      { step: "Use Case Definition", description: "Identify high-impact opportunities for AI implementation." },
      { step: "Data Assessment", description: "Evaluate data quality and prepare for model training." },
      { step: "Model Development", description: "Build and fine-tune AI models for your specific needs." },
      { step: "Integration", description: "Seamlessly integrate AI into your existing systems." },
      { step: "Monitoring & Improvement", description: "Continuously monitor and enhance AI performance." },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80",
      "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=800&q=80",
    ],
  },
  "design": {
    icon: Palette,
    title: "UI/UX & Website Design",
    subtitle: "User-centered design that balances aesthetics with functionality.",
    description: "We create intuitive, beautiful interfaces that users love. Our design process is grounded in research and focused on delivering measurable results that elevate your brand.",
    extendedDescription: "Great design is invisible—it just works. Our design philosophy combines user research, visual excellence, and strategic thinking to create experiences that feel effortless while driving real business outcomes.",
    highlights: [
      { label: "Tools", value: "Figma, Framer, Adobe CC" },
      { label: "Approach", value: "User-Centered Design" },
      { label: "Deliverables", value: "Prototypes & Systems" },
    ],
    heroImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1600&q=80",
    features: [
      { title: "Product Design & Wireframing", description: "Strategic design thinking from concept to detailed mockups." },
      { title: "Marketing Websites", description: "High-converting landing pages and corporate websites." },
      { title: "Design Systems", description: "Scalable component libraries for consistent brand experience." },
      { title: "User Research", description: "Deep understanding of user needs through research and testing." },
      { title: "Prototyping", description: "Interactive prototypes to validate ideas before development." },
      { title: "Brand Identity", description: "Visual identity that captures your brand essence." },
    ],
    process: [
      { step: "Research & Discovery", description: "Understand users, competitors, and business objectives." },
      { step: "Wireframing", description: "Create information architecture and layout structures." },
      { step: "Visual Design", description: "Develop high-fidelity designs with your brand identity." },
      { step: "Prototyping", description: "Build interactive prototypes for testing and validation." },
      { step: "Handoff & Implementation", description: "Ensure pixel-perfect implementation with developers." },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80",
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80",
      "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&q=80",
    ],
  },
  "hosting": {
    icon: Server,
    title: "Hosting, Maintenance & Support",
    subtitle: "Reliable infrastructure and ongoing support for peace of mind.",
    description: "We provide robust hosting solutions and ongoing maintenance to keep your applications running smoothly, securely, and efficiently around the clock.",
    extendedDescription: "Your application is only as good as its uptime. We offer comprehensive hosting and support packages that let you focus on your business while we handle the infrastructure, security, and performance optimization.",
    highlights: [
      { label: "Cloud Partners", value: "AWS, GCP, Vercel" },
      { label: "Uptime SLA", value: "99.9%" },
      { label: "Response Time", value: "< 2 Hours" },
    ],
    heroImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80",
    features: [
      { title: "Web Hosting & Deployment", description: "Reliable cloud hosting with automated deployment pipelines." },
      { title: "Performance Optimization", description: "Speed improvements and resource optimization." },
      { title: "Security Monitoring", description: "24/7 security monitoring and vulnerability management." },
      { title: "Bug Fixes & Updates", description: "Prompt resolution of issues and regular updates." },
      { title: "SLA-based Support", description: "Guaranteed response times and uptime commitments." },
      { title: "Disaster Recovery", description: "Backup strategies and recovery plans for business continuity." },
    ],
    process: [
      { step: "Infrastructure Setup", description: "Configure optimal hosting environment for your needs." },
      { step: "Deployment Automation", description: "Set up CI/CD pipelines for seamless updates." },
      { step: "Monitoring Setup", description: "Implement comprehensive monitoring and alerting." },
      { step: "Ongoing Maintenance", description: "Regular updates, patches, and optimizations." },
      { step: "Performance Reviews", description: "Periodic assessments and improvement recommendations." },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80",
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80",
    ],
  },
};

const slugs = Object.keys(servicesData) as (keyof typeof servicesData)[];

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const index = slugs.indexOf(slug as keyof typeof servicesData);

  if (index < 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
          <Link to="/services" className="btn-primary"><RollText>View All Services</RollText></Link>
        </div>
      </div>
    );
  }

  const service: ServiceDetailData = servicesData[slugs[index]];
  const nextSlug = slugs[(index + 1) % slugs.length];

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Keyed by slug so moving to the next service starts each section fresh */}
        <ServiceDetailView
          key={slug}
          service={service}
          index={index}
          total={slugs.length}
          next={{ slug: nextSlug, data: servicesData[nextSlug] }}
        />
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetail;
