"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../../../utils/api";
import toast from "react-hot-toast";
import PolygonMapEditor from "../../PolygonMapEditor";
import {
  MapPin, Image, FileText, Layers,
  DollarSign, ArrowLeft, Save, X,
} from "lucide-react";

export default function EditLand() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "", location: "", description: "", size: "",
    price_per_unit_kobo: "", total_units: "",
    lat: "", lng: "", is_available: true, coordinates: null,
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [soldUnits, setSoldUnits] = useState(0);
  const [usePolygon, setUsePolygon] = useState(false);
  const [initialHasPolygon, setInitialHasPolygon] = useState(false);

  useEffect(() => {
    const fetchLand = async () => {
      try {
        const res = await api.get(`/lands/${id}`);
        const land = res.data.data;
        let parsedCoordinates = null;
        if (land.coordinates) {
          try {
            parsedCoordinates = typeof land.coordinates === "string"
              ? JSON.parse(land.coordinates) : land.coordinates;
          } catch { parsedCoordinates = null; }
        }
        const hasPolygon = land.has_polygon || !!parsedCoordinates;
        setInitialHasPolygon(hasPolygon);
        setUsePolygon(hasPolygon);
        setForm({
          title: land.title || "", location: land.location || "",
          description: land.description || "",
          size: land.size?.toString() || "",
          price_per_unit_kobo: land.price_per_unit_kobo?.toString() || "",
          total_units: land.total_units?.toString() || "",
          lat: land.lat?.toString() || "",
          lng: land.lng?.toString() || "",
          is_available: land.is_available ?? true,
          coordinates: parsedCoordinates,
        });
        setSoldUnits(land.units_sold || land.total_units - land.available_units);
        setExistingImages(land.images || []);
      } catch {
        toast.error("Failed to load land");
      } finally {
        setFetching(false);
      }
    };
    fetchLand();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (["size", "price_per_unit_kobo", "total_units", "lat", "lng"].includes(name)) {
      if (!/^-?\d*\.?\d*$/.test(value)) return;
    }
    if (name === "total_units" && value !== "" && parseInt(value) < soldUnits) {
      toast.error(`Cannot be less than sold units (${soldUnits})`); return;
    }
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handlePolygonChange = (polygon) => {
    let validPolygon = polygon;
    if (polygon && !polygon.type) validPolygon = { type: "Polygon", coordinates: polygon.coordinates || polygon };
    setForm({ ...form, coordinates: validPolygon });
  };

  const toggleCoordinateMode = () => {
    if (!usePolygon) {
      if (form.lat || form.lng) {
        if (!window.confirm("Switching to polygon will clear lat/lng. Continue?")) return;
      }
      setForm({ ...form, lat: "", lng: "", coordinates: null });
    } else {
      if (form.coordinates) {
        if (!window.confirm("Switching to point will clear polygon. Continue?")) return;
      }
      setForm({ ...form, lat: "", lng: "", coordinates: null });
    }
    setUsePolygon(!usePolygon);
  };

  const handleImageChange = (e) => {
    const files = [...e.target.files];
    setNewImages(files);
    setNewImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeExistingImage = (imgId) => {
    setRemoveImages((prev) => [...prev, imgId]);
    setExistingImages((prev) => prev.filter((img) => img.id !== imgId));
  };

  const removeNewImage = (i) => {
    setNewImages((prev) => prev.filter((_, idx) => idx !== i));
    setNewImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usePolygon && !form.coordinates) return toast.error("Please draw a polygon on the map");
    if (!usePolygon && (!form.lat || !form.lng)) return toast.error("Please provide latitude and longitude");

    const payload = {
      title: form.title, location: form.location,
      size: parseFloat(form.size) || 0,
      total_units: parseInt(form.total_units) || 0,
      description: form.description,
      is_available: form.is_available ? 1 : 0,
    };

    try {
      setLoading(true);
      const hasImageChanges = newImages.length > 0 || removeImages.length > 0;

      if (hasImageChanges) {
        const formData = new FormData();
        formData.append("_method", "POST");
        Object.entries(payload).forEach(([key, value]) => formData.append(key, value ?? ""));
        if (usePolygon && form.coordinates) {
          const geoJson = typeof form.coordinates === "string" ? JSON.parse(form.coordinates) : form.coordinates;
          formData.append("coordinates", JSON.stringify(geoJson));
        } else if (!usePolygon && form.lat && form.lng) {
          formData.append("lat", parseFloat(form.lat));
          formData.append("lng", parseFloat(form.lng));
        }
        newImages.forEach((img) => formData.append("images[]", img));
        removeImages.forEach((imgId) => formData.append("remove_images[]", imgId));
        await api.post(`/lands/admin/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        const jsonPayload = { ...payload };
        if (usePolygon && form.coordinates) {
          jsonPayload.coordinates = typeof form.coordinates === "string"
            ? JSON.parse(form.coordinates) : form.coordinates;
          delete jsonPayload.lat; delete jsonPayload.lng;
        } else if (!usePolygon && form.lat && form.lng) {
          jsonPayload.lat = parseFloat(form.lat);
          jsonPayload.lng = parseFloat(form.lng);
          delete jsonPayload.coordinates;
        }
        await api.post(`/lands/admin/${id}`, jsonPayload);
      }
      toast.success("Land updated successfully");
      router.push("/admin/lands");
    } catch (err) {
      if (err.response?.data?.errors) {
        Object.values(err.response.data.errors).flat().forEach((e) => toast.error(e));
      } else {
        toast.error(err.response?.data?.message || "Update failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#0D1F1A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#0D1F1A] relative"
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10">

        <Link href="/admin/lands" className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors mb-8">
          <ArrowLeft size={13} /> Back to Lands
        </Link>

        <div className="mb-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-2">Admin Panel</p>
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Edit Land
          </h1>
          <p className="text-white/40 mt-1 text-sm truncate">{form.title}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Basic Info */}
          <FormSection title="Basic Info" icon={<FileText size={15} className="text-amber-500" />}>
            <FormField label="Land Title">
              <DarkInput name="title" value={form.title} onChange={handleChange} required />
            </FormField>
            <FormField label="Location">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                <DarkInput name="location" value={form.location} onChange={handleChange} className="pl-10" required />
              </div>
            </FormField>
            <FormField label="Description">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-white/20 px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
              />
            </FormField>
          </FormSection>

          {/* Pricing & Units */}
          <FormSection title="Pricing & Units" icon={<DollarSign size={15} className="text-amber-500" />}>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Size (sqm)">
                <DarkInput name="size" value={form.size} onChange={handleChange} required />
              </FormField>
              <FormField label="Total Units">
                <DarkInput name="total_units" value={form.total_units} onChange={handleChange} required />
                <p className="text-xs text-white/25 mt-1">Sold: {soldUnits}</p>
              </FormField>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, is_available: !form.is_available })}
                className={`relative w-11 h-6 rounded-full transition-all ${form.is_available ? "bg-emerald-500" : "bg-white/10"}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.is_available ? "left-6" : "left-1"}`} />
              </button>
              <span className="text-sm text-white/60">
                {form.is_available ? "Available for purchase" : "Not available"}
              </span>
            </div>
          </FormSection>

          {/* Coordinates */}
          <FormSection title="Location Coordinates" icon={<Layers size={15} className="text-amber-500" />}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-white/40">
                Mode: <span className="text-white/70 font-semibold">{usePolygon ? "Polygon" : "Point"}</span>
                {initialHasPolygon && <span className="text-white/25 text-xs ml-2">(originally polygon)</span>}
              </p>
              <button
                type="button"
                onClick={toggleCoordinateMode}
                className="text-xs font-semibold text-amber-500 hover:text-amber-400 border border-amber-500/30 hover:border-amber-500/60 px-3 py-1.5 rounded-lg transition-all"
              >
                Switch to {usePolygon ? "Point" : "Polygon"}
              </button>
            </div>

            {!usePolygon ? (
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Latitude">
                  <DarkInput name="lat" value={form.lat} onChange={handleChange} />
                </FormField>
                <FormField label="Longitude">
                  <DarkInput name="lng" value={form.lng} onChange={handleChange} />
                </FormField>
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden border border-white/10">
                <PolygonMapEditor polygon={form.coordinates} onChange={handlePolygonChange} />
              </div>
            )}

            {usePolygon && form.coordinates && (
              <p className="text-xs text-emerald-400 mt-2">
                ✓ Polygon: {Array.isArray(form.coordinates?.coordinates?.[0])
                  ? form.coordinates.coordinates[0].length - 1 : 0} points
              </p>
            )}
          </FormSection>

          {/* Images */}
          <FormSection title="Images" icon={<Image size={15} className="text-amber-500" />}>
            {/* Existing images */}
            {existingImages.length > 0 && (
              <div>
                <p className="text-xs text-white/30 uppercase tracking-widest font-bold mb-2">Current Images</p>
                <div className="grid grid-cols-3 gap-3">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative rounded-xl overflow-hidden aspect-video border border-white/10 group">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img.id)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New images */}
            <label className="flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed border-white/15 hover:border-amber-500/40 bg-white/5 hover:bg-white/[0.07] cursor-pointer transition-all">
              <span className="text-xs text-white/30">+ Add more images</span>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>

            {newImagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {newImagePreviews.map((src, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden aspect-video border border-amber-500/20 group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-1 left-1 text-[10px] bg-amber-500 text-[#0D1F1A] px-1.5 py-0.5 rounded font-bold">NEW</div>
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </FormSection>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-[#0D1F1A] flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #C8873A 0%, #E8A850 100%)" }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#0D1F1A]/40 border-t-[#0D1F1A] rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <><Save size={15} /> Update Land</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function FormSection({ title, icon, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/5 bg-white/5">
        {icon}
        <h3 className="text-sm font-bold text-white/70 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-white/30 mb-2">{label}</label>
      {children}
    </div>
  );
}

function DarkInput({ className = "", ...props }) {
  return (
    <input
      className={`w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-white/20 px-4 py-3 rounded-xl text-sm outline-none transition-all ${className}`}
      {...props}
    />
  );
}