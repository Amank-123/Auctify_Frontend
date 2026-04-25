import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/layouts/MainLayout.jsx";
import NotFound from "@/components/common/notFound.jsx";
import PrivacyPolicy from "@/features/home/pages/PrivacyPolicy.jsx";
import Terms from "@/features/home/pages/TermsAndConditions.jsx";
import Cookies from "@/features/home/pages/Cookies.jsx";
import HelpCenter from "@/features/home/pages/HelpCenter.jsx";
import Contact from "@/features/home/pages/ContactPage.jsx";
import Homepage from "@/features/home/pages/homePage.jsx";
import LoginPage from "@/features/auth/pages/loginPage.jsx";
import SignUpPage from "@/features/auth/pages/registrationPage.jsx";
import AuthLayout from "@/layouts/AuthLayout.jsx";
import OtpPage from "@/features/auth/pages/otpPage.jsx";
import AuthSuccess from "@/features/auth/pages/AuthSuccess.jsx";
import CreateAuction from "@/features/auction/pages/CreateAuction.jsx";
import SellerDashboard from "../features/auction/pages/SellerDashboard.jsx";
import ProtectRoute from "../components/auth/ProtectRoute";
import Profile from "../features/user/pages/userProfile";
import AuctionItem from "../components/common/navbar/AuctionItem";
import BidItem from "../components/common/navbar/BidItem";
import UserSidebar from "../components/common/navbar/UserSidebar";
import Watchlist from "../components/common/watchlist.jsx";
import AllAuctions from "../components/common/explore.jsx";
import CategoryPage from "../components/common/categories.jsx";
import AuctionDetails from "../features/auction/pages/AuctionDetails.jsx";
import CategoriesPage from "../components/common/categoriesPage.jsx";
import GuidePage from "../components/common/HowItWork.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Homepage /> },
            { path: "privacy", element: <PrivacyPolicy /> },
            { path: "terms", element: <Terms /> },
            { path: "cookies", element: <Cookies /> },
            { path: "support", element: <HelpCenter /> },
            { path: "contact", element: <Contact /> },
            {
                element: <ProtectRoute />,
                children: [{ path: "profile", element: <Profile /> }],
            },
            { path: "explore", element: <AllAuctions /> },
            { path: "how-it-works", element: <GuidePage /> },
            { path: "category/:category", element: <CategoryPage /> },
            { path: "category", element: <CategoriesPage /> },
            { path: "watchlist", element: <Watchlist /> },
        ],
    },
    {
        path: "/auth",
        element: <AuthLayout />,
        // errorElement: <NotFound />,
        children: [
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <SignUpPage /> },
            { path: "otp", element: <OtpPage /> },
            { path: "success", element: <AuthSuccess /> },
        ],
    },
    {
        path: "/auction",
        element: <RootLayout />,
        // errorElement: <NotFound />,
        children: [
            { path: ":id", element: <AuctionDetails /> },
            {
                element: <ProtectRoute />,
                children: [
                    { path: "create", element: <CreateAuction /> },
                    { path: "sell", element: <SellerDashboard /> },
                ],
            },
        ],
    },
    {
        path: "/user",
        element: <ProtectRoute />,
        errorElement: <NotFound />,
        children: [
            {
                element: <UserSidebar />,
                children: [
                    { path: "auctions", element: <AuctionItem /> },
                    { path: "bids", element: <BidItem /> },
                    // { path: "watchlist", element: <Watchlist /> },
                    // { path: "notifications", element: <Notifications /> },
                    // { path: "settings", element: <AccountSettings /> },
                    // { path: "activity", element: <AccountActivity /> },
                ],
            },
        ],
    },
]);

export default router;
