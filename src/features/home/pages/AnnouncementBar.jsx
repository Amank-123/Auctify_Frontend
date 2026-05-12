import { motion } from "framer-motion";
import { Icon } from "./Icons.jsx";

export default function AnnouncementBar({ announcement }) {
    return (
        <motion.div
            initial={{ y: -36, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="
                bg-gradient-to-r from-blue-900 to-blue-800
                text-blue-100
                text-[10px] sm:text-xs
                font-medium
                py-2 sm:py-2.5
                px-3 sm:px-4
                flex items-center justify-center
                gap-2 sm:gap-3
                text-center
                border-b border-blue-700/30
            "
        >
            <Icon.Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />

            <span className="leading-relaxed">{announcement}</span>
        </motion.div>
    );
}
