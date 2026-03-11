"use client";

import React from "react";
import { motion } from "framer-motion";

interface CyanButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    full?: boolean;
}

export function CyanButton({ children, onClick, full }: CyanButtonProps) {
    return (
        <motion.button
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98, y: 0 }}
            onClick={onClick}
            className={`
                ${full ? "w-full" : "w-auto"}
                bg-emerald-400
                border-none rounded-2xl px-10 py-5
                text-black font-black text-[13px]
                tracking-[4px] cursor-pointer uppercase
                shadow-[0_15px_50px_-10px_rgba(16,185,129,0.4)]
                transition-all duration-300
                hover:bg-emerald-300
                hover:shadow-[0_25px_60px_-10px_rgba(16,185,129,0.5)]
                active:shadow-[0_10px_30px_-5px_rgba(16,185,129,0.4)]
                flex items-center justify-center gap-3
            `}
        >
            {children}
        </motion.button>
    );
}
