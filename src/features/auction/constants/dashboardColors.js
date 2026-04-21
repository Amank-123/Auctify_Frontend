export const C = {
    blue: "#2563eb",
    blueLight: "#eff6ff",
    blueBorder: "#bfdbfe",
    blueDark: "#1d4ed8",
    white: "#ffffff",
    slate50: "#f8fafc",
    slate100: "#f1f5f9",
    slate200: "#e2e8f0",
    slate300: "#cbd5e1",
    slate400: "#94a3b8",
    slate500: "#64748b",
    slate600: "#475569",
    slate700: "#334155",
    slate900: "#0f172a",
    green50: "#f0fdf4",
    green700: "#15803d",
    red50: "#fef2f2",
    red700: "#b91c1c",
    orange400: "#fb923c",
};

export const STATUS = {
    active: { label: "Live", bg: C.blueLight, text: C.blue, border: C.blueBorder },
    draft: { label: "Draft", bg: C.slate100, text: C.slate500, border: C.slate200 },
    ended: { label: "Ended", bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
    expired: { label: "Expired", bg: "#fffbeb", text: "#b45309", border: "#fde68a" },
};
