import { useEffect, useMemo, useRef, useState } from "react";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import { HiOutlineSearch, HiOutlineDotsVertical } from "react-icons/hi";

import { api } from "@/shared/services/axios";
import { useAuth } from "@/hooks/useAuth.js";
import { socket } from "@/shared/services/socket.js";

export default function RoomPage() {
    const { User } = useAuth();

    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const [roomsLoading, setRoomsLoading] = useState(true);

    const [chatLoading, setChatLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [text, setText] = useState("");

    const [messages, setMessages] = useState([]);

    const [unread, setUnread] = useState({});

    const [onlineUsers, setOnlineUsers] = useState([]);

    const scrollRef = useRef(null);

    /* ================= FETCH ROOMS ================= */

    const fetchRooms = async () => {
        try {
            const res = await api.get("/api/Room/getRooms");

            const data = res.data?.data || [];

            setRooms(data);

            if (data.length > 0) {
                openRoom(data[0]._id);
            }
        } catch (error) {
            console.log("FETCH ROOMS ERROR:", error);
        } finally {
            setRoomsLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    /* ================= REGISTER USER ================= */

    useEffect(() => {
        if (!User?._id) return;

        socket.emit("join_user", User._id);
    }, [User?._id]);

    /* ================= ONLINE USERS ================= */

    useEffect(() => {
        socket.on("online_users", (users) => {
            setOnlineUsers(users);
        });

        return () => {
            socket.off("online_users");
        };
    }, []);

    /* ================= OPEN ROOM ================= */

    const openRoom = async (roomId) => {
        try {
            setChatLoading(true);

            const roomRes = await api.post("/api/Room/getRoom", {
                roomId,
            });

            const room = roomRes.data?.data?.[0] || null;

            setSelectedRoom(room);

            const msgRes = await api.post("/api/message/get", {
                roomId,
            });

            setMessages(msgRes.data?.data || []);

            setUnread((prev) => ({
                ...prev,
                [roomId]: 0,
            }));
        } catch (error) {
            console.log("OPEN ROOM ERROR:", error);
        } finally {
            setChatLoading(false);
        }
    };

    /* ================= JOIN ROOM ================= */

    useEffect(() => {
        if (!selectedRoom?._id) return;

        socket.emit("join_room", selectedRoom._id);

        return () => {
            socket.emit("leave_room", selectedRoom._id);
        };
    }, [selectedRoom?._id]);

    /* ================= SEEN ================= */

    useEffect(() => {
        if (!selectedRoom?._id || !User?._id) return;

        socket.emit("message_seen", {
            roomId: selectedRoom._id,
            userId: User._id,
        });
    }, [selectedRoom?._id, User?._id]);

    /* ================= LISTEN SEEN ================= */

    useEffect(() => {
        const handleSeen = async () => {
            if (!selectedRoom?._id) return;

            try {
                const msgRes = await api.post("/api/message/get", {
                    roomId: selectedRoom._id,
                });

                setMessages(msgRes.data?.data || []);
            } catch (error) {
                console.log("SEEN REFRESH ERROR:", error);
            }
        };

        socket.on("message_seen", handleSeen);

        return () => {
            socket.off("message_seen", handleSeen);
        };
    }, [selectedRoom?._id]);

    /* ================= RECEIVE MESSAGE ================= */

    useEffect(() => {
        const handleMessage = (msg) => {
            const incomingRoom = String(msg.roomId);

            const activeRoom = String(selectedRoom?._id);

            if (incomingRoom === activeRoom) {
                setMessages((prev) => {
                    const exists = prev.some((m) => String(m._id) === String(msg._id));

                    if (exists) return prev;

                    return [...prev, msg];
                });

                setRooms((prev) =>
                    prev.map((room) =>
                        String(room._id) === incomingRoom
                            ? {
                                  ...room,
                                  lastMessage: msg.text,
                                  lastMessageAt: msg.createdAt,
                              }
                            : room,
                    ),
                );
            } else {
                setUnread((prev) => ({
                    ...prev,
                    [incomingRoom]: (prev[incomingRoom] || 0) + 1,
                }));
            }
        };

        socket.on("receive_message", handleMessage);

        return () => {
            socket.off("receive_message", handleMessage);
        };
    }, [selectedRoom?._id]);

    /* ================= AUTO SCROLL ================= */

    useEffect(() => {
        scrollRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    /* ================= SEND MESSAGE ================= */

    const sendMessage = async () => {
        if (!text.trim()) return;

        if (!selectedRoom?._id) return;

        try {
            await api.post("/api/message/send", {
                roomId: selectedRoom._id,
                text,
            });

            setText("");
        } catch (error) {
            console.log("SEND MESSAGE ERROR:", error);
        }
    };

    /* ================= HELPERS ================= */

    const isBuyerRoom = (room) => String(room?.buyerId?._id) === String(User?._id);

    const getPartner = (room) => (isBuyerRoom(room) ? room?.sellerId : room?.buyerId);

    const formatMessageTime = (date) => {
        const d = new Date(date);

        return d.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatMessageDate = (date) => {
        const d = new Date(date);

        const today = new Date();

        const yesterday = new Date();

        yesterday.setDate(today.getDate() - 1);

        if (d.toDateString() === today.toDateString()) {
            return "Today";
        }

        if (d.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        }

        const diffDays = Math.floor((today - d) / (1000 * 60 * 60 * 24));

        if (diffDays < 7) {
            return d.toLocaleDateString([], {
                weekday: "long",
            });
        }

        return d.toLocaleDateString([], {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    /* ================= SEARCH ================= */

    const filteredRooms = useMemo(() => {
        const q = search.trim().toLowerCase();

        if (!q) return rooms;

        return rooms.filter((room) => {
            const partner = getPartner(room);

            const username = partner?.username?.toLowerCase() || "";

            return username.includes(q);
        });
    }, [rooms, search]);

    /* ================= LOADING ================= */

    if (roomsLoading) {
        return (
            <div className="h-[calc(100vh-72px)] flex items-center justify-center bg-white">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-violet-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-72px)] flex overflow-hidden bg-[#f4f7fb]">
            {/* SIDEBAR */}

            <aside
                className={`
                    ${selectedRoom ? "hidden md:flex" : "flex"}
                    w-full md:w-[340px]
                    flex-col
                    bg-white
                    border-r border-slate-200
                `}
            >
                {/* HEADER */}

                <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">Messages</h2>

                        <p className="text-xs text-slate-400 mt-0.5">Your conversations</p>
                    </div>

                    <button className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center">
                        <HiOutlineDotsVertical size={18} className="text-slate-500" />
                    </button>
                </div>

                {/* SEARCH */}

                <div className="p-4 border-b border-slate-100">
                    <div className="h-11 rounded-2xl bg-slate-100 flex items-center gap-3 px-4">
                        <HiOutlineSearch size={16} className="text-slate-400" />

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search chats..."
                            className="flex-1 bg-transparent outline-none text-sm"
                        />
                    </div>
                </div>

                {/* ROOMS */}

                <div className="flex-1 overflow-y-auto">
                    {filteredRooms.map((room) => {
                        const partner = getPartner(room);

                        const unreadCount = unread[room._id] || 0;

                        const isOnline = onlineUsers.includes(String(partner?._id));

                        return (
                            <button
                                key={room._id}
                                onClick={() => openRoom(room._id)}
                                className="w-full px-4 py-3 flex items-center gap-3 border-b border-slate-50 hover:bg-slate-50"
                            >
                                {/* AVATAR */}

                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-semibold overflow-hidden">
                                        {partner?.profile ? (
                                            <img
                                                src={partner.profile}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            partner?.username?.charAt(0)?.toUpperCase()
                                        )}
                                    </div>

                                    {isOnline && (
                                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
                                    )}
                                </div>

                                {/* CONTENT */}

                                <div className="flex-1 min-w-0 text-left">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold truncate">
                                            {partner?.username}
                                        </p>

                                        <span className="text-[10px] text-slate-400">
                                            {room?.lastMessageAt
                                                ? formatMessageTime(room.lastMessageAt)
                                                : ""}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                        <p
                                            className={`text-xs truncate ${
                                                isOnline ? "text-green-500" : "text-slate-400"
                                            }`}
                                        >
                                            {isOnline
                                                ? "Online"
                                                : room?.lastMessage || "Start conversation"}
                                        </p>

                                        {unreadCount > 0 && (
                                            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-violet-600 text-white text-[10px] flex items-center justify-center">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* CHAT PANEL */}

            <main
                className={`
                    ${selectedRoom ? "flex" : "hidden md:flex"}
                    flex-1
                    flex-col
                    min-h-0
                    bg-[#eef1f6]
                `}
            >
                {!selectedRoom ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
                        <HiOutlineChatBubbleLeftRight size={48} />

                        <p>Select a conversation</p>
                    </div>
                ) : (
                    <>
                        {/* CHAT HEADER */}

                        <div className="h-16 px-4 md:px-6 bg-white border-b border-slate-200 flex items-center gap-4 shrink-0">
                            <button
                                onClick={() => setSelectedRoom(null)}
                                className="md:hidden w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"
                            >
                                ←
                            </button>

                            <div className="relative">
                                <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                                    {getPartner(selectedRoom)?.profile ? (
                                        <img
                                            src={getPartner(selectedRoom)?.profile}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        getPartner(selectedRoom)?.username?.[0]?.toUpperCase()
                                    )}
                                </div>

                                {onlineUsers.includes(String(getPartner(selectedRoom)?._id)) && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate">
                                    {getPartner(selectedRoom)?.username}
                                </p>

                                <p
                                    className={`text-xs ${
                                        onlineUsers.includes(String(getPartner(selectedRoom)?._id))
                                            ? "text-green-500"
                                            : "text-slate-400"
                                    }`}
                                >
                                    {onlineUsers.includes(String(getPartner(selectedRoom)?._id))
                                        ? "Online"
                                        : "Offline"}
                                </p>
                            </div>
                        </div>

                        {/* MESSAGES */}

                        <div className="flex-1 min-h-0 overflow-y-auto px-3 md:px-6 py-5">
                            <div className="flex flex-col gap-3">
                                {messages.map((msg, index) => {
                                    let senderId;

                                    if (msg?.senderId && typeof msg.senderId === "object") {
                                        senderId = msg.senderId._id;
                                    } else {
                                        senderId = msg?.senderId;
                                    }

                                    const mine = String(senderId) === String(User?._id);

                                    const currentDate = formatMessageDate(msg.createdAt);

                                    const prevDate =
                                        index > 0
                                            ? formatMessageDate(messages[index - 1].createdAt)
                                            : null;

                                    const showDate = currentDate !== prevDate;

                                    return (
                                        <div key={msg._id}>
                                            {/* DATE */}

                                            {showDate && (
                                                <div className="flex justify-center mb-4 mt-2">
                                                    <div className="px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] text-slate-500 shadow-sm">
                                                        {currentDate}
                                                    </div>
                                                </div>
                                            )}

                                            {/* MESSAGE */}

                                            <div
                                                className={`flex ${
                                                    mine ? "justify-end" : "justify-start"
                                                }`}
                                            >
                                                <div
                                                    className={`
                                                            max-w-[85%] md:max-w-[65%]
                                                            px-4 py-3
                                                            rounded-3xl
                                                            text-sm
                                                            shadow-sm
                                                            ${
                                                                mine
                                                                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-md"
                                                                    : "bg-white text-slate-700 rounded-bl-md"
                                                            }
                                                        `}
                                                >
                                                    {/* TEXT */}

                                                    <p className="leading-relaxed break-words">
                                                        {msg.text}
                                                    </p>

                                                    {/* TIME + TICKS */}

                                                    <div className="flex justify-end items-center gap-1 mt-2">
                                                        {/* TIME */}

                                                        <span
                                                            className={`text-[10px] ${
                                                                mine
                                                                    ? "text-violet-100"
                                                                    : "text-slate-400"
                                                            }`}
                                                        >
                                                            {formatMessageTime(msg.createdAt)}
                                                        </span>

                                                        {/* TICKS */}

                                                        {mine &&
                                                            (() => {
                                                                const partnerId = String(
                                                                    getPartner(selectedRoom)?._id,
                                                                );

                                                                const seenBy =
                                                                    msg?.seenBy?.map((user) => {
                                                                        if (
                                                                            typeof user ===
                                                                                "object" &&
                                                                            user !== null
                                                                        ) {
                                                                            return String(
                                                                                user._id || user,
                                                                            );
                                                                        }

                                                                        return String(user);
                                                                    }) || [];

                                                                const seenByPartner =
                                                                    seenBy.includes(partnerId);

                                                                return (
                                                                    <span
                                                                        className={`text-[11px] ${
                                                                            seenByPartner
                                                                                ? "text-sky-300"
                                                                                : seenBy.length > 0
                                                                                  ? "text-violet-100"
                                                                                  : "text-violet-200"
                                                                        }`}
                                                                    >
                                                                        {seenBy.length > 0
                                                                            ? "✓✓"
                                                                            : "✓"}
                                                                    </span>
                                                                );
                                                            })()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div ref={scrollRef} />
                            </div>
                        </div>

                        {/* INPUT */}

                        <div className="px-3 md:px-5 py-3 bg-white border-t border-slate-200 shrink-0 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-12 rounded-full bg-slate-100 border border-slate-200 px-5 flex items-center">
                                    <input
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-transparent outline-none text-sm"
                                    />
                                </div>

                                <button
                                    onClick={sendMessage}
                                    className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-center"
                                >
                                    <HiOutlinePaperAirplane size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
