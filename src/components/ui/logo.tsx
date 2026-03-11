"use client";

import React from "react";
import { motion } from "framer-motion";

interface LogoProps {
    size?: number;
}

export function Logo({ size = 32 }: LogoProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-black tracking-[-3px] flex items-center justify-center select-none"
            style={{ fontSize: size }}
        >
            <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">IP</span>
            <span className="text-emerald-400 drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]">CHAT</span>
        </motion.div>
    );
}
