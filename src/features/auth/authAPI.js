import { API_ENDPOINTS } from "../../shared/constants/apiEndpoints";
import { api } from "../../shared/services/axios";

export const verifyOtp = async (email, otp) => {
    return await api.post(API_ENDPOINTS.Otp.VERIFY, {
        email,
        otp,
    });
    setUser(res.data.data);
};

export const verifyForgottenOtp = async (email, otp) => {
    return await api.post(API_ENDPOINTS.Otp.VERIFY_FORGOT, {
        email,
        otp,
    });
    setUser(res.data.data);
};

export const forgotPassword = async (email) => {
    const res = await api.post(API_ENDPOINTS.Auth.FORGOT_PASSWORD, { email });
    return res.data;
};

export const restPassword = async (email, password) => {
    const res = await api.post(API_ENDPOINTS.Auth.Reset_PASSWORD, { email, password });
    return res.data;
};
