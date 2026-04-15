import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "@/shared/services/axios.js";
import { showError, showSuccess } from "@/shared/utils/toast.js";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints.js";

export default function OtpPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // 📧 get email from previous page
    const email = location.state?.email;

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputsRef = useRef([]);

    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30);

    // ⏱️ countdown timer
    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    // 🔢 handle input
    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    // ⌫ backspace
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    // 🚀 verify OTP
    const handleVerify = async () => {
        const finalOtp = otp.join("");

        if (finalOtp.length !== 6) {
            showError("Enter complete OTP");
            return;
        }

        try {
            setLoading(true);
            console.log(email, finalOtp);
            await verifyOtp(email, finalOtp);
            showSuccess("Account verified 🎉");
            navigate("/auth/success");
        } catch (err) {
            showError(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    // 🔁 resend OTP
    const handleResend = async () => {
        try {
            await api.post(API_ENDPOINTS.Otp.RESEND, { email });
            showSuccess("OTP sent again");

            setTimer(30);
        } catch (err) {
            showError("Failed to resend OTP");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-semibold mb-2">Verify OTP</h2>
                <p className="text-gray-500 mb-6 text-sm">
                    Enter the 6-digit code sent to your email
                </p>

                {/* OTP Inputs */}
                <div className="flex justify-between mb-6 gap-2">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={digit}
                            ref={(el) => (inputsRef.current[index] = el)}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-12 h-12 border rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    ))}
                </div>

                {/* Verify Button */}
                <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition"
                >
                    {loading ? "Verifying..." : "Verify"}
                </button>

                {/* Resend */}
                <div className="mt-4 text-sm">
                    {timer > 0 ? (
                        <p className="text-gray-400">Resend OTP in {timer}s</p>
                    ) : (
                        <button onClick={handleResend} className="text-orange-600 font-medium">
                            Resend OTP
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
