import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { C, STATUS } from "../../constants/dashboardColors";
import { fmtINR } from "../../utils/format";
import MagButton from "./MagButton";

export default function AuctionRow({ auction, index, onStart, onEnd }) {
    console.log("auction:", auction);
    console.log("index:", index);
    console.log("onStart:", onStart);
    console.log("onEnd:", onEnd);

    const cfg = STATUS[auction.status] || STATUS.draft;
    const stripeColor =
        auction.status === "active"
            ? C.blue
            : auction.status === "draft"
              ? C.slate200
              : C.orange400;

    // media is already flattened by auctionAPI.getBySeller()
    const thumbnail = auction.media?.[0] || "https://via.placeholder.com/80/f1f5f9/94a3b8?text=IMG";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ delay: index * 0.04, type: "spring", stiffness: 130 }}
            whileHover={{ y: -2 }}
            style={{
                display: "flex",
                background: C.white,
                border: `1px solid ${C.slate200}`,
                borderRadius: 12,
                overflow: "hidden",
                transition: "box-shadow 0.2s",
            }}
            onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,99,235,0.08)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
            {/* accent stripe */}
            <div style={{ width: 3, background: stripeColor, flexShrink: 0 }} />

            {/* thumbnail */}
            <div
                style={{
                    width: 64,
                    height: 64,
                    borderRadius: 10,
                    overflow: "hidden",
                    flexShrink: 0,
                    background: C.slate100,
                    margin: "13px 12px 13px 14px",
                }}
            >
                <img
                    src={thumbnail}
                    alt={auction.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </div>

            {/* body */}
            <div style={{ flex: 1, minWidth: 0, padding: "13px 12px 13px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <h3
                        style={{
                            fontWeight: 700,
                            fontSize: 13,
                            color: C.slate900,
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontFamily: "'Syne',sans-serif",
                        }}
                    >
                        {auction.name}
                    </h3>
                    <span
                        style={{
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 9999,
                            background: cfg.bg,
                            color: cfg.text,
                            border: `1px solid ${cfg.border}`,
                            flexShrink: 0,
                        }}
                    >
                        {cfg.label}
                    </span>
                </div>

                <p
                    style={{
                        fontSize: 11,
                        color: C.slate400,
                        marginBottom: 10,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {auction.description}
                </p>

                <div style={{ display: "flex", gap: 20 }}>
                    {[
                        { lbl: "Start Price", val: fmtINR(auction.startPrice), color: C.slate600 },
                        {
                            lbl: "Highest Bid",
                            val: fmtINR(auction.currentHighestBid),
                            color: C.blue,
                            bold: true,
                        },
                        {
                            lbl: "Total Bids",
                            val: auction.bidCount ?? 0,
                            color: C.orange400,
                            bold: true,
                        },
                    ].map(({ lbl, val, color, bold }) => (
                        <div key={lbl}>
                            <span
                                style={{
                                    display: "block",
                                    fontSize: 8,
                                    color: C.slate300,
                                    marginBottom: 2,
                                    fontWeight: 600,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                }}
                            >
                                {lbl}
                            </span>
                            <span style={{ fontSize: 12, color, fontWeight: bold ? 700 : 500 }}>
                                {val}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* actions */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    justifyContent: "center",
                    padding: "0 14px",
                    width: 110,
                    flexShrink: 0,
                }}
            >
                <Link
                    to={`/auction/${auction._id}`}
                    style={{
                        textAlign: "center",
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "7px 10px",
                        borderRadius: 10,
                        background: C.slate50,
                        border: `1px solid ${C.slate200}`,
                        color: C.slate500,
                        textDecoration: "none",
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.borderColor = C.blueBorder;
                        e.target.style.color = C.blue;
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.borderColor = C.slate200;
                        e.target.style.color = C.slate500;
                    }}
                >
                    View Details
                </Link>

                {auction.status === "draft" && (
                    <MagButton
                        onClick={() => onStart(auction._id)}
                        style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "7px 10px",
                            borderRadius: 10,
                            color: C.white,
                            cursor: "pointer",
                            border: "none",
                            background: C.blue,
                            boxShadow: "0 3px 10px rgba(37,99,235,0.3)",
                        }}
                    >
                        Go Live
                    </MagButton>
                )}

                {auction.status === "active" && (
                    <MagButton
                        onClick={() => onEnd(auction._id)}
                        style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "7px 10px",
                            borderRadius: 10,
                            background: C.red50,
                            border: `1px solid #fecaca`,
                            color: C.red700,
                            cursor: "pointer",
                        }}
                    >
                        End Auction
                    </MagButton>
                )}
            </div>
        </motion.div>
    );
}
