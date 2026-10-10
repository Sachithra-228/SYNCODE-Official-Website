import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import { addressLine, business } from "@/lib/site";

const LAST_UPDATED = "10 October 2026";

const { address } = business;
const postalAddress = `${addressLine}, ${address.country}`;

const linkClass = "text-foreground underline underline-offset-4 hover:text-foreground/80";

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="space-y-4">
    <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
    {children}
  </section>
);

const List = ({ children }: { children: ReactNode }) => (
  <ul className="list-disc space-y-2 pl-6">{children}</ul>
);

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <section className="pt-40 pb-12 md:pt-48 md:pb-16">
          <div className="container-wide">
            <div className="max-w-4xl">
              <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-4 block">
                Legal
              </span>
              <h1 className="text-display-xl mb-6">Privacy Policy</h1>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                How {business.name} collects, uses, and protects your personal data, and how
                you can ask us to access, correct, or delete it.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
            </div>
          </div>
        </section>

        <section className="pb-32">
          <div className="container-wide">
            <div className="max-w-3xl space-y-12 text-muted-foreground leading-relaxed">
              <Section title="1. Who we are">
                <p>
                  {business.name} is a software engineering studio located at {postalAddress}. We
                  are the controller of the personal data described in this policy. This policy
                  is written with reference to Sri Lanka&apos;s Personal Data Protection Act,
                  No. 9 of 2022 (the &quot;PDPA&quot;).
                </p>
                <p>
                  For any privacy question or request, email{" "}
                  <a href={`mailto:${business.email}`} className={linkClass}>{business.email}</a>{" "}
                  or call <a href={business.phoneHref} className={linkClass}>{business.phone}</a>.
                </p>
              </Section>

              <Section title="2. What we collect">
                <p>We only collect personal data that you choose to give us or that is needed to deliver this website.</p>
                <List>
                  <li>
                    <strong className="text-foreground">Contact form.</strong> Your full name, email
                    address, phone or WhatsApp number (optional), and the message you write.
                  </li>
                  <li>
                    <strong className="text-foreground">Direct contact.</strong> If you email, call, or
                    message us on WhatsApp, we receive your contact details and whatever you tell us.
                  </li>
                  <li>
                    <strong className="text-foreground">Technical data.</strong> Our hosting provider
                    automatically records standard server logs such as IP address, browser type,
                    the pages requested, and the time of the request.
                  </li>
                </List>
                <p>
                  We do not use analytics or advertising trackers on this website, and we do not
                  knowingly collect sensitive categories of personal data. Please do not include
                  such information in your message.
                </p>
              </Section>

              <Section title="3. How we use it">
                <List>
                  <li>To reply to your enquiry and send you a confirmation that we received it.</li>
                  <li>To understand your project and prepare a proposal or quotation.</li>
                  <li>To deliver our services and manage our relationship if you become a client.</li>
                  <li>To keep the website secure and working properly.</li>
                </List>
                <p>
                  We rely on your consent (given when you submit the form or contact us), on steps
                  taken at your request before entering into a contract, and on our legitimate
                  interest in running and securing our business. We do not sell your personal
                  data, and we do not use it for marketing unless you ask us to.
                </p>
              </Section>

              <Section title="4. Who we share it with">
                <p>
                  We share personal data only with service providers that help us operate this
                  website and respond to you:
                </p>
                <List>
                  <li><strong className="text-foreground">Web3Forms</strong>, which delivers contact form submissions to our inbox.</li>
                  <li><strong className="text-foreground">EmailJS</strong>, which sends the confirmation email to the address you provide.</li>
                  <li><strong className="text-foreground">Google</strong>, which provides our email inbox and the map embedded on the Contact page.</li>
                  <li><strong className="text-foreground">Vercel</strong>, which hosts this website.</li>
                  <li><strong className="text-foreground">WhatsApp (Meta)</strong>, if you choose to message us there.</li>
                </List>
                <p>
                  Some pages load images, 3D content, or scripts directly from third parties
                  (Unsplash, Spline, and unpkg). Your browser connects to those services to fetch
                  the content, so they receive your IP address. Some of these providers are
                  located outside Sri Lanka, which means your data may be processed in other
                  countries. We may also disclose personal data where the law requires it.
                </p>
              </Section>

              <Section title="5. Cookies">
                <p>
                  This website does not set cookies for analytics or advertising. The Google Map
                  embedded on the Contact page is provided by Google and may set its own cookies
                  under Google&apos;s privacy policy.
                </p>
              </Section>

              <Section title="6. How long we keep it">
                <p>
                  We keep enquiries for up to 24 months after our last contact with you, so that
                  we can follow up and keep a record of our conversation. If you become a client,
                  we keep project and billing records for as long as needed to provide the service
                  and to meet legal and accounting obligations. After that we delete the data or
                  make it anonymous.
                </p>
              </Section>

              <Section title="7. Your rights and how to request deletion">
                <p>Under the PDPA you have the right to:</p>
                <List>
                  <li>ask for a copy of the personal data we hold about you;</li>
                  <li>ask us to correct or complete inaccurate data;</li>
                  <li>ask us to delete your personal data;</li>
                  <li>withdraw your consent or object to further processing; and</li>
                  <li>ask for a review of any decision made solely by automated means (we do not make such decisions).</li>
                </List>
                <p>
                  To make a request, including a request to delete your data, email{" "}
                  <a href={`mailto:${business.email}?subject=Personal%20data%20request`} className={linkClass}>
                    {business.email}
                  </a>{" "}
                  from the address you used to contact us and tell us what you would like us to do.
                  We may ask you to confirm your identity. We will respond within 21 working days.
                  There is no charge for making a request.
                </p>
                <p>
                  If you are not satisfied with our response, you may complain to the Data
                  Protection Authority of Sri Lanka.
                </p>
              </Section>

              <Section title="8. Security">
                <p>
                  This website is served over HTTPS, and access to enquiries is limited to the team
                  members who need it. No method of transmission or storage is completely secure,
                  but we take reasonable steps to protect your data and will notify you and the
                  authority of a data breach where the law requires it.
                </p>
              </Section>

              <Section title="9. Children">
                <p>
                  This website is intended for businesses and professionals. It is not directed at
                  children, and we do not knowingly collect personal data from them.
                </p>
              </Section>

              <Section title="10. Changes to this policy">
                <p>
                  We may update this policy from time to time. The latest version will always be
                  on this page, with the date it was last updated shown at the top.
                </p>
              </Section>

              <Section title="11. Contact us">
                <address className="not-italic">
                  <span className="text-foreground font-medium">{business.name}</span>
                  <br />
                  {addressLine}
                  <br />
                  {address.country}
                  <br />
                  Phone: <a href={business.phoneHref} className={linkClass}>{business.phone}</a>
                  <br />
                  Email: <a href={`mailto:${business.email}`} className={linkClass}>{business.email}</a>
                </address>
                <p>
                  You can also reach us through the{" "}
                  <Link to="/contact" className={linkClass}>Contact page</Link>.
                </p>
              </Section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
