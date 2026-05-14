import { useEffect, useState } from "react";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";
import { showError, showSuccess } from "@/shared/utils/toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "../constants/auctionVariants";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    ImagePlus,
    Loader2,
    Sparkles,
    Upload,
    X,
} from "lucide-react";

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

    /* ─────────────────────────────────────────────
       FETCH CATEGORIES
    ───────────────────────────────────────────── */
    const fetchCategories = async () => {
        try {
            const res = await api.get("/api/category/get");

            setCategories(res.data.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    /* ─────────────────────────────────────────────
       HANDLE CHANGE
    ───────────────────────────────────────────── */
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    /* ─────────────────────────────────────────────
       FILES
    ───────────────────────────────────────────── */
    const processFiles = (selected) => {
        const validFiles = selected.filter((f) => f.type.startsWith("image/"));

        setFiles(validFiles);

        setPreview(validFiles.map((f) => URL.createObjectURL(f)));
    };

    const handleFileChange = (e) => {
        processFiles(Array.from(e.target.files));
    };

    const handleDrop = (e) => {
        e.preventDefault();

        setDragOver(false);

        processFiles(Array.from(e.dataTransfer.files));
    };

    const removeImage = (index) => {
        const newFiles = files.filter((_, i) => i !== index);

        const newPreviews = preview.filter((_, i) => i !== index);

        setFiles(newFiles);

        setPreview(newPreviews);
    };

    /* ─────────────────────────────────────────────
       SUBMIT
    ───────────────────────────────────────────── */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!files.length) {
            showError("Please upload at least one image");

            return;
        }

        if (form.auctionType === "long" && new Date(form.endTime) <= new Date(form.startTime)) {
            showError("End time must be after start time");

            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            Object.entries(form).forEach(([key, value]) => {
                if (value !== "" && value !== null && value !== undefined) {
                    if (key === "startTime" || key === "endTime") {
                        formData.append(key, new Date(value).toISOString());
                    } else {
                        formData.append(key, value);
                    }
                }
            });

            files.forEach((file) => formData.append("media", file));

            const res = await api.post(API_ENDPOINTS.Auction.CREATE, formData);

            showSuccess("Auction created successfully!");

            navigate(`/auction/${res?.data?.data?._id}`);
        } catch (err) {
            console.log(err.response?.data);

            showError(err.response?.data?.message || "Failed to create auction");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-400";

    const labelClass = "block text-sm font-semibold text-gray-700 mb-2 tracking-wide";

    return (
        <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.16),_transparent_34%),linear-gradient(180deg,_#fffaf5_0%,_#fff_40%,_#fff7ed_100%)] px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12 relative">
            {/* LOADING OVERLAY */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-950/65 backdrop-blur-md flex items-center justify-center px-4"
                    >
                        <motion.div
                            initial={{ scale: 0.94, y: 10, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.94, y: 10, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="w-full max-w-sm rounded-[28px] bg-white shadow-2xl border border-white/70 p-7 sm:p-8 text-center"
                        >
                            <div className="mx-auto w-14 h-14 rounded-full border-4 border-orange-100 border-t-orange-600 animate-spin" />
                            <h2 className="mt-5 text-xl font-bold text-slate-950">
                                Creating Auction
                            </h2>
                            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                                Please wait while everything is being prepared.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mx-auto max-w-3xl">
                {/* TOP ACTION */}
                <button
                    type="button"
                    disabled={loading}
                    onClick={() => navigate("/auction/seller")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition disabled:opacity-50"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Seller Dashboard
                </button>

                {/* HERO */}
                <div className="mt-5 rounded-[32px] border border-white/80 bg-white/85 backdrop-blur-xl shadow-[0_20px_70px_rgba(15,23,42,0.10)] overflow-hidden">
                    <div className="px-5 sm:px-7 lg:px-8 pt-6 sm:pt-7 lg:pt-8 pb-5 sm:pb-6 bg-gradient-to-r from-orange-50 via-white to-amber-50">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-200 flex items-center justify-center shrink-0">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>

                            <div className="min-w-0">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-950 leading-tight">
                                    Create New Auction
                                </h1>
                                <p className="mt-1 text-sm sm:text-base text-slate-500 max-w-xl">
                                    Set up your listing, upload images, and launch it for bidding.
                                </p>
                            </div>
                        </div>

                        {/* STEP BAR */}
                        <div className="mt-7 flex items-center justify-center">
                            <div className="flex items-center">
                                {[1, 2, 3].map((item, index) => {
                                    const active = step === item;
                                    const done = step > item;

                                    return (
                                        <div key={item} className="flex items-center">
                                            {/* STEP */}
                                            <div
                                                className={`relative flex items-center justify-center transition-all duration-300 rounded-full font-bold ${
                                                    active
                                                        ? "w-11 h-11 bg-orange-600 text-white shadow-lg shadow-orange-200 scale-105"
                                                        : done
                                                          ? "w-11 h-11 bg-emerald-600 text-white"
                                                          : "w-11 h-11 bg-white border border-slate-200 text-slate-400"
                                                }`}
                                            >
                                                {done ? (
                                                    <Check className="w-5 h-5" />
                                                ) : (
                                                    <span className="text-sm">{item}</span>
                                                )}
                                            </div>

                                            {/* LINE */}
                                            {index !== 2 && (
                                                <div
                                                    className={`w-10 sm:w-16 h-[2px] transition-all duration-300 ${
                                                        step > item
                                                            ? "bg-emerald-500"
                                                            : "bg-slate-200"
                                                    }`}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="p-5 sm:p-7 lg:p-8">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step-1"
                                    initial={{ opacity: 0, x: 22 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -22 }}
                                    transition={{ duration: 0.28 }}
                                    className="space-y-6"
                                >
                                    <div className="grid gap-5">
                                        <div>
                                            <label className={labelClass}>Auction Title</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                placeholder="Vintage Rolex"
                                                required
                                                disabled={loading}
                                                className={`${inputClass} h-14 rounded-2xl bg-white`}
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass}>Category</label>
                                            <select
                                                name="category"
                                                value={form.category}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                                className={`${inputClass} h-14 rounded-2xl bg-white`}
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((cat) => (
                                                    <option key={cat._id} value={cat._id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className={labelClass}>Description</label>
                                            <textarea
                                                name="description"
                                                value={form.description}
                                                onChange={handleChange}
                                                rows={6}
                                                required
                                                disabled={loading}
                                                className={`${inputClass} min-h-[160px] rounded-2xl bg-white resize-none`}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={() => {
                                            if (
                                                !form.name.trim() ||
                                                !form.description.trim() ||
                                                !form.category
                                            ) {
                                                showError("Please fill all fields");
                                                return;
                                            }
                                            setStep(2);
                                        }}
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-200 hover:shadow-xl transition disabled:opacity-60"
                                    >
                                        Continue
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step-2"
                                    initial={{ opacity: 0, x: 22 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -22 }}
                                    transition={{ duration: 0.28 }}
                                    className="space-y-6"
                                >
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className={labelClass}>Starting Price</label>
                                            <input
                                                type="number"
                                                name="startPrice"
                                                value={form.startPrice}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                                className={`${inputClass} h-14 rounded-2xl bg-white`}
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass}>Auction Type</label>
                                            <select
                                                name="auctionType"
                                                value={form.auctionType}
                                                onChange={handleChange}
                                                disabled={loading}
                                                className={`${inputClass} h-14 rounded-2xl bg-white`}
                                            >
                                                <option value="long">Long Auction</option>
                                                <option value="short">Short Auction</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className={labelClass}>Start Time</label>
                                            <input
                                                type="datetime-local"
                                                name="startTime"
                                                value={form.startTime}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                                className={`${inputClass} h-14 rounded-2xl bg-white`}
                                            />
                                        </div>

                                        {form.auctionType === "long" && (
                                            <div>
                                                <label className={labelClass}>End Time</label>
                                                <input
                                                    type="datetime-local"
                                                    name="endTime"
                                                    value={form.endTime}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={loading}
                                                    className={`${inputClass} h-14 rounded-2xl bg-white`}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            type="button"
                                            disabled={loading}
                                            onClick={() => setStep(1)}
                                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Back
                                        </button>

                                        <button
                                            type="button"
                                            disabled={loading}
                                            onClick={() => setStep(3)}
                                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-200 hover:shadow-xl transition disabled:opacity-60"
                                        >
                                            Continue
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step-3"
                                    initial={{ opacity: 0, x: 22 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -22 }}
                                    transition={{ duration: 0.28 }}
                                    className="space-y-6"
                                >
                                    <label
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setDragOver(true);
                                        }}
                                        onDragLeave={() => setDragOver(false)}
                                        onDrop={handleDrop}
                                        className={`block rounded-[28px] border-2 border-dashed p-6 sm:p-8 text-center transition-all cursor-pointer ${
                                            dragOver
                                                ? "border-orange-500 bg-orange-50/80"
                                                : "border-slate-200 bg-slate-50/40 hover:border-orange-300 hover:bg-orange-50/50"
                                        }`}
                                    >
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            disabled={loading}
                                            className="hidden"
                                        />

                                        <div className="mx-auto w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center">
                                            <Upload className="w-6 h-6 text-orange-600" />
                                        </div>

                                        <p className="mt-4 text-base sm:text-lg font-semibold text-slate-800">
                                            Upload Images
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Drag and drop files here or click to browse
                                        </p>
                                    </label>

                                    {preview.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                                            {preview.map((src, i) => (
                                                <div
                                                    key={src}
                                                    className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm group"
                                                >
                                                    <img
                                                        src={src}
                                                        alt=""
                                                        className="w-full aspect-square object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        disabled={loading}
                                                        onClick={() => removeImage(i)}
                                                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-slate-950/75 text-white flex items-center justify-center opacity-90 group-hover:opacity-100 transition disabled:opacity-60"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            type="button"
                                            disabled={loading}
                                            onClick={() => setStep(2)}
                                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Back
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-200 hover:shadow-xl transition disabled:opacity-60"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Creating Auction...
                                                </>
                                            ) : (
                                                <>
                                                    <ImagePlus className="w-4 h-4" />
                                                    Create Auction
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>
            </div>
        </div>
    );
}
