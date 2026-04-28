import { motion } from "framer-motion";
import defaultImg from "@/assets/default.png";

export function SellerCard({ seller }) {
    return (
        <motion.div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-600 to-orange-400">
                <img
                    src={seller?.profile || defaultImg}
                    alt="seller profile"
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-[2px] text-slate-400 font-semibold">
                    Seller
                </p>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5 truncate">
                    {seller?.firstName && seller?.lastName
                        ? `${seller.firstName} ${seller.lastName}`
                        : seller?.username || "Unknown Seller"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">@{seller?.username || "unknown"}</p>
            </div>
        </motion.div>
    );
}
