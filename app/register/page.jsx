"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Gift, CheckCircle, AlertCircle } from "lucide-react";
import api from "../../utils/api";

const appname = process.env.NEXT_PUBLIC_APP_NAME || "Sproutvest";

export default function Register() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    referral_code: "",
  });
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused]         = useState(false);
  const [showReferral, setShowReferral] = useState(false);

  const router       = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      setForm((prev) => ({ ...prev, referral_code: refCode }));
      setShowReferral(true);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const passwordChecks = [
    { test: /.{8,}/,      label: "At least 8 characters"  },
    { test: /[A-Z]/,      label: "One uppercase letter"   },
    { test: /[a-z]/,      label: "One lowercase letter"   },
    { test: /\d/,         label: "One number"             },
    { test: /[@$!%*?&#]/, label: "One special character"  },
  ];

  const passedChecks    = passwordChecks.filter((c) => c.test.test(form.password)).length;
  const strengthColors  = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"];
  const strengthText    = ["Too weak", "Weak", "Fair", "Good", "Strong"];

  const passwordsMatch     = form.password && form.password_confirmation && form.password === form.password_confirmation;
  const passwordsDontMatch = form.password_confirmation && !passwordsMatch;
  const isFormValid        = passedChecks === passwordChecks.length && passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = { ...form };
    if (!payload.referral_code?.trim()) delete payload.referral_code;

    try {
      await api.post("/register", payload);
      toast.success("Account created! Please verify your email.");
      localStorage.setItem("pending_email", form.email);
      router.push("/verify-email");
    } catch (err) {
      if (err.response?.status === 422) {
        const errors = err.response.data?.errors;
        if (errors) {
          // Collect all validation messages into the inline banner
          const messages = Object.values(errors).flat();
          setError(messages.join(" · "));
        } else {
          setError("Validation failed. Please check your input.");
        }
      } else {
        const msg = err.response?.data?.message || err.response?.data?.error || "Registration failed.";
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0D1F1A] flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
    >
      {/* Background glows */}
      <div className="absolute top-[-15%] right-[-10%] w-[55vw] h-[55vw] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #C8873A 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-15%] left-[-10%] w-[45vw] h-[45vw] rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #2D7A55 0%, transparent 70%)" }} />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-bold text-white inline-block"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {appname.slice(0, -4)}
              <span style={{ color: "#C8873A" }}>{appname.slice(-4)}</span>
            </h1>
          </Link>
          <p className="text-white/40 mt-2 text-sm">Start building your land portfolio today</p>
        </div>

        {/* Trust badges */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {["Verified Platform", "Secure Payments", "10K+ Investors"].map((badge) => (
            <div key={badge} className="flex items-center gap-1.5 text-xs text-white/30">
              <CheckCircle size={11} className="text-emerald-500" />
              <span>{badge}</span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 shadow-2xl">

          <h2 className="text-2xl font-bold text-white mb-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Create Account
          </h2>
          <p className="text-white/40 text-sm mb-8">Join thousands of smart Nigerian investors</p>

          {/* Inline error banner */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-start gap-2.5">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  id="name" name="name" value={form.name} onChange={handleChange}
                  placeholder="John Doe" autoComplete="name"
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 text-white placeholder-white/20 pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  id="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" type="email" autoComplete="email"
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 text-white placeholder-white/20 pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  id="password" name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 text-white placeholder-white/20 pl-11 pr-12 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength bar */}
              {form.password && (
                <div className="mt-2.5">
                  <div className="flex gap-1 mb-1.5">
                    {passwordChecks.map((_, i) => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: i < passedChecks ? strengthColors[passedChecks - 1] : "rgba(255,255,255,0.1)" }} />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: passedChecks > 0 ? strengthColors[passedChecks - 1] : "rgba(255,255,255,0.3)" }}>
                    {strengthText[passedChecks - 1] || "Enter a password"}
                  </p>
                </div>
              )}

              {/* Rules checklist */}
              <AnimatePresence>
                {form.password && focused && (
                  <motion.ul
                    className="mt-3 space-y-1.5 bg-white/5 border border-white/10 rounded-xl p-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {passwordChecks.map((check, i) => {
                      const passed = check.test.test(form.password);
                      return (
                        <li key={i} className={`flex items-center gap-2 text-xs transition-colors ${passed ? "text-emerald-400" : "text-white/30"}`}>
                          <span>{passed ? "✓" : "○"}</span>
                          <span>{check.label}</span>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="password_confirmation" className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  id="password_confirmation" name="password_confirmation"
                  value={form.password_confirmation} onChange={handleChange}
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`w-full bg-white/5 border text-white placeholder-white/20 pl-11 pr-12 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${
                    passwordsDontMatch ? "border-red-500/50" : "border-white/10 hover:border-white/20"
                  }`}
                  required
                />
                {passwordsMatch && (
                  <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400" />
                )}
              </div>
              {passwordsDontMatch && (
                <p className="text-xs text-red-400 mt-1.5">Passwords do not match</p>
              )}
            </div>

            {/* Referral Code */}
            <div>
              {!showReferral ? (
                <button
                  type="button"
                  onClick={() => setShowReferral(true)}
                  className="flex items-center gap-1.5 text-xs text-amber-500/70 hover:text-amber-400 transition-colors"
                >
                  <Gift size={13} />
                  Have a referral code?
                </button>
              ) : (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label htmlFor="referral_code" className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                      Referral Code <span className="normal-case font-normal text-white/25">(optional)</span>
                    </label>
                    <div className="relative">
                      <Gift className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                      <input
                        id="referral_code" name="referral_code"
                        value={form.referral_code} onChange={handleChange}
                        placeholder="e.g. ABC12345" autoComplete="off"
                        className="w-full bg-white/5 border border-white/10 hover:border-white/20 text-white placeholder-white/20 pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all uppercase tracking-widest"
                        maxLength={8}
                      />
                    </div>
                    <p className="text-xs text-white/25 mt-1.5">Get 10% off your first purchase</p>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full py-4 rounded-xl font-bold text-[#0D1F1A] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
              style={{ background: "linear-gradient(135deg, #C8873A 0%, #E8A850 100%)" }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                <><span>Create Account</span><ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/20 text-xs">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <p className="text-center text-sm text-white/40">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-500 hover:text-amber-400 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-white/20 mt-6 px-4">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-white/40 transition-colors">Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" className="underline hover:text-white/40 transition-colors">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}