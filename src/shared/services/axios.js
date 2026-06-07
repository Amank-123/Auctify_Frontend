import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    timeout: 20000,
});

const refreshApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    timeout: 20000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve();
        }
    });

    failedQueue = [];
};

const isAuthPublicRoute = (url = "") => {
    return [
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/forgot-password",
        "/api/auth/reset-password",
    ].some((route) => url.includes(route));
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config || {};
        const status = error.response?.status;
        const message = error.response?.data?.message;
        const url = originalRequest.url || "";

        if (!error.response) {
            return Promise.reject(error);
        }

        if (url.includes("/api/auth/refresh")) {
            if (
                window.location.pathname !== "/auth/login" &&
                window.location.pathname !== "/auth/register"
            ) {
                window.location.href = "/auth/login";
            }
            return Promise.reject(error);
        }

        if (isAuthPublicRoute(url)) {
            return Promise.reject(error);
        }

        if (status !== 401) {
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        if (
            message === "NO_TOKEN" ||
            message === "INVALID_TOKEN" ||
            message === "INVALID_USER" ||
            message === "NO_REFRESH_TOKEN" ||
            message === "INVALID_REFRESH_TOKEN"
        ) {
            if (
                window.location.pathname !== "/auth/login" &&
                window.location.pathname !== "/auth/register"
            ) {
                window.location.href = "/auth/login";
            }
            return Promise.reject(error);
        }

        if (message !== "TOKEN_EXPIRED") {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: () => resolve(api(originalRequest)),
                    reject,
                });
            });
        }

        isRefreshing = true;

        try {
            await refreshApi.post("/api/auth/refresh");
            processQueue();
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError);

            if (
                window.location.pathname !== "/auth/login" &&
                window.location.pathname !== "/auth/register"
            ) {
                window.location.href = "/auth/login";
            }

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    },
);

export { api };
