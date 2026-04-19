/* =========================================
   AuctionsGrid.jsx
   Reusable Grid with Redirect Button
========================================= */

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuctionCard from "@/components/common/AuctionCard.jsx";

export default function AuctionsGrid({ auctions, title, subtitle, initialLimit, showAll }) {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("latest");

    /* defaults if no props passed */
    const sectionTitle = title || "Explore Auctions";
    const sectionSubtitle = subtitle || "Search, filter and discover premium live auctions.";

    const limit = initialLimit || 8;

    const filteredAuctions = useMemo(() => {
        let data = [...auctions];

        /* Search */
        if (search.trim()) {
            data = data.filter((item) =>
                (item?.name || "").toLowerCase().includes(search.toLowerCase()),
            );
        }

        /* Filter */
        if (status !== "all") {
            data = data.filter(
                (item) =>
                    String(item?.status || "draft")
                        .trim()
                        .toLowerCase() === status,
            );
        }

        /* Sort */
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

        if (sort === "bids") {
            data.sort((a, b) => (b.bidCount || 0) - (a.bidCount || 0));
        }

        if (sort === "latest") {
            data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        }

        return data;
    }, [auctions, search, status, sort]);

    const visibleAuctions = showAll ? filteredAuctions : filteredAuctions.slice(0, limit);

    return (
        <section className="max-w-7xl mx-auto px-6 py-16">
            {/* Heading */}
            <div className="mb-10">
                <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
                    {sectionTitle}
                </h2>

                <p className="mt-2 text-slate-500">{sectionSubtitle}</p>
            </div>

            {/* Filters */}
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
                    <option value="draft">Draft Auctions</option>
                    <option value="active">Live Auctions</option>
                    <option value="ended">Ended Auctions</option>
                    <option value="expired">Expired Auctions</option>
                </select>

                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-12 rounded-2xl border border-slate-200 bg-white px-4 outline-none"
                >
                    <option value="latest">Latest First</option>
                    <option value="price-low">Price Low to High</option>
                    <option value="price-high">Price High to Low</option>
                    <option value="bids">Most Bids</option>
                </select>
            </div>

            {/* Count */}
            <p className="mb-6 text-sm font-medium text-slate-500">
                Showing {visibleAuctions.length} of {filteredAuctions.length} auctions
            </p>

            {/* Grid */}
            {visibleAuctions.length > 0 ? (
                <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {visibleAuctions.map((item) => (
                            <AuctionCard key={item._id} auction={item} />
                        ))}
                    </div>

                    {/* Redirect Button only homepage */}
                    {!showAll && filteredAuctions.length > limit && (
                        <div className="mt-10 text-center">
                            <button
                                onClick={() => navigate("/explore")}
                                className="px-8 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                            >
                                Show All Auctions
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white border border-slate-200 rounded-3xl p-14 text-center">
                    <h3 className="text-2xl font-semibold text-slate-900">No Auctions Found</h3>

                    <p className="mt-2 text-slate-500">Try changing search or filter options.</p>
                </div>
            )}
        </section>
    );
}
