import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuctionCard from "@/components/common/AuctionCard.jsx";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";

export default function AuctionsGrid({
    title = "Explore Auctions",
    subtitle = "Search, filter and discover premium live auctions.",
    initialLimit = 8,
    showAll = false,

    auctions: externalAuctions = null,

    showFilters = true,

    showAllRoute = "/explore",
}) {
    const navigate = useNavigate();

    const usingExternal = Array.isArray(externalAuctions);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("latest");

    const [internalAuctions, setInternalAuctions] = useState([]);
    const [loading, setLoading] = useState(false);

    const auctions = usingExternal ? externalAuctions : internalAuctions;

    /* fetch only if no external auctions */
    useEffect(() => {
        if (usingExternal) return;

        const fetchAuctions = async () => {
            try {
                setLoading(true);

                const res = await api.get(API_ENDPOINTS.Auction.GET_ALL, {
                    params: {
                        search: search || undefined,
                        status: status === "all" ? undefined : status,
                        page: 1,
                        limit: showAll ? 100 : initialLimit,
                        sortBy: "createdAt",
                        order: sort === "latest" ? "desc" : "asc",
                    },
                });

                setInternalAuctions(res?.data?.data || []);
            } catch (error) {
                console.log(error);
                setInternalAuctions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, [usingExternal, search, status, sort, showAll, initialLimit]);

    /* local filtering + sorting */
    const processedAuctions = useMemo(() => {
        let data = [...auctions];

        if (usingExternal) {
            if (search.trim()) {
                data = data.filter((item) =>
                    item?.name?.toLowerCase().includes(search.toLowerCase()),
                );
            }

            if (status !== "all") {
                data = data.filter((item) => item?.status === status);
            }
        }

        if (sort === "price-low") {
            data.sort(
                (a, b) =>
                    (a.currentHighestBid || a.startPrice || 0) -
                    (b.currentHighestBid || b.startPrice || 0),
            );
        }

        if (sort === "price-high") {
            data.sort(
                (a, b) =>
                    (b.currentHighestBid || b.startPrice || 0) -
                    (a.currentHighestBid || a.startPrice || 0),
            );
        }

        if (sort === "latest") {
            data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        }

        return data;
    }, [auctions, usingExternal, search, status, sort]);

    const visibleAuctions = showAll ? processedAuctions : processedAuctions.slice(0, initialLimit);

    return (
        <section className="max-w-7xl mx-auto px-6 py-16">
            {/* heading */}
            <div className="mb-10">
                <h2 className="text-4xl font-semibold text-slate-900">{title}</h2>

                <p className="mt-2 text-slate-500">{subtitle}</p>
            </div>

            {/* filters */}
            {showFilters && (
                <div className="grid lg:grid-cols-3 gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Search auctions..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-12 rounded-2xl border border-slate-200 bg-white px-4 outline-none"
                    />

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="h-12 rounded-2xl border border-slate-200 bg-white px-4 outline-none"
                    >
                        <option value="all">All Auctions</option>
                        <option value="draft">Draft</option>
                        <option value="active">Live</option>
                        <option value="ended">Ended</option>
                        <option value="expired">Expired</option>
                    </select>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="h-12 rounded-2xl border border-slate-200 bg-white px-4 outline-none"
                    >
                        <option value="latest">Latest First</option>
                        <option value="price-low">Price Low</option>
                        <option value="price-high">Price High</option>
                    </select>
                </div>
            )}

            {/* count */}
            {!loading && (
                <p className="mb-6 text-sm text-slate-500">
                    Showing {visibleAuctions.length} auctions
                </p>
            )}

            {/* loading */}
            {loading ? (
                <div className="text-center py-10 text-slate-500">Loading auctions...</div>
            ) : visibleAuctions.length > 0 ? (
                <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {visibleAuctions.map((item) => (
                            <AuctionCard key={item._id} auction={item} />
                        ))}
                    </div>

                    {!showAll && processedAuctions.length > initialLimit && (
                        <div className="mt-10 text-center">
                            <button
                                onClick={() => navigate(showAllRoute)}
                                className="px-8 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                            >
                                Show All Auctions
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-200 p-14 text-center">
                    <h3 className="text-2xl font-semibold text-slate-900">No Auctions Found</h3>

                    <p className="mt-2 text-slate-500">Try changing search or filters.</p>
                </div>
            )}
        </section>
    );
}
