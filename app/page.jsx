import Link from "next/link";
import FaqSection from "./components/FaqSection";
import FeaturedProperties from "./components/FeaturedProperties";
import {
  MapPin, Home, ArrowRight,
  CheckCircle, Shield, Zap, FileCheck, Users, TrendingUp,
  Clock, Award, Star,
} from "lucide-react";

const appname = process.env.NEXT_PUBLIC_APP_NAME || "Sproutvest";
const appurl  = process.env.NEXT_PUBLIC_APP_URL  || "https://yourdomain.com";

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export const metadata = {
  metadataBase: new URL(appurl),
  title: `${appname} — Invest in Verified Land Across Nigeria`,
  description:
    "Join 10,000+ investors securing their financial future through verified land investments across Nigeria. Start with as low as ₦5,000. Safe, transparent, and legally verified.",
  keywords: [
    "land investment Nigeria",
    "buy land Lagos",
    "real estate investment Nigeria",
    "verified land",
    appname,
  ],
  openGraph: {
    title: `${appname} — Invest in Verified Land Across Nigeria`,
    description:
      "Secure your financial future with verified land investments. Start with as low as ₦5,000.",
    url: appurl,
    siteName: appname,
    images: [
      {
        url: `${appurl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${appname} Land Investment Platform`,
      },
    ],
    type: "website",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: `${appname} — Invest in Verified Land Across Nigeria`,
    description: "Secure your financial future with verified land investments.",
    images: [`${appurl}/og-image.jpg`],
  },
  alternates: {
    canonical: appurl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

// ─── Structured Data (JSON-LD) ────────────────────────────────────────────────
function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: appname,
    url: appurl,
    logo: `${appurl}/logo.png`,
    description:
      "Nigeria's trusted platform for verified land investments. Start investing from ₦5,000.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ibadan",
      addressLocality: "Oyo State",
      addressCountry: "NG",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: `hello@${appname.toLowerCase()}.com`,
      contactType: "customer service",
    },
    sameAs: [
      `https://twitter.com/${appname.toLowerCase()}`,
      `https://instagram.com/${appname.toLowerCase()}`,
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Server-side land fetch (ISR) ─────────────────────────────────────────────
async function getLands() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/land`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const data = json?.data || json || [];
    return Array.isArray(data) ? data.slice(0, 6) : [];
  } catch {
    return [];
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function Homepage() {
  const lands = await getLands();

  return (
    <>
      <JsonLd />
      <main className="bg-[#FDFAF5]" style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>

        {/* HERO */}
        <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#0D1F1A]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #C8873A 0%, transparent 70%)" }} />
            <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full opacity-15"
              style={{ background: "radial-gradient(circle, #2D7A55 0%, transparent 70%)" }} />
            <div className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }} />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full mb-10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-sm font-medium">Trusted by 10,000+ Nigerian investors</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-[1.05] tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Invest in Land.
              <br />
              <span style={{ color: "#C8873A" }}>Build Lasting Wealth.</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
              Secure your financial future with legally verified land investments across Nigeria.
              Start with as little as <strong className="text-white/90">₦5,000</strong>.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
              <Link href="/register"
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-[#0D1F1A] transition-all hover:scale-105 active:scale-95 shadow-xl"
                style={{ background: "linear-gradient(135deg, #C8873A 0%, #E8A850 100%)" }}>
                Start Investing Today
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/10 transition-all">
                Sign In
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto border border-white/10 rounded-2xl p-6 bg-white/5 backdrop-blur-sm">
              <StatBox number="10K+" label="Active Investors" />
              <StatBox number="500+" label="Properties Listed" />
              <StatBox number="₦5B+" label="Total Investment" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 80L1440 80L1440 40C1200 0 960 20 720 30C480 40 240 60 0 40V80Z" fill="#FDFAF5" />
            </svg>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-24 px-6 sm:px-12 bg-[#FDFAF5]" aria-labelledby="how-it-works-heading">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-amber-700 mb-3 block">The Process</span>
              <h2 id="how-it-works-heading" className="text-4xl sm:text-5xl font-bold text-[#0D1F1A] mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                How It Works
              </h2>
              <p className="text-[#5C6B63] max-w-xl mx-auto">Start your investment journey in four simple steps</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Browse Lands",   desc: "Explore verified properties with complete documentation and transparent pricing.", icon: <Home size={28} />,       accent: "#C8873A" },
                { step: "02", title: "Select & Invest", desc: "Choose your preferred land and purchase units that fit your budget.",            icon: <CheckCircle size={28} />, accent: "#2D7A55" },
                { step: "03", title: "Secure Payment",  desc: "Pay safely using multiple payment methods with bank-grade encryption.",          icon: <Shield size={28} />,      accent: "#8B5CF6" },
                { step: "04", title: "Track & Grow",    desc: "Monitor your portfolio and watch your investment appreciate over time.",         icon: <TrendingUp size={28} />,  accent: "#C8873A" },
              ].map((s) => (
                <div key={s.step}
                  className="relative bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                    style={{ background: s.accent }}>
                    {s.step}
                  </div>
                  <div className="mt-4 mb-4 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `${s.accent}18`, color: s.accent }}>
                    {s.icon}
                  </div>
                  <h3 className="font-bold text-lg text-[#0D1F1A] mb-2">{s.title}</h3>
                  <p className="text-[#5C6B63] text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PROPERTIES */}
        <section className="py-24 px-6 sm:px-12 bg-[#0D1F1A]" aria-labelledby="properties-heading">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-amber-500 mb-3 block">Handpicked</span>
              <h2 id="properties-heading"
                className="text-4xl sm:text-5xl font-bold text-white mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Featured Properties
              </h2>
              <p className="text-white/50">Prime investment opportunities across Nigeria</p>
            </div>
            <FeaturedProperties lands={lands} />
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="py-24 px-6 sm:px-12 bg-[#FDFAF5]" aria-labelledby="why-us-heading">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-amber-700 mb-3 block">Our Edge</span>
              <h2 id="why-us-heading" className="text-4xl sm:text-5xl font-bold text-[#0D1F1A] mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Why Choose {appname}
              </h2>
              <p className="text-[#5C6B63] max-w-xl mx-auto">Everything you need for a secure and profitable land investment</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Shield size={28} />,   title: "Verified Lands",    desc: "All properties are legally verified with complete documentation.",   accent: "#C8873A" },
                { icon: <Zap size={28} />,      title: "Flexible Payments", desc: "Multiple payment methods. Pay in full or choose installment plans.", accent: "#2D7A55" },
                { icon: <FileCheck size={28} />, title: "Fast Processing",   desc: "Quick documentation and seamless title transfer process.",           accent: "#8B5CF6" },
                { icon: <Users size={28} />,    title: "Expert Support",    desc: "Dedicated team to guide you through every step.",                    accent: "#C8873A" },
              ].map((f) => (
                <div key={f.title}
                  className="bg-white rounded-2xl p-7 border border-stone-100 shadow-sm text-center group hover:shadow-md hover:-translate-y-1 transition-all">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform"
                    style={{ background: `${f.accent}18`, color: f.accent }}>
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-[#0D1F1A] text-lg mb-2">{f.title}</h3>
                  <p className="text-[#5C6B63] text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 px-6 sm:px-12 bg-stone-100" aria-labelledby="testimonials-heading">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-amber-700 mb-3 block">Social Proof</span>
              <h2 id="testimonials-heading" className="text-4xl sm:text-5xl font-bold text-[#0D1F1A] mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                What Our Investors Say
              </h2>
              <p className="text-[#5C6B63]">Join thousands building wealth through land</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Chidi Okonkwo",  role: "Business Owner, Abuja",          text: "I've invested in 3 properties so far and the process was incredibly smooth. The team is transparent and professional.", rating: 5 },
                { name: "Amina Bello",    role: "Software Engineer, Lagos",        text: "The flexible payment plan made it easy for me to start investing. My land value has already appreciated by 15%!", rating: 5 },
                { name: "Tunde Adeyemi", role: "Real Estate Investor, Port Harcourt", text: "Best platform for verified land investments in Nigeria. The documentation process was fast and hassle-free.", rating: 5 },
              ].map((t, i) => (
                <blockquote key={i}
                  className="bg-white rounded-2xl p-7 border border-stone-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex gap-0.5 mb-5">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-[#3D4D43] leading-relaxed mb-6 text-sm italic">"{t.text}"</p>
                  <footer>
                    <p className="font-bold text-[#0D1F1A]">{t.name}</p>
                    <p className="text-[#5C6B63] text-xs mt-0.5">{t.role}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="relative py-28 px-6 sm:px-12 bg-[#0D1F1A] overflow-hidden" aria-labelledby="cta-heading">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] opacity-20 rounded-full blur-3xl"
              style={{ background: "radial-gradient(ellipse, #C8873A 0%, transparent 70%)" }} />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <Award size={44} className="mx-auto mb-6 text-amber-500" />
            <h2 id="cta-heading"
              className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Ready to Build Your Wealth?
            </h2>
            <p className="text-white/50 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              Join over 10,000 smart investors securing their financial future through verified land.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link href="/register"
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-[#0D1F1A] transition-all hover:scale-105 shadow-xl"
                style={{ background: "linear-gradient(135deg, #C8873A 0%, #E8A850 100%)" }}>
                Start Investing Today
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/lands"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/10 transition-all">
                Browse Properties
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
              {[["Verified Properties", CheckCircle], ["Secure Payments", Shield], ["Fast Processing", Clock]].map(([label, Icon]) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={14} className="text-emerald-400" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 px-6 sm:px-12 bg-[#FDFAF5]" aria-labelledby="faq-heading">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-amber-700 mb-3 block">Got Questions?</span>
              <h2 id="faq-heading" className="text-4xl sm:text-5xl font-bold text-[#0D1F1A] mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Frequently Asked Questions
              </h2>
              <p className="text-[#5C6B63]">Everything you need to know about investing with us</p>
            </div>
            <FaqSection />
          </div>
        </section>
      </main>
    </>
  );
}

function StatBox({ number, label }) {
  return (
    <div className="text-center">
      <p className="text-2xl sm:text-3xl font-bold text-white mb-1"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{number}</p>
      <p className="text-xs text-white/40 uppercase tracking-widest">{label}</p>
    </div>
  );
}