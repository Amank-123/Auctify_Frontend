import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Gavel, TrendingUp, Users, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
};

const perks = [
    "List in minutes, no approval needed",
    "Live bidding drives higher prices than fixed listings",
    "Secure payments & verified buyer protection",
];

const stats = [
    {
        icon: Users,
        value: "12,000+",
        label: "Active Bidders",
        bg: "bg-blue-50",
        border: "border-blue-100",
        color: "text-blue-600",
    },
    {
        icon: Gavel,
        value: "3,400+",
        label: "Auctions Closed",
        bg: "bg-violet-50",
        border: "border-violet-100",
        color: "text-violet-600",
    },
    {
        icon: IndianRupee,
        value: "₹2 Cr+",
        label: "Total Sold",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        color: "text-emerald-600",
    },
];

export default function SellerCTA() {
    const navigate = useNavigate();

    return (
        <section className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6 py-10 sm:py-12 lg:py-14">
            <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm px-7 sm:px-10 lg:px-12 py-9 sm:py-11 flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16"
            >
                {/* LEFT — copy */}
                <div className="flex-1 min-w-0">
                    <motion.span
                        variants={fadeUp}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full uppercase tracking-widest mb-4"
                    >
                        <TrendingUp size={10} />
                        For Sellers
                    </motion.span>

                    <motion.h2
                        variants={fadeUp}
                        className="text-[28px] sm:text-[32px] font-extrabold text-[#111827] leading-tight tracking-tight"
                    >
                        Have something to sell?
                        <br />
                        <span className="text-blue-600">Start an auction today.</span>
                    </motion.h2>

                    <motion.ul variants={stagger} className="mt-6 space-y-3">
                        {perks.map((p) => (
                            <motion.li
                                key={p}
                                variants={fadeUp}
                                className="flex items-center gap-3 text-[15px] text-slate-500"
                            >
                                <BadgeCheck size={16} className="text-emerald-500 shrink-0" />
                                {p}
                            </motion.li>
                        ))}
                    </motion.ul>

                    <motion.div variants={fadeUp} className="mt-7 flex items-center gap-3">
                        <button
                            onClick={() => navigate("/auction/create")}
                            className="group inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all duration-200 active:scale-[0.98]"
                        >
                            <Gavel size={14} />
                            Create a Listing
                            <ArrowRight
                                size={14}
                                className="transition-transform duration-200 group-hover:translate-x-1"
                            />
                        </button>
                        <button
                            onClick={() => navigate("/how-it-works")}
                            className="inline-flex items-center gap-2 px-5 h-11 rounded-xl border border-[#E5E7EB] text-slate-600 text-sm font-semibold hover:bg-[#F9FAFB] transition-colors active:scale-[0.98]"
                        >
                            Learn More
                        </button>
                    </motion.div>
                </div>

                {/* RIGHT — stats */}
                <motion.div
                    variants={stagger}
                    className="shrink-0 lg:w-[300px] flex flex-col gap-3"
                >
                    {stats.map(({ icon: Icon, value, label, bg, border, color }) => (
                        <motion.div
                            key={label}
                            variants={fadeUp}
                            className={`flex items-center gap-4 rounded-2xl border ${border} ${bg} px-5 py-4`}
                        >
                            <span
                                className={`w-10 h-10 rounded-xl bg-white border ${border} flex items-center justify-center shrink-0 shadow-sm`}
                            >
                                <Icon size={17} className={color} />
                            </span>
                            <div>
                                <p className="text-[18px] font-extrabold text-[#111827] leading-none">
                                    {value}
                                </p>
                                <p className="text-[12px] text-slate-500 mt-1">{label}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
