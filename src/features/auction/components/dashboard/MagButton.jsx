import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MagButton({ children, className, style, onClick, disabled }) {
    const ref = useRef(null);
    const x = useMotionValue(0),
        y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 200, damping: 18 });
    const sy = useSpring(y, { stiffness: 200, damping: 18 });

    const onMove = (e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.25);
        y.set((e.clientY - r.top - r.height / 2) * 0.25);
    };
    const onLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button
            ref={ref}
            style={{ x: sx, y: sy, ...style }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            whileTap={{ scale: 0.94 }}
            onClick={onClick}
            disabled={disabled}
            className={className}
        >
            {children}
        </motion.button>
    );
}
