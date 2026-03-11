"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { CyanButton } from "@/components/ui/cyan-button";
import { Field } from "@/components/ui/field";
import { Shield, Zap, Lock, Sparkles } from "lucide-react";

interface LandingPageProps {
    onJoin: (username: string, roomCode: string) => void;
    initialRoomCode?: string;
}

export function LandingPage({ onJoin, initialRoomCode }: LandingPageProps) {
    const [username, setUsername] = useState("");
    const [roomCode, setRoomCode] = useState(initialRoomCode || "");
    const [error, setError] = useState("");

    React.useEffect(() => {
        if (initialRoomCode) setRoomCode(initialRoomCode);
    }, [initialRoomCode]);

    const connect = () => {
        if (!username.trim()) return setError("Username required");
        if (!roomCode.trim()) return setError("Room code required");
        onJoin(username.trim(), roomCode.trim().toUpperCase());
    };

    return (
        <div className="relative min-h-screen bg-[#000] flex items-center justify-center p-6 overflow-hidden">
            {/* Background ambient orbs for rich feel */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[100px] animate-pulse delay-1000" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[480px] relative z-10"
            >
                {/* Floating sparkle icon */}
                <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-12 -right-8 opacity-20 hidden sm:block"
                >
                    <Sparkles className="w-16 h-16 text-emerald-400" />
                </motion.div>

                <div
                    className="
                        rounded-[40px] p-12 sm:p-14
                        bg-white/[0.015] border border-white/[0.04]
                        backdrop-blur-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]
                        relative overflow-hidden group
                    "
                >
                    {/* Inner glass reflection */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                    <div className="mb-12 text-center">
                        <Logo size={48} />
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-white/25 text-[14px] mt-6 leading-relaxed font-medium tracking-wide uppercase italic"
                        >
                            The Digital Void.
                        </motion.p>
                    </div>

                    <div className="flex flex-col gap-10">
                        <Field
                            label="IDENTITY"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setError("");
                            }}
                            onKeyDown={(e) => e.key === "Enter" && connect()}
                            placeholder="Display name"
                            maxLength={20}
                        />
                        <div className="relative">
                            <Field
                                label="ENCLAVE CODE"
                                value={roomCode}
                                onChange={(e) => {
                                    setRoomCode(e.target.value.toUpperCase());
                                    setError("");
                                }}
                                onKeyDown={(e) => e.key === "Enter" && connect()}
                                placeholder="Secret key"
                                maxLength={20}
                            />
                            <p className="text-[10px] text-white/10 mt-5 font-bold tracking-[4px] text-center uppercase">
                                ENTER THE SAME CODE TO ACCESS SESSION
                            </p>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-[13px] text-emerald-400 font-bold text-center tracking-wide"
                                >
                                    {error}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        <div className="mt-4">
                            <CyanButton onClick={connect} full>
                                INITIALIZE ENCLAVE →
                            </CyanButton>
                        </div>
                    </div>
                </div>

                {/* Footer trust marks */}
                <div className="flex items-center justify-center gap-10 mt-12 opacity-15">
                    {[
                        { icon: Shield, label: "ENCRYPTED" },
                        { icon: Lock, label: "EPHEMERAL" },
                        { icon: Zap, label: "REALTIME" },
                    ].map(({ icon: Icon, label }) => (
                        <div
                            key={label}
                            className="flex items-center gap-2.5 text-[9px] text-white font-black tracking-[4px]"
                        >
                            <Icon className="w-3 h-3 text-emerald-400" />
                            {label}
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
