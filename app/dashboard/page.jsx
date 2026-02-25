"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { useEffect, useRef, useState, useCallback } from "react";
import { formatNairaShort } from "../../utils/currency";
import {
  TrendingUp, Wallet, MapPin, Activity,
  ArrowUpRight, LayoutGrid,
} from "lucide-react";

/* ── Helpers ── */
const statusCfg = (status = "") => {
  const s = status?.toLowerCase() || "";
  if (s.includes("success") || s.includes("complete"))
    return { cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" };
  if (s.includes("pending"))
    return { cls: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-400" };
  return { cls: "bg-red-500/10 text-red-400 border-red-500/20", dot: "bg-red-400" };
};

const amountMeta = (type = "") => {
  const t = type?.toLowerCase() || "";
  if (t.includes("deposit") || t.includes("sale")) return { sign: "+", color: "text-emerald-400" };
  if (t.includes("withdraw") || t.includes("purchase") || t.includes("invest"))
    return { sign: "−", color: "text-red-400" };
  return { sign: "", color: "text-white/70" };
};

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString("en-NG", {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "-";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

/* ── Simple fetch hook with stale-while-revalidate behaviour ── */
function useDashboardData(enabled) {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTx, setLoadingTx] = useState(true);

  const fetch = useCallback(async () => {
    if (!enabled) return;
    try {
      const [statsRes, txRes] = await Promise.all([
        api.get("/user/stats"),
        api.get("/transactions/user"),
      ]);
      setStats(statsRes.data?.data || {});
      setTransactions(txRes.data?.data || []);
    } catch (err) {
      if (err.response?.status !== 401) {
        toast.error("Failed to load dashboard data.");
      }
    } finally {
      setLoadingStats(false);
      setLoadingTx(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { stats, transactions, loadingStats, loadingTx, refetch: fetch };
}

/* ── Main ── */
export default function Dashboard() {
  const { user, loading: loadingUser } = useAuth();
  const router = useRouter();

  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("token");
  const { stats, transactions, loadingStats, loadingTx } = useDashboardData(
    !!user && hasToken
  );

  // Welcome toast — only fires once per login session
  useEffect(() => {
    if (!user) return;
    const justLoggedIn = sessionStorage.getItem("justLoggedIn");
    if (justLoggedIn === "1") {
      sessionStorage.removeItem("justLoggedIn");
      toast.success(`Welcome back, ${user.name?.split(" ")[0] || "Investor"}!`, { duration: 3000 });
    }
  }, [user]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loadingUser && !user) router.replace("/login");
  }, [loadingUser, user, router]);

  if (loadingUser || !user) {
    return (
      <div className="min-h-screen bg-[#0D1F1A] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#0D1F1A] relative"
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
    >
      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.03,
        }}
      />
      {/* Glows */}
      <div
        className="fixed top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, #C8873A 0%, transparent 70%)", opacity: 0.1 }}
      />
      <div
        className="fixed bottom-[-20%] left-[-10%] w-[40vw] h-[40vw] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, #2D7A55 0%, transparent 70%)", opacity: 0.08 }}
      />

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-2">Dashboard</p>
            <h1
              className="text-3xl sm:text-4xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {greeting()}, {user?.name?.split(" ")[0] || "Investor"}
            </h1>
            <p className="text-sm mt-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
              {new Date().toLocaleDateString("en-NG", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
          <Link
            href="/lands"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-[#0D1F1A] transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto"
            style={{ background: "linear-gradient(135deg, #C8873A 0%, #E8A850 100%)" }}
          >
            Browse Lands <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loadingStats
            ? [1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 h-32 animate-pulse" />
              ))
            : (
              <>
                <StatCard icon={<Wallet size={18} />}    label="Total Balance"   value={formatNairaShort(stats?.balance)}         full={`₦${Number(stats?.balance ?? 0).toLocaleString()}`}         accent="amber"   />
                <StatCard icon={<TrendingUp size={18} />} label="Current Investment"        value={formatNairaShort(stats?.total_invested)}  full={`₦${Number(stats?.total_invested ?? 0).toLocaleString()}`}  accent="emerald" />
                <StatCard icon={<MapPin size={18} />}     label="Lands with Units Owned"     value={stats?.lands_owned ?? 0}                  sub={`${stats?.units_owned ?? 0} total units`}                     accent="blue"    />
                <StatCard icon={<Activity size={18} />}   label="Total Withdrawn" value={formatNairaShort(stats?.total_withdrawn)} sub={`${stats?.pending_withdrawals ?? 0} pending`}                accent="purple"  />
              </>
            )}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickCard title="Wallet"       desc="Deposit, withdraw & manage funds"  href="/wallet"    cta="Open Wallet"    icon={<Wallet size={20} />}    />
          <QuickCard title="Portfolio"    desc="Track your land investments"       href="/portfolio" cta="View Portfolio"  icon={<LayoutGrid size={20} />} />
          <QuickCard title="Browse Lands" desc="Explore investment opportunities"  href="/lands"     cta="Explore"        icon={<MapPin size={20} />}    />
        </div>

        <TransactionsSection transactions={transactions} loading={loadingTx} />
      </main>
    </div>
  );
}

/* ── Sub-components ── */

function StatCard({ icon, label, value, full, sub, accent }) {
  const accents = {
    amber:   { bg: "bg-amber-500/10",   border: "border-amber-500/20",   icon: "text-amber-500"   },
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: "text-emerald-400" },
    blue:    { bg: "bg-blue-500/10",    border: "border-blue-500/20",    icon: "text-blue-400"    },
    purple:  { bg: "bg-purple-500/10",  border: "border-purple-500/20",  icon: "text-purple-400"  },
  };
  const a = accents[accent] || accents.amber;
  return (
    <div
      className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/8 transition-colors"
    >
      <div className={`w-9 h-9 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center mb-4 ${a.icon}`}>
        {icon}
      </div>
      <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
        {label}
      </p>
      <p className="text-2xl font-bold text-white" title={full}>{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>{sub}</p>}
    </div>
  );
}

function QuickCard({ title, desc, href, cta, icon }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/8 hover:border-white/15 transition-all group block"
    >
      <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-white mb-1 text-sm">{title}</h3>
      <p className="text-xs mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>{desc}</p>
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 group-hover:gap-2.5 transition-all">
        {cta} <ArrowUpRight size={12} />
      </span>
    </Link>
  );
}

function TransactionsSection({ transactions, loading }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="h-5 w-44 rounded mb-5 animate-pulse" style={{ background: "rgba(255,255,255,0.1)" }} />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
          ))}
        </div>
      </div>
    );
  }

  if (!transactions?.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
        <div
          className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center mx-auto mb-4"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <Activity size={22} className="text-white/20" />
        </div>
        <h3 className="font-bold text-white mb-1.5">No transactions yet</h3>
        <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>
          Start investing in land to see your transaction history
        </p>
        <Link
          href="/lands"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-[#0D1F1A]"
          style={{ background: "linear-gradient(135deg, #C8873A 0%, #E8A850 100%)" }}
        >
          Browse Lands <ArrowUpRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div
        className="flex items-center justify-between px-5 py-4 border-b border-white/5"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <div className="flex items-center gap-2.5">
          <Activity size={14} className="text-amber-500" />
          <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
            Recent Transactions
          </h2>
        </div>
        <Link href="/wallet" className="text-xs text-amber-500 hover:text-amber-400 font-semibold transition-colors">
          View all →
        </Link>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {["Type", "Asset", "Amount", "Status", "Date"].map((h) => (
                <th
                  key={h}
                  className={`px-5 py-3 text-xs font-bold uppercase tracking-widest ${h === "Amount" ? "text-right" : "text-left"}`}
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 6).map((tx, idx) => {
              const { sign, color } = amountMeta(tx?.type);
              const { cls, dot } = statusCfg(tx?.status);
              return (
                <tr
                  key={tx?.id ?? idx}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors"
                >
                  <td className="px-5 py-4 font-medium capitalize" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {tx?.type?.replace("_", " ")}
                  </td>
                  <td className="px-5 py-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {tx?.land || "Wallet"}
                  </td>
                  <td className={`px-5 py-4 text-right font-bold tabular-nums ${color}`}>
                    {sign}₦{Number(tx?.amount ?? 0).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${cls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                      {tx?.status || "-"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {formatDate(tx?.date)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        {transactions.slice(0, 5).map((tx, idx) => {
          const { sign, color } = amountMeta(tx?.type);
          const { cls, dot } = statusCfg(tx?.status);
          return (
            <div
              key={tx?.id ?? idx}
              className="px-4 py-4 hover:bg-white/3 transition-colors border-b border-white/5"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm capitalize" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {tx?.type?.replace("_", " ")}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {tx?.land || "Wallet"}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold border capitalize ${cls}`}>
                  <span className={`w-1 h-1 rounded-full ${dot}`} />
                  {tx?.status}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className={`text-lg font-bold tabular-nums ${color}`}>
                  {sign}₦{Number(tx?.amount ?? 0).toLocaleString()}
                </p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                  {formatDate(tx?.date)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}