import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import loginImage from "@/assets/loginBg.png";
import { showError, showSuccess } from "@/shared/utils/toast.js";

const AuthSuccess = () => {
    const { User, Loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
    console.log("user : ", User)
    
    if (Loading) return; // ✅ wait until loading is done
    
    if (User) {
        showSuccess("User successfully logged in");
        navigate("/");
    } else {
        navigate("/auth/login");
    }
}, [User, Loading, navigate]);

    return (
        <div className="min-h-screen bg-[#F8F8FF] flex items-center justify-center px-4">
            <div className="absolute w-150 h-150 bg-[#2563EB]/20 rounded-full blur-[120px] -top-32 -left-32" />
            <div className="absolute w-125 h-125 bg-[#C2410C]/20 rounded-full blur-[120px] bottom-0 right-0" />

            <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="p-8 sm:p-12 flex flex-col justify-center align-middle items-center">
                    <h3>Logging you in...</h3>
                </div>

                {/* RIGHT - VISUAL */}
                <div className="hidden lg:flex relative bg-linear-to-br from-[#2563EB]/10 to-[#C2410C]/10 items-center justify-center">
                    <div className="absolute w-96 h-90 bg-[#2563EB]/20 rounded-full blur-3xl right-10" />
                    <div className="absolute w-72 h-72 bg-[#C2410C]/20 rounded-full blur-3xl left-10" />

                    <img src={loginImage} alt="auction" className="relative z-10 bg-cover w-full" />
                </div>
            </div>
        </div>
    );
};

export default AuthSuccess;
