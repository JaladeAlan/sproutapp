"use client";

import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const appname = process.env.NEXT_PUBLIC_APP_NAME || "Sproutvest";

const footerLinks = [
  {
    heading: "Account",
    links: [
      { label: "Settings", href: "/settings", authOnly: true },
      { label: "Support",  href: "/support"                  },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy",   href: "/privacy" },
      { label: "Terms of Service", href: "/terms"   },
    ],
  },
];

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer
      className="relative border-t border-white/8 overflow-hidden"
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#080f0c" }}
    >
      {/* Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-48 pointer-events-none opacity-20"
        style={{ background: "radial-gradient(ellipse, #C8873A 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 py-10 sm:py-14">

        {/* ── Desktop: 4-col grid ── */}
        <div className="hidden md:grid md:grid-cols-[1.8fr_1fr_1fr_1fr] gap-10 mb-12">
          <BrandBlock user={user} appname={appname} />
          <LinkColumns user={user} />
        </div>

        {/* ── Mobile: brand on top, link cols in 2-col grid below ── */}
        <div className="md:hidden mb-8">
          <div className="mb-8">
            <BrandBlock user={user} appname={appname} />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <LinkColumns user={user} />
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/8">
          <p className="text-xs text-white/20 text-center sm:text-left">
            © {new Date().getFullYear()} {appname}. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/20">crafted by</span>
            <span
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: "1.15rem",
                background: "linear-gradient(90deg, #C8873A, #E8A850, #C8873A)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer 3s linear infinite",
              }}
            >
              La Jade
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function BrandBlock({ user, appname }) {
  return (
    <div>
      <Link href={user ? "/dashboard" : "/"} className="inline-flex items-center gap-2.5 mb-4 group">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0D1F1A] font-black text-sm shrink-0"
          style={{ background: "linear-gradient(135deg, #C8873A, #E8A850)" }}
        >
          S
        </div>
        <span className="text-xl font-bold text-white"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {appname}
        </span>
      </Link>

      <p className="text-white/35 text-sm leading-relaxed mb-5 max-w-xs">
        Nigeria's trusted platform for fractional land investment. Grow your wealth one plot at a time.
      </p>

      <div className="space-y-2">
        {[
          { icon: <MapPin size={12} />, text: "Ibadan, Oyo State, Nigeria"         },
          { icon: <Mail size={12} />,   text: `hello@${appname.toLowerCase()}.com` },
          { icon: <Phone size={12} />,  text: "+234 800 000 0000"                   },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-2 text-white/30 text-xs">
            <span className="text-amber-600/70 shrink-0">{item.icon}</span>
            <span className="truncate">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LinkColumns({ user }) {
  return (
    <>
      {footerLinks.map((col) => {
        const visibleLinks = col.links.filter((l) => !l.authOnly || user);
        return (
          <div key={col.heading}>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/25 mb-3">
              {col.heading}
            </p>
            <ul className="space-y-2.5">
              {visibleLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm text-white/40 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );
}