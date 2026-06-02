import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ArrowRight, Search } from "lucide-react";
import { motion } from "framer-motion";
import AuctionCard from "@/components/common/AuctionCard.jsx";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";

/* ---------- SORT MAP ---------- */
const getSortParams = (sort) => {
    switch (sort) {
        case "price-low":
            return { sortBy: "currentHighestBid", order: "asc" };

        case "price-high":
            return { sortBy: "currentHighestBid", order: "desc" };

        default:
            return { sortBy: "createdAt", order: "desc" };
    }
};

/* ---------- CUSTOM DROPDOWN ---------- */
function Dropdown({ value, onChange, options }) {
    const [open, setOpen] = useState(false);

    const selected = options.find((o) => o.value === value);

    return (
        <div className="relative w-full">
            <button
                onClick={() => setOpen((p) => !p)}
                className="
                    w-full h-11 sm:h-12 px-4
                    flex items-center justify-between
                    rounded-xl bg-white
                    border border-slate-200
                    shadow-sm hover:shadow-md
                    transition
                "
            >
                <span className="text-sm font-medium text-slate-700 truncate">
                    {selected?.label}
                </span>

                <ChevronDown size={16} className="text-slate-400 shrink-0" />
            </button>

            {open && (
                <div
                    className="
                        absolute z-20 mt-2 w-full
                        bg-white rounded-xl shadow-xl
                        border border-slate-100
                        overflow-hidden
                    "
                >
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className={`
                                w-full text-left px-4 py-3 text-sm transition
                                ${
                                    opt.value === value
                                        ? "bg-blue-50 text-blue-600 font-medium"
                                        : "hover:bg-slate-50 text-slate-700"
                                }
                            `}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ---------- MAIN ---------- */
export default function AuctionsGrid({
    heading,
    subheading,
    limit,
    category,
    exploreBtn = true,
    explorePath,
    filtering = true,
    auctionType,
}) {
    const navigate = useNavigate();

    const [auctions, setAuctions] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("latest");

    /* ---------- FETCH ---------- */
    const fetchAuctions = useCallback(
        async (nextPage = 1, reset = false) => {
            try {
                setLoading(true);

                const { sortBy, order } = getSortParams(sort);

                const res = await api.get(API_ENDPOINTS.Auction.GET_ALL, {
                    params: {
                        search: search || undefined,
                        status: status !== "all" ? status : undefined,
                        category: category || undefined,
                        page: nextPage,
                        auctionType: auctionType || undefined,
                        limit: limit || 10,
                        sortBy,
                        order,
                    },
                });

                const newData = res?.data?.data || [];

                setAuctions((prev) => (reset ? newData : [...prev, ...newData]));

                setHasMore(newData.length === (limit || 10));

                setPage(nextPage);
            } catch (err) {
                //console.log(err);
            } finally {
                setLoading(false);
            }
        },
        [search, status, sort, category, auctionType, limit],
    );

    /* ---------- REFETCH ---------- */
    useEffect(() => {
        fetchAuctions(1, true);
    }, [fetchAuctions]);

    /* ---------- LOAD MORE ---------- */
    const loadMore = () => {
        if (!hasMore || loading) return;

        fetchAuctions(page + 1);
    };

    return (
        <section
            className="
                max-w-[1400px] mx-auto
                px-3 sm:px-5 lg:px-6
                py-8 sm:py-10 lg:py-10
            "
        >
            {(heading || subheading) && (
                <div className="border-b border-blue-200 pb-5 sm:pb-6 mb-5">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-5 lg:gap-6">
                        <div className="max-w-2xl">
                            {heading && (
                                <div className="relative inline-block">
                                    <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-snug">
                                        {heading}
                                    </h2>
                                    <span className="absolute left-0 -bottom-2 w-16 sm:w-24 h-[2px] bg-blue-600/80 rounded-full" />
                                </div>
                            )}

                            {subheading && (
                                <p className="text-[13px] sm:text-base text-slate-600 mt-4 sm:mt-6 leading-relaxed border-l-2 border-blue-300 pl-3 sm:pl-4">
                                    {subheading}
                                </p>
                            )}
                        </div>

                        {exploreBtn && (
                            <div className="mt-1 sm:mt-0 flex items-center w-full lg:w-auto">
                                <button
                                    onClick={() =>
                                        navigate(
                                            explorePath
                                                ? explorePath
                                                : category
                                                  ? `/category/${category}`
                                                  : "/explore",
                                        )
                                    }
                                    className="
                        group w-full sm:w-auto
                        inline-flex items-center justify-center gap-2
                        px-4 sm:px-5 h-10 sm:h-11
                        rounded-xl bg-blue-600 text-white
                        text-[13px] sm:text-sm font-semibold
                        shadow-sm hover:bg-blue-700 hover:shadow-md
                        active:scale-[0.98] transition-all duration-200
                    "
                                >
                                    <span>Explore All</span>
                                    <ArrowRight
                                        size={15}
                                        className="transition-transform duration-200 group-hover:translate-x-1"
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {filtering && (
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-0 sm:px-2">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search auctions..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="
                        w-full h-11 sm:h-12
                        px-4 pr-11
                        rounded-xl bg-white
                        border border-blue-200
                        text-sm text-slate-800
                        placeholder:text-slate-400
                        focus:outline-none focus:border-blue-400
                        transition
                    "
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600">
                                <Search size={18} />
                            </span>
                        </div>

                        <div className="w-full sm:w-[160px]">
                            <Dropdown
                                value={status}
                                onChange={setStatus}
                                options={[
                                    { value: "all", label: "All Auctions" },
                                    { value: "active", label: "Live Auctions" },
                                    { value: "draft", label: "Draft Auctions" },
                                    { value: "ended", label: "Ended Auctions" },
                                ]}
                            />
                        </div>

                        <div className="w-full sm:w-[160px]">
                            <Dropdown
                                value={sort}
                                onChange={setSort}
                                options={[
                                    { value: "latest", label: "Latest" },
                                    { value: "price-low", label: "Price Low" },
                                    { value: "price-high", label: "Price High" },
                                ]}
                            />
                        </div>
                    </div>

                    <div className="mt-5 border-b border-blue-200" />
                </div>
            )}
            {/* ---------- GRID ---------- */}
            {auctions.length > 0 ? (
                <>
                    <div
                        className="
                              grid
        grid-cols-2
        sm:grid-cols-2
        md:grid-cols-3
                     lg:grid-cols-4
        xl:grid-cols-5
                       gap-3 sm:gap-5
                        "
                    >
                        {auctions.map((auction) => (
                            <AuctionCard key={auction._id} auction={auction} />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="flex justify-center mt-8 sm:mt-10">
                            <button
                                onClick={loadMore}
                                className="
                                    flex items-center gap-2
                                    text-sm font-medium
                                    text-slate-600 hover:text-slate-900
                                    transition
                                "
                            >
                                {loading ? "Loading..." : "Show more"}

                                <ChevronDown size={16} />
                            </button>
                        </div>
                    )}
                </>
            ) : loading ? (
                <div
                    className="
                        text-center
                        py-10 sm:py-12 px-4
                        bg-white rounded-2xl shadow-sm
                    "
                >
                    <div className="flex justify-center mb-6">
                        <motion.div
                            className="
                                w-12 h-12
                                border-4 border-[#E5E7EB]
                                border-t-[#2563EB]
                                rounded-full
                            "
                            animate={{ rotate: 360 }}
                            transition={{
                                repeat: Infinity,
                                duration: 0.9,
                                ease: "linear",
                            }}
                        />
                    </div>

                    <h2 className="text-lg sm:text-xl font-semibold text-[#1F2937]">Loading...</h2>
                </div>
            ) : (
                <div
                    className="
                        text-center
                        py-10 sm:py-12 px-4
                        bg-white rounded-2xl shadow-sm
                    "
                >
                    <p className="text-sm sm:text-base text-slate-500">No auctions found</p>
                </div>
            )}
        </section>
    );
}
