"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LandingPage } from "@/components/landing-page";
import { ChatPage } from "@/components/chat-page";
import { GoodbyePage } from "@/components/goodbye-page";

type Page = "landing" | "chat" | "goodbye";

interface Session {
    username: string;
    roomCode: string;
}

export default function IPChat() {
    const [page, setPage] = useState<Page>("landing");
    const [session, setSession] = useState<Session>({
        username: "",
        roomCode: "",
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const room = params.get("room");
        if (room) {
            setSession(prev => ({ ...prev, roomCode: room.toUpperCase() }));
        }
    }, []);

    return (
        <AnimatePresence mode="wait">
            {page === "landing" && (
                <motion.div
                    key="landing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <LandingPage
                        initialRoomCode={session.roomCode}
                        onJoin={(u, r) => {
                            setSession({ username: u, roomCode: r });
                            setPage("chat");
                        }}
                    />
                </motion.div>
            )}
            {page === "chat" && (
                <motion.div
                    key="chat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <ChatPage
                        username={session.username}
                        roomCode={session.roomCode}
                        onLeave={() => setPage("goodbye")}
                    />
                </motion.div>
            )}
            {page === "goodbye" && (
                <motion.div
                    key="goodbye"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <GoodbyePage
                        onRestart={() => {
                            setSession({ username: "", roomCode: "" });
                            setPage("landing");
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
