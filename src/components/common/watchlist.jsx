import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Clock3, Loader2, Trash2 } from "lucide-react";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";

export default function Watchlist() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const fetchWatchlist = async () => {
        try {
            setLoading(true);

            const res = await api.get(API_ENDPOINTS.User.FETCH_WATCHLIST);

            setItems(res?.data?.data || []);
        } catch (error) {
            console.log(error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const removeWatchlist = async (id) => {
        try {
            await api.post(API_ENDPOINTS.User.TOGGLE_WATCHLIST(id));

            setItems((prev) => prev.filter((item) => item._id !== id));
        } catch (error) {
            console.log(error);
        }
    };

    const formatPrice = (value) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(value || 0);
    };
    const getTimeLeft = (endDate) => {
        if (!endDate) return "N/A";

        const now = new Date();
        const end = new Date(endDate);

        const diff = end - now;

        if (diff <= 0) return "Ended";

        const days = Math.floor(diff / 1000 / 60 / 60 / 24);

        const hours = Math.floor((diff / 1000 / 60 / 60) % 24);

        const mins = Math.floor((diff / 1000 / 60) % 60);

        if (days > 0) {
            return `${days}d ${hours}h`;
        }

        return `${hours}h ${mins}m`;
    };

    return (
        <div className="min-h-screen bg-[#F8F8FF] px-4 md:px-6 py-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-500">
                        <Heart size={22} />
                    </div>

                    <div>
                        <h1 className="text-3xl font-semibold text-[#1F2937]">Your Watchlist</h1>

                        <p className="text-gray-500 text-sm mt-1">Saved auctions you’re tracking</p>
                    </div>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-[#2563EB]" />
                    </div>
                ) : items.length === 0 ? (
                    /* Empty */
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                        <Heart className="mx-auto text-gray-300 mb-4" />

                        <h3 className="text-xl font-semibold text-gray-700">No Watchlist Items</h3>

                        <p className="text-gray-500 mt-2">Start saving auctions you love.</p>

                        <button
                            onClick={() => navigate("/categories")}
                            className="mt-5 bg-[#2563EB] text-white px-5 py-2 rounded-lg hover:bg-[#1D4ED8]"
                        >
                            Explore Auctions
                        </button>
                    </div>
                ) : (
                    /* Cards */
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border"
                            >
                                {/* Image */}
                                <img
                                    src={
                                        item.media?.[0] ||
                                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
                                    }
                                    alt={item.title}
                                    className="w-full h-52 object-cover"
                                />

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="font-semibold text-lg text-[#1F2937] line-clamp-1">
                                        {item.title}
                                    </h3>

                                    <p className="text-[#C2410C] font-bold text-xl mt-2">
                                        {formatPrice(item.currentBid || item.startPrice)}
                                    </p>

                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                                        <Clock3 size={15} />
                                        {getTimeLeft(item.endTime)} left
                                    </div>

                                    <div className="flex items-center justify-between mt-5 gap-3">
                                        <button
                                            onClick={() => removeWatchlist(item._id)}
                                            className="flex items-center justify-center gap-2 border px-4 py-2 rounded-lg text-gray-600 hover:text-red-500 hover:border-red-300 transition w-full"
                                        >
                                            <Trash2 size={16} />
                                            Remove
                                        </button>

                                        <button
                                            onClick={() => navigate(`/auction/${item._id}`)}
                                            className="bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1D4ED8] transition w-full"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
