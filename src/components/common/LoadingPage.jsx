import { motion } from "framer-motion";

export const LoadingPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F8FF] px-6">
            <motion.div
                className="text-center max-w-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Spinner */}
                <div className="flex justify-center mb-6">
                    <motion.div
                        className="w-12 h-12 border-4 border-[#E5E7EB] border-t-[#2563EB] rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                            repeat: Infinity,
                            duration: 0.9,
                            ease: "linear",
                        }}
                    />
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-[#1F2937]">Loading...</h2>

                {/* Description */}
                <p className="text-[15px] text-[#6B7280] mt-3 leading-7">
                    Preparing your experience. This won’t take long.
                </p>

                {/* Optional subtle dots animation */}
                <div className="flex justify-center gap-2 mt-6">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2.5 h-2.5 bg-[#2563EB] rounded-full"
                            animate={{ y: [0, -6, 0] }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.15,
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
