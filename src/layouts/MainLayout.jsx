import { Outlet } from "react-router-dom";
import Footer from "../components/common/footer.jsx";
import ScrollTop from "../components/common/scrollTop.js";
import Navbar from "../components/common/navbar/Navbar.jsx";

const RootLayout = () => {
    return (
        <>
            <ScrollTop />
            <Navbar />
            <main className="min-h-screen">
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default RootLayout;
