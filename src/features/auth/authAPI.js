import { API_ENDPOINTS } from "../../shared/constants/apiEndpoints";
import { api } from "../../shared/services/axios";

export const verifyOtp = async (email, otp) => {
    return await api.post(API_ENDPOINTS.Otp.VERIFY, {
        email,
        otp,
    });
};
