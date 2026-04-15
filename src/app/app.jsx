import { RouterProvider } from "react-router-dom";
import router from "../routes/router.jsx";
import { AuthProvider } from "../context/authContext.jsx";
import { Toaster } from "react-hot-toast";

export const App = () => {
    return (
        <>
            <Toaster
                position="bottom-right"
                gutter={12}
                containerClassName="mb-6"
                toastOptions={{
                    duration: 5000,

                    className:
                        "w-[360px] max-w-[90vw] bg-white text-[#1F2937] px-5 py-4 rounded-2xl shadow-xl border border-[#E5E7EB] flex items-start gap-4",

                    success: {
                        className:
                            "w-[360px] max-w-[90vw] bg-white border-l-[6px] border-[#2563EB] text-[#1F2937] px-5 py-4 rounded-2xl shadow-xl flex items-start gap-4",
                    },

                    error: {
                        className:
                            "w-[360px] max-w-[90vw] bg-white border-l-[6px] border-[#C2410C] text-[#1F2937] px-5 py-4 rounded-2xl shadow-xl flex items-start gap-4",
                    },
                }}
            />
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </>
    );
};
export default App;
