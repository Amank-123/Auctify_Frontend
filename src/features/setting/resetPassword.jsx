import { useEffect, useState } from "react";
import { Eye, EyeOff, Moon, Sun, Laptop, Volume2, Lock } from "lucide-react";
import { api } from "@/shared/services/axios";

function PasswordInput({ label, name, value, visible, onToggle, onChange }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {label}
            </label>

            <div className="relative">
                <input
                    type={visible ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    autoComplete="off"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 pr-11 text-sm text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-400"
                />

                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                    {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const [form, setForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [show, setShow] = useState({
        old: false,
        next: false,
        confirm: false,
    });

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const [sound, setSound] = useState(localStorage.getItem("notifySound") || "classic");

    useEffect(() => {
        const root = document.documentElement;

        root.classList.remove("dark");

        if (theme === "dark") {
            root.classList.add("dark");
        }

        if (theme === "system") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

            if (prefersDark) {
                root.classList.add("dark");
            }
        }

        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem("notifySound", sound);
    }, [sound]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const toggle = (key) => {
        setShow({
            ...show,
            [key]: !show[key],
        });
    };

    const playPreview = () => {
        const audio = new Audio(`/sounds/${sound}.mp3`);

        audio.volume = 0.6;

        audio.play().catch(() => {});
    };

    const submit = async (e) => {
        e.preventDefault();

        setMsg("");

        if (form.newPassword !== form.confirmPassword) {
            setMsg("Passwords do not match");
            return;
        }

        if (form.newPassword.length < 8) {
            setMsg("Password must be at least 8 characters");
            return;
        }

        try {
            setLoading(true);

            await api.post("/api/user/resetPassword", {
                oldPassword: form.oldPassword,
                newPassword: form.newPassword,
            });

            setMsg("Password updated successfully");

            setForm({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            setMsg(error?.response?.data?.message || "Unable to update password");
        } finally {
            setLoading(false);
        }
    };

    const ThemeButton = ({ active, icon, title, onClick }) => (
        <button
            type="button"
            onClick={onClick}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                active
                    ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            }`}
        >
            {icon}
            {title}
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10 transition dark:bg-slate-950">
            <div className="mx-auto max-w-2xl space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
                        Settings
                    </h1>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Manage security, theme and notifications.
                    </p>
                </div>

                {/* Password */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-5 flex items-center gap-2">
                        <Lock size={18} />

                        <h2 className="font-semibold text-slate-900 dark:text-white">
                            Change Password
                        </h2>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <PasswordInput
                            label="Current Password"
                            name="oldPassword"
                            value={form.oldPassword}
                            visible={show.old}
                            onToggle={() => toggle("old")}
                            onChange={handleChange}
                        />

                        <PasswordInput
                            label="New Password"
                            name="newPassword"
                            value={form.newPassword}
                            visible={show.next}
                            onToggle={() => toggle("next")}
                            onChange={handleChange}
                        />

                        <PasswordInput
                            label="Confirm Password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            visible={show.confirm}
                            onToggle={() => toggle("confirm")}
                            onChange={handleChange}
                        />

                        {msg && <p className="text-sm text-slate-600 dark:text-slate-300">{msg}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="h-11 w-full rounded-xl bg-slate-900 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </div>

                {/* Theme */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="mb-4 font-semibold text-slate-900 dark:text-white">Theme</h2>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <ThemeButton
                            active={theme === "light"}
                            title="Light"
                            icon={<Sun size={16} />}
                            onClick={() => setTheme("light")}
                        />

                        <ThemeButton
                            active={theme === "dark"}
                            title="Dark"
                            icon={<Moon size={16} />}
                            onClick={() => setTheme("dark")}
                        />

                        <ThemeButton
                            active={theme === "system"}
                            title="System"
                            icon={<Laptop size={16} />}
                            onClick={() => setTheme("system")}
                        />
                    </div>
                </div>

                {/* Sound */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-4 flex items-center gap-2">
                        <Volume2 size={18} />

                        <h2 className="font-semibold text-slate-900 dark:text-white">
                            Notification Sound
                        </h2>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <select
                            value={sound}
                            onChange={(e) => setSound(e.target.value)}
                            className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        >
                            <option value="classic">Classic</option>
                            <option value="soft">Soft</option>
                            <option value="ping">Ping</option>
                            <option value="digital">Digital</option>
                        </select>

                        <button
                            type="button"
                            onClick={playPreview}
                            className="h-11 rounded-xl bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                        >
                            Preview
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
