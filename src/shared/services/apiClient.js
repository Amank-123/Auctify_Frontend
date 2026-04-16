import { api } from "./axios.js";
import { getErrorMessage } from "../utils/errorHandler.js";

// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         const message = getErrorMessage(error);
//         error.customMessage = message;
//         return Promise.reject(error);
//     },
// );

api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await api.post("/api/auth/refresh");
                console.log("token refreshed");
                return api(originalRequest);
            } catch (refreshError) {
                console.log("Refresh failed");
                window.location.href = "/api/auth/login";
            }
        }
        const message = getErrorMessage(error);
        error.customMessage = message;
        return Promise.reject(error);
    },
);

export default api;
