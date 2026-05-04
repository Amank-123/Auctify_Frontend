import { useState } from "react";
import { Megaphone, Send, Loader2, Sparkles, Radio, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";

/* ── Notification types ───────────────────────────────────────── */
const types = [
  {
    value: "sponsored",
    label: "Sponsored",
    icon: Sparkles,
    desc: "Paid promotional content",
    activeBg: "bg-violet-50",
    activeBorder: "border-violet-300",
    activeText: "text-violet-700",
    activeIcon: "text-violet-500",
    activeDot: "bg-violet-400",
  },
  {
    value: "system",
    label: "System",
    icon: Radio,
    desc: "Platform-wide announcements",
    activeBg: "bg-sky-50",
    activeBorder: "border-sky-300",
    activeText: "text-sky-700",
    activeIcon: "text-sky-500",
    activeDot: "bg-sky-400",
  },
  {
    value: "endingSoon",
    label: "Ending Soon",
    icon: Clock,
    desc: "Urgency & deadline alerts",
    activeBg: "bg-amber-50",
    activeBorder: "border-amber-300",
    activeText: "text-amber-700",
    activeIcon: "text-amber-500",
    activeDot: "bg-amber-400",
  },
];

/* ── Animation variants ───────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

/* ── Reusable field ───────────────────────────────────────────── */
function Field({ label, hint, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-slate-600">{label}</label>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

/* ── Styled input ─────────────────────────────────────────────── */
function StyledInput({ className = "", ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={`w-full rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-300 ${
        focused
          ? "bg-white border border-violet-400 shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
          : "bg-slate-50 border border-slate-200 hover:border-slate-300"
      } ${className}`}
    />
  );
}

/* ── Styled textarea ──────────────────────────────────────────── */
function StyledTextarea({ charCount, maxLength, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <textarea
        {...props}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all duration-200 resize-none placeholder:text-slate-300 ${
          focused
            ? "bg-white border border-violet-400 shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
            : "bg-slate-50 border border-slate-200 hover:border-slate-300"
        }`}
      />
      <span className={`absolute bottom-2.5 right-3 text-xs font-mono transition-colors ${charCount > maxLength * 0.85 ? "text-amber-400" : "text-slate-300"}`}>
        {charCount}/{maxLength}
      </span>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function BroadcastNotificationPage() {
  const [formData, setFormData] = useState({
    type: "sponsored",
    title: "",
    message: "",
    image: "",
    ctaLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSuccess("");
      setError("");
      const res = await api.post(API_ENDPOINTS.Notification.BROADCAST_NOTIFICATION, formData);
      setSuccess(`Broadcast sent to ${res.data.data} users successfully.`);
      setFormData({ type: "sponsored", title: "", message: "", image: "", ctaLink: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send broadcast notification.");
    } finally {
      setLoading(false);
    }
  };

  const activeType = types.find((t) => t.value === formData.type);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');
        *, body { font-family: 'DM Sans', sans-serif; }
        .mono { font-family: 'DM Mono', monospace; }
      `}</style>

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/3 w-[500px] h-[400px] rounded-full bg-violet-200/30 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full bg-sky-200/20 blur-[90px]" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-2xl mx-auto"
      >
        {/* ── Page Header ───────────────────────────────────── */}
        <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200 flex-shrink-0">
            <Megaphone size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Broadcast Notification
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Send a message to all verified users on the platform
            </p>
          </div>
        </motion.div>

        {/* ── Card ──────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <form onSubmit={handleSubmit}>

            {/* ── Section: Type ──────────────────────────────── */}
            <div className="px-6 pt-6 pb-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                Notification Type
              </p>
              <div className="grid grid-cols-3 gap-3">
                {types.map((t) => {
                  const Icon = t.icon;
                  const isActive = formData.type === t.value;
                  return (
                    <motion.button
                      key={t.value}
                      type="button"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 320, damping: 20 }}
                      onClick={() => setFormData((p) => ({ ...p, type: t.value }))}
                      className={`relative flex flex-col items-start gap-1.5 p-3.5 rounded-xl border text-left transition-all duration-200 ${
                        isActive
                          ? `${t.activeBg} ${t.activeBorder} shadow-sm`
                          : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      {/* Active dot */}
                      {isActive && (
                        <motion.span
                          layoutId="typeDot"
                          className={`absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full ${t.activeDot}`}
                        />
                      )}
                      <Icon
                        size={16}
                        className={isActive ? t.activeIcon : "text-slate-400"}
                        strokeWidth={1.8}
                      />
                      <div>
                        <p className={`text-xs font-bold ${isActive ? t.activeText : "text-slate-600"}`}>
                          {t.label}
                        </p>
                        <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{t.desc}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-slate-100 mx-6" />

            {/* ── Section: Content ──────────────────────────── */}
            <div className="px-6 py-5 space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Content
              </p>

              <Field label="Title">
                <StyledInput
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="🔥 Premium Watch Auction Live Now"
                  required
                />
              </Field>

              <Field label="Message" hint={`${formData.message.length} / 280`}>
                <StyledTextarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Bid on Rolex, Omega and luxury timepieces before listings close tonight."
                  required
                  rows={4}
                  maxLength={280}
                  charCount={formData.message.length}
                />
              </Field>
            </div>

            <div className="h-px bg-slate-100 mx-6" />

            {/* ── Section: Delivery ─────────────────────────── */}
            <div className="px-6 py-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                Delivery Options
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Image URL">
                  <StyledInput
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://…"
                  />
                </Field>
                <Field label="CTA Link">
                  <StyledInput
                    type="text"
                    name="ctaLink"
                    value={formData.ctaLink}
                    onChange={handleChange}
                    placeholder="/category/watches"
                  />
                </Field>
              </div>
            </div>

            {/* ── Alerts ────────────────────────────────────── */}
            <AnimatePresence>
              {(success || error) && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6"
                >
                  {success && (
                    <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700">
                      <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                      <span>{success}</span>
                    </div>
                  )}
                  {error && (
                    <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-600">
                      <AlertCircle size={15} className="mt-0.5 flex-shrink-0 text-rose-400" />
                      <span>{error}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Footer / Submit ────────────────────────────── */}
            <div className="px-6 pt-4 pb-6">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.01, y: -1 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Sending Broadcast…
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Send Broadcast
                  </>
                )}
              </motion.button>

              <p className="text-xs text-slate-400 text-center mt-3">
                This will send to{" "}
                <span className="font-semibold text-slate-600">all verified users</span>.
                This action cannot be undone.
              </p>
            </div>

          </form>
        </motion.div>

        {/* ── Preview pill ──────────────────────────────────── */}
        <AnimatePresence>
          {formData.title && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 bg-white border border-slate-200 rounded-2xl px-4 py-3.5 shadow-sm flex items-start gap-3"
            >
              <div className={`w-8 h-8 rounded-xl ${activeType.activeBg} flex items-center justify-center flex-shrink-0 ring-1 ${activeType.activeBorder}`}>
                {(() => { const Icon = activeType.icon; return <Icon size={14} className={activeType.activeIcon} />; })()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-bold text-slate-800 truncate">{formData.title || "Notification preview"}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${activeType.activeBg} ${activeType.activeText}`}>
                    {activeType.label}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {formData.message || "Your message will appear here…"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}