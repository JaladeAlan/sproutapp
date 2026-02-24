"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import toast from "react-hot-toast";

const links = [
  { name: "Home",      path: "/dashboard" },
  { name: "Lands",     path: "/lands"     },
  { name: "Wallet",    path: "/wallet"    },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Settings",  path: "/settings"  },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [menuOpen]);

  // Shrink header on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    toast.success("Logged out successfully. See you soon! 👋", {
      duration: 3000, position: "top-center",
    });
    router.push("/login");
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full z-9000 transition-all duration-300"
        style={{
          fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
          background: scrolled
            ? "rgba(10, 26, 20, 0.95)"
            : "rgba(13, 31, 26, 0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 py-3.5">

          {/* Logo */}
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center gap-2.5 group"
            aria-label="Sproutvest Home"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0D1F1A] font-black text-sm transition-transform group-hover:scale-105"
              style={{ background: "linear-gradient(135deg, #C8873A, #E8A850)" }}
            >
              S
            </div>
            <span
              className="text-xl font-bold text-white tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Sproutvest
            </span>
          </Link>

          {/* Desktop nav */}
          {user && (
            <>
              <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
                {links.map((link) => {
                  const active = pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      aria-current={active ? "page" : undefined}
                      className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? "text-white bg-white/10"
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.name}
                      {active && (
                        <span
                          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                          style={{ background: "#C8873A" }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="hidden md:flex items-center gap-3">
                <NotificationBell />
                <button
                  onClick={handleLogout}
                  aria-label="Logout"
                  className="flex items-center gap-1.5 text-sm text-white/40 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-500/10"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>

              {/* Mobile hamburger */}
              <button
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </>
          )}
        </div>
      </header>

      {/* Mobile menu */}
      {user && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-9100 transition-opacity duration-300 ${
              menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className={`fixed top-0 right-0 h-full w-72 md:hidden z-9200 transition-transform duration-300 ease-out ${
              menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            style={{
              background: "#0a1a14",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
            }}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <span
                className="text-lg font-bold text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Menu
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
              >
                <X size={15} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col px-3 py-4 gap-1">
              {links.map((link) => {
                const active = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-white/50 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{link.name}</span>
                    {active
                      ? <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#C8873A" }} />
                      : <ChevronRight size={13} className="text-white/20" />
                    }
                  </Link>
                );
              })}
            </nav>

            {/* Bottom actions */}
            <div className="absolute bottom-0 left-0 right-0 px-3 py-5 border-t border-white/8 flex items-center justify-between">
              <NotificationBell />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 px-4 py-2.5 rounded-xl transition-all font-medium"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
