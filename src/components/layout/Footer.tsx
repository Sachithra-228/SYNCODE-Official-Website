import { Link } from "react-router-dom";
import { ArrowUpRight, Facebook, Instagram, Linkedin } from "lucide-react";
import logo from "@/assets/syncode-logo.png";
import { addressLine, business, formatHours } from "@/lib/site";

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
  </svg>
);

const socialLinks = [
  {
    name: "Facebook",
    href: business.social.facebook,
    icon: Facebook,
  },
  {
    name: "Instagram",
    href: business.social.instagram,
    icon: Instagram,
  },
  {
    name: "LinkedIn",
    href: business.social.linkedin,
    icon: Linkedin,
  },
  {
    name: "TikTok",
    href: business.social.tiktok,
    icon: TikTokIcon,
  },
];

const footerLinks = {
  services: [
    { name: "Custom Software", path: "/services/custom-software" },
    { name: "Web & Mobile", path: "/services/web-mobile" },
    { name: "E-Commerce", path: "/services/ecommerce" },
    { name: "AI Systems", path: "/services/ai-systems" },
    { name: "UI/UX Design", path: "/services/design" },
    { name: "Hosting & Support", path: "/services/hosting" },
  ],
  company: [
    { name: "About Us", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ],
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container-wide section-padding pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center bg-foreground/10">
                <img src={logo} alt="SYNCODE" className="h-full w-full object-cover" />
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
              Engineering software that scales. We build digital products with precision, 
              performance, and purpose.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="text-foreground/60 hover:text-foreground transition-colors duration-300"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-6 tracking-wide uppercase">
              Services
            </h3>
            <ul className="space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground 
                               transition-colors duration-300 link-underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-6 tracking-wide uppercase">
              Company
            </h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground 
                               transition-colors duration-300 link-underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-6 tracking-wide uppercase">
              Get in Touch
            </h3>
            <address className="not-italic text-sm text-muted-foreground leading-relaxed mb-6 space-y-3">
              <p>
                <span className="text-foreground font-medium">{business.name}</span>
                <br />
                {addressLine}
                <br />
                {business.address.country}
              </p>
              <p>
                <a href={business.phoneHref} className="hover:text-foreground transition-colors duration-300">
                  {business.phone}
                </a>
                <br />
                <a href={`mailto:${business.email}`} className="hover:text-foreground transition-colors duration-300">
                  {business.email}
                </a>
              </p>
              <p>
                {business.hours.map((h) => (
                  <span key={h.label} className="block">
                    {`${h.label}: ${formatHours(h)}`}
                  </span>
                ))}
              </p>
            </address>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background 
                         text-sm font-semibold rounded-full transition-all duration-300
                         hover:scale-105 hover:shadow-glow group"
            >
              Start a Conversation
              <ArrowUpRight 
                size={16} 
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row 
                        items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {business.name}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Crafted with precision in modern technologies.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
