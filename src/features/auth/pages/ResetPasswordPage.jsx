import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { showError, showSuccess } from "../../../shared/utils/toast.js";
import { restPassword } from "../authAPI.js";

export default function ResetForgotPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const email = location.state?.email;

    const validateForm = () => {
        const newErrors = {};

        if (!form.password.trim()) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (!form.confirmPassword.trim()) {
            newErrors.confirmPassword = "Please re-enter your password";
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

        setErrors({
            ...errors,
            [e.target.name]: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);
            console.log({ email, form });

            const res = await restPassword(email, form.confirmPassword);

            if (res?.success) {
                showSuccess(res.data?.message || "Password reset successful");

                navigate("/auth/login");
            } else {
                throw new Error(res.data?.message || "Failed to reset password");
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
            <div className="absolute w-[500px] h-[500px] bg-[#2563EB]/20 rounded-full blur-[120px] -top-24 -left-24" />

            <div className="absolute w-[400px] h-[400px] bg-[#C2410C]/20 rounded-full blur-[120px] bottom-0 right-0" />

            {/* Card */}
            <div className="w-full max-w-md relative z-20 bg-white rounded-3xl shadow-xl p-8 sm:p-10">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Reset Password</h1>

                    <p className="text-[#6B7280] text-sm">Create a new secure password</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-[#374151] mb-2">
                            New Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter new password"
                            value={form.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 transition
                                
                                ${
                                    errors.password
                                        ? "focus:ring-red-500 border border-red-400"
                                        : "focus:ring-[#2563EB]"
                                }
                            `}
                        />

                        {errors.password && (
                            <p className="text-red-500 text-sm mt-2">{errors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-[#374151] mb-2">
                            Re-enter Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Re-enter password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 transition
                                
                                ${
                                    errors.confirmPassword
                                        ? "focus:ring-red-500 border border-red-400"
                                        : "focus:ring-[#2563EB]"
                                }
                            `}
                        />

                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl cursor-pointer bg-[#C2410C] text-white font-semibold hover:opacity-90 transition disabled:opacity-70"
                    >
                        {loading ? "Resetting Password..." : "Reset Password"}
                    </button>
                </form>

                {/* Back */}
                <div className="mt-6 text-center">
                    <Link to="/auth/login" className="text-sm text-[#2563EB] hover:underline">
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}
