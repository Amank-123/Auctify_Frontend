import { createBrowserRouter } from 'react-router-dom';
import Footer from '../components/common/footer.jsx';
import RootLayout from '../layouts/MainLayout.jsx';
import NotFound from '../components/common/notFound.jsx';
const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <NotFound />,
        children: [{ index: true, element: <Footer /> }],
    },
]);

export default router;
