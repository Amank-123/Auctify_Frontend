import { useEffect, useState } from "react";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";
import { showError, showSuccess } from "@/shared/utils/toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "../constants/auctionVariants";

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
        const validFiles = selected.filter((f) =>
            f.type.startsWith("image/")
        );

        setFiles(validFiles);

        setPreview(
            validFiles.map((f) =>
                URL.createObjectURL(f)
            )
        );
    };

    const handleFileChange = (e) => {
        processFiles(Array.from(e.target.files));
    };

    const handleDrop = (e) => {
        e.preventDefault();

        setDragOver(false);

        processFiles(
            Array.from(e.dataTransfer.files)
        );
    };

    const removeImage = (index) => {
        const newFiles = files.filter(
            (_, i) => i !== index
        );

        const newPreviews = preview.filter(
            (_, i) => i !== index
        );

        setFiles(newFiles);

        setPreview(newPreviews);
    };

    /* ─────────────────────────────────────────────
       SUBMIT
    ───────────────────────────────────────────── */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!files.length) {
            showError(
                "Please upload at least one image"
            );

            return;
        }

        if (
            form.auctionType === "long" &&
            new Date(form.endTime) <=
                new Date(form.startTime)
        ) {
            showError(
                "End time must be after start time"
            );

            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            Object.entries(form).forEach(
                ([key, value]) => {
                    if (
                        value !== "" &&
                        value !== null &&
                        value !== undefined
                    ) {
                        if (
                            key === "startTime" ||
                            key === "endTime"
                        ) {
                            formData.append(
                                key,
                                new Date(
                                    value
                                ).toISOString()
                            );
                        } else {
                            formData.append(
                                key,
                                value
                            );
                        }
                    }
                }
            );

            files.forEach((file) =>
                formData.append("media", file)
            );

            const res = await api.post(
                API_ENDPOINTS.Auction.CREATE,
                formData
            );

            showSuccess(
                "Auction created successfully!"
            );

            navigate(
                `/auction/${res?.data?.data?._id}`
            );
        } catch (err) {
            console.log(err.response?.data);

            showError(
                err.response?.data?.message ||
                    "Failed to create auction"
            );
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-400";

    const labelClass =
        "block text-sm font-semibold text-gray-700 mb-2 tracking-wide";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 py-12 px-4">
            <div className="max-w-2xl mx-auto relative">
                {/* HEADER */}
                <div className="mb-12">
                    <button
                        onClick={() =>
                            navigate(
                                "/auction/seller"
                            )
                        }
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
                                List your item and let
                                collectors bid
                            </p>
                        </div>
                    </div>
                </div>

                {/* FORM */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/80 border border-gray-100 overflow-hidden">
                    <form
                        onSubmit={handleSubmit}
                        className="p-10 space-y-8"
                    >
                        <AnimatePresence mode="wait">
                            {/* STEP 1 */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{
                                        opacity: 0,
                                        x: 30,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        x: -30,
                                    }}
                                    transition={{
                                        duration: 0.35,
                                    }}
                                    className="space-y-8"
                                >
                                    {/* TITLE */}
                                    <motion.div
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="visible"
                                        custom={0}
                                    >
                                        <label
                                            className={
                                                labelClass
                                            }
                                        >
                                            Auction Title
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            value={
                                                form.name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Vintage Rolex"
                                            required
                                            className={
                                                inputClass
                                            }
                                        />
                                    </motion.div>

                                    {/* CATEGORY */}
                                    <motion.div
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="visible"
                                        custom={1}
                                    >
                                        <label
                                            className={
                                                labelClass
                                            }
                                        >
                                            Category
                                        </label>

                                        <select
                                            name="category"
                                            value={
                                                form.category
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                            className={
                                                inputClass
                                            }
                                        >
                                            <option value="">
                                                Select
                                                Category
                                            </option>

                                            {categories.map(
                                                (cat) => (
                                                    <option
                                                        key={
                                                            cat._id
                                                        }
                                                        value={
                                                            cat._id
                                                        }
                                                    >
                                                        {
                                                            cat.name
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </motion.div>

                                    {/* DESCRIPTION */}
                                    <motion.div
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="visible"
                                        custom={2}
                                    >
                                        <label
                                            className={
                                                labelClass
                                            }
                                        >
                                            Description
                                        </label>

                                        <textarea
                                            name="description"
                                            value={
                                                form.description
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            rows={6}
                                            required
                                            className={`${inputClass} resize-y min-h-[140px]`}
                                        />
                                    </motion.div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (
                                                !form.name.trim() ||
                                                !form.description.trim() ||
                                                !form.category
                                            ) {
                                                showError(
                                                    "Please fill all fields"
                                                );

                                                return;
                                            }

                                            setStep(
                                                2
                                            );
                                        }}
                                        className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-4 rounded-2xl font-semibold"
                                    >
                                        Continue →
                                    </button>
                                </motion.div>
                            )}

                            {/* STEP 2 */}
                            {step === 2 && (
                                <motion.div className="space-y-8">
                                    <div>
                                        <label
                                            className={
                                                labelClass
                                            }
                                        >
                                            Starting
                                            Price
                                        </label>

                                        <input
                                            type="number"
                                            name="startPrice"
                                            value={
                                                form.startPrice
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                            className={
                                                inputClass
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label
                                            className={
                                                labelClass
                                            }
                                        >
                                            Auction
                                            Type
                                        </label>

                                        <select
                                            name="auctionType"
                                            value={
                                                form.auctionType
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className={
                                                inputClass
                                            }
                                        >
                                            <option value="long">
                                                Long
                                                Auction
                                            </option>

                                            <option value="short">
                                                Short
                                                Auction
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            className={
                                                labelClass
                                            }
                                        >
                                            Start Time
                                        </label>

                                        <input
                                            type="datetime-local"
                                            name="startTime"
                                            value={
                                                form.startTime
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                            className={
                                                inputClass
                                            }
                                        />
                                    </div>

                                    {form.auctionType ===
                                        "long" && (
                                        <div>
                                            <label
                                                className={
                                                    labelClass
                                                }
                                            >
                                                End
                                                Time
                                            </label>

                                            <input
                                                type="datetime-local"
                                                name="endTime"
                                                value={
                                                    form.endTime
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                                className={
                                                    inputClass
                                                }
                                            />
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setStep(
                                                    1
                                                )
                                            }
                                            className="flex-1 border border-gray-300 py-4 rounded-2xl"
                                        >
                                            ← Back
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setStep(
                                                    3
                                                )
                                            }
                                            className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white py-4 rounded-2xl"
                                        >
                                            Continue →
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3 */}
                            {step === 3 && (
                                <motion.div className="space-y-8">
                                    <label
                                        onDragOver={(
                                            e
                                        ) => {
                                            e.preventDefault();

                                            setDragOver(
                                                true
                                            );
                                        }}
                                        onDragLeave={() =>
                                            setDragOver(
                                                false
                                            )
                                        }
                                        onDrop={
                                            handleDrop
                                        }
                                        className={`block border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${
                                            dragOver
                                                ? "border-orange-500 bg-orange-50"
                                                : "border-gray-200"
                                        }`}
                                    >
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={
                                                handleFileChange
                                            }
                                            className="hidden"
                                        />

                                        <p className="text-lg font-medium text-gray-700">
                                            Upload
                                            Images
                                        </p>
                                    </label>

                                    {preview.length >
                                        0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {preview.map(
                                                (
                                                    src,
                                                    i
                                                ) => (
                                                    <div
                                                        key={
                                                            src
                                                        }
                                                        className="relative rounded-2xl overflow-hidden"
                                                    >
                                                        <img
                                                            src={
                                                                src
                                                            }
                                                            alt=""
                                                            className="w-full aspect-square object-cover"
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeImage(
                                                                    i
                                                                )
                                                            }
                                                            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-xl"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setStep(
                                                    2
                                                )
                                            }
                                            className="flex-1 border border-gray-300 py-4 rounded-2xl"
                                        >
                                            ← Back
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={
                                                loading
                                            }
                                            className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white py-4 rounded-2xl"
                                        >
                                            {loading
                                                ? "Creating..."
                                                : "Launch Auction"}
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