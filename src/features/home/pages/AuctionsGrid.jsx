import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuctionCard from "@/components/common/AuctionCard.jsx";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";

export default function AuctionsGrid({ title, subtitle, initialLimit, showAll }) {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("latest");

    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(false);

    const sectionTitle = title || "Explore Auctions";
    const sectionSubtitle = subtitle || "Search, filter and discover premium live auctions.";

    const limit = initialLimit || 8;

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                setLoading(true);

                const res = await api.get(API_ENDPOINTS.Auction.GET_ALL, {
                    params: {
                        search: search || undefined,
                        status: status === "all" ? undefined : status,
                        page: 1,
                        limit: showAll ? 50 : limit,
                        sortBy: "createdAt",
                        order: sort === "latest" ? "desc" : "asc",
                    },
                });

                setAuctions(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, [search, status, sort]);

    const processedAuctions = useMemo(() => {
        let data = [...auctions];

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

        return data;
    }, [auctions, sort]);

    const visibleAuctions = showAll ? processedAuctions : processedAuctions.slice(0, limit);

    return (
        <section className="max-w-7xl mx-auto px-6 py-16">
            {/* Heading */}
            <div className="mb-10">
                <h2 className="text-4xl font-semibold text-slate-900">{sectionTitle}</h2>
                <p className="mt-2 text-slate-500">{sectionSubtitle}</p>
            </div>

            {/* Filters */}
            <div className="grid lg:grid-cols-3 gap-4 mb-8">
                {/* Search */}
                <input
                    type="text"
                    placeholder="Search auctions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-12 rounded-2xl border px-4"
                />

                {/* Status */}
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="h-12 rounded-2xl border px-4"
                >
                    <option value="all">All Auctions</option>
                    <option value="draft">Draft</option>
                    <option value="active">Live</option>
                    <option value="ended">Ended</option>
                    <option value="expired">Expired</option>
                </select>

                {/* Sort */}
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-12 rounded-2xl border px-4"
                >
                    <option value="latest">Latest First</option>
                    <option value="price-low">Price Low</option>
                    <option value="price-high">Price High</option>
                </select>
            </div>

            {/* Loading */}
            {loading && <p className="text-center text-gray-500">Loading auctions...</p>}

            {/* Grid */}
            {!loading && visibleAuctions.length > 0 ? (
                <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {visibleAuctions.map((item) => (
                            <AuctionCard key={item._id} auction={item} />
                        ))}
                    </div>

                    {!showAll && processedAuctions.length > limit && (
                        <div className="mt-10 text-center">
                            <button
                                onClick={() => navigate("/explore")}
                                className="px-8 h-12 rounded-2xl bg-blue-600 text-white"
                            >
                                Show All Auctions
                            </button>
                        </div>
                    )}
                </>
            ) : (
                !loading && (
                    <div className="text-center">
                        <h3 className="text-xl font-semibold">No Auctions Found</h3>
                        <p className="text-gray-500">Try changing search or filters</p>
                    </div>
                )
            )}
        </section>
    );
}
