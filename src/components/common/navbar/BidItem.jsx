import { Link } from "react-router-dom";

export default function BidItem({ bid, onClick }) {
    console.log(bid);

    const id = bid?._id || bid?.id;
    const auctionId = bid?.auctionId?._id || bid?.auctionId;
    const auctionTitle = bid?.auctionTitle || bid?.auction?.title || bid?.itemTitle || "Auction";
    const amount = bid?.amount ?? bid?.bidAmount ?? "-";
    const status = bid?.status || "placed";

    const href = auctionId ? `/auction/${auctionId}` : id ? `/bids/${id}` : "/bids";

    return (
        <Link
            to={href}
            onClick={onClick}
            className="block rounded-xl border border-[#E5E7EB] bg-white p-3 transition hover:border-[#C2410C]/30 hover:bg-[#F8F8FF]"
        >
            <div className="line-clamp-1 text-sm font-semibold text-[#1F2937]">{auctionTitle}</div>
            <div className="mt-1 flex items-center justify-between text-xs text-[#6B7280]">
                <span>{status}</span>
                <span>{amount}</span>
            </div>
        </Link>
    );
}
