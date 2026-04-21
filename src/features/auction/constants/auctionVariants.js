export const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 28 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", damping: 22, stiffness: 160, delay },
    },
});

export const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 160 } },
};
