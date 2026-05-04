import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ArrowRight } from "lucide-react";

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
        <div className="relative">
            <button
                onClick={() => setOpen((p) => !p)}
                className="w-full h-11 px-4 flex items-center justify-between rounded-xl bg-white shadow-sm hover:shadow-md transition"
            >
                <span className="text-sm font-medium text-slate-700">{selected?.label}</span>
                <ChevronDown size={16} className="text-slate-400" />
            </button>

            {open && (
                <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-xl overflow-hidden">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className={`
                                w-full text-left px-4 py-2 text-sm transition
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
export default function AuctionsGrid({ heading, subheading, limit }) {
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
                        page: nextPage,
                        limit: limit || 12,
                        sortBy,
                        order,
                    },
                });

                const newData = res?.data?.data || [];

                setAuctions((prev) => (reset ? newData : [...prev, ...newData]));

                setHasMore(newData.length === limit);
                setPage(nextPage);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        },
        [search, status, sort],
    );

    /* ---------- REFETCH ---------- */
    useEffect(() => {
        fetchAuctions(1, true);
    }, [search, status, sort]);

    const loadMore = () => {
        if (!hasMore || loading) return;
        fetchAuctions(page + 1);
    };

    return (
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 py-12">
            {/* HEADER */}
            {(heading || subheading) && (
                <div className="flex items-center justify-between mb-6">
                    <div>
                        {heading && (
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
                                {heading}
                            </h2>
                        )}

                        {subheading && <p className="text-sm text-slate-500 mt-1">{subheading}</p>}
                    </div>

                    <button
                        onClick={() => navigate("/explore")}
                        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        Explore All
                        <ArrowRight size={16} />
                    </button>
                </div>
            )}

            {/* FILTERS */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8 bg-slate-50 p-3 rounded-2xl shadow-sm">
                <input
                    type="text"
                    placeholder="Search auctions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 h-11 px-4 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-100 outline-none"
                />

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

            {/* GRID */}
            {auctions.length > 0 ? (
                <>
                    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
                        {auctions.map((a) => (
                            <AuctionCard key={a._id} auction={a} />
                        ))}
                    </div>

                    {hasMore ? (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={loadMore}
                                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                            >
                                {loading ? "Loading..." : "Show more"}
                                <ChevronDown size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center mt-8">
                            <div
                                onClick={loadMore}
                                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                            >
                                No more auctions
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                    <p className="text-slate-500">No auctions found</p>
                </div>
            )}
        </section>
    );
}
