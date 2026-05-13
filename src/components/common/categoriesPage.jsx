import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { Radio, ArrowRight, LayoutGrid, Sparkles } from "lucide-react";
import { api } from "@/shared/services/axios";
import { usePageTitle } from "../../shared/utils/usePageTitle";

/* ─────────────────────────────────────────────
   DESKTOP MOSAIC — 6 cols × 6 rows, all 1fr
   Every cell is explicitly placed, no gaps.
───────────────────────────────────────────── */
const DESKTOP_LAYOUT = [
    { gc: "1 / span 1", gr: "1 / span 3" },
    { gc: "1 / span 1", gr: "4 / span 3" },
    { gc: "2 / span 1", gr: "1 / span 2" },
    { gc: "2 / span 1", gr: "3 / span 2" },
    { gc: "2 / span 1", gr: "5 / span 2" },
    { gc: "3 / span 1", gr: "1 / span 3" },
    { gc: "3 / span 1", gr: "4 / span 2" },
    { gc: "3 / span 1", gr: "6 / span 1" },
    { gc: "4 / span 1", gr: "1 / span 2" },
    { gc: "4 / span 1", gr: "3 / span 2" },
    { gc: "4 / span 1", gr: "5 / span 2" },
    { gc: "5 / span 1", gr: "1 / span 2" },
    { gc: "5 / span 1", gr: "3 / span 2" },
    { gc: "5 / span 1", gr: "5 / span 2" },
    { gc: "6 / span 1", gr: "1 / span 2" },
    { gc: "6 / span 1", gr: "3 / span 2" },
    { gc: "6 / span 1", gr: "5 / span 1" },
    { gc: "6 / span 1", gr: "6 / span 1" },
];

/*
 * MOBILE — 2 columns, alternating tall/short pattern.
 *
 * The trick: we lay out cards in pairs. Within each pair:
 *   - Left card spans 2 rows (tall)
 *   - Right card spans 1 row each (two shorts stacked)
 * Then the next pair flips: left = 2 shorts, right = tall.
 * This gives an irregular but gapless rhythm.
 *
 * We use an explicit row counter so every card slots in perfectly.
 * Total rows = ceil(N/2) * 2 — always even, always filled.
 */
function buildMobileLayout(count) {
    const layout = [];
    let row = 1;
    let i = 0;
    while (i < count) {
        const pairIndex = Math.floor(i / 3); // every 3 cards = 1 "set"
        if (pairIndex % 2 === 0) {
            // Pattern A: col1=tall(2), col2=short+short
            if (i < count) {
                layout.push({ gc: "1 / span 1", gr: `${row} / span 2` });
                i++;
            }
            if (i < count) {
                layout.push({ gc: "2 / span 1", gr: `${row} / span 1` });
                i++;
            }
            if (i < count) {
                layout.push({ gc: "2 / span 1", gr: `${row + 1} / span 1` });
                i++;
            }
            row += 2;
        } else {
            // Pattern B: col1=short+short, col2=tall(2)
            if (i < count) {
                layout.push({ gc: "1 / span 1", gr: `${row} / span 1` });
                i++;
            }
            if (i < count) {
                layout.push({ gc: "1 / span 1", gr: `${row + 1} / span 1` });
                i++;
            }
            if (i < count) {
                layout.push({ gc: "2 / span 1", gr: `${row} / span 2` });
                i++;
            }
            row += 2;
        }
    }
    return { layout, totalRows: row - 1 };
}

const toSlug = (name) => name.toLowerCase().replace(/\s+/g, "-");

/* ─────────────────────────────────────────────
   TILE CARD
───────────────────────────────────────────── */
function TileCard({ cat, i, isInView, style }) {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ delay: i * 0.03, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => navigate(`/category/${cat.slug}`)}
            whileHover={{ scale: 1.015, transition: { duration: 0.18 } }}
            className="group relative overflow-hidden rounded-2xl cursor-pointer bg-slate-900"
            style={style}
            role="button"
            tabIndex={0}
            aria-label={`Browse ${cat.label} auctions`}
            onKeyDown={(e) => e.key === "Enter" && navigate(`/category/${cat.slug}`)}
        >
            {cat.image ? (
                <img
                    src={cat.image}
                    alt={cat.label}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-800 to-slate-900" />
            )}

            {/* dark gradient overlay — stronger at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />

            {/* hover blue tint */}
            <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-300" />

            {/* LIVE badge */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                <Radio
                    size={8}
                    className="text-emerald-400"
                    style={{ filter: "drop-shadow(0 0 5px #34d399)" }}
                    strokeWidth={2.5}
                />
                <span className="text-[7.5px] font-bold uppercase tracking-widest text-white/70 leading-none">
                    Live
                </span>
            </div>

            {/* label */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
                {/* <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40 mb-0.5">
                    Premium
                </p> */}
                <h4
                    className="font-black text-white leading-tight line-clamp-2 [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]"
                    style={{ fontSize: "clamp(11px, 1.2vw, 15px)" }}
                >
                    {cat.label}
                </h4>
                <div className="mt-1.5 flex items-center gap-1 text-blue-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                    <span className="text-[10px] font-bold">Explore</span>
                    <ArrowRight size={10} strokeWidth={2.5} />
                </div>
            </div>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
export default function PremiumCategories() {
    usePageTitle("Auctify | Categories Page");
    const navigate = useNavigate();
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [desktopGridHeight, setDesktopGridHeight] = useState(700);

    // Measure the header block so the grid can fill exactly the remaining space
    useEffect(() => {
        const measure = () => {
            if (!sectionRef.current || !headerRef.current) return;
            const sectionPaddingTop = 56; // py-14 = 3.5rem = 56px
            const sectionPaddingBottom = 56;
            const headerH = headerRef.current.offsetHeight;
            const gap = 40; // breathing room between header and grid
            const available =
                window.innerHeight - sectionPaddingTop - sectionPaddingBottom - headerH - gap;
            // Clamp: never smaller than 480px, never larger than 900px
            setDesktopGridHeight(Math.min(900, Math.max(480, available)));
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [loading]); // re-measure once data loads (header size may change)

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await api.get("/api/category/get");
                if (!cancelled) setCategories(res?.data?.data || []);
            } catch (e) {
                if (!cancelled) setError("Failed to load categories.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const capped = categories.slice(0, 18);
    const hasData = capped.length > 0;

    // Mobile layout is dynamic based on actual count
    const { layout: mobileLayout, totalRows: mobileTotalRows } = buildMobileLayout(capped.length);

    const mobileCards = capped.map((cat, i) => ({
        ...cat,
        slug: toSlug(cat.name),
        label: cat.name,
        ...mobileLayout[i],
    }));

    const desktopCards = capped.map((cat, i) => ({
        ...cat,
        slug: toSlug(cat.name),
        label: cat.name,
        ...DESKTOP_LAYOUT[i % DESKTOP_LAYOUT.length],
    }));

    /* ── RENDER ── */
    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white py-10 md:py-14"
        >
            {/* subtle dot grid */}
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-[0.4]"
                style={{
                    backgroundImage: "radial-gradient(rgba(37,99,235,0.12) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            {/* top glow */}
            <div
                aria-hidden
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse at center, rgba(37,99,235,0.08) 0%, transparent 70%)",
                }}
            />

            {/* ── HEADER ── */}
            <div ref={headerRef} className="relative px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
                <div className="max-w-[680px] mx-auto text-center mb-8 md:mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 rounded-full bg-blue-50 border border-blue-100"
                    >
                        <Sparkles size={11} className="text-blue-600" strokeWidth={2.5} />
                        <span className="text-[9.5px] font-bold uppercase tracking-[0.28em] text-blue-700">
                            Curated Collections
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 18 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.07 }}
                        className="text-[clamp(28px,4.5vw,56px)] font-black tracking-tight leading-[1.06] text-slate-950"
                    >
                        Explore <span className="text-blue-600">Premium</span>
                        <br />
                        Auction Categories
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.45, delay: 0.14 }}
                        className="mt-4 text-sm text-slate-500 leading-relaxed max-w-[480px] mx-auto"
                    >
                        Browse rare collectibles, luxury items, electronics, fashion and vehicles
                        from premium live auctions on your marketplace.
                    </motion.p>
                </div>
            </div>

            {/* ── GRID AREA — small side padding so cards don't kiss the edge ── */}
            <div className="px-2 sm:px-3 md:px-4">
                {/* LOADING */}
                {loading && (
                    <div
                        className="grid gap-2"
                        style={{
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gridTemplateRows: "repeat(6, 120px)",
                        }}
                    >
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="rounded-2xl bg-slate-200 animate-pulse" />
                        ))}
                    </div>
                )}

                {/* ERROR */}
                {!loading && error && (
                    <div className="flex flex-col items-center gap-3 py-20 text-center">
                        <LayoutGrid size={38} className="text-slate-300" />
                        <p className="text-slate-500 text-sm">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* EMPTY */}
                {!loading && !error && !hasData && (
                    <div className="flex flex-col items-center gap-3 py-20 text-center">
                        <LayoutGrid size={38} className="text-slate-300" />
                        <p className="text-slate-400 text-sm">No categories available yet.</p>
                    </div>
                )}

                {hasData && !loading && !error && (
                    <>
                        {/*
                         * DESKTOP GRID
                         * - 6 equal columns (1fr each) → fills full width
                         * - 6 equal rows (1fr each) + explicit height → fills that height perfectly
                         * - No leftover space because 1fr rows divide the height evenly
                         */}
                        <div
                            className="hidden md:grid"
                            style={{
                                gridTemplateColumns: "repeat(6, 1fr)",
                                gridTemplateRows: "repeat(6, 1fr)",
                                gap: "10px",
                                height: `${desktopGridHeight}px`,
                                width: "100%",
                            }}
                        >
                            {desktopCards.map((cat, i) => (
                                <TileCard
                                    key={`d-${cat._id ?? i}`}
                                    cat={cat}
                                    i={i}
                                    isInView={isInView}
                                    style={{ gridColumn: cat.gc, gridRow: cat.gr }}
                                />
                            ))}
                        </div>

                        {/*
                         * MOBILE GRID
                         * - 2 equal columns (1fr each) → fills full width
                         * - totalRows computed from buildMobileLayout, each row = fixed 130px
                         *   We use px here on mobile (not vh) because the grid is very tall
                         *   and we WANT it to scroll — unlike desktop where it fits the viewport.
                         * - Cards alternate tall (130px×2 = 260px) and short (130px) each pair
                         *   so sizes differ and there's never an empty cell.
                         */}
                        <div
                            className="grid md:hidden"
                            style={{
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gridTemplateRows: `repeat(${mobileTotalRows}, 130px)`,
                                gap: "8px",
                                width: "100%",
                            }}
                        >
                            {mobileCards.map((cat, i) => (
                                <TileCard
                                    key={`m-${cat._id ?? i}`}
                                    cat={cat}
                                    i={i}
                                    isInView={isInView}
                                    style={{ gridColumn: cat.gc, gridRow: cat.gr }}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
