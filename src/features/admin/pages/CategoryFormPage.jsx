import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Plus,
    Loader2,
    ImagePlus,
    Upload,
    X,
    Check,
    Trash2,
    Pencil,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { api } from "@/shared/services/axios";

const CategoryPage = () => {
    const navigate = useNavigate();

    const fileRef = useRef(null);

    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState([]);

    const [preview, setPreview] = useState(null);

    const [dragOver, setDragOver] = useState(false);

    const [deleteLoading, setDeleteLoading] = useState(null);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        cta: "",
        image: null,
    });

    /* ─────────────────────────────────────────────
     FETCH CATEGORIES
  ───────────────────────────────────────────── */
    const fetchCategories = async () => {
        try {
            const res = await api.get("/api/category/get");

            setCategories(res.data.data || []);
        } catch (error) {
            //console.log(error.response?.data || error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    /* ─────────────────────────────────────────────
     INPUT CHANGE
  ───────────────────────────────────────────── */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /* ─────────────────────────────────────────────
     IMAGE
  ───────────────────────────────────────────── */
    const applyFile = (file) => {
        if (!file || !file.type.startsWith("image/")) return;

        setForm((prev) => ({
            ...prev,
            image: file,
        }));

        setPreview(URL.createObjectURL(file));
    };

    const handleImage = (e) => {
        applyFile(e.target.files[0]);
    };

    const handleDrop = (e) => {
        e.preventDefault();

        setDragOver(false);

        applyFile(e.dataTransfer.files[0]);
    };

    const clearImage = () => {
        setPreview(null);

        setForm((prev) => ({
            ...prev,
            image: null,
        }));

        if (fileRef.current) {
            fileRef.current.value = "";
        }
    };

    /* ─────────────────────────────────────────────
     RESET FORM
  ───────────────────────────────────────────── */
    const resetForm = () => {
        setEditId(null);

        setForm({
            name: "",
            cta: "",
            image: null,
        });

        setPreview(null);

        if (fileRef.current) {
            fileRef.current.value = "";
        }
    };

    /* ─────────────────────────────────────────────
     CREATE CATEGORY
  ───────────────────────────────────────────── */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("cta", form.cta);
            formData.append("image", form.image);

            await api.post("/api/category", formData);

            await fetchCategories();

            resetForm();
        } catch (error) {
            //console.log(error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    /* ─────────────────────────────────────────────
     EDIT CATEGORY
  ───────────────────────────────────────────── */
    const handleEdit = (category) => {
        setEditId(category._id);

        setForm({
            name: category.name,
            cta: category.cta,
            image: null,
        });

        setPreview(category.image);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /* ─────────────────────────────────────────────
     UPDATE CATEGORY
  ───────────────────────────────────────────── */
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("cta", form.cta);

            if (form.image) {
                formData.append("image", form.image);
            }

            await api.put(`/api/category/${editId}`, formData);

            await fetchCategories();

            resetForm();
        } catch (error) {
            //console.log(error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    /* ─────────────────────────────────────────────
     DELETE CATEGORY
  ───────────────────────────────────────────── */
    const handleDelete = async (id) => {
        try {
            setDeleteLoading(id);

            await api.delete(`/api/category/${id}`);

            setCategories((prev) => prev.filter((cat) => cat._id !== id));
        } catch (error) {
            //console.log(error.response?.data || error);
        } finally {
            setDeleteLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="max-w-6xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center shadow-sm"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Categories</h1>

                        <p className="text-sm text-slate-400 mt-1">Manage auction categories</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[420px_1fr] gap-6">
                    {/* FORM */}
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden h-fit">
                        <form onSubmit={editId ? handleUpdate : handleSubmit}>
                            <div className="p-6 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-900">
                                    {editId ? "Update Category" : "Create Category"}
                                </h2>

                                <p className="text-sm text-slate-400 mt-1">
                                    Add category for auctions
                                </p>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* NAME */}
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Category Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Watches"
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:bg-white"
                                    />
                                </div>

                                {/* CTA */}
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        CTA Text
                                    </label>

                                    <input
                                        type="text"
                                        name="cta"
                                        required
                                        value={form.cta}
                                        onChange={handleChange}
                                        placeholder="e.g. Explore Watches"
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:bg-white"
                                    />
                                </div>

                                {/* IMAGE */}
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Category Image
                                    </label>

                                    <div className="mt-3">
                                        <AnimatePresence mode="wait">
                                            {preview ? (
                                                <motion.div
                                                    key="preview"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="relative overflow-hidden rounded-3xl border border-slate-200"
                                                >
                                                    <img
                                                        src={preview}
                                                        alt=""
                                                        className="w-full h-56 object-cover"
                                                    />

                                                    <div className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                                                                <Check
                                                                    size={11}
                                                                    className="text-emerald-600"
                                                                />
                                                            </div>

                                                            <span className="text-xs font-semibold text-slate-600">
                                                                Image selected
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    fileRef.current?.click()
                                                                }
                                                                className="flex items-center gap-1 text-xs font-semibold text-violet-600"
                                                            >
                                                                <Upload size={12} />
                                                                Change
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={clearImage}
                                                                className="flex items-center gap-1 text-xs font-semibold text-rose-500"
                                                            >
                                                                <X size={12} />
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="dropzone"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    onClick={() => fileRef.current?.click()}
                                                    onDragOver={(e) => {
                                                        e.preventDefault();
                                                        setDragOver(true);
                                                    }}
                                                    onDragLeave={() => setDragOver(false)}
                                                    onDrop={handleDrop}
                                                    className={`h-56 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition ${
                                                        dragOver
                                                            ? "border-violet-400 bg-violet-50"
                                                            : "border-slate-200 bg-slate-50 hover:border-violet-300"
                                                    }`}
                                                >
                                                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
                                                        <ImagePlus
                                                            size={24}
                                                            className="text-slate-400"
                                                        />
                                                    </div>

                                                    <p className="mt-4 text-sm font-semibold text-slate-600">
                                                        Click or drag image here
                                                    </p>

                                                    <p className="text-xs text-slate-400 mt-1">
                                                        PNG, JPG, WEBP
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <input
                                            ref={fileRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImage}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER */}
                            <div className="p-6 pt-0 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-violet-200 disabled:opacity-60"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            {editId ? "Updating..." : "Creating..."}
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={16} />
                                            {editId ? "Update Category" : "Create Category"}
                                        </>
                                    )}
                                </button>

                                {editId && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-5 h-12 rounded-2xl border border-slate-200 bg-white font-semibold text-slate-600"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* CATEGORIES */}
                    <div>
                        {categories.length > 0 ? (
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {categories.map((cat) => (
                                    <div
                                        key={cat._id}
                                        className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm"
                                    >
                                        <div className="h-52 overflow-hidden">
                                            <img
                                                src={cat.image}
                                                alt={cat.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="p-4">
                                            <h3 className="text-lg font-bold text-slate-900">
                                                {cat.name}
                                            </h3>

                                            <p className="text-sm text-slate-500 mt-1">{cat.cta}</p>

                                            <div className="mt-4 flex flex-col gap-2">
                                                <button
                                                    onClick={() => handleEdit(cat)}
                                                    className="w-full h-11 rounded-2xl border border-violet-200 text-violet-600 hover:bg-violet-50 flex items-center justify-center gap-2 transition"
                                                >
                                                    <Pencil size={15} />
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(cat._id)}
                                                    disabled={deleteLoading === cat._id}
                                                    className="w-full h-11 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center gap-2 transition"
                                                >
                                                    {deleteLoading === cat._id ? (
                                                        <>
                                                            <Loader2
                                                                size={15}
                                                                className="animate-spin"
                                                            />
                                                            Deleting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Trash2 size={15} />
                                                            Delete
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-[500px] bg-white border border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                                    <ImagePlus size={28} className="text-slate-400" />
                                </div>

                                <h2 className="mt-5 text-xl font-bold text-slate-700">
                                    No categories yet
                                </h2>

                                <p className="mt-2 text-sm text-slate-400">
                                    Create your first auction category
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
