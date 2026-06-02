import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/shared/services/axios";

// ── Variants ────────────────────────────────────────────────────────────────

const slideVariants = {
    enter: (d) => ({ x: d > 0 ? "6%" : "-6%", opacity: 0, scale: 1.04 }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: { duration: 0.65, ease: [0.32, 0.72, 0, 1] },
    },
    exit: (d) => ({
        x: d > 0 ? "-6%" : "6%",
        opacity: 0,
        scale: 0.97,
        transition: { duration: 0.45, ease: [0.4, 0, 1, 1] },
    }),
};

const overlayVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1, transition: { duration: 0.5, delay: 0.1 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
};

const contentVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
    exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 22, filter: "blur(4px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: {
        opacity: 0,
        y: -10,
        filter: "blur(4px)",
        transition: { duration: 0.25, ease: "easeIn" },
    },
};

const INTERVAL_MS = 5000;

// ── Component ────────────────────────────────────────────────────────────────

export default function HeroBannerSlider() {
    const navigate = useNavigate();
    const [banners, setBanners] = useState([]);
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isPaused, setIsPaused] = useState(false);

    // ✅ Single source of truth for the auto-advance timer
    const intervalRef = useRef(null);
    const bannersRef = useRef([]);
    const isPausedRef = useRef(false);
    // ✅ Tracks progress bar start time so the bar always reflects real elapsed time
    const [progressKey, setProgressKey] = useState(0);

    useEffect(() => {
        bannersRef.current = banners;
    }, [banners]);
    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const res = await api.get("/api/banner/get");
            setBanners(res.data.data || []);
        } catch (error) {
            //console.log(error?.response?.data);
        }
    };

    // ✅ Always clears the old interval and starts a fresh one
    // Called after every manual interaction so the next auto-slide
    // is always exactly INTERVAL_MS away from the last action
    const resetInterval = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (isPausedRef.current) return;
            const len = bannersRef.current.length;
            if (!len) return;
            setDirection(1);
            setCurrent((prev) => (prev + 1) % len);
            setProgressKey((k) => k + 1); // ✅ restart progress bar in sync
        }, INTERVAL_MS);

        setProgressKey((k) => k + 1); // ✅ reset progress bar on manual nav too
    }, []);

    // Start interval once banners load
    useEffect(() => {
        if (!banners.length) return;
        resetInterval();
        return () => clearInterval(intervalRef.current);
    }, [banners.length]);

    // ✅ paginate resets the interval so no double-fire after manual click
    const paginate = useCallback(
        (newDirection, targetIndex = null) => {
            setDirection(newDirection);
            setCurrent((prev) => {
                const len = bannersRef.current.length;
                if (targetIndex !== null) return targetIndex;
                return newDirection > 0 ? (prev + 1) % len : (prev - 1 + len) % len;
            });
            resetInterval(); // ✅ always exactly 5s until next auto-slide
        },
        [resetInterval],
    );

    const handleNavigate = (banner) => {
        if (!banner?.category?.name) return;
        navigate(`/category/${banner.category.name.toLowerCase().replace(/\s+/g, "-")}`);
    };

    if (!banners.length) {
        return (
            <section className="w-full">
                <div className="h-[420px] md:h-[480px] bg-slate-200 animate-pulse" />
            </section>
        );
    }

    return (
        <section className="w-full">
            <div
                className="relative h-[320px] sm:h-[420px] md:h-[480px] overflow-hidden bg-slate-900"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Slide layer */}
                <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                        key={current}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0"
                    >
                        <img
                            src={banners[current]?.image}
                            alt={banners[current]?.title}
                            className="w-full h-full object-cover"
                        />

                        <motion.div
                            variants={overlayVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"
                        />

                        <motion.div
                            className="
                                absolute
                                left-4 sm:left-8 md:left-20 lg:left-36
                                top-1/2 -translate-y-1/2
                                max-w-[92%] sm:max-w-lg md:max-w-xl
                                text-white pr-4 sm:pr-6
                            "
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <motion.p
                                variants={itemVariants}
                                className="text-[10px] sm:text-xs md:text-sm uppercase tracking-[3px] mb-2 sm:mb-4 text-white/65"
                            >
                                Featured Auction
                            </motion.p>

                            <motion.h1
                                variants={itemVariants}
                                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                            >
                                {banners[current]?.title}
                            </motion.h1>

                            <motion.p
                                variants={itemVariants}
                                className="mt-3 sm:mt-4 md:mt-5 text-[13px] sm:text-base md:text-lg text-white/80 leading-relaxed line-clamp-3 sm:line-clamp-none"
                            >
                                {banners[current]?.description}
                            </motion.p>

                            <motion.button
                                variants={itemVariants}
                                whileHover={{ scale: 1.05, backgroundColor: "#f1f5f9" }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleNavigate(banners[current])}
                                className="mt-5 sm:mt-7 md:mt-8 px-5 sm:px-7 h-10 sm:h-12 md:h-14 rounded-xl md:rounded-2xl bg-white text-slate-900 text-sm sm:text-base font-semibold transition-colors"
                            >
                                {banners[current]?.cta}
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation arrows */}
                <div className="hidden md:block">
                    {[
                        { dir: -1, Icon: ChevronLeft, side: "left-6" },
                        { dir: 1, Icon: ChevronRight, side: "right-6" },
                    ].map(({ dir, Icon, side }) => (
                        <motion.button
                            key={dir}
                            onClick={() => paginate(dir)}
                            whileHover={{ scale: 1.12, backgroundColor: "rgba(255,255,255,0.95)" }}
                            whileTap={{ scale: 0.92 }}
                            className={`absolute ${side} top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/15 border border-white/25 backdrop-blur-md text-white hover:text-slate-900 flex items-center justify-center transition-colors duration-200`}
                        >
                            <Icon size={20} />
                        </motion.button>
                    ))}
                </div>

                {/* Progress dots */}
                <div className="absolute bottom-5 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {banners.map((_, i) => (
                        <motion.button
                            key={i}
                            onClick={() => paginate(i > current ? 1 : -1, i)}
                            animate={{
                                width: current === i ? 28 : 8,
                                opacity: current === i ? 1 : 0.45,
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="h-2 rounded-full bg-white"
                        />
                    ))}
                </div>

                {/* ✅ Progress bar — keyed to progressKey, always in sync with interval */}
                {!isPaused && (
                    <motion.div
                        key={progressKey}
                        className="absolute bottom-0 left-0 h-[3px] bg-white/60 z-10"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: INTERVAL_MS / 1000, ease: "linear" }}
                    />
                )}
            </div>
        </section>
    );
}
