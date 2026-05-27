import { useState, useEffect, useRef } from "react";

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
const GavelIcon = (p) => <Icon {...p} d="M14.5 2.5l7 7-10 10-7-7 10-10zM3 21l4.5-4.5M16 8l-8 8" />;

function getStrength(v) {
    if (!v) return { score: 0, label: "", color: "", pct: 0 };
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
        { label: "Strong", color: "#1a2d6e", pct: 82 },
        { label: "Very strong", color: "#16a34a", pct: 100 },
    ];
    return { score: s, ...map[Math.min(s, 5)] };
}

function StepDot({ state, num }) {
    const base =
        "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all duration-300 flex-shrink-0";
    if (state === "done")
        return (
            <div className={`${base} bg-[#1a2d6e] text-white`}>
                <CheckIcon size={12} />
            </div>
        );
    if (state === "active")
        return (
            <div className={`${base} border-2 border-[#1a2d6e] text-[#1a2d6e] bg-white`}>{num}</div>
        );
    return (
        <div className={`${base} border border-slate-200 text-slate-300 bg-slate-50`}>{num}</div>
    );
}

function Rule({ ok, label }) {
    return (
        <div
            className={`flex items-center gap-1.5 text-[11px] transition-colors duration-200 ${ok ? "text-emerald-700" : "text-slate-400"}`}
        >
            {ok ? (
                <CheckIcon size={11} className="text-emerald-600" />
            ) : (
                <div className="w-2.5 h-2.5 rounded-full border border-current opacity-40" />
            )}
            {label}
        </div>
    );
}

function PassInput({ id, placeholder, value, onChange, valid }) {
    const [show, setShow] = useState(false);
    return (
        <div
            className={`flex items-center border rounded-xl bg-white transition-all duration-200 ${
                valid
                    ? "border-emerald-400 ring-2 ring-emerald-50"
                    : "border-slate-200 focus-within:border-[#1a2d6e] focus-within:ring-2 focus-within:ring-[#1a2d6e]/8"
            }`}
        >
            <input
                id={id}
                type={show ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete="off"
                className="flex-1 h-11 bg-transparent px-4 text-[13px] text-slate-800 outline-none placeholder:text-slate-300"
            />
            {valid && (
                <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center mr-1 flex-shrink-0">
                    <CheckIcon size={10} className="text-emerald-600" />
                </div>
            )}
            <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-slate-500 transition-colors flex-shrink-0"
                aria-label="toggle visibility"
            >
                {show ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
            </button>
        </div>
    );
}

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
            className={`absolute -top-2 left-1/2 -translate-x-1/2 w-[300px] z-30 transition-all duration-400 ${
                visible
                    ? "opacity-100 -translate-y-full"
                    : "opacity-0 -translate-y-[calc(100%-8px)] pointer-events-none"
            }`}
        >
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
                <div className="flex items-start gap-3 p-3.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <ShieldIcon size={16} className="text-emerald-600" />
                    </div>
                    <div className="flex-1 pt-0.5">
                        <p className="text-[12px] font-semibold text-slate-800 mb-0.5">
                            Password updated
                        </p>
                        <p className="text-[11px] text-slate-400">Your account is now secured.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-300 hover:text-slate-500 transition-colors"
                    >
                        <Icon size={13} d="M18 6L6 18M6 6l12 12" />
                    </button>
                </div>
                <div className="h-[2px] bg-emerald-50">
                    <div ref={barRef} className="h-full bg-emerald-500 origin-left" />
                </div>
            </div>
        </div>
    );
}

function SuccessState({ onReset }) {
    return (
        <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                <ShieldIcon size={24} className="text-emerald-600" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1a2d6e] mb-1.5">You're all set</h3>
            <p className="text-[12px] text-slate-400 leading-relaxed max-w-[220px] mb-5">
                Your password has been changed. Use your new credentials next time you sign in.
            </p>
            <div className="flex items-center gap-2 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mb-4 text-[11px] text-slate-400">
                <ClockIcon size={13} className="flex-shrink-0 text-slate-300" />
                <span>Changed just now — session stays active</span>
            </div>
            <button
                onClick={onReset}
                className="w-full h-10 border border-slate-200 rounded-xl text-[12px] font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all flex items-center justify-center gap-2"
            >
                <RefreshIcon size={12} /> Change password again
            </button>
        </div>
    );
}

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

    const step1Done = form.old.length > 0 && form.next.length >= 8;
    const step2Done = step1Done && form.confirm === form.next && form.confirm.length > 0;
    const s1 = step1Done ? "done" : "active";
    const s2 = step1Done ? (step2Done ? "done" : "active") : "idle";
    const s3 = step2Done ? "active" : "idle";

    const set = (k) => (e) => {
        setForm((f) => ({ ...f, [k]: e.target.value }));
        setError("");
    };

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
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
            `}</style>

            <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center p-4">
                <div className="w-full max-w-[420px] relative">
                    <Toast visible={toast} onClose={() => setToast(false)} />

                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        {/* ── HEADER ── */}
                        <div className="bg-[#1a2d6e] px-6 pt-6 pb-5">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#f97316] flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-900/30">
                                    <LockIcon size={18} className="text-white" />
                                </div>
                                <div>
                                    <h1 className="text-[18px] font-bold text-white leading-tight">
                                        Reset password
                                    </h1>
                                    <p className="text-[12px] text-blue-200/70 mt-0.5">
                                        Keep your account safe with a strong password
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── BODY ── */}
                        <div className="px-6 py-5">
                            {done ? (
                                <SuccessState onReset={resetAll} />
                            ) : (
                                <form onSubmit={submit} noValidate>
                                    {/* STEP BAR */}
                                    <div className="flex items-center gap-0 mb-5">
                                        <StepDot state={s1} num="1" />
                                        <div
                                            className={`flex-1 h-px transition-colors duration-300 mx-1 ${step1Done ? "bg-[#1a2d6e]" : "bg-slate-200"}`}
                                        />
                                        <StepDot state={s2} num="2" />
                                        <div
                                            className={`flex-1 h-px transition-colors duration-300 mx-1 ${step2Done ? "bg-[#1a2d6e]" : "bg-slate-200"}`}
                                        />
                                        <StepDot state={s3} num="3" />
                                        <div className="flex-1" />
                                        <div className="flex gap-1 ml-2">
                                            {["Current", "New", "Confirm"].map((lbl, i) => (
                                                <span
                                                    key={lbl}
                                                    className={`text-[10px] font-medium ${
                                                        i === 0
                                                            ? step1Done
                                                                ? "text-[#1a2d6e]"
                                                                : "text-slate-400"
                                                            : i === 1
                                                              ? step2Done
                                                                  ? "text-[#1a2d6e]"
                                                                  : step1Done
                                                                    ? "text-slate-500"
                                                                    : "text-slate-300"
                                                              : step2Done
                                                                ? "text-slate-500"
                                                                : "text-slate-300"
                                                    }`}
                                                >
                                                    {lbl}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ERROR */}
                                    {error && (
                                        <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5 mb-4">
                                            <AlertIcon
                                                size={14}
                                                className="text-red-500 flex-shrink-0"
                                            />
                                            <span className="text-[12px] text-red-600">
                                                {error}
                                            </span>
                                        </div>
                                    )}

                                    {/* CURRENT PASSWORD */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                Current password
                                            </label>
                                            <button
                                                type="button"
                                                className="text-[11px] text-[#1a2d6e] hover:underline font-medium transition-colors"
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

                                    {/* NEW PASSWORD */}
                                    <div className="mb-4">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                            New password
                                        </label>
                                        <PassInput
                                            id="f-new"
                                            placeholder="Min. 8 characters"
                                            value={form.next}
                                            onChange={set("next")}
                                            valid={str.score >= 3}
                                        />

                                        {form.next && (
                                            <div className="mt-2 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-[3px] bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-500"
                                                            style={{
                                                                width: `${str.pct}%`,
                                                                background: str.color,
                                                            }}
                                                        />
                                                    </div>
                                                    <span
                                                        className="text-[10px] font-semibold min-w-[56px] text-right"
                                                        style={{ color: str.color }}
                                                    >
                                                        {str.label}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                                                    <Rule ok={rules.len} label="8+ characters" />
                                                    <Rule ok={rules.case} label="Upper & lower" />
                                                    <Rule ok={rules.num} label="Number" />
                                                    <Rule ok={rules.sym} label="Symbol" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* CONFIRM */}
                                    <div className="mb-5">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
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
                                        {form.confirm.length > 0 && form.confirm !== form.next && (
                                            <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
                                                <AlertIcon size={11} /> Passwords don't match
                                            </p>
                                        )}
                                    </div>

                                    {/* SUBMIT */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-11 bg-[#1a2d6e] hover:bg-[#1e3580] text-white text-[13px] font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#1a2d6e]/25 active:scale-[0.99] disabled:opacity-40"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Updating…
                                            </>
                                        ) : (
                                            <>
                                                <LockIcon size={14} />
                                                Update password
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* ── FOOTER STRIP ── */}
                        <div className="border-t border-slate-100 px-6 py-3 bg-slate-50/60 flex items-center justify-center gap-1.5">
                            <ShieldIcon size={12} className="text-slate-300" />
                            <p className="text-[10px] text-slate-400">
                                Encrypted end-to-end — never stored in plain text
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
