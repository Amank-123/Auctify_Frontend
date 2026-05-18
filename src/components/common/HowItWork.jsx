import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Gavel,
    Trophy,
    Package,
    Clock3,
    ArrowRight,
    ChevronDown,
    Users,
    ShieldCheck,
    Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTitle } from "../../shared/utils/usePageTitle";

export default function HowItWorksPage() {
    const navigate = useNavigate();
    usePageTitle("Auctify | How it works");
    const [tab, setTab] = useState("buyer");
    const [openFaq, setOpenFaq] = useState(null);

    const buyerSteps = [
        {
            icon: Search,
            title: "Discover Auctions",
            sub: "Browse Listings",
            desc: "Explore premium live auctions across electronics, fashion, vehicles, collectibles and more in real time.",
            stat: "10K+",
            statLabel: "Active Listings",
        },
        {
            icon: Gavel,
            title: "Place Your Bid",
            sub: "Bid Live",
            desc: "Compete with buyers in real time using instant bid updates and transparent auction activity.",
            stat: "<1s",
            statLabel: "Bid Updates",
        },
        {
            icon: Trophy,
            title: "Win Auctions",
            sub: "Secure Victory",
            desc: "The highest bidder automatically wins once the countdown reaches zero.",
            stat: "100%",
            statLabel: "Transparent",
        },
        {
            icon: Package,
            title: "Receive Item",
            sub: "Delivery & Payment",
            desc: "Complete secure checkout and receive your item with buyer protection included.",
            stat: "Secure",
            statLabel: "Payments",
        },
    ];

    const sellerSteps = [
        {
            icon: Package,
            title: "Create Listing",
            sub: "Upload Product",
            desc: "Add images, pricing details and product descriptions in just a few minutes.",
            stat: "2 Min",
            statLabel: "Setup Time",
        },
        {
            icon: Clock3,
            title: "Configure Auction",
            sub: "Set Rules",
            desc: "Choose starting price, auction duration and bidding preferences easily.",
            stat: "Flexible",
            statLabel: "Controls",
        },
        {
            icon: Gavel,
            title: "Receive Bids",
            sub: "Real-Time Activity",
            desc: "Track bidding activity live while buyers compete for your listing.",
            stat: "Live",
            statLabel: "Updates",
        },
        {
            icon: Trophy,
            title: "Sell Securely",
            sub: "Close Auction",
            desc: "The winning bidder is selected automatically and payments are handled securely.",
            stat: "0%",
            statLabel: "Hidden Fees",
        },
    ];

    const faqs = [
        {
            q: "Is bidding free on Auctify?",
            a: "Yes. Users can browse and place bids without additional charges.",
        },
        {
            q: "How is the winner selected?",
            a: "The highest valid bid before the timer ends wins automatically.",
        },
        {
            q: "Can I sell used products?",
            a: "Yes, used and pre-owned items are allowed under approved categories.",
        },
        {
            q: "Are sellers verified?",
            a: "Every seller goes through verification checks before listing products.",
        },
    ];

    const metrics = [
        {
            icon: Users,
            value: "50K+",
            label: "Active Users",
        },
        {
            icon: Zap,
            value: "99.9%",
            label: "Platform Uptime",
        },
        {
            icon: ShieldCheck,
            value: "Secure",
            label: "Transactions",
        },
    ];

    const steps = tab === "buyer" ? buyerSteps : sellerSteps;

    return (
        <div className="min-h-screen bg-[#FAFBFF] overflow-x-hidden">
            {/* TOP BAR */}
            <div
                className="
                    bg-[#2563EB]
                    px-4 sm:px-6 lg:px-8
                    py-2.5
                    flex flex-wrap
                    items-center justify-center
                    gap-2 sm:gap-6
                    text-center
                "
            >
                <div className="flex items-center gap-2">
                    <motion.span
                        animate={{
                            scale: [1, 1.4, 1],
                            opacity: [1, 0.5, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                        }}
                        className="w-2 h-2 rounded-full bg-green-400"
                    />

                    <span className="text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-semibold text-white">
                        Real-Time Auctions
                    </span>
                </div>

                <span className="hidden sm:block text-white/30">|</span>

                <span className="text-[10px] sm:text-[11px] text-white/70">Secure Marketplace</span>

                <span className="hidden sm:block text-white/30">|</span>

                <span className="text-[10px] sm:text-[11px] text-white/70">Verified Sellers</span>
            </div>

            {/* HERO */}
            <section className="relative">
                <div
                    className="
                        max-w-[1100px]
                        mx-auto
                        px-4 sm:px-6 lg:px-8
                        pt-16 sm:pt-20
                        pb-14 sm:pb-16
                        text-center
                    "
                >
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="
                            inline-flex items-center gap-2
                            px-3 py-1
                            rounded-full
                            bg-blue-50
                            border border-blue-100
                            text-blue-600
                            text-[11px]
                            font-semibold
                            tracking-[0.12em]
                            uppercase
                            mb-6
                        "
                    >
                        How Auctify Works
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="
                            text-[34px]
                            sm:text-[48px]
                            lg:text-[60px]
                            font-bold
                            tracking-tight
                            leading-[1.05]
                            text-slate-900
                        "
                    >
                        Bid smarter.
                        <br />
                        Sell faster.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="
                            max-w-[620px]
                            mx-auto
                            mt-5
                            text-[14px] sm:text-[16px]
                            leading-7
                            text-slate-600
                        "
                    >
                        Discover live auctions, compete in real time, and sell directly to verified
                        buyers on Auctify.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="
                            flex flex-col sm:flex-row
                            justify-center
                            gap-3
                            mt-8
                        "
                    >
                        <button
                            onClick={() => navigate("/explore")}
                            className="
                                h-11 sm:h-12
                                px-6
                                rounded-xl
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                text-sm
                                font-semibold
                                transition
                                shadow-sm
                            "
                        >
                            Explore Auctions
                        </button>

                        <button
                            onClick={() => navigate("/auction/create")}
                            className="
                                h-11 sm:h-12
                                px-6
                                rounded-xl
                                bg-white
                                border border-slate-200
                                hover:border-blue-300
                                text-slate-800
                                text-sm
                                font-semibold
                                transition
                                flex items-center justify-center gap-2
                            "
                        >
                            Sell an Item
                            <ArrowRight size={16} />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* METRICS */}
            <section className="pb-10 sm:pb-14">
                <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        className="
                            grid
                            grid-cols-1
                            sm:grid-cols-3
                            gap-4
                        "
                    >
                        {metrics.map((item, i) => {
                            const Icon = item.icon;

                            return (
                                <motion.div
                                    key={i}
                                    initial={{
                                        opacity: 0,
                                        y: 20,
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: i * 0.1,
                                    }}
                                    className="
                                        bg-white
                                        rounded-2xl
                                        border border-slate-200
                                        p-5
                                        flex items-center gap-4
                                    "
                                >
                                    <div
                                        className="
                                            w-11 h-11
                                            rounded-xl
                                            bg-blue-50
                                            flex items-center justify-center
                                            shrink-0
                                        "
                                    >
                                        <Icon size={18} className="text-blue-600" />
                                    </div>

                                    <div>
                                        <h3
                                            className="
                                                text-[20px]
                                                font-bold
                                                text-slate-900
                                            "
                                        >
                                            {item.value}
                                        </h3>

                                        <p
                                            className="
                                                text-[12px]
                                                text-slate-500
                                            "
                                        >
                                            {item.label}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* TABS */}
            <section className="pb-10">
                <div className="flex justify-center px-4">
                    <div
                        className="
                            bg-white
                            rounded-2xl
                            border border-slate-200
                            p-1
                            flex
                            gap-1
                            w-full sm:w-auto
                        "
                    >
                        {["buyer", "seller"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`
                                    flex-1 sm:flex-none
                                    h-11
                                    px-6
                                    rounded-xl
                                    text-sm
                                    font-semibold
                                    transition
                                    ${tab === t ? "bg-blue-600 text-white" : "text-slate-600"}
                                `}
                            >
                                {t === "buyer" ? "For Buyers" : "For Sellers"}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* STEPS */}
            <section className="pb-20">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={tab}
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                y: -20,
                            }}
                            transition={{
                                duration: 0.3,
                            }}
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                xl:grid-cols-4
                                gap-4 sm:gap-5
                            "
                        >
                            {steps.map((item, i) => {
                                const Icon = item.icon;

                                return (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -4 }}
                                        className="
                                            bg-white
                                            rounded-2xl
                                            border border-slate-200
                                            p-4 sm:p-5
                                            transition-all duration-300
                                            hover:border-blue-300
                                            hover:shadow-lg hover:shadow-blue-100/40
                                        "
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div
                                                className="
                                                    w-11 h-11
                                                    rounded-xl
                                                    bg-blue-50
                                                    flex items-center justify-center
                                                "
                                            >
                                                <Icon size={18} className="text-blue-600" />
                                            </div>

                                            <span
                                                className="
                                                    text-[10px]
                                                    font-semibold
                                                    text-slate-400
                                                "
                                            >
                                                0{i + 1}
                                            </span>
                                        </div>

                                        <h3
                                            className="
                                                text-[17px] sm:text-[18px]
                                                font-bold
                                                text-slate-900
                                                tracking-tight
                                                mb-1.5
                                            "
                                        >
                                            {item.title}
                                        </h3>

                                        <p
                                            className="
                                                text-[11px]
                                                uppercase
                                                tracking-[0.14em]
                                                text-blue-600
                                                font-semibold
                                                mb-3
                                            "
                                        >
                                            {item.sub}
                                        </p>

                                        <p
                                            className="
                                                text-[13px]
                                                leading-6
                                                text-slate-600
                                            "
                                        >
                                            {item.desc}
                                        </p>

                                        <div className="mt-5 pt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="
                                                        text-[15px]
                                                        font-bold
                                                        text-slate-900
                                                    "
                                                >
                                                    {item.stat}
                                                </span>

                                                <span
                                                    className="
                                                        text-[11px]
                                                        text-slate-500
                                                    "
                                                >
                                                    {item.statLabel}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* FAQ */}
            <section className="pb-20">
                <div className="max-w-[780px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2
                            className="
                                text-[28px]
                                sm:text-[36px]
                                font-bold
                                tracking-tight
                                text-slate-900
                            "
                        >
                            Frequently Asked Questions
                        </h2>

                        <p
                            className="
                                mt-3
                                text-[14px]
                                text-slate-600
                            "
                        >
                            Everything you need to know about Auctify.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    opacity: 0,
                                    y: 10,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: i * 0.05,
                                }}
                                className="
                                    bg-white
                                    border border-slate-200
                                    rounded-2xl
                                    overflow-hidden
                                "
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="
                                        w-full
                                        px-5
                                        py-4
                                        flex items-center justify-between
                                        gap-4
                                        text-left
                                    "
                                >
                                    <span
                                        className="
                                            text-[14px]
                                            font-semibold
                                            text-slate-900
                                        "
                                    >
                                        {faq.q}
                                    </span>

                                    <motion.div
                                        animate={{
                                            rotate: openFaq === i ? 180 : 0,
                                        }}
                                        className="
                                            w-8 h-8
                                            rounded-full
                                            bg-slate-100
                                            flex items-center justify-center
                                            shrink-0
                                        "
                                    >
                                        <ChevronDown size={16} className="text-slate-600" />
                                    </motion.div>
                                </button>

                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{
                                                height: 0,
                                                opacity: 0,
                                            }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{
                                                height: 0,
                                                opacity: 0,
                                            }}
                                            transition={{
                                                duration: 0.25,
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 pb-5 border-t border-slate-100">
                                                <p
                                                    className="
                                                        pt-4
                                                        text-[13px]
                                                        leading-6
                                                        text-slate-600
                                                    "
                                                >
                                                    {faq.a}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
