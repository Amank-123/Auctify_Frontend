import { motion } from "framer-motion";

export function SellerCard({ sellerName }) {
    return (
        <motion.div className="rounded-[24px] bg-white border border-slate-200/80 p-5 shadow-sm flex items-center gap-4">
            <div className="w-13 h-13  overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center text-white font-extrabold text-base flex-shrink-0">
                <img
                    src={seller?.profile || defaultImg}
                    alt="user profile"
                    className="h-full w-full object-cover "
                />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-[2px] text-slate-400 font-semibold">
                    Seller
                </p>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5 truncate">
                    {sellerName || "Auctify Verified Seller"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                    Username: {seller?.username || "unknown"}
                </p>
            </div>
            <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex-shrink-0"
            >
                View Profile
            </motion.button>
        </motion.div>
    );
}
