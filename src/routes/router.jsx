import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/MainLayout.jsx";
import NotFound from "../components/common/notFound.jsx";
import PrivacyPolicy from "../features/policies/PrivacyPolicy.jsx";
import Terms from "../features/policies/TermsAndConditions.jsx";
import Homepage from "../features/home/pages/homePage.jsx";
import LoginPage from "../features/auth/pages/loginPage.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Homepage /> },
            { path: "privacy", element: <PrivacyPolicy /> },
            { path: "terms", element: <Terms /> },
        ],
    },
    {
        path: "/auth",
        element: <AuthLayout />,
        errorElement: <NotFound />,
        children: [
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <LoginPage /> },
        ],
    },
]);

export default router;
