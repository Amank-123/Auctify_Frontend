import { useEffect, useRef } from "react";
import {
    ArrowRight,
    BadgeCheck,
    Bolt,
    CircleDot,
    Gavel,
    Search,
    Sparkles,
    Trophy,
    Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const toneMap = {
    blue: {
        pill: "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/15",
        statBg: "bg-[#EFF6FF]",
        statBorder: "border-[#BFDBFE]",
        statText: "text-[#1D4ED8]",
        iconBg: "bg-[#E6F1FB]",
        iconText: "text-[#1D4ED8]",
        button: "bg-[#2563EB] text-white hover:bg-[#1D4ED8]",
        glow: "shadow-[0_18px_40px_rgba(37,99,235,0.18)]",
    },
    amber: {
        pill: "bg-[#F59E0B]/10 text-[#854F0B] border-[#F59E0B]/20",
        statBg: "bg-[#FAEEDA]",
        statBorder: "border-[#FAC775]",
        statText: "text-[#854F0B]",
        iconBg: "bg-[#FAEEDA]",
        iconText: "text-[#854F0B]",
        button: "bg-[#F59E0B] text-white hover:bg-[#D97706]",
        glow: "shadow-[0_18px_40px_rgba(245,158,11,0.18)]",
    },
    emerald: {
        pill: "bg-[#10B981]/10 text-[#3B6D11] border-[#10B981]/20",
        statBg: "bg-[#EAF3DE]",
        statBorder: "border-[#C0DD97]",
        statText: "text-[#3B6D11]",
        iconBg: "bg-[#EAF3DE]",
        iconText: "text-[#3B6D11]",
        button: "bg-[#10B981] text-white hover:bg-[#059669]",
        glow: "shadow-[0_18px_40px_rgba(16,185,129,0.18)]",
    },
};

const HowItWorks = () => {
    const cardRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (typeof IntersectionObserver === "undefined") return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("opacity-100", "translate-y-0");
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
            desc: "Explore premium auctions by verified sellers. Electronics, collectibles, vehicles, fashion, and rare finds.",
            image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80",
            alt: "Browse auctions",
            icon: Search,
            live: false,
            statLabel: "Active listings",
            statValue: "12,450+",
            statTone: "blue",
            chips: ["Electronics", "Cars", "Luxury", "Art"],
            action: "Start exploring",
        },
        {
            num: "02",
            label: "Bid",
            title: "Bid live instantly",
            desc: "Join real-time bidding rooms, place smart bids, set your limit, and compete transparently.",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
            alt: "Live bidding",
            icon: Gavel,
            live: true,
            statLabel: "Current highest bid",
            statValue: "₹24,750",
            statSub: "12 bids in the last hour",
            statTone: "amber",
            action: "Place a bid",
        },
        {
            num: "03",
            label: "Win",
            title: "Win & connect",
            desc: "Winning buyers connect directly with sellers to finalize payment and delivery with flexibility.",
            image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1200&q=80",
            alt: "Win and connect",
            icon: Trophy,
            live: false,
            statLabel: "Winning status",
            statValue: "Confirmed",
            statTone: "emerald",
            badge: "Highest bidder confirmed",
            infoTitle: "Direct seller contact",
            infoText: "Secure, flexible post-auction communication",
            action: "You won",
        },
    ];

    const features = [
        {
            icon: BadgeCheck,
            title: "Verified sellers",
            desc: "Seller profiles and listings designed to create trust from day one.",
            tone: "blue",
        },
        {
            icon: Bolt,
            title: "Real-time bidding",
            desc: "Live updates so every participant competes on a level playing field.",
            tone: "amber",
        },
        {
            icon: Users,
            title: "Direct connection",
            desc: "Winners communicate directly with sellers after the auction closes.",
            tone: "emerald",
        },
    ];

    return (
        <>
            <style>{`
                .hiw-card {
                    transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease, opacity .5s ease, translate .5s ease;
                }
                .hiw-card:hover {
                    transform: translateY(-8px) scale(1.01);
                    box-shadow: 0 24px 50px rgba(15, 23, 42, 0.11);
                    border-color: #D1D5DB;
                }
                .hiw-card-img {
                    transition: transform .65s ease;
                }
                .hiw-card:hover .hiw-card-img {
                    transform: scale(1.06);
                }
                .hiw-btn {
                    transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
                }
                .hiw-btn:hover {
                    transform: translateY(-1px);
                }
                .hiw-btn:active {
                    transform: translateY(0);
                }
                @keyframes hiwFloat {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-6px); }
                }
                @keyframes hiwPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: .45; transform: scale(.92); }
                }
                .hiw-float {
                    animation: hiwFloat 5.5s ease-in-out infinite;
                }
            `}</style>

            <section className="min-h-screen bg-[#F8F8FF] pb-16 sm:pb-20">
                <div className="mx-auto max-w-[1240px] px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
                    <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
                            How it works
                        </div>

                        <h2 className="mx-auto max-w-3xl text-balance text-[30px] font-extrabold tracking-tight text-[#111827] sm:text-[38px] lg:text-[46px]">
                            Buy smart. <span className="text-[#2563EB]">Bid fast.</span> Win easy.
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-[14px] font-medium leading-7 text-[#4B5563] sm:text-[15px] sm:leading-8">
                            A premium auction experience built for trust, speed, and clarity.
                            Discover listings, place live bids, and connect directly after winning.
                        </p>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <button
                                onClick={() => navigate("/explore")}
                                className="hiw-btn inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(37,99,235,0.18)] hover:bg-[#1D4ED8]"
                            >
                                <Sparkles className="h-4 w-4" />
                                Explore auctions
                            </button>
                            <button
                                onClick={() => navigate("/how-it-works")}
                                className="hiw-btn inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#111827] hover:bg-[#F9FAFB]"
                            >
                                <ArrowRight className="h-4 w-4" />
                                Learn how it works
                            </button>
                        </div>
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-3 sm:gap-4">
                        {[
                            { step: "01", label: "Browse", note: "Discover verified listings" },
                            { step: "02", label: "Bid", note: "Live competition in real time" },
                            { step: "03", label: "Win", note: "Connect and complete the deal" },
                        ].map((item, index) => (
                            <div
                                key={item.step}
                                className={`hiw-float rounded-2xl border border-[#E5E7EB] bg-white px-4 py-4 shadow-sm ${
                                    index === 1 ? "sm:translate-y-2" : ""
                                }`}
                                style={{ animationDelay: `${index * 0.15}s` }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm font-bold text-[#111827]">
                                        {item.step}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold text-[#111827]">
                                            {item.label}
                                        </div>
                                        <div className="truncate text-xs font-medium text-[#6B7280]">
                                            {item.note}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:gap-5">
                        {steps.map((item, index) => {
                            const Icon = item.icon;
                            const tone = toneMap[item.statTone];

                            return (
                                <article
                                    key={item.num}
                                    ref={(el) => (cardRefs.current[index] = el)}
                                    className="hiw-card translate-y-6 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white opacity-0 shadow-sm"
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.alt}
                                            className="hiw-card-img h-48 w-full object-cover sm:h-52 lg:h-48"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                                        {item.live ? (
                                            <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#E24B4A] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-lg">
                                                <CircleDot className="h-2 w-2 fill-white" />
                                                Live
                                            </div>
                                        ) : null}

                                        <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/95 shadow-lg">
                                            <Icon className="h-5 w-5 text-[#2563EB]" />
                                        </div>
                                    </div>

                                    <div className="p-4 sm:p-5">
                                        <div
                                            className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${tone.pill}`}
                                        >
                                            <span>{item.num}</span>
                                            <span className="opacity-80">{item.label}</span>
                                        </div>

                                        <h3 className="text-[20px] font-extrabold tracking-tight text-[#111827] sm:text-[22px]">
                                            {item.title}
                                        </h3>

                                        <p className="mt-3 text-[14px] font-medium leading-7 text-[#4B5563]">
                                            {item.desc}
                                        </p>

                                        <div className="mt-4 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-3.5">
                                            <div
                                                className={`rounded-xl border p-3.5 ${tone.statBg} ${tone.statBorder}`}
                                            >
                                                <div
                                                    className={`text-[11px] font-bold uppercase tracking-[0.14em] ${tone.label}`}
                                                >
                                                    {item.statLabel}
                                                </div>
                                                <div
                                                    className={`mt-1.5 text-2xl font-extrabold tracking-tight ${tone.statText}`}
                                                >
                                                    {item.statValue}
                                                </div>

                                                {item.statSub ? (
                                                    <div className="mt-1 text-xs font-semibold text-[#854F0B]">
                                                        {item.statSub}
                                                    </div>
                                                ) : null}

                                                {item.badge ? (
                                                    <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#EAF3DE] px-3 py-1 text-xs font-bold text-[#3B6D11]">
                                                        <span className="h-2 w-2 rounded-full bg-[#10B981] animate-[hiwPulse_1.5s_infinite]" />
                                                        {item.badge}
                                                    </div>
                                                ) : null}
                                            </div>

                                            {item.infoTitle ? (
                                                <div className="mt-3 rounded-xl border border-[#E5E7EB] bg-white p-3.5">
                                                    <div className="text-sm font-bold text-[#111827]">
                                                        {item.infoTitle}
                                                    </div>
                                                    <div className="mt-1 text-sm font-medium leading-6 text-[#4B5563]">
                                                        {item.infoText}
                                                    </div>
                                                </div>
                                            ) : null}

                                            {item.chips ? (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {item.chips.map((chip) => (
                                                        <span
                                                            key={chip}
                                                            className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-xs font-semibold text-[#374151]"
                                                        >
                                                            {chip}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : null}
                                        </div>

                                        <button
                                            type="button"
                                            className={`hiw-btn mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(0,0,0,0.12)] ${tone.button}`}
                                        >
                                            {item.action}
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            const tone = toneMap[feature.tone];

                            return (
                                <div
                                    key={feature.title}
                                    className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm"
                                >
                                    <div
                                        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone.iconBg}`}
                                    >
                                        <Icon className={`h-5 w-5 ${tone.iconText}`} />
                                    </div>
                                    <h4 className="mt-4 text-lg font-extrabold tracking-tight text-[#111827]">
                                        {feature.title}
                                    </h4>
                                    <p className="mt-2 text-sm font-medium leading-7 text-[#4B5563]">
                                        {feature.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
};

export default HowItWorks;
