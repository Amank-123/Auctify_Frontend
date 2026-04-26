import { useState } from "react";
import { Megaphone, Send, Loader2 } from "lucide-react";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";

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

    const types = [
        { value: "sponsored", label: "Sponsored" },
        { value: "system", label: "System" },
        { value: "endingSoon", label: "Ending Soon" },
    ];

    return (
        <div className="min-h-screen px-4 py-8" style={{ background: "#F5F7FF" }}>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "#FFF3E8" }}
                    >
                        <Megaphone size={20} style={{ color: "#E8682A" }} />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                            Broadcast Notification
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Send a message to all verified users
                        </p>
                    </div>
                </div>

                {/* Card */}
                <div
                    className="bg-white rounded-2xl p-6"
                    style={{ border: "1px solid #E8EAF0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                >
                    <form onSubmit={handleSubmit} className="space-y-0">
                        {/* Type */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                                Notification Type
                            </p>
                            <div className="flex gap-2">
                                {types.map((t) => (
                                    <button
                                        key={t.value}
                                        type="button"
                                        onClick={() =>
                                            setFormData((prev) => ({ ...prev, type: t.value }))
                                        }
                                        className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all"
                                        style={
                                            formData.type === t.value
                                                ? {
                                                      background: "#FFF3E8",
                                                      color: "#E8682A",
                                                      border: "1px solid #FBCAA0",
                                                  }
                                                : {
                                                      background: "#F9FAFB",
                                                      color: "#6B7280",
                                                      border: "1px solid #E5E7EB",
                                                  }
                                        }
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="my-5" style={{ height: 1, background: "#F0F2F7" }} />

                        {/* Content */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                                Content
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="🔥 Premium Watch Auction Live Now"
                                        required
                                        className="w-full rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none transition-all"
                                        style={{
                                            background: "#F9FAFB",
                                            border: "1px solid #E5E7EB",
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.border = "1px solid #3B82F6";
                                            e.target.style.background = "#fff";
                                            e.target.style.boxShadow =
                                                "0 0 0 3px rgba(59,130,246,0.1)";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.border = "1px solid #E5E7EB";
                                            e.target.style.background = "#F9FAFB";
                                            e.target.style.boxShadow = "none";
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                        Message
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            rows={4}
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Bid on Rolex, Omega and luxury timepieces before listings close tonight."
                                            required
                                            maxLength={280}
                                            className="w-full rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none transition-all resize-none"
                                            style={{
                                                background: "#F9FAFB",
                                                border: "1px solid #E5E7EB",
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.border = "1px solid #3B82F6";
                                                e.target.style.background = "#fff";
                                                e.target.style.boxShadow =
                                                    "0 0 0 3px rgba(59,130,246,0.1)";
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.border = "1px solid #E5E7EB";
                                                e.target.style.background = "#F9FAFB";
                                                e.target.style.boxShadow = "none";
                                            }}
                                        />
                                        <span className="absolute bottom-2.5 right-3 text-xs text-gray-300 font-mono">
                                            {formData.message.length}/280
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="my-5" style={{ height: 1, background: "#F0F2F7" }} />

                        {/* Delivery */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                                Delivery
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { name: "image", label: "Image URL", placeholder: "https://…" },
                                    {
                                        name: "ctaLink",
                                        label: "CTA Link",
                                        placeholder: "/category/watches",
                                    },
                                ].map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                            {field.label}
                                        </label>
                                        <input
                                            type="text"
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            className="w-full rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none transition-all"
                                            style={{
                                                background: "#F9FAFB",
                                                border: "1px solid #E5E7EB",
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.border = "1px solid #3B82F6";
                                                e.target.style.background = "#fff";
                                                e.target.style.boxShadow =
                                                    "0 0 0 3px rgba(59,130,246,0.1)";
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.border = "1px solid #E5E7EB";
                                                e.target.style.background = "#F9FAFB";
                                                e.target.style.boxShadow = "none";
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Alerts */}
                        {success && (
                            <div
                                className="mt-4 rounded-xl px-4 py-3 text-sm flex items-center gap-2"
                                style={{
                                    background: "#F0FDF4",
                                    color: "#16A34A",
                                    border: "1px solid #BBF7D0",
                                }}
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                {success}
                            </div>
                        )}
                        {error && (
                            <div
                                className="mt-4 rounded-xl px-4 py-3 text-sm flex items-center gap-2"
                                style={{
                                    background: "#FEF2F2",
                                    color: "#DC2626",
                                    border: "1px solid #FCA5A5",
                                }}
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50"
                            style={{
                                background: "#3B82F6",
                                boxShadow: "0 1px 4px rgba(59,130,246,0.25)",
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={15} className="animate-spin" />
                                    Sending…
                                </>
                            ) : (
                                <>
                                    <Send size={15} />
                                    Send Broadcast
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
