import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

/*
  MOBILE: Windows Phone Live Tiles — 3 columns × 8 rows (exact filled rectangle)
  ┌──────────┬──────────┬──────────┐
  │electronics│ fashion │  jewelry │  rows 1-2 / 1-1 / 1-2
  │  2 rows  ├──────────┤  2 rows  │
  │          │  art     │          │  row 2
  ├──────────┼──────────┼──────────┤
  │  sports  │  gaming  │  music   │  rows 3-4 / 3-4 / 3-3
  │  2 rows  │  2 rows  ├──────────┤
  │          │          │  toys    │  row 4
  ├──────────┼──────────┼──────────┤
  │  watches │collectibl│  luxury  │  rows 5-5 / 5-6 / 5-5
  ├──────────┤  2 rows  ├──────────┤
  │  vehicles│          │ furniture│  row 6
  ├──────────┼──────────┼──────────┤
  │  antiques│real_estat│  books   │  rows 7-7 / 7-8 / 7-7
  ├──────────┤  2 rows  ├──────────┤
  │industrial│          │  other   │  row 8
  └──────────┴──────────┴──────────┘

  DESKTOP: 6 columns × 6 rows (existing layout)
*/

export default function PremiumCategories() {
    const navigate = useNavigate();
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

    // Desktop categories (6-col mosaic)
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

    // Mobile: 3-col × 8-row Windows Phone Live Tiles
    // Each row = 90px. Columns sum to exactly 8 rows each.
    const mobileCategories = [
        // Col 1: electronics(1-2) + sports(3-4) + watches(5) + vehicles(6) + antiques(7) + industrial(8)
        {
            slug: "electronics",
            label: "Electronics",
            count: 31,
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
            gc: "1",
            gr: "1 / span 2",
        },
        {
            slug: "sports",
            label: "Sports",
            count: 16,
            image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
            gc: "1",
            gr: "3 / span 2",
        },
        {
            slug: "watches",
            label: "Watches",
            count: 24,
            image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80",
            gc: "1",
            gr: "5 / span 1",
        },
        {
            slug: "vehicles",
            label: "Vehicles",
            count: 18,
            image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80",
            gc: "1",
            gr: "6 / span 1",
        },
        {
            slug: "antiques",
            label: "Antiques",
            count: 6,
            image: "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?auto=format&fit=crop&w=800&q=80",
            gc: "1",
            gr: "7 / span 1",
        },
        {
            slug: "industrial",
            label: "Industrial",
            count: 4,
            image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80",
            gc: "1",
            gr: "8 / span 1",
        },
        // Col 2: fashion(1) + art(2) + gaming(3-4) + collectibles(5-6) + real_estate(7-8)
        {
            slug: "fashion",
            label: "Fashion",
            count: 19,
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
            gc: "2",
            gr: "1 / span 1",
        },
        {
            slug: "art",
            label: "Art",
            count: 9,
            image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80",
            gc: "2",
            gr: "2 / span 1",
        },
        {
            slug: "gaming",
            label: "Gaming",
            count: 11,
            image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80",
            gc: "2",
            gr: "3 / span 2",
        },
        {
            slug: "collectibles",
            label: "Collectibles",
            count: 14,
            image: "https://images.unsplash.com/photo-1612196808214-b7e239e5a4f4?auto=format&fit=crop&w=800&q=80",
            gc: "2",
            gr: "5 / span 2",
        },
        {
            slug: "real_estate",
            label: "Real Estate",
            count: 5,
            image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
            gc: "2",
            gr: "7 / span 2",
        },
        // Col 3: jewelry(1-2) + music(3) + toys(4) + luxury(5) + furniture(6) + books(7) + other(8)
        {
            slug: "jewelry",
            label: "Jewelry",
            count: 27,
            image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
            gc: "3",
            gr: "1 / span 2",
        },
        {
            slug: "music",
            label: "Music",
            count: 7,
            image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
            gc: "3",
            gr: "3 / span 1",
        },
        {
            slug: "toys",
            label: "Toys",
            count: 10,
            image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80",
            gc: "3",
            gr: "4 / span 1",
        },
        {
            slug: "luxury",
            label: "Luxury",
            count: 12,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
            gc: "3",
            gr: "5 / span 1",
        },
        {
            slug: "furniture",
            label: "Furniture",
            count: 8,
            image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
            gc: "3",
            gr: "6 / span 1",
        },
        {
            slug: "books",
            label: "Books",
            count: 22,
            image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80",
            gc: "3",
            gr: "7 / span 1",
        },
        {
            slug: "other",
            label: "Other",
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
            key={cat.slug}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            onClick={() => navigate(`/auctions?category=${cat.slug}`)}
            className="group"
            style={{
                gridColumn: cat.gc,
                gridRow: cat.gr,
                borderRadius: 10,
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                background: "#0A1240",
                boxShadow: "0 2px 12px rgba(26,62,229,0.15)",
            }}
            whileHover={{
                scale: 1.03,
                zIndex: 20,
                boxShadow: "0 12px 36px rgba(26,62,229,0.3)",
            }}
            transition={{ duration: 0.2 }}
        >
            <img
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                style={{ opacity: 0.55 }}
            />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(to top, rgba(10,18,64,0.92) 0%, rgba(26,62,229,0.08) 55%, transparent 100%)",
                }}
            />
            <div
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "40%",
                    background: "linear-gradient(to bottom, rgba(26,62,229,0.3), transparent)",
                }}
            />
            {/* Live dot */}
            <span
                style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#22D3A5",
                    boxShadow: "0 0 6px #22D3A5",
                    display: "block",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "8px 10px 10px",
                }}
            >
                <h4
                    style={{
                        fontSize,
                        fontWeight: 800,
                        color: "#fff",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.2,
                        margin: 0,
                        marginBottom: 1,
                        textShadow: "0 1px 8px rgba(0,0,0,0.6)",
                    }}
                >
                    {formatLabel(cat.slug)}
                </h4>
                <p
                    style={{
                        fontSize: 8,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.5)",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        margin: 0,
                    }}
                >
                    {cat.count} live
                </p>
            </div>
        </motion.div>
    );

    return (
        <>
            <style>{`
                .pc-desktop { display: grid; }
                .pc-mobile  { display: none; }
                .pc-mobile-cta { display: none; }
                .pc-header-btn { display: flex; }

                @media (max-width: 767px) {
                    .pc-desktop     { display: none !important; }
                    .pc-mobile      { display: grid !important; }
                    .pc-mobile-cta  { display: block !important; }
                    .pc-header-btn  { display: none !important; }
                    .pc-section     { padding: 48px 0 64px !important; }
                    .pc-container   { padding: 0 14px !important; }
                    .pc-heading     { font-size: 28px !important; line-height: 1.15 !important; }
                    .pc-subtext     { font-size: 12px !important; margin-top: 10px !important; max-width: 100% !important; }
                    .pc-header-wrap { margin-bottom: 24px !important; flex-direction: column !important; align-items: flex-start !important; gap: 12px; }
                    .pc-badge       { font-size: 9px !important; padding: 4px 10px !important; }
                }
            `}</style>

            <section
                ref={sectionRef}
                className="pc-section"
                style={{
                    background: "linear-gradient(180deg, #ffffff 0%, #f0f4ff 60%, #ffffff 100%)",
                    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                    padding: "90px 0 110px",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Dot grid */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        backgroundImage:
                            "radial-gradient(circle, rgba(26,62,229,0.07) 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: -200,
                        right: -200,
                        width: 560,
                        height: 560,
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, rgba(26,62,229,0.07) 0%, transparent 70%)",
                        pointerEvents: "none",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: -150,
                        left: -150,
                        width: 440,
                        height: 440,
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, rgba(26,62,229,0.05) 0%, transparent 70%)",
                        pointerEvents: "none",
                    }}
                />

                <div
                    className="pc-container"
                    style={{
                        maxWidth: 1380,
                        margin: "0 auto",
                        padding: "0 40px",
                        position: "relative",
                    }}
                >
                    {/* ── Header ── */}
                    <div
                        className="pc-header-wrap"
                        style={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                            marginBottom: 48,
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            <motion.div
                                initial={{ opacity: 0, x: -12 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.45 }}
                                style={{ marginBottom: 12 }}
                            >
                                <span
                                    className="pc-badge"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 6,
                                        background: "rgba(26,62,229,0.08)",
                                        border: "1px solid rgba(26,62,229,0.18)",
                                        borderRadius: 100,
                                        padding: "5px 14px",
                                        fontSize: 10,
                                        fontWeight: 700,
                                        letterSpacing: "0.3em",
                                        textTransform: "uppercase",
                                        color: "#1A3EE5",
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: "50%",
                                            background: "#1A3EE5",
                                            display: "inline-block",
                                        }}
                                    />
                                    Curated Collections
                                </span>
                            </motion.div>

                            <motion.h2
                                className="pc-heading"
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                                style={{
                                    fontSize: "clamp(34px, 4.5vw, 58px)",
                                    fontWeight: 800,
                                    color: "#0A1240",
                                    letterSpacing: "-0.03em",
                                    lineHeight: 1.08,
                                    margin: 0,
                                }}
                            >
                                Explore{" "}
                                <span
                                    style={{
                                        color: "#1A3EE5",
                                        position: "relative",
                                        display: "inline-block",
                                    }}
                                >
                                    Premium
                                    <motion.span
                                        initial={{ scaleX: 0 }}
                                        animate={isInView ? { scaleX: 1 } : {}}
                                        transition={{ duration: 0.5, delay: 0.55 }}
                                        style={{
                                            position: "absolute",
                                            bottom: -3,
                                            left: 0,
                                            right: 0,
                                            height: 3,
                                            background: "linear-gradient(90deg, #1A3EE5, #5B78F5)",
                                            borderRadius: 2,
                                            transformOrigin: "left",
                                        }}
                                    />
                                </span>
                                <br />
                                Auctions
                            </motion.h2>

                            <motion.p
                                className="pc-subtext"
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                style={{
                                    marginTop: 16,
                                    fontSize: 14,
                                    color: "#64748B",
                                    fontWeight: 400,
                                    lineHeight: 1.7,
                                    maxWidth: 440,
                                }}
                            >
                                Rare items, luxury collections, and competitive live bidding —
                                curated across all 18 categories.
                            </motion.p>
                        </div>

                        <motion.button
                            className="pc-header-btn"
                            initial={{ opacity: 0, x: 20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.45, delay: 0.25 }}
                            whileHover={{ scale: 1.03, background: "#1A3EE5", color: "#fff" }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate("/categories")}
                            style={{
                                background: "transparent",
                                border: "1.5px solid #1A3EE5",
                                color: "#1A3EE5",
                                padding: "12px 28px",
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                cursor: "pointer",
                                borderRadius: 6,
                                alignItems: "center",
                                gap: 8,
                                transition: "all 0.25s ease",
                                flexShrink: 0,
                                marginLeft: 24,
                            }}
                        >
                            View All <span style={{ fontSize: 14 }}>→</span>
                        </motion.button>
                    </div>

                    {/* ══ DESKTOP: 6-col × 6-row mosaic ══ */}
                    <div
                        className="pc-desktop"
                        style={{
                            gridTemplateColumns: "repeat(6, 1fr)",
                            gridTemplateRows: "repeat(6, 100px)",
                            gap: 8,
                        }}
                    >
                        {desktopCategories.map((cat, i) => (
                            <TileCard key={`d-${cat.slug}`} cat={cat} i={i} fontSize={12} />
                        ))}
                    </div>

                    {/* ══ MOBILE: Windows Phone 3-col × 8-row Live Tiles ══ */}
                    <div
                        className="pc-mobile"
                        style={{
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gridTemplateRows: "repeat(8, 90px)",
                            gap: 6,
                        }}
                    >
                        {mobileCategories.map((cat, i) => (
                            <TileCard key={`m-${cat.slug}`} cat={cat} i={i} fontSize={11} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
