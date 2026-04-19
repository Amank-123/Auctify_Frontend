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
export const mockAuctions = [
    {
        _id: "1",
        name: "Rolex Submariner Watch",
        media: ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800"],
        category: "Watches",
        startPrice: 120000,
        currentHighestBid: 165000,
        bidCount: 14,
    },
    {
        _id: "2",
        name: "PlayStation 5 Console",
        media: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800"],
        category: "Gaming",
        startPrice: 30000,
        currentHighestBid: 41500,
        bidCount: 22,
    },
    {
        _id: "3",
        name: "iPhone 16 Pro Max",
        media: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"],
        category: "Phones",
        startPrice: 85000,
        currentHighestBid: 97500,
        bidCount: 9,
    },
    {
        _id: "4",
        name: "BMW M4 Coupe",
        media: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"],
        category: "Vehicles",
        startPrice: 4200000,
        currentHighestBid: 4550000,
        bidCount: 31,
    },
    {
        _id: "5",
        name: "Rolex Submariner Watch",
        media: ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800"],
        category: "Watches",
        startPrice: 120000,
        currentHighestBid: 165000,
        bidCount: 14,
    },
    {
        _id: "6",
        name: "PlayStation 5 Console",
        media: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800"],
        category: "Gaming",
        startPrice: 30000,
        currentHighestBid: 41500,
        bidCount: 22,
    },
    {
        _id: "7",
        name: "Rolex Submariner Watch",
        media: ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800"],
        category: "Watches",
        startPrice: 120000,
        currentHighestBid: 165000,
        bidCount: 14,
    },
    {
        _id: "8",
        name: "PlayStation 5 Console",
        media: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800"],
        category: "Gaming",
        startPrice: 30000,
        currentHighestBid: 41500,
        bidCount: 22,
    },
    {
        _id: "9",
        name: "Rolex Submariner Watch",
        media: ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800"],
        category: "Watches",
        startPrice: 120000,
        currentHighestBid: 165000,
        bidCount: 14,
    },
    {
        _id: "10",
        name: "PlayStation 5 Console",
        media: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800"],
        category: "Gaming",
        startPrice: 30000,
        currentHighestBid: 41500,
        bidCount: 22,
    },
];
export default function Homepage() {
    return (
        <>
            <style>{GLOBAL_STYLE}</style>
            <div style={{ minHeight: "100vh", background: "#F8F8FF" }}>
                <AnnouncementBar />
                <HeroBannerSlider />
                <div style={{ paddingTop: 5 }}>
                    <CategoryRow />

                    <AuctionsGrid
                        auctions={mockAuctions}
                        initialLimit={8}
                        showAll={false}
                        title="Trending Auctions"
                        subtitle="Discover premium live auctions on Auctify."
                    />
                    <HowAppWorks />
                </div>
            </div>
        </>
    );
}
