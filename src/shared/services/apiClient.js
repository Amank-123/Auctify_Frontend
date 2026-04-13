import { axiosInstance } from './axios.js';
import { getErrorMessage } from '../utils/errorHandler.js';

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = getErrorMessage(error);
        error.customMessage = message;
        return Promise.reject(error);
    },
);

axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error),
);

export default axiosInstance;
