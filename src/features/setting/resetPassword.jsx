import { useState, useEffect, useRef } from "react";

// ── tiny icon helpers ──────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d={d} />
    </svg>
);
const LockIcon = (p) => (
    <Icon
        {...p}
        d="M12 17v-2m-6 4V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2zM9 7V5a3 3 0 0 1 6 0v2"
    />
);
const EyeIcon = (p) => (
    <Icon
        {...p}
        d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
    />
);
const EyeOffIcon = (p) => (
    <Icon
        {...p}
        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"
    />
);
const CheckIcon = (p) => <Icon {...p} d="M20 6L9 17l-5-5" />;
const ShieldIcon = (p) => <Icon {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const AlertIcon = (p) => (
    <Icon
        {...p}
        d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
    />
);
const RefreshIcon = (p) => (
    <Icon {...p} d="M23 4v6h-6M1 20v-6h6m15.35-4A9 9 0 0 0 3.85 9M.65 13a9 9 0 0 0 15.5 5.1" />
);
const ClockIcon = (p) => <Icon {...p} d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 5v5l4 2" />;

// ── password strength ──────────────────────────────────────────────────────────
function getStrength(v) {
    if (!v) return { score: 0, label: "", color: "" };
    let s = 0;
    if (v.length >= 8) s++;
    if (v.length >= 12) s++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
    if (/\d/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    const map = [
        { label: "", color: "#e5e7eb", pct: 0 },
        { label: "Weak", color: "#ef4444", pct: 20 },
        { label: "Fair", color: "#f97316", pct: 42 },
        { label: "Good", color: "#eab308", pct: 64 },
        { label: "Strong", color: "#22c55e", pct: 82 },
        { label: "Very strong", color: "#16a34a", pct: 100 },
    ];
    return { score: s, ...map[Math.min(s, 5)] };
}

// ── step indicator ─────────────────────────────────────────────────────────────
function StepDot({ state, num }) {
    const base =
        "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium transition-all duration-300 flex-shrink-0";
    if (state === "done")
        return (
            <div className={`${base} bg-[#0a0a0a] text-white`}>
                <CheckIcon size={12} />
            </div>
        );
    if (state === "active")
        return (
            <div className={`${base} border-[1.5px] border-[#0a0a0a] text-[#0a0a0a] bg-white`}>
                {num}
            </div>
        );
    return (
        <div className={`${base} border border-[#e5e7eb] text-[#9ca3af] bg-[#f9fafb]`}>{num}</div>
    );
}

// ── rule chip ──────────────────────────────────────────────────────────────────
function Rule({ ok, label }) {
    return (
        <div
            className={`flex items-center gap-1.5 text-[11px] transition-colors duration-200 ${ok ? "text-green-700" : "text-gray-400"}`}
        >
            {ok ? (
                <CheckIcon size={12} className="text-green-600" />
            ) : (
                <div className="w-3 h-3 rounded-full border border-current opacity-50" />
            )}
            {label}
        </div>
    );
}

// ── password input ─────────────────────────────────────────────────────────────
function PassInput({ id, placeholder, value, onChange, valid }) {
    const [show, setShow] = useState(false);
    return (
        <div
            className={`flex items-center border rounded-xl bg-white transition-all duration-200
      ${valid ? "border-green-400 ring-2 ring-green-50" : "border-gray-200 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-100"}`}
        >
            <input
                id={id}
                type={show ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete="off"
                className="flex-1 h-11 bg-transparent px-4 text-[14px] text-gray-900 outline-none placeholder:text-gray-300"
            />
            {valid && (
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-1 flex-shrink-0">
                    <CheckIcon size={11} className="text-green-700" />
                </div>
            )}
            <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-gray-600 transition-colors flex-shrink-0"
                aria-label="toggle visibility"
            >
                {show ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
            </button>
        </div>
    );
}

// ── toast ──────────────────────────────────────────────────────────────────────
function Toast({ visible, onClose }) {
    const barRef = useRef(null);
    useEffect(() => {
        if (visible && barRef.current) {
            barRef.current.style.transition = "none";
            barRef.current.style.transform = "scaleX(1)";
            void barRef.current.offsetWidth;
            barRef.current.style.transition = "transform 3.5s linear";
            barRef.current.style.transform = "scaleX(0)";
            const t = setTimeout(onClose, 3600);
            return () => clearTimeout(t);
        }
    }, [visible]);

    return (
        <div
            className={`absolute top-4 left-1/2 -translate-x-1/2 w-[320px] z-30 transition-all duration-400
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"}`}
            style={{ transitionTimingFunction: "cubic-bezier(.22,1,.36,1)" }}
        >
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="flex items-start gap-3 p-4">
                    <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                        <ShieldIcon size={18} className="text-green-700" />
                    </div>
                    <div className="flex-1 pt-0.5">
                        <p className="text-[13px] font-medium text-gray-900 mb-0.5">
                            Password updated
                        </p>
                        <p className="text-[12px] text-gray-500 leading-relaxed">
                            Your account is secured with the new password.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-300 hover:text-gray-500 transition-colors mt-0.5"
                        aria-label="dismiss"
                    >
                        <Icon size={14} d="M18 6L6 18M6 6l12 12" />
                    </button>
                </div>
                <div className="h-[3px] bg-green-50">
                    <div ref={barRef} className="h-full bg-green-500 origin-left" />
                </div>
            </div>
        </div>
    );
}

// ── success state ──────────────────────────────────────────────────────────────
function SuccessState({ onReset }) {
    return (
        <div className="flex flex-col items-center justify-center px-8 py-10 text-center animate-[fadeUp_0.45s_cubic-bezier(.22,1,.36,1)_forwards]">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-5 animate-[popIn_0.45s_cubic-bezier(.22,1,.36,1)_forwards]">
                <ShieldIcon size={26} className="text-green-700" />
            </div>
            <h3 className="text-[18px] font-medium text-gray-900 mb-2">You're all set</h3>
            <p className="text-[13px] text-gray-500 leading-relaxed max-w-[240px] mb-5">
                Your password has been changed. Use your new credentials next time you sign in.
            </p>
            <div className="flex items-center gap-2 w-full bg-gray-50 rounded-xl px-4 py-3 mb-5 text-[12px] text-gray-400">
                <ClockIcon size={14} className="flex-shrink-0" />
                <span>Changed just now — session stays active</span>
            </div>
            <button
                onClick={onReset}
                className="w-full h-10 border border-gray-200 rounded-xl text-[13px] text-gray-500
          hover:bg-gray-50 hover:text-gray-800 transition-all flex items-center justify-center gap-2"
            >
                <RefreshIcon size={13} />
                Change password again
            </button>
        </div>
    );
}

// ── main page ──────────────────────────────────────────────────────────────────
export default function PasswordResetPage() {
    const [form, setForm] = useState({ old: "", next: "", confirm: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [toast, setToast] = useState(false);

    const str = getStrength(form.next);
    const rules = {
        len: form.next.length >= 8,
        case: /[A-Z]/.test(form.next) && /[a-z]/.test(form.next),
        num: /\d/.test(form.next),
        sym: /[^A-Za-z0-9]/.test(form.next),
    };

    // step progress
    const step1Done = form.old.length > 0 && form.next.length >= 8;
    const step2Done = step1Done && form.confirm === form.next && form.confirm.length > 0;
    const s1 = step1Done ? "done" : "active";
    const s2 = step1Done ? (step2Done ? "done" : "active") : "idle";
    const s3 = step2Done ? "active" : "idle";

    function set(k) {
        return (e) => {
            setForm((f) => ({ ...f, [k]: e.target.value }));
            setError("");
        };
    }

    async function submit(e) {
        e.preventDefault();
        setError("");
        if (!form.old) return setError("Please enter your current password.");
        if (form.next.length < 8) return setError("New password must be at least 8 characters.");
        if (form.next !== form.confirm) return setError("Passwords do not match.");

        setLoading(true);
        await new Promise((r) => setTimeout(r, 1300));
        setLoading(false);
        setDone(true);
        setToast(true);
    }

    function resetAll() {
        setForm({ old: "", next: "", confirm: "" });
        setError("");
        setDone(false);
        setToast(false);
    }

    return (
        <>
            {/* keyframes injected once */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=DM+Mono:wght@400;500&display=swap');
        @keyframes popIn  { from { transform: scale(0.6); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes fadeUp { from { transform: translateY(10px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

            <div className="min-h-screen bg-[#f5f4f2] flex items-center justify-center p-4">
                <div className="w-full max-w-[440px] relative">
                    <Toast visible={toast} onClose={() => setToast(false)} />

                    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
                        {/* dark header */}
                        <div className="bg-[#0a0a0a] px-7 pt-7 pb-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
                                        <LockIcon size={14} className="text-[#0a0a0a]" />
                                    </div>
                                    <span className="text-[13px] font-medium text-white tracking-wide">
                                        Security
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-3 py-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                    <span className="text-[11px] text-gray-500">Encrypted</span>
                                </div>
                            </div>
                            <h1 className="text-[22px] font-medium text-white mb-1.5 leading-snug">
                                Reset your password
                            </h1>
                            <p className="text-[13px] text-gray-500 leading-relaxed">
                                Choose a strong, unique password to keep your account safe.
                            </p>
                        </div>

                        {/* body */}
                        <div className="px-7 py-6">
                            {done ? (
                                <SuccessState onReset={resetAll} />
                            ) : (
                                <form onSubmit={submit} noValidate>
                                    {/* step bar */}
                                    <div className="flex items-center gap-0 mb-6">
                                        <StepDot state={s1} num="1" />
                                        <div
                                            className={`flex-1 h-px transition-colors duration-300 ${step1Done ? "bg-[#0a0a0a]" : "bg-gray-200"}`}
                                        />
                                        <StepDot state={s2} num="2" />
                                        <div
                                            className={`flex-1 h-px transition-colors duration-300 ${step2Done ? "bg-[#0a0a0a]" : "bg-gray-200"}`}
                                        />
                                        <StepDot state={s3} num="3" />
                                    </div>

                                    {/* error */}
                                    {error && (
                                        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                                            <AlertIcon
                                                size={15}
                                                className="text-red-500 flex-shrink-0"
                                            />
                                            <span className="text-[13px] text-red-600">
                                                {error}
                                            </span>
                                        </div>
                                    )}

                                    {/* current password */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
                                                Current password
                                            </label>
                                            <button
                                                type="button"
                                                className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                Forgot?
                                            </button>
                                        </div>
                                        <PassInput
                                            id="f-old"
                                            placeholder="Enter current password"
                                            value={form.old}
                                            onChange={set("old")}
                                            valid={form.old.length > 0}
                                        />
                                    </div>

                                    {/* new password */}
                                    <div className="mb-4">
                                        <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-1.5">
                                            New password
                                        </label>
                                        <PassInput
                                            id="f-new"
                                            placeholder="Min. 8 characters"
                                            value={form.next}
                                            onChange={set("next")}
                                            valid={str.score >= 3}
                                        />
                                        {/* strength bar */}
                                        {form.next && (
                                            <div className="mt-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-[3px] bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-500"
                                                            style={{
                                                                width: `${str.pct}%`,
                                                                background: str.color,
                                                            }}
                                                        />
                                                    </div>
                                                    <span
                                                        className="text-[11px] font-medium min-w-[60px] text-right"
                                                        style={{ color: str.color }}
                                                    >
                                                        {str.label}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
                                                    <Rule ok={rules.len} label="8+ characters" />
                                                    <Rule ok={rules.case} label="Upper & lower" />
                                                    <Rule ok={rules.num} label="Number" />
                                                    <Rule ok={rules.sym} label="Symbol" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* confirm */}
                                    <div className="mb-6">
                                        <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-1.5">
                                            Confirm password
                                        </label>
                                        <PassInput
                                            id="f-conf"
                                            placeholder="Repeat new password"
                                            value={form.confirm}
                                            onChange={set("confirm")}
                                            valid={
                                                form.confirm.length > 0 &&
                                                form.confirm === form.next
                                            }
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-11 bg-[#0a0a0a] text-white text-[14px] font-medium rounded-xl
                      flex items-center justify-center gap-2 transition-opacity disabled:opacity-40
                      hover:opacity-80 active:scale-[0.99]"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Updating…
                                            </>
                                        ) : (
                                            <>
                                                <LockIcon size={15} />
                                                Update password
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* subtle caption */}
                    <p className="text-center text-[12px] text-gray-400 mt-4">
                        Your password is encrypted end-to-end and never stored in plain text.
                    </p>
                </div>
            </div>
        </>
    );
}
