import { createContext, useEffect, useState } from "react";
import { api } from "../shared/services/axios.js";
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
        console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('All env vars:', import.meta.env);
        const res = await api.post(API_ENDPOINTS.Auth.REGISTER, data);
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
            value={{ User, Loading, login, register, logout, isAuthenticated: !!User }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
