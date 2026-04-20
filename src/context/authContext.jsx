import { createContext, useEffect, useState } from "react";
import { api } from "@/shared/services/axios.js";
import { API_ENDPOINTS } from "../shared/constants/apiEndpoints.js";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [User, setUser] = useState(null);
    const [Loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get(API_ENDPOINTS.User.GET);
                setUser(res.data.data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        const res = await api.post(API_ENDPOINTS.Auth.LOGIN, credentials);
        setUser(res.data.data);
        return res;
    };

    const register = async (data) => {
        const res = await api.post(API_ENDPOINTS.Auth.REGISTER, data);
        setUser(res.data.data);
        return res;
    };

    const verifyOtp = async (email, otp) => {
        const res = await api.post(API_ENDPOINTS.Otp.VERIFY, {
            email,
            otp,
        });

        setUser(res.data.data);
        return res;
    };

    const logout = async () => {
        const res = await api.post(API_ENDPOINTS.Auth.LOGOUT);
        setUser(null);
        return res;
    };

    return (
        <AuthContext.Provider
            value={{
                User,
                setUser,
                Loading,
                login,
                register,
                logout,
                verifyOtp,
                isAuthenticated: !!User,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
