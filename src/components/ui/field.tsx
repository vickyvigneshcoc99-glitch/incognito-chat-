"use client";

import React, { useId, useRef } from "react";

interface FieldProps {
    label?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    maxLength?: number;
}

export function Field({
    label,
    value,
    onChange,
    placeholder,
    onKeyDown,
    maxLength,
}: FieldProps) {
    const id = useId();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        inputRef.current?.focus();
    };

    return (
        <div
            className="group w-full cursor-text"
            onClick={handleClick}
        >
            {label && (
                <label
                    htmlFor={id}
                    className="text-[11px] font-bold tracking-[4px] text-emerald-500/30 block mb-3 uppercase group-focus-within:text-emerald-400 transition-all duration-300 cursor-pointer select-none"
                    onClick={(e) => e.stopPropagation()}
                >
                    {label}
                </label>
            )}
            <div className="relative overflow-hidden rounded-2xl">
                <input
                    ref={inputRef}
                    id={id}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    autoComplete="off"
                    className="
                        w-full box-border
                        bg-white/[0.015] border border-white/[0.05] rounded-2xl
                        px-6 py-5 text-white text-[15px] font-medium
                        outline-none transition-all duration-500
                        placeholder:text-white/5
                        focus:bg-white/[0.03] focus:border-emerald-500/30
                        focus:shadow-[0_0_50px_-10px_rgba(16,185,129,0.1)]
                    "
                />
                {/* Glow bar at bottom */}
                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent group-focus-within:w-full transition-all duration-1000 ease-out" />
            </div>
        </div>
    );
}
