import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import AuctionsGrid from "../../features/home/pages/AuctionsGrid";

export default function PremiumCategories() {
    const navigate = useNavigate();
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

    const desktopCategories = [
        {
            slug: "electronics",
            label: "Electronics",
            count: 31,
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
            gc: "1",
            gr: "1 / span 3",
        },
        {
            slug: "sports",
            label: "Sports",
            count: 16,
            image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
            gc: "1",
            gr: "4 / span 3",
        },
        {
            slug: "fashion",
            label: "Fashion",
            count: 19,
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
            gc: "2",
            gr: "1 / span 2",
        },
        {
            slug: "art",
            label: "Art",
            count: 9,
            image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80",
            gc: "2",
            gr: "3 / span 2",
        },
        {
            slug: "gaming",
            label: "Gaming",
            count: 11,
            image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80",
            gc: "2",
            gr: "5 / span 2",
        },
        {
            slug: "jewelry",
            label: "Jewelry",
            count: 27,
            image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
            gc: "3",
            gr: "1 / span 3",
        },
        {
            slug: "music",
            label: "Music",
            count: 7,
            image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
            gc: "3",
            gr: "4 / span 2",
        },
        {
            slug: "toys",
            label: "Toys",
            count: 10,
            image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80",
            gc: "3",
            gr: "6 / span 1",
        },
        {
            slug: "watches",
            label: "Watches",
            count: 24,
            image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80",
            gc: "4",
            gr: "1 / span 2",
        },
        {
            slug: "collectibles",
            label: "Collectibles",
            count: 14,
            image: "https://images.unsplash.com/photo-1612196808214-b7e239e5a4f4?auto=format&fit=crop&w=800&q=80",
            gc: "4",
            gr: "3 / span 2",
        },
        {
            slug: "luxury",
            label: "Luxury",
            count: 12,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
            gc: "4",
            gr: "5 / span 2",
        },
        {
            slug: "vehicles",
            label: "Vehicles",
            count: 18,
            image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80",
            gc: "5",
            gr: "1 / span 2",
        },
        {
            slug: "furniture",
            label: "Furniture",
            count: 8,
            image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
            gc: "5",
            gr: "3 / span 2",
        },
        {
            slug: "antiques",
            label: "Antiques",
            count: 6,
            image: "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?auto=format&fit=crop&w=800&q=80",
            gc: "5",
            gr: "5 / span 2",
        },
        {
            slug: "real_estate",
            label: "Real Estate",
            count: 5,
            image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
            gc: "6",
            gr: "1 / span 2",
        },
        {
            slug: "books",
            label: "Books",
            count: 22,
            image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80",
            gc: "6",
            gr: "3 / span 2",
        },
        {
            slug: "industrial",
            label: "Industrial",
            count: 4,
            image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80",
            gc: "6",
            gr: "5 / span 1",
        },
        {
            slug: "other",
            label: "Other",
            count: 33,
            image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
            gc: "6",
            gr: "6 / span 1",
        },
    ];

    const mobileCategories = [
        {
            slug: "electronics",
            count: 31,
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
            gc: "1",
            gr: "1 / span 2",
        },
        {
            slug: "sports",
            count: 16,
            image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
            gc: "1",
            gr: "3 / span 2",
        },
        {
            slug: "watches",
            count: 24,
            image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80",
            gc: "1",
            gr: "5 / span 1",
        },
        {
            slug: "vehicles",
            count: 18,
            image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80",
            gc: "1",
            gr: "6 / span 1",
        },
        {
            slug: "antiques",
            count: 6,
            image: "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?auto=format&fit=crop&w=800&q=80",
            gc: "1",
            gr: "7 / span 1",
        },
        {
            slug: "industrial",
            count: 4,
            image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80",
            gc: "1",
            gr: "8 / span 1",
        },
        {
            slug: "fashion",
            count: 19,
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
            gc: "2",
            gr: "1 / span 1",
        },
        {
            slug: "art",
            count: 9,
            image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80",
            gc: "2",
            gr: "2 / span 1",
        },
        {
            slug: "gaming",
            count: 11,
            image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80",
            gc: "2",
            gr: "3 / span 2",
        },
        {
            slug: "collectibles",
            count: 14,
            image: "https://images.unsplash.com/photo-1612196808214-b7e239e5a4f4?auto=format&fit=crop&w=800&q=80",
            gc: "2",
            gr: "5 / span 2",
        },
        {
            slug: "real_estate",
            count: 5,
            image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
            gc: "2",
            gr: "7 / span 2",
        },
        {
            slug: "jewelry",
            count: 27,
            image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
            gc: "3",
            gr: "1 / span 2",
        },
        {
            slug: "music",
            count: 7,
            image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
            gc: "3",
            gr: "3 / span 1",
        },
        {
            slug: "toys",
            count: 10,
            image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80",
            gc: "3",
            gr: "4 / span 1",
        },
        {
            slug: "luxury",
            count: 12,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
            gc: "3",
            gr: "5 / span 1",
        },
        {
            slug: "furniture",
            count: 8,
            image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
            gc: "3",
            gr: "6 / span 1",
        },
        {
            slug: "books",
            count: 22,
            image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80",
            gc: "3",
            gr: "7 / span 1",
        },
        {
            slug: "other",
            count: 33,
            image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
            gc: "3",
            gr: "8 / span 1",
        },
    ];

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.93 },
        visible: (i) => ({
            opacity: 1,
            scale: 1,
            transition: { delay: i * 0.035, duration: 0.48, ease: [0.22, 1, 0.36, 1] },
        }),
    };

    const formatLabel = (text) =>
        text
            .split("_")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

    const TileCard = ({ cat, i, fontSize = 12 }) => (
        <motion.div
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            onClick={() => navigate(`/category/${cat.slug}`)}
            whileHover={{ scale: 1.03, zIndex: 20, boxShadow: "0 12px 36px rgba(26,62,229,0.3)" }}
            transition={{ duration: 0.2 }}
            className="group relative overflow-hidden rounded-[10px] cursor-pointer bg-[#0A1240]"
            style={{
                gridColumn: cat.gc,
                gridRow: cat.gr,
                boxShadow: "0 2px 12px rgba(26,62,229,0.15)",
            }}
        >
            {/* Background image */}
            <img
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-110 transition-transform duration-700"
            />

            {/* Bottom gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1240eb] via-[#1a3ee514] to-transparent" />

            {/* Top hover gradient */}
            <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-[#1a3ee54d] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Live dot */}
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#22D3A5] shadow-[0_0_6px_#22D3A5] block" />

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2.5 pt-2">
                <h4
                    className="font-extrabold text-white leading-tight mb-px [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]"
                    style={{ fontSize, letterSpacing: "-0.01em" }}
                >
                    {formatLabel(cat.slug)}
                </h4>
                <p className="text-[8px] font-semibold text-white/50 uppercase tracking-[0.06em]">
                    {cat.count} live
                </p>
            </div>
        </motion.div>
    );

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden py-[90px] md:py-[10px] bg-gradient-to-b from-white via-[#f0f4ff] to-white font-['Poppins','Segoe_UI',sans-serif]"
        >
            {/* Dot grid background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, rgba(26,62,229,0.07) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />

            {/* Glow blobs */}
            <div className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(26,62,229,0.07)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-[440px] h-[440px] rounded-full bg-[radial-gradient(circle,rgba(26,62,229,0.05)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative max-w-[1380px] mx-auto px-4 md:px-10">
                {/* ══ DESKTOP grid — hidden on mobile ══ */}
                <div
                    className="hidden md:grid gap-2"
                    style={{
                        gridTemplateColumns: "repeat(6, 1fr)",
                        gridTemplateRows: "repeat(6, 100px)",
                    }}
                >
                    {desktopCategories.map((cat, i) => (
                        <TileCard key={`d-${cat.slug}`} cat={cat} i={i} fontSize={12} />
                    ))}
                </div>

                {/* ══ MOBILE grid — hidden on md+ ══ */}
                <div
                    className="grid md:hidden gap-1.5"
                    style={{
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gridTemplateRows: "repeat(8, 90px)",
                    }}
                >
                    {mobileCategories.map((cat, i) => (
                        <TileCard key={`m-${cat.slug}`} cat={cat} i={i} fontSize={11} />
                    ))}
                </div>

                {/* View All CTA — mobile only */}
                <div className="mt-6 flex justify-center md:hidden">
                    <button
                        onClick={() => navigate("/category")}
                        className="border-[1.5px] border-[#1A3EE5] text-[#1A3EE5] px-8 py-3 rounded-md text-[11px] font-bold tracking-[0.18em] uppercase cursor-pointer hover:bg-[#1A3EE5] hover:text-white transition-all duration-200"
                    >
                        View All Categories →
                    </button>
                </div>
                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-8">
                    <div className="flex-1">
                        {/* Badge */}
                        {/* <motion.div
                            initial={{ opacity: 0, x: -12 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.45 }}
                            className="mb-3"
                        >
                            <span className="inline-flex items-center gap-1.5 bg-[#1a3ee514] border border-[#1a3ee530] rounded-full px-3.5 py-1 text-[10px] font-bold tracking-[0.3em] uppercase text-[#1A3EE5]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#1A3EE5] inline-block" />
                                Curated Collections
                            </span>
                        </motion.div> */}

                        {/* Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="text-[clamp(28px,4.5vw,58px)] mt-15 font-extrabold text-[#0A1240] tracking-tight leading-[1.08]"
                        >
                            Explore{" "}
                            <span className="text-[#1A3EE5] relative inline-block">
                                Premium
                                <motion.span
                                    initial={{ scaleX: 0 }}
                                    animate={isInView ? { scaleX: 1 } : {}}
                                    transition={{ duration: 0.5, delay: 0.55 }}
                                    className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-[#1A3EE5] to-[#5B78F5] rounded origin-left block"
                                />
                            </span>
                            <br />
                            Auctions
                        </motion.h2>

                        {/* Subtext */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mt-4 text-sm text-slate-500 leading-relaxed max-w-[440px]"
                        >
                            Rare items, luxury collections, and competitive live bidding — curated
                            across all 18 categories.
                        </motion.p>
                    </div>
                </div>
            </div>
            {desktopCategories.map((cat, index) => (
                <AuctionsGrid
                    heading={cat.label}
                    category={cat.slug}
                    key={index}
                    filtering={false}
                    limit={5}
                />
            ))}
        </section>
    );
}
