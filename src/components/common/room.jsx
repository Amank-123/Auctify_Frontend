import { useEffect, useMemo, useRef, useState } from "react";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import {
    HiOutlineSearch,
    HiOutlineDotsVertical,
    HiOutlineStar,
    HiOutlineInformationCircle,
    HiOutlineUserCircle,
} from "react-icons/hi";

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
    const scrollRef = useRef(null);

    /* ================= FETCH ROOMS ================= */
    const fetchRooms = async () => {
        try {
            const res = await api.get("/api/Room/getRooms");
            const data = res.data?.data || [];
            setRooms(data);
            if (data.length > 0) openRoom(data[0]._id);
        } catch (error) {
            console.log(error);
        } finally {
            setRoomsLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    /* ================= OPEN ROOM ================= */
    const openRoom = async (roomId) => {
        try {
            setChatLoading(true);
            const roomRes = await api.post("/api/Room/getRoom", { roomId });
            const room = roomRes.data?.data?.[0] || null;
            setSelectedRoom(room);
            const msgRes = await api.post("/api/message/get", { roomId });
            setMessages(msgRes.data?.data || []);
            setUnread((prev) => ({ ...prev, [roomId]: 0 }));
        } catch (error) {
            console.log(error);
        } finally {
            setChatLoading(false);
        }
    };

    /* ================= ROOM JOIN / LEAVE ================= */
    useEffect(() => {
        if (!selectedRoom?._id) return;
        const roomId = selectedRoom._id;
        socket.emit("join_room", roomId);
        return () => {
            socket.emit("leave_room", roomId);
        };
    }, [selectedRoom?._id]);

    /* ================= LIVE RECEIVE ================= */
    useEffect(() => {
        const handleMessage = (msg) => {
            const incomingRoom = String(msg.roomId);
            const activeRoom = String(selectedRoom?._id);
            if (incomingRoom === activeRoom) {
                setMessages((prev) => [...prev, msg]);
                setRooms((prev) =>
                    prev.map((room) =>
                        String(room._id) === incomingRoom
                            ? { ...room, lastMessage: msg.text, lastMessageAt: msg.createdAt }
                            : room,
                    ),
                );
            } else {
                setUnread((prev) => ({ ...prev, [incomingRoom]: (prev[incomingRoom] || 0) + 1 }));
                setRooms((prev) =>
                    prev.map((room) =>
                        String(room._id) === incomingRoom
                            ? { ...room, lastMessage: msg.text, lastMessageAt: msg.createdAt }
                            : room,
                    ),
                );
            }
        };
        socket.on("receive_message", handleMessage);
        return () => {
            socket.off("receive_message", handleMessage);
        };
    }, [selectedRoom]);

    /* ================= SEND ================= */
    const sendMessage = async () => {
        if (!text.trim() || !selectedRoom?._id) return;
        try {
            await api.post("/api/message/send", { roomId: selectedRoom._id, text });
            setText("");
        } catch (error) {
            console.log(error);
        }
    };

    /* ================= HELPERS ================= */
    const isBuyerRoom = (room) => String(room?.buyerId?._id) === String(User?._id);
    const getPartner = (room) => (isBuyerRoom(room) ? room?.sellerId : room?.buyerId);
    const getRoleText = (room) =>
        isBuyerRoom(room) ? "You bought this item" : "You sold this item";

    /* ================= SEARCH ================= */
    const filteredRooms = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return rooms;
        return rooms.filter((room) => {
            const partner = getPartner(room);
            const username = partner?.username?.toLowerCase() || "";
            const title = room?.auctionId?.name?.toLowerCase() || "";
            return username.includes(q) || title.includes(q);
        });
    }, [rooms, search]);

    /* ================= LOADING ================= */
    if (roomsLoading) {
        return (
            <div className="h-[calc(100vh-72px)] flex items-center justify-center bg-white">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-72px)] flex overflow-hidden bg-slate-50">
            {/* ================= LEFT SIDEBAR ================= */}
            <aside className="w-full md:w-[300px] flex flex-col border-r border-slate-100 bg-white">
                {/* Sidebar Header */}
                <div className="px-5 pt-5 pb-3">
                    <h2 className="text-base font-semibold text-slate-800 mb-3">Messages</h2>
                    <div className="flex items-center gap-2 px-3 h-9 rounded-lg bg-slate-100 border border-slate-200">
                        <HiOutlineSearch size={14} className="text-slate-400 shrink-0" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="flex-1 bg-transparent outline-none text-xs text-slate-700 placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Room List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredRooms.map((room) => {
                        const partner = getPartner(room);
                        const active = selectedRoom?._id === room._id;
                        const unreadCount = unread[room._id] || 0;

                        return (
                            <button
                                key={room._id}
                                onClick={() => openRoom(room._id)}
                                className={`w-full px-4 py-3 flex items-center gap-3 text-left relative transition-colors border-b border-slate-50 ${
                                    active ? "bg-orange-50" : "hover:bg-slate-50"
                                }`}
                            >
                                {/* Active indicator */}
                                {active && (
                                    <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-orange-500 rounded-r-full" />
                                )}

                                {/* Avatar */}
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                                        active
                                            ? "bg-orange-100 text-orange-600"
                                            : "bg-slate-100 text-slate-500"
                                    }`}
                                >
                                    {partner?.username?.charAt(0)?.toUpperCase() || "U"}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                        <p
                                            className={`text-sm font-medium truncate ${
                                                active ? "text-orange-700" : "text-slate-800"
                                            }`}
                                        >
                                            {partner?.username}
                                        </p>
                                        {unreadCount > 0 && (
                                            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 text-white text-[10px] font-medium flex items-center justify-center shrink-0">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 truncate">
                                        {room.lastMessage || room?.auctionId?.name}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* ================= RIGHT CHAT PANEL ================= */}
            <main className="hidden md:flex flex-1 flex-col min-h-0 bg-slate-50">
                {chatLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-slate-200 border-t-orange-500 rounded-full animate-spin" />
                    </div>
                ) : !selectedRoom ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-300">
                        <HiOutlineChatBubbleLeftRight size={40} />
                        <p className="text-sm">Select a conversation</p>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center gap-4">
                            {/* Auction thumbnail */}
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                {selectedRoom?.auctionId?.media?.[0]?.[0] && (
                                    <img
                                        src={selectedRoom.auctionId.media[0][0]}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate">
                                    {getPartner(selectedRoom)?.username}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {getRoleText(selectedRoom)}
                                </p>
                            </div>

                            {/* Action icons */}
                            <div className="flex items-center gap-0.5">
                                {[
                                    HiOutlineUserCircle,
                                    HiOutlineStar,
                                    HiOutlineInformationCircle,
                                    HiOutlineDotsVertical,
                                ].map((Icon, i) => (
                                    <button
                                        key={i}
                                        className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <Icon size={17} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Messages Body */}
                        <div className="flex-1 overflow-y-auto px-6 py-5">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-300">
                                    <HiOutlineChatBubbleLeftRight size={32} />
                                    <p className="text-sm">No messages yet. Say hello!</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {messages.map((msg) => {
                                        const mine =
                                            String(msg?.senderId?._id) === String(User?._id);

                                        return (
                                            <div
                                                key={msg._id}
                                                className={`flex ${mine ? "justify-end" : "justify-start"}`}
                                            >
                                                <div
                                                    className={`max-w-[68%] px-4 py-2.5 text-sm leading-relaxed ${
                                                        mine
                                                            ? "bg-orange-500 text-white rounded-2xl rounded-br-sm"
                                                            : "bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-bl-sm shadow-sm"
                                                    }`}
                                                >
                                                    {msg.text}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={scrollRef} />
                                </div>
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="px-5 py-4 bg-white border-t border-slate-100">
                            <div className="flex items-center gap-3 px-4 h-12 rounded-xl border border-slate-200 bg-slate-50 focus-within:border-orange-300 focus-within:bg-white transition-colors">
                                <input
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    placeholder="Write a message..."
                                    className="flex-1 outline-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="w-8 h-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors shrink-0"
                                >
                                    <HiOutlinePaperAirplane size={15} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
