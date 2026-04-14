import { createBrowserRouter } from "react-router-dom";
import Footer from "../components/common/footer.jsx";
import RootLayout from "../layouts/MainLayout.jsx";
import NotFound from "../components/common/notFound.jsx";
import PrivacyPolicy from "../features/policies/PrivacyPolicy.jsx";
import Terms from "../features/policies/TermsAndConditions.jsx"
const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Footer /> },
            { path: "privacy", element: <PrivacyPolicy /> },
            { path: "terms", element: <Terms /> },
        ],
    },
]);

export default router;
