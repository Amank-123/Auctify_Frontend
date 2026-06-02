import { useEffect, useState, useRef } from "react";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";
import { showError, showSuccess } from "@/shared/utils/toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Gavel,
    ImagePlus,
    Loader2,
    Tag,
    Clock,
    Upload,
    X,
    DollarSign,
    FileText,
    ChevronDown,
    Shield,
    Star,
    TrendingUp,
    Info,
    Camera,
    AlertCircle,
} from "lucide-react";

const STEPS = [
    { id: 1, label: "Item Details", sub: "Name, category & description", icon: FileText },
    { id: 2, label: "Pricing & Time", sub: "Price, type & schedule", icon: DollarSign },
    { id: 3, label: "Photos", sub: "Upload item images", icon: Camera },
];

const TRUST = [
    { icon: Shield, text: "Secure listing" },
    { icon: Star, text: "Verified platform" },
    { icon: TrendingUp, text: "Live bidding" },
];

const Field = ({ label, hint, children, required }) => (
    <div className="space-y-1.5">
        <div className="flex items-center justify-between">
            <label className="text-[13px] font-semibold text-[#1e2d5a] tracking-wide uppercase">
                {label}
                {required && <span className="text-[#f97316] ml-0.5">*</span>}
            </label>
            {hint && (
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Info className="w-3 h-3" />
                    {hint}
                </span>
            )}
        </div>
        {children}
    </div>
);

const baseInput =
    "w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1a2d6e] focus:ring-4 focus:ring-[#1a2d6e]/8 transition-all duration-200";

export default function CreateAuction() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        name: "",
        description: "",
        startPrice: "",
        startTime: "",
        category: "",
        endTime: "",
        auctionType: "long",
    });
    const [files, setFiles] = useState([]);
    const [preview, setPreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [step, setStep] = useState(1);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/api/category/get");
                setCategories(res.data.data || []);
            } catch (e) {
                //console.log(e);
            }
        })();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const processFiles = (selected) => {
        const valid = selected.filter((f) => f.type.startsWith("image/")).slice(0, 10);
        setFiles(valid);
        setPreview(valid.map((f) => URL.createObjectURL(f)));
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        processFiles(Array.from(e.dataTransfer.files));
    };
    const removeImage = (i) => {
        setFiles(files.filter((_, idx) => idx !== i));
        setPreview(preview.filter((_, idx) => idx !== i));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!files.length) {
            showError("Please upload at least one photo");
            return;
        }
        if (form.auctionType === "long" && new Date(form.endTime) <= new Date(form.startTime)) {
            showError("End time must be after start time");
            return;
        }
        try {
            setLoading(true);
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => {
                if (v !== "" && v !== null && v !== undefined)
                    fd.append(
                        k,
                        k === "startTime" || k === "endTime" ? new Date(v).toISOString() : v,
                    );
            });
            files.forEach((f) => fd.append("media", f));
            const res = await api.post(API_ENDPOINTS.Auction.CREATE, fd);
            showSuccess("Auction created successfully!");
            navigate(`/auction/${res?.data?.data?._id}`);
        } catch (err) {
            showError(err.response?.data?.message || "Failed to create auction");
        } finally {
            setLoading(false);
        }
    };

    const goNext = (required) => {
        if (!required.every((f) => form[f]?.toString().trim())) {
            showError("Please fill all required fields");
            return;
        }
        setStep((s) => s + 1);
    };

    const progressPct = (step / STEPS.length) * 100;

    return (
        <div className="min-h-screen bg-[#f7f8fc] ">
            {/* LOADING OVERLAY */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.96, y: 8 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xs text-center"
                        >
                            <div className="w-16 h-16 mx-auto rounded-full border-[3px] border-slate-100 border-t-[#1a2d6e] animate-spin mb-5" />
                            <p className="text-[15px] font-semibold text-[#1a2d6e]">
                                Creating your auction…
                            </p>
                            <p className="text-[13px] text-slate-400 mt-1">
                                This will only take a moment.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TOP NAV */}
            <div className="bg-white border-b border-slate-100/80 px-4 sm:px-6 lg:px-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="max-w-5xl mx-auto flex items-center justify-between h-14">
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => navigate("/auction/sell")}
                        className="flex items-center gap-1.5 text-[13px] font-medium text-slate-400 hover:text-[#1a2d6e] transition-colors disabled:opacity-40 group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#1a2d6e] flex items-center justify-center shadow-sm">
                            <Gavel className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-[14px] font-bold text-[#1a2d6e] tracking-tight">
                            New Auction
                        </span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-semibold tracking-wide uppercase">
                        Step {step} / {STEPS.length}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
                <div className="grid lg:grid-cols-[1fr_288px] gap-6 lg:gap-8 items-start">
                    {/* MAIN CARD */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        {/* PROGRESS BAR */}
                        <div className="h-[3px] bg-slate-100">
                            <motion.div
                                animate={{ width: `${progressPct}%` }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="h-full bg-[#1a2d6e]"
                            />
                        </div>

                        {/* STEP TABS */}
                        <div className="flex border-b border-slate-100">
                            {STEPS.map((s) => {
                                const active = step === s.id;
                                const done = step > s.id;
                                const Icon = s.icon;
                                return (
                                    <div
                                        key={s.id}
                                        className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 px-3 py-3.5 transition-colors border-b-2 ${
                                            active
                                                ? "border-[#1a2d6e] bg-[#f0f4ff]"
                                                : done
                                                  ? "border-emerald-400 bg-emerald-50/30"
                                                  : "border-transparent"
                                        }`}
                                    >
                                        <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                                active
                                                    ? "bg-[#1a2d6e] text-white"
                                                    : done
                                                      ? "bg-emerald-500 text-white"
                                                      : "bg-slate-100 text-slate-400"
                                            }`}
                                        >
                                            {done ? (
                                                <Check className="w-3 h-3" />
                                            ) : (
                                                <Icon className="w-3 h-3" />
                                            )}
                                        </div>
                                        <div className="hidden sm:block text-left">
                                            <p
                                                className={`text-[12px] font-semibold leading-tight ${
                                                    active
                                                        ? "text-[#1a2d6e]"
                                                        : done
                                                          ? "text-emerald-600"
                                                          : "text-slate-400"
                                                }`}
                                            >
                                                {s.label}
                                            </p>
                                            <p
                                                className={`text-[10px] leading-tight mt-0.5 ${
                                                    active ? "text-[#1a2d6e]/60" : "text-slate-300"
                                                }`}
                                            >
                                                {s.sub}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* STEP HEADING */}
                        <div className="px-6 sm:px-8 pt-7 pb-1">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`hdr-${step}`}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h2 className="text-[22px] font-bold text-[#1a2d6e] tracking-tight">
                                        {STEPS[step - 1].label}
                                    </h2>
                                    <p className="text-[13px] text-slate-400 mt-0.5">
                                        {STEPS[step - 1].sub}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="mx-6 sm:mx-8 border-t border-slate-100 mt-5" />

                        {/* FORM BODY */}
                        <form onSubmit={handleSubmit}>
                            <div className="px-6 sm:px-8 py-6">
                                <AnimatePresence mode="wait">
                                    {/* STEP 1 */}
                                    {step === 1 && (
                                        <motion.div
                                            key="s1"
                                            initial={{ opacity: 0, x: 16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -16 }}
                                            transition={{ duration: 0.22 }}
                                            className="space-y-6"
                                        >
                                            <Field label="Auction Title" required>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    placeholder="e.g. 1965 Vintage Rolex Submariner"
                                                    disabled={loading}
                                                    className={baseInput}
                                                />
                                            </Field>

                                            <Field label="Category" required>
                                                <div className="relative">
                                                    <select
                                                        name="category"
                                                        value={form.category}
                                                        onChange={handleChange}
                                                        disabled={loading}
                                                        className={`${baseInput} appearance-none pr-10 cursor-pointer`}
                                                    >
                                                        <option value="">Select a category…</option>
                                                        {categories.map((c) => (
                                                            <option key={c._id} value={c._id}>
                                                                {c.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                </div>
                                            </Field>

                                            <Field
                                                label="Description"
                                                hint="Be specific & honest"
                                                required
                                            >
                                                <textarea
                                                    name="description"
                                                    value={form.description}
                                                    onChange={handleChange}
                                                    rows={5}
                                                    disabled={loading}
                                                    placeholder="Describe your item — condition, history, notable features, included accessories…"
                                                    className={`${baseInput} h-auto py-3.5 resize-none leading-relaxed`}
                                                />
                                                <div className="flex justify-between mt-1">
                                                    <span className="text-[11px] text-slate-300">
                                                        {form.description.length < 30 &&
                                                        form.description.length > 0 ? (
                                                            <span className="text-amber-400">
                                                                Needs {30 - form.description.length}{" "}
                                                                more chars
                                                            </span>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </span>
                                                    <span className="text-[11px] text-slate-300">
                                                        {form.description.length} chars
                                                    </span>
                                                </div>
                                            </Field>
                                        </motion.div>
                                    )}

                                    {/* STEP 2 */}
                                    {step === 2 && (
                                        <motion.div
                                            key="s2"
                                            initial={{ opacity: 0, x: 16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -16 }}
                                            transition={{ duration: 0.22 }}
                                            className="space-y-6"
                                        >
                                            <div className="grid sm:grid-cols-2 gap-5">
                                                <Field label="Starting Price" required>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-slate-500">
                                                            ₹
                                                        </span>
                                                        <input
                                                            type="number"
                                                            name="startPrice"
                                                            value={form.startPrice}
                                                            onChange={handleChange}
                                                            placeholder="0"
                                                            disabled={loading}
                                                            className={`${baseInput} pl-8`}
                                                        />
                                                    </div>
                                                </Field>

                                                <Field label="Auction Type" required>
                                                    <div className="relative">
                                                        <select
                                                            name="auctionType"
                                                            value={form.auctionType}
                                                            onChange={handleChange}
                                                            disabled={loading}
                                                            className={`${baseInput} appearance-none pr-10 cursor-pointer`}
                                                        >
                                                            <option value="long">
                                                                Long Auction
                                                            </option>
                                                            <option value="short">
                                                                Short Auction
                                                            </option>
                                                        </select>
                                                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    </div>
                                                </Field>
                                            </div>

                                            <div className="flex items-start gap-3 bg-[#f0f4ff] border border-[#c7d4f8] rounded-xl px-4 py-3.5">
                                                <Info className="w-4 h-4 text-[#1a2d6e] mt-0.5 shrink-0" />
                                                <p className="text-[12px] text-[#2a3f8a] leading-relaxed">
                                                    {form.auctionType === "long"
                                                        ? "Long auctions run for a set duration with a defined end time. Great for rare or high-value items."
                                                        : "Short auctions create urgency with a tight schedule. Ideal for quick sales and popular items."}
                                                </p>
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-5">
                                                <Field label="Start Time" required>
                                                    <div className="relative">
                                                        <Clock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <input
                                                            type="datetime-local"
                                                            name="startTime"
                                                            value={form.startTime}
                                                            onChange={handleChange}
                                                            disabled={loading}
                                                            className={`${baseInput} pl-10`}
                                                        />
                                                    </div>
                                                </Field>

                                                {form.auctionType === "long" && (
                                                    <Field label="End Time" required>
                                                        <div className="relative">
                                                            <Clock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                            <input
                                                                type="datetime-local"
                                                                name="endTime"
                                                                value={form.endTime}
                                                                onChange={handleChange}
                                                                disabled={loading}
                                                                className={`${baseInput} pl-10`}
                                                            />
                                                        </div>
                                                    </Field>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 3 */}
                                    {step === 3 && (
                                        <motion.div
                                            key="s3"
                                            initial={{ opacity: 0, x: 16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -16 }}
                                            transition={{ duration: 0.22 }}
                                            className="space-y-5"
                                        >
                                            <label
                                                onDragOver={(e) => {
                                                    e.preventDefault();
                                                    setDragOver(true);
                                                }}
                                                onDragLeave={() => setDragOver(false)}
                                                onDrop={handleDrop}
                                                className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200 ${
                                                    dragOver
                                                        ? "border-[#f97316] bg-orange-50/60"
                                                        : "border-slate-200 bg-slate-50/60 hover:border-[#1a2d6e] hover:bg-[#f0f4ff]/50"
                                                }`}
                                            >
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={(e) =>
                                                        processFiles(Array.from(e.target.files))
                                                    }
                                                    disabled={loading}
                                                    className="hidden"
                                                />
                                                <div
                                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                                                        dragOver
                                                            ? "bg-orange-100"
                                                            : "bg-white border border-slate-200 shadow-sm"
                                                    }`}
                                                >
                                                    <Upload
                                                        className={`w-7 h-7 ${dragOver ? "text-[#f97316]" : "text-[#1a2d6e]"}`}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-semibold text-slate-700">
                                                        Drag & drop photos here
                                                    </p>
                                                    <p className="text-[12px] text-slate-400 mt-1">
                                                        or{" "}
                                                        <span className="text-[#1a2d6e] font-semibold underline underline-offset-2">
                                                            click to browse
                                                        </span>{" "}
                                                        — PNG, JPG, WEBP up to 10 files
                                                    </p>
                                                </div>
                                            </label>

                                            <AnimatePresence>
                                                {preview.length > 0 && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="space-y-3"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                                                                {preview.length} photo
                                                                {preview.length !== 1
                                                                    ? "s"
                                                                    : ""}{" "}
                                                                selected
                                                            </p>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setFiles([]);
                                                                    setPreview([]);
                                                                }}
                                                                className="text-[11px] text-red-400 hover:text-red-600 font-semibold transition-colors"
                                                            >
                                                                Clear all
                                                            </button>
                                                        </div>
                                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                                            {preview.map((src, i) => (
                                                                <motion.div
                                                                    key={src}
                                                                    initial={{
                                                                        opacity: 0,
                                                                        scale: 0.9,
                                                                    }}
                                                                    animate={{
                                                                        opacity: 1,
                                                                        scale: 1,
                                                                    }}
                                                                    className="relative group rounded-xl overflow-hidden aspect-square border border-slate-100 shadow-sm"
                                                                >
                                                                    <img
                                                                        src={src}
                                                                        alt=""
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200" />
                                                                    {i === 0 && (
                                                                        <div className="absolute bottom-0 inset-x-0 bg-[#1a2d6e]/90 py-1 text-center">
                                                                            <span className="text-[9px] font-bold text-white tracking-widest uppercase">
                                                                                Cover
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        disabled={loading}
                                                                        onClick={() =>
                                                                            removeImage(i)
                                                                        }
                                                                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 text-slate-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow hover:bg-red-500 hover:text-white"
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </button>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {preview.length === 0 && (
                                                <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3.5">
                                                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                                    <p className="text-[12px] text-amber-700 leading-relaxed">
                                                        Listings with photos get{" "}
                                                        <strong>3× more bids</strong>. Add at least
                                                        3 clear photos from different angles.
                                                    </p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* ACTION BAR */}
                            <div className="border-t border-slate-100 px-6 sm:px-8 py-5 bg-slate-50/50">
                                <div className="flex gap-3">
                                    {step > 1 && (
                                        <button
                                            type="button"
                                            disabled={loading}
                                            onClick={() => setStep((s) => s - 1)}
                                            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-[13px] font-semibold text-slate-600 hover:bg-white hover:border-slate-300 transition-all shadow-sm disabled:opacity-40"
                                        >
                                            <ArrowLeft className="w-4 h-4" /> Back
                                        </button>
                                    )}

                                    {step < 3 ? (
                                        <button
                                            type="button"
                                            disabled={loading}
                                            onClick={() => {
                                                if (step === 1)
                                                    goNext(["name", "category", "description"]);
                                                else if (step === 2)
                                                    goNext(["startPrice", "startTime"]);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#1a2d6e] hover:bg-[#1e3580] text-white font-semibold text-[13px] py-3 transition-all shadow-md shadow-[#1a2d6e]/25 active:scale-[0.99] disabled:opacity-40"
                                        >
                                            Continue <ArrowRight className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold text-[13px] py-3 transition-all shadow-md shadow-orange-300/40 active:scale-[0.99] disabled:opacity-40"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />{" "}
                                                    Creating Auction…
                                                </>
                                            ) : (
                                                <>
                                                    <Gavel className="w-4 h-4" /> Launch Auction
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-4 lg:sticky lg:top-6">
                        {/* TRUST */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4">
                                Why Auctify
                            </p>
                            <div className="space-y-3.5">
                                {TRUST.map(({ icon: Icon, text }) => (
                                    <div key={text} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#f0f4ff] flex items-center justify-center shrink-0">
                                            <Icon className="w-4 h-4 text-[#1a2d6e]" />
                                        </div>
                                        <span className="text-[13px] text-slate-600 font-medium">
                                            {text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* LIVE SUMMARY */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4">
                                Listing Preview
                            </p>
                            <div className="space-y-3.5">
                                {[
                                    { label: "Title", value: form.name || null },
                                    {
                                        label: "Category",
                                        value:
                                            categories.find((c) => c._id === form.category)?.name ||
                                            null,
                                    },
                                    {
                                        label: "Start Bid",
                                        value: form.startPrice
                                            ? `₹${Number(form.startPrice).toLocaleString("en-IN")}`
                                            : null,
                                        highlight: true,
                                    },
                                    {
                                        label: "Type",
                                        value:
                                            form.auctionType === "long"
                                                ? "Long Auction"
                                                : "Short Auction",
                                        badge: true,
                                    },
                                    {
                                        label: "Photos",
                                        value:
                                            preview.length > 0
                                                ? `${preview.length} photo${preview.length > 1 ? "s" : ""}`
                                                : null,
                                        success: true,
                                    },
                                ].map(({ label, value, highlight, badge, success }) => (
                                    <div
                                        key={label}
                                        className="flex justify-between items-start gap-2"
                                    >
                                        <span className="text-[12px] text-slate-400 shrink-0">
                                            {label}
                                        </span>
                                        {value ? (
                                            badge ? (
                                                <span
                                                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                                        form.auctionType === "long"
                                                            ? "bg-[#f0f4ff] text-[#1a2d6e]"
                                                            : "bg-orange-50 text-[#f97316]"
                                                    }`}
                                                >
                                                    {value}
                                                </span>
                                            ) : (
                                                <span
                                                    className={`text-[12px] font-semibold text-right line-clamp-2 ${
                                                        highlight
                                                            ? "text-[#1a2d6e]"
                                                            : success
                                                              ? "text-emerald-600"
                                                              : "text-slate-700"
                                                    }`}
                                                >
                                                    {value}
                                                </span>
                                            )
                                        ) : (
                                            <span className="text-[11px] text-slate-200 italic">
                                                —
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PRO TIP */}
                        <div className="bg-[#1a2d6e] rounded-2xl p-5">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b87d4] mb-2.5">
                                Pro Tip
                            </p>
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={step}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    className="text-[12px] text-[#a8bcf0] leading-relaxed"
                                >
                                    {step === 1
                                        ? "A clear, specific title with brand, model and year gets up to 40% more views from search."
                                        : step === 2
                                          ? "A lower starting price creates competitive early bidding and often leads to a higher final sale price."
                                          : "Use natural lighting and capture multiple angles. Your cover photo is the first thing bidders see."}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
