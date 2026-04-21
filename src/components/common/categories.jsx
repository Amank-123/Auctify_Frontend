import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";
import AuctionCard from "../../components/common/AuctionCard.jsx";

export default function CategoriesPage() {
    const [allAuctions, setAllAuctions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCat, setSelectedCat] = useState(null);
    const [filteredAuctions, setFilteredAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    /* =========================
       FETCH DATA
    ========================= */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(API_ENDPOINTS.Auction.GET_ALL, {
                    params: { limit: 100 },
                });

                // ✅ FIXED: correct data extraction
                const auctions = res?.data?.data || [];

                setAllAuctions(auctions);

                // ✅ Build categories safely
                const map = {};
                auctions.forEach((a) => {
                    const cat = a?.category || "others";
                    map[cat] = (map[cat] || 0) + 1;
                });

                const catArr = Object.entries(map).map(([name, count]) => ({
                    name,
                    count,
                }));

                setCategories(catArr);

                // ✅ Auto select first category
                if (catArr.length > 0) {
                    setSelectedCat(catArr[0].name);
                }
            } catch (err) {
                console.error("Error fetching:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    /* =========================
       FILTER LOGIC
    ========================= */
    useEffect(() => {
        if (!selectedCat) return;

        const term = search.toLowerCase();

        const filtered = allAuctions.filter((a) => {
            const matchCat = (a?.category || "others") === selectedCat;

            const matchSearch =
                !term ||
                a?.name?.toLowerCase().includes(term) ||
                a?.description?.toLowerCase().includes(term);

            return matchCat && matchSearch;
        });

        setFilteredAuctions(filtered);
    }, [selectedCat, search, allAuctions]);

    /* =========================
       LOADING
    ========================= */
    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            {/* HEADER */}
            <h1 className="text-3xl font-bold mb-6">Browse Categories</h1>

            {/* =========================
               CATEGORY GRID
            ========================= */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {categories.map((cat) => (
                    <motion.div
                        key={cat.name}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedCat(cat.name)}
                        className={`cursor-pointer p-4 rounded-xl border ${
                            selectedCat === cat.name ? "bg-blue-600 text-white" : "bg-white"
                        }`}
                    >
                        <h2 className="font-semibold capitalize">{cat.name.replace("_", " ")}</h2>
                        <p className="text-sm opacity-70">{cat.count} auctions</p>
                    </motion.div>
                ))}
            </div>

            {/* =========================
               SEARCH BAR
            ========================= */}
            {selectedCat && (
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder={`Search ${selectedCat}...`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border px-4 py-2 rounded-lg"
                    />
                </div>
            )}

            {/* =========================
               AUCTIONS
            ========================= */}
            <AnimatePresence>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAuctions.length > 0 ? (
                        filteredAuctions.map((auction) => (
                            <AuctionCard key={auction._id} auction={auction} />
                        ))
                    ) : (
                        <p className="text-gray-500">No auctions found in this category</p>
                    )}
                </div>
            </AnimatePresence>
        </div>
    );
}
