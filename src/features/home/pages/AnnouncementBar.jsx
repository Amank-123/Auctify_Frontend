import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "./Icons.jsx";

export default function AnnouncementBar({ announcements = [] }) {
    const [index, setIndex] = useState(0);

    const items = Array.isArray(announcements) ? announcements : [announcements];

    useEffect(() => {
        if (items.length <= 1) return;
        const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 3500);
        return () => clearInterval(id);
    }, [items.length]);

    if (!items.length) return null;

    return (
        <div className="relative overflow-hidden bg-[#0f1f5c] border-b border-blue-900/60 py-2 sm:py-2.5">
            {/* single centered group — icon + text + dots all move together */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-3 px-4">
                <Icon.Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-blue-300" />

                <div className="relative h-5 flex items-center w-[220px] sm:w-[380px] md:w-[520px]">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="absolute inset-0 flex items-center justify-center text-[11px] sm:text-xs font-medium text-blue-100 tracking-wide whitespace-nowrap"
                        >
                            {items[index]}
                        </motion.span>
                    </AnimatePresence>
                </div>

                {items.length > 1 && (
                    <div className="flex items-center gap-1 shrink-0">
                        {items.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                className={`rounded-full transition-all duration-300 ${
                                    i === index
                                        ? "w-3.5 h-1.5 bg-blue-300"
                                        : "w-1.5 h-1.5 bg-blue-500/50 hover:bg-blue-400"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
