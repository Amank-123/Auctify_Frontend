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

const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');
  *, body { font-family: 'Outfit', sans-serif; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  .skeleton { background: linear-gradient(90deg,#f5f0ea 25%,#ede6da 50%,#f5f0ea 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
  .live-pulse { animation: pulse-ring 1.4s ease-in-out infinite; }
  @keyframes pulse-ring { 0%,100%{opacity:1} 50%{opacity:0.25} }
`;

export default function Homepage() {
    usePageTitle("Auctify | Explore Auctions");
    return (
        <>
            <style>{GLOBAL_STYLE}</style>
            <div style={{ minHeight: "100vh", background: "#F8F8FF" }}>
                <AnnouncementBar />
                <HeroBannerSlider />
                <div style={{ paddingTop: 5 }}>
                    <CategoryRow />

                    <AuctionsGrid
                        heading="Explore Auctions"
                        subheading="Discover live auctions in real-time"
                        limit={15}
                    />
                    <HowAppWorks />
                </div>
            </div>
        </>
    );
}
