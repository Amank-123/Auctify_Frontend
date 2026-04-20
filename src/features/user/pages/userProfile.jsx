import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import defaultUp from "@/assets/default.png";
import { updateUserProfile } from "../userAPI";

export default function Profile() {
    const { Loading, User, setUser } = useAuth();

    const [activeTab, setActiveTab] = useState("overview");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [form, setForm] = useState({});
    const [profileFile, setProfileFile] = useState(null);
    const [preview, setPreview] = useState("");

    useEffect(() => {
        if (User) setForm(User);
    }, [User]);

    useEffect(() => {
        if (!profileFile) return setPreview("");
        const url = URL.createObjectURL(profileFile);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [profileFile]);

    const displayName = useMemo(() => {
        return `${User?.firstName || ""} ${User?.lastName || ""}`.trim() || User?.username;
    }, [User]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData();
        Object.keys(form).forEach((key) => {
            if (form[key] !== User[key]) fd.append(key, form[key]);
        });

        if (profileFile) fd.append("profile", profileFile);

        const res = await updateUserProfile(fd);
        setUser(res?.user || res);
        setIsEditOpen(false);
    };

    if (Loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#F8F8FF]">
                <div className="px-6 py-3 bg-white border border-[#E5E7EB] rounded-xl shadow-sm text-[#1F2937]">
                    Loading profile...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F8FF] p-6">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-[280px_1fr] gap-6">
                {/* SIDEBAR */}
                <aside className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5">
                    <div className="text-center">
                        <img
                            src={User?.profile || defaultUp}
                            className="h-24 w-24 rounded-full mx-auto object-cover border-4 border-white shadow"
                        />
                        <h2 className="mt-3 font-semibold text-lg text-[#1F2937]">{displayName}</h2>
                        <p className="text-sm text-[#6B7280]">@{User?.username}</p>
                    </div>

                    {/* NAV */}
                    <div className="mt-6 space-y-2">
                        {[
                            ["info", "My Info"],
                            ["overview", "Overview"],
                            ["orders", "My Orders"],
                            ["bids", "My Bids"],
                            ["wishlist", "Wishlist"],
                            ["settings", "Settings"],
                        ].map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition
                                ${
                                    activeTab === key
                                        ? "bg-[#2563EB] text-white shadow"
                                        : "text-[#1F2937] hover:bg-[#F1F5F9]"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* MAIN */}
                <main className="space-y-6">
                    {activeTab === "info" && (
                        <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 space-y-6">
                            {/* HEADER */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={User?.profile || defaultUp}
                                    className="h-16 w-16 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold text-[#1F2937]">
                                        {User?.firstName} {User?.lastName}
                                    </h3>
                                    <p className="text-sm text-[#6B7280]">@{User?.username}</p>
                                    <p className="text-sm text-[#6B7280]">{User?.email}</p>
                                </div>
                            </div>

                            {/* STATS */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <StatCard label="Auctions" value={User?.auctionCount || 0} />
                                <StatCard label="Bids" value={User?.bidCount || 0} />
                                <StatCard label="Status" value={User?.status || "Active"} />
                            </div>

                            {/* ADDRESS */}
                            <div>
                                <h4 className="text-sm font-semibold text-[#1F2937] mb-2">
                                    Address
                                </h4>

                                <div className="border border-[#E5E7EB] rounded-xl p-4 text-sm text-[#6B7280] leading-6">
                                    {User?.address?.street || "—"} <br />
                                    {User?.address?.city || ""} {User?.address?.state || ""} <br />
                                    {User?.address?.country || ""} {User?.address?.pin || ""}
                                </div>
                            </div>

                            {/* META */}
                            <div className="grid grid-cols-2 gap-4">
                                <InfoMini
                                    label="Joined"
                                    value={
                                        User?.createdAt
                                            ? new Date(User.createdAt).toLocaleDateString()
                                            : "-"
                                    }
                                />
                                <InfoMini
                                    label="Verified"
                                    value={User?.isVerified ? "Yes" : "No"}
                                />
                            </div>
                        </section>
                    )}
                    {/* OVERVIEW */}
                    {activeTab === "overview" && (
                        <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
                            <h3 className="font-semibold text-lg text-[#1F2937]">
                                Recent Activity
                            </h3>

                            <div className="mt-5 space-y-4">
                                {[1, 2, 3].map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center border border-[#E5E7EB] rounded-xl p-4 hover:shadow-md transition"
                                    >
                                        <div className="flex gap-4 items-center">
                                            <div className="h-14 w-14 bg-gray-200 rounded-lg" />
                                            <div>
                                                <p className="text-sm font-medium text-[#1F2937]">
                                                    Product Name
                                                </p>
                                                <p className="text-xs text-[#6B7280]">Bid placed</p>
                                            </div>
                                        </div>

                                        <div className="text-sm font-semibold text-[#C2410C]">
                                            ₹1200
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ORDERS */}
                    {activeTab === "orders" && (
                        <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
                            <h3 className="font-semibold text-lg text-[#1F2937]">My Orders</h3>

                            <div className="mt-5 grid sm:grid-cols-2 gap-5">
                                {[1, 2].map((_, i) => (
                                    <div
                                        key={i}
                                        className="border border-[#E5E7EB] rounded-xl p-4 hover:shadow-lg transition"
                                    >
                                        <div className="h-32 bg-gray-200 rounded-lg" />

                                        <div className="mt-3">
                                            <p className="text-sm font-medium text-[#1F2937]">
                                                Item Name
                                            </p>
                                            <p className="text-xs text-[#6B7280]">Delivered</p>

                                            <button className="mt-3 text-sm font-medium text-[#2563EB] hover:underline">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* BIDS */}
                    {activeTab === "bids" && (
                        <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
                            <h3 className="font-semibold text-lg text-[#1F2937]">My Bids</h3>

                            <div className="mt-5 space-y-4">
                                {[1, 2, 3].map((_, i) => (
                                    <div className="flex justify-between items-center border border-[#E5E7EB] rounded-xl p-4 hover:shadow transition">
                                        <span className="text-sm text-[#1F2937]">Auction Item</span>

                                        <span className="text-sm font-semibold text-[#C2410C]">
                                            ₹900
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* WISHLIST */}
                    {activeTab === "wishlist" && (
                        <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
                            <h3 className="font-semibold text-lg text-[#1F2937]">Wishlist</h3>

                            <div className="flex gap-4 mt-5 overflow-x-auto">
                                {[1, 2, 3].map((_, i) => (
                                    <div className="min-w-[150px] border border-[#E5E7EB] rounded-xl p-3 hover:shadow-md transition">
                                        <div className="h-24 bg-gray-200 rounded-md" />
                                        <p className="text-sm mt-2 text-[#1F2937]">Saved Item</p>
                                        <p className="text-xs text-[#C2410C] font-medium">₹800</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* SETTINGS */}
                    {activeTab === "settings" && (
                        <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
                            <h3 className="font-semibold text-lg text-[#1F2937]">Account Info</h3>

                            <div className="grid sm:grid-cols-2 gap-4 mt-5">
                                <Input
                                    label="Username"
                                    name="username"
                                    value={form.username || ""}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Email"
                                    name="email"
                                    value={form.email || ""}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="First Name"
                                    name="firstName"
                                    value={form.firstName || ""}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Last Name"
                                    name="lastName"
                                    value={form.lastName || ""}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                onClick={() => setIsEditOpen(true)}
                                className="mt-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2 rounded-xl text-sm font-medium transition"
                            >
                                Edit Profile
                            </button>
                        </section>
                    )}
                </main>
            </div>

            {/* MODAL */}
            {isEditOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <form className="bg-white p-6 rounded-2xl w-full max-w-lg space-y-4 shadow-xl">
                        <h3 className="font-semibold text-lg text-[#1F2937]">Edit Profile</h3>

                        <Input
                            label="Username"
                            name="username"
                            value={form.username || ""}
                            onChange={handleChange}
                        />
                        <Input
                            label="Email"
                            name="email"
                            value={form.email || ""}
                            onChange={handleChange}
                        />

                        <input type="file" onChange={(e) => setProfileFile(e.target.files[0])} />

                        <div className="flex justify-end gap-2 pt-4">
                            <button type="button" onClick={() => setIsEditOpen(false)}>
                                Cancel
                            </button>
                            <button className="bg-[#2563EB] text-white px-4 py-2 rounded-lg">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

function Input({ label, ...props }) {
    return (
        <div>
            <label className="text-sm text-[#6B7280]">{label}</label>
            <input
                {...props}
                className="w-full mt-1 border border-[#E5E7EB] px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
            />
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="border border-[#E5E7EB] rounded-xl p-4 text-center">
            <div className="text-lg font-semibold text-[#2563EB]">{value}</div>
            <div className="text-xs text-[#6B7280] mt-1">{label}</div>
        </div>
    );
}

function InfoMini({ label, value }) {
    return (
        <div className="border border-[#E5E7EB] rounded-xl p-3">
            <div className="text-xs text-[#6B7280]">{label}</div>
            <div className="text-sm font-medium text-[#1F2937] mt-1">{value}</div>
        </div>
    );
}