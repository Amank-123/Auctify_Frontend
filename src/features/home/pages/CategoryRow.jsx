import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const CATS = [
    {
        label: "Clothing",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=220&h=220&fit=crop",
    },
    {
        label: "Accessories",
        image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=220&h=220&fit=crop",
    },
    {
        label: "Phones",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=220&h=220&fit=crop",
    },
    {
        label: "Computers",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=220&h=220&fit=crop",
    },
    {
        label: "Cosmetics",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=220&h=220&fit=crop",
    },
    {
        label: "Electronics",
        image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=220&h=220&fit=crop",
    },
    {
        label: "Watches",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=220&h=220&fit=crop",
    },
    {
        label: "Shoes",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=220&h=220&fit=crop",
    },
    {
        label: "Jewellery",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=220&h=220&fit=crop",
    },
    {
        label: "Gaming",
        image: "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?w=220&h=220&fit=crop",
    },
];

export default function CategoryRow() {
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);

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
    }, [updateArrows]);

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

    const handleCategoryClick = (category) => {
        navigate(`/category/${category.toLowerCase()}`);
    };

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    Explore Popular Categories
                </h2>

                <p className="mt-1 text-sm text-slate-500">Browse premium auction collections</p>
            </div>

            {/* Wrapper */}
            <div className="relative">
                {/* LEFT */}
                <button
                    onClick={scrollLeft}
                    className={`hidden md:flex absolute left-0 top-[42%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 items-center justify-center shadow-md transition ${
                        showLeft ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                >
                    ‹
                </button>

                {/* RIGHT */}
                <button
                    onClick={scrollRight}
                    className={`hidden md:flex absolute right-0 top-[42%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 items-center justify-center shadow-md transition ${
                        showRight ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                >
                    ›
                </button>

                {/* Track */}
                <div
                    ref={scrollRef}
                    className="w-full flex gap-10 overflow-x-auto scroll-smooth py-4 px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {CATS.map((cat) => (
                        <button
                            key={cat.label}
                            onClick={() => handleCategoryClick(cat.label)}
                            className="flex-shrink-0 w-[96px] group flex flex-col items-center"
                        >
                            {/* FIXED CIRCLE */}
                            <div className="w-28 h-28 rounded-full overflow-hidden border border-slate-200 bg-white shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                                <img
                                    src={cat.image}
                                    alt={cat.label}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* TEXT */}
                            <span className="mt-4 text-[11px] font-bold uppercase tracking-[1px] text-slate-600 group-hover:text-blue-600 text-center leading-tight">
                                {cat.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
