import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
    Plus,
    Pencil,
    Trash2,
    Loader2,
    ImagePlus,
    Check,
    X,
} from "lucide-react";

import { api } from "@/shared/services/axios";

const BannerPage = () => {
    const fileInputRef =
        useRef(null);

    const [banners, setBanners] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [deleteLoading, setDeleteLoading] =
        useState("");

    const [editingBanner, setEditingBanner] =
        useState(null);

    const [preview, setPreview] =
        useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        cta: "",
        category: "",
        image: null,
    });

    /* ─────────────────────────────
       FETCH BANNERS
    ───────────────────────────── */
    const fetchBanners = async () => {
        try {
            setLoading(true);

            const res = await api.get(
                "/api/banner/get"
            );

            console.log(
                "BANNER RESPONSE:",
                res.data
            );

            setBanners(
                res.data.data || []
            );
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    /* ─────────────────────────────
       FETCH CATEGORIES
    ───────────────────────────── */
    const fetchCategories =
        async () => {
            try {
                const res =
                    await api.get(
                        "/api/category/get"
                    );

                console.log(
                    "CATEGORY RESPONSE:",
                    res.data
                );

                setCategories(
                    res.data.data ||
                        []
                );
            } catch (error) {
                console.log(error);
            }
        };

    useEffect(() => {
        fetchBanners();
        fetchCategories();
    }, []);

    /* ─────────────────────────────
       INPUT CHANGE
    ───────────────────────────── */
    const handleChange = (e) => {
        const { name, value } =
            e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /* ─────────────────────────────
       IMAGE
    ───────────────────────────── */
    const handleImageChange = (
        e
    ) => {
        const file =
            e.target.files[0];

        if (!file) return;

        setForm((prev) => ({
            ...prev,
            image: file,
        }));

        setPreview(
            URL.createObjectURL(file)
        );
    };

    const removeImage = () => {
        setPreview(null);

        setForm((prev) => ({
            ...prev,
            image: null,
        }));

        if (fileInputRef.current) {
            fileInputRef.current.value =
                "";
        }
    };

    /* ─────────────────────────────
       RESET FORM
    ───────────────────────────── */
    const resetForm = () => {
        setEditingBanner(null);

        setPreview(null);

        setForm({
            title: "",
            description: "",
            cta: "",
            category: "",
            image: null,
        });

        if (fileInputRef.current) {
            fileInputRef.current.value =
                "";
        }
    };

    /* ─────────────────────────────
       EDIT
    ───────────────────────────── */
    const handleEdit = (
        banner
    ) => {
        setEditingBanner(
            banner._id
        );

        setForm({
            title:
                banner.title || "",
            description:
                banner.description ||
                "",
            cta:
                banner.cta || "",
            category:
                banner.category?._id ||
                "",
            image: null,
        });

        setPreview(
            banner.image
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /* ─────────────────────────────
       CREATE / UPDATE
    ───────────────────────────── */
    const handleSubmit = async (
        e
    ) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            const formData =
                new FormData();

            formData.append(
                "title",
                form.title
            );

            formData.append(
                "description",
                form.description
            );

            formData.append(
                "cta",
                form.cta
            );

            formData.append(
                "category",
                form.category
            );

            if (form.image) {
                formData.append(
                    "image",
                    form.image
                );
            }

            if (editingBanner) {
                const res =
                    await api.put(
                        `/api/banner/${editingBanner}`,
                        formData,
                        {
                            headers: {
                                "Content-Type":
                                    "multipart/form-data",
                            },
                        }
                    );

                console.log(
                    res.data
                );
            } else {
                const res =
                    await api.post(
                        "/api/banner",
                        formData,
                        {
                            headers: {
                                "Content-Type":
                                    "multipart/form-data",
                            },
                        }
                    );

                console.log(
                    res.data
                );
            }

            resetForm();

            fetchBanners();
        } catch (error) {
            console.log(error);

            console.log(
                error?.response?.data
            );
        } finally {
            setSubmitting(false);
        }
    };

    /* ─────────────────────────────
       DELETE
    ───────────────────────────── */
    const handleDelete = async (
        id
    ) => {
        const confirmDelete =
            window.confirm(
                "Delete this banner?"
            );

        if (!confirmDelete) return;

        try {
            setDeleteLoading(id);

            await api.delete(
                `/api/banner/${id}`
            );

            setBanners((prev) =>
                prev.filter(
                    (banner) =>
                        banner._id !== id
                )
            );
        } catch (error) {
            console.log(error);
        } finally {
            setDeleteLoading("");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
                    {/* FORM */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-fit sticky top-6">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900">
                                {editingBanner
                                    ? "Update Banner"
                                    : "Create Banner"}
                            </h2>

                            <p className="text-slate-500 mt-1 text-sm">
                                Manage homepage
                                promotional
                                banners
                            </p>
                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="p-6 space-y-5"
                        >
                            {/* TITLE */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={
                                        form.title
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    placeholder="Luxury Watches Collection"
                                    className="w-full h-12 px-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none"
                                />
                            </div>

                            {/* DESCRIPTION */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">
                                    Description
                                </label>

                                <textarea
                                    rows={4}
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    placeholder="Premium luxury collection"
                                    className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none resize-none"
                                />
                            </div>

                            {/* CTA */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">
                                    CTA
                                </label>

                                <input
                                    type="text"
                                    name="cta"
                                    value={
                                        form.cta
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    placeholder="Explore Collection"
                                    className="w-full h-12 px-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none"
                                />
                            </div>

                            {/* CATEGORY */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">
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
                                    className="w-full h-12 px-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none"
                                >
                                    <option value="">
                                        Select
                                        Category
                                    </option>

                                    {categories.map(
                                        (
                                            category
                                        ) => (
                                            <option
                                                key={
                                                    category._id
                                                }
                                                value={
                                                    category._id
                                                }
                                            >
                                                {
                                                    category.name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* IMAGE */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">
                                    Banner Image
                                </label>

                                {preview ? (
                                    <div className="rounded-2xl overflow-hidden border border-slate-200">
                                        <div className="h-56">
                                            <img
                                                src={
                                                    preview
                                                }
                                                alt="preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between px-4 py-3 bg-white">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Check
                                                    size={16}
                                                    className="text-green-500"
                                                />

                                                Image
                                                selected
                                            </div>

                                            <button
                                                type="button"
                                                onClick={
                                                    removeImage
                                                }
                                                className="text-red-500 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="h-56 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-4">
                                            <ImagePlus className="w-6 h-6 text-slate-400" />
                                        </div>

                                        <p className="font-semibold text-slate-700">
                                            Click to
                                            upload
                                        </p>

                                        <p className="text-sm text-slate-400 mt-1">
                                            PNG, JPG,
                                            WEBP
                                        </p>
                                    </div>
                                )}

                                <input
                                    ref={
                                        fileInputRef
                                    }
                                    type="file"
                                    accept="image/*"
                                    onChange={
                                        handleImageChange
                                    }
                                    className="hidden"
                                />
                            </div>

                            {/* BUTTONS */}
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={
                                        submitting
                                    }
                                    className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <Loader2 className="animate-spin w-4 h-4" />
                                    ) : editingBanner ? (
                                        <>
                                            <Pencil
                                                size={16}
                                            />
                                            Update
                                        </>
                                    ) : (
                                        <>
                                            <Plus
                                                size={16}
                                            />
                                            Create
                                        </>
                                    )}
                                </button>

                                {editingBanner && (
                                    <button
                                        type="button"
                                        onClick={
                                            resetForm
                                        }
                                        className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center"
                                    >
                                        <X
                                            size={18}
                                        />
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* BANNERS */}
                    <div>
                        {loading ? (
                            <div className="h-[70vh] flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
                            </div>
                        ) : banners.length ===
                          0 ? (
                            <div className="bg-white border border-dashed border-slate-300 rounded-3xl h-[500px] flex flex-col items-center justify-center">
                                <h2 className="text-2xl font-bold text-slate-800">
                                    No banners
                                </h2>

                                <p className="text-slate-500 mt-2">
                                    Create your
                                    first banner
                                </p>
                            </div>
                        ) : (
                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                <AnimatePresence>
                                    {banners.map(
                                        (
                                            banner
                                        ) => (
                                            <motion.div
                                                key={
                                                    banner._id
                                                }
                                                layout
                                                initial={{
                                                    opacity: 0,
                                                    y: 20,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.9,
                                                }}
                                                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm"
                                            >
                                                {/* IMAGE */}
                                                <div className="h-56 overflow-hidden">
                                                    <img
                                                        src={
                                                            banner.image
                                                        }
                                                        alt={
                                                            banner.title
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                {/* CONTENT */}
                                                <div className="p-5">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <h2 className="text-xl font-bold text-slate-900">
                                                                {
                                                                    banner.title
                                                                }
                                                            </h2>

                                                            <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                                                                {
                                                                    banner.description
                                                                }
                                                            </p>
                                                        </div>

                                                        <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                                                            {banner
                                                                ?.category
                                                                ?.name ||
                                                                "No category"}
                                                        </span>
                                                    </div>

                                                    <div className="mt-4">
                                                        <span className="inline-flex items-center rounded-xl bg-blue-50 text-blue-600 text-sm font-medium px-3 py-2">
                                                            {
                                                                banner.cta
                                                            }
                                                        </span>
                                                    </div>

                                                    {/* ACTIONS */}
                                                    <div className="flex items-center gap-3 mt-6">
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(
                                                                    banner
                                                                )
                                                            }
                                                            className="flex-1 h-11 rounded-2xl border border-slate-200 flex items-center justify-center gap-2 font-semibold hover:bg-slate-50"
                                                        >
                                                            <Pencil
                                                                size={16}
                                                            />
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    banner._id
                                                                )
                                                            }
                                                            disabled={
                                                                deleteLoading ===
                                                                banner._id
                                                            }
                                                            className="flex-1 h-11 rounded-2xl bg-red-500 text-white font-semibold flex items-center justify-center gap-2"
                                                        >
                                                            {deleteLoading ===
                                                            banner._id ? (
                                                                <Loader2 className="animate-spin w-4 h-4" />
                                                            ) : (
                                                                <>
                                                                    <Trash2
                                                                        size={16}
                                                                    />
                                                                    Delete
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BannerPage;