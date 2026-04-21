import { motion } from "framer-motion";
import { itemVariant } from "../constants/auctionVariants";

export function RelatedCard({ item, onClick }) {
    return (
        <motion.button
            variants={itemVariant}
            whileHover={{ y: -4 }}
            onClick={onClick}
            className="text-left rounded-[24px] overflow-hidden bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
        >
            <div className="overflow-hidden h-44">
                <img
                    src={item.media?.[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>
            <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[1.5px] text-blue-500 mb-1.5">
                    {item.category ?? "Auction"}
                </p>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug mb-3">
                    {item.name}
                </h4>
                <div className="flex items-center justify-between">
                    <p className="text-blue-600 font-extrabold text-base">
                        ₹{(item.currentHighestBid || item.startPrice).toLocaleString("en-IN")}
                    </p>
                    <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                            item.status === "active"
                                ? "bg-green-50 text-green-600"
                                : "bg-slate-100 text-slate-500"
                        }`}
                    >
                        {item.status === "active" ? "Live" : "Ended"}
                    </span>
                </div>
            </div>
        </motion.button>
    );
}
