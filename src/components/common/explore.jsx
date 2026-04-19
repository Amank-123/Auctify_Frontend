import AuctionsGrid from "@/features/home/pages/AuctionsGrid.jsx";
import { mockAuctions } from "../../features/home/pages/homePage.jsx";

export default function AllAuctions() {
    return (
        <AuctionsGrid
            auctions={mockAuctions}
            showAll={true}
            title="All Auctions"
            subtitle="Browse every live and upcoming auction."
        />
    );
}
