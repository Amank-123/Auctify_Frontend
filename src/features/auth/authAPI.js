import { API_ENDPOINTS } from "../../shared/constants/apiEndpoints.js";
import api from "../../shared/services/axios.js";


export const loginUser = async (credentials) => {
  const res = await api.post(API_ENDPOINTS.Auth.LOGIN, credentials);
  return res.data;
};


export const registerUser = async (userData) => {
  const res = await api.post(API_ENDPOINTS.Auth.REGISTER, userData);
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post(API_ENDPOINTS.Auth.LOGOUT);
  return res.data;
};

export const googleOAuth = () => {
  window.location.href = API_ENDPOINTS.Auth.GOOGLE_OAUTH;
};

export const githubOAuth = () => {
  window.location.href = API_ENDPOINTS.Auth.GITHUB_OAUTH;
};