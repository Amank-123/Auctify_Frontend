import { Outlet } from "react-router-dom";
import Footer from "../components/common/footer.jsx";
import LoginNavbar from "../components/auth/loginNav.jsx";

const AuthLayout = () => {
    return (
        <>
            {/* <LoginNavbar /> */}
            <main className="min-h-screen ">
                <Outlet />
            </main>
        </>
    );
};

export default AuthLayout;
