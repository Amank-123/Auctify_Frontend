import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { showError } from "../../shared/utils/toast.js";
import { LoadingPage } from "../common/LoadingPage.jsx";

const ProtectRoute = () => {
    const { isAuthenticated, Loading } = useAuth();

    const navigateHandler = () => {
        showError("Access denied please try again after login");
        return <Navigate to="/auth/login" replace />;
    };

    if (Loading) return <LoadingPage />;

    return isAuthenticated ? <Outlet /> : navigateHandler();
};

export default ProtectRoute;
