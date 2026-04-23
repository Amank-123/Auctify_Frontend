import { api } from "@/shared/services/axios.js";
import { API_ENDPOINTS } from "../../shared/constants/apiEndpoints";

export const auctionAPI = {
    getAll: async (getQuery) => {
        const res = await api.get(API_ENDPOINTS.Auction.GET_ALL, { params: getQuery });
        return res.data.data;
    },

    getBySeller: async () => {
        const res = await api.get(API_ENDPOINTS.Auction.GET_BY_SELLER);
        return res.data.data.map((item) => ({
            ...item,
            media: item.media?.flat() ?? [],
        }));
    },

    getLive: async () => {
        const res = await api.get(API_ENDPOINTS.Auction.GET_LIVE);
        return res.data.data;
    },

    getById: async (id) => {
        const res = await api.get(API_ENDPOINTS.Auction.GET_BY_ID(id));
        return res.data.data;
    },

    create: async (data) => {
        const res = await api.post(API_ENDPOINTS.Auction.CREATE, data);
        return res.data.data;
    },

    update: async (id, data) => {
        const res = await api.put(API_ENDPOINTS.Auction.UPDATE(id), data);
        return res.data.data;
    },

    start: async (id) => {
        const res = await api.post(API_ENDPOINTS.Auction.START(id));
        return res.data.data;
    },

    end: async (id) => {
        const res = await api.post(API_ENDPOINTS.Auction.END(id));
        return res.data.data;
    },
};
export const bidAPI = {
    getByAuction: async (auctionId) => {
        const res = await api.get(API_ENDPOINTS.Bid.GET_BY_AUCTION(auctionId));
        return res.data.data; // array of bids
    },

    placeBid: async (data) => {
        const res = await api.post(API_ENDPOINTS.Bid.PLACE, data);
        return res.data.data;
    },
};
