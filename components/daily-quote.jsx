"use client";

import React, { useState, useEffect } from 'react';
import { Loader2 } from "lucide-react";

/**
 * DailyQuote Component
 * Fetches a random quote from an external API effectively acting as a "daily quote".
 * Implemented as a Client Component to avoid hydration mismatches if we were to rely on time-based logic,
 * though simple fetching could be server-side. Using client side to ensure we don't block header rendering.
 */
const DailyQuote = () => {
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const res = await fetch('https://dummyjson.com/quotes/random');
                const data = await res.json();
                setQuote(data);
            } catch (error) {
                console.error("Failed to fetch quote:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuote();
    }, []);

    if (loading) {
        return <div className="hidden md:flex justify-center items-center opacity-50"><Loader2 className="animate-spin h-4 w-4 text-amber-900" /></div>;
    }

    if (!quote) return null;

    return (
        <div className="hidden md:flex flex-col items-center justify-center max-w-[400px] text-center mx-4">
            <p className="text-xs lg:text-sm font-serif italic text-amber-900/80 leading-tight">
                &ldquo;{quote.quote}&rdquo;
            </p>
        </div>
    );
};

export default DailyQuote;
