import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

const ProtectRoute = () => {
    const { isAuthenticated, Loading } = useAuth();

    if (Loading) return <div>Loading...</div>;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectRoute;
