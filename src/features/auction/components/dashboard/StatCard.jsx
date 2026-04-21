import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { C } from "../../constants/dashboardColors";

function Counter({ to, duration = 800 }) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        let start = null;
        const step = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            setVal(Math.floor(p * to));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [to, duration]);
    return <span>{val}</span>;
}

export default function StatCard({ label, value, badge, badgeUp, prefix, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 120 }}
            style={{
                background: C.white,
                border: `1px solid ${C.slate200}`,
                borderRadius: 12,
                padding: "14px 18px",
                cursor: "default",
            }}
        >
            <p style={{ fontSize: 11, color: C.slate400, marginBottom: 6 }}>{label}</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <p
                    style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: C.slate900,
                        fontFamily: "'Syne',sans-serif",
                    }}
                >
                    {prefix}
                    <Counter to={value} />
                </p>
                {badge && (
                    <span
                        style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: 4,
                            background: badgeUp ? C.green50 : C.red50,
                            color: badgeUp ? C.green700 : C.red700,
                        }}
                    >
                        {badge}
                    </span>
                )}
            </div>
        </motion.div>
    );
}
