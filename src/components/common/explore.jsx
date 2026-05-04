import AuctionsGrid from "@/features/home/pages/AuctionsGrid.jsx";

export default function AllAuctions() {
    return (
        <AuctionsGrid
            limit={20}
            title="All Auctions"
            subtitle="Browse every live and upcoming auction."
        />
    );
}
