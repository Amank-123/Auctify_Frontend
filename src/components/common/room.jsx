import { useEffect, useRef, useState } from "react";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import { api } from "@/shared/services/axios";
import { useAuth } from "@/hooks/useAuth";
import { socket } from "@/shared/services/socket";

export default function RoomPage() {
    const { User } = useAuth();

    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const [messages, setMessages] = useState([]);

    const [text, setText] = useState("");

    const [onlineUsers, setOnlineUsers] = useState([]);

    const [typingUsers, setTypingUsers] = useState([]);

    const scrollRef = useRef(null);

    const typingTimeout = useRef(null);

    // NEW: search state + mobile sidebar toggle
    const [search, setSearch] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    /* ================= REGISTER USER ================= */

    useEffect(() => {
        if (!User?._id) return;
        socket.emit("join_user", User._id);
    }, [User?._id]);

    /* ================= FETCH ROOMS ================= */

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await api.get("/api/Room/getRooms");
                const data = res.data?.data || [];
                setRooms(data);
                if (data.length > 0) {
                    selectRoom(data[0]);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchRooms();
    }, []);

    /* ================= SELECT ROOM ================= */

    const selectRoom = async (room) => {
        try {
            setSelectedRoom(room);
            setSidebarOpen(false); // close sidebar on mobile after selecting
            socket.emit("join_room", room._id);
            const res = await api.post("/api/message/get", { roomId: room._id });
            setMessages(res.data.data);
            socket.emit("message_seen", { roomId: room._id, userId: User._id });
        } catch (error) {
            console.log(error);
        }
    };

    /* ================= ONLINE USERS ================= */

    useEffect(() => {
        const handleOnlineUsers = (users) => setOnlineUsers(users);
        socket.on("online_users", handleOnlineUsers);
        return () => socket.off("online_users", handleOnlineUsers);
    }, []);

    /* ================= RECEIVE MESSAGE ================= */

    useEffect(() => {
        const handleMessage = (msg) => {
            if (String(msg.roomId) !== String(selectedRoom?._id)) return;
            setMessages((prev) => [...prev, msg]);
            socket.emit("message_seen", { roomId: selectedRoom._id, userId: User._id });
        };
        socket.on("receive_message", handleMessage);
        return () => socket.off("receive_message", handleMessage);
    }, [selectedRoom, User?._id]);

    /* ================= SEEN ================= */

    useEffect(() => {
        const handleSeen = ({ messageIds, seenBy }) => {
            setMessages((prev) =>
                prev.map((msg) => {
                    const shouldUpdate = messageIds.some((id) => String(id) === String(msg._id));
                    if (!shouldUpdate) return msg;
                    const alreadySeen = (msg.seenBy || []).some(
                        (id) => String(id) === String(seenBy),
                    );
                    if (alreadySeen) return msg;
                    return { ...msg, seenBy: [...(msg.seenBy || []), seenBy] };
                }),
            );
        };
        socket.on("message_seen", handleSeen);
        return () => socket.off("message_seen", handleSeen);
    }, []);

    /* ================= TYPING ================= */

    useEffect(() => {
        const handleTyping = ({ userId }) => {
            setTypingUsers((prev) => {
                const exists = prev.some((id) => String(id) === String(userId));
                if (exists) return prev;
                return [...prev, userId];
            });
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
    }, []);

    /* ================= AUTO SCROLL ================= */

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /* ================= SEND ================= */

    const sendMessage = async () => {
        if (!text.trim()) return;
        try {
            socket.emit("stop_typing", { roomId: selectedRoom._id, userId: User._id });
            await api.post("/api/message/send", { roomId: selectedRoom._id, text });
            setText("");
        } catch (error) {
            console.log(error);
        }
    };

    /* ================= HELPERS ================= */

    const getPartner = (room) => {
        if (!room) return null;
        return String(room?.buyerId?._id) === String(User?._id) ? room?.sellerId : room?.buyerId;
    };

    const partner = getPartner(selectedRoom);
    const isOnline = onlineUsers.some((id) => String(id) === String(partner?._id));
    const isTyping = typingUsers.some((id) => String(id) === String(partner?._id));

    // Filter rooms by search
    const filteredRooms = rooms.filter((room) => {
        const p = getPartner(room);
        return p?.username?.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="h-[calc(100vh-64px)] flex bg-slate-50 font-sans overflow-hidden relative">
            {/* ===== MOBILE OVERLAY ===== */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ===== SIDEBAR ===== */}
            <div
                className={`
                    fixed md:relative z-30 md:z-auto
                    w-[300px] h-[calc(100vh-64px)] md:h-full flex flex-col bg-white border-r border-slate-100 shrink-0
                    transition-transform duration-300
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >
                {/* Sidebar top header */}
                <div className="px-4 pt-5 pb-3 border-b border-slate-100">
                    <h2 className="text-slate-800 font-semibold text-base mb-3">Messages</h2>

                    {/* Search — real input */}
                    <div className="flex items-center gap-2 h-9 px-3 rounded-lg bg-slate-100 border border-slate-200 focus-within:border-orange-400 focus-within:bg-white transition-colors">
                        <svg
                            className="w-3.5 h-3.5 text-slate-400 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="flex-1 bg-transparent outline-none text-xs text-slate-700 placeholder:text-slate-400"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="text-slate-400 hover:text-slate-600 text-xs leading-none"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Room list */}
                <div className="flex-1 overflow-y-auto">
                    {filteredRooms.length === 0 && (
                        <p className="text-xs text-slate-400 text-center py-8">
                            No conversations found
                        </p>
                    )}
                    {filteredRooms.map((room) => {
                        const p = getPartner(room);
                        const active = selectedRoom?._id === room._id;
                        const pIsTyping = typingUsers.some((id) => String(id) === String(p?._id));
                        const pIsOnline = onlineUsers.some((id) => String(id) === String(p?._id));

                        return (
                            <button
                                key={room._id}
                                onClick={() => selectRoom(room)}
                                className={`w-full px-4 py-3 flex items-center gap-3 text-left relative transition-colors border-b border-slate-50 ${
                                    active ? "bg-orange-50" : "hover:bg-slate-50"
                                }`}
                            >
                                {active && (
                                    <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-orange-500 rounded-r-full" />
                                )}

                                {/* Avatar */}
                                <div className="relative shrink-0">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                                            active
                                                ? "bg-orange-100 text-orange-600"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        {p?.username?.[0]?.toUpperCase()}
                                    </div>
                                    {pIsOnline && (
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p
                                        className={`text-sm font-medium truncate ${active ? "text-orange-700" : "text-slate-800"}`}
                                    >
                                        {p?.username}
                                    </p>
                                    {/* <p
                                        className={`text-xs truncate ${
                                            pIsTyping
                                                ? "text-orange-500 font-medium"
                                                : pIsOnline
                                                  ? "text-green-500"
                                                  : "text-slate-400"
                                        }`}
                                    >
                                        {pIsTyping
                                            ? "typing..."
                                            : pIsOnline
                                              ? "Online"
                                              : room?.lastMessage || ""}
                                    </p> */}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ===== CHAT PANEL ===== */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                {/* Chat Header */}
                <div className="h-16 bg-white border-b border-slate-100 px-4 md:px-5 flex items-center gap-3 shrink-0 z-10">
                    {/* Mobile hamburger to open sidebar */}
                    <button
                        className="md:hidden w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    {/* Partner avatar */}
                    <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-semibold">
                            {partner?.username?.[0]?.toUpperCase()}
                        </div>
                        {isOnline && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
                        )}
                    </div>

                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                            {partner?.username}
                        </p>
                        <p
                            className={`text-xs ${
                                isTyping
                                    ? "text-orange-500"
                                    : isOnline
                                      ? "text-green-500"
                                      : "text-slate-400"
                            }`}
                        >
                            {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
                        </p>
                    </div>

                    {/* Right icons */}
                    <div className="ml-auto flex items-center gap-2">
                        <button className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 10l4.55-2.27A1 1 0 0 1 21 8.68v6.64a1 1 0 0 1-1.45.9L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"
                                />
                            </svg>
                        </button>
                        <button className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .95.68l1.45 4.36a1 1 0 0 1-.23 1.04l-1.5 1.5a11 11 0 0 0 4.47 4.47l1.5-1.5a1 1 0 0 1 1.04-.23l4.36 1.45a1 1 0 0 1 .68.95V19a2 2 0 0 1-2 2A17 17 0 0 1 3 5z"
                                />
                            </svg>
                        </button>
                        <button className="hidden sm:flex w-8 h-8 rounded-full hover:bg-slate-100 items-center justify-center text-slate-400 transition-colors">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Messages — scrollable area with bottom padding to clear the input bar */}
                <div className="flex-1 overflow-y-auto px-3 md:px-6 py-5 flex flex-col gap-3 pb-24">
                    {messages.map((msg) => {
                        const senderId =
                            typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
                        const mine = String(senderId) === String(User?._id);
                        const seen = (msg.seenBy || []).some(
                            (id) => String(id) === String(partner?._id),
                        );

                        return (
                            <div
                                key={msg._id}
                                className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}
                            >
                                {!mine && (
                                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-semibold shrink-0 mb-1">
                                        {partner?.username?.[0]?.toUpperCase()}
                                    </div>
                                )}

                                <div
                                    className={`px-4 py-2.5 rounded-2xl max-w-[75%] sm:max-w-[60%] ${
                                        mine
                                            ? "bg-orange-500 text-white rounded-br-sm"
                                            : "bg-white text-slate-700 border border-slate-100 shadow-sm rounded-bl-sm"
                                    }`}
                                >
                                    <p className="text-sm leading-relaxed break-words">
                                        {msg.text}
                                    </p>

                                    <div className="flex items-center justify-end gap-1 mt-1">
                                        <span
                                            className={`text-[10px] ${mine ? "text-orange-100" : "text-slate-400"}`}
                                        >
                                            {new Date(msg.createdAt).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                        {mine && (
                                            <span
                                                className={`text-[11px] ${seen ? "text-orange-200" : "text-orange-300"}`}
                                            >
                                                {seen ? "✓✓" : "✓"}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {mine && (
                                    <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-semibold shrink-0 mb-1">
                                        {User?.username?.[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div ref={scrollRef} />
                </div>

                {/* Input Bar — absolutely positioned at bottom of chat panel */}
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-3 md:px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 flex items-center h-11 px-4 rounded-full border border-slate-200 bg-slate-50 focus-within:border-orange-400 focus-within:bg-white transition-colors">
                        <input
                            value={text}
                            onChange={(e) => {
                                setText(e.target.value);
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
                                }, 1000);
                            }}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Type message..."
                            className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                        />
                    </div>

                    <button
                        onClick={sendMessage}
                        className="w-11 h-11 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white flex items-center justify-center transition-all shrink-0"
                    >
                        <HiOutlinePaperAirplane size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
