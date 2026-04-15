import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/layouts/MainLayout.jsx";
import NotFound from "@/components/common/notFound.jsx";
import PrivacyPolicy from "@/features/home/pages/PrivacyPolicy.jsx";
import Terms from "@/features/home/pages/TermsAndConditions.jsx";
import Homepage from "@/features/home/pages/homePage.jsx";
import LoginPage from "@/features/auth/pages/loginPage.jsx";
import SignUpPage from "@/features/auth/pages/registrationPage.jsx";
import AuthLayout from "@/layouts/AuthLayout.jsx";
 import OtpPage from "@/features/auth/pages/otpPage.jsx";
 import AuthSuccess from "@/features/auth/pages/AuthSuccess.jsx" 
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
            { path: "register", element: <SignUpPage /> },
            { path: "otp", element: <OtpPage /> },
            {path:"success", element :<AuthSuccess/>}
        ],
    },
]);

export default router;
