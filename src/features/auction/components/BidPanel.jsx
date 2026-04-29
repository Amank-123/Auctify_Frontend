import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { bidAPI } from "../auctionAPI";
import { Countdown } from "./Countdown";
import { Calendar, Gavel, Lock, Heart } from "lucide-react";

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
                    <p className="text-sm font-bold uppercase tracking-[2px] text-sm text-slate-600 mb-4">
                        Auction Starts In
                    </p>
                    <Countdown endTime={startTime} />
                </div>

                <div className="p-4 mx-4 my-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 text-[#2563EB]">
                        <Calendar size={18} />
                    </div>
                    <div>
                        <p className="text-sm text-sm text-slate-600">Auction starts on</p>
                        <p className="text-sm font-bold text-slate-900 font-semibold">
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
                        <p className="text-sm text-slate-600 mt-1">
                            You will be able to place bids once the auction begins.
                        </p>
                    </div>
                </div>

                <div className="px-4 pb-4">
                    <button className="w-full h-12 rounded-xl border-2 border-[#2563EB] text-[#2563EB] font-semibold text-[15px] hover:bg-[#EFF6FF] transition flex items-center justify-center gap-2">
                        <Heart size={18} />
                        Add to Watchlist
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
                    <p className="text-sm font-bold uppercase tracking-[2px] text-green-600 mb-1 flex items-center justify-center gap-2">
                        <Trophy size={18} />
                        Auction Ended
                    </p>
                    <p className="text-4xl font-black text-green-600">SOLD</p>
                </div>

                {winner && (
                    <div className="p-4 mx-4 my-3 rounded-xl bg-slate-50 border border-slate-200">
                        <p className="text-xs uppercase tracking-[2px] text-slate-600 font-bold mb-3">
                            Winner
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                {winner.userId?.username?.slice(0, 2).toUpperCase() || "?"}
                            </div>
                            <div>
                                <p className="text-base  text-slate-900 font-semibold">
                                    {winner.userId?.username || "Unknown"}
                                </p>
                                <p className="text-lg font-black text-green-600">
                                    Rs.{winner.amount?.toLocaleString("en-IN")}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3 px-4 pb-3">
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                        <p className=" text-sm font-semibold text-slate-500 uppercase tracking-[1.5px] ">
                            Final Bid (Winning)
                        </p>
                        <p className="text-sm  text-slate-900 font-semibold mt-1">
                            Rs.{(winner?.amount || currentBid).toLocaleString("en-IN")}
                        </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                        <p className="text-xs uppercase tracking-[1.5px] text-slate-600 font-semibold">
                            Total Bids
                        </p>
                        <p className="text-base  text-slate-900 font-semibold mt-1">
                            {bidCount || 0}
                        </p>
                    </div>
                </div>

                <div className="px-4 pb-4">
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 flex items-center gap-3">
                        <span className="text-slate-600 text-sm">
                            <Calendar size={18} />
                        </span>
                        <div>
                            <p className="text-xs text-slate-600">Auction ended on</p>
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
                    <button className="w-full h-12 rounded-xl border-2 border-slate-200 text-[#1F2937] font-semibold text-[15px] hover:bg-slate-50 transition flex items-center justify-center gap-2">
                        <Heart size={18} /> Add to Watchlist
                    </button>
                </div>
            </div>
        );
    }

    /* ── ACTIVE / LIVE ── */
    return (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
                <p className="text-sm font-bold uppercase tracking-[2px] text-sm text-slate-600 mb-3">
                    Auction Ends In
                </p>
                <Countdown endTime={endTime} />
            </div>

            <div className="p-5 space-y-2">
                <div>
                    <p className="text-xs uppercase tracking-[2px] text-slate-600 font-bold mb-1">
                        Current Highest Bid
                    </p>
                    <p className="text-4xl font-black text-slate-900 font-semibold tabular-nums">
                        Rs.{currentBid.toLocaleString("en-IN")}
                    </p>
                    <p className="text-sm text-slate-600 mt-4">
                        Minimum next bid: Rs.{(currentBid + 500).toLocaleString("en-IN")}
                    </p>
                </div>

                {canBid && (
                    <div className="space-y-3">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 font-bold text-[22px]">
                                Rs.
                            </span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleBid()}
                                className="w-full pl-14 pr-5 h-14 text-xl rounded-xl border-1  bg-blue-50/30 text-slate-900 font-semibold focus:outline-none focus:ring-1  transition"
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
                                    className="h-11 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-bold hover:bg-slate-50 hover:border-blue-300 transition"
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
                            className="w-full h-12 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-base font-semibold transition flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            <Gavel size={18} /> {placing ? "Placing..." : "Place Bid"}
                        </motion.button>

                        <p className="text-center text-sm text-slate-500 flex items-center justify-center gap-2">
                            <Lock size={16} />
                            All bids are secure and encrypted
                        </p>

                        {/* Simple conditional render — no AnimatePresence to avoid framer rerender loops */}
                        {bidMsg && (
                            <p
                                className={`text-sm font-semibold text-center py-2.5 px-4 rounded-xl ${
                                    bidSuccess
                                        ? "bg-green-50 text-green-600"
                                        : "bg-red-50 text-red-500"
                                }`}
                            >
                                {bidMsg}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
