"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import {
    Menu,
    Trash2,
    Send,
    Users,
    ChevronLeft,
    ChevronDown,
    Smile,
    Zap,
    Copy,
    Check,
    Lock,
    EyeOff
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
    ref,
    push,
    onChildAdded,
    onValue,
    set,
    remove,
    onDisconnect,
    off,
    query,
    orderByChild,
} from "firebase/database";

interface ChatMessage {
    id: string;
    system?: boolean;
    text: string;
    username?: string;
    timestamp?: number;
    mine?: boolean;
    reactions?: Record<string, string[]>;
}

interface ChatPageProps {
    username: string;
    roomCode: string;
    onLeave: () => void;
}

export function ChatPage({ username, roomCode, onLeave }: ChatPageProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [users, setUsers] = useState<string[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    const endRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const hasJoined = useRef(false);

    // ── Setup Firebase ──
    useEffect(() => {
        if (hasJoined.current) return;
        hasJoined.current = true;

        const messagesRef = ref(db, `rooms/${roomCode}/messages`);
        const presenceRef = ref(db, `rooms/${roomCode}/presence`);
        const typingRef = ref(db, `rooms/${roomCode}/typing/${username}`);
        const myPresenceRef = ref(db, `rooms/${roomCode}/presence/${username}`);

        set(myPresenceRef, { online: true, joinedAt: Date.now() });
        onDisconnect(myPresenceRef).remove();
        onDisconnect(typingRef).remove();

        // System message on join
        push(messagesRef, { system: true, text: `${username} synced to enclave`, timestamp: Date.now() });

        const messagesQuery = query(messagesRef, orderByChild("timestamp"));
        onChildAdded(messagesQuery, (snapshot) => {
            const data = snapshot.val();
            if (!data) return;
            const msg: ChatMessage = {
                id: snapshot.key || Math.random().toString(),
                system: data.system || false,
                text: data.text,
                username: data.username,
                timestamp: data.timestamp,
                reactions: data.reactions || {},
                mine: !data.system && data.username === username,
            };
            setMessages((prev) => {
                if (prev.some((m) => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
        });

        // Listen for all updates (reactions/deletes)
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const updated = Object.entries(data).map(([key, val]: [string, any]) => ({
                    id: key,
                    ...val,
                    mine: !val.system && val.username === username,
                }));
                setMessages(prev => {
                    const next = [...prev];
                    updated.forEach(um => {
                        const idx = next.findIndex(m => m.id === um.id);
                        if (idx !== -1) next[idx].reactions = um.reactions || {};
                    });
                    return next;
                });
            }
        });

        const allTypingRef = ref(db, `rooms/${roomCode}/typing`);
        onValue(allTypingRef, (snapshot) => {
            const data = snapshot.val();
            setTypingUsers(data ? Object.keys(data).filter(u => u !== username) : []);
        });

        onValue(presenceRef, (snapshot) => {
            const data = snapshot.val();
            setUsers(data ? Object.keys(data) : []);
        });

        return () => {
            push(messagesRef, { system: true, text: `${username} severed link`, timestamp: Date.now() });
            remove(myPresenceRef);
            remove(typingRef);
            off(messagesRef);
            off(presenceRef);
            off(allTypingRef);
            hasJoined.current = false;
        };
    }, [roomCode, username]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 150;
        setShowScrollBtn(!isNearBottom);
    };

    const scrollToBottom = () => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!showScrollBtn) scrollToBottom();
    }, [messages, showScrollBtn]);

    const handleTyping = (isTyping: boolean) => {
        set(ref(db, `rooms/${roomCode}/typing/${username}`), isTyping ? true : null);
    };

    const send = useCallback(() => {
        const text = input.trim();
        if (!text) return;
        push(ref(db, `rooms/${roomCode}/messages`), { username, text, timestamp: Date.now() });
        setInput("");
        handleTyping(false);
        inputRef.current?.focus();
    }, [input, roomCode, username]);

    const addReaction = (messageId: string, emoji: string) => {
        const reactionRef = ref(db, `rooms/${roomCode}/messages/${messageId}/reactions/${emoji}`);
        onValue(reactionRef, (snapshot) => {
            let current = snapshot.val() || [];
            const next = current.includes(username) ? current.filter((u: string) => u !== username) : [...current, username];
            set(reactionRef, next);
        }, { onlyOnce: true });
    };

    const copyCode = () => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clearChat = useCallback(() => {
        remove(ref(db, `rooms/${roomCode}/messages`));
        setMessages([]);
        push(ref(db, `rooms/${roomCode}/messages`), {
            system: true,
            text: `Vault purged by ${username}`,
            timestamp: Date.now()
        });
    }, [roomCode, username]);

    const fmtTime = (ts?: number) => {
        if (!ts) return "";
        const d = new Date(ts);
        return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    };

    return (
        <div className="min-h-screen bg-[#000] flex flex-col font-sans text-white/90 relative overflow-hidden">
            {/* ── Background Orbs ── */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] bg-emerald-600/[0.02] rounded-full blur-[120px] pointer-events-none" />

            {/* ── Sidebar ── */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 180 }}
                            className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-[#050505]/95 backdrop-blur-3xl border-r border-white/5 flex flex-col p-8"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <Logo size={30} />
                                <button onClick={() => setSidebarOpen(false)} className="p-3 hover:bg-white/5 rounded-2xl transition-all">
                                    <ChevronLeft className="w-5 h-5 text-white/40" />
                                </button>
                            </div>

                            <div className="flex-1 space-y-10">
                                <div>
                                    <h4 className="text-[10px] font-black tracking-[4px] text-emerald-400/40 uppercase mb-4">Current Enclave</h4>
                                    <div className="p-6 bg-white/[0.03] border border-white/5 rounded-[24px] group relative">
                                        <div className="text-3xl font-black tracking-widest text-white mb-2">{roomCode}</div>
                                        <div className="flex flex-col gap-3">
                                            <button
                                                onClick={copyCode}
                                                className="flex items-center gap-2 text-[10px] font-bold text-white/20 hover:text-emerald-400 transition-colors uppercase tracking-[2px]"
                                            >
                                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                {copied ? "COPIED CODE" : "COPY ACCESS KEY"}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
                                                    navigator.clipboard.writeText(url);
                                                    setCopied(true);
                                                    setTimeout(() => setCopied(false), 2000);
                                                }}
                                                className="flex items-center gap-2 text-[10px] font-bold text-white/20 hover:text-emerald-400 transition-colors uppercase tracking-[2px]"
                                            >
                                                <Zap className="w-3 h-3" />
                                                {copied ? "LINK COPIED" : "COPY INVITE LINK"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="text-[10px] font-black tracking-[4px] text-white/20 uppercase">Sync Status</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                            <div className="text-emerald-400 font-black text-lg">{users.length}</div>
                                            <div className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Nodes</div>
                                        </div>
                                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                            <div className="text-white font-black text-lg">AES</div>
                                            <div className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Secure</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[10px] font-black tracking-[4px] text-white/20 uppercase mb-5">Participants</div>
                                    <div className="space-y-2">
                                        {users.map((u) => (
                                            <div key={u} className="flex items-center gap-4 p-2.5 rounded-2xl hover:bg-white/[0.03] transition-all">
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black ${u === username ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-400/20' : 'bg-white/5 text-white/30'}`}>
                                                    {u.slice(0, 2).toUpperCase()}
                                                </div>
                                                <span className={`text-[14px] ${u === username ? 'text-white font-bold' : 'text-white/40'}`}>{u}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button onClick={onLeave} className="w-full bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-500/60 p-5 rounded-2xl text-[10px] font-black tracking-[4px] transition-all uppercase">
                                SEVER CONNECTION
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── Header ── */}
            <header className="z-30 h-24 flex items-center justify-between px-10 bg-[#000]/60 backdrop-blur-xl border-b border-white/[0.03]">
                <div className="flex items-center gap-10">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-white/5 rounded-xl transition-all active:scale-95 text-white/40 hover:text-emerald-400">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="hidden sm:flex flex-col">
                        <div className="flex items-center gap-3">
                            <span className="text-[18px] font-black text-white tracking-[6px]">{roomCode}</span>
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <button onClick={clearChat} className="p-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl transition-all group active:scale-95">
                        <Trash2 className="w-4 h-4 text-red-500/40 group-hover:text-red-500/80" />
                    </button>
                    <div className="h-8 w-[1px] bg-white/5 mx-2" />
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden xs:block">
                            <div className="text-[9px] font-black text-white/20 uppercase tracking-[2px]">Logged In</div>
                            <div className="text-[13px] font-bold text-white uppercase">{username}</div>
                        </div>
                        <div className="w-11 h-11 rounded-2xl bg-emerald-400/5 border border-emerald-400/20 flex items-center justify-center text-[12px] font-black text-emerald-400">
                            {username.slice(0, 2).toUpperCase()}
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Messages ── */}
            <main
                ref={mainRef}
                onScroll={handleScroll}
                className="z-20 flex-1 overflow-y-auto px-10 py-12 flex flex-col custom-scrollbar relative"
            >
                <div className="max-w-4xl mx-auto w-full flex flex-col gap-10">
                    {messages.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center mt-32 opacity-10">
                            <Lock className="w-16 h-16 mb-6" />
                            <p className="text-xs font-black tracking-[8px] uppercase">ENCLAVE SECURE</p>
                        </div>
                    )}
                    {messages.map((msg, i) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex flex-col ${msg.mine ? "items-end" : "items-start"}`}
                        >
                            {msg.system ? (
                                <div className="w-full flex items-center gap-6 px-4">
                                    <div className="h-[1px] flex-1 bg-white/[0.03]" />
                                    <span className="text-[9px] font-black uppercase tracking-[5px] text-white/10 whitespace-nowrap">
                                        {msg.text}
                                    </span>
                                    <div className="h-[1px] flex-1 bg-white/[0.03]" />
                                </div>
                            ) : (
                                <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] group relative gap-3`}>
                                    {!msg.mine && <span className="text-[11px] font-black text-emerald-400/40 tracking-[3px] ml-2">@{msg.username}</span>}

                                    <div className="relative">
                                        <div className={`
                                            px-8 py-5 text-[15px] leading-relaxed backdrop-blur-3xl shadow-2xl border
                                            ${msg.mine
                                                ? "bg-emerald-400 text-black border-emerald-300 font-semibold rounded-[32px_32px_8px_32px]"
                                                : "bg-white/[0.03] border-white/[0.06] text-white/90 rounded-[32px_32px_32px_8px]"}
                                        `}>
                                            {msg.text}
                                        </div>

                                        {/* Quick Reactions on Hover */}
                                        <div className={`absolute -bottom-8 ${msg.mine ? 'right-0' : 'left-0'} flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all pointer-events-auto z-10 p-2`}>
                                            {['❤️', '🔥', '👍', '😂'].map(e => (
                                                <button
                                                    key={e}
                                                    onClick={() => addReaction(msg.id, e)}
                                                    className="w-7 h-7 rounded-full bg-black/80 border border-white/10 backdrop-blur-md flex items-center justify-center text-[12px] hover:bg-emerald-400 transition-all active:scale-90"
                                                >
                                                    {e}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Active Reactions */}
                                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 ml-2">
                                            {Object.entries(msg.reactions).map(([emoji, u]) => (
                                                u.length > 0 && (
                                                    <button
                                                        key={emoji}
                                                        onClick={() => addReaction(msg.id, emoji)}
                                                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${u.includes(username) ? 'bg-emerald-400/20 border-emerald-400/40 text-emerald-400' : 'bg-white/5 border-white/10 text-white/40'}`}
                                                    >
                                                        {emoji} {u.length}
                                                    </button>
                                                )
                                            ))}
                                        </div>
                                    )}

                                    <span className={`text-[10px] font-black text-white/10 uppercase tracking-[2px] mt-1 ${msg.mine ? 'text-right' : 'text-left'}`}>
                                        {fmtTime(msg.timestamp)}
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    ))}
                    <div ref={endRef} />
                </div>
            </main>

            <AnimatePresence>
                {showScrollBtn && (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onClick={scrollToBottom}
                        className="fixed bottom-32 right-12 w-12 h-12 rounded-full bg-emerald-400 text-black flex items-center justify-center shadow-2xl z-50 hover:scale-110 active:scale-90 transition-all"
                    >
                        <ChevronDown className="w-6 h-6" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* ── Input ── */}
            <div className="z-30 px-10 pb-12 pt-6 bg-gradient-to-t from-[#000] to-transparent">
                <div className="max-w-4xl mx-auto">
                    {/* Typing Indicator */}
                    <AnimatePresence>
                        {typingUsers.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 ml-6 mb-3 text-[10px] font-black text-emerald-500/40 tracking-[4px] uppercase">
                                <span className="flex gap-1">
                                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1 h-1 rounded-full bg-emerald-500" />
                                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1 h-1 rounded-full bg-emerald-500" />
                                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1 h-1 rounded-full bg-emerald-500" />
                                </span>
                                {typingUsers[0]} is typing...
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex items-center gap-4 p-3 bg-white/[0.03] border border-white/[0.08] backdrop-blur-3xl rounded-[32px] shadow-2xl focus-within:border-emerald-500/30 transition-all duration-500">
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => { setInput(e.target.value); handleTyping(e.target.value.length > 0); }}
                            onBlur={() => handleTyping(false)}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                            placeholder="Message enclave..."
                            className="flex-1 bg-transparent border-none outline-none px-6 py-3 text-white text-[15px] placeholder:text-white/10"
                        />
                        <button
                            onClick={send}
                            disabled={!input.trim()}
                            className="w-14 h-12 rounded-[24px] bg-emerald-400 flex items-center justify-center text-black shadow-lg transition-all hover:bg-emerald-300 disabled:opacity-10 shrink-0"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(52, 211, 153, 0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(52, 211, 153, 0.15); }
            `}</style>
        </div>
    );
}
