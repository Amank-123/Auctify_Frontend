import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronsLeft } from "lucide-react";

export default function HeroBannerSlider() {
    const banners = [
        {
            title: "Luxury Watches Auction",
            subtitle: "Bid on premium timepieces from trusted sellers.",
            image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1400&q=80",
            button: "Explore Now",
            color: "from-black/75 via-black/45 to-transparent",
        },
        {
            title: "Electronics Mega Deals",
            subtitle: "Phones, laptops, gaming gear & more live now.",
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=80",
            button: "Start Bidding",
            color: "from-blue-950/75 via-blue-900/35 to-transparent",
        },
        {
            title: "Cars & Premium Vehicles",
            subtitle: "Own your dream machine through auctions.",
            image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1400&q=80",
            button: "View Vehicles",
            color: "from-slate-950/80 via-slate-900/30 to-transparent",
        },
    ];

    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(timer);
    }, [current]);

    const nextSlide = () => {
        setDirection(1);
        setCurrent((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
    };

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

    return (
        <section className="w-full">
            <div className="relative h-[420px] md:h-[480px] overflow-hidden shadow-2xl bg-slate-900">
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
                        {/* Image zoom effect */}
                        <motion.img
                            src={banners[current].image}
                            className="w-full h-full object-cover"
                            initial={{ scale: 1.08 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 6, ease: "easeOut" }}
                        />

                        {/* Overlay */}
                        <div
                            className={`absolute inset-0 bg-gradient-to-r ${banners[current].color}`}
                        />

                        {/* Content */}
                        <div className="absolute left-6 md:left-36 top-1/2 -translate-y-1/2 max-w-xl text-white pr-6">
                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xs md:text-sm uppercase tracking-[3px] mb-4 text-white/75"
                            >
                                Featured Auction
                            </motion.p>

                            <motion.h1
                                initial={{ opacity: 0, y: 22 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl md:text-6xl font-bold leading-tight"
                            >
                                {banners[current].title}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 22 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45 }}
                                className="mt-4 md:mt-5 text-base md:text-lg text-white/85 leading-7 md:leading-8"
                            >
                                {banners[current].subtitle}
                            </motion.p>

                            <motion.button
                                initial={{ opacity: 0, y: 22 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.55 }}
                                className="mt-7 md:mt-8 px-7 h-12 md:h-14 rounded-2xl bg-white text-slate-900 font-semibold hover:scale-105 hover:bg-slate-100 transition"
                            >
                                {banners[current].button}
                            </motion.button>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Desktop Arrows Only - Production Grade */}
                <div className="hidden md:block">
                    <button
                        onClick={prevSlide}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 border border-white/20 backdrop-blur-md text-white hover:bg-white hover:text-slate-900 transition-all duration-300 flex items-center justify-center"
                    >
                        <span className="text-lg">
                            <ChevronLeft />
                        </span>
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 border border-white/20 backdrop-blur-md text-white hover:bg-white hover:text-slate-900 transition-all duration-300 flex items-center justify-center"
                    >
                        <span className="text-lg">
                            <ChevronRight />
                        </span>
                    </button>
                </div>

                {/* Dots */}
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
