import { RouterProvider } from "react-router-dom";
import router from "../routes/router.js";
import { AuthProvider } from "../context/authContext.jsx";

export const App = () => {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
};
export default App;
