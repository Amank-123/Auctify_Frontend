import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/MainLayout.jsx";
import NotFound from "../components/common/notFound.jsx";
import Homepage from "../features/home/pages/homePage.jsx";
const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <NotFound />,
        children: [{ index: true, element: <Homepage /> }],
    },
]);

export default router;
