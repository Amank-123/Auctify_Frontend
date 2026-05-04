import { Link } from "react-router-dom";
import { Bell, Users, LayoutGrid, Image, TrendingUp, Activity, ArrowUpRight, Command, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

/* ── Data ─────────────────────────────────────────────────────── */
const cards = [
  {
    title: "Categories",
    desc: "Add, edit, or remove product categories",
    icon: LayoutGrid,
    link: "/admin/categories",
    stat: "24 active",
    trend: "+3 this week",
    accent: "from-violet-500 to-indigo-500",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    iconRing: "ring-violet-100",
    statColor: "text-violet-600",
    badgeBg: "bg-violet-50 text-violet-600",
    barFrom: "from-violet-500",
    barTo: "to-indigo-500",
    glowColor: "rgba(139,92,246,0.07)",
    shadowHover: "hover:shadow-violet-100",
  },
  {
    title: "Banners",
    desc: "Control homepage hero banners",
    icon: Image,
    link: "/admin/banners",
    stat: "8 live",
    trend: "2 scheduled",
    accent: "from-sky-500 to-cyan-400",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    iconRing: "ring-sky-100",
    statColor: "text-sky-600",
    badgeBg: "bg-sky-50 text-sky-600",
    barFrom: "from-sky-500",
    barTo: "to-cyan-400",
    glowColor: "rgba(14,165,233,0.07)",
    shadowHover: "hover:shadow-sky-100",
  },
  {
    title: "Notifications",
    desc: "Broadcast alerts to all users",
    icon: Bell,
    link: "/admin/Broadcast",
    stat: "1.2k sent",
    trend: "+200 today",
    accent: "from-amber-500 to-orange-400",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    iconRing: "ring-amber-100",
    statColor: "text-amber-600",
    badgeBg: "bg-amber-50 text-amber-600",
    barFrom: "from-amber-500",
    barTo: "to-orange-400",
    glowColor: "rgba(245,158,11,0.07)",
    shadowHover: "hover:shadow-amber-100",
  },
  {
    title: "Users",
    desc: "Ban, promote, or manage accounts",
    icon: Users,
    link: "/admin/users",
    stat: "48.2k total",
    trend: "+512 this month",
    accent: "from-emerald-500 to-teal-400",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    iconRing: "ring-emerald-100",
    statColor: "text-emerald-600",
    badgeBg: "bg-emerald-50 text-emerald-600",
    barFrom: "from-emerald-500",
    barTo: "to-teal-400",
    glowColor: "rgba(16,185,129,0.07)",
    shadowHover: "hover:shadow-emerald-100",
  },
];

const metrics = [
  { label: "Total Revenue", value: "$2.4M", change: "+12.5%", up: true, sub: "vs last month" },
  { label: "Active Sessions", value: "3,821", change: "+4.1%", up: true, sub: "right now" },
  { label: "Conversion Rate", value: "4.73%", change: "−0.3%", up: false, sub: "vs last week" },
  { label: "Avg. Latency", value: "142ms", change: "+8ms", up: false, sub: "p95 response" },
];

/* ── Animation Variants ───────────────────────────────────────── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
};

/* ── Live Clock ───────────────────────────────────────────────── */
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="text-right hidden sm:block">
      <p className="font-mono text-sm font-semibold text-slate-700 tracking-wider">
        {time.toLocaleTimeString("en-US", { hour12: false })}
      </p>
      <p className="text-xs text-slate-400 mt-0.5">
        {time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
      </p>
    </div>
  );
}

/* ── Dashboard ────────────────────────────────────────────────── */
const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');
        *, body { font-family: 'DM Sans', sans-serif; }
        .mono { font-family: 'DM Mono', monospace; }
      `}</style>

      {/* Soft ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[700px] h-[500px] rounded-full bg-violet-200/40 blur-[120px]" />
        <div className="absolute top-1/2 -right-32 w-[500px] h-[400px] rounded-full bg-sky-200/30 blur-[100px]" />
        <div className="absolute -bottom-24 left-10 w-[500px] h-[350px] rounded-full bg-emerald-100/40 blur-[100px]" />
      </div>

      {/* Subtle dot grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(148,163,184,0.25) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 pb-16">

        {/* ── Top Bar ─────────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between py-5 border-b border-slate-200 mb-10"
        >
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-200">
              <Command size={15} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-800">AdminOS</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
              Enterprise
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs text-emerald-700 font-semibold">All systems normal</span>
            </div>

            <div className="h-5 w-px bg-slate-200" />
            <LiveClock />

            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-sky-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer ring-2 ring-white shadow-md hover:shadow-violet-200 transition-all duration-300">
              AK
            </div>
          </div>
        </motion.header>

        {/* ── Hero ────────────────────────────────────────────── */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8"
        >
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2 mb-3">
              <Activity size={12} className="text-violet-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-violet-500">
                Control Center
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-none">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 mt-2 text-sm max-w-md leading-relaxed">
              Monitor performance, manage content, and control your platform from one place.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm transition-all"
            >
              <Shield size={14} />
              Audit Log
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-200 transition-all"
            >
              <TrendingUp size={14} />
              Analytics
            </motion.button>
          </motion.div>
        </motion.section>

        {/* ── Metrics Strip ───────────────────────────────────── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10"
        >
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm cursor-default"
            >
              <p className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wide">{m.label}</p>
              <p className="mono text-2xl font-bold text-slate-900 tracking-tight">{m.value}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${m.up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
                  {m.up ? "▲" : "▼"} {m.change}
                </span>
                <span className="text-xs text-slate-400">{m.sub}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Section Label ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Management Modules
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </motion.div>

        {/* ── Cards Grid ──────────────────────────────────────── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div key={index} variants={fadeUp}>
                <Link to={card.link} className="block group">
                  <motion.div
                    whileHover={{ y: -5, boxShadow: "0 20px 50px rgba(0,0,0,0.10)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className="relative h-full bg-white border border-slate-200 rounded-2xl p-5 overflow-hidden shadow-sm hover:border-slate-300 transition-colors duration-300 cursor-pointer"
                  >
                    {/* Subtle radial tint on hover */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse at 0% 0%, ${card.glowColor} 0%, transparent 70%)`,
                      }}
                    />

                    {/* Top row */}
                    <div className="flex items-start justify-between mb-5 relative">
                      <div className={`w-10 h-10 rounded-xl ${card.iconBg} ring-1 ${card.iconRing} flex items-center justify-center`}>
                        <Icon size={19} className={card.iconColor} strokeWidth={1.8} />
                      </div>
                      <motion.div
                        initial={{ opacity: 0, x: -4, y: 4 }}
                        whileHover={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-0.5"
                      >
                        <ArrowUpRight size={16} className={card.iconColor} />
                      </motion.div>
                    </div>

                    {/* Text */}
                    <div className="relative mb-5">
                      <h2 className="text-[15px] font-bold text-slate-800 tracking-tight mb-1">
                        {card.title}
                      </h2>
                      <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                    </div>

                    {/* Footer */}
                    <div className="relative flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className={`mono text-sm font-bold ${card.statColor}`}>
                        {card.stat}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${card.badgeBg}`}>
                        {card.trend}
                      </span>
                    </div>

                    {/* Animated bottom bar */}
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0 }}
                      whileHover={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r ${card.barFrom} ${card.barTo} origin-left`}
                    />
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Quick Actions ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white border border-slate-200 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 ring-1 ring-amber-100 flex items-center justify-center">
              <Zap size={16} className="text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Quick Actions</p>
              <p className="text-xs text-slate-400 mt-0.5">Shortcuts to common operations</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Export CSV", "Clear Cache", "Run Backup", "View Logs"].map((action, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-800 transition-colors shadow-sm"
              >
                {action}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Footer ──────────────────────────────────────────── */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="mt-12 flex items-center justify-center gap-3 text-xs text-slate-400"
        >
          <span>AdminOS v4.2.1</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>© 2025 Your Company</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>All rights reserved</span>
        </motion.footer>
      </div>
    </div>
  );
};

export default AdminDashboard;