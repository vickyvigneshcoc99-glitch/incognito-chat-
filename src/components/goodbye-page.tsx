"use client";

import React from "react";
import { motion } from "framer-motion";
import { CyanButton } from "@/components/ui/cyan-button";
import { Trash2, ShieldCheck, Sparkles } from "lucide-react";

interface GoodbyePageProps {
    onRestart: () => void;
}

export function GoodbyePage({ onRestart }: GoodbyePageProps) {
    return (
        <div className="relative min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-white/90">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="
                    rounded-[40px] p-16 text-center max-w-[520px] w-full
                    bg-[#0a0a0a] border border-white/[0.05]
                    shadow-[0_50px_120px_rgba(0,0,0,0.8)]
                    relative overflow-hidden
                "
            >
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-10 relative inline-block"
                >
                    <div className="w-24 h-24 rounded-[32px] bg-emerald-400/5 border border-emerald-400/20 flex items-center justify-center shadow-inner">
                        <Trash2 className="w-10 h-10 text-emerald-400" />
                    </div>
                </motion.div>

                <h2 className="text-3xl font-black text-white mb-6 tracking-tight">
                    Session Terminated.
                </h2>

                <p className="text-white/20 text-[13px] leading-relaxed mb-12 px-8 font-medium">
                    The enclave has been dissolved. Your digital tracks have been completely erased. No history remains.
                </p>

                <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-7 mb-12 flex items-center gap-6 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-400/5 flex items-center justify-center shrink-0 border border-emerald-400/20">
                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-emerald-400/40 tracking-[3px] uppercase mb-1">Audit Status</div>
                        <p className="text-sm text-white/40 font-semibold tracking-tight">Logs Purged · Access Revoked.</p>
                    </div>
                </div>

                <CyanButton onClick={onRestart}>NEW ACCESS REQUEST →</CyanButton>
            </motion.div>
        </div>
    );
}
