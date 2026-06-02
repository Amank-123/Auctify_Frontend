import { useState } from "react";
import { Upload, FileText, Loader2, CheckCircle2 } from "lucide-react";

import toast from "react-hot-toast";

export default function KnowledgeBaseAdmin() {
    const [selectedFile, setSelectedFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Only PDF files are allowed");
            return;
        }

        setSelectedFile(file);
        setSuccess(false);
    };

    const uploadKnowledgeBase = async () => {
        if (!selectedFile) {
            toast.error("Please select a PDF file");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("file", selectedFile);

            const response = await fetch(
                "https://auctifyragaichatbot-production.up.railway.app/upload",
                {
                    method: "POST",
                    body: formData,
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Upload failed");
            }

            setSuccess(true);

            toast.success("Knowledge base updated successfully");
        } catch (error) {
            //console.error(error);

            toast.error("Failed to upload PDF");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] px-6 py-10 text-white">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight">AI Knowledge Base</h1>

                    <p className="mt-3 text-zinc-400">
                        Upload and manage your RAG chatbot knowledge base.
                    </p>
                </div>

                {/* Main Card */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                    {/* Upload Area */}
                    <label className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-600 bg-black/20 px-6 py-16 transition hover:border-blue-500 hover:bg-black/30">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 transition group-hover:scale-110">
                            <Upload size={36} />
                        </div>

                        <h2 className="mt-6 text-2xl font-semibold">Upload PDF Knowledge Base</h2>

                        <p className="mt-3 max-w-md text-center text-sm text-zinc-400">
                            Upload a PDF file to replace the current vector database knowledge.
                        </p>

                        <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>

                    {/* Selected File */}
                    {selectedFile && (
                        <div className="mt-8 flex items-center justify-between rounded-2xl border border-zinc-700 bg-black/30 px-5 py-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                                    <FileText size={24} />
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-white">
                                        {selectedFile.name}
                                    </h3>

                                    <p className="mt-1 text-xs text-zinc-400">
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={uploadKnowledgeBase}
                                disabled={loading}
                                className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={18} />
                                        Upload PDF
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-4 text-green-400">
                            <CheckCircle2 size={22} />

                            <p className="text-sm font-medium">
                                Knowledge base updated successfully.
                            </p>
                        </div>
                    )}
                </div>

                {/* Info Cards */}
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                        <h3 className="text-lg font-semibold">How It Works</h3>

                        <div className="mt-5 space-y-4 text-sm text-zinc-400">
                            <p>1. Upload a new PDF file.</p>

                            <p>2. Old Pinecone vectors are deleted.</p>

                            <p>3. New PDF gets chunked and embedded.</p>

                            <p>4. New vectors are stored in Pinecone.</p>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                        <h3 className="text-lg font-semibold">Important Notes</h3>

                        <div className="mt-5 space-y-4 text-sm text-zinc-400">
                            <p>• Uploading a new PDF replaces old knowledge.</p>

                            <p>• Large PDFs may take longer to process.</p>

                            <p>• Only PDF files are supported.</p>

                            <p>• Chatbot responses update automatically.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
