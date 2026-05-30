import { Outlet } from "react-router-dom";
import LoginNavbar from "../components/auth/loginNav.jsx";

const AuthLayout = () => {
    return (
        <>
            <LoginNavbar />

            <main className="h-[calc(100vh-68px)] ">
                <Outlet />
            </main>
        </>
    );
};

export default AuthLayout;
