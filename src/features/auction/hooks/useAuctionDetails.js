import { useEffect, useState } from "react";
import { getAuctionById } from "@/api/auctionAPI";

export const useAuctionDetails = (id) => {
    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuction = async () => {
            try {
                const res = await getAuctionById(id);
                setAuction(res?.data || res);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAuction();
    }, [id]);

    return { auction, loading };
};
