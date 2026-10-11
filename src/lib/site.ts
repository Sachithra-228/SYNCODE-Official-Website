// Business details and per-page SEO metadata.
// The business details must match the Google Business Profile exactly.

export const SITE_URL = "https://www.teamsyncode.com";

export const business = {
  name: "Team SYNCODE",
  description:
    "Team SYNCODE is a software engineering studio based in Pannipitiya, Sri Lanka. We design and build websites, web apps, mobile apps, and e-commerce platforms.",
  phone: "+94 77 921 4221",
  phoneHref: "tel:+94779214221",
  whatsapp: "+94 70 291 1223",
  whatsappHref: "https://wa.me/94702911223",
  email: "team.syncode@gmail.com",
  address: {
    street: "1166 Park Road",
    locality: "Pannipitiya",
    postalCode: "10230",
    country: "Sri Lanka",
    countryCode: "LK",
  },
  geo: { latitude: 6.8624524, longitude: 79.9621747 },
  mapsUrl: "https://www.google.com/maps/place/Team+SYNCODE/@6.8624524,79.9621747,17z",
  hours: [
    {
      label: "Mon – Fri",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    { label: "Sat", days: ["Saturday"], opens: "09:00", closes: "13:00" },
    { label: "Sun", days: ["Sunday"], opens: null, closes: null },
  ],
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61580786259033",
    instagram: "https://www.instagram.com/team.syncode/",
    linkedin: "https://www.linkedin.com/in/team-syncode-680938398/",
    tiktok: "https://www.tiktok.com/@syncode4",
  },
  logo: `${SITE_URL}/syncode-logo-round.png`,
  image: `${SITE_URL}/syncode-logo.webp`,
};

// Single strings, so the address reads cleanly in the pre-rendered HTML.
export const addressLine = `${business.address.street}, ${business.address.locality} ${business.address.postalCode}`;
export const localityLine = `${business.address.locality} ${business.address.postalCode}`;

export const formatHours = (h: (typeof business.hours)[number]) =>
  h.opens && h.closes ? `${h.opens.replace(/^0/, "")} – ${h.closes}` : "Closed";

export type PageMeta = {
  title: string;
  description: string;
  noindex?: boolean;
};

// Every public route. This list drives pre-rendering, the sitemap, and the <head> tags.
export const pages: Record<string, PageMeta> = {
  "/": {
    title: "Team SYNCODE | Software Engineering Studio in Sri Lanka",
    description:
      "Team SYNCODE is a software engineering studio in Pannipitiya, Sri Lanka. We design and build websites, web apps, mobile apps, and e-commerce platforms.",
  },
  "/services": {
    title: "Software Development Services | Team SYNCODE",
    description:
      "Custom software, web and mobile apps, e-commerce, AI systems, UI/UX design, and hosting and support from Team SYNCODE in Sri Lanka.",
  },
  "/services/custom-software": {
    title: "Custom Software Development | Team SYNCODE",
    description:
      "Full-stack applications, enterprise platforms, internal tools, and API development tailored to your business needs.",
  },
  "/services/web-mobile": {
    title: "Web & Mobile App Development | Team SYNCODE",
    description:
      "Responsive web applications and iOS and Android apps that deliver native performance on every device.",
  },
  "/services/ecommerce": {
    title: "E-Commerce Solutions | Team SYNCODE",
    description:
      "Custom online stores, Shopify and headless commerce, and payment gateway integration built for conversion.",
  },
  "/services/ai-systems": {
    title: "AI & Intelligent Systems | Team SYNCODE",
    description:
      "AI agents, chatbots, and workflow automation that streamline business operations and support better decisions.",
  },
  "/services/design": {
    title: "UI/UX & Website Design | Team SYNCODE",
    description:
      "User-centered product design, marketing websites, and design systems that balance aesthetics with functionality.",
  },
  "/services/hosting": {
    title: "Hosting, Maintenance & Support | Team SYNCODE",
    description:
      "Web hosting, deployment, security monitoring, and ongoing maintenance to keep your applications running smoothly.",
  },
  "/projects": {
    title: "Our Projects | Team SYNCODE",
    description:
      "Selected websites, platforms, and apps built by Team SYNCODE for automotive, travel, fashion, hospitality, healthcare, and lifestyle brands.",
  },
  "/about": {
    title: "About Us | Team SYNCODE",
    description:
      "Meet Team SYNCODE: the engineers, analysts, and designers behind our web, mobile, and AI solutions, and the values that guide our work.",
  },
  "/contact": {
    title: "Contact Us | Team SYNCODE",
    description:
      "Contact Team SYNCODE at 1166 Park Road, Pannipitiya 10230, Sri Lanka. Call +94 77 921 4221 or email team.syncode@gmail.com. Open Mon–Fri 9:00–18:00, Sat 9:00–13:00.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Team SYNCODE",
    description:
      "How Team SYNCODE collects, uses, and protects personal data submitted through this website, and how to request access or deletion.",
  },
};

export const notFoundMeta: PageMeta = {
  title: "Page Not Found | Team SYNCODE",
  description: "The page you are looking for could not be found.",
  noindex: true,
};

export const normalizePath = (pathname: string) =>
  pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

export const getPageMeta = (pathname: string): PageMeta =>
  pages[normalizePath(pathname)] ?? notFoundMeta;

export const canonicalUrl = (pathname: string) => {
  const path = normalizePath(pathname);
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
};

// LocalBusiness structured data, embedded on every page by scripts/prerender.mjs.
export const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#business`,
  name: business.name,
  description: business.description,
  url: `${SITE_URL}/`,
  logo: business.logo,
  image: business.image,
  telephone: business.phone.replace(/\s/g, ""),
  email: business.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address.street,
    addressLocality: business.address.locality,
    postalCode: business.address.postalCode,
    addressCountry: business.address.countryCode,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: business.geo.latitude,
    longitude: business.geo.longitude,
  },
  hasMap: business.mapsUrl,
  openingHoursSpecification: business.hours
    .filter((h) => h.opens && h.closes)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
  sameAs: Object.values(business.social),
};
