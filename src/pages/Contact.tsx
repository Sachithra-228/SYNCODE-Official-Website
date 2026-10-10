import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, MapPin, Mail, ArrowUpRight, CheckCircle2 } from "lucide-react";
import emailjs from "@emailjs/browser";
import { Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import { business, formatHours, localityLine } from "@/lib/site";

const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

type FormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const inputClass =
  "w-full px-6 py-4 rounded-2xl bg-card border border-border/50 text-foreground " +
  "placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors duration-300";

const contactCards = [
  {
    icon: Mail,
    label: "Email Us",
    value: business.email,
    sub: "We reply within 24 hours",
    href: `mailto:${business.email}`,
  },
  {
    icon: Phone,
    label: "Call Us",
    value: business.phone,
    sub: "Mon – Fri 9:00 – 18:00, Sat 9:00 – 13:00",
    href: business.phoneHref,
  },
  {
    icon: WhatsAppIcon,
    label: "WhatsApp",
    value: business.whatsapp,
    sub: "Message us anytime",
    href: business.whatsappHref,
  },
  {
    icon: MapPin,
    label: "Our Location",
    value: business.address.street,
    sub: `${localityLine}, ${business.address.country}`,
    href: business.mapsUrl,
  },
];

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // ── 1. Notify SYNCODE team via Web3Forms ──────────────────────────
      const teamRes = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "918e4981-5648-4e5c-b8c3-7410d3dc5f47",
          subject: `New Enquiry from ${formData.name} — SYNCODE Website`,
          from_name: "SYNCODE Contact Form",
          replyto: formData.email,
          "Client Name": formData.name,
          "Client Email": formData.email,
          "Client Phone": formData.phone || "Not provided",
          "Project Details": formData.message,
        }),
      });
      const teamJson = await teamRes.json();
      if (!teamJson.success) throw new Error("team_notify_failed");

      // ── 2. Send branded confirmation email TO the user via EmailJS ────
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_USER_ID,
        {
          to_name: formData.name,
          to_email: formData.email,
          user_message: formData.message,
          user_phone: formData.phone || "Not provided",
          reply_to: "team.syncode@gmail.com",
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again or reach us at team.syncode@gmail.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero */}
        <section className="pt-40 pb-24 md:pt-48 md:pb-32">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-4 block">
                Get in Touch
              </span>
              <h1 className="text-display-xl mb-6">
                Let's Build Something
                <br />
                <span className="gradient-text">Remarkable</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Have a project in mind? We'd love to hear about it. Share your vision
                and let's explore how we can bring it to life together.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Form + Info */}
        <section className="pb-32">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-16">

              {/* Left: Form or Success */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-start gap-6 p-10 rounded-3xl bg-card border border-border/50"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center">
                        <CheckCircle2 size={32} className="text-foreground" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Message Received</h2>
                        <p className="text-muted-foreground leading-relaxed">
                          Thank you,{" "}
                          <span className="text-foreground font-medium">{formData.name}</span>.
                          A confirmation has been sent to{" "}
                          <span className="text-foreground font-medium">{formData.email}</span>.
                          Our team will respond within 24 hours.
                        </p>
                      </div>

                      <div className="w-full border-t border-border/50 pt-6 space-y-3">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-4">
                          What happens next
                        </p>
                        {[
                          "We review your project brief",
                          "Our team prepares a tailored response",
                          "We schedule a discovery call at your convenience",
                        ].map((step, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-foreground/10 text-xs font-bold
                                             flex items-center justify-center text-foreground flex-shrink-0">
                              {i + 1}
                            </span>
                            <span className="text-sm text-muted-foreground">{step}</span>
                          </div>
                        ))}
                      </div>

                      <div className="w-full flex gap-3 pt-2">
                        <a
                          href="https://wa.me/94702911223"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl
                                     bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366]
                                     hover:bg-[#25D366]/20 transition-colors duration-300 text-sm font-medium"
                        >
                          <WhatsAppIcon size={16} />
                          WhatsApp Us
                        </a>
                        <a
                          href="tel:+94779214221"
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl
                                     bg-foreground/5 border border-border/50 text-foreground
                                     hover:bg-foreground/10 transition-colors duration-300 text-sm font-medium"
                        >
                          <Phone size={15} />
                          Call Us
                        </a>
                      </div>

                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({ name: "", email: "", phone: "", message: "" });
                        }}
                        className="text-sm text-muted-foreground hover:text-foreground
                                   transition-colors duration-300 underline underline-offset-4"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                            Full Name <span className="text-red-400">*</span>
                          </label>
                          <input type="text" id="name" name="name" value={formData.name}
                            onChange={handleChange} required placeholder="Your full name"
                            className={inputClass} />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                            Email <span className="text-red-400">*</span>
                          </label>
                          <input type="email" id="email" name="email" value={formData.email}
                            onChange={handleChange} required placeholder="your@email.com"
                            className={inputClass} />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                          Phone / WhatsApp{" "}
                          <span className="text-muted-foreground font-normal">(optional)</span>
                        </label>
                        <input type="tel" id="phone" name="phone" value={formData.phone}
                          onChange={handleChange} placeholder="+1 234 567 8900"
                          className={inputClass} />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                          Message <span className="text-red-400">*</span>
                        </label>
                        <textarea id="message" name="message" value={formData.message}
                          onChange={handleChange} required rows={6}
                          placeholder="Tell us about your project, goals, and timeline..."
                          className={`${inputClass} resize-none`} />
                      </div>

                      {error && (
                        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20
                                       rounded-xl px-4 py-3">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full"
                            />
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            Send Message <Send size={18} />
                          </span>
                        )}
                      </button>

                      <p className="text-xs text-muted-foreground text-center">
                        A confirmation will be sent to your email. We only use your details to respond to
                        your enquiry. See our{" "}
                        <Link to="/privacy-policy" className="underline underline-offset-4 hover:text-foreground">
                          Privacy Policy
                        </Link>
                        .
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Right: Info cards + Map */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-display-sm mb-3">Other Ways to Connect</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Prefer to reach out directly? We're always happy to hear from you.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {contactCards.map(({ icon: Icon, label, value, sub, href }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group flex items-start gap-4 p-5 rounded-2xl bg-card
                                 border border-border/50 hover:border-foreground/30
                                 transition-all duration-300 card-float"
                    >
                      <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center
                                      group-hover:bg-foreground/10 transition-colors duration-300 flex-shrink-0 mt-0.5">
                        <Icon size={20} className="text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-0.5">{label}</h3>
                        <p className="text-sm text-foreground/80 truncate">{value}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                      </div>
                      <ArrowUpRight size={15}
                        className="text-foreground/20 group-hover:text-foreground transition-colors flex-shrink-0 mt-1" />
                    </a>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl bg-card border border-border/50">
                  <address className="not-italic">
                    <h3 className="font-semibold text-sm mb-2">{business.name}</h3>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {business.address.street}
                      <br />
                      {localityLine}
                      <br />
                      {business.address.country}
                    </p>
                  </address>
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Business Hours</h3>
                    <dl className="text-sm text-foreground/80 leading-relaxed">
                      {business.hours.map((h) => (
                        <div key={h.label} className="flex justify-between gap-4">
                          <dt>{h.label}</dt>
                          <dd>{formatHours(h)}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                <div className="rounded-3xl overflow-hidden bg-card border border-border/50" style={{ height: 300 }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0!2d79.9621747!3d6.8624524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25100604ed513:0xd70a0b032be3616f!2sTeam+SYNCODE!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                    width="100%" height="100%"
                    style={{ border: 0, filter: "grayscale(100%) invert(92%) contrast(83%)" }}
                    allowFullScreen loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Team SYNCODE Location"
                  />
                </div>
              </motion.div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
