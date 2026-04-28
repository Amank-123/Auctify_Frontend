import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { bidAPI } from "../auctionAPI";
import { useAuth } from "../../../hooks/useAuth";

export function BidPanel({ canBid, currentBid, bidCount, status, auctionId }) {
    const navigate = useNavigate();
    const [bidAmount, setBidAmount] = useState("");
    const [bidMsg, setBidMsg] = useState(null);
    const [bidSuccess, setBidSuccess] = useState(false);

    async function handleBid() {
        try {
            const val = parseFloat(String(bidAmount).replace(/,/g, ""));
            const min = currentBid + 500;

            if (!val || val < min) {
                setBidMsg(`Minimum bid is ₹${min.toLocaleString("en-IN")}`);
                setBidSuccess(false);
                setTimeout(() => setBidMsg(null), 2800);
                return;
            }

            const res = await bidAPI.placeBid({
                auctionId,
                amount: val,
            });

            setBidMsg(`Bid of ₹${val.toLocaleString("en-IN")} placed successfully!`);
            setBidSuccess(true);
            setBidAmount("");

            // OPTIONAL: refresh UI (you should do this properly later)
            // e.g. refetch auction or update state from response
        } catch (err) {
            setBidMsg(err?.response?.data?.message || "Failed to place bid");
            setBidSuccess(false);
        } finally {
            setTimeout(() => setBidMsg(null), 3000);
        }
    }

    return (
        <div className="rounded-[28px] bg-white border border-slate-200/80 p-7 shadow-sm">
            {/* Price row */}
            <div className="flex items-start justify-between mb-5">
                <div>
                    <p className="text-[10px] uppercase tracking-[2.5px] text-slate-400 font-bold mb-2">
                        Current Highest Bid
                    </p>
                    <h2 className="text-4xl font-black text-slate-900 tabular-nums">
                        ₹{currentBid.toLocaleString("en-IN")}
                    </h2>
                </div>
                <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[2.5px] text-slate-400 font-bold mb-2">
                        Total Bids
                    </p>
                    <h3 className="text-3xl font-black text-slate-900">{bidCount || 0}</h3>
                </div>
            </div>

            {/* Reserve bar */}
            {/* <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "72%" }}
                    transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                />
            </div>
            <p className="text-xs text-slate-400 font-medium mb-6">72% of reserve met</p> */}

            {/* Bid input — only shown when auction is active */}
            {status === "active" && canBid && (
                <div className="space-y-3">
                    {/* <label className="block text-xs font-semibold text-slate-600 uppercase tracking-[1.5px]">
                        Your bid amount
                    </label>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                                ₹
                            </span>
                            <input
                                type="number"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleBid()}
                                placeholder={String(currentBid + 500)}
                                className="w-full pl-8 pr-4 h-12 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-slate-300"
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={handleBid}
                            className="px-6 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-sm shadow-lg shadow-blue-200 transition flex-shrink-0"
                        >
                            Place Bid
                        </motion.button>
                    </div>

                    {/* Feedback message */}
                    {/* <AnimatePresence>
                        {bidMsg && (
                            <motion.p
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`text-xs font-semibold text-center py-2 px-4 rounded-xl ${
                                    bidSuccess
                                        ? "bg-green-50 text-green-600"
                                        : "bg-red-50 text-red-500"
                                }`}
                            >
                                {bidMsg}
                            </motion.p>
                        )}
                    </AnimatePresence> */}

                    {/* Join live */}
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/auction/live/${auctionId}`)}
                        className="w-full h-12 rounded-2xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-sm transition flex items-center justify-center gap-2"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-60" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                        </span>
                        Join Live Auction
                    </motion.button>
                </div>
            )}

            {status !== "active" && (
                <button className="w-full h-12 rounded-2xl bg-slate-800 text-white font-bold text-sm hover:bg-slate-900 transition">
                    View Auction
                </button>
            )}
        </div>
    );
}
