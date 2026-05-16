import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    timeout: 20000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve();
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // No response from server
        if (!error.response) {
            return Promise.reject(error);
        }

        const status = error.response.status;
        const message = error.response.data?.message;

        // If refresh route itself fails
        if (originalRequest?.url?.includes("/auth/refresh")) {
            // Prevent redirect loop
            if (
                window.location.pathname !== "/auth/login" &&
                window.location.pathname !== "/auth/register"
            ) {
                window.location.href = "/auth/login";
            }

            return Promise.reject(error);
        }

        // Handle 401 errors
        if (status === 401 && !originalRequest._retry) {
            // Cases where refresh should NOT happen
            if (
                message === "NO_TOKEN" ||
                message === "INVALID_TOKEN" ||
                message === "INVALID_USER"
            ) {
                // Redirect only if not already on auth pages
                if (
                    window.location.pathname !== "/auth/login" &&
                    window.location.pathname !== "/auth/register"
                ) {
                    window.location.href = "/auth/login";
                }

                return Promise.reject(error);
            }

            // Only refresh expired tokens
            if (message === "TOKEN_EXPIRED") {
                originalRequest._retry = true;

                // Queue requests while refresh is happening
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
                    // Refresh access token
                    await api.post("/api/auth/refresh");

                    processQueue();

                    // Retry original request
                    return api(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError);

                    // Refresh token also expired
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
            }
        }

        return Promise.reject(error);
    },
);

export { api };
