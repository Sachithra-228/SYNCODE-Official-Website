import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ArrowDown, CheckCircle, Code, Smartphone, ShoppingCart, Brain, Palette, Server } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { RollText } from "@/components/ui/roll-text";

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

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? servicesData[slug as keyof typeof servicesData] : null;

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
          <Link to="/services" className="btn-primary"><RollText>View All Services</RollText></Link>
        </div>
      </div>
    );
  }

  const IconComponent = service.icon;

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section with Image */}
        <section className="relative min-h-[92vh] w-full overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.1 }}
            className="absolute inset-0"
          >
            <img 
              src={service.heroImage} 
              alt={service.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
          </motion.div>

          <div className="absolute inset-0">
            <div className="container-wide h-full flex flex-col justify-start gap-40 py-10 md:py-14">
              <div className="flex justify-start mt-6">
                <Link 
                  to="/services" 
                  className="inline-flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-white backdrop-blur-md transition hover:bg-black/70"
                >
                  <ArrowLeft size={18} /> Back to Services
                </Link>
              </div>

              <div className="pb-2 md:pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-black/80 backdrop-blur-sm flex items-center justify-center text-white">
                    <IconComponent size={28} />
                  </div>
                </div>
                <h1 className="text-display-lg md:text-display-xl text-white mb-4">{service.title}</h1>
                <p className="text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">{service.subtitle}</p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="absolute bottom-8 md:bottom-10 left-0 right-0 flex justify-center"
          >
            <a
              href="#service-detail-content"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm shadow-lg transition hover:-translate-y-1 hover:bg-black"
              aria-label="Scroll to details"
            >
              <ArrowDown size={22} />
            </a>
          </motion.div>
        </section>

        {/* Description Section */}
        <section id="service-detail-content" className="py-16 md:py-24">
          <div className="container-wide">
            <div className="grid lg:grid-cols-5 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="lg:col-span-3"
              >
                <h2 className="text-display-sm mb-6">Overview</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {service.description}
                </p>
                {service.extendedDescription && (
                  <p className="text-base text-muted-foreground/80 leading-relaxed">
                    {service.extendedDescription}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                viewport={{ once: true }}
                className="lg:col-span-2 space-y-4"
              >
                {service.highlights?.map((highlight, index) => (
                  <div
                    key={index}
                    className="group p-5 rounded-2xl bg-card border border-border/50 transition-all duration-300 hover:border-foreground/30 hover:shadow-lg hover:scale-[1.02] cursor-default"
                  >
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 group-hover:text-foreground/70 transition-colors">
                      {highlight.label}
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {highlight.value}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-wide">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-display-sm mb-12 text-black"
            >
              What We Deliver
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.features.map((feature, index) => (
                <motion.div 
                  key={feature.title} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5, delay: index * 0.1 }} 
                  viewport={{ once: true }} 
                  className="group p-6 md:p-8 rounded-2xl bg-gray-50 border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-black hover:bg-black cursor-default"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <CheckCircle size={22} className="text-black group-hover:text-white mt-0.5 flex-shrink-0 transition-colors duration-300" />
                    <h3 className="text-lg font-semibold text-black group-hover:text-white transition-colors duration-300">{feature.title}</h3>
                  </div>
                  <p className="text-black/70 group-hover:text-white/80 text-sm leading-relaxed pl-9 transition-colors duration-300">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16 md:py-24">
          <div className="container-wide">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-display-sm mb-12"
            >
              Our Work
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-6">
              {service.gallery.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden"
                >
                  <img 
                    src={image} 
                    alt={`${service.title} example ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-24 md:py-32 bg-white">
          <div className="container-wide">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-display-sm mb-16 text-center text-black"
            >
              Our Process
            </motion.h2>
            <div className="grid md:grid-cols-5 gap-6">
              {service.process.map((item, index) => (
                <motion.div 
                  key={item.step} 
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.4, delay: index * 0.1 }} 
                  viewport={{ once: true }} 
                  className="group relative text-center"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-gray-400 bg-transparent text-black flex items-center justify-center text-lg font-bold mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:border-black">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold mb-2 text-black">{item.step}</h3>
                  
                  {/* Hover popup with description */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20 pointer-events-none">
                    <div className="bg-black text-white text-sm leading-relaxed p-4 rounded-xl shadow-xl">
                      <p>{item.description}</p>
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rotate-45 rounded-sm" />
                    </div>
                  </div>
                  
                  {index < service.process.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px bg-gray-300" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container-wide text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-display-md mb-6">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Let's discuss your project requirements and explore how we can help bring your vision to life.
              </p>
              <Link to="/contact" className="btn-primary">
                <RollText>Start a Conversation</RollText> <ArrowUpRight size={18} className="ml-2" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetail;