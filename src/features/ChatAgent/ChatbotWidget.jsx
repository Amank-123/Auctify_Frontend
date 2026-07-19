import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ORANGE = "#FF6B00";

const SendIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
            d="M22 2L11 13"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M22 2L15 22L11 13L2 9L22 2Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const TypingDots = () => (
    <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
            <motion.span
                key={i}
                className="block w-2 h-2 rounded-full"
                style={{ background: "#d1d5db" }}
                animate={{ y: [0, -6, 0], backgroundColor: [ORANGE, "#d1d5db", ORANGE] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
            />
        ))}
    </div>
);

const FabIcon = ({ isOpen }) => (
    <AnimatePresence mode="wait">
        <motion.span
            key={isOpen ? "x" : "chat"}
            initial={{ opacity: 0, scale: 0.2, rotate: isOpen ? -90 : 90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.2, rotate: isOpen ? 90 : -90 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className="flex items-center justify-center"
        >
            {isOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <motion.path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                </svg>
            ) : (
                <div className="relative flex items-center justify-center w-7 h-7">
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="absolute inset-0"
                    >
                        <motion.path
                            d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
                            fill="rgba(255,255,255,0.15)"
                            stroke="white"
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    </svg>
                    <div className="relative z-10 mt-[-2px]"></div>
                </div>
            )}
        </motion.span>
    </AnimatePresence>
);

const BrandAvatar = () => (
    <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 relative"
        style={{ background: ORANGE }}
    >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="absolute">
            <path
                d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
                fill="rgba(255,255,255,0.15)"
                stroke="white"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
        </svg>
    </motion.div>
);

const Message = ({ msg }) => {
    const isUser = msg.role === "user";
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.78, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
        >
            <div
                className={`max-w-[82%] px-4 py-2.5 text-[13.5px] leading-relaxed tracking-tight ${
                    isUser
                        ? "text-white rounded-[18px_18px_5px_18px]"
                        : "text-[#1a1f2e] rounded-[18px_18px_18px_5px] border border-[#e8eaee]"
                }`}
                style={{
                    background: isUser ? ORANGE : "#fff",
                    boxShadow: isUser
                        ? "0 2px 12px rgba(255,107,0,0.24)"
                        : "0 1px 5px rgba(0,0,0,0.05)",
                }}
            >
                {msg.content}
            </div>
        </motion.div>
    );
};

function spawnParticles(fabRef) {
    if (!fabRef.current) return;
    const rect = fabRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const colors = ["#FF6B00", "#ffad6b", "#ffd9c2"];
    for (let i = 0; i < 12; i++) {
        const el = document.createElement("div");
        const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.4;
        const dist = 45 + Math.random() * 55;
        Object.assign(el.style, {
            position: "fixed",
            left: cx + "px",
            top: cy + "px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: colors[i % 3],
            pointerEvents: "none",
            zIndex: "99999",
            transition: `transform ${0.5 + Math.random() * 0.35}s ease-out, opacity ${0.45 + Math.random() * 0.3}s ease-out`,
            opacity: "0.9",
            transform: "translate(-50%, -50%) scale(1)",
        });
        document.body.appendChild(el);
        requestAnimationFrame(() => {
            el.style.transform = `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(0)`;
            el.style.opacity = "0";
        });
        setTimeout(() => el.remove(), 900);
    }
}

const quickReplies = ["How does bidding work?", "List an item", "Track my order"];

const MicIcon = ({ listening }) => (
    <motion.svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        animate={listening ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 1, repeat: listening ? Infinity : 0 }}
    >
        <path
            d="M12 15C13.6569 15 15 13.6569 15 12V7C15 5.34315 13.6569 4 12 4C10.3431 4 9 5.34315 9 7V12C9 13.6569 10.3431 15 12 15Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M19 12C19 15.866 15.866 19 12 19M12 19C8.13401 19 5 15.866 5 12M12 19V22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </motion.svg>
);

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);
    const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
    const recognitionRef = useRef(null);
    // Guards against duplicate API calls (e.g. rapid clicks or double-fire)
    const isSendingRef = useRef(false);
    const [chatId] = useState(crypto.randomUUID());
    const [inputFocused, setInputFocused] = useState(false);
    const [showQuick, setShowQuick] = useState(true);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! I'm Auctify AI Assistant. How can I help you?" },
    ]);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const fabRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = useCallback(
        async (text) => {
            const msg = (text !== undefined ? text : message).trim();
            if (!msg || isSendingRef.current) return;
            isSendingRef.current = true;
            setShowQuick(false);
            setMessages((prev) => [...prev, { role: "user", content: msg }]);
            setMessage("");
            setLoading(true);
            try {
                const res = await fetch(
                    "https://auctify-rag-ai-chatbot-xlzl.onrender.com/chat",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message: msg, chat_id: chatId }),
                    },
                );
                const data = await res.json();
                setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
            } catch {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: "Something went wrong. Please try again." },
                ]);
            }
            setLoading(false);
            isSendingRef.current = false;
        },
        [chatId, message],
    );

    // Tracks whether the user manually stopped (so onend doesn't restart)
    const manualStopRef = useRef(false);
    // Snapshot of input text before mic session starts — so new speech appends to it
    const preSessionTextRef = useRef("");
    // Always-current mirror of `message` state, readable inside recognition closures
    const messageRef = useRef("");
    // Silence detection timer — stops mic after 2.5s of no speech
    const silenceTimerRef = useRef(null);

    const resetSilenceTimer = (recognition) => {
        clearTimeout(silenceTimerRef.current);
        // If user hasn't spoken for 2.5s, treat it as done speaking
        silenceTimerRef.current = setTimeout(() => {
            manualStopRef.current = true;
            recognition.stop();
        }, 2500);
    };

    // Keep messageRef in sync so recognition closures always see latest value
    useEffect(() => {
        messageRef.current = message;
    }, [message]);

    // Speech recognition — continuous mode
    // Stays alive through pauses; auto-stops only after 2.5s of true silence
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        setHasSpeechSupport(true);

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
            manualStopRef.current = false;
            // Snapshot whatever text is already in the input before we start appending
            preSessionTextRef.current = messageRef.current;
            setListening(true);
        };

        recognition.onresult = (event) => {
            let finalSoFar = "";
            let interim = "";
            for (let i = 0; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalSoFar += result[0].transcript;
                } else {
                    interim += result[0].transcript;
                }
            }
            const base = preSessionTextRef.current;
            const spoken = (finalSoFar + interim).trim();
            // Append new speech to whatever was already typed/spoken before
            setMessage(base ? base + " " + spoken : spoken);
            // Reset silence timer every time speech is detected
            resetSilenceTimer(recognition);
        };

        // onend: restart if not manually stopped (keeps alive through browser cuts)
        recognition.onend = () => {
            if (!manualStopRef.current) {
                try {
                    recognition.start();
                } catch {
                    /* ignore */
                }
            } else {
                clearTimeout(silenceTimerRef.current);
                setListening(false);
                inputRef.current?.focus();
            }
        };

        recognition.onerror = (e) => {
            if (e.error === "no-speech") return;
            clearTimeout(silenceTimerRef.current);
            manualStopRef.current = true;
            setListening(false);
        };

        recognitionRef.current = recognition;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // mount only

    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 280);
    }, [isOpen]);

    const handleMicClick = () => {
        if (!recognitionRef.current) return;
        if (listening) {
            // User manually stops
            clearTimeout(silenceTimerRef.current);
            manualStopRef.current = true;
            recognitionRef.current.stop();
        } else {
            // Don't clear message — user may have existing text they want to keep
            try {
                recognitionRef.current.start();
            } catch {
                // already started — ignore
            }
        }
    };

    const canSend = !!message.trim() && !loading && !listening;

    const handleFabClick = () => {
        if (!isOpen) spawnParticles(fabRef);
        setIsOpen((o) => !o);
    };

    return (
        <>
            {/* FAB */}
            <div className="fixed bottom-6 right-6 z-[9999]">
                <motion.button
                    ref={fabRef}
                    onClick={handleFabClick}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="relative w-14 h-14 rounded-full border-none flex items-center justify-center cursor-pointer overflow-visible"
                    style={{
                        background: ORANGE,
                        boxShadow: "0 4px 20px rgba(255,107,0,0.42), 0 1px 4px rgba(255,107,0,0.2)",
                    }}
                >
                    {!isOpen && (
                        <motion.div
                            className="absolute rounded-full pointer-events-none"
                            style={{ inset: -8, border: "1.5px solid rgba(255,107,0,0.4)" }}
                            animate={{ scale: [1, 1.55], opacity: [0.6, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                        />
                    )}
                    {!isOpen && (
                        <motion.div
                            className="absolute rounded-full pointer-events-none"
                            style={{ inset: -8, border: "1.5px solid rgba(255,107,0,0.25)" }}
                            animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeOut",
                                delay: 0.5,
                            }}
                        />
                    )}
                    <FabIcon isOpen={isOpen} />
                </motion.button>
            </div>

            {/* Chat window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.82, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.88, y: 16 }}
                        transition={{ type: "spring", stiffness: 360, damping: 30 }}
                        className="fixed bottom-[90px] right-6 z-[9998] w-[388px] h-[572px] flex flex-col rounded-3xl overflow-hidden border border-[#dde0e6]"
                        style={{
                            background: "#f5f6f8",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 14px rgba(0,0,0,0.06)",
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 px-4 py-3.5 bg-white border-b border-[#e8eaee] flex-shrink-0">
                            <BrandAvatar />
                            <div className="flex-1 min-w-0">
                                <p className="m-0 text-sm font-semibold text-[#0f1117] leading-none">
                                    Auctify AI Assistant
                                </p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <div className="inline-flex items-center gap-1 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                                        <motion.div
                                            className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"
                                            animate={{ opacity: [1, 0.35, 1] }}
                                            transition={{ duration: 2.4, repeat: Infinity }}
                                        />
                                        <span className="text-[11px] text-green-700 font-medium">
                                            Online
                                        </span>
                                    </div>
                                    <p className="m-0 text-[11.5px] text-gray-400">
                                        · replies instantly
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-[10px] border border-[#e8eaee] bg-[#fafafa] flex items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M18 6L6 18M6 6l12 12"
                                        stroke="currentColor"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </motion.button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-3.5 pt-4 pb-2 flex flex-col gap-2.5 [&::-webkit-scrollbar]:hidden">
                            {messages.map((msg, i) => (
                                <Message key={i} msg={msg} />
                            ))}
                            <AnimatePresence>
                                {loading && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.85, x: -10 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 360,
                                            damping: 28,
                                        }}
                                        className="flex"
                                    >
                                        <div
                                            className="px-4 py-3 rounded-[18px_18px_18px_5px] border border-[#e8eaee] bg-white"
                                            style={{ boxShadow: "0 1px 5px rgba(0,0,0,0.05)" }}
                                        >
                                            <TypingDots />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick replies */}
                        <AnimatePresence>
                            {showQuick && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    transition={{ duration: 0.22 }}
                                    className="flex gap-1.5 flex-wrap px-3.5 pb-2.5"
                                    style={{ background: "#f5f6f8" }}
                                >
                                    {quickReplies.map((q) => (
                                        <motion.button
                                            key={q}
                                            whileHover={{
                                                y: -2,
                                                borderColor: ORANGE,
                                                color: ORANGE,
                                            }}
                                            whileTap={{ scale: 0.94 }}
                                            onClick={() => sendMessage(q)}
                                            className="text-xs font-medium px-3 py-1.5 bg-white border border-[#e0e3e9] rounded-full text-gray-600 cursor-pointer whitespace-nowrap transition-colors"
                                            style={{ fontFamily: "Inter, sans-serif" }}
                                        >
                                            {q}
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Input */}
                        <div className="px-3 pb-3.5 pt-2.5 bg-white border-t border-[#e8eaee] flex-shrink-0">
                            <motion.div
                                animate={{
                                    borderColor: inputFocused ? ORANGE : "#e0e3e9",
                                    boxShadow: inputFocused
                                        ? "0 0 0 3px rgba(255,107,0,0.09)"
                                        : "0 0 0 0px rgba(255,107,0,0)",
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                                className="flex items-center gap-2 bg-[#f5f6f8] border-[1.5px] rounded-[14px] pl-3.5 pr-2 py-2"
                            >
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && !loading && sendMessage()
                                    }
                                    onFocus={() => setInputFocused(true)}
                                    onBlur={() => setInputFocused(false)}
                                    placeholder="Type a message…"
                                    className="flex-1 border-none bg-transparent text-[13.5px] text-[#1a1f2e] outline-none placeholder:text-[#b0b7c3]"
                                    style={{
                                        caretColor: ORANGE,
                                        fontFamily: "Inter, sans-serif",
                                    }}
                                />

                                {/* FIX 3: Mic button — separate, only shown when speech is supported */}
                                {hasSpeechSupport && (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.88 }}
                                        onClick={handleMicClick}
                                        className="w-9 h-9 rounded-[11px] border-none flex items-center justify-center flex-shrink-0"
                                        style={{
                                            background: listening
                                                ? "rgba(255,107,0,0.12)"
                                                : "transparent",
                                            color: listening ? ORANGE : "#9ca3af",
                                            cursor: "pointer",
                                        }}
                                        title={listening ? "Stop listening" : "Voice input"}
                                    >
                                        <MicIcon listening={listening} />
                                    </motion.button>
                                )}

                                {/* FIX 4: Send button — only the send icon, no mic inside */}
                                <motion.button
                                    animate={{ background: canSend ? ORANGE : "#e9ebee" }}
                                    whileHover={canSend ? { scale: 1.13, rotate: -10 } : {}}
                                    whileTap={canSend ? { scale: 0.88 } : {}}
                                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                                    onClick={() => sendMessage()}
                                    disabled={!canSend}
                                    className="w-9 h-9 rounded-[11px] border-none flex items-center justify-center flex-shrink-0"
                                    style={{
                                        color: canSend ? "#fff" : "#c0c4cc",
                                        cursor: canSend ? "pointer" : "not-allowed",
                                        boxShadow: canSend
                                            ? "0 2px 10px rgba(255,107,0,0.28)"
                                            : "none",
                                    }}
                                >
                                    <SendIcon />
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
