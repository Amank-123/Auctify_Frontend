import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import defaultImg from "@/assets/default.png";
import socket from "../../../shared/services/socket";
import { Gavel, Trophy, Activity } from "lucide-react";

export function BidHistory({ bids, loading, status }) {
    const [showAll, setShowAll] = useState(false);

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

    const getTime = (bid) => {
        if (!bid?.createdAt) return "";

        const now = Date.now();
        const timestamp = new Date(bid.createdAt).getTime();

        if (isNaN(timestamp)) return "";

        const diffSec = Math.floor((now - timestamp) / 1000);

        // Future guard (bad server time)
        if (diffSec < 0) return "Just now";

        // < 1 min
        if (diffSec < 60) return "Just now";

        // < 1 hour
        if (diffSec < 3600) {
            const mins = Math.floor(diffSec / 60);
            return `${mins} min ago • Today`;
        }

        // < 24 hours
        if (diffSec < 86400) {
            const time = new Date(timestamp).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
            });

            return `${time} • Today`;
        }

        // older
        return new Date(timestamp).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const visibleBids = showAll ? bids : bids.slice(0, 6);

    return (
        <div className="rounded-2xl bg-white border border-[#E5E7EB] shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-[#E5E7EB]">
                <h3 className="text-base font-semibold text-[#111827]">Live Bids</h3>

                <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-2 ${
                        isLive
                            ? "text-[#C2410C] bg-[#FFF7ED]"
                            : isEnded
                              ? "text-[#6B7280] bg-[#F3F4F6]"
                              : "text-[#F59E0B] bg-[#FFFBEB]"
                    }`}
                >
                    {isLive && <Activity size={14} className="animate-pulse" />}
                    {isEnded && <Trophy size={14} />}
                    {isLive ? "Live" : isEnded ? "Ended" : "Upcoming"}
                </span>
            </div>

            {/* Body */}
            <div className="px-2 py-1">
                {loading ? (
                    <div className="py-8 text-center text-sm text-[#6B7280]">Loading bids...</div>
                ) : bids.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
                            <Gavel size={22} />
                        </div>

                        <div className="text-center">
                            <p className="text-base font-semibold text-[#1F2937]">No bids yet</p>
                            <p className="text-sm text-[#6B7280] mt-1">
                                Be the first to place a bid.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Scrollable List */}
                        <div
                            style={{ scrollbarGutter: "stable" }}
                            className={`pr-1 ${
                                showAll
                                    ? "max-h-[400px] overflow-y-auto"
                                    : "overflow-y-scroll max-h-[400px]"
                            }`}
                        >
                            {visibleBids.map((bid, i) => {
                                const isHighest = i === 0;
                                const isWinner = isEnded && isHighest;
                                const profileImg = getProfile(bid);

                                return (
                                    <motion.div
                                        key={bid._id}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`flex items-center justify-between py-3 px-2 ${
                                            i < visibleBids.length - 1
                                                ? "border-b border-[#F1F5F9]"
                                                : ""
                                        }`}
                                    >
                                        {/* Left */}
                                        <div className="flex items-center gap-2.5">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden ${
                                                    isWinner
                                                        ? "ring-2 ring-[#16A34A] ring-offset-2"
                                                        : isHighest && !isEnded
                                                          ? "ring-2 ring-[#2563EB] ring-offset-2"
                                                          : ""
                                                }`}
                                                style={{
                                                    background: isWinner
                                                        ? "#374151"
                                                        : isHighest && !isEnded
                                                          ? "#2563EB"
                                                          : `hsl(${(i * 47) % 360}, 60%, 50%)`,
                                                }}
                                            >
                                                {profileImg ? (
                                                    <img
                                                        src={profileImg}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    getInitials(bid)
                                                )}
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-[#111827]">
                                                        {getUsername(bid)}
                                                    </p>

                                                    {isWinner && (
                                                        <span className="text-xs font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full flex items-center gap-1">
                                                            <Trophy size={12} />
                                                            Winner
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-xs text-[#6B7280] mt-1">
                                                    {getTime(bid, i)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right */}
                                        <div className="text-right">
                                            <p
                                                className={`text-base font-semibold ${
                                                    isWinner
                                                        ? "text-[#16A34A]"
                                                        : isHighest && !isEnded
                                                          ? "text-[#2563EB]"
                                                          : "text-[#1F2937]"
                                                }`}
                                            >
                                                Rs.{bid.amount.toLocaleString("en-IN")}
                                            </p>

                                            {isHighest && !isEnded && (
                                                <span className="text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full">
                                                    Highest
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Toggle Button */}
                        {bids.length > 6 && (
                            <div className="pt-1">
                                <button
                                    onClick={() => setShowAll((prev) => !prev)}
                                    className="w-full text-sm font-semibold text-[#2563EB] hover:underline flex items-center justify-center gap-1"
                                >
                                    {showAll ? "Show less" : "View all bids"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
