import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "@/shared/services/axios";

export default function CategoryRow() {
    const navigate = useNavigate();

    const scrollRef = useRef(null);

    const [categories, setCategories] = useState([]);

    const [showLeft, setShowLeft] = useState(false);

    const [showRight, setShowRight] = useState(false);

    /* ─────────────────────────────────────────────
       FETCH CATEGORIES
    ───────────────────────────────────────────── */
    const fetchCategories = async () => {
        try {
            const res = await api.get("/api/category/get");

            setCategories(res.data.data || []);
        } catch (error) {
            //console.log(error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    /* ─────────────────────────────────────────────
       ARROWS
    ───────────────────────────────────────────── */
    const updateArrows = useCallback(() => {
        const el = scrollRef.current;

        if (!el) return;

        const overflowing = el.scrollWidth > el.clientWidth + 2;

        const atStart = el.scrollLeft <= 5;

        const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 5;

        setShowLeft(overflowing && !atStart);

        setShowRight(overflowing && !atEnd);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;

        if (!el) return;

        updateArrows();

        el.addEventListener("scroll", updateArrows);

        window.addEventListener("resize", updateArrows);

        return () => {
            el.removeEventListener("scroll", updateArrows);

            window.removeEventListener("resize", updateArrows);
        };
    }, [updateArrows, categories]);

    /* ─────────────────────────────────────────────
       SCROLL
    ───────────────────────────────────────────── */
    const scrollLeft = () =>
        scrollRef.current?.scrollBy({
            left: -320,
            behavior: "smooth",
        });

    const scrollRight = () =>
        scrollRef.current?.scrollBy({
            left: 320,
            behavior: "smooth",
        });

    /* ─────────────────────────────────────────────
       CATEGORY CLICK
    ───────────────────────────────────────────── */
    const handleCategoryClick = (categoryName) => {
        navigate(`/category/${categoryName.toLowerCase().replace(/\s+/g, "-")}`);
    };

    return (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
            {/* HEADER */}

            {/* <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-snug">
                    Explore Popular Categories
                    
                </h2>

                <p className="text-sm sm:text-base text-slate-600 mt-6 leading-relaxed border-l-2 border-blue-300 pl-4">
                    Browse premium auction
                    collections
                </p>
            </div> */}

            <div className="max-w-2xl">
                <div className="relative inline-block">
                    <h2
                        className="
        text-xl sm:text-3xl lg:text-4xl
        font-bold text-slate-900
        tracking-tight leading-snug
    "
                    >
                        Explore Popular Categories
                    </h2>

                    {/* refined underline */}
                    <span className="absolute left-0 -bottom-2 w-24 h-[2px] bg-blue-600/80 rounded-full"></span>
                </div>

                <p className="text-sm sm:text-base text-slate-600 mt-6 leading-relaxed border-l-2 border-blue-300 pl-4">
                    Browse premium auction collections
                </p>
            </div>

            {/* WRAPPER */}
            <div className="relative">
                {/* LEFT */}
                <button
                    onClick={scrollLeft}
                    className={`hidden md:flex absolute left-0 top-[42%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 items-center justify-center shadow-md transition ${
                        showLeft ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                >
                    <ChevronLeft />
                </button>

                {/* RIGHT */}
                <button
                    onClick={scrollRight}
                    className={`hidden md:flex absolute right-0 top-[42%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 items-center justify-center shadow-md transition ${
                        showRight ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                >
                    <ChevronRight />
                </button>

                {/* TRACK */}
                <div
                    ref={scrollRef}
                    className="
        w-full flex gap-4 sm:gap-6 md:gap-8
        overflow-x-auto scroll-smooth
        py-4 px-1 sm:px-3
        [scrollbar-width:none]
        [&::-webkit-scrollbar]:hidden
    "
                >
                    {categories.map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() => handleCategoryClick(cat.name)}
                            className="
                flex-shrink-0
                w-[72px] sm:w-[88px] md:w-[96px]
                group flex flex-col items-center
            "
                        >
                            {/* IMAGE */}
                            <div
                                className="
                    w-17 h-17
                    sm:w-22 sm:h-22
                    md:w-28 md:h-28
                    rounded-full overflow-hidden
                    border border-slate-200 bg-white
                    shadow-sm
                    group-hover:shadow-md
                    group-hover:-translate-y-1
                    transition-all duration-300
                "
                            >
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* TEXT */}
                            <span
                                className="
                    mt-2 sm:mt-3
                    text-[9px] sm:text-[11px]
                    font-bold uppercase
                    tracking-[0.5px] sm:tracking-[1px]
                    text-slate-600
                    group-hover:text-blue-600
                    text-center leading-tight
                    line-clamp-2
                "
                            >
                                {cat.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
