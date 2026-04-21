import { useState } from "react";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";
import { showError, showSuccess } from "@/shared/utils/toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateAuction() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        description: "",
        startPrice: "",
        startTime: "",
        category: "",
    });
    const [files, setFiles] = useState([]);
    const [preview, setPreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [step, setStep] = useState(1);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!files.length) {
            showError("Please upload at least one image");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            Object.keys(form).forEach((key) => formData.append(key, form[key]));
            files.forEach((file) => formData.append("media", file));

            await api.post(API_ENDPOINTS.Auction.CREATE, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            showSuccess("Auction created successfully!");
            navigate("/auction/seller");
        } catch (err) {
            showError(err.response?.data?.message || "Failed to create auction");
        } finally {
            setLoading(false);
        }
    };

    // Animation Variants
    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: (i = 0) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" },
        }),
    };

    const inputClass =
        "w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-400";

    const labelClass = "block text-sm font-semibold text-gray-700 mb-2 tracking-wide";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 py-12 px-4">
            {/* Subtle Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-orange-100/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-3xl" />
            </div>

            <div className="max-w-2xl mx-auto relative">
                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={() => navigate("/auction/seller")}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition mb-8"
                    >
                        ← Back to Seller Dashboard
                    </button>

                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-200">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-7 h-7 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                                Create New Auction
                            </h1>
                            <p className="text-gray-500 mt-1">
                                List your item and let collectors bid
                            </p>
                        </div>
                    </div>

                    {/* Professional Progress Steps */}
                    <div className="mt-10 flex items-center">
                        {["Item Details", "Pricing & Schedule", "Media Upload"].map((label, i) => (
                            <div key={i} className="flex items-center flex-1 last:flex-none">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-9 h-9 rounded-2xl flex items-center justify-center text-sm font-semibold border-2 transition-all
                    ${
                        i + 1 < step
                            ? "bg-orange-600 border-orange-600 text-white"
                            : i + 1 === step
                              ? "border-orange-600 text-orange-600 bg-white"
                              : "border-gray-200 text-gray-400 bg-white"
                    }`}
                                    >
                                        {i + 1 < step ? "✓" : i + 1}
                                    </div>
                                    <span
                                        className={`text-xs font-medium mt-2 text-center transition-colors ${i + 1 <= step ? "text-gray-700" : "text-gray-400"}`}
                                    >
                                        {label}
                                    </span>
                                </div>
                                {i < 2 && (
                                    <div
                                        className={`flex-1 h-px mx-4 mt-4 transition-all ${i + 1 < step ? "bg-orange-500" : "bg-gray-200"}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/80 border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Item Details */}
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
                                        custom={2}
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
                                            <option value="electronics">Electronics</option>
                                            <option value="fashion">Fashion</option>
                                            <option value="jewelry">Jewelry</option>
                                            <option value="watches">Watches</option>
                                            <option value="vehicles">Vehicles</option>
                                            <option value="real_estate">Real Estate</option>
                                            <option value="art">Art</option>
                                            <option value="collectibles">Collectibles</option>
                                            <option value="furniture">Furniture</option>
                                            <option value="books">Books</option>
                                            <option value="sports">Sports</option>
                                            <option value="gaming">Gaming</option>
                                            <option value="music">Music</option>
                                            <option value="antiques">Antiques</option>
                                            <option value="toys">Toys</option>
                                            <option value="luxury">Luxury</option>
                                            <option value="industrial">Industrial</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </motion.div>

                                    <motion.div
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="visible"
                                        custom={1}
                                    >
                                        <label className={labelClass}>Description</label>
                                        <textarea
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            placeholder="Provide detailed information about the item, its condition, history, authenticity, and any notable features..."
                                            rows={6}
                                            required
                                            className={`${inputClass} resize-y min-h-[140px]`}
                                        />
                                    </motion.div>

                                    <motion.button
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="visible"
                                        custom={2}
                                        type="button"
                                        onClick={() => {
                                            if (!form.name.trim() || !form.description.trim()) {
                                                showError("Please fill in all fields");
                                                return;
                                            }
                                            setStep(2);
                                        }}
                                        className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-4 rounded-2xl font-semibold text-base shadow-lg shadow-orange-200 hover:shadow-xl transition-all active:scale-[0.985]"
                                    >
                                        Continue to Pricing →
                                    </motion.button>
                                </motion.div>
                            )}

                            {/* Step 2: Pricing & Time */}
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
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-gray-400 font-light">
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
                                                setStep(3);
                                            }}
                                            className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white py-4 rounded-2xl font-semibold shadow-lg shadow-orange-200 hover:shadow-xl transition-all active:scale-[0.985]"
                                        >
                                            Continue to Upload →
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Image Upload */}
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
                      ${
                          dragOver
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                      }`}
                                    >
                                        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                                            <svg
                                                className="w-9 h-9 text-orange-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.8}
                                                    d="M4 16v-4m0 0l4 4m-4-4l4-4m12 0v4m0 0l-4-4m4 4l-4 4"
                                                />
                                            </svg>
                                        </div>
                                        <p className="text-lg font-medium text-gray-700">
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
                                                        className="relative group rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                                                    >
                                                        <img
                                                            src={src}
                                                            alt="preview"
                                                            className="w-full aspect-square object-cover"
                                                        />
                                                        {i === 0 && (
                                                            <div className="absolute top-2 left-2 px-3 py-1 text-xs font-semibold bg-orange-600 text-white rounded-xl">
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
                                            className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white py-4 rounded-2xl font-semibold shadow-lg shadow-orange-200 hover:shadow-xl disabled:opacity-70 transition-all flex items-center justify-center gap-3"
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
