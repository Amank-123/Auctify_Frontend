import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { showError } from "../../shared/utils/toast.js";
import { LoadingPage } from "../common/LoadingPage.jsx";

const ProtectRoute = ({ allowedRoles }) => {
    const { isAuthenticated, Loading, User} = useAuth();
 
    if (Loading) return <LoadingPage />;

    if (!isAuthenticated) {
        showError("Access denied");
        return <Navigate to="/" replace />;
    }

    // Normalize to array
    if (allowedRoles && User?.role !== allowedRoles) {
        showError("You are not authorized");
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
export default ProtectRoute

