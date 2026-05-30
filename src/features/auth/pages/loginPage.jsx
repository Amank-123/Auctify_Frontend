import { useRef, useState } from "react";
import { useAuth } from "../../../hooks/useAuth.js";
import { Link, useNavigate } from "react-router-dom";
import loginImage from "../../../assets/loginBg.png";
import logo from "../../../assets/logo.png";
import { motion } from "motion/react";
import { showError, showSuccess } from "../../../shared/utils/toast.js";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const slogans = [
        "Bid smarter",
        "Win faster",
        "Real-time auctions",
        "No fake listings",
        "Secure deals only",
        "Zero friction bidding",
    ];

    const bubbleDataRef = useRef(
        slogans.map(() => ({
            x: Math.random() * 500 - 250,
            y: Math.random() * 300 - 150,
            driftX: Math.random() * 100 - 50,
            driftY: -(80 + Math.random() * 40),
            duration: 8 + Math.random() * 6,
            delay: Math.random() * 4,
        })),
    );
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await login(form);

            if (res.data?.success) {
                navigate("/auth/success");
                showSuccess(res.data?.message || "User logged in successfully");
            } else {
                throw new Error(res.data?.message || "Login failed");
            }
        } catch (err) {
            if (err.response?.data?.message === "EMAIL_NOT_VERIFIED") {
                navigate("/auth/otp", {
                    state: {
                        email: form.email,
                        newUser: false,
                    },
                });
            } else {
                showError(err?.response?.data?.message || "An error occurred during login");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`;
    };

    return (
        <div className="h-full bg-[#F8F8FF] px-4 py-4 lg:py-6 flex items-center">
            {/* Background Blobs */}
            <div className="pointer-events-none absolute top-0 left-0 h-[280px] w-[280px] sm:h-[450px] sm:w-[450px] bg-[#2563EB]/15 rounded-full blur-[120px]" />

            <div className="pointer-events-none absolute bottom-0 right-0 h-[280px] w-[280px] sm:h-[400px] sm:w-[400px] bg-[#C2410C]/15 rounded-full blur-[120px]" />

            <div
                className="
                relative z-20
                mx-auto
                w-full
                max-w-6xl

                overflow-hidden

                rounded-[28px]

                border border-slate-200/70

                bg-white/90
                backdrop-blur-xl

                shadow-[0_20px_60px_rgba(15,23,42,0.08)]

                grid
                lg:grid-cols-2
            "
            >
                {/* LEFT SIDE */}
                <div
                    className="
                    flex flex-col justify-center

                    p-5
                    sm:p-7
                    md:p-8
                    lg:p-10
                "
                >
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] mb-2">
                        Welcome back
                    </h1>

                    <p className="text-sm text-[#6B7280] mb-6">
                        Enter your credentials to continue
                    </p>

                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        className="
                        w-full
                        flex items-center justify-center gap-3

                        rounded-xl
                        border border-slate-200

                        bg-white

                        py-3
                        px-4

                        hover:bg-slate-50

                        transition-all
                        cursor-pointer
                    "
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="google"
                            className="w-5 h-5"
                        />

                        <span className="text-sm font-medium text-slate-700">
                            Continue with Google
                        </span>
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="h-px flex-1 bg-slate-200" />
                        <span className="text-xs font-medium text-slate-500">OR</span>
                        <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="
                            w-full
                            rounded-xl

                            border border-slate-200
                            bg-white

                            px-4 py-3

                            text-sm

                            focus:outline-none
                            focus:ring-4
                            focus:ring-[#2563EB]/10
                            focus:border-[#2563EB]

                            transition-all
                        "
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="
                            w-full
                            rounded-xl

                            border border-slate-200
                            bg-white

                            px-4 py-3

                            text-sm

                            focus:outline-none
                            focus:ring-4
                            focus:ring-[#2563EB]/10
                            focus:border-[#2563EB]

                            transition-all
                        "
                        />

                        <div className="text-right">
                            <Link
                                to="/auth/forgot-password"
                                className="text-sm text-[#2563EB] hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                            w-full

                            rounded-xl

                            bg-[#C2410C]

                            py-3

                            text-white
                            font-semibold

                            shadow-sm

                            hover:bg-[#9A3412]

                            transition-all
                            cursor-pointer
                        "
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <p className="mt-5 text-center text-sm text-[#6B7280]">
                        Don't have an account?{" "}
                        <Link to="/auth/register" className="font-semibold text-[#2563EB]">
                            Sign up
                        </Link>
                    </p>
                </div>

                {/* RIGHT SIDE */}
                <div
                    className="
                    hidden lg:flex

                    relative
                    overflow-hidden

                    items-center
                    justify-center

                    min-h-[580px]
                    xl:min-h-[620px]

                    bg-gradient-to-br
                    from-[#F8FAFF]
                    via-white
                    to-[#EEF4FF]
                "
                >
                    <motion.div
                        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="
                        absolute
                        top-10 right-10

                        h-72 w-72

                        rounded-full
                        bg-[#2563EB]/15
                        blur-3xl
                    "
                    />

                    <motion.div
                        animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="
                        absolute
                        bottom-10 left-10

                        h-72 w-72

                        rounded-full
                        bg-[#C2410C]/15
                        blur-3xl
                    "
                    />

                    {slogans.map((text, i) => {
                        const b = bubbleDataRef.current[i];

                        return (
                            <motion.div
                                key={i}
                                initial={{
                                    x: b.x,
                                    y: b.y,
                                    opacity: 0,
                                }}
                                animate={{
                                    x: b.x + b.driftX,
                                    y: b.y + b.driftY,
                                    opacity: 0.8,
                                }}
                                transition={{
                                    duration: b.duration,
                                    delay: b.delay,
                                    ease: "easeOut",
                                    repeat: Infinity,
                                }}
                                className="
                                absolute
                                z-20

                                rounded-full

                                bg-white/70
                                backdrop-blur-md

                                px-3 py-1.5

                                text-xs
                                text-slate-700

                                shadow-md
                                whitespace-nowrap
                            "
                            >
                                {text}
                            </motion.div>
                        );
                    })}

                    <motion.img
                        src={loginImage}
                        alt="auction"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="
                        relative z-30

                        w-[280px]
                        xl:w-[360px]
                        2xl:w-[420px]

                        max-w-full
                    "
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="absolute bottom-10 left-10 z-30"
                    >
                        <h2 className="text-xl font-semibold text-[#1F2937]">Bid. Win. Repeat.</h2>

                        <p className="mt-2 text-sm text-[#6B7280]">
                            Real-time auctions. No friction.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
