import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { api } from "@/shared/services/axios";

export default function HeroBannerSlider() {
    const navigate = useNavigate();

    const [banners, setBanners] = useState([]);

    const [current, setCurrent] = useState(0);

    const [direction, setDirection] = useState(1);

    /* ─────────────────────────────────────────────
       FETCH BANNERS
    ───────────────────────────────────────────── */
    const fetchBanners = async () => {
        try {
            const res = await api.get("/api/banner/get");

            console.log("BANNER RESPONSE:", res.data);

            setBanners(res.data.data || []);
        } catch (error) {
            console.log(error);

            console.log(error?.response?.data);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    /* ─────────────────────────────────────────────
       AUTO SLIDE
    ───────────────────────────────────────────── */
    useEffect(() => {
        if (!banners.length) return;

        const timer = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(timer);
    }, [current, banners]);

    /* ─────────────────────────────────────────────
       NEXT
    ───────────────────────────────────────────── */
    const nextSlide = () => {
        setDirection(1);

        setCurrent((prev) => (prev + 1) % banners.length);
    };

    /* ─────────────────────────────────────────────
       PREV
    ───────────────────────────────────────────── */
    const prevSlide = () => {
        setDirection(-1);

        setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
    };

    /* ─────────────────────────────────────────────
       NAVIGATE CATEGORY
    ───────────────────────────────────────────── */
    const handleNavigate = (banner) => {
        if (!banner?.category?.name) return;

        navigate(`/category/${banner.category.name.toLowerCase().replace(/\s+/g, "-")}`);
    };

    /* ─────────────────────────────────────────────
       SLIDE ANIMATION
    ───────────────────────────────────────────── */
    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 120 : -120,
            opacity: 0,
            scale: 1.05,
        }),

        center: {
            x: 0,
            opacity: 1,
            scale: 1,
        },

        exit: (direction) => ({
            x: direction > 0 ? -120 : 120,
            opacity: 0,
            scale: 1.03,
        }),
    };

    /* ─────────────────────────────────────────────
       LOADING
    ───────────────────────────────────────────── */
    if (!banners.length) {
        return (
            <section className="w-full">
                <div className="h-[420px] md:h-[480px] bg-slate-200 animate-pulse" />
            </section>
        );
    }

    return (
        <section className="w-full">
            <div className="relative h-[320px] sm:h-[420px] md:h-[480px] overflow-hidden shadow-2xl bg-slate-900">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={current}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            duration: 0.7,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="absolute inset-0"
                    >
                        {/* IMAGE */}
                        <motion.img
                            src={banners[current]?.image}
                            alt={banners[current]?.title}
                            className="w-full h-full object-cover"
                            initial={{
                                scale: 1.08,
                            }}
                            animate={{
                                scale: 1,
                            }}
                            transition={{
                                duration: 6,
                                ease: "easeOut",
                            }}
                        />

                        {/* OVERLAY */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />

                        {/* CONTENT */}
                        {/* CONTENT */}
                        <div
                            className="
        absolute
        left-4 sm:left-6 md:left-20 lg:left-36
        top-1/2 -translate-y-1/2
        max-w-[92%] sm:max-w-lg md:max-w-xl
        text-white
        pr-4 sm:pr-6
    "
                        >
                            <motion.p
                                initial={{
                                    opacity: 0,
                                    y: 16,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    delay: 0.2,
                                }}
                                className="
            text-[10px] sm:text-xs md:text-sm
            uppercase tracking-[2px] sm:tracking-[3px]
            mb-2 sm:mb-4
            text-white/75
        "
                            >
                                Featured Auction
                            </motion.p>

                            <motion.h1
                                initial={{
                                    opacity: 0,
                                    y: 22,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    delay: 0.3,
                                }}
                                className="
            text-2xl sm:text-4xl md:text-5xl lg:text-6xl
            font-bold leading-tight
        "
                            >
                                {banners[current]?.title}
                            </motion.h1>

                            <motion.p
                                initial={{
                                    opacity: 0,
                                    y: 22,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    delay: 0.45,
                                }}
                                className="
            mt-3 sm:mt-4 md:mt-5
            text-[13px] sm:text-base md:text-lg
            text-white/85
            leading-5 sm:leading-7 md:leading-8
            line-clamp-3 sm:line-clamp-none
        "
                            >
                                {banners[current]?.description}
                            </motion.p>

                            <motion.button
                                initial={{
                                    opacity: 0,
                                    y: 22,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    delay: 0.55,
                                }}
                                onClick={() => handleNavigate(banners[current])}
                                className="
            mt-5 sm:mt-7 md:mt-8
            px-5 sm:px-7
            h-10 sm:h-12 md:h-14
            rounded-xl md:rounded-2xl
            bg-white text-slate-900
            text-sm sm:text-base
            font-semibold
            hover:scale-105 hover:bg-slate-100
            transition
        "
                            >
                                {banners[current]?.cta}
                            </motion.button>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* LEFT */}
                <div className="hidden md:block">
                    <button
                        onClick={prevSlide}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 border border-white/20 backdrop-blur-md text-white hover:bg-white hover:text-slate-900 transition-all duration-300 flex items-center justify-center"
                    >
                        <ChevronLeft />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 border border-white/20 backdrop-blur-md text-white hover:bg-white hover:text-slate-900 transition-all duration-300 flex items-center justify-center"
                    >
                        <ChevronRight />
                    </button>
                </div>

                {/* DOTS */}
                <div className="absolute bottom-5 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setDirection(i > current ? 1 : -1);

                                setCurrent(i);
                            }}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                current === i ? "w-8 bg-white" : "w-2 bg-white/45 hover:bg-white/70"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
