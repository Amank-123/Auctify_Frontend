import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuctionCard from "@/components/common/AuctionCard.jsx";

export default function AuctionTypeGrid({
    auctions = [],
    title = "Featured Auctions",
    subtitle = "Browse short-term flash bids and long-term premium listings.",
    initialLimit = 8,
}) {
    const [type, setType] = useState("short");
    const [visibleCount, setVisibleCount] = useState(initialLimit);

    const filteredAuctions = useMemo(() => {
        return auctions.filter(
            (item) =>
                item.auctionType === type && (item.status === "active" || item.status === "ended"),
        );
    }, [auctions, type]);

    const visibleAuctions = filteredAuctions.slice(0, visibleCount);

    const handleTabChange = (value) => {
        setType(value);
        setVisibleCount(initialLimit);
    };

    return (
        <section className="max-w-7xl mx-auto px-6 py-16">
            {/* heading */}
            <div className="mb-10 text-center">
                <h2 className="text-4xl font-bold text-slate-900">{title}</h2>

                <p className="mt-3 text-slate-500 text-lg">{subtitle}</p>
            </div>

            {/* toggle buttons */}
            <div className="flex justify-center mb-10">
                <div className="inline-flex bg-slate-100 p-1 rounded-2xl">
                    <button
                        onClick={() => handleTabChange("short")}
                        className={`px-6 h-12 rounded-2xl font-semibold transition ${
                            type === "short"
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        Flash Auctions
                    </button>

                    <button
                        onClick={() => handleTabChange("long")}
                        className={`px-6 h-12 rounded-2xl font-semibold transition ${
                            type === "long"
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        Premium Auctions
                    </button>
                </div>
            </div>

            {/* count */}
            <p className="mb-6 text-sm text-slate-500 text-center">
                Showing {visibleAuctions.length} auctions
            </p>

            {/* grid */}
            {visibleAuctions.length > 0 ? (
                <>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={type}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.35 }}
                            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {visibleAuctions.map((item) => (
                                <AuctionCard key={item._id} auction={item} />
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {/* load more */}
                    {filteredAuctions.length > visibleCount && (
                        <div className="text-center mt-10">
                            <button
                                onClick={() => setVisibleCount((prev) => prev + 4)}
                                className="px-8 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white border border-slate-200 rounded-3xl p-14 text-center">
                    <h3 className="text-2xl font-semibold text-slate-900">No Auctions Found</h3>

                    <p className="mt-2 text-slate-500">No {type} auctions available right now.</p>
                </div>
            )}
        </section>
    );
}
