import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 20000,
});

const authApi = axios.create({
    baseURL,
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

const isAuthRoute = () => {
    if (typeof window === "undefined") return false;
    return ["/auth/login", "/auth/register"].includes(window.location.pathname);
};

const redirectToLogin = () => {
    if (typeof window === "undefined") return;
    if (!isAuthRoute()) {
        window.location.href = "/auth/login";
    }
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error?.config;

        if (!error?.response) {
            return Promise.reject(error);
        }

        if (!originalRequest) {
            return Promise.reject(error);
        }

        const status = error.response.status;
        const message = error.response.data?.message;

        const isRefreshRequest =
            originalRequest.url?.includes("/auth/refresh") ||
            originalRequest.url?.includes("/api/auth/refresh");

        if (isRefreshRequest) {
            redirectToLogin();
            return Promise.reject(error);
        }

        if (status !== 401) {
            return Promise.reject(error);
        }

        if (isAuthRoute()) {
            return Promise.reject(error);
        }

        if (message === "NO_TOKEN" || message === "INVALID_TOKEN" || message === "INVALID_USER") {
            redirectToLogin();
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
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
            await authApi.post("/api/auth/refresh");

            processQueue(null);
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError);
            redirectToLogin();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    },
);

export { api };
