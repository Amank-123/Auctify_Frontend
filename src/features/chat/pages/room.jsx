import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { api } from "@/shared/services/axios";
import { useAuth } from "@/hooks/useAuth";
import { socket } from "@/shared/services/socket";
import { usePageTitle } from "../../../shared/utils/usePageTitle";

const SearchIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
    </svg>
);

const MenuIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

function getSenderId(message) {
    return typeof message?.senderId === "object" ? message.senderId?._id : message?.senderId;
}

function Avatar({ name, image, size = "md", online = false }) {
    const initials = name?.[0]?.toUpperCase() ?? "?";
    const sizes = { sm: "h-8 w-8 text-xs", md: "h-9 w-9 text-sm", lg: "h-11 w-11 text-base" };
    const dotSizes = { sm: "h-2 w-2", md: "h-2.5 w-2.5", lg: "h-3 w-3" };

    return (
        <div className="relative shrink-0">
            {image ? (
                <img
                    src={image}
                    alt={name}
                    className={`${sizes[size]} rounded-full object-cover border border-zinc-200`}
                />
            ) : (
                <div
                    className={`${sizes[size]} rounded-full bg-gradient-to-br from-orange-400 to-rose-500 text-white font-semibold flex items-center justify-center shadow-sm`}
                >
                    {initials}
                </div>
            )}
            {online && (
                <span
                    className={`absolute bottom-0 right-0 ${dotSizes[size]} rounded-full bg-emerald-400 ring-2 ring-white`}
                />
            )}
        </div>
    );
}

function NoRooms({ hasSearch }) {
    return (
        <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
                <SearchIcon />
            </div>
            <p className="text-sm font-medium text-zinc-700">
                {hasSearch ? "No results found" : "No conversations yet"}
            </p>
            {hasSearch && <p className="mt-1 text-xs text-zinc-400">Try a different name</p>}
        </div>
    );
}

export default function RoomPage() {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const { User } = useAuth();
    usePageTitle("Auctify | Chats");

    const [rooms, setRooms] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loadingRooms, setLoadingRooms] = useState(true);

    const chatCacheRef = useRef(new Map());

    const getPartner = (room) => {
        if (!room || !User?._id) return null;
        return String(room?.buyerId?._id) === String(User?._id) ? room?.sellerId : room?.buyerId;
    };

    const getRoomTitle = (room) => {
        const partnerUser = getPartner(room);
        const auctionTitle = room?.auctionId?.name || "Auction";
        const username = partnerUser?.username || "User";
        return `${auctionTitle} (${username})`;
    };

    const getAuctionImage = (room) => {
        const media = room?.auctionId?.media;
        if (!Array.isArray(media) || media.length === 0) return "";
        if (Array.isArray(media[0])) return media[0][0] || "";
        return media[0] || "";
    };

    useEffect(() => {
        if (!User?._id) return;
        if (!socket.connected) socket.connect();
        socket.emit("join_user", User._id);
    }, [User?._id]);

    useEffect(() => {
        if (!roomId) {
            setSidebarOpen(true);
        } else {
            setSidebarOpen(false);
        }
    }, [roomId]);

    useEffect(() => {
        if (!User?._id) return;

        let mounted = true;

        (async () => {
            try {
                setLoadingRooms(true);

                const res = await api.get("/api/Room/getRooms");
                const data = Array.isArray(res.data?.data) ? res.data.data : [];

                if (!mounted) return;

                setRooms(data);

                data.forEach((room) => socket.emit("join_room", room._id));

                if (roomId) {
                    const directMatch = data.find((r) => String(r._id) === String(roomId));
                    if (!directMatch) {
                        const byAuction = data.find(
                            (r) => String(r.auctionId?._id) === String(roomId),
                        );

                        if (byAuction) {
                            navigate(`/chats/${byAuction._id}`, { replace: true });
                        } else {
                            // navigate("/chats", { replace: true });
                        }
                    }
                }
            } catch (err) {
                // keep silent
            } finally {
                if (mounted) setLoadingRooms(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [User?._id, roomId, navigate]);

    useEffect(() => {
        const handler = (users) => setOnlineUsers(Array.isArray(users) ? users : []);
        socket.on("online_users", handler);
        return () => socket.off("online_users", handler);
    }, []);

    useEffect(() => {
        const handler = (msg) => {
            if (!msg?.roomId) return;

            setRooms((prev) => {
                const roomIndex = prev.findIndex((room) => String(room._id) === String(msg.roomId));
                if (roomIndex === -1) return prev;

                const room = prev[roomIndex];

                const updatedRoom = {
                    ...room,
                    lastMessage: msg.text,
                    lastMessageAt: msg.createdAt,
                    lastMessageId: msg,
                };

                const next = [...prev];
                next.splice(roomIndex, 1);

                return [updatedRoom, ...next];
            });
        };

        socket.on("receive_message", handler);
        return () => socket.off("receive_message", handler);
    }, []);

    useEffect(() => {
        const handler = ({ seenBy, roomId: seenRoomId }) => {
            setRooms((prev) =>
                prev.map((room) => {
                    if (String(room._id) !== String(seenRoomId)) return room;

                    const lastMsg = room?.lastMessageId;
                    if (!lastMsg) return room;

                    const currentSeen = Array.isArray(lastMsg.seenBy) ? lastMsg.seenBy : [];
                    if (currentSeen.some((id) => String(id) === String(seenBy))) return room;

                    return {
                        ...room,
                        lastMessageId: {
                            ...lastMsg,
                            seenBy: [...currentSeen, seenBy],
                        },
                    };
                }),
            );
        };

        socket.on("message_seen", handler);
        return () => socket.off("message_seen", handler);
    }, []);

    useEffect(() => {
        const onTyping = ({ userId }) => {
            if (!userId || String(userId) === String(User?._id)) return;
            setTypingUsers((prev) =>
                prev.some((id) => String(id) === String(userId)) ? prev : [...prev, userId],
            );
        };

        const onStop = ({ userId }) => {
            setTypingUsers((prev) => prev.filter((id) => String(id) !== String(userId)));
        };

        socket.on("typing", onTyping);
        socket.on("stop_typing", onStop);

        return () => {
            socket.off("typing", onTyping);
            socket.off("stop_typing", onStop);
        };
    }, [User?._id]);

    const filteredRooms = useMemo(() => {
        const query = search.trim().toLowerCase();

        return rooms.filter((room) => {
            const partnerUser = getPartner(room);
            const username = partnerUser?.username?.toLowerCase() || "";
            const lastMessage = room?.lastMessage?.toLowerCase() || "";

            if (!query) return true;
            return username.includes(query) || lastMessage.includes(query);
        });
    }, [rooms, search, User?._id]);

    const hasRooms = rooms.length > 0;

    return (
        <div className="h-screen overflow-hidden bg-zinc-50 text-zinc-900">
            {sidebarOpen && roomId && (
                <div
                    className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex h-screen min-w-0 overflow-hidden">
                <aside
                    className={`
        fixed inset-0 z-30 flex w-full flex-col bg-white transition-transform duration-200 ease-out

        md:static
        md:inset-auto
        md:w-[360px]
        md:border-r
        md:border-zinc-200
        md:translate-x-0

        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    `}
                >
                    <div className="border-b border-zinc-200 px-4 py-4">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <div className="flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/")}
                                        className="rounded-xl p-2 text-zinc-600 hover:bg-zinc-100"
                                    >
                                        <HiOutlineArrowLeft size={18} />
                                    </button>
                                    <h2 className="text-[20px] font-semibold tracking-tight">
                                        Messages
                                    </h2>
                                </div>
                                <p className="mt-0.5 text-xs text-zinc-500">
                                    {hasRooms
                                        ? `${rooms.length} conversation${rooms.length === 1 ? "" : "s"}`
                                        : "No conversations"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 focus-within:border-orange-300 focus-within:bg-white">
                            <span className="text-zinc-400">
                                <SearchIcon />
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search conversations"
                                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="text-xs text-zinc-400 hover:text-zinc-700"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                        {loadingRooms ? (
                            <div className="px-4 py-10 text-center text-sm text-zinc-500">
                                Loading rooms...
                            </div>
                        ) : filteredRooms.length === 0 ? (
                            <NoRooms hasSearch={Boolean(search)} />
                        ) : (
                            <div className="space-y-1">
                                {filteredRooms.map((room) => {
                                    const partnerUser = getPartner(room);
                                    const active = String(roomId) === String(room._id);
                                    const pOnline = onlineUsers.some(
                                        (id) => String(id) === String(partnerUser?._id),
                                    );
                                    const pTyping = typingUsers.some(
                                        (id) => String(id) === String(partnerUser?._id),
                                    );
                                    const lastMsg = room?.lastMessageId;

                                    const hasUnread =
                                        lastMsg &&
                                        String(getSenderId(lastMsg)) !== String(User?._id) &&
                                        !lastMsg?.seenBy?.some(
                                            (id) => String(id) === String(User?._id),
                                        );

                                    return (
                                        <button
                                            key={room._id}
                                            type="button"
                                            onClick={() => {
                                                navigate(`/chats/${room._id}`, {
                                                    state: { room },
                                                });
                                                setSidebarOpen(false);
                                            }}
                                            className={`
                                                    flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition
                                                    ${
                                                        active
                                                            ? "border border-orange-200 bg-orange-50"
                                                            : "hover:bg-zinc-100"
                                                    }
                                                `}
                                        >
                                            <div className="relative shrink-0">
                                                <Avatar
                                                    name={partnerUser?.username}
                                                    image={partnerUser?.profile}
                                                    online={pOnline}
                                                    size="lg"
                                                />
                                                {pOnline && (
                                                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold">
                                                    {partnerUser?.username} -{" "}
                                                    {room?.auctionId?.name}
                                                </p>

                                                <p
                                                    className={`mt-0.5 truncate text-[11.5px] ${
                                                        pTyping
                                                            ? "text-orange-600"
                                                            : hasUnread
                                                              ? "font-semibold text-zinc-900"
                                                              : "text-zinc-500"
                                                    }`}
                                                >
                                                    {pTyping
                                                        ? "typing..."
                                                        : room?.lastMessage || "No messages yet"}
                                                </p>
                                            </div>

                                            {hasUnread && (
                                                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-zinc-200 px-4 py-3">
                        <button
                            className="flex items-center gap-3"
                            onclick={() => navigate("/profile")}
                        >
                            <Avatar name={User?.username} image={User?.profile} size="sm" online />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">
                                    {User?.username || "User"}
                                </p>
                                <p className="text-xs text-zinc-500">Signed in</p>
                            </div>
                        </button>
                    </div>
                </aside>

                <main className="relative flex min-w-0 flex-1 flex-col bg-zinc-50">
                    <div className="flex-1 overflow-hidden">
                        <Outlet
                            context={{
                                rooms,
                                onlineUsers,
                                typingUsers,
                                chatCacheRef,
                                setSidebarOpen,
                            }}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}
