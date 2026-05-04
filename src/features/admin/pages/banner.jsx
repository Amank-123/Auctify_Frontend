import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image, ArrowLeft, ImagePlus, X, Upload,
  Link2, Type, Check, Loader2, Pencil, Plus,
  Eye, EyeOff, ExternalLink,
} from "lucide-react";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";

/* ── Variants ─────────────────────────────────────────────────── */
const containerV = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
};

/* ── Focused input ────────────────────────────────────────────── */
function SInput({ icon: Icon, prefix, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 border transition-all duration-200 ${
      focused
        ? "bg-white border-violet-400 shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"
        : "bg-slate-50 border-slate-200 hover:border-slate-300"
    }`}>
      {Icon && <Icon size={15} className={`flex-shrink-0 transition-colors ${focused ? "text-violet-500" : "text-slate-400"}`} />}
      {prefix && <span className="text-sm text-slate-400 flex-shrink-0">{prefix}</span>}
      <input
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-300"
      />
    </div>
  );
}

/* ── Field wrapper ────────────────────────────────────────────── */
function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</label>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
const BannerFormPage = () => {
  const { bannerId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(bannerId);
  const fileRef = useRef(null);

  const [form, setForm] = useState({ title: "", link: "", image: null, isActive: true });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  /* fetch on edit */
  useEffect(() => {
    if (!isEdit) return;
    const fetch_ = async () => {
      try {
        const res = await api.get(`${API_ENDPOINTS.BANNERS}/${bannerId}`);
        const data = res.data.data;
        setForm({ title: data.title, link: data.link, image: null, isActive: data.isActive });
        setPreview(data.image);
      } catch (err) { console.error(err); }
    };
    fetch_();
  }, [bannerId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const applyFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setForm((p) => ({ ...p, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleImage = (e) => applyFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    applyFile(e.dataTransfer.files[0]);
  };

  const clearImage = () => {
    setPreview(null);
    setForm((p) => ({ ...p, image: null }));
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("link", form.link);
      formData.append("isActive", form.isActive);
      if (form.image) formData.append("image", form.image);
      if (isEdit) {
        await api.put(`${API_ENDPOINTS.BANNERS}/${bannerId}`, formData);
      } else {
        await api.post(API_ENDPOINTS.BANNERS, formData);
      }
      navigate("/admin/banners");
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        *, body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-[500px] h-[400px] rounded-full bg-sky-200/25 blur-[110px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full bg-violet-100/30 blur-[100px]" />
      </div>

      <motion.div
        variants={containerV}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-2xl mx-auto"
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
          <motion.button
            type="button"
            onClick={() => navigate(-1)}
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors"
          >
            <ArrowLeft size={16} />
          </motion.button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-200 flex-shrink-0">
              {isEdit ? <Pencil size={16} className="text-white" /> : <Plus size={18} className="text-white" strokeWidth={2.5} />}
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {isEdit ? "Update Banner" : "Create Banner"}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEdit ? "Edit your banner details and save changes" : "Configure a new homepage banner"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Card ──────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit}>

            {/* ── Details ───────────────────────────────────── */}
            <div className="px-6 pt-6 pb-5 space-y-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Banner Details
              </p>

              <Field label="Title">
                <SInput
                  icon={Type}
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Summer Sale — Up to 60% Off"
                  required
                />
              </Field>

              <Field label="Redirect Link">
                <SInput
                  icon={Link2}
                  type="text"
                  name="link"
                  value={form.link}
                  onChange={handleChange}
                  placeholder="/auction/summer-sale"
                />
              </Field>
            </div>

            <div className="h-px bg-slate-100 mx-6" />

            {/* ── Image ─────────────────────────────────────── */}
            <div className="px-6 py-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                Banner Image
              </p>

              <AnimatePresence mode="wait">
                {preview ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
                  >
                    {/* Banner preview — wide aspect */}
                    <div className="relative h-40 bg-slate-100">
                      <img
                        src={preview}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                      />
                      {/* Status overlay badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ring-1 backdrop-blur-sm ${
                          form.isActive
                            ? "bg-emerald-50/90 text-emerald-700 ring-emerald-200"
                            : "bg-slate-100/90 text-slate-500 ring-slate-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${form.isActive ? "bg-emerald-400" : "bg-slate-400"}`} />
                          {form.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    {/* Overlay bar */}
                    <div className="bg-white border-t border-slate-100 px-4 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                          <Check size={11} className="text-emerald-600" strokeWidth={2.5} />
                        </div>
                        <span className="text-xs font-semibold text-slate-600">
                          {form.image ? form.image.name : "Existing image"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => fileRef.current?.click()}
                          className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
                        >
                          <Upload size={12} /> Change
                        </motion.button>
                        <div className="w-px h-3.5 bg-slate-200" />
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={clearImage}
                          className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
                        >
                          <X size={12} /> Remove
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="dropzone"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center gap-3 h-40 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                      dragOver
                        ? "border-sky-400 bg-sky-50 scale-[1.01]"
                        : "border-slate-200 bg-slate-50 hover:border-sky-300 hover:bg-sky-50/40"
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${dragOver ? "bg-sky-100" : "bg-white border border-slate-200"}`}>
                      <ImagePlus size={20} className={dragOver ? "text-sky-500" : "text-slate-400"} strokeWidth={1.5} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-600">
                        {dragOver ? "Drop to upload" : "Click or drag image here"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Recommended: 1200 × 400px · PNG, JPG, WEBP
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </div>

            <div className="h-px bg-slate-100 mx-6" />

            {/* ── Visibility toggle ─────────────────────────── */}
            <div className="px-6 py-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                Visibility
              </p>

              <motion.button
                type="button"
                onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all duration-200 ${
                  form.isActive
                    ? "bg-emerald-50 border-emerald-200 hover:bg-emerald-100/70"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100/70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${form.isActive ? "bg-emerald-100" : "bg-slate-200"}`}>
                    {form.isActive
                      ? <Eye size={15} className="text-emerald-600" />
                      : <EyeOff size={15} className="text-slate-500" />
                    }
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${form.isActive ? "text-emerald-700" : "text-slate-600"}`}>
                      {form.isActive ? "Banner is Active" : "Banner is Inactive"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {form.isActive ? "Visible to all users on the homepage" : "Hidden from all users"}
                    </p>
                  </div>
                </div>

                {/* Custom toggle pill */}
                <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${form.isActive ? "bg-emerald-500" : "bg-slate-300"}`}>
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                    style={{ left: form.isActive ? "calc(100% - 1.375rem)" : "0.125rem" }}
                  />
                </div>
              </motion.button>
            </div>

            {/* ── Footer ────────────────────────────────────── */}
            <div className="px-6 pb-6 pt-1 flex items-center gap-3">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-md shadow-sky-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? (
                  <><Loader2 size={15} className="animate-spin" />{isEdit ? "Saving…" : "Creating…"}</>
                ) : (
                  <>{isEdit ? <Check size={15} strokeWidth={2.5} /> : <Plus size={15} strokeWidth={2.5} />}{isEdit ? "Save Changes" : "Create Banner"}</>
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => navigate(-1)}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm transition-all"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* ── Live preview card ─────────────────────────────── */}
        <AnimatePresence>
          {(form.title || preview) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Mini banner preview */}
              {preview && (
                <div className="h-24 bg-slate-100 relative overflow-hidden">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {form.title && (
                    <p className="absolute bottom-2 left-3 text-white text-sm font-bold drop-shadow">
                      {form.title}
                    </p>
                  )}
                </div>
              )}

              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 ring-1 ring-sky-100 flex items-center justify-center flex-shrink-0">
                    <Image size={13} className="text-sky-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Preview</p>
                    <p className="text-sm font-semibold text-slate-800 truncate">{form.title || "Untitled banner"}</p>
                    {form.link && (
                      <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
                        <ExternalLink size={10} /> {form.link}
                      </p>
                    )}
                  </div>
                </div>

                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ring-1 flex-shrink-0 ${
                  form.isActive
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-slate-100 text-slate-500 ring-slate-200"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${form.isActive ? "bg-emerald-400" : "bg-slate-400"}`} />
                  {form.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default BannerFormPage;