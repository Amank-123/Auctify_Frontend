import AuctionsGrid from "@/features/home/pages/AuctionsGrid.jsx";
import { usePageTitle } from "../../shared/utils/usePageTitle";

export default function AllAuctions() {
    usePageTitle("Auctify | Explore Auctions");
    return (
        <AuctionsGrid
            limit={20}
            heading="All Auctions"
            subheading="Browse every live and upcoming auction."
            exploreBtn={false}
        />
    );
}
