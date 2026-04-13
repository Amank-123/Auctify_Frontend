import { api } from './axios.js';
import { getErrorMessage } from '../utils/errorHandler.js';

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = getErrorMessage(error);
    error.customMessage=message;
    return Promise.reject(error)
  },
);
