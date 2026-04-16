import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const emptyAddress = {
    street: "",
    city: "",
    state: "",
    country: "",
    pin: "",
};

function getInitialForm(user) {
    return {
        username: user?.username || "",
        email: user?.email || "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        address: {
            street: user?.address?.street || "",
            city: user?.address?.city || "",
            state: user?.address?.state || "",
            country: user?.address?.country || "",
            pin: user?.address?.pin || "",
        },
    };
}

export default function Profile() {
    const { Loading, User, setUser } = useAuth();

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profileFile, setProfileFile] = useState(null);
    const [filePreview, setFilePreview] = useState("");
    const [error, setError] = useState("");
    const [form, setForm] = useState(getInitialForm(User));

    useEffect(() => {
        if (User) setForm(getInitialForm(User));
    }, [User]);

    useEffect(() => {
        if (!profileFile) {
            setFilePreview("");
            return;
        }

        const objectUrl = URL.createObjectURL(profileFile);
        setFilePreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [profileFile]);

    const displayName = useMemo(() => {
        const full = `${User?.firstName || ""} ${User?.lastName || ""}`.trim();
        return full || User?.username || "User";
    }, [User]);

    const openEditor = () => {
        setError("");
        setForm(getInitialForm(User));
        setProfileFile(null);
        setIsEditOpen(true);
    };

    const closeEditor = () => {
        if (saving) return;
        setIsEditOpen(false);
        setError("");
        setProfileFile(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("address.")) {
            const key = name.split(".")[1];
            setForm((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [key]: value,
                },
            }));
            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const appendIfChanged = (fd, key, nextValue, prevValue) => {
        const next = typeof nextValue === "string" ? nextValue.trim() : nextValue;
        const prev = typeof prevValue === "string" ? prevValue.trim() : prevValue;

        if (next === "" || next === undefined || next === null) return;
        if (next === prev) return;

        fd.append(key, next);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const formData = new FormData();

            appendIfChanged(formData, "username", form.username, User?.username);
            appendIfChanged(formData, "email", form.email, User?.email);
            appendIfChanged(formData, "firstName", form.firstName, User?.firstName);
            appendIfChanged(formData, "lastName", form.lastName, User?.lastName);

            const addressKeys = Object.keys(emptyAddress);
            addressKeys.forEach((key) => {
                appendIfChanged(
                    formData,
                    `address.${key}`,
                    form.address?.[key],
                    User?.address?.[key],
                );
            });

            if (profileFile) {
                formData.append("profile", profileFile);
            }

            if (!profileFile && formData.entries().next().done) {
                setError("No changes to save.");
                return;
            }

            setSaving(true);

            const { data } = await api.patch("/user/update", formData);

            const updatedUser = data?.user || data?.data?.user || data?.data || data;
            if (updatedUser) setUser(updatedUser);

            setIsEditOpen(false);
            setProfileFile(null);
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || err?.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (Loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-[#F8F8FF] px-4">
                <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-4 text-[#1F2937] shadow-sm">
                    Loading profile...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F8FF] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold tracking-tight text-[#1F2937]">
                        Profile
                    </h1>
                    <p className="mt-1 text-sm text-[#6B7280]">
                        Manage your account details, address, and profile photo.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                    <aside className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative">
                                <img
                                    src={User?.profile || "/default-avatar.png"}
                                    alt="Profile"
                                    className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
                                />
                                {User?.isVerified && (
                                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[#2563EB] px-3 py-1 text-xs font-medium text-white shadow-sm">
                                        Verified
                                    </span>
                                )}
                            </div>

                            <h2 className="mt-5 text-2xl font-semibold text-[#1F2937]">
                                {displayName}
                            </h2>
                            <p className="mt-1 text-sm text-[#6B7280]">
                                @{User?.username || "username"}
                            </p>
                            <p className="mt-1 text-sm text-[#6B7280]">{User?.email}</p>

                            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                                <span className="rounded-full border border-[#E5E7EB] bg-[#F8F8FF] px-3 py-1 text-xs font-medium text-[#1F2937]">
                                    Status: {User?.status || "neutral"}
                                </span>
                                <span className="rounded-full border border-[#E5E7EB] bg-[#F8F8FF] px-3 py-1 text-xs font-medium text-[#1F2937]">
                                    Violations: {User?.violationCount ?? 0}
                                </span>
                            </div>

                            <button
                                onClick={openEditor}
                                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
                            >
                                Edit profile
                            </button>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8F8FF] p-4">
                                <div className="text-xs text-[#6B7280]">Verified</div>
                                <div className="mt-1 text-lg font-semibold text-[#1F2937]">
                                    {User?.isVerified ? "Yes" : "No"}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8F8FF] p-4">
                                <div className="text-xs text-[#6B7280]">Joined</div>
                                <div className="mt-1 text-lg font-semibold text-[#1F2937]">
                                    {User?.createdAt
                                        ? new Date(User.createdAt).toLocaleDateString()
                                        : "-"}
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main className="space-y-6">
                        <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-[#1F2937]">
                                        Account overview
                                    </h3>
                                    <p className="mt-1 text-sm text-[#6B7280]">
                                        Your public identity and basic account information.
                                    </p>
                                </div>
                                <div className="rounded-full bg-[#2563EB]/10 px-3 py-1 text-sm font-medium text-[#2563EB]">
                                    Auctify
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                <InfoCard label="Username" value={User?.username} />
                                <InfoCard label="First name" value={User?.firstName} />
                                <InfoCard label="Last name" value={User?.lastName} />
                                <InfoCard label="Email" value={User?.email} wide />
                                <InfoCard label="Status" value={User?.status || "neutral"} />
                                <InfoCard
                                    label="Profile image"
                                    value={User?.profile ? "Uploaded" : "Not set"}
                                />
                            </div>
                        </section>

                        <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-[#1F2937]">
                                        Address
                                    </h3>
                                    <p className="mt-1 text-sm text-[#6B7280]">
                                        Delivery and account location details.
                                    </p>
                                </div>
                                <span className="rounded-full border border-[#E5E7EB] px-3 py-1 text-xs font-medium text-[#6B7280]">
                                    Optional
                                </span>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <InfoCard label="Street" value={User?.address?.street} />
                                <InfoCard label="City" value={User?.address?.city} />
                                <InfoCard label="State" value={User?.address?.state} />
                                <InfoCard label="Country" value={User?.address?.country} />
                                <InfoCard label="PIN" value={User?.address?.pin} />
                            </div>
                        </section>

                        <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-[#1F2937]">Quick actions</h3>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <button
                                    onClick={openEditor}
                                    className="rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4ED8]"
                                >
                                    Update info
                                </button>
                                <button className="rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm font-medium text-[#1F2937] transition hover:bg-[#F8F8FF]">
                                    Change password
                                </button>
                                <button className="rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm font-medium text-[#C2410C] transition hover:bg-[#C2410C]/5">
                                    View activity
                                </button>
                            </div>
                        </section>
                    </main>
                </div>
            </div>

            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
                    <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
                            <div>
                                <h3 className="text-xl font-semibold text-[#1F2937]">
                                    Edit profile
                                </h3>
                                <p className="text-sm text-[#6B7280]">
                                    Update only the fields you want to change.
                                </p>
                            </div>
                            <button
                                onClick={closeEditor}
                                className="rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#1F2937] transition hover:bg-[#F8F8FF]"
                            >
                                Close
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]"
                        >
                            <div className="space-y-5">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field
                                        label="Username"
                                        name="username"
                                        value={form.username}
                                        onChange={handleChange}
                                        placeholder="username"
                                    />
                                    <Field
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="email@example.com"
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field
                                        label="First name"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        placeholder="First name"
                                    />
                                    <Field
                                        label="Last name"
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        placeholder="Last name"
                                    />
                                </div>

                                <div>
                                    <h4 className="mb-3 text-sm font-semibold text-[#1F2937]">
                                        Address
                                    </h4>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Field
                                            label="Street"
                                            name="address.street"
                                            value={form.address.street}
                                            onChange={handleChange}
                                            placeholder="Street"
                                        />
                                        <Field
                                            label="City"
                                            name="address.city"
                                            value={form.address.city}
                                            onChange={handleChange}
                                            placeholder="City"
                                        />
                                        <Field
                                            label="State"
                                            name="address.state"
                                            value={form.address.state}
                                            onChange={handleChange}
                                            placeholder="State"
                                        />
                                        <Field
                                            label="Country"
                                            name="address.country"
                                            value={form.address.country}
                                            onChange={handleChange}
                                            placeholder="Country"
                                        />
                                        <Field
                                            label="PIN"
                                            name="address.pin"
                                            value={form.address.pin}
                                            onChange={handleChange}
                                            placeholder="PIN"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="rounded-2xl border border-[#C2410C]/20 bg-[#C2410C]/5 px-4 py-3 text-sm text-[#C2410C]">
                                        {error}
                                    </div>
                                )}

                                <div className="flex items-center justify-end gap-3 border-t border-[#E5E7EB] pt-5">
                                    <button
                                        type="button"
                                        onClick={closeEditor}
                                        className="rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm font-medium text-[#1F2937] transition hover:bg-[#F8F8FF]"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {saving ? "Saving..." : "Save changes"}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-5 rounded-3xl border border-[#E5E7EB] bg-[#F8F8FF] p-5">
                                <div>
                                    <h4 className="text-sm font-semibold text-[#1F2937]">
                                        Profile image
                                    </h4>
                                    <p className="mt-1 text-sm text-[#6B7280]">
                                        Upload a new profile picture. This goes with the same
                                        request.
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <img
                                        src={filePreview || User?.profile || "/default-avatar.png"}
                                        alt="Preview"
                                        className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
                                    />
                                    <div className="space-y-2">
                                        <label className="inline-flex cursor-pointer items-center rounded-xl bg-[#C2410C] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#9A3412]">
                                            Choose image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) =>
                                                    setProfileFile(e.target.files?.[0] || null)
                                                }
                                            />
                                        </label>
                                        <p className="text-xs text-[#6B7280]">
                                            JPG, PNG, WEBP. Keep it sane.
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                                    <div className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                                        Update rule
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-[#1F2937]">
                                        Only changed values are appended to the request. Empty
                                        fields are ignored, so your Zod min and max rules do not get
                                        sabotaged by accidental blanks.
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function Field({ label, name, value, onChange, type = "text", placeholder }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#1F2937]">{label}</span>
            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#1F2937] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
            />
        </label>
    );
}

function InfoCard({ label, value, wide = false }) {
    return (
        <div
            className={`rounded-2xl border border-[#E5E7EB] bg-[#F8F8FF] p-4 ${
                wide ? "sm:col-span-2 xl:col-span-2" : ""
            }`}
        >
            <div className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                {label}
            </div>
            <div className="mt-2 break-words text-sm font-semibold text-[#1F2937]">
                {value || "-"}
            </div>
        </div>
    );
}
