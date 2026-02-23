"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../../utils/api";
import toast from "react-hot-toast";
import {
  MapPin, Plus, Eye, Pencil, Tag,
  ToggleLeft, ToggleRight, X, TrendingUp,
  CheckCircle, XCircle, Layers,
} from "lucide-react";

const koboToNaira = (kobo) => Number(kobo) / 100;
const nairaToKobo = (naira) => Math.round(Number(naira) * 100);
const formatNaira = (kobo) =>
  koboToNaira(kobo).toLocaleString("en-NG", {
    style: "currency", currency: "NGN",
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });

export default function AdminLands() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedLand, setSelectedLand] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [priceDate, setPriceDate] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchLands = async () => {
    try {
      const res = await api.get("/lands/admin/show");
      setLands(res.data.data);
    } catch {
      toast.error("Failed to load lands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLands(); }, []);

  const toggleLand = async (id, enabled) => {
    try {
      await api.patch(`/lands/admin/${id}/${enabled ? "disable" : "enable"}`);
      toast.success(`Land ${enabled ? "disabled" : "enabled"}`);
      fetchLands();
    } catch {
      toast.error("Action failed");
    }
  };

  const openPriceModal = (land) => {
    setSelectedLand(land);
    setNewPrice(koboToNaira(land.price_per_unit_kobo));
    setPriceDate(new Date().toISOString().split("T")[0]);
    setShowModal(true);
  };

  const handleUpdatePrice = async () => {
    if (!newPrice || !priceDate) { toast.error("Price and date are required"); return; }
    try {
      setUpdating(true);
      await api.patch(`/lands/admin/${selectedLand.id}/price`, {
        price_per_unit_kobo: nairaToKobo(newPrice),
        price_date: priceDate,
      });
      toast.success("Price updated successfully");
      setShowModal(false);
      fetchLands();
    } catch {
      toast.error("Failed to update price");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0D1F1A] relative"
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
    >
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="absolute bottom-0 left-0 w-[35vw] h-[35vw] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #C8873A 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors mb-8">
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-2">Admin Panel</p>
            <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Manage Lands
            </h1>
            <p className="text-white/40 mt-1 text-sm">{lands.length} total properties</p>
          </div>
          <Link
            href="/admin/lands/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[#0D1F1A] text-sm transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #C8873A, #E8A850)" }}
          >
            <Plus size={16} /> Add Land
          </Link>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : lands.length === 0 ? (
          <div className="text-center py-24 border border-white/10 rounded-2xl">
            <MapPin size={40} className="mx-auto mb-4 text-white/10" />
            <p className="text-white/30 mb-6">No lands created yet</p>
            <Link
              href="/admin/lands/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[#0D1F1A] text-sm"
              style={{ background: "linear-gradient(135deg, #C8873A, #E8A850)" }}
            >
              <Plus size={15} /> Create Your First Land
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1fr_1fr_160px] gap-4 px-6 py-3 border-b border-white/10 bg-white/5">
              {["Title", "Location", "Price / Unit", "Units", "Status", "Actions"].map((h) => (
                <span key={h} className="text-xs font-bold uppercase tracking-widest text-white/30">{h}</span>
              ))}
            </div>

            {lands.map((land, i) => (
              <div
                key={land.id}
                className={`grid grid-cols-[2fr_1.2fr_1.2fr_1fr_1fr_160px] gap-4 px-6 py-4 items-center hover:bg-white/5 transition-colors ${
                  i < lands.length - 1 ? "border-b border-white/5" : ""
                }`}
              >
                {/* Title */}
                <Link href={`/lands/${land.id}`} className="group">
                  <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors truncate">
                    {land.title}
                  </p>
                </Link>

                {/* Location */}
                <p className="text-sm text-white/50 flex items-center gap-1.5 truncate">
                  <MapPin size={12} className="shrink-0" />{land.location}
                </p>

                {/* Price */}
                <p className="text-sm font-semibold text-amber-400">
                  {formatNaira(land.price_per_unit_kobo)}
                </p>

                {/* Units */}
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="text-emerald-400 font-semibold">{land.available_units}</span>
                  <span className="text-white/20">/</span>
                  <span className="text-white/40">{land.total_units}</span>
                </div>

                {/* Status */}
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border w-fit ${
                  land.is_available
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : "text-red-400 bg-red-500/10 border-red-500/20"
                }`}>
                  {land.is_available ? <CheckCircle size={11} /> : <XCircle size={11} />}
                  {land.is_available ? "Active" : "Disabled"}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <ActionBtn href={`/lands/${land.id}`} icon={<Eye size={13} />} label="View" color="text-white/40 hover:text-white" />
                  <ActionBtn href={`/admin/lands/${land.id}/edit`} icon={<Pencil size={13} />} label="Edit" color="text-purple-400 hover:text-purple-300" />
                  <button
                    onClick={() => openPriceModal(land)}
                    title="Update Price"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-amber-500/70 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                  >
                    <Tag size={13} />
                  </button>
                  <button
                    onClick={() => toggleLand(land.id, land.is_available)}
                    title={land.is_available ? "Disable" : "Enable"}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      land.is_available
                        ? "text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
                        : "text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-500/10"
                    }`}
                  >
                    {land.is_available ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Modal */}
      {showModal && selectedLand && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0f2820] shadow-2xl overflow-hidden"
            style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
                  <TrendingUp size={17} className="text-amber-500" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-base" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    Update Price
                  </h2>
                  <p className="text-xs text-white/30 mt-0.5 truncate max-w-45">{selectedLand.title}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Current price */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs text-white/30 mb-1">Current Price</p>
                <p className="text-2xl font-bold text-amber-400" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {formatNaira(selectedLand.price_per_unit_kobo)}
                </p>
              </div>

              {/* New price */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
                  New Price (₦)
                </label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  min="0" step="0.01"
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-white/20 px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                  placeholder="e.g. 250000"
                />
              </div>

              {/* Effective date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
                  Effective Date
                </label>
                <input
                  type="date"
                  value={priceDate}
                  onChange={(e) => setPriceDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 text-white px-4 py-3.5 rounded-xl text-sm outline-none transition-all scheme-dark"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white/50 hover:text-white border border-white/10 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePrice}
                  disabled={updating}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-[#0D1F1A] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #C8873A, #E8A850)" }}
                >
                  {updating ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#0D1F1A]/40 border-t-[#0D1F1A] rounded-full animate-spin" />
                      Updating...
                    </span>
                  ) : "Update Price"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionBtn({ href, icon, label, color }) {
  return (
    <Link
      href={href}
      title={label}
      className={`w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all ${color}`}
    >
      {icon}
    </Link>
  );
}