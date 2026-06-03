import { motion } from "framer-motion";
import { ArrowRight, Gavel, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function FinalCTA() {
    const navigate = useNavigate();

    return (
        /*
         * No rounded card — this section sits flush against the footer.
         * bg-[#F8F8FF] matches the footer exactly so they bleed together.
         * The top border + inner blue card give structure without a hard edge.
         */
        <div className="bg-[#F8F8FF] border-t border-[#E5E7EB]">
            <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6 py-12 sm:py-16">
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-60px" }}
                    className="rounded-2xl bg-[#1D4ED8] px-7 sm:px-12 py-10 sm:py-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 overflow-hidden relative"
                >
                    {/* faint grid texture */}
                    <div
                        className="absolute inset-0 opacity-[0.04] pointer-events-none"
                        style={{
                            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                            backgroundSize: "20px 20px",
                        }}
                    />
                    {/* soft right glow */}
                    <div
                        className="absolute right-0 top-0 h-full w-1/2 pointer-events-none"
                        style={{
                            background:
                                "radial-gradient(ellipse at 90% 50%, rgba(96,165,250,0.18) 0%, transparent 70%)",
                        }}
                    />

                    {/* copy */}
                    <div className="relative z-10">
                        <motion.h2
                            variants={fadeUp}
                            className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight"
                        >
                            Ready to jump in?
                        </motion.h2>
                        <motion.p
                            variants={fadeUp}
                            className="mt-2 text-[13.5px] text-blue-200 leading-relaxed max-w-sm"
                        >
                            Browse live auctions or list your first item — it only takes a minute.
                        </motion.p>
                    </div>

                    {/* buttons */}
                    <motion.div
                        variants={fadeUp}
                        className="relative z-10 flex items-center gap-3 shrink-0"
                    >
                        <button
                            onClick={() => navigate("/explore")}
                            className="group inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-white text-blue-700 text-sm font-bold hover:bg-blue-50 transition-colors active:scale-[0.98] shadow-sm"
                        >
                            <ShoppingBag size={15} />
                            Browse Auctions
                            <ArrowRight
                                size={14}
                                className="transition-transform duration-200 group-hover:translate-x-1"
                            />
                        </button>
                        <button
                            onClick={() => navigate("/auction/create")}
                            className="inline-flex items-center gap-2 px-5 h-11 rounded-xl border border-blue-400/40 text-white text-sm font-semibold hover:bg-blue-700 transition-colors active:scale-[0.98]"
                        >
                            <Gavel size={15} />
                            List an Item
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
