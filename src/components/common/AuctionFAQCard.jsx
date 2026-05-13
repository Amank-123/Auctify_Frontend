import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function PremiumFAQSection({
    title = "Frequently Asked Questions",
    faqs = [
        {
            q: "How does live bidding work?",
            a: "Each new bid must exceed the current highest bid. All auction activity updates instantly in real time for every participant.",
        },
        {
            q: "When is payment collected?",
            a: "Payment is requested automatically from the winning bidder once the auction officially ends.",
        },
        {
            q: "Can auctions extend automatically?",
            a: "Some auctions extend briefly if bids are placed near the ending time to prevent last-second bid sniping.",
        },
        {
            q: "How are sellers verified?",
            a: "Sellers go through identity verification and moderation review before listing products on the marketplace.",
        },
    ],
}) {
    const [openFaq, setOpenFaq] = useState(0);

    return (
        <section className="w-full mt-14 sm:mt-16 lg:mt-20 px-3 sm:px-4 md:px-6">
            <div className="max-w-[760px] mx-auto">
                {/* HEADER */}
                <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <span className="block w-5 sm:w-6 h-[2px] rounded-full bg-[#2D47E6]" />

                        <span className="text-[9px] sm:text-[10px] font-extrabold tracking-[0.34em] sm:tracking-[0.38em] uppercase text-[#2D47E6]">
                            FAQ
                        </span>

                        <span className="block w-5 sm:w-6 h-[2px] rounded-full bg-[#2D47E6]" />
                    </div>

                    <h2 className="text-[clamp(24px,6vw,44px)] font-black tracking-[-0.04em] text-[#0A0E27] leading-[1.05] px-2">
                        {title}
                    </h2>
                </div>

                {/* FAQ LIST */}
                <div className="flex flex-col gap-3 sm:gap-4">
                    {faqs.map((faq, i) => {
                        const isOpen = openFaq === i;

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ delay: i * 0.05 }}
                                className={`
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    bg-white
                                    transition-all duration-300
                                    ${
                                        isOpen
                                            ? "border-[#C9D7FF] shadow-[0_10px_35px_rgba(45,71,230,0.10)]"
                                            : "border-[#E9ECF5] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                                    }
                                `}
                            >
                                {/* BUTTON */}
                                <button
                                    onClick={() => setOpenFaq(isOpen ? null : i)}
                                    className="
                                        w-full
                                        flex items-start sm:items-center justify-between
                                        gap-3 sm:gap-5
                                        px-4 sm:px-5 md:px-6
                                        py-4 sm:py-5
                                        text-left
                                        transition-colors duration-200
                                        hover:bg-[#FAFBFF]
                                    "
                                >
                                    <span className="text-[14px] sm:text-[15px] font-bold text-[#0A0E27] tracking-[-0.01em] leading-[1.45] pr-2">
                                        {faq.q}
                                    </span>

                                    {/* ICON */}
                                    <motion.div
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.22 }}
                                        className={`
                                            w-8 h-8
                                            rounded-full
                                            flex items-center justify-center
                                            shrink-0
                                            transition-all duration-200
                                            ${isOpen ? "bg-[#2D47E6]" : "bg-[#F3F4F6]"}
                                        `}
                                    >
                                        <ChevronDown
                                            size={15}
                                            className={isOpen ? "text-white" : "text-[#6B7280]"}
                                        />
                                    </motion.div>
                                </button>

                                {/* ANSWER */}
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.28, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 sm:px-5 md:px-6 pb-5 sm:pb-6 border-t border-[#F1F3FA]">
                                                <p className="pt-4 sm:pt-5 text-[13px] sm:text-[14px] leading-[1.8] sm:leading-[1.9] text-[#6B7280]">
                                                    {faq.a}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
