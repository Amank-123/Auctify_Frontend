import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import AuctionsGrid from "@/features/home/pages/AuctionsGrid.jsx";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";
import { usePageTitle } from "../../shared/utils/usePageTitle";

export default function CategoryAuctionsPage() {
    const { category } = useParams();
    const navigate = useNavigate();
    const headerRef = useRef(null);
    const isInView = useInView(headerRef, { once: true, margin: "-40px" });

    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    const categoryName = category?.charAt(0).toUpperCase() + category?.slice(1);

    usePageTitle(category ? `${categoryName} | Explore Auctify Auctions` : "Category");

    useEffect(() => {
        const fetchCategoryAuctions = async () => {
            try {
                setLoading(true);
                const res = await api.get(API_ENDPOINTS.Auction.GET_ALL, {
                    params: {
                        page: 1,
                        category: categoryName,
                        limit: 100,
                        sortBy: "createdAt",
                        order: "desc",
                    },
                });
                const data = res?.data?.data || [];
                const filtered = data.filter(
                    (item) =>
                        item?.category?.trim().toLowerCase() === category?.trim().toLowerCase(),
                );
                setAuctions(filtered);
            } catch (error) {
                console.log("Category fetch error:", error);
                setAuctions([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryAuctions();
    }, [category]);

    const liveCount = auctions.filter((a) => a.status === "active").length;

    return (
        <div className="min-h-screen bg-[#F8F9FF] font-sans">
            {/* ── Top banner strip ── */}
            <div className="bg-[#2D47E6] py-2 px-8 flex items-center justify-center gap-5">
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#4ADE80] block" />
                    <span className="text-[11px] font-semibold text-white/90 tracking-wide">
                        Real-time Auctions
                    </span>
                </div>
                <span className="text-white/30 text-[11px]">•</span>
                <span className="text-[11px] font-medium text-white/70 tracking-wide">
                    Direct seller-to-buyer
                </span>
                <span className="text-white/30 text-[11px]">•</span>
                <span className="text-[11px] font-medium text-white/70 tracking-wide">
                    No middleman fees
                </span>
            </div>

            <div className="max-w-[1280px] mx-auto px-8 pb-20">
                {/* ── Page Header ── */}
                <div ref={headerRef} className="mt-8 mb-10">
                    {/* Eyebrow */}
                    <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4 }}
                        className="flex items-center gap-2.5 mb-3.5"
                    >
                        <span className="block w-7 h-0.5 bg-[#2D47E6] rounded" />
                        <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#2D47E6]">
                            Auction Collection
                        </span>
                    </motion.div>

                    <div className="flex items-end justify-between flex-wrap gap-6">
                        {/* Title + description */}
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{
                                    duration: 0.55,
                                    delay: 0.08,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="text-[clamp(32px,4.5vw,54px)] font-black text-[#0D0D0D] tracking-tight leading-[1.05]"
                            >
                                {categoryName} <span className="text-[#2D47E6]">Auctions</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 12 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.45, delay: 0.18 }}
                                className="mt-2.5 text-sm text-gray-500 leading-relaxed max-w-[460px]"
                            >
                                Premium listings with real-time bidding and trusted sellers on
                                Auctify.
                            </motion.p>
                        </div>

                        {/* Stat cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.45, delay: 0.24 }}
                            className="flex gap-2.5 flex-wrap"
                        >
                            {/* Total listings */}
                            <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 min-w-[100px]">
                                <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-1">
                                    Total Listings
                                </p>
                                {loading ? (
                                    <span className="inline-block w-10 h-7 bg-gray-100 rounded" />
                                ) : (
                                    <p className="text-[26px] font-black text-[#0D0D0D] tracking-tight leading-none">
                                        {auctions.length}
                                    </p>
                                )}
                            </div>

                            {/* Live now */}
                            <div className="bg-[#2D47E6] rounded-xl px-5 py-3 min-w-[100px]">
                                <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/55 mb-1">
                                    Live Now
                                </p>
                                {loading ? (
                                    <span className="inline-block w-10 h-7 bg-white/15 rounded" />
                                ) : (
                                    <p className="text-[26px] font-black text-white tracking-tight leading-none">
                                        {liveCount}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* ── Divider ── */}
                <div className="h-px bg-gradient-to-r from-[#2D47E6] via-gray-200 to-transparent  rounded" />

                {/* ── Content ── */}
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white border border-gray-200 rounded-2xl px-8 py-20 text-center"
                    >
                        <div className="flex justify-center gap-1.5 mb-5">
                            {[0, 1, 2].map((i) => (
                                <motion.span
                                    key={i}
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        delay: i * 0.15,
                                        ease: "easeInOut",
                                    }}
                                    className="w-2 h-2 rounded-full bg-[#2D47E6] block"
                                />
                            ))}
                        </div>
                        <p className="text-base font-bold text-[#0D0D0D]">Loading Auctions</p>
                        <p className="text-sm text-gray-400 mt-1.5">
                            Fetching {categoryName.toLowerCase()} listings...
                        </p>
                    </motion.div>
                ) : auctions.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white border border-gray-200 rounded-2xl px-8 py-20 text-center"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#2D47E6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </div>
                        <p className="text-[17px] font-extrabold text-[#0D0D0D] tracking-tight mb-2">
                            No Auctions Found
                        </p>
                        <p className="text-sm text-gray-400 mb-6">
                            There are no active {categoryName.toLowerCase()} auctions at the moment.
                        </p>
                        <button
                            onClick={() => navigate("/explore")}
                            className="bg-[#2D47E6] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                        >
                            Browse All Auctions
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.1 }}
                    >
                        <AuctionsGrid auctions={auctions} category={category} />
                    </motion.div>
                )}
            </div>
        </div>
    );
}
