import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";
import { useAuth } from "@/hooks/useAuth";
import { CreditCard, Target, BarChart3, ArrowRight } from "lucide-react";
import HeroBannerSlider from "./HeroBannerSlider.jsx";
import AnnouncementBar from "./AnnouncementBar.jsx";
import CategoryRow from "./CategoryRow.jsx";
import HowAppWorks from "./HowAppWorks.jsx";
import AuctionsGrid from "./AuctionsGrid.jsx";
import { usePageTitle } from "../../../shared/utils/usePageTitle.js";
import Watchlist from "@/components/common/watchlist.jsx";
import SellerCTA from "./SellerCTA.jsx";
import FinalCTA from "./FinalCTA.jsx";

export default function Homepage() {
    usePageTitle("Auctify");
    return (
        <>
            {/* <style>{GLOBAL_STYLE}</style> */}
            <div style={{ minHeight: "100vh", background: "#F8F8FF" }}>
                <AnnouncementBar
                    announcements={[
                        "Real-time Auctions • Direct seller-to-buyer • No middleman fees",
                        "New auctions drop every day — don't miss out!",
                        "Secure payments • Verified sellers • Buyer protection",
                    ]}
                />
                <HeroBannerSlider />
                <div style={{ paddingTop: 5 }}>
                    <CategoryRow />
                    {/* <Watchlist /> */}
                    <AuctionsGrid
                        heading="Explore All Auctions"
                        subheading="Discover live auctions in real-time"
                        limit={10}
                    />
                    <SellerCTA />
                    <AuctionsGrid
                        heading="Explore All Instant Auctions"
                        subheading="Bid fast to win the auctions"
                        limit={10}
                        filtering={false}
                        auctionType="short"
                        exploreBtn={false}
                    />
                    <AuctionsGrid
                        heading="Explore All Long Auctions"
                        subheading="Bid freely until the auction end"
                        limit={10}
                        filtering={false}
                        auctionType="long"
                        exploreBtn={false}
                    />
                    <HowAppWorks />
                    <FinalCTA />
                </div>
            </div>
        </>
    );
}
