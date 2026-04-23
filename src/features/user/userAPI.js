import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "../../shared/constants/apiEndpoints";

//  User

export const updateUserProfile = async (formData) => {
    console.log("Log reached update ", formData);

    const res = await api.patch(API_ENDPOINTS.User.UPDATE, formData);
    console.log("Log from userApi: ", res);

    return res.data;
};

export const getUserProfile = async () => {
    const res = await api.get(API_ENDPOINTS.User.GET);
    return res.data;
};

//    AUCTIONS (USER RELATED)

// Get auctions created by user
export const getMyAuctions = async () => {
    const res = await api.get(API_ENDPOINTS.Auction.GET_BY_SELLER);
    return res.data;
};

//    BIDS (USER RELATED)

export const getMyBids = async () => {
    const res = await api.get(API_ENDPOINTS.Bid.GET_USER_BIDS);
    return res.data;
};
