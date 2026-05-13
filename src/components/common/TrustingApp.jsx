import { motion } from "framer-motion";
import { ShieldCheck, Zap, Lock, Users } from "lucide-react";

export function TrustingApp() {
    const trustPoints = [
        {
            icon: ShieldCheck,
            title: "Verified Sellers",
            desc: "Every seller completes identity verification before listing products on the marketplace.",
            color: "blue",
        },
        {
            icon: Zap,
            title: "Real-time Bidding",
            desc: "All bids update instantly with transparent live auction activity for every participant.",
            color: "amber",
        },
        {
            icon: Lock,
            title: "Secure Payments",
            desc: "Protected transactions powered by encrypted payment infrastructure and secure gateways.",
            color: "emerald",
        },
        {
            icon: Users,
            title: "Active Moderation",
            desc: "Our moderation systems actively review listings and marketplace behavior continuously.",
            color: "violet",
        },
    ];

    const colorStyles = {
        blue: {
            bg: "bg-blue-50",
            iconBg: "bg-blue-100",
            icon: "text-blue-600",
        },
        amber: {
            bg: "bg-amber-50",
            iconBg: "bg-amber-100",
            icon: "text-amber-600",
        },
        emerald: {
            bg: "bg-emerald-50",
            iconBg: "bg-emerald-100",
            icon: "text-emerald-600",
        },
        violet: {
            bg: "bg-violet-50",
            iconBg: "bg-violet-100",
            icon: "text-violet-600",
        },
    };

    return (
        <section className="w-full px-3 sm:px-4 md:px-6 py-14 sm:py-16 lg:py-20">
            <div className="max-w-[1280px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-10 lg:gap-14 items-center">
                    {/* LEFT CONTENT */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.55 }}
                        className="max-w-[540px]"
                    >
                        <div className="flex items-center gap-3 mb-4 sm:mb-5">
                            <span className="block w-8 h-[2px] bg-[#2D47E6] rounded-full" />
                            <span className="text-[9px] sm:text-[10px] font-extrabold tracking-[0.32em] sm:tracking-[0.35em] uppercase text-[#2D47E6]">
                                Trust & Safety
                            </span>
                        </div>

                        <h2 className="text-[clamp(28px,7vw,56px)] font-black text-[#0A0E27] tracking-[-0.04em] leading-[0.98]">
                            Why People Trust <span className="text-[#2D47E6]">Auctify</span>
                        </h2>

                        <p className="mt-5 sm:mt-6 text-sm sm:text-[15px] leading-[1.8] sm:leading-[1.9] text-[#6B7280] max-w-[520px]">
                            Every layer of Auctify is designed around transparency, security and
                            real-time marketplace integrity, giving buyers and sellers complete
                            confidence during every auction.
                        </p>

                        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 mt-7 sm:mt-8">
                            {[
                                { label: "Verified Sellers", value: "100%" },
                                { label: "Secure Payments", value: "256-bit" },
                                { label: "Live Auctions", value: "24/7" },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="
                                        px-4 py-3
                                        rounded-2xl
                                        bg-white
                                        border border-[#E5E7EB]
                                        shadow-sm
                                        min-w-0
                                    "
                                >
                                    <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#9CA3AF]">
                                        {item.label}
                                    </p>
                                    <p className="mt-1 text-lg font-black tracking-tight text-[#111827] break-words">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* RIGHT GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {trustPoints.map((pt, i) => {
                            const Icon = pt.icon;
                            const styles = colorStyles[pt.color];

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ delay: i * 0.08, duration: 0.45 }}
                                    whileHover={{ y: -4 }}
                                    className="
                                        group relative overflow-hidden
                                        rounded-3xl
                                        border border-[#E8ECF5]
                                        bg-white
                                        p-5 sm:p-6
                                        shadow-[0_2px_12px_rgba(15,23,42,0.04)]
                                        transition-all duration-300
                                        hover:border-[#D7E3FF]
                                        hover:shadow-[0_18px_45px_rgba(45,71,230,0.10)]
                                    "
                                >
                                    <div
                                        className={`
                                            absolute -top-10 -right-10
                                            w-32 h-32 rounded-full
                                            blur-3xl opacity-0
                                            transition-opacity duration-300
                                            group-hover:opacity-100
                                            ${styles.bg}
                                        `}
                                    />

                                    <div
                                        className={`
                                            relative
                                            w-12 h-12 rounded-2xl
                                            flex items-center justify-center
                                            mb-5
                                            ${styles.iconBg}
                                        `}
                                    >
                                        <Icon size={20} className={styles.icon} />
                                    </div>

                                    <h4 className="text-[15px] font-black tracking-tight text-[#111827] mb-3">
                                        {pt.title}
                                    </h4>

                                    <p className="text-[13px] leading-[1.75] text-[#6B7280]">
                                        {pt.desc}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
