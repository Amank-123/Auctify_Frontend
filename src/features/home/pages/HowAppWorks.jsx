import { motion } from "framer-motion";
import { Search, Gavel, CreditCard, PackageCheck } from "lucide-react";

const steps = [
    {
        number: "01",
        icon: Search,
        title: "Browse Auctions",
        desc: "Discover live and upcoming auctions across every category — electronics, fashion, collectibles, and more.",
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
        numColor: "text-blue-100",
        border: "border-blue-100",
    },
    {
        number: "02",
        icon: Gavel,
        title: "Place Your Bid",
        desc: "Monitor real-time bidding and place your bid before the timer runs out. Outbid? You'll be notified instantly.",
        iconBg: "bg-violet-50",
        iconColor: "text-violet-600",
        numColor: "text-violet-100",
        border: "border-violet-100",
    },
    {
        number: "03",
        icon: CreditCard,
        title: "Secure Checkout",
        desc: "Win the auction and check out safely. Payments are encrypted and buyer protection is built in.",
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
        numColor: "text-emerald-100",
        border: "border-emerald-100",
    },
    {
        number: "04",
        icon: PackageCheck,
        title: "Receive Your Item",
        desc: "Coordinate with the verified seller through our in-app chat and get your item delivered to your door.",
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
        numColor: "text-amber-100",
        border: "border-amber-100",
    },
];

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
};

const itemVariant = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const headingVariant = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function HowAppWorks() {
    return (
        <section className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6 py-10 sm:py-14 lg:py-16">
            {/* heading */}
            <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="border-b border-blue-200 pb-5 sm:pb-6 mb-8 sm:mb-10"
            >
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                    <div className="max-w-xl">
                        <motion.div variants={headingVariant} className="relative inline-block">
                            <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-snug">
                                How Auctify Works
                            </h2>
                            <span className="absolute left-0 -bottom-2 w-16 sm:w-24 h-[2px] bg-blue-600/80 rounded-full" />
                        </motion.div>

                        <motion.p
                            variants={headingVariant}
                            className="text-[13px] sm:text-base text-slate-600 mt-4 sm:mt-6 leading-relaxed border-l-2 border-blue-300 pl-3 sm:pl-4"
                        >
                            From discovery to delivery in four simple steps — designed to be
                            transparent, fast, and fair for both buyers and sellers.
                        </motion.p>
                    </div>
                </div>
            </motion.div>

            {/* step cards */}
            <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5"
            >
                {steps.map(
                    (
                        { number, icon: Icon, title, desc, iconBg, iconColor, numColor, border },
                        idx,
                    ) => (
                        <motion.div
                            key={number}
                            variants={itemVariant}
                            className={`relative rounded-2xl bg-white border ${border} shadow-sm p-5 sm:p-6 overflow-hidden`}
                        >
                            {/* large background number */}
                            <span
                                className={`absolute -right-2 -top-3 text-[80px] font-black leading-none select-none ${numColor} pointer-events-none`}
                            >
                                {number}
                            </span>

                            {/* connector line (desktop) */}
                            {idx < steps.length - 1 && (
                                <div className="hidden xl:block absolute top-[38px] -right-[10px] w-5 h-[2px] bg-[#E5E7EB] z-10" />
                            )}

                            <div
                                className={`relative z-10 w-10 h-10 rounded-xl ${iconBg} border ${border} flex items-center justify-center mb-4 shadow-sm`}
                            >
                                <Icon size={18} className={iconColor} />
                            </div>

                            <p className="relative z-10 text-sm font-bold text-[#111827] mb-1.5">
                                {title}
                            </p>
                            <p className="relative z-10 text-xs text-slate-500 leading-relaxed">
                                {desc}
                            </p>
                        </motion.div>
                    ),
                )}
            </motion.div>
        </section>
    );
}
