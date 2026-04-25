import { useState } from "react";
import { api } from "@/shared/services/axios.js";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints.js";
import { showError, showSuccess } from "@/shared/utils/toast.js";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: delay * 0.1, duration: 0.4, ease: "easeOut" },
    }),
};

export default function CreateAuction() {
    const navigate = useNavigate();
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

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const processFiles = (selected) => {
        const validFiles = selected.filter((f) => f.type.startsWith("image/"));
        setFiles(validFiles);
        setPreview(validFiles.map((f) => URL.createObjectURL(f)));
    };

    const handleFileChange = (e) => processFiles(Array.from(e.target.files));

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        processFiles(Array.from(e.dataTransfer.files));
    };

    const removeImage = (index) => {
        setFiles(files.filter((_, i) => i !== index));
        setPreview(preview.filter((_, i) => i !== index));
    };

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
                    formData.append(
                        key,
                        key === "startTime" || key === "endTime"
                            ? new Date(value).toISOString()
                            : value,
                    );
                }
            });
            files.forEach((file) => formData.append("media", file));
            await api.post(API_ENDPOINTS.Auction.CREATE, formData);
            showSuccess("Auction created successfully!");
            navigate("/auction/seller");
        } catch (err) {
            showError(err.response?.data?.message || "Failed to create auction");
        } finally {
            setLoading(false);
        }
    };

    // Auctify brand: navy #1a2744, gold #c9a227, amber #e8b84b
    const inputClass =
        "w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all placeholder:text-gray-400";
    const labelClass = "block text-sm font-semibold text-[#1a2744] mb-2 tracking-wide";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 py-12 px-4">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-amber-100/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-3xl" />
            </div>

            <div className="max-w-2xl mx-auto relative">
                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={() => navigate("/auction/seller")}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a2744] transition mb-8"
                    >
                        ← Back to Seller Dashboard
                    </button>

                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#1a2744] to-[#2d3f6e] rounded-2xl flex items-center justify-center shadow-xl">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-7 h-7"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="#e8b84b"
                                strokeWidth={2.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-[#1a2744] tracking-tight">
                                Create New Auction
                            </h1>
                            <p className="text-gray-500 mt-1">
                                List your item and let collectors bid
                            </p>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="mt-10 flex items-center">
                        {["Item Details", "Pricing & Schedule", "Media Upload"].map((label, i) => (
                            <div key={i} className="flex items-center flex-1 last:flex-none">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-9 h-9 rounded-2xl flex items-center justify-center text-sm font-semibold border-2 transition-all
                                        ${
                                            i + 1 < step
                                                ? "bg-[#c9a227] border-[#c9a227] text-white"
                                                : i + 1 === step
                                                  ? "border-[#1a2744] text-[#1a2744] bg-white"
                                                  : "border-gray-200 text-gray-400 bg-white"
                                        }`}
                                    >
                                        {i + 1 < step ? "✓" : i + 1}
                                    </div>
                                    <span
                                        className={`text-xs font-medium mt-2 text-center ${i + 1 <= step ? "text-[#1a2744]" : "text-gray-400"}`}
                                    >
                                        {label}
                                    </span>
                                </div>
                                {i < 2 && (
                                    <div
                                        className={`flex-1 h-px mx-4 mt-4 transition-all ${i + 1 < step ? "bg-[#c9a227]" : "bg-gray-200"}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/80 border border-gray-100 overflow-hidden">
                    {/* Gold accent bar */}
                    <div className="h-1 bg-gradient-to-r from-[#1a2744] via-[#c9a227] to-[#e8b84b]" />

                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        <AnimatePresence mode="wait">
                            {/* Step 1 */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    transition={{ duration: 0.35 }}
                                    className="space-y-8"
                                >
                                    <motion.div
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="visible"
                                        custom={0}
                                    >
                                        <label className={labelClass}>Auction Title</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Vintage Rolex Submariner 1965 – Excellent Condition"
                                            required
                                            className={inputClass}
                                        />
                                    </motion.div>

                                    <motion.div
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="visible"
                                        custom={1}
                                    >
                                        <label className={labelClass}>Category</label>
                                        <select
                                            name="category"
                                            value={form.category}
                                            onChange={handleChange}
                                            required
                                            className={inputClass}
                                        >
                                            <option value="">Select Category</option>
                                            {[
                                                "electronics",
                                                "fashion",
                                                "jewelry",
                                                "watches",
                                                "vehicles",
                                                "real_estate",
                                                "art",
                                                "collectibles",
                                                "furniture",
                                                "books",
                                                "sports",
                                                "gaming",
                                                "music",
                                                "antiques",
                                                "toys",
                                                "luxury",
                                                "industrial",
                                                "other",
                                            ].map((c) => (
                                                <option key={c} value={c}>
                                                    {c.charAt(0).toUpperCase() +
                                                        c.slice(1).replace("_", " ")}
                                                </option>
                                            ))}
                                        </select>
                                    </motion.div>

                                    <motion.div
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="visible"
                                        custom={2}
                                    >
                                        <label className={labelClass}>Description</label>
                                        <textarea
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            placeholder="Provide detailed information about the item, its condition, history, authenticity..."
                                            rows={6}
                                            required
                                            className={`${inputClass} resize-y min-h-[140px]`}
                                        />
                                    </motion.div>

                                    <motion.button
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="visible"
                                        custom={3}
                                        type="button"
                                        onClick={() => {
                                            if (
                                                !form.name.trim() ||
                                                !form.description.trim() ||
                                                !form.category
                                            ) {
                                                showError("Please fill in all fields");
                                                return;
                                            }
                                            setStep(2);
                                        }}
                                        className="w-full py-4 rounded-2xl font-semibold text-base transition-all active:scale-[0.985] hover:opacity-90"
                                        style={{
                                            background: "linear-gradient(135deg, #1a2744, #2d3f6e)",
                                            color: "#e8b84b",
                                            boxShadow: "0 8px 20px rgba(26,39,68,0.2)",
                                        }}
                                    >
                                        Continue to Pricing →
                                    </motion.button>
                                </motion.div>
                            )}

                            {/* Step 2 */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    className="space-y-8"
                                >
                                    <motion.div
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="visible"
                                        custom={0}
                                    >
                                        <label className={labelClass}>Starting Price (₹)</label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-semibold text-[#c9a227]">
                                                ₹
                                            </span>
                                            <input
                                                type="number"
                                                name="startPrice"
                                                value={form.startPrice}
                                                onChange={handleChange}
                                                placeholder="25000"
                                                min="1"
                                                required
                                                className={`${inputClass} pl-12 text-2xl font-semibold`}
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="visible"
                                        custom={1}
                                    >
                                        <label className={labelClass}>Auction Type</label>
                                        <select
                                            name="auctionType"
                                            value={form.auctionType}
                                            onChange={handleChange}
                                            required
                                            className={inputClass}
                                        >
                                            <option value="long">Long Auction</option>
                                            <option value="short">Short Auction</option>
                                        </select>
                                    </motion.div>

                                    <motion.div
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="visible"
                                        custom={2}
                                    >
                                        <label className={labelClass}>Auction Start Time</label>
                                        <input
                                            type="datetime-local"
                                            name="startTime"
                                            value={form.startTime}
                                            onChange={handleChange}
                                            required
                                            className={inputClass}
                                        />
                                    </motion.div>

                                    <AnimatePresence>
                                        {form.auctionType === "long" && (
                                            <motion.div
                                                key="endTime"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                            >
                                                <label className={labelClass}>
                                                    Auction End Time
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    name="endTime"
                                                    value={form.endTime}
                                                    onChange={handleChange}
                                                    required
                                                    className={inputClass}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex-1 border border-gray-300 hover:bg-gray-50 py-4 rounded-2xl font-medium text-gray-700 transition"
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!form.startPrice || !form.startTime) {
                                                    showError("Please complete all fields");
                                                    return;
                                                }
                                                if (form.auctionType === "long" && !form.endTime) {
                                                    showError(
                                                        "End time is required for long auctions",
                                                    );
                                                    return;
                                                }
                                                setStep(3);
                                            }}
                                            className="flex-1 py-4 rounded-2xl font-semibold transition-all active:scale-[0.985] hover:opacity-90"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, #1a2744, #2d3f6e)",
                                                color: "#e8b84b",
                                                boxShadow: "0 8px 20px rgba(26,39,68,0.2)",
                                            }}
                                        >
                                            Continue to Upload →
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3 */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    className="space-y-8"
                                >
                                    <motion.label
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setDragOver(true);
                                        }}
                                        onDragLeave={() => setDragOver(false)}
                                        onDrop={handleDrop}
                                        className={`block border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer
                                            ${dragOver ? "border-[#c9a227] bg-amber-50" : "border-gray-200 hover:border-[#c9a227] hover:bg-amber-50"}`}
                                    >
                                        <div
                                            className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, #1a274415, #c9a22720)",
                                            }}
                                        >
                                            <svg
                                                className="w-9 h-9"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="#c9a227"
                                                strokeWidth={1.8}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4 16v-4m0 0l4 4m-4-4l4-4m12 0v4m0 0l-4-4m4 4l-4 4"
                                                />
                                            </svg>
                                        </div>
                                        <p className="text-lg font-medium text-[#1a2744]">
                                            Drag & drop images here
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            or click to browse from your device
                                        </p>
                                        <p className="text-xs text-gray-400 mt-3">
                                            PNG, JPG, JPEG • Max 10MB per image
                                        </p>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </motion.label>

                                    {preview.length > 0 && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-3">
                                                Uploaded Images ({preview.length})
                                            </p>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                {preview.map((src, i) => (
                                                    <motion.div
                                                        key={src}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                                                    >
                                                        <img
                                                            src={src}
                                                            alt="preview"
                                                            className="w-full aspect-square object-cover"
                                                        />
                                                        {i === 0 && (
                                                            <div
                                                                className="absolute top-2 left-2 px-3 py-1 text-xs font-semibold text-white rounded-xl"
                                                                style={{ background: "#1a2744" }}
                                                            >
                                                                Cover
                                                            </div>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(i)}
                                                            className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center text-lg shadow transition"
                                                        >
                                                            ×
                                                        </button>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-4 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="flex-1 border border-gray-300 hover:bg-gray-50 py-4 rounded-2xl font-medium text-gray-700 transition"
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading || !files.length}
                                            className="flex-1 py-4 rounded-2xl font-semibold disabled:opacity-60 transition-all flex items-center justify-center gap-3 hover:opacity-90"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, #1a2744, #2d3f6e)",
                                                color: "#e8b84b",
                                                boxShadow: "0 8px 20px rgba(26,39,68,0.2)",
                                            }}
                                        >
                                            {loading ? (
                                                <>
                                                    <svg
                                                        className="animate-spin w-5 h-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8v8z"
                                                        />
                                                    </svg>
                                                    Launching Auction...
                                                </>
                                            ) : (
                                                "Launch Auction Now 🎯"
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>

                <p className="text-center text-gray-400 text-xs mt-8">
                    All auctions are reviewed before going live • Secure bidding platform
                </p>
            </div>
        </div>
    );
}
