import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import { api } from "@/shared/services/axios";
import { useAuth } from "@/hooks/useAuth";
import { socket } from "@/shared/services/socket";
import { ArrowLeft } from "lucide-react";

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

function getSenderId(message) {
    return typeof message?.senderId === "object" ? message.senderId?._id : message?.senderId;
}

function getDateKey(ts) {
    if (!ts) return "Unknown";

    const d = new Date(ts);
    const now = new Date();
    const diff = Math.floor((now - d) / 86400000);

    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";

    return d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
}

function getTimeLabel(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function sortMessages(list = []) {
    return [...list].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
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

function TypingBubble({ partner }) {
    return (
        <div className="flex items-end gap-2">
            <Avatar name={partner?.username} image={partner?.profile} size="sm" />
            <div className="flex gap-1 rounded-2xl bg-zinc-200 px-3 py-2.5">
                <span
                    className="h-2 w-2 animate-bounce rounded-full bg-zinc-500"
                    style={{ animationDelay: "0ms" }}
                />
                <span
                    className="h-2 w-2 animate-bounce rounded-full bg-zinc-500"
                    style={{ animationDelay: "150ms" }}
                />
                <span
                    className="h-2 w-2 animate-bounce rounded-full bg-zinc-500"
                    style={{ animationDelay: "300ms" }}
                />
            </div>
        </div>
    );
}

function buildFallbackRoom(roomId) {
    return roomId ? { _id: roomId, auctionId: { name: "Conversation", media: [] } } : null;
}

export default function ChatRoom() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { User } = useAuth();
    const { rooms, onlineUsers, typingUsers, chatCacheRef } = useOutletContext();

    const [selectedRoom, setSelectedRoom] = useState(() => buildFallbackRoom(roomId));
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loadingMessages, setLoadingMessages] = useState(true);

    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const typingTimeout = useRef(null);
    const selectedRoomRef = useRef(buildFallbackRoom(roomId));
    const requestIdRef = useRef(0);

    const getPartner = (room) => {
        if (!room || !User?._id) return null;
        return String(room?.buyerId?._id) === String(User?._id) ? room?.sellerId : room?.buyerId;
    };

    const getRoomTitle = (room) => {
        const partnerUser = getPartner(room);
        const auctionTitle = room?.auctionId?.name || "Conversation";
        const username = partnerUser?.username || "";
        return username ? `${auctionTitle} (${username})` : auctionTitle;
    };

    const getAuctionImage = (room) => {
        const media = room?.auctionId?.media;
        if (!Array.isArray(media) || media.length === 0) return "";
        if (Array.isArray(media[0])) return media[0][0] || "";
        return media[0] || "";
    };

    const partner = getPartner(selectedRoom);
    const isOnline = onlineUsers.some((id) => String(id) === String(partner?._id));
    const partnerIsTyping = typingUsers.some((id) => String(id) === String(partner?._id));

    useEffect(() => {
        if (!roomId) return;

        const roomFromRooms = rooms.find((r) => String(r._id) === String(roomId));
        const roomFromState =
            location.state?.room && String(location.state?.room?._id) === String(roomId)
                ? location.state.room
                : null;
        const roomFromCache = chatCacheRef.current.get(roomId)?.room;

        const resolvedRoom =
            roomFromRooms || roomFromState || roomFromCache || buildFallbackRoom(roomId);

        setSelectedRoom(resolvedRoom);
        selectedRoomRef.current = resolvedRoom;

        if (resolvedRoom?._id) {
            const existingCache = chatCacheRef.current.get(resolvedRoom._id) || {};
            chatCacheRef.current.set(resolvedRoom._id, {
                ...existingCache,
                room: resolvedRoom,
                messages: existingCache.messages || [],
            });
        }
    }, [roomId, rooms, location.state, chatCacheRef]);

    useEffect(() => {
        if (!roomId || !User?._id) return;

        let mounted = true;
        const currentRequestId = ++requestIdRef.current;

        const cachedEntry = chatCacheRef.current.get(roomId);
        const cachedMessages = Array.isArray(cachedEntry?.messages) ? cachedEntry.messages : [];

        if (cachedEntry?.room) {
            setSelectedRoom(cachedEntry.room);
            selectedRoomRef.current = cachedEntry.room;
        }

        if (cachedMessages.length > 0) {
            setMessages(cachedMessages);
            setLoadingMessages(false);
        } else {
            setMessages([]);
            setLoadingMessages(true);
        }

        (async () => {
            try {
                const msgRes = await api.post("/api/message/get", {
                    roomId,
                });

                if (!mounted || currentRequestId !== requestIdRef.current) return;

                const msgs = Array.isArray(msgRes.data?.data) ? msgRes.data.data : [];
                const sorted = sortMessages(msgs);

                const roomToStore = selectedRoomRef.current || buildFallbackRoom(roomId);
                chatCacheRef.current.set(roomId, {
                    room: roomToStore,
                    messages: sorted,
                });

                setMessages(sorted);

                socket.emit("message_seen", {
                    roomId,
                    userId: User._id,
                });
            } catch {
                // keep cached messages if the request fails
            } finally {
                if (mounted && currentRequestId === requestIdRef.current) {
                    setLoadingMessages(false);
                    requestAnimationFrame(() => inputRef.current?.focus());
                }
            }
        })();

        return () => {
            mounted = false;
        };
    }, [roomId, User?._id, chatCacheRef]);

    useEffect(() => {
        const handler = (msg) => {
            const activeRoomId = selectedRoomRef.current?._id;
            if (!msg?.roomId) return;
            if (String(msg.roomId) !== String(activeRoomId)) return;

            setMessages((prev) => {
                const exists = prev.some((m) => String(m._id) === String(msg._id));
                if (exists) return prev;

                const next = [...prev, msg];

                const cache = chatCacheRef.current.get(activeRoomId);
                if (cache) {
                    chatCacheRef.current.set(activeRoomId, {
                        ...cache,
                        messages: next,
                    });
                } else if (selectedRoomRef.current) {
                    chatCacheRef.current.set(activeRoomId, {
                        room: selectedRoomRef.current,
                        messages: next,
                    });
                }

                return next;
            });

            if (User?._id) {
                socket.emit("message_seen", {
                    roomId: activeRoomId,
                    userId: User._id,
                });
            }
        };

        socket.on("receive_message", handler);
        return () => socket.off("receive_message", handler);
    }, [User?._id, chatCacheRef]);

    useEffect(() => {
        const handler = ({ messageIds, seenBy }) => {
            setMessages((prev) => {
                const updated = prev.map((msg) => {
                    if (!Array.isArray(messageIds)) return msg;
                    if (!messageIds.some((id) => String(id) === String(msg._id))) return msg;

                    const current = Array.isArray(msg.seenBy) ? msg.seenBy : [];
                    if (current.some((id) => String(id) === String(seenBy))) return msg;

                    return {
                        ...msg,
                        seenBy: [...current, seenBy],
                    };
                });

                const activeRoomId = selectedRoomRef.current?._id;
                if (activeRoomId) {
                    const cache = chatCacheRef.current.get(activeRoomId);
                    if (cache) {
                        chatCacheRef.current.set(activeRoomId, {
                            ...cache,
                            messages: updated,
                        });
                    }
                }

                return updated;
            });
        };

        socket.on("message_seen", handler);
        return () => socket.off("message_seen", handler);
    }, [chatCacheRef]);

    useEffect(() => {
        return () => {
            clearTimeout(typingTimeout.current);
        };
    }, []);

    useEffect(() => {
        if (loadingMessages) return;

        scrollRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages, loadingMessages]);

    const sendMessage = () => {
        const trimmed = text.trim();
        if (!trimmed || !selectedRoom?._id || !User?._id) return;

        socket.emit("stop_typing", {
            roomId: selectedRoom._id,
            userId: User._id,
        });

        socket.emit("send_message", {
            roomId: selectedRoom._id,
            senderId: User._id,
            text: trimmed,
        });

        setText("");
        inputRef.current?.focus();

        requestAnimationFrame(() => {
            scrollRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        });
    };

    const groupedMessages = useMemo(() => {
        return sortMessages(messages).reduce((acc, msg) => {
            const key = getDateKey(msg.createdAt);
            if (!acc[key]) acc[key] = [];
            acc[key].push(msg);
            return acc;
        }, {});
    }, [messages]);

    return (
        <div className="flex h-[100dvh] flex-col overflow-hidden bg-white">
            <header className="flex shrink-0 items-center gap-2 border-b border-zinc-200 bg-white px-3 py-3 sm:px-4">
                <button
                    type="button"
                    className="rounded-xl p-1 text-zinc-600 hover:bg-zinc-100 md:hidden"
                    onClick={() => navigate("/chats")}
                    title="Open conversations"
                >
                    <ArrowLeft />
                </button>

                <div className="relative shrink-0">
                    {getAuctionImage(selectedRoom) ? (
                        <img
                            src={getAuctionImage(selectedRoom)}
                            alt={selectedRoom?.auctionId?.name || "Conversation"}
                            className="h-10 w-10 rounded-xl object-cover border border-zinc-200"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-xs font-semibold text-zinc-500">
                            CHAT
                        </div>
                    )}

                    {isOnline && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold leading-tight">
                        {getRoomTitle(selectedRoom)}
                    </p>
                    <p
                        className={`text-[11.5px] font-medium ${
                            partnerIsTyping
                                ? "text-orange-600"
                                : isOnline
                                  ? "text-emerald-600"
                                  : "text-zinc-500"
                        }`}
                    >
                        {partnerIsTyping ? "typing..." : isOnline ? "Online" : "Offline"}
                    </p>
                </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5">
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
                    {loadingMessages && (
                        <div className="flex justify-center py-4">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-200 border-t-orange-500" />
                        </div>
                    )}

                    {!loadingMessages && messages.length === 0 ? (
                        <div className="flex items-center justify-center py-20 text-sm text-zinc-500">
                            No messages yet.
                        </div>
                    ) : (
                        Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
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
                                        const mine = String(senderId) === String(User?._id);
                                        const prevSenderId =
                                            idx > 0 ? getSenderId(msgs[idx - 1]) : null;
                                        const firstInCluster =
                                            !prevSenderId ||
                                            String(prevSenderId) !== String(senderId);
                                        const seenByPartner = Array.isArray(msg.seenBy)
                                            ? msg.seenBy.some(
                                                  (id) => String(id) === String(partner?._id),
                                              )
                                            : false;

                                        return (
                                            <div
                                                key={msg._id}
                                                className={`flex w-full ${
                                                    mine ? "justify-end" : "justify-start"
                                                }`}
                                            >
                                                <div
                                                    className={`flex max-w-[78%] items-end gap-2 ${
                                                        mine ? "flex-row-reverse" : "flex-row"
                                                    }`}
                                                >
                                                    <div className="w-8 shrink-0">
                                                        {firstInCluster && (
                                                            <Avatar
                                                                name={
                                                                    mine
                                                                        ? User?.username
                                                                        : partner?.username
                                                                }
                                                                image={
                                                                    mine
                                                                        ? User?.profile
                                                                        : partner?.profile
                                                                }
                                                                size="sm"
                                                            />
                                                        )}
                                                    </div>

                                                    <div
                                                        className={`rounded-2xl px-3 py-2 shadow-sm ${
                                                            mine
                                                                ? "rounded-br-md bg-orange-500 text-white"
                                                                : "rounded-bl-md border border-zinc-200 bg-white text-zinc-900"
                                                        }`}
                                                    >
                                                        <p className="break-words text-[13px] leading-[1.45]">
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
                                                                {getTimeLabel(msg.createdAt)}
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
                                                                        double={seenByPartner}
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
                        ))
                    )}

                    {partnerIsTyping && <TypingBubble partner={partner} />}
                    <div ref={scrollRef} />
                </div>
            </div>

            <div className="shrink-0 border-t border-zinc-200 bg-white px-3 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] sm:px-4">
                <div className="mx-auto flex w-full max-w-5xl items-end gap-2">
                    <div className="flex-1 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 transition focus-within:border-orange-300 focus-within:bg-white">
                        <textarea
                            ref={inputRef}
                            value={text}
                            onChange={(e) => {
                                setText(e.target.value);

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
                        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition ${
                            text.trim()
                                ? "bg-orange-500 text-white shadow-sm hover:bg-orange-600 active:scale-95"
                                : "cursor-not-allowed bg-zinc-100 text-zinc-400"
                        }`}
                    >
                        <HiOutlinePaperAirplane size={17} />
                    </button>
                </div>
            </div>
        </div>
    );
}
