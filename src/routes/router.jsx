import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/MainLayout.jsx";
import NotFound from "../components/common/notFound.jsx";
import PrivacyPolicy from "../features/home/pages/PrivacyPolicy.jsx";
import Terms from "../features/home/pages/TermsAndConditions.jsx";
import HomePage from "../features/home/pages/homePage.jsx";
const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "privacy", element: <PrivacyPolicy /> },
            { path: "terms", element: <Terms /> },
        ],
    },
]);

export default router;
