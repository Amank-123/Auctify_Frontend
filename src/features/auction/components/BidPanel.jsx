import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { bidAPI } from "../auctionAPI";
import { Countdown } from "./Countdown";

export function BidPanel({
    canBid,
    currentBid,
    bidCount,
    status,
    auctionId,
    endTime,
    startTime,
    highestBidder,
    navigate,
}) {
    const [bidAmount, setBidAmount] = useState(() => currentBid + 100000);
    const [bidMsg, setBidMsg] = useState(null);
    const [bidSuccess, setBidSuccess] = useState(false);
    const [placing, setPlacing] = useState(false);

    // Sync bidAmount when currentBid changes from parent — guarded by ref to avoid loops
    const prevCurrentBid = useRef(currentBid);
    useEffect(() => {
        if (prevCurrentBid.current !== currentBid) {
            prevCurrentBid.current = currentBid;
            setBidAmount(currentBid + 100000);
        }
    }, [currentBid]);

    // Single timer ref — cleared before each new message so timers never double-fire
    const msgTimerRef = useRef(null);

    const showMsg = useCallback((msg, success) => {
        // Cancel any existing timer before setting a new one
        if (msgTimerRef.current) clearTimeout(msgTimerRef.current);
        setBidMsg(msg);
        setBidSuccess(success);
        msgTimerRef.current = setTimeout(() => {
            setBidMsg(null);
            msgTimerRef.current = null;
        }, 3000);
    }, []);

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (msgTimerRef.current) clearTimeout(msgTimerRef.current);
        };
    }, []);

    const addAmount = useCallback(
        (delta) => {
            setBidAmount((prev) => (parseFloat(prev) || currentBid) + delta);
        },
        [currentBid],
    );

    // Stable handleBid — won't be recreated on every render
    const handleBid = useCallback(async () => {
        if (placing) return; // guard against double-clicks
        const val = parseFloat(String(bidAmount).replace(/,/g, ""));
        const min = currentBid + 500;

        if (!val || val < min) {
            showMsg("Minimum bid is Rs." + min.toLocaleString("en-IN"), false);
            return;
        }

        try {
            setPlacing(true);
            await bidAPI.placeBid({ auctionId, amount: val });
            showMsg("Bid of Rs." + val.toLocaleString("en-IN") + " placed successfully!", true);
            // Do NOT setBidAmount here — let the parent's updated currentBid prop
            // flow back through the useEffect above to avoid cascading state updates
        } catch (err) {
            showMsg(err?.response?.data?.message || "Failed to place bid", false);
        } finally {
            setPlacing(false);
        }
    }, [placing, bidAmount, currentBid, auctionId, showMsg]);

    /* ── NOT STARTED ── */
    if (status === "draft" || status === "upcoming") {
        return (
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <p className="text-xs font-bold uppercase tracking-[2px] text-slate-500 mb-4">
                        Auction Starts In
                    </p>
                    <Countdown endTime={startTime} />
                </div>

                <div className="p-4 mx-4 my-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 text-sm">
                        📅
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Auction starts on</p>
                        <p className="text-sm font-bold text-slate-900">
                            {startTime
                                ? new Date(startTime).toLocaleString("en-IN", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                  })
                                : "—"}
                        </p>
                    </div>
                </div>

                <div className="px-4 pb-3">
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                        <p className="text-sm font-semibold text-slate-700">
                            Be ready! This auction will start soon.
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            You will be able to place bids once the auction begins.
                        </p>
                    </div>
                </div>

                <div className="px-4 pb-4">
                    <button className="w-full h-11 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition flex items-center justify-center gap-2">
                        ♡ Add to Watchlist
                    </button>
                </div>
            </div>
        );
    }

    /* ── ENDED ── */
    if (status === "ended" || status === "expired") {
        const winner = highestBidder;
        return (
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 bg-green-50 border-b border-green-100 text-center">
                    <p className="text-xs font-bold uppercase tracking-[2px] text-green-600 mb-1">
                        🏆 Auction Ended
                    </p>
                    <p className="text-3xl font-black text-green-600">SOLD</p>
                </div>

                {winner && (
                    <div className="p-4 mx-4 my-3 rounded-xl bg-slate-50 border border-slate-200">
                        <p className="text-[10px] uppercase tracking-[2px] text-slate-400 font-bold mb-3">
                            Winner
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                {winner.userId?.username?.slice(0, 2).toUpperCase() || "?"}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">
                                    {winner.userId?.username || "Unknown"}
                                </p>
                                <p className="text-base font-black text-green-600">
                                    Rs.{winner.amount?.toLocaleString("en-IN")}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3 px-4 pb-3">
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                        <p className="text-[10px] uppercase tracking-[1.5px] text-slate-400 font-semibold">
                            Final Bid (Winning)
                        </p>
                        <p className="text-sm font-bold text-slate-900 mt-1">
                            Rs.{(winner?.amount || currentBid).toLocaleString("en-IN")}
                        </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                        <p className="text-[10px] uppercase tracking-[1.5px] text-slate-400 font-semibold">
                            Total Bids
                        </p>
                        <p className="text-sm font-bold text-slate-900 mt-1">{bidCount || 0}</p>
                    </div>
                </div>

                <div className="px-4 pb-4">
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 flex items-center gap-3">
                        <span className="text-slate-400 text-sm">📅</span>
                        <div>
                            <p className="text-[10px] text-slate-400">Auction ended on</p>
                            <p className="text-sm font-bold text-slate-700">
                                {endTime
                                    ? new Date(endTime).toLocaleString("en-IN", {
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      })
                                    : "—"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-4 pb-4">
                    <button className="w-full h-11 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2">
                        ♡ Add to Watchlist
                    </button>
                </div>
            </div>
        );
    }

    /* ── ACTIVE / LIVE ── */
    return (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
                <p className="text-xs font-bold uppercase tracking-[2px] text-slate-500 mb-3">
                    Auction Ends In
                </p>
                <Countdown endTime={endTime} />
            </div>

            <div className="p-5 space-y-4">
                <div>
                    <p className="text-[10px] uppercase tracking-[2px] text-slate-400 font-bold mb-1">
                        Current Highest Bid
                    </p>
                    <p className="text-3xl font-black text-slate-900 tabular-nums">
                        Rs.{currentBid.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                        Minimum next bid: Rs.{(currentBid + 500).toLocaleString("en-IN")}
                    </p>
                </div>

                {canBid ? (
                    <div className="space-y-3">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                                Rs.
                            </span>
                            <input
                                type="number"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleBid()}
                                className="w-full pl-10 pr-4 h-12 rounded-xl border-2 border-blue-200 bg-blue-50/30 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {[
                                [10000, "+ Rs.10,000"],
                                [50000, "+ Rs.50,000"],
                                [100000, "+ Rs.1,00,000"],
                            ].map(([delta, label]) => (
                                <button
                                    key={delta}
                                    onClick={() => addAmount(delta)}
                                    className="h-10 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:border-blue-300 transition"
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleBid}
                            disabled={placing}
                            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            🔨 {placing ? "Placing..." : "Place Bid"}
                        </motion.button>

                        <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
                            🔒 All bids are secure and encrypted
                        </p>

                        {/* Simple conditional render — no AnimatePresence to avoid framer rerender loops */}
                        {bidMsg && (
                            <p
                                className={`text-xs font-semibold text-center py-2 px-4 rounded-xl ${
                                    bidSuccess
                                        ? "bg-green-50 text-green-600"
                                        : "bg-red-50 text-red-500"
                                }`}
                            >
                                {bidMsg}
                            </p>
                        )}
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 text-center py-2">
                        You cannot bid on your own auction.
                    </p>
                )}
            </div>
        </div>
    );
}
