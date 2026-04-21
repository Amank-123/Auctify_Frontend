import { C } from "../../constants/dashboardColors";

export default function DashboardSkeleton() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    style={{
                        background: C.white,
                        border: `1px solid ${C.slate200}`,
                        borderRadius: 12,
                        padding: 13,
                        display: "flex",
                        gap: 12,
                    }}
                >
                    <div
                        style={{ width: 64, height: 64, borderRadius: 10, background: C.slate100 }}
                    />
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                            paddingTop: 4,
                        }}
                    >
                        <div
                            style={{
                                height: 12,
                                background: C.slate100,
                                borderRadius: 6,
                                width: "33%",
                            }}
                        />
                        <div
                            style={{
                                height: 10,
                                background: C.slate100,
                                borderRadius: 6,
                                width: "60%",
                            }}
                        />
                        <div
                            style={{
                                height: 10,
                                background: C.slate100,
                                borderRadius: 6,
                                width: "25%",
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
