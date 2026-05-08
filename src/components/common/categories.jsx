import { useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AuctionsGrid from "@/features/home/pages/AuctionsGrid.jsx";
import { usePageTitle } from "../../shared/utils/usePageTitle";

export default function CategoryAuctionsPage() {
    const { category } = useParams();
    const navigate = useNavigate();
    const headerRef = useRef(null);

    const isInView = useInView(headerRef, {
        once: true,
        margin: "-40px",
    });

    const categoryName = category
        ?.split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    usePageTitle(category ? `${categoryName} | Explore Auctify Auctions` : "Category");

    return (
        <div className="min-h-screen bg-[#F8F9FF] font-sans">
            {/* Top banner */}
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

            <div className="max-w-[1400px] mx-auto  pb-20">
                {/* Header */}
                <div ref={headerRef} className="mt-8 mb-10">
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
                                transition={{
                                    duration: 0.45,
                                    delay: 0.18,
                                }}
                                className="mt-2.5 text-sm text-gray-500 leading-relaxed max-w-[460px]"
                            >
                                Premium listings with real-time bidding and trusted sellers on
                                Auctify.
                            </motion.p>
                        </div>

                        <button
                            onClick={() => navigate("/explore")}
                            className="bg-[#2D47E6] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition"
                        >
                            Browse All Auctions
                        </button>
                    </div>
                </div>

                <div className="h-px bg-gradient-to-r from-[#2D47E6] via-gray-200 to-transparent rounded" />

                {/* GRID */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.1 }}
                >
                    <AuctionsGrid category={categoryName} filtering={true} limit={20} />
                </motion.div>
            </div>
        </div>
    );
}
