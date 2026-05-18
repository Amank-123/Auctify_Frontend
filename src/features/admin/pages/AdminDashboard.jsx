import { Link } from "react-router-dom";
import {
    Bell,
    Users,
    LayoutGrid,
    Image,
    Activity,
    ArrowUpRight,
    Command,
    Shield,
    FileText,
} from "lucide-react";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

/* ── Cards Data ───────────────────────────────────────── */

const cards = [
    {
        title: "Categories",
        desc: "Add, edit, or remove product categories",
        icon: LayoutGrid,
        link: "/admin/categories",
        stat: "24 active",
        trend: "+3 this week",
        iconBg: "bg-violet-50",
        iconColor: "text-violet-600",
        iconRing: "ring-violet-100",
        statColor: "text-violet-600",
        badgeBg: "bg-violet-50 text-violet-600",
        barFrom: "from-violet-500",
        barTo: "to-indigo-500",
        glowColor: "rgba(139,92,246,0.07)",
    },

    {
        title: "Banners",
        desc: "Control homepage hero banners",
        icon: Image,
        link: "/admin/banners",
        stat: "8 live",
        trend: "2 scheduled",
        iconBg: "bg-sky-50",
        iconColor: "text-sky-600",
        iconRing: "ring-sky-100",
        statColor: "text-sky-600",
        badgeBg: "bg-sky-50 text-sky-600",
        barFrom: "from-sky-500",
        barTo: "to-cyan-400",
        glowColor: "rgba(14,165,233,0.07)",
    },

    {
        title: "Notifications",
        desc: "Broadcast alerts to all users",
        icon: Bell,
        link: "/admin/Broadcast",
        stat: "1.2k sent",
        trend: "+200 today",
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
        iconRing: "ring-amber-100",
        statColor: "text-amber-600",
        badgeBg: "bg-amber-50 text-amber-600",
        barFrom: "from-amber-500",
        barTo: "to-orange-400",
        glowColor: "rgba(245,158,11,0.07)",
    },

    {
        title: "Users",
        desc: "Ban, promote, or manage accounts",
        icon: Users,
        link: "/admin/users",
        stat: "48.2k total",
        trend: "+512 this month",
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
        iconRing: "ring-emerald-100",
        statColor: "text-emerald-600",
        badgeBg: "bg-emerald-50 text-emerald-600",
        barFrom: "from-emerald-500",
        barTo: "to-teal-400",
        glowColor: "rgba(16,185,129,0.07)",
    },

    {
        title: "Knowledge Base",
        desc: "Manage AI chatbot knowledge base",
        icon: FileText,
        link: "/admin/AI_Assistant_knowledge-base",
        stat: "RAG System",
        trend: "PDF Upload",
        iconBg: "bg-fuchsia-50",
        iconColor: "text-fuchsia-600",
        iconRing: "ring-fuchsia-100",
        statColor: "text-fuchsia-600",
        badgeBg: "bg-fuchsia-50 text-fuchsia-600",
        barFrom: "from-fuchsia-500",
        barTo: "to-pink-500",
        glowColor: "rgba(217,70,239,0.07)",
    },
];

/* ── Animations ───────────────────────────────────────── */

const container = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.07,
        },
    },
};

const fadeUp = {
    hidden: {
        opacity: 0,
        y: 18,
    },

    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.48,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

/* ── Live Clock ───────────────────────────────────────── */

function LiveClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(t);
    }, []);

    return (
        <div className="hidden text-right sm:block">
            <p className="font-mono text-sm font-semibold tracking-wider text-slate-700">
                {time.toLocaleTimeString("en-US", {
                    hour12: false,
                })}
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
                {time.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                })}
            </p>
        </div>
    );
}

/* ── Dashboard ───────────────────────────────────────── */

const AdminDashboard = () => {
    return (
        <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-800">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

                * {
                    font-family: 'DM Sans', sans-serif;
                }
            `}</style>

            {/* Background Blobs */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-32 left-1/4 h-[500px] w-[700px] rounded-full bg-violet-200/40 blur-[120px]" />

                <div className="absolute top-1/2 -right-32 h-[400px] w-[500px] rounded-full bg-sky-200/30 blur-[100px]" />

                <div className="absolute -bottom-24 left-10 h-[350px] w-[500px] rounded-full bg-emerald-100/40 blur-[100px]" />
            </div>

            {/* Grid */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.4]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, rgba(148,163,184,0.25) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            <div className="relative z-10 mx-auto max-w-[1280px] px-6 pb-16">
                {/* Topbar */}
                <motion.header
                    initial={{
                        opacity: 0,
                        y: -14,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.55,
                    }}
                    className="mb-10 flex items-center justify-between border-b border-slate-200 py-5"
                >
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-200">
                            <Command size={15} className="text-white" strokeWidth={2.5} />
                        </div>

                        <span className="text-base font-bold tracking-tight text-slate-800">
                            Auctify Admin
                        </span>

                        <span className="rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-violet-600">
                            AI Control
                        </span>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-4">
                        <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 md:flex">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </span>

                            <span className="text-xs font-semibold text-emerald-700">
                                AI Services Active
                            </span>
                        </div>

                        <div className="h-5 w-px bg-slate-200" />

                        <LiveClock />

                        <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-sky-500 text-xs font-bold text-white shadow-md ring-2 ring-white transition-all duration-300 hover:shadow-violet-200">
                            AK
                        </div>
                    </div>
                </motion.header>

                {/* Hero */}
                <motion.section
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
                >
                    <motion.div variants={fadeUp}>
                        <div className="mb-3 flex items-center gap-2">
                            <Activity size={12} className="text-violet-500" />

                            <span className="text-xs font-bold uppercase tracking-widest text-violet-500">
                                Control Center
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold leading-none tracking-tight text-slate-900 sm:text-4xl">
                            Auctify Control Center
                        </h1>

                        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                            Manage platform operations, AI systems, users, banners, categories, and
                            chatbot knowledge base.
                        </p>
                    </motion.div>

                    <motion.button
                        variants={fadeUp}
                        whileHover={{
                            scale: 1.03,
                        }}
                        whileTap={{
                            scale: 0.97,
                        }}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:from-violet-500 hover:to-indigo-500"
                    >
                        <Shield size={14} />
                        Admin Access
                    </motion.button>
                </motion.section>

                {/* Section Label */}
                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    transition={{
                        delay: 0.35,
                        duration: 0.5,
                    }}
                    className="mb-6 flex items-center gap-4"
                >
                    <div className="h-px flex-1 bg-slate-200" />

                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Management Modules
                    </span>

                    <div className="h-px flex-1 bg-slate-200" />
                </motion.div>

                {/* Cards */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
                >
                    {cards.map((card, index) => {
                        const Icon = card.icon;

                        return (
                            <motion.div key={index} variants={fadeUp}>
                                <Link to={card.link} className="block group">
                                    <motion.div
                                        whileHover={{
                                            y: -5,
                                            boxShadow: "0 20px 50px rgba(0,0,0,0.10)",
                                        }}
                                        whileTap={{
                                            scale: 0.98,
                                        }}
                                        className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 hover:border-slate-300"
                                    >
                                        {/* Glow */}
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                            }}
                                            whileHover={{
                                                opacity: 1,
                                            }}
                                            transition={{
                                                duration: 0.35,
                                            }}
                                            className="pointer-events-none absolute inset-0"
                                            style={{
                                                background: `radial-gradient(ellipse at 0% 0%, ${card.glowColor} 0%, transparent 70%)`,
                                            }}
                                        />

                                        {/* Top */}
                                        <div className="relative mb-5 flex items-start justify-between">
                                            <div
                                                className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg} ring-1 ${card.iconRing}`}
                                            >
                                                <Icon
                                                    size={19}
                                                    className={card.iconColor}
                                                    strokeWidth={1.8}
                                                />
                                            </div>

                                            <ArrowUpRight size={16} className={card.iconColor} />
                                        </div>

                                        {/* Text */}
                                        <div className="relative mb-5">
                                            <h2 className="mb-1 text-[15px] font-bold tracking-tight text-slate-800">
                                                {card.title}
                                            </h2>

                                            <p className="text-xs leading-relaxed text-slate-400">
                                                {card.desc}
                                            </p>
                                        </div>

                                        {/* Footer */}
                                        <div className="relative flex items-center justify-between border-t border-slate-100 pt-4">
                                            <span className={`text-sm font-bold ${card.statColor}`}>
                                                {card.stat}
                                            </span>

                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${card.badgeBg}`}
                                            >
                                                {card.trend}
                                            </span>
                                        </div>

                                        {/* Bottom Bar */}
                                        <motion.div
                                            initial={{
                                                scaleX: 0,
                                                opacity: 0,
                                            }}
                                            whileHover={{
                                                scaleX: 1,
                                                opacity: 1,
                                            }}
                                            transition={{
                                                duration: 0.35,
                                            }}
                                            className={`absolute bottom-0 left-0 right-0 h-[3px] origin-left bg-gradient-to-r ${card.barFrom} ${card.barTo}`}
                                        />
                                    </motion.div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
