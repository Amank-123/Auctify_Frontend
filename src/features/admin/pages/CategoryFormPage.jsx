import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid, ArrowLeft, Upload, X, ImagePlus,
  Check, Loader2, Pencil, Plus,
} from "lucide-react";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";

/* ── Variants ─────────────────────────────────────────────────── */
const containerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

/* ── Focused input wrapper ────────────────────────────────────── */
function InputField({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          {label}
        </label>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

/* ── Styled text input ────────────────────────────────────────── */
function SInput({ className = "", ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={`w-full rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-300 ${
        focused
          ? "bg-white border border-violet-400 shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"
          : "bg-slate-50 border border-slate-200 hover:border-slate-300"
      } ${className}`}
    />
  );
}

/* ── Styled textarea ──────────────────────────────────────────── */
function STextarea({ ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      {...props}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={`w-full rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-all duration-200 resize-none placeholder:text-slate-300 ${
        focused
          ? "bg-white border border-violet-400 shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"
          : "bg-slate-50 border border-slate-200 hover:border-slate-300"
      }`}
    />
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
const CategoryFormPage = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const isEdit = Boolean(categoryId);
  const fileRef = useRef(null);

  const [form, setForm] = useState({ name: "", description: "", image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  /* fetch on edit */
  useEffect(() => {
    if (!isEdit) return;
    const fetchCategory = async () => {
      try {
        const res = await api.get(`${API_ENDPOINTS.CATEGORY}/${categoryId}`);
        const data = res.data.data;
        setForm({ name: data.name || "", description: data.description || "", image: null });
        setPreview(data.image);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategory();
  }, [categoryId, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
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
      formData.append("name", form.name);
      formData.append("description", form.description);
      if (form.image) formData.append("image", form.image);
      if (isEdit) {
        await api.put(`${API_ENDPOINTS.CATEGORY}/${categoryId}`, formData);
      } else {
        await api.post(API_ENDPOINTS.CATEGORY, formData);
      }
      navigate("/admin/categories");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        *, body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-[500px] h-[400px] rounded-full bg-violet-200/25 blur-[110px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full bg-indigo-100/30 blur-[100px]" />
      </div>

      <motion.div
        variants={containerV}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-2xl mx-auto"
      >
        {/* ── Back + Header ──────────────────────────────────── */}
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-200 flex-shrink-0">
              {isEdit ? <Pencil size={16} className="text-white" /> : <Plus size={18} className="text-white" strokeWidth={2.5} />}
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {isEdit ? "Update Category" : "Create Category"}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEdit ? "Edit details and save your changes" : "Fill in the details for a new category"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Card ──────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <form onSubmit={handleSubmit}>

            {/* ── Details section ───────────────────────────── */}
            <div className="px-6 pt-6 pb-5 space-y-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Category Details
              </p>

              <InputField label="Category Name">
                <SInput
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Luxury Watches"
                  required
                />
              </InputField>

              <InputField
                label="Description"
                hint={`${form.description.length} / 300`}
              >
                <STextarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  maxLength={300}
                  placeholder="Briefly describe what this category covers…"
                />
              </InputField>
            </div>

            <div className="h-px bg-slate-100 mx-6" />

            {/* ── Image section ─────────────────────────────── */}
            <div className="px-6 py-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                Category Image
              </p>

              <AnimatePresence mode="wait">
                {preview ? (
                  /* ── Preview state ── */
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
                  >
                    <img
                      src={preview}
                      alt="Category preview"
                      className="w-full h-48 object-cover"
                    />
                    {/* Overlay bar */}
                    <div className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur-sm border-t border-slate-200 px-4 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                          <Check size={11} className="text-emerald-600" strokeWidth={2.5} />
                        </div>
                        <span className="text-xs font-semibold text-slate-600">Image selected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => fileRef.current?.click()}
                          className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                        >
                          <Upload size={12} />
                          Change
                        </motion.button>
                        <div className="w-px h-3.5 bg-slate-200" />
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={clearImage}
                          className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
                        >
                          <X size={12} />
                          Remove
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* ── Drop zone ── */
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
                    className={`relative flex flex-col items-center justify-center gap-3 h-44 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                      dragOver
                        ? "border-violet-400 bg-violet-50 scale-[1.01]"
                        : "border-slate-200 bg-slate-50 hover:border-violet-300 hover:bg-violet-50/50"
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${dragOver ? "bg-violet-100" : "bg-white border border-slate-200"}`}>
                      <ImagePlus size={20} className={dragOver ? "text-violet-500" : "text-slate-400"} strokeWidth={1.5} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-600">
                        {dragOver ? "Drop to upload" : "Click or drag image here"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, WEBP · Max 5MB</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hidden file input */}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </div>

            {/* ── Footer ────────────────────────────────────── */}
            <div className="px-6 pb-6 pt-1 flex items-center gap-3">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    {isEdit ? "Saving Changes…" : "Creating…"}
                  </>
                ) : (
                  <>
                    {isEdit ? <Check size={15} strokeWidth={2.5} /> : <Plus size={15} strokeWidth={2.5} />}
                    {isEdit ? "Save Changes" : "Create Category"}
                  </>
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

        {/* ── Live name pill ────────────────────────────────── */}
        <AnimatePresence>
          {form.name && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm"
            >
              <div className="w-7 h-7 rounded-lg bg-violet-50 ring-1 ring-violet-100 flex items-center justify-center flex-shrink-0">
                <LayoutGrid size={13} className="text-violet-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                  Preview
                </p>
                <p className="text-sm font-semibold text-slate-800 truncate">{form.name}</p>
                {form.description && (
                  <p className="text-xs text-slate-400 truncate mt-0.5">{form.description}</p>
                )}
              </div>
              {preview && (
                <img
                  src={preview}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0 ml-auto"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CategoryFormPage;