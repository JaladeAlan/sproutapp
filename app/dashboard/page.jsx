"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { useEffect, useRef, useState } from "react";
import {
  TrendingUp, Wallet, MapPin, Activity, ArrowUpRight,
  ArrowDownRight, LayoutGrid,
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
  if (t.includes("deposit") || t.includes("sale"))
    return { sign: "+", color: "text-emerald-400" };
  if (t.includes("withdraw") || t.includes("purchase") || t.includes("invest"))
    return { sign: "−", color: "text-red-400" };
  return { sign: "", color: "text-white/70" };
};

const formatDate = (date) =>
  date ? new Date(date).toLocaleString("en-NG", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";

const formatCurrency = (amount) => {
  const num = Number(amount ?? 0);
  if (num >= 1_000_000) return `₦${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000)     return `₦${(num / 1_000).toFixed(1)}K`;
  return `₦${num.toLocaleString()}`;
};

/* ── Main ── */
export default function Dashboard() {
  const { user, loading: loadingUser } = useAuth();
  const router = useRouter();

  const [stats, setStats]             = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTx, setLoadingTx]     = useState(true);

  const cache          = useRef({ stats: null, transactions: null });
  const hasFetchedRef  = useRef(false);
  const hasToastRef    = useRef(false);

  useEffect(() => {
    if (!hasToastRef.current && user) {
      toast.success(`Welcome back, ${user.name || "User"}!`, { duration: 3000 });
      hasToastRef.current = true;
    }
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!user || !token || hasFetchedRef.current) return;

    if (cache.current.stats)        { setStats(cache.current.stats);               setLoadingStats(false); }
    if (cache.current.transactions) { setTransactions(cache.current.transactions); setLoadingTx(false);    }

    const controller = new AbortController();

    (async () => {
      try {
        if (!cache.current.stats)        setLoadingStats(true);
        if (!cache.current.transactions) setLoadingTx(true);

        const [statsRes, txRes] = await Promise.all([
          api.get("/user/stats",       { signal: controller.signal }),
          api.get("/transactions/user", { signal: controller.signal }),
        ]);

        const statsData = statsRes.data?.data || {};
        const txData    = txRes.data?.data    || [];

        cache.current = { stats: statsData, transactions: txData };
        hasFetchedRef.current = true;
        setStats(statsData);
        setTransactions(txData);
      } catch (err) {
        if (err.name === "CanceledError") return;
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          router.replace("/login");
        } else {
          toast.error("Failed to load dashboard data.");
        }
      } finally {
        setLoadingStats(false);
        setLoadingTx(false);
      }
    })();

    return () => { controller.abort(); hasFetchedRef.current = false; };
  }, [user, router]);

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#0D1F1A] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div
      className="min-h-screen bg-[#0D1F1A] relative"
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
    >
      {/* Dot grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* Ambient glow */}
      <div className="fixed top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, #C8873A 0%, transparent 70%)" }} />
      <div className="fixed bottom-[-20%] left-[-10%] w-[40vw] h-[40vw] rounded-full pointer-events-none opacity-8"
        style={{ background: "radial-gradient(circle, #2D7A55 0%, transparent 70%)" }} />

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-2">Dashboard</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {greeting()}, {user?.name?.split(" ")[0] || "Investor"}
            </h1>
            <p className="text-white/30 text-sm mt-1.5">
              {new Date().toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <Link href="/lands"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-[#0D1F1A] transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto"
            style={{ background: "linear-gradient(135deg, #C8873A 0%, #E8A850 100%)" }}>
            Browse Lands <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loadingStats ? (
            [1,2,3,4].map(i => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 h-32 animate-pulse" />
            ))
          ) : (
            <>
              <StatCard
                icon={<Wallet size={18} />}
                label="Total Balance"
                value={formatCurrency(stats?.balance)}
                full={`₦${Number(stats?.balance ?? 0).toLocaleString()}`}
                accent="amber"
              />
              <StatCard
                icon={<TrendingUp size={18} />}
                label="Invested"
                value={formatCurrency(stats?.total_invested)}
                full={`₦${Number(stats?.total_invested ?? 0).toLocaleString()}`}
                accent="emerald"
              />
              <StatCard
                icon={<MapPin size={18} />}
                label="Lands Owned"
                value={stats?.lands_owned ?? 0}
                sub={`${stats?.units_owned ?? 0} total units`}
                accent="blue"
              />
              <StatCard
                icon={<Activity size={18} />}
                label="Total Withdrawn"
                value={formatCurrency(stats?.total_withdrawn)}
                sub={`${stats?.pending_withdrawals ?? 0} pending`}
                accent="purple"
              />
            </>
          )}
        </div>

        {/* ── Quick actions ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickCard
            title="Wallet" desc="Deposit, withdraw & manage funds"
            href="/wallet" cta="Open Wallet"
            icon={<Wallet size={20} />}
          />
          <QuickCard
            title="Portfolio" desc="Track your land investments"
            href="/portfolio" cta="View Portfolio"
            icon={<LayoutGrid size={20} />}
          />
          <QuickCard
            title="Browse Lands" desc="Explore investment opportunities"
            href="/lands" cta="Explore"
            icon={<MapPin size={20} />}
          />
        </div>

        {/* ── Recent transactions ── */}
        <TransactionsSection transactions={transactions} loading={loadingTx} />
      </main>
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ icon, label, value, full, sub, accent }) {
  const accents = {
    amber:  { bg: "bg-amber-500/10",  border: "border-amber-500/20",  icon: "text-amber-500"  },
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: "text-emerald-400" },
    blue:   { bg: "bg-blue-500/10",   border: "border-blue-500/20",   icon: "text-blue-400"   },
    purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", icon: "text-purple-400" },
  };
  const a = accents[accent] || accents.amber;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/8 transition-colors group">
      <div className={`w-9 h-9 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center mb-4 ${a.icon}`}>
        {icon}
      </div>
      <p className="text-xs text-white/30 font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-white" title={full}>{value}</p>
      {sub && <p className="text-xs text-white/25 mt-1">{sub}</p>}
    </div>
  );
}

/* ── Quick Action Card ── */
function QuickCard({ title, desc, href, cta, icon }) {
  return (
    <Link href={href}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/8 hover:border-white/15 transition-all group block">
      <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-white mb-1 text-sm">{title}</h3>
      <p className="text-xs text-white/30 mb-4 leading-relaxed">{desc}</p>
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 group-hover:gap-2.5 transition-all">
        {cta} <ArrowUpRight size={12} />
      </span>
    </Link>
  );
}

/* ── Transactions Section ── */
function TransactionsSection({ transactions, loading }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="h-5 w-44 bg-white/10 rounded mb-5 animate-pulse" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!transactions?.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
          <Activity size={22} className="text-white/20" />
        </div>
        <h3 className="font-bold text-white mb-1.5">No transactions yet</h3>
        <p className="text-sm text-white/30 mb-6">Start investing in land to see your transaction history</p>
        <Link href="/lands"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-[#0D1F1A]"
          style={{ background: "linear-gradient(135deg, #C8873A 0%, #E8A850 100%)" }}>
          Browse Lands <ArrowUpRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/2">
        <div className="flex items-center gap-2.5">
          <Activity size={14} className="text-amber-500" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/50">Recent Transactions</h2>
        </div>
        <Link href="/wallet" className="text-xs text-amber-500 hover:text-amber-400 font-semibold transition-colors">
          View all →
        </Link>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {["Type", "Asset", "Amount", "Status", "Date"].map(h => (
                <th key={h} className={`px-5 py-3 text-xs font-bold uppercase tracking-widest text-white/25 ${h === "Amount" ? "text-right" : "text-left"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 6).map((tx, idx) => {
              const { sign, color } = amountMeta(tx?.type);
              const { cls, dot }    = statusCfg(tx?.status);
              return (
                <tr key={tx?.id ?? idx} className="border-b border-white/4 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4 font-medium text-white/70 capitalize">
                    {tx?.type?.replace("_", " ")}
                  </td>
                  <td className="px-5 py-4 text-white/40">{tx?.land || "Wallet"}</td>
                  <td className={`px-5 py-4 text-right font-bold tabular-nums ${color}`}>
                    {sign}₦{Number(tx?.amount ?? 0).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${cls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                      {tx?.status || "-"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-white/25 text-xs">{formatDate(tx?.date)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-white/4">
        {transactions.slice(0, 5).map((tx, idx) => {
          const { sign, color } = amountMeta(tx?.type);
          const { cls, dot }    = statusCfg(tx?.status);
          return (
            <div key={tx?.id ?? idx} className="px-4 py-4 hover:bg-white/3 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-white/70 text-sm capitalize">{tx?.type?.replace("_", " ")}</p>
                  <p className="text-xs text-white/30 mt-0.5">{tx?.land || "Wallet"}</p>
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
                <p className="text-xs text-white/20">{formatDate(tx?.date)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}