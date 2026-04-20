import { useEffect, useState, useRef } from "react";
import { api } from "@/shared/services/axios.js";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints.js";
import { showError, showSuccess } from "@/shared/utils/toast.js";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

/* ─── palette (RumahHub exact colors) ─── */
const C = {
  blue:        "#2563eb",
  blueLight:   "#eff6ff",
  blueBorder:  "#bfdbfe",
  blueDark:    "#1d4ed8",
  white:       "#ffffff",
  slate50:     "#f8fafc",
  slate100:    "#f1f5f9",
  slate200:    "#e2e8f0",
  slate300:    "#cbd5e1",
  slate400:    "#94a3b8",
  slate500:    "#64748b",
  slate600:    "#475569",
  slate700:    "#334155",
  slate900:    "#0f172a",
  green50:     "#f0fdf4",
  green700:    "#15803d",
  red50:       "#fef2f2",
  red700:      "#b91c1c",
  orange400:   "#fb923c",
};

/* ─── helpers ─── */
const fmtINR = (n) => n ? `₹${Number(n).toLocaleString("en-IN")}` : "—";

const STATUS = {
  active:  { label: "Live",    bg: C.blueLight,  text: C.blue,      border: C.blueBorder },
  draft:   { label: "Draft",   bg: C.slate100,   text: C.slate500,  border: C.slate200 },
  ended:   { label: "Ended",   bg: "#fff7ed",    text: "#c2410c",   border: "#fed7aa" },
  expired: { label: "Expired", bg: "#fffbeb",    text: "#b45309",   border: "#fde68a" },
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CHART_DATA = MONTHS.map((m, i) => ({
  month: m,
  revenue: [40,55,45,60,52,48,70,125,62,80,90,110][i],
}));

/* ─── animated counter ─── */
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

/* ─── magnetic button ─── */
function MagButton({ children, className, style, onClick, disabled }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.25);
    y.set((e.clientY - r.top - r.height / 2) * 0.25);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.button
      ref={ref} style={{ x: sx, y: sy, ...style }}
      onMouseMove={onMove} onMouseLeave={onLeave}
      whileTap={{ scale: 0.94 }}
      onClick={onClick} disabled={disabled}
      className={className}
    >{children}</motion.button>
  );
}

/* ─── stat card ─── */
function StatCard({ label, value, badge, badgeUp, prefix, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 120 }}
      style={{
        background: C.white, border: `1px solid ${C.slate200}`,
        borderRadius: 12, padding: "14px 18px", cursor: "default",
      }}
    >
      <p style={{ fontSize: 11, color: C.slate400, marginBottom: 6 }}>{label}</p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <p style={{ fontSize: 24, fontWeight: 700, color: C.slate900, fontFamily: "'Syne',sans-serif" }}>
          {prefix}<Counter to={value} />
        </p>
        {badge && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
            background: badgeUp ? C.green50 : C.red50,
            color: badgeUp ? C.green700 : C.red700,
          }}>
            {badge}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ─── custom tooltip ─── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.white, border: `1px solid ${C.slate200}`,
      borderRadius: 8, padding: "8px 12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    }}>
      <p style={{ fontSize: 10, color: C.slate400, marginBottom: 2 }}>Revenue in {label}</p>
      <p style={{ fontSize: 13, fontWeight: 700, color: C.blue }}>
        Rp. {(payload[0].value * 1_000_000).toLocaleString("id-ID")}
      </p>
    </div>
  );
}

/* ─── auction row ─── */
function AuctionRow({ auction, index, onStart, onEnd }) {
  const cfg = STATUS[auction.status] || STATUS.draft;
  const stripeColor =
    auction.status === "active" ? C.blue :
    auction.status === "draft"  ? C.slate200 : C.orange400;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 130 }}
      whileHover={{ y: -2 }}
      style={{
        display: "flex", background: C.white,
        border: `1px solid ${C.slate200}`, borderRadius: 12,
        overflow: "hidden", transition: "box-shadow 0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,99,235,0.08)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      {/* accent stripe */}
      <div style={{ width: 3, background: stripeColor, flexShrink: 0 }} />

      {/* thumbnail */}
      <div style={{
        width: 64, height: 64, borderRadius: 10, overflow: "hidden",
        flexShrink: 0, background: C.slate100, margin: "13px 12px 13px 14px",
      }}>
        <img
          src={auction.media?.[0] || "https://via.placeholder.com/80/f1f5f9/94a3b8?text=IMG"}
          alt={auction.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* body */}
      <div style={{ flex: 1, minWidth: 0, padding: "13px 12px 13px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <h3 style={{
            fontWeight: 700, fontSize: 13, color: C.slate900,
            flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            fontFamily: "'Syne',sans-serif",
          }}>{auction.name}</h3>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 9999,
            background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`,
            flexShrink: 0,
          }}>{cfg.label}</span>
        </div>

        <p style={{
          fontSize: 11, color: C.slate400, marginBottom: 10,
          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical",
        }}>{auction.description}</p>

        <div style={{ display: "flex", gap: 20 }}>
          {[
            { lbl: "Start Price", val: fmtINR(auction.startPrice), color: C.slate600 },
            { lbl: "Highest Bid", val: fmtINR(auction.currentHighestBid), color: C.blue, bold: true },
            { lbl: "Total Bids",  val: auction.bidCount ?? 0, color: C.orange400, bold: true },
          ].map(({ lbl, val, color, bold }) => (
            <div key={lbl}>
              <span style={{ display: "block", fontSize: 8, color: C.slate300, marginBottom: 2, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{lbl}</span>
              <span style={{ fontSize: 12, color, fontWeight: bold ? 700 : 500 }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, justifyContent: "center", padding: "0 14px", width: 110, flexShrink: 0 }}>
        <Link
          to={`/auction/${auction._id}`}
          style={{
            textAlign: "center", fontSize: 10, fontWeight: 600, padding: "7px 10px",
            borderRadius: 10, background: C.slate50, border: `1px solid ${C.slate200}`,
            color: C.slate500, textDecoration: "none", transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.target.style.borderColor = C.blueBorder; e.target.style.color = C.blue; }}
          onMouseLeave={e => { e.target.style.borderColor = C.slate200; e.target.style.color = C.slate500; }}
        >
          View Details
        </Link>

        {auction.status === "draft" && (
          <MagButton
            onClick={() => onStart(auction._id)}
            style={{
              fontSize: 10, fontWeight: 700, padding: "7px 10px", borderRadius: 10,
              color: C.white, cursor: "pointer", border: "none",
              background: C.blue, boxShadow: "0 3px 10px rgba(37,99,235,0.3)",
            }}
          >Go Live</MagButton>
        )}

        {auction.status === "active" && (
          <MagButton
            onClick={() => onEnd(auction._id)}
            style={{
              fontSize: 10, fontWeight: 700, padding: "7px 10px", borderRadius: 10,
              background: C.red50, border: `1px solid #fecaca`,
              color: C.red700, cursor: "pointer",
            }}
          >End Auction</MagButton>
        )}
      </div>
    </motion.div>
  );
}

/* ─── skeleton ─── */
function Skeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{
          background: C.white, border: `1px solid ${C.slate200}`,
          borderRadius: 12, padding: 13, display: "flex", gap: 12,
        }}>
          <div style={{ width: 64, height: 64, borderRadius: 10, background: C.slate100 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
            <div style={{ height: 12, background: C.slate100, borderRadius: 6, width: "33%" }} />
            <div style={{ height: 10, background: C.slate100, borderRadius: 6, width: "60%" }} />
            <div style={{ height: 10, background: C.slate100, borderRadius: 6, width: "25%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── nav icons ─── */
const NavIcons = {
  Dashboard: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>,
  Properties: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 4h12M2 8h12M2 12h7"/></svg>,
  Messages: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="2" width="14" height="10" rx="2"/><path d="M4 14l2-2h5"/></svg>,
  Notifications: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1a5 5 0 015 5v3l1.5 2h-13L3 9V6a5 5 0 015-5z" strokeLinecap="round"/><path d="M6.5 13a1.5 1.5 0 003 0"/></svg>,
  Orders: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="1" width="12" height="14" rx="2"/><path d="M5 5h6M5 8h6M5 11h3"/></svg>,
  Analytics: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="2,12 6,7 9,10 14,4"/></svg>,
  Setting: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="2.5"/><path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.4 3.4l.7.7M11.9 11.9l.7.7M11.9 3.4l-.7.7M3.4 11.9l.7-.7" strokeLinecap="round"/></svg>,
  Help: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M6.5 6a1.5 1.5 0 012.5 1c0 1-1.5 1.5-1.5 2.5M8 12v.5" strokeLinecap="round"/></svg>,
};

/* ═══════════════ MAIN ═══════════════ */
export default function SellerDashboard() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const res = await api.get(API_ENDPOINTS.Auction.GET_BY_SELLER);
      setAuctions(res.data.data || []);
    } catch {
      showError("Failed to load your auctions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAuctions(); }, []);

  const handleStart = async (id) => {
    try {
      await api.patch(API_ENDPOINTS.Auction.START(id));
      showSuccess("Auction is now live");
      fetchAuctions();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to start auction");
    }
  };

  const handleEnd = async (id) => {
    try {
      await api.patch(API_ENDPOINTS.Auction.END(id));
      showSuccess("Auction ended successfully");
      fetchAuctions();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to end auction");
    }
  };

  const filtered = auctions
    .filter((a) => filter === "all" || a.status === filter)
    .filter((a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description?.toLowerCase().includes(search.toLowerCase())
    );

  const stats = {
    total: auctions.length,
    live:  auctions.filter((a) => a.status === "active").length,
    draft: auctions.filter((a) => a.status === "draft").length,
    ended: auctions.filter((a) => ["ended","expired"].includes(a.status)).length,
  };

  const NAV_SECTIONS = [
    { label: "OVERVIEW", items: ["Dashboard","Properties","Messages","Notifications"] },
    { label: "PERFORMANCE", items: ["Orders","Analytics"] },
    { label: "SUPPORT", items: ["Setting","Help"] },
  ];

  const FILTERS = [
    { key: "all",    label: "All" },
    { key: "active", label: "Live" },
    { key: "draft",  label: "Draft" },
    { key: "ended",  label: "Ended" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
        h1,h2,h3 { font-family:'Syne',sans-serif; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:${C.slate200}; border-radius:9999px; }
        @keyframes pulse-dot {
          0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          70%  { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        .live-dot { animation: pulse-dot 1.8s ease-out infinite; }
      `}</style>

      <div style={{ minHeight: "100vh", background: C.slate50, display: "flex" }}>

        {/* ── Sidebar ── */}
        <motion.aside
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          style={{
            width: 200, background: C.white,
            borderRight: `1px solid ${C.slate200}`,
            height: "100vh", position: "fixed",
            display: "flex", flexDirection: "column", zIndex: 10,
          }}
        >
          {/* Logo */}
          <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${C.slate100}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: C.blue, display: "flex", alignItems: "center",
                justifyContent: "center", color: C.white,
                fontWeight: 800, fontSize: 15, fontFamily: "'Syne',sans-serif",
                boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
              }}>A</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: C.slate900, fontFamily: "'Syne',sans-serif" }}>AuctionHub</div>
                <div style={{ fontSize: 9, color: C.slate400, letterSpacing: "0.1em", textTransform: "uppercase" }}>Seller Portal</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "8px 10px", overflowY: "auto" }}>
            {NAV_SECTIONS.map(({ label, items }) => (
              <div key={label}>
                <p style={{ fontSize: 9, color: C.slate400, letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 8px 4px", fontWeight: 600 }}>{label}</p>
                {items.map((item) => {
                  const isActive = item === "Dashboard";
                  return (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={!isActive ? { x: 2 } : {}}
                      style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "8px 10px", borderRadius: 10, cursor: "pointer",
                        fontSize: 12, fontWeight: isActive ? 600 : 400,
                        color: isActive ? C.blue : C.slate400,
                        background: isActive ? C.blueLight : "transparent",
                        marginBottom: 1, transition: "all 0.15s",
                        borderRight: isActive ? `2px solid ${C.blue}` : "2px solid transparent",
                      }}
                    >
                      {NavIcons[item]}
                      {item}
                      {item === "Dashboard" && stats.live > 0 && (
                        <span style={{
                          marginLeft: "auto", fontSize: 9, fontWeight: 700,
                          background: C.blueLight, color: C.blue,
                          border: `1px solid ${C.blueBorder}`,
                          padding: "1px 6px", borderRadius: 9999,
                        }}>{stats.live}</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Create CTA */}
          <div style={{ padding: "10px 12px", borderTop: `1px solid ${C.slate100}` }}>
            <div style={{
              background: `linear-gradient(135deg, ${C.blueLight}, #eef2ff)`,
              border: `1px solid ${C.blueBorder}`, borderRadius: 10, padding: "12px",
            }}>
              <p style={{ fontSize: 11, color: C.slate500, marginBottom: 8, lineHeight: 1.4 }}>
                Start selling with a new listing today
              </p>
              <Link
                to="/auction/create"
                style={{
                  display: "block", textAlign: "center", fontSize: 11, fontWeight: 700,
                  padding: "7px 0", borderRadius: 8, color: C.white, textDecoration: "none",
                  background: C.blue,
                }}
              >+ New Auction</Link>
            </div>
          </div>
        </motion.aside>

        {/* ── Main ── */}
        <main style={{ flex: 1, marginLeft: 200, minHeight: "100vh" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 32px" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
              <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 120 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: C.slate900, lineHeight: 1 }}>My Auctions</h1>
                <p style={{ fontSize: 12, color: C.slate400, marginTop: 6 }}>
                  {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                <Link
                  to="/auction/create"
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "10px 18px", borderRadius: 10, fontWeight: 700,
                    fontSize: 13, color: C.white, textDecoration: "none",
                    background: C.blue, boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                  }}
                >
                  <span style={{ fontSize: 16 }}>+</span> Create Auction
                </Link>
              </motion.div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
              {/* Sales Analytics spanning 3 cols + Property Views 1 col */}
              <div style={{ gridColumn: "1 / 4", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                {[
                  { label: "Active properties", value: stats.total || 32, badge: "38% ▲", badgeUp: true },
                  { label: "Sold properties",   value: stats.live  || 20, badge: "24% ▼", badgeUp: false },
                  { label: "Total Drafts",       value: stats.draft || 5 },
                  { label: "Completed",          value: stats.ended || 12 },
                ].map((s, i) => <StatCard key={s.label} {...s} delay={0.08 * i + 0.1} />)}
              </div>

              {/* Overall Revenue */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: "spring" }}
                style={{
                  background: C.blue, borderRadius: 12, padding: "16px 18px",
                  display: "flex", flexDirection: "column", justifyContent: "center",
                }}
              >
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>Overall Revenue</p>
                <p style={{ fontSize: 17, fontWeight: 700, color: C.white, fontFamily: "'Syne',sans-serif" }}>
                  Rp 1.256.000.000
                </p>
                <span style={{
                  marginTop: 6, fontSize: 10, fontWeight: 700,
                  background: "rgba(255,255,255,0.2)", color: C.white,
                  padding: "2px 8px", borderRadius: 4, alignSelf: "flex-start",
                }}>24% ▼</span>
              </motion.div>
            </div>

            {/* Sales Chart + Property Views */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 12, marginBottom: 24 }}>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                style={{ background: C.white, border: `1px solid ${C.slate200}`, borderRadius: 12, padding: 18 }}
              >
                <h2 style={{ fontSize: 14, fontWeight: 700, color: C.slate900, marginBottom: 14, fontFamily: "'Syne',sans-serif" }}>
                  Sales Analytics
                </h2>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={CHART_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.slate100} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: C.slate400 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: C.slate400 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Line
                      type="monotone" dataKey="revenue"
                      stroke={C.blue} strokeWidth={2.5}
                      dot={false} activeDot={{ r: 5, fill: C.blue, stroke: C.white, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                style={{
                  background: C.blue, borderRadius: 12, padding: 20,
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", textAlign: "center",
                }}
              >
                <p style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 16, fontFamily: "'Syne',sans-serif" }}>
                  Property views
                </p>
                <p style={{ fontSize: 44, fontWeight: 800, color: C.white, lineHeight: 1, fontFamily: "'Syne',sans-serif" }}>
                  2,1K
                </p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 10, lineHeight: 1.5 }}>
                  Number of times buyers viewed your property.
                </p>
              </motion.div>
            </div>

            {/* Live alert */}
            <AnimatePresence>
              {stats.live > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: "hidden", marginBottom: 16 }}
                >
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: C.white, border: `1px solid ${C.slate200}`,
                    borderLeft: `3px solid ${C.blue}`, borderRadius: 10,
                    padding: "10px 14px",
                  }}>
                    <span className="live-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
                    <p style={{ fontSize: 12, color: C.slate600 }}>
                      <strong style={{ color: C.slate900 }}>{stats.live} auction{stats.live > 1 ? "s" : ""}</strong> actively receiving bids right now
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search + Filter */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.slate300 }}
                  width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="6.5" cy="6.5" r="4.5"/><path d="M10.5 10.5l3 3"/>
                </svg>
                <input
                  type="text" placeholder="Search by name or description…"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%", background: C.white, border: `1px solid ${C.slate200}`,
                    borderRadius: 10, padding: "9px 14px 9px 36px",
                    fontSize: 12, color: C.slate700, outline: "none", transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = C.blue}
                  onBlur={e => e.target.style.borderColor = C.slate200}
                />
              </div>

              <div style={{
                display: "flex", gap: 4, background: C.white,
                border: `1px solid ${C.slate200}`, borderRadius: 10, padding: 4,
              }}>
                {FILTERS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    style={{
                      position: "relative", padding: "6px 14px", fontSize: 11, fontWeight: 600,
                      borderRadius: 8, border: "none", cursor: "pointer", transition: "all 0.2s",
                      background: filter === key ? C.blue : "transparent",
                      color: filter === key ? C.white : C.slate400,
                    }}
                  >{label}</button>
                ))}
              </div>
            </div>

            {/* List */}
            {loading ? (
              <Skeleton />
            ) : filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{
                  background: C.white, border: `1px solid ${C.slate200}`,
                  borderRadius: 12, padding: "60px 0", textAlign: "center",
                }}
              >
                <p style={{ fontWeight: 700, fontSize: 15, color: C.slate700, fontFamily: "'Syne',sans-serif", marginBottom: 6 }}>No auctions found</p>
                <p style={{ fontSize: 12, color: C.slate400, marginBottom: 18 }}>Try adjusting your search or filter criteria</p>
                <Link to="/auction/create" style={{ fontSize: 12, fontWeight: 600, color: C.blue, textDecoration: "none" }}>
                  + Create a new auction
                </Link>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {filtered.map((auction, i) => (
                    <AuctionRow key={auction._id} auction={auction} index={i} onStart={handleStart} onEnd={handleEnd} />
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>
        </main>
      </div>
    </>
  );
}