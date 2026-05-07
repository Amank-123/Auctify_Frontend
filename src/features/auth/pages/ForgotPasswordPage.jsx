import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import loginImage from "../../../assets/loginBg.png";
import { showError, showSuccess } from "../../../shared/utils/toast.js";
import { api } from "../../../shared/services/axios.js";
import { API_ENDPOINTS } from "../../../shared/constants/apiEndpoints.js";
import { forgotPassword } from "../authAPI.js";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await forgotPassword(email);
            if (res?.success) {
                navigate("/auth/forgot-password/otp", { state: { email: email } });
                showSuccess(res.data?.message || "Password reset OTP sent successfully");
            } else {
                throw new Error(res.data?.message || "Failed to send OTP");
            }
        } catch (err) {
            showError(err?.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F8FF] flex items-center justify-center px-4">
            {/* Background Blur */}
            <div className="absolute w-[600px] h-[600px] bg-[#2563EB]/20 rounded-full blur-[120px] -top-32 -left-32" />
            <div className="absolute w-[500px] h-[500px] bg-[#C2410C]/20 rounded-full blur-[120px] bottom-0 right-0" />

            <div className="w-full max-w-6xl z-30 grid lg:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* LEFT */}
                <div className="p-8 sm:p-12 flex flex-col justify-center">
                    <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Forgot Password</h1>

                    <p className="text-[#6B7280] mb-8">
                        Enter your email and we'll send you a reset OTP
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl cursor-pointer bg-[#C2410C] text-white font-semibold hover:opacity-90 transition disabled:opacity-70"
                        >
                            {loading ? "Sending OTP..." : "Send Reset OTP"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/auth/login" className="text-sm text-[#2563EB] hover:underline">
                            Back to login
                        </Link>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="hidden lg:flex relative overflow-hidden items-center justify-center">
                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/10 via-white to-[#C2410C]/10" />

                    {/* Floating Blur */}
                    <motion.div
                        animate={{
                            y: [0, -30, 0],
                            x: [0, 20, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute w-80 h-80 bg-[#2563EB]/20 rounded-full blur-3xl top-10 right-10"
                    />

                    <motion.div
                        animate={{
                            y: [0, 30, 0],
                            x: [0, -20, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute w-72 h-72 bg-[#C2410C]/20 rounded-full blur-3xl bottom-10 left-10"
                    />

                    {/* Main Image */}
                    <motion.img
                        src={loginImage}
                        alt="forgot-password"
                        initial={{
                            opacity: 0,
                            scale: 0.9,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            duration: 0.6,
                        }}
                        className="relative z-30 w-[420px]"
                    />

                    {/* Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="absolute bottom-10 left-10"
                    >
                        <h2 className="text-xl font-semibold text-[#1F2937]">Secure Recovery</h2>

                        <p className="text-sm text-[#6B7280]">
                            Fast verification. Protected access.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
