import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    // timeout: 10000,
});

let isRefreshing = false;
let queue = [];

const processQueue = () => {
    queue.forEach((cb) => cb());
    queue = [];
};

// api.interceptors.response.use(
//     (res) => res,
//     async (error) => {
//         const originalRequest = error.config;

//         // If refresh itself fails → logout
//         if (originalRequest?.url?.includes("/auth/refresh")) {
//             window.location.href = "/auth/login";
//             return Promise.reject(error);
//         }

//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             if (isRefreshing) {
//                 return new Promise((resolve) => {
//                     queue.push(() => resolve(api(originalRequest)));
//                 });
//             }

//             isRefreshing = true;

//             try {
//                 await api.post("/api/auth/refresh");
//                 processQueue();
//                 return api(originalRequest);
//             } catch (err) {
//                 window.location.href = "/auth/login";
//                 return Promise.reject(err);
//             } finally {
//                 isRefreshing = false;
//             }
//         }

//         return Promise.reject(error);
//     },
// );

export { api };
