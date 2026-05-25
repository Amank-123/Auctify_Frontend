import { Outlet } from "react-router-dom";
import Footer from "../components/common/footer.jsx";
import ScrollTop from "../components/common/scrollTop.js";
import Navbar from "../components/common/navbar/Navbar.jsx";
import ChatbotWidget from "../features/ChatAgent/ChatbotWidget.jsx";

const RootLayout = () => {
    return (
        <>
            <ScrollTop />
            <Navbar />
            <main className="min-h-screen">
                <Outlet />
                <ChatbotWidget />
            </main>
            <Footer />
        </>
    );
};

export default RootLayout;
