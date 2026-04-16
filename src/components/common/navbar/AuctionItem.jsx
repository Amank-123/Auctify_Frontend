import { Link } from "react-router-dom";

export default function AuctionItem({ auction, onClick }) {
    const id = auction?._id || auction?.id;
    const title = auction?.title || auction?.name || "Untitled auction";
    const status = auction?.status || "active";
    const currentBid = auction?.currentBid ?? auction?.highestBid ?? auction?.bidAmount ?? "-";

    return (
        <Link
            to={id ? `/auction/${id}` : "/user/auctions"}
            onClick={onClick}
            className="block rounded-xl border border-[#E5E7EB] bg-white p-3 transition hover:border-[#2563EB]/30 hover:bg-[#F8F8FF]"
        >
            <div className="line-clamp-1 text-sm font-semibold text-[#1F2937]">{title}</div>
            <div className="mt-1 flex items-center justify-between text-xs text-[#6B7280]">
                <span>{status}</span>
                <span>{currentBid}</span>
            </div>
        </Link>
    );
}
