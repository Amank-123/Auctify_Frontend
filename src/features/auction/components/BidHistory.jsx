import { useEffect } from "react";
import { motion } from "framer-motion";
import defaultImg from "@/assets/default.png";
import socket from "../../../shared/services/socket";

export function BidHistory({ auctionId, bids, setBids, loading, status }) {
    useEffect(() => {
        if (status !== "active") return;

        socket.connect();
        socket.emit("join_auction", auctionId);

        socket.on("event", (data) => {
            if (data?.type !== "BID_CREATED" || !data?.payload) return;

            const incoming = data.payload;

            // Normalize the incoming bid so it always has a safe shape.
            // Socket payloads are plain objects — userId may be just an ID string,
            // not a populated object. Normalizing here prevents .slice / .username
            // crashes that cause recursive re-render loops.
            const normalizedBid = {
                ...incoming,
                _id: incoming._id ?? `temp-${Date.now()}`,
                amount: incoming.amount ?? 0,
                createdAt: incoming.createdAt ?? new Date().toISOString(),
                userId:
                    incoming.userId && typeof incoming.userId === "object"
                        ? incoming.userId // already populated
                        : { _id: String(incoming.userId ?? ""), username: null, profile: null },
            };

            setBids((prev) => {
                // Deduplicate — socket may fire more than once for the same bid
                const exists = prev.some((b) => b._id === normalizedBid._id);
                if (exists) return prev;
                return [normalizedBid, ...prev].sort((a, b) => b.amount - a.amount);
            });
        });

        return () => {
            socket.emit("leave_auction", auctionId);
            socket.off("event");
            socket.disconnect();
        };
    }, [auctionId, status, setBids]);

    const isLive = status === "active";
    const isEnded = status === "ended" || status === "expired";

    // Safe helpers — never throw regardless of what shape the bid is
    const getUsername = (bid) => {
        if (!bid?.userId) return "Unknown";
        if (typeof bid.userId === "object" && bid.userId.username) return bid.userId.username;
        return "Bidder";
    };

    const getInitials = (bid) => {
        const name = getUsername(bid);
        if (name === "Bidder" || name === "Unknown") return "?";
        return name.slice(0, 2).toUpperCase();
    };

    const getProfile = (bid) => {
        if (typeof bid?.userId === "object") return bid.userId?.profile || null;
        return null;
    };

    const getTime = (bid, index) => {
        if (isLive) return index === 0 ? "Just now" : `${index} min ago`;
        try {
            return new Date(bid.createdAt).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return "";
        }
    };

    return (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Live Bids</h3>
                <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                        isLive
                            ? "text-green-600 bg-green-50"
                            : isEnded
                              ? "text-slate-500 bg-slate-100"
                              : "text-orange-500 bg-orange-50"
                    }`}
                >
                    {isLive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                    )}
                    {isEnded && <span>✓</span>}
                    {isLive ? "Real-time" : isEnded ? "Auction ended" : "Not started"}
                </span>
            </div>

            {/* Body */}
            <div className="px-5 py-4">
                {loading ? (
                    <div className="py-6 text-center text-sm text-slate-400">Loading bids...</div>
                ) : bids.length === 0 ? (
                    <div className="py-10 flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl">
                            🔨
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-slate-700">No bids yet</p>
                            <p className="text-xs text-slate-400 mt-1">
                                Be the first to place a bid when the auction starts.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div>
                        {bids.slice(0, 7).map((bid, i) => {
                            const isHighest = i === 0;
                            const isWinner = isEnded && isHighest;
                            const profileImg = getProfile(bid);

                            return (
                                <motion.div
                                    key={bid._id}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className={`flex items-center justify-between py-3 ${
                                        i < Math.min(bids.length, 7) - 1
                                            ? "border-b border-slate-100"
                                            : ""
                                    } ${isWinner ? "bg-green-50/50 -mx-5 px-5" : ""}`}
                                >
                                    {/* Left */}
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 overflow-hidden ${
                                                isWinner
                                                    ? "ring-2 ring-green-500 ring-offset-1"
                                                    : isHighest && !isEnded
                                                      ? "ring-2 ring-blue-500 ring-offset-1"
                                                      : ""
                                            }`}
                                            style={{
                                                background: isWinner
                                                    ? "#374151"
                                                    : isHighest && !isEnded
                                                      ? "#2563eb"
                                                      : `hsl(${(i * 47) % 360}, 60%, 50%)`,
                                            }}
                                        >
                                            {profileImg ? (
                                                <img
                                                    src={profileImg}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                getInitials(bid)
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <p className="text-sm font-semibold text-slate-900 leading-none">
                                                    {getUsername(bid)}
                                                </p>
                                                {isWinner && (
                                                    <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                                                        Winner
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                {getTime(bid, i)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right */}
                                    <div className="text-right">
                                        <p
                                            className={`text-sm font-bold ${
                                                isWinner
                                                    ? "text-green-600"
                                                    : isHighest && !isEnded
                                                      ? "text-blue-600"
                                                      : "text-slate-700"
                                            }`}
                                        >
                                            Rs.{bid.amount.toLocaleString("en-IN")}
                                        </p>
                                        {isHighest && !isEnded && (
                                            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                Highest
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}

                        {bids.length > 7 && (
                            <button className="w-full pt-3 text-sm font-semibold text-blue-600 hover:underline flex items-center justify-center gap-1">
                                View all bids ↓
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
