import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useAuth } from "@/hooks/useAuth.js"; 
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_BASE_URL, {
  withCredentials: true,
});

export default function ChatRoomPage() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const { User } = useAuth(); // ✅ current user

  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // ---------------- LOAD ROOM ----------------
  useEffect(() => {
    if (state) setRoom(state);
  }, [state]);

  // ---------------- SOCKET SETUP ----------------
  useEffect(() => {
    if (!roomId) return;

    socket.emit("joinRoom", roomId);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("leaveRoom", roomId);
      socket.off("receiveMessage");
    };
  }, [roomId]);

  // ---------------- SEND MESSAGE ----------------
  const sendMessage = () => {
    if (!text.trim()) return;

    const newMessage = {
      _id: Date.now(),
      text,
      senderId: User?._id, // ✅ IMPORTANT
      createdAt: new Date(),
      roomId,
    };

    // optimistic UI
    setMessages((prev) => [...prev, newMessage]);

    // emit to backend
    socket.emit("sendMessage", newMessage);

    setText("");
  };

  return (
    <div className="h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center"
        >
          <HiOutlineArrowLeft size={20} />
        </button>

        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 shrink-0">
          {room?.auctionId?.media?.[0]?.[0] && (
            <img
              src={room.auctionId.media[0][0]}
              alt="auction"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="min-w-0">
          <h1 className="font-semibold text-slate-800 truncate">
            {room?.auctionId?.name || "Chat Room"}
          </h1>
          <p className="text-sm text-slate-500">Room ID: {roomId}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            Start your conversation
          </div>
        ) : (
          messages.map((msg) => {
            // ✅ UNIVERSAL FIX (handles all cases)
            const senderId =
              msg.senderId?._id || msg.senderId || null;

            const isMine =
              senderId?.toString() === User?._id?.toString();

            return (
              <div
                key={msg._id}
                className={`flex ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                    isMine
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white text-slate-700 rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t px-4 py-3">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 h-12 px-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={sendMessage}
            className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition"
          >
            <HiOutlinePaperAirplane size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}