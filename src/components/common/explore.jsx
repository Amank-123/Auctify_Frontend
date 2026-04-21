import AuctionsGrid from "@/features/home/pages/AuctionsGrid.jsx";

export default function AllAuctions() {
    return (
        <AuctionsGrid
            showAll={true}
            title="All Auctions"
            subtitle="Browse every live and upcoming auction."
        />
    );
}
