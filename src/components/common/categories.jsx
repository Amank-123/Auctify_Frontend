import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuctionsGrid from "@/features/home/pages/AuctionsGrid.jsx";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";

export default function CategoryAuctionsPage() {
    const { category } = useParams();
    const navigate = useNavigate();

    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    const categoryName = category?.charAt(0).toUpperCase() + category?.slice(1);

    useEffect(() => {
        const fetchCategoryAuctions = async () => {
            try {
                setLoading(true);

                const res = await api.get(API_ENDPOINTS.Auction.GET_ALL, {
                    params: {
                        page: 1,
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

    return (
        <section className="min-h-screen bg-[#F8F8FF] py-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Breadcrumb */}
                <div className="text-sm text-slate-400 mb-6">
                    <button
                        onClick={() => navigate("/")}
                        className="hover:text-blue-600 transition"
                    >
                        Home
                    </button>

                    <span className="mx-2">/</span>

                    <button
                        onClick={() => navigate("/explore")}
                        className="hover:text-blue-600 transition"
                    >
                        Explore
                    </button>

                    <span className="mx-2">/</span>

                    <span className="text-slate-700 font-medium">{categoryName}</span>
                </div>

                {/* Header */}
                <div className="rounded-[34px] bg-white border border-slate-200 p-10 mb-10 shadow-sm">
                    <p className="text-xs uppercase tracking-[3px] text-blue-600 font-bold">
                        Category Collection
                    </p>

                    <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-900">
                        {categoryName} Auctions
                    </h1>

                    <p className="mt-4 text-lg text-slate-500 max-w-2xl leading-8">
                        Explore premium {categoryName.toLowerCase()} listings with real-time bidding
                        and trusted sellers on Auctify.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-4">
                        <div className="px-5 py-3 rounded-2xl bg-[#F8F8FF] border border-slate-200">
                            <p className="text-xs text-slate-400 uppercase tracking-[2px]">
                                Total Auctions
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                {auctions.length}
                            </p>
                        </div>

                        <div className="px-5 py-3 rounded-2xl bg-[#F8F8FF] border border-slate-200">
                            <p className="text-xs text-slate-400 uppercase tracking-[2px]">
                                Category
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-900">{categoryName}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center">
                        <h3 className="text-2xl font-semibold text-slate-900">
                            Loading Auctions...
                        </h3>
                    </div>
                ) : (
                    <AuctionsGrid
                        filteredAuctions={auctions}
                        showAll={true}
                        title={`${categoryName} Auctions`}
                        subtitle={`Browse all ${categoryName.toLowerCase()} auctions available right now.`}
                    />
                )}
            </div>
        </section>
    );
}
