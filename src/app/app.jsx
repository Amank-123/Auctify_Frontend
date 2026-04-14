import { RouterProvider } from "react-router-dom";
import router from "../routes/router.jsx";
import { AuthProvider } from "../context/authContext.jsx";

export const App = () => {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
};
export default App;
