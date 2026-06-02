import { API_ENDPOINTS } from "../../shared/constants/apiEndpoints";
import { api } from "../../shared/services/axios";

export const myOrders = async () => {
    try {
        const res = await api.get(API_ENDPOINTS.Order.GET_MY_ORDERS);
        return res.data.data;
    } catch (err) {
        throw err;
    }
};
