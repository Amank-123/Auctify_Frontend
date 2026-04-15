import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImage from "@/assets/loginBg.png";
import logo from "@/assets/logo.png";

import { showError, showSuccess } from "@/shared/utils/toast.js";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            showError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const { confirmPassword, ...payload } = form;

            await register(payload);

            navigate("/auth/otp", {
                state: { email: form.email },
            });
        } catch (err) {
            showError(err.customMessage || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`;
    };

    return (
        <div className="min-h-screen bg-[#F8F8FF] flex items-center justify-center px-4">
            <div className="absolute w-[600px] h-[600px] bg-[#2563EB]/20 rounded-full blur-[120px] -top-32 -left-32" />
            <div className="absolute w-[500px] h-[500px] bg-[#C2410C]/20 rounded-full blur-[120px] bottom-0 right-0" />

            <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* LEFT - FORM */}
                <div className="p-8 sm:p-12 flex flex-col justify-center">
                    <img src={logo} alt="auctify" className="w-45 pb-4" />
                    <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Create account</h1>
                    <p className="text-[#6B7280] mb-6">Start bidding and winning today</p>

                    {/* GOOGLE LOGIN */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 border cursor-pointer border-[#E5E7EB] py-3 rounded-xl hover:bg-gray-50 transition"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="google"
                            className="w-5 h-5"
                        />
                        <span className="text-sm font-medium">Continue with Google</span>
                    </button>

                    {/* DIVIDER */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-[#E5E7EB]" />
                        <span className="text-xs text-[#6B7280]">OR</span>
                        <div className="flex-1 h-px bg-[#E5E7EB]" />
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username - required by backend */}
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition"
                        />

                        {/* Name Row - optional in backend */}
                        <div className="flex gap-3">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First name (optional)"
                                value={form.firstName}
                                onChange={handleChange}
                                className="w-1/2 px-4 py-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition"
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last name (optional)"
                                value={form.lastName}
                                onChange={handleChange}
                                className="w-1/2 px-4 py-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition"
                            />
                        </div>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition"
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition"
                        />

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition"
                        />

                        <div className="flex items-start gap-2 pt-1">
                            <input
                                type="checkbox"
                                id="terms"
                                required
                                className="mt-1 accent-[#C2410C]"
                            />
                            <label htmlFor="terms" className="text-sm text-[#6B7280]">
                                I agree to the{" "}
                                <Link to="/terms" className="text-[#2563EB] hover:underline">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link to="/privacy" className="text-[#2563EB] hover:underline">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl cursor-pointer bg-[#C2410C] text-white font-semibold hover:opacity-90 transition"
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="text-sm text-center mt-6 text-[#6B7280]">
                        Already have an account?{" "}
                        <Link to="/auth/login" className="text-[#2563EB] font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* RIGHT - VISUAL */}
                <div className="hidden lg:flex relative bg-linear-to-br from-[#2563EB]/10 to-[#C2410C]/10 items-center justify-center">
                    <div className="absolute w-96 h-96 bg-[#2563EB]/20 rounded-full blur-3xl right-10" />
                    <div className="absolute w-72 h-72 bg-[#C2410C]/20 rounded-full blur-3xl left-10" />
                    <img src={loginImage} alt="auction" className="relative z-10 bg-cover w-full" />
                </div>
            </div>
        </div>
    );
}
