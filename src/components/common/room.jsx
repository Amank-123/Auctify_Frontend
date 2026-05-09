import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlinePaperAirplane, HiOutlineArrowLeft } from "react-icons/hi2";
import { api } from "@/shared/services/axios";
import { useAuth } from "@/hooks/useAuth";
import { socket } from "@/shared/services/socket";

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

const CheckIcon = ({ double = false }) => (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 11" fill="none">
        {double ? (
            <>
                <path
                    d="M1 5.5L5 9.5L11 2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M5 9.5L15 2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </>
        ) : (
            <path
                d="M1 5.5L6 10L15 2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        )}
    </svg>
);

function Avatar({ name, size = "md", online = false, className = "" }) {
    const initials = name?.[0]?.toUpperCase() ?? "?";

    const sizes = {
        sm: "h-8 w-8 text-xs",
        md: "h-9 w-9 text-sm",
        lg: "h-11 w-11 text-base",
    };

    const dotSizes = {
        sm: "h-2 w-2",
        md: "h-2.5 w-2.5",
        lg: "h-3 w-3",
    };

    return (
        <div className={`relative shrink-0 ${className}`}>
            <div
                className={`${sizes[size]} rounded-full bg-gradient-to-br from-orange-400 to-rose-500 text-white font-semibold flex items-center justify-center shadow-sm`}
            >
                {initials}
            </div>
            {online && (
                <span
                    className={`absolute bottom-0 right-0 ${dotSizes[size]} rounded-full bg-emerald-400 ring-2 ring-white`}
                />
            )}
        </div>
    );
}

function TypingBubble() {
    return (
        <div className="flex items-end gap-2 justify-start px-1">
            <Avatar name="?" size="sm" className="opacity-60" />
            <div className="rounded-2xl rounded-bl-md border border-zinc-200 bg-white px-3 py-2 shadow-sm">
                <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="h-1.5 w-1.5 rounded-full bg-zinc-400"
                            style={{
                                animation: `typingBounce 1.1s ease-in-out ${i * 0.15}s infinite`,
                            }}
                        />
                    ))}
                </div>
            </div>
            <style>{`
                @keyframes typingBounce {
                    0%, 80%, 100% { transform: translateY(0); opacity: .65; }
                    40% { transform: translateY(-4px); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50">
                <HiOutlinePaperAirplane size={26} className="rotate-12 text-orange-500" />
            </div>
            <p className="text-[15px] font-semibold text-zinc-900">No conversation selected</p>
            <p className="mt-1 max-w-xs text-sm text-zinc-500">
                Pick a room from the sidebar to start chatting.
            </p>
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

function getSenderId(message) {
    return typeof message?.senderId === "object" ? message.senderId?._id : message?.senderId;
}

function getDateKey(dateValue) {
    return new Date(dateValue).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function getTimeLabel(dateValue) {
    return new Date(dateValue).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function RoomPage() {
    const navigate = useNavigate();
    const { User } = useAuth();

    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loadingRooms, setLoadingRooms] = useState(true);

    const scrollRef = useRef(null);
    const typingTimeout = useRef(null);
    const inputRef = useRef(null);
    const selectedRoomRef = useRef(null);

    const getPartner = (room) => {
        if (!room || !User?._id) return null;
        return String(room?.buyerId?._id) === String(User?._id) ? room?.sellerId : room?.buyerId;
    };

    const sortMessages = (list = []) =>
        [...list].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    useEffect(() => {
        selectedRoomRef.current = selectedRoom;
    }, [selectedRoom]);

    useEffect(() => {
        if (!User?._id) return;
        socket.emit("join_user", User._id);
    }, [User?._id]);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoadingRooms(true);
                const res = await api.get("/api/Room/getRooms");
                const data = Array.isArray(res.data?.data) ? res.data.data : [];

                if (!mounted) return;

                setRooms(data);

                if (data.length > 0) {
                    await selectRoom(data[0], data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                if (mounted) setLoadingRooms(false);
            }
        })();

        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [User?._id]);

    useEffect(() => {
        const handleOnlineUsers = (users) => {
            setOnlineUsers(Array.isArray(users) ? users : []);
        };

        socket.on("online_users", handleOnlineUsers);

        return () => {
            socket.off("online_users", handleOnlineUsers);
        };
    }, []);

    useEffect(() => {
        const handleReceiveMessage = (msg) => {
            const activeRoomId = selectedRoomRef.current?._id;

            if (!activeRoomId) return;
            if (String(msg?.roomId) !== String(activeRoomId)) return;

            setMessages((prev) => {
                const alreadyExists = prev.some((m) => String(m._id) === String(msg._id));
                if (alreadyExists) return prev;
                return [...prev, msg];
            });

            if (User?._id) {
                socket.emit("message_seen", { roomId: activeRoomId, userId: User._id });
            }
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [User?._id]);

    useEffect(() => {
        const handleSeen = ({ messageIds, seenBy }) => {
            setMessages((prev) =>
                prev.map((msg) => {
                    if (!Array.isArray(messageIds)) return msg;
                    if (!messageIds.some((id) => String(id) === String(msg._id))) return msg;

                    const currentSeen = Array.isArray(msg.seenBy) ? msg.seenBy : [];
                    if (currentSeen.some((id) => String(id) === String(seenBy))) return msg;

                    return { ...msg, seenBy: [...currentSeen, seenBy] };
                }),
            );
        };

        socket.on("message_seen", handleSeen);

        return () => {
            socket.off("message_seen", handleSeen);
        };
    }, []);

    useEffect(() => {
        const handleTyping = ({ userId }) => {
            if (!userId || String(userId) === String(User?._id)) return;
            setTypingUsers((prev) =>
                prev.some((id) => String(id) === String(userId)) ? prev : [...prev, userId],
            );
        };

        const handleStopTyping = ({ userId }) => {
            setTypingUsers((prev) => prev.filter((id) => String(id) !== String(userId)));
        };

        socket.on("typing", handleTyping);
        socket.on("stop_typing", handleStopTyping);

        return () => {
            socket.off("typing", handleTyping);
            socket.off("stop_typing", handleStopTyping);
        };
    }, [User?._id]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, selectedRoom]);

    useEffect(() => {
        return () => {
            clearTimeout(typingTimeout.current);
        };
    }, []);

    const selectRoom = async (room, roomList = rooms) => {
        if (!room?._id || !User?._id) return;

        try {
            setSelectedRoom(room);
            selectedRoomRef.current = room;
            setSidebarOpen(false);

            socket.emit("join_room", room._id);

            const res = await api.post("/api/message/get", { roomId: room._id });
            const data = Array.isArray(res.data?.data) ? res.data.data : [];

            setMessages(sortMessages(data));

            socket.emit("message_seen", { roomId: room._id, userId: User._id });
            setTimeout(() => inputRef.current?.focus(), 50);
        } catch (err) {
            console.error(err);
        }
    };

    const sendMessage = async () => {
        const trimmed = text.trim();
        if (!trimmed || !selectedRoom?._id || !User?._id) return;

        try {
            socket.emit("stop_typing", {
                roomId: selectedRoom._id,
                userId: User._id,
            });

            await api.post("/api/message/send", {
                roomId: selectedRoom._id,
                text: trimmed,
            });

            setText("");
            inputRef.current?.focus();
        } catch (err) {
            console.error(err);
        }
    };

    const partner = getPartner(selectedRoom);

    const isOnline = onlineUsers.some((id) => String(id) === String(partner?._id));
    const isTyping = typingUsers.some((id) => String(id) === String(partner?._id));

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

    const groupedMessages = useMemo(() => {
        const sorted = sortMessages(messages);
        return sorted.reduce((acc, msg) => {
            const key = getDateKey(msg.createdAt);
            if (!acc[key]) acc[key] = [];
            acc[key].push(msg);
            return acc;
        }, {});
    }, [messages]);

    const hasRooms = rooms.length > 0;
    const activeRoomId = selectedRoom?._id;

    return (
        <div className="h-screen overflow-hidden bg-zinc-50 text-zinc-900">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex h-screen min-w-0 overflow-hidden">
                <aside
                    className={`
                        fixed inset-y-0 left-0 z-30 flex w-[400px] flex-col border-r border-zinc-200 bg-white transition-transform duration-200 ease-out md:static md:translate-x-0
                        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    `}
                >
                    <div className="border-b border-zinc-200 px-4 py-4">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <div className="flex justify-center items-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="rounded-xl p-2 text-zinc-600 hover:bg-zinc-100"
                                        title="Go back"
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
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(false)}
                                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 md:hidden"
                            >
                                <MenuIcon />
                            </button>
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
                            {search ? (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="text-xs text-zinc-400 hover:text-zinc-700"
                                >
                                    ✕
                                </button>
                            ) : null}
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
                                    const active = String(activeRoomId) === String(room._id);
                                    const pOnline = onlineUsers.some(
                                        (id) => String(id) === String(partnerUser?._id),
                                    );
                                    const pTyping = typingUsers.some(
                                        (id) => String(id) === String(partnerUser?._id),
                                    );

                                    return (
                                        <button
                                            key={room._id}
                                            type="button"
                                            onClick={() => selectRoom(room)}
                                            className={`
                                                flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition
                                                ${
                                                    active
                                                        ? "border border-orange-200 bg-orange-50"
                                                        : "hover:bg-zinc-100"
                                                }
                                            `}
                                        >
                                            <Avatar
                                                name={partnerUser?.username}
                                                size="md"
                                                online={pOnline}
                                            />

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p
                                                        className={`
                                                            truncate text-[13.5px] font-semibold
                                                            ${active ? "text-zinc-900" : "text-zinc-800"}
                                                        `}
                                                    >
                                                        {partnerUser?.username || "Unknown user"}
                                                    </p>
                                                </div>

                                                <p
                                                    className={`
                                                        mt-0.5 truncate text-[11.5px]
                                                        ${
                                                            pTyping
                                                                ? "text-orange-600"
                                                                : pOnline
                                                                  ? "text-emerald-600"
                                                                  : "text-zinc-500"
                                                        }
                                                    `}
                                                >
                                                    {pTyping
                                                        ? "typing..."
                                                        : pOnline
                                                          ? "Online"
                                                          : room?.lastMessage || "No messages yet"}
                                                </p>
                                            </div>

                                            {active ? (
                                                <span className="h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                                            ) : null}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-zinc-200 px-4 py-3">
                        <div className="flex items-center gap-3">
                            <Avatar name={User?.username} size="sm" online />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">
                                    {User?.username || "User"}
                                </p>
                                <p className="text-xs text-emerald-600">Active now</p>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="relative flex min-w-0 flex-1 flex-col bg-zinc-50">
                    {selectedRoom ? (
                        <>
                            <header className="flex h-16 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-3 sm:px-4">
                                <button
                                    type="button"
                                    className="rounded-xl p-2 text-zinc-600 hover:bg-zinc-100 md:hidden"
                                    onClick={() => setSidebarOpen(true)}
                                    title="Open conversations"
                                >
                                    <MenuIcon />
                                </button>

                                <Avatar name={partner?.username} size="md" online={isOnline} />

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[14px] font-semibold leading-tight">
                                        {partner?.username || "Conversation"}
                                    </p>
                                    <p
                                        className={`
                                            text-[11.5px] font-medium
                                            ${
                                                isTyping
                                                    ? "text-orange-600"
                                                    : isOnline
                                                      ? "text-emerald-600"
                                                      : "text-zinc-500"
                                            }
                                        `}
                                    >
                                        {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
                                    </p>
                                </div>
                            </header>

                            <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-5">
                                <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
                                    {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
                                        <div key={dateLabel} className="space-y-2">
                                            <div className="flex items-center gap-3 py-1">
                                                <div className="h-px flex-1 bg-zinc-200" />
                                                <span className="shrink-0 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                                                    {dateLabel}
                                                </span>
                                                <div className="h-px flex-1 bg-zinc-200" />
                                            </div>

                                            <div className="space-y-1.5">
                                                {msgs.map((msg, idx) => {
                                                    const senderId = getSenderId(msg);

                                                    const mine =
                                                        String(senderId) === String(User?._id);

                                                    const seenByPartner = Array.isArray(msg.seenBy)
                                                        ? msg.seenBy.some(
                                                              (id) =>
                                                                  String(id) ===
                                                                  String(partner?._id),
                                                          )
                                                        : false;

                                                    const prevMsg = msgs[idx - 1];

                                                    const prevSenderId = prevMsg
                                                        ? getSenderId(prevMsg)
                                                        : null;

                                                    const firstInCluster =
                                                        !prevSenderId ||
                                                        String(prevSenderId) !== String(senderId);

                                                    return (
                                                        <div
                                                            key={msg._id}
                                                            className={`flex w-full ${
                                                                mine
                                                                    ? "justify-end"
                                                                    : "justify-start"
                                                            }`}
                                                        >
                                                            <div
                                                                className={`flex items-end gap-2 max-w-[78%] ${
                                                                    mine
                                                                        ? "flex-row-reverse"
                                                                        : "flex-row"
                                                                }`}
                                                            >
                                                                {/* Avatar */}
                                                                <div className="w-8 shrink-0">
                                                                    {firstInCluster ? (
                                                                        <Avatar
                                                                            name={
                                                                                mine
                                                                                    ? User?.username
                                                                                    : partner?.username
                                                                            }
                                                                            size="sm"
                                                                        />
                                                                    ) : null}
                                                                </div>

                                                                {/* Bubble */}
                                                                <div
                                                                    className={`
                        px-3 py-2 rounded-2xl shadow-sm
                        ${
                            mine
                                ? "bg-orange-500 text-white rounded-br-md"
                                : "bg-white border border-zinc-200 text-zinc-900 rounded-bl-md"
                        }
                    `}
                                                                >
                                                                    <p className="text-[13px] leading-[1.45] break-words">
                                                                        {msg.text}
                                                                    </p>

                                                                    <div className="mt-1 flex items-center justify-end gap-1">
                                                                        <span
                                                                            className={`text-[10px] ${
                                                                                mine
                                                                                    ? "text-orange-100"
                                                                                    : "text-zinc-400"
                                                                            }`}
                                                                        >
                                                                            {getTimeLabel(
                                                                                msg.createdAt,
                                                                            )}
                                                                        </span>

                                                                        {mine && (
                                                                            <span
                                                                                className={
                                                                                    seenByPartner
                                                                                        ? "text-orange-100"
                                                                                        : "text-orange-200"
                                                                                }
                                                                            >
                                                                                <CheckIcon
                                                                                    double={
                                                                                        seenByPartner
                                                                                    }
                                                                                />
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}

                                    {isTyping ? <TypingBubble /> : null}
                                    <div ref={scrollRef} />
                                </div>
                            </div>

                            <div className="border-t border-zinc-200 bg-white px-3 py-3 sm:px-4">
                                <div className="mx-auto flex w-full max-w-4xl items-end gap-2">
                                    <div className="flex-1 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 transition focus-within:border-orange-300 focus-within:bg-white">
                                        <textarea
                                            ref={inputRef}
                                            value={text}
                                            onChange={(e) => {
                                                const nextValue = e.target.value;
                                                setText(nextValue);

                                                if (!selectedRoom?._id || !User?._id) return;

                                                socket.emit("typing", {
                                                    roomId: selectedRoom._id,
                                                    userId: User._id,
                                                });

                                                clearTimeout(typingTimeout.current);
                                                typingTimeout.current = setTimeout(() => {
                                                    socket.emit("stop_typing", {
                                                        roomId: selectedRoom._id,
                                                        userId: User._id,
                                                    });
                                                }, 900);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    sendMessage();
                                                }
                                            }}
                                            placeholder="Write a message..."
                                            rows={1}
                                            className="max-h-36 w-full resize-none bg-transparent text-sm outline-none placeholder:text-zinc-400"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={sendMessage}
                                        disabled={!text.trim()}
                                        className={`
                                            inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition
                                            ${
                                                text.trim()
                                                    ? "bg-orange-500 text-white shadow-sm hover:bg-orange-600 active:scale-95"
                                                    : "cursor-not-allowed bg-zinc-100 text-zinc-400"
                                            }
                                        `}
                                    >
                                        <HiOutlinePaperAirplane
                                            size={17}
                                            className={text.trim() ? "rotate-0" : "rotate-0"}
                                        />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <EmptyState />
                    )}
                </main>
            </div>
        </div>
    );
}
