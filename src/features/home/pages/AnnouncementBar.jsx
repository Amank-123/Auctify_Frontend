import { motion } from "framer-motion";
import { Icon } from "./Icons.jsx";

export default function AnnouncementBar() {
    return (
        <motion.div
            initial={{ y: -36, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-r from-blue-900 to-blue-800 
               text-blue-100 text-xs font-medium 
               py-2.5 px-4 flex items-center justify-center gap-3 
               border-b border-blue-700/30"
        >
            <Icon.Megaphone className="w-4 h-4" />
            Real-time Auctions • Direct seller-to-buyer • No middleman fees
        </motion.div>
    );
}
