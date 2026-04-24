import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Countdown({ endsAt }) {
    const calc = () => {
        const diff = Math.max(0, Math.floor((new Date(endsAt) - Date.now()) / 1000));
        return {
            h: String(Math.floor(diff / 3600)).padStart(2, "0"),
            m: String(Math.floor((diff % 3600) / 60)).padStart(2, "0"),
            s: String(diff % 60).padStart(2, "0"),
        };
    };
    const [t, setT] = useState(calc);
    useEffect(() => {
        const id = setInterval(() => setT(calc()), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="flex gap-2 mb-4">
            {[
                ["h", "Hours"],
                ["m", "Mins"],
                ["s", "Secs"],
            ].map(([k, label]) => (
                <div
                    key={k}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 text-center"
                >
                    <div className="text-[15px] font-extrabold text-slate-800 leading-none">
                        {t[k]}
                    </div>
                    <div className="text-[8px] uppercase tracking-widest text-slate-400 mt-0.5 font-semibold">
                        {label}
                    </div>
                </div>
            ))}
        </div>
    );
}

function FavBtn() {
    const [on, setOn] = useState(false);
    return (
        <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setOn((p) => !p)}
            className="w-[30px] h-[30px] rounded-full flex items-center justify-center border border-white/30"
            style={{ background: "rgba(255,255,255,0.22)", backdropFilter: "blur(8px)" }}
        >
            <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill={on ? "#ef4444" : "none"}
                stroke={on ? "#ef4444" : "#fff"}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        </motion.button>
    );
}

function StatusBadge({ status }) {
    const cfg = {
        active: { cls: "bg-red-500 text-white", text: "LIVE", dot: true },
        ended: { cls: "bg-slate-500/90 text-white", text: "ENDED", dot: false },
        draft: { cls: "bg-amber-500 text-white", text: "DRAFT", dot: false },
    };
    const { cls, text, dot } = cfg[status] ?? cfg.draft;
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${cls}`}
        >
            {dot && (
                <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-red-200 inline-block flex-shrink-0"
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.1 }}
                />
            )}
            {text}
        </span>
    );
}

function SellerAvatar({ name }) {
    const initials =
        name
            ?.split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "AU";
    return (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">
            {initials}
        </div>
    );
}

export default function AuctionCard({ auction }) {
    const navigate = useNavigate();

    const image = auction?.media?.[0];
    // console.log("images from auction card: ", image);

    const title = auction?.name || "Untitled Auction";
    const category = auction?.category || "Auction";
    const price =
        auction?.currentHighestBid > 0 ? auction.currentHighestBid : auction?.startPrice || 0;
    const bids = auction?.bidCount || 0;
    const status = auction?.status || "draft";
    const seller = auction?.sellerName || "Auctify";
    const endsAt = auction?.endsAt || new Date(Date.now() + 7200000);

    const accentGradient =
        status === "ended"
            ? "linear-gradient(90deg,#64748b,#94a3b8)"
            : status === "draft"
              ? "linear-gradient(90deg,#d97706,#f59e0b)"
              : "linear-gradient(90deg,#2563eb,#6366f1,#818cf8)";

    const [bidDone, setBidDone] = useState(false);

    const handleBid = () => {
        navigate(`/auction/${auction._id}`);
        if (status === "active") {
            setBidDone(true);
            setTimeout(() => setBidDone(false), 1500);
        }
    };

    const btnStyle = bidDone
        ? {
              background: "linear-gradient(135deg,#16a34a,#15803d)",
              boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
          }
        : status === "ended"
          ? {
                background: "linear-gradient(135deg,#475569,#334155)",
                boxShadow: "0 4px 14px rgba(71,85,105,0.25)",
            }
          : {
                background: "linear-gradient(135deg,#2563eb,#4f46e5)",
                boxShadow: "0 4px 14px rgba(37,99,235,0.32)",
            };

    return (
        <motion.div
            whileHover={{ y: -10, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-[296px] rounded-[28px] overflow-hidden bg-white border border-slate-200"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-slate-100">
                {image ? (
                    image.map((img, index) => (
                        <img
                            src={img}
                            key={index}
                            alt={title}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                            }}
                        />
                    ))
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                        No Image
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-black/5 to-transparent" />

                <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                    <StatusBadge status={status} />
                    <FavBtn />
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-600/85 text-white backdrop-blur-sm">
                        {category}
                    </span>
                    <span className="text-[11px] font-medium text-white/85">{bids} bids</span>
                </div>
            </div>

            {/* Accent bar */}
            <div style={{ height: 3, background: accentGradient }} />

            {/* Body */}
            <div className="p-[18px]">
                {status === "active" && <Countdown endsAt={endsAt} />}

                <h3 className="text-[15px] font-bold text-slate-900 leading-snug line-clamp-2 min-h-[44px] mb-3.5">
                    {title}
                </h3>

                <div className="flex items-end justify-between mb-3.5">
                    <div>
                        <p className="text-[9px] uppercase tracking-[.18em] text-indigo-500 font-bold mb-1">
                            {status === "ended" ? "Final Bid" : "Current Bid"}
                        </p>
                        <p className="text-[27px] font-extrabold text-slate-900 leading-none tracking-tight">
                            ₹{price.toLocaleString("en-IN")}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-[9px] uppercase tracking-[.14em] text-slate-400 font-semibold mb-1.5">
                            Seller
                        </p>
                        <div className="flex items-center justify-end gap-1.5">
                            <SellerAvatar name={seller} />
                            <span className="text-[12px] font-semibold text-slate-500">
                                {seller}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-100 mb-3.5" />

                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleBid}
                    className="w-full h-[46px] rounded-2xl border-0 font-bold text-[14px] tracking-wide text-white cursor-pointer"
                    style={btnStyle}
                >
                    {bidDone ? "Bid Placed!" : status === "active" ? "Place Bid" : "View Details"}
                </motion.button>
            </div>
        </motion.div>
    );
}
