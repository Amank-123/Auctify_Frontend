import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { bidAPI } from "../auctionAPI";
import defaultImg from "@/assets/default.png";

export function BidHistory({ auctionId }) {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const data = await bidAPI.getByAuction(auctionId);

                const sorted = [...data].sort((a, b) => b.amount - a.amount);

                setBids(sorted);
            } catch (err) {
                console.error("Failed to fetch bids:", err);
                setBids([]);
            } finally {
                setLoading(false);
            }
        };

        if (auctionId) fetchBids();
    }, [auctionId]);

    if (loading) {
        return <div className="p-4 text-sm">Loading bids...</div>;
    }

    if (bids.length === 0) {
        return (
            <div className="rounded-[24px] bg-white border border-slate-200/80 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-bold text-slate-900">Bid History</h3>

                    <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                        {bids.length} bids
                    </span>
                </div>

                <div className="w-full justify-center items-center ">
                    <h3 className="align-middle m-auto font-medium">No Bids yet</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-[24px] bg-white border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-slate-900">Bid History</h3>

                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    {bids.length} bids
                </span>
            </div>

            <div className="space-y-1">
                {bids.map((bid, i) => {
                    const isHighest = i === 0;

                    return (
                        <motion.div
                            key={bid._id}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`flex items-center justify-between py-3 ${
                                i !== bids.length - 1 ? "border-b border-slate-100" : ""
                            }`}
                        >
                            {/* LEFT */}
                            <div className="flex gap-3">
                                <img
                                    src={bid.userId?.profile || defaultImg}
                                    className="w-11 h-11 rounded-4xl "
                                    alt="user profile"
                                />

                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {bid.userId?.username || `User-${bid.userId?.slice(-4)}`}
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        {new Date(bid.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="text-right">
                                <p
                                    className={`text-sm font-bold ${
                                        isHighest ? "text-blue-600" : "text-slate-700"
                                    }`}
                                >
                                    ₹{bid.amount.toLocaleString("en-IN")}
                                </p>

                                {isHighest && (
                                    <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                        Highest
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
