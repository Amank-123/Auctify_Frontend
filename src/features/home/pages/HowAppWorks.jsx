import { Icon } from "./Icons.jsx";
import { motion } from "framer-motion";
const HowBlueApplicationWorks = () => {
    const steps = [
        {
            title: "Browse & Discover",
            desc: "Explore premium auctions listed by verified sellers — electronics, collectibles, vehicles, fashion and rare finds.",
            color: "blue",
            icon: <Icon.Search className="w-5 h-5 stroke-[2.2]" />,
            image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80",
            action: "Start Exploring",
        },
        {
            title: "Bid Live Instantly",
            desc: "Join real-time bidding rooms, place smart bids, set your max limit, and compete transparently.",
            color: "orange",
            icon: <Icon.Gavel className="w-5 h-5 stroke-[2.2]" />,
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
            action: "Place a Bid",
            live: true,
        },
        {
            title: "Win & Connect",
            desc: "Winning buyers connect directly with sellers to finalize payment and delivery with total flexibility.",
            color: "emerald",
            icon: <Icon.Trophy className="w-5 h-5 stroke-[2.2]" />,
            image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1200&q=80",
            action: "You Won",
        },
    ];

    const styles = {
        blue: {
            iconBg: "bg-white/90",
            iconText: "text-slate-800",
            badge: "bg-blue-50 text-blue-700",
            button: "hover:bg-blue-600 hover:border-blue-600 hover:text-white border-blue-100",
        },
        orange: {
            iconBg: "bg-white/90",
            iconText: "text-slate-800",
            badge: "bg-orange-50 text-orange-700",
            button: "hover:bg-orange-500 hover:border-orange-500 hover:text-white border-orange-100",
        },
        emerald: {
            iconBg: "bg-white/90",
            iconText: "text-slate-800",
            badge: "bg-emerald-50 text-emerald-700",
            button: "hover:bg-emerald-600 hover:border-emerald-600 hover:text-white border-emerald-100",
        },
    };

    return (
        <section className="py-24 bg-gradient-to-b from-[#F8F8FF] via-white to-[#F8F8FF]">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center">
                            <Icon.Gavel className="w-4 h-4 text-white" />
                        </div>

                        <span className="text-sm font-semibold tracking-wide text-gray-700">
                            HOW IT WORKS
                        </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.12]">
                        Buy Smart. <span className="text-blue-600">Bid Fast.</span> Win Easy.
                    </h2>

                    <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-8 font-medium">
                        A premium auction experience designed for trust, speed and excitement.
                        Discover products, place bids live, and connect directly after winning.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {steps.map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -8 }}
                            transition={{ duration: 0.25 }}
                            className="group bg-white rounded-[30px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl flex flex-col"
                        >
                            {/* Image */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 duration-700"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/10" />

                                {item.live && (
                                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-orange-500 text-white text-[11px] font-semibold shadow-lg">
                                        LIVE NOW
                                    </div>
                                )}

                                <div
                                    className={`absolute left-5 bottom-5 w-12 h-12 rounded-2xl backdrop-blur-md shadow-xl border border-white/60 flex items-center justify-center ${styles[item.color].iconBg} ${styles[item.color].iconText}`}
                                >
                                    {item.icon}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-7 flex flex-col flex-1">
                                {/* Title */}
                                <div className="flex items-center gap-3 mb-4">
                                    <span
                                        className={`px-3 h-8 rounded-full text-sm font-semibold flex items-center justify-center ${styles[item.color].badge}`}
                                    >
                                        0{i + 1}
                                    </span>

                                    <h3 className="text-[25px] font-semibold text-gray-900 tracking-tight">
                                        {item.title}
                                    </h3>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 leading-7 mb-6">{item.desc}</p>

                                {/* Fill Empty Area With Premium Content */}
                                <div className="space-y-4 mb-6 flex-1">
                                    {i === 0 && (
                                        <>
                                            <div className="rounded-2xl bg-blue-50 p-4 border border-blue-100">
                                                <p className="text-sm text-gray-500">
                                                    Active Listings
                                                </p>
                                                <p className="text-2xl font-semibold text-blue-600">
                                                    12,450+
                                                </p>
                                            </div>

                                            <div className="flex gap-2">
                                                {["Electronics", "Cars", "Luxury"].map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {i === 1 && (
                                        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                                            <p className="text-sm text-gray-500">
                                                Current Highest Bid
                                            </p>
                                            <p className="text-3xl font-semibold text-orange-600 mt-1">
                                                ₹24,750
                                            </p>
                                            <p className="text-xs text-orange-500 mt-1">
                                                12 bids in the last hour
                                            </p>
                                        </div>
                                    )}

                                    {i === 2 && (
                                        <>
                                            <div className="rounded-2xl bg-emerald-50 p-4 flex items-center gap-3">
                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <span className="text-sm font-medium text-emerald-700">
                                                    Highest bidder confirmed
                                                </span>
                                            </div>

                                            <div className="rounded-2xl border border-gray-100 p-4">
                                                <p className="text-sm text-gray-500">
                                                    Secure Transactions
                                                </p>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    Direct Seller Contact
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Button */}
                                <button
                                    className={`w-full h-12 rounded-2xl border text-sm font-semibold transition-all duration-300 ${styles[item.color].button}`}
                                >
                                    {item.action}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Clean Trust Section - No Fake Stats */}
                <div className="mt-20 rounded-[34px] border border-gray-100 bg-white shadow-sm overflow-hidden">
                    <div className="px-8 py-10 md:px-12">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide">
                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                WHY CHOOSE AUCTIFY
                            </span>

                            <h3 className="mt-5 text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
                                Built for Fair & Direct Auctions
                            </h3>

                            <p className="mt-3 text-slate-500 max-w-2xl mx-auto leading-7">
                                A clean marketplace where buyers and sellers connect directly
                                through transparent bidding.
                            </p>
                        </div>

                        {/* Features */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "Verified Sellers",
                                    desc: "Seller profiles and listings designed to create trust from day one.",
                                    icon: <Icon.BadgeCheck className="w-5 h-5" />,
                                    color: "blue",
                                },
                                {
                                    title: "Real-Time Bidding",
                                    desc: "Live bidding updates so every participant competes fairly.",
                                    icon: <Icon.Bolt className="w-5 h-5" />,
                                    color: "orange",
                                },
                                {
                                    title: "Direct Connection",
                                    desc: "Winners communicate directly with sellers after auction close.",
                                    icon: <Icon.Users className="w-5 h-5" />,
                                    color: "emerald",
                                },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -6 }}
                                    transition={{ duration: 0.2 }}
                                    className="group rounded-3xl border border-gray-100 bg-[#F8F8FF] p-6 hover:bg-white hover:shadow-xl"
                                >
                                    <div
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
                                            item.color === "blue"
                                                ? "bg-blue-100 text-blue-600"
                                                : item.color === "orange"
                                                  ? "bg-orange-100 text-orange-600"
                                                  : "bg-emerald-100 text-emerald-600"
                                        }`}
                                    >
                                        {item.icon}
                                    </div>

                                    <h4 className="text-xl font-semibold text-slate-900">
                                        {item.title}
                                    </h4>

                                    <p className="mt-3 text-sm text-slate-500 leading-7">
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Bottom Statement */}
                        <div className="mt-10 rounded-3xl bg-blue-900 px-8 py-6 text-center">
                            <h4 className="text-white text-xl font-semibold">
                                New Platform. Strong Standards.
                            </h4>

                            <p className="text-slate-300 mt-2 max-w-2xl mx-auto leading-7 text-sm">
                                We’re just getting started — focused on trust, clean design, and a
                                better auction experience for everyone.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowBlueApplicationWorks;
