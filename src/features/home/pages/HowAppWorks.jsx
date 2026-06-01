import { useEffect, useRef } from "react";

const HowItWorks = () => {
    const cardRefs = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                    }
                });
            },
            { threshold: 0.15 },
        );
        cardRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const steps = [
        {
            num: "01",
            label: "Browse",
            title: "Browse & discover",
            desc: "Explore premium auctions by verified sellers — electronics, collectibles, vehicles, fashion and rare finds.",
            image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=800&q=75",
            alt: "Browse auctions",
            iconClass: "ti ti-search",
            accent: {
                numBg: "#E6F1FB",
                numColor: "#185FA5",
                iconColor: "#185FA5",
                statBg: "#E6F1FB",
                statBorder: "#B5D4F4",
                statColor: "#185FA5",
            },
            extra: (
                <div>
                    <div
                        style={{
                            background: "#E6F1FB",
                            border: "0.5px solid #B5D4F4",
                            borderRadius: 12,
                            padding: "12px 14px",
                            marginBottom: 10,
                        }}
                    >
                        <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>
                            Active listings
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 500, color: "#185FA5" }}>
                            12,450+
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                        {["Electronics", "Cars", "Luxury", "Art"].map((tag) => (
                            <span
                                key={tag}
                                style={{
                                    fontSize: 11,
                                    padding: "4px 10px",
                                    borderRadius: 100,
                                    background: "#f3f4f6",
                                    color: "#6b7280",
                                    border: "0.5px solid #e5e7eb",
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            ),
            action: "Start exploring →",
        },
        {
            num: "02",
            label: "Bid",
            title: "Bid live instantly",
            desc: "Join real-time bidding rooms, place smart bids, set your max limit, and compete transparently.",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=75",
            alt: "Live bidding",
            iconClass: "ti ti-gavel",
            live: true,
            accent: {
                numBg: "#FAEEDA",
                numColor: "#854F0B",
                iconColor: "#854F0B",
                statBg: "#FAEEDA",
                statBorder: "#FAC775",
                statColor: "#854F0B",
            },
            extra: (
                <div>
                    <div
                        style={{
                            background: "#FAEEDA",
                            border: "0.5px solid #FAC775",
                            borderRadius: 12,
                            padding: "12px 14px",
                            marginBottom: 16,
                        }}
                    >
                        <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>
                            Current highest bid
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 500, color: "#854F0B" }}>
                            ₹24,750
                        </div>
                        <div style={{ fontSize: 11, color: "#854F0B", marginTop: 2 }}>
                            12 bids in the last hour
                        </div>
                    </div>
                </div>
            ),
            action: "Place a bid →",
        },
        {
            num: "03",
            label: "Win",
            title: "Win & connect",
            desc: "Winning buyers connect directly with sellers to finalize payment and delivery with total flexibility.",
            image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=800&q=75",
            alt: "Win and connect",
            iconClass: "ti ti-trophy",
            accent: {
                numBg: "#EAF3DE",
                numColor: "#3B6D11",
                iconColor: "#3B6D11",
                statBg: "#EAF3DE",
                statBorder: "#C0DD97",
                statColor: "#3B6D11",
            },
            extra: (
                <div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            background: "#EAF3DE",
                            border: "0.5px solid #C0DD97",
                            borderRadius: 10,
                            padding: "10px 12px",
                            marginBottom: 8,
                            fontSize: 12,
                            color: "#3B6D11",
                            fontWeight: 500,
                        }}
                    >
                        <span
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: "#639922",
                                display: "inline-block",
                                animation: "pulse 1.5s infinite",
                            }}
                        />
                        Highest bidder confirmed
                    </div>
                    <div
                        style={{
                            background: "#f9fafb",
                            border: "0.5px solid #e5e7eb",
                            borderRadius: 10,
                            padding: "10px 12px",
                            marginBottom: 16,
                            fontSize: 12,
                            color: "#6b7280",
                        }}
                    >
                        <strong
                            style={{
                                color: "#111827",
                                fontWeight: 500,
                                display: "block",
                                fontSize: 13,
                            }}
                        >
                            Direct seller contact
                        </strong>
                        Secure, flexible post-auction communication
                    </div>
                </div>
            ),
            action: "You won →",
        },
    ];

    const features = [
        {
            icon: "ti ti-badge",
            title: "Verified sellers",
            desc: "Seller profiles and listings designed to create trust from day one.",
            iconBg: "#E6F1FB",
            iconColor: "#185FA5",
        },
        {
            icon: "ti ti-bolt",
            title: "Real-time bidding",
            desc: "Live updates so every participant competes on a level playing field.",
            iconBg: "#FAEEDA",
            iconColor: "#854F0B",
        },
        {
            icon: "ti ti-users",
            title: "Direct connection",
            desc: "Winners communicate directly with sellers after the auction closes.",
            iconBg: "#EAF3DE",
            iconColor: "#3B6D11",
        },
    ];

    return (
        <>
            <style>{`
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/tabler-icons.min.css');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .hiw-card { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
        .hiw-card:hover { transform: translateY(-7px) !important; box-shadow: 0 16px 40px rgba(0,0,0,0.08) !important; border-color: #d1d5db !important; }
        .hiw-card:hover .hiw-card-img { transform: scale(1.05); }
        .hiw-card-img { transition: transform 0.45s ease; }
        .hiw-feat { transition: transform 0.2s ease, background 0.2s ease; }
        .hiw-feat:hover { transform: translateY(-4px); background: #ffffff !important; }
        .hiw-cta-btn { transition: background 0.2s ease; cursor: pointer; }
        .hiw-cta-btn:hover { background: #f3f4f6 !important; }
        .hiw-banner-btn { transition: background 0.2s ease; cursor: pointer; }
        .hiw-banner-btn:hover { background: rgba(255,255,255,0.22) !important; }
      `}</style>

            <section
                style={{
                    padding: "5rem 1.5rem",
                    background: "#fafafa",
                    fontFamily: "system-ui, sans-serif",
                }}
            >
                <div style={{ maxWidth: 1080, margin: "0 auto" }}>
                    {/* Header */}
                    <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "6px 16px",
                                borderRadius: 100,
                                background: "#fff",
                                border: "0.5px solid #e5e7eb",
                                fontSize: 11,
                                fontWeight: 500,
                                color: "#6b7280",
                                letterSpacing: "0.05em",
                                marginBottom: "1.25rem",
                                textTransform: "uppercase",
                            }}
                        >
                            <span
                                style={{
                                    width: 7,
                                    height: 7,
                                    borderRadius: "50%",
                                    background: "#378ADD",
                                    display: "inline-block",
                                }}
                            />
                            How it works
                        </div>

                        <h2
                            style={{
                                fontSize: "clamp(26px, 4vw, 42px)",
                                fontWeight: 500,
                                lineHeight: 1.15,
                                color: "#0f172a",
                                marginBottom: "0.75rem",
                            }}
                        >
                            Buy smart. <span style={{ color: "#185FA5" }}>Bid fast.</span> Win easy.
                        </h2>

                        <p
                            style={{
                                fontSize: 15,
                                color: "#6b7280",
                                maxWidth: 460,
                                margin: "0 auto 2.5rem",
                                lineHeight: 1.7,
                            }}
                        >
                            A premium auction experience built for trust and speed. Discover
                            products, place live bids, and connect directly after winning.
                        </p>

                        {/* Step connector */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "2.5rem",
                            }}
                        >
                            {["01 Browse", "02 Bid", "03 Win"].map((s, i) => {
                                const [num, label] = s.split(" ");
                                return (
                                    <div key={i} style={{ display: "flex", alignItems: "center" }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: 5,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: "50%",
                                                    border: "0.5px solid #d1d5db",
                                                    background: "#fff",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                    color: "#374151",
                                                }}
                                            >
                                                {num}
                                            </div>
                                            <span style={{ fontSize: 11, color: "#9ca3af" }}>
                                                {label}
                                            </span>
                                        </div>
                                        {i < 2 && (
                                            <div
                                                style={{
                                                    width: 70,
                                                    height: 0.5,
                                                    background: "#d1d5db",
                                                    margin: "0 6px",
                                                    marginBottom: 20,
                                                }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Cards */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: "1.25rem",
                            marginBottom: "1.25rem",
                        }}
                    >
                        {steps.map((item, i) => (
                            <div
                                key={i}
                                ref={(el) => (cardRefs.current[i] = el)}
                                className="hiw-card"
                                style={{
                                    background: "#fff",
                                    border: "0.5px solid #e5e7eb",
                                    borderRadius: 20,
                                    overflow: "hidden",
                                    opacity: 0,
                                    transform: "translateY(24px)",
                                    transition: `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`,
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {/* Image */}
                                <div style={{ position: "relative", overflow: "hidden" }}>
                                    <img
                                        src={item.image}
                                        alt={item.alt}
                                        className="hiw-card-img"
                                        style={{
                                            width: "100%",
                                            height: 165,
                                            objectFit: "cover",
                                            display: "block",
                                        }}
                                    />
                                    <div
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            background:
                                                "linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 60%)",
                                        }}
                                    />
                                    {item.live && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 12,
                                                right: 12,
                                                background: "#E24B4A",
                                                color: "#fff",
                                                fontSize: 10,
                                                fontWeight: 500,
                                                padding: "3px 10px",
                                                borderRadius: 100,
                                                letterSpacing: "0.06em",
                                            }}
                                        >
                                            ● LIVE
                                        </div>
                                    )}
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: 12,
                                            left: 14,
                                            width: 38,
                                            height: 38,
                                            borderRadius: 12,
                                            background: "rgba(255,255,255,0.92)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <i
                                            className={item.iconClass}
                                            style={{ fontSize: 18, color: item.accent.iconColor }}
                                        />
                                    </div>
                                </div>

                                {/* Body */}
                                <div
                                    style={{
                                        padding: "1.25rem",
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <span
                                        style={{
                                            display: "inline-block",
                                            fontSize: 11,
                                            fontWeight: 500,
                                            padding: "3px 10px",
                                            borderRadius: 100,
                                            background: item.accent.numBg,
                                            color: item.accent.numColor,
                                            marginBottom: 10,
                                        }}
                                    >
                                        {item.num} — {item.label}
                                    </span>
                                    <div
                                        style={{
                                            fontSize: 17,
                                            fontWeight: 500,
                                            color: "#0f172a",
                                            marginBottom: 6,
                                        }}
                                    >
                                        {item.title}
                                    </div>
                                    <p
                                        style={{
                                            fontSize: 13,
                                            color: "#6b7280",
                                            lineHeight: 1.65,
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        {item.desc}
                                    </p>
                                    <div style={{ flex: 1 }}>{item.extra}</div>
                                    <button
                                        className="hiw-cta-btn"
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            borderRadius: 12,
                                            border: "0.5px solid #e5e7eb",
                                            background: "transparent",
                                            color: "#374151",
                                            fontSize: 13,
                                            fontWeight: 500,
                                            fontFamily: "inherit",
                                        }}
                                    >
                                        {item.action}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Trust Section */}
                </div>
            </section>
        </>
    );
};

export default HowItWorks;
