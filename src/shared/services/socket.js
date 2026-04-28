import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL;

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ["websocket", "polling"], // Try websocket first
});

// Optional: Add useful logs
socket.on("connect", () => {
    console.log("✅ Socket connected successfully:", socket.id);
});

socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected. Reason:", reason);
});

socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
});

export default socket;
