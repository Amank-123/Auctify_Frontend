import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "@/shared/services/axios.js";
import { showError, showSuccess } from "@/shared/utils/toast.js";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints.js";
import { useAuth } from "../../../hooks/useAuth.js";

export default function OtpPage() {
    const { verifyOtp } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;
    const newUser = location.state?.newUser;

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputsRef = useRef([]);

    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30);

    // Redirect if page opened without email
    useEffect(() => {
        if (!email) {
            navigate("/auth/login", { replace: true });
        }
    }, [email, navigate]);

    // Focus first input
    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    // Countdown timer
    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    // Paste support
    const handlePaste = (e) => {
        e.preventDefault();

        const pastedData = e.clipboardData.getData("text").trim().replace(/\D/g, "").slice(0, 6);

        if (!pastedData) return;

        const newOtp = [...otp];

        pastedData.split("").forEach((digit, index) => {
            if (index < 6) {
                newOtp[index] = digit;
            }
        });

        setOtp(newOtp);

        const nextIndex = Math.min(pastedData.length, 5);
        inputsRef.current[nextIndex]?.focus();
    };

    const handleVerify = async (e) => {
        e.preventDefault();

        const finalOtp = otp.join("").trim();

        if (finalOtp.length !== 6) {
            showError("Enter complete OTP");
            return;
        }

        try {
            setLoading(true);

            const res = await verifyOtp(email, finalOtp);

            if (res?.data?.success) {
                showSuccess("Account verified successfully");

                if (newUser) {
                    navigate("/auth/success", {
                        replace: true,
                    });
                } else {
                    showSuccess("Please login again");

                    navigate("/auth/login", {
                        replace: true,
                    });
                }
            } else {
                throw new Error(res?.data?.message || "Invalid OTP");
            }
        } catch (err) {
            showError(err?.response?.data?.message || err?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            setLoading(true);

            await api.post(API_ENDPOINTS.Otp.RESEND, {
                email,
            });

            setOtp(["", "", "", "", "", ""]);
            setTimer(30);

            inputsRef.current[0]?.focus();

            showSuccess("OTP sent again");
        } catch (err) {
            showError(err?.response?.data?.message || "Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F8FF] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
                    <h2 className="text-2xl font-semibold text-[#1F2937] mb-2 text-center">
                        Verify OTP
                    </h2>

                    <p className="text-sm text-gray-500 mb-2 text-center">
                        Enter the 6-digit code sent to
                    </p>

                    <p className="text-sm font-medium text-[#2563EB] mb-6 text-center break-all">
                        {email}
                    </p>

                    <form onSubmit={handleVerify}>
                        <div className="flex justify-center gap-2 sm:gap-3 mb-6">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    required
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    ref={(el) => (inputsRef.current[index] = el)}
                                    onChange={(e) => handleChange(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={handlePaste}
                                    className="
                                        w-10 h-12
                                        sm:w-12 sm:h-14

                                        border
                                        border-slate-300

                                        rounded-xl

                                        text-center
                                        text-lg
                                        font-semibold

                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-[#C2410C]
                                        focus:border-[#C2410C]

                                        transition
                                    "
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full

                                bg-[#C2410C]
                                text-white

                                py-3

                                rounded-xl

                                font-semibold

                                hover:bg-[#9A3412]

                                transition
                                cursor-pointer

                                disabled:opacity-60
                                disabled:cursor-not-allowed
                            "
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>

                    <div className="mt-5 text-center">
                        {timer > 0 ? (
                            <p className="text-sm text-gray-400">Resend OTP in {timer}s</p>
                        ) : (
                            <button
                                onClick={handleResend}
                                disabled={loading}
                                className="
                                    text-[#C2410C]
                                    font-medium

                                    hover:underline

                                    disabled:opacity-50
                                "
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
