import { axiosInstance } from './axios.js';
import { getErrorMessage } from '../utils/errorHandler.js';

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = getErrorMessage(error);
    error.customMessage=message;
    return Promise.reject(error)
  },
);
