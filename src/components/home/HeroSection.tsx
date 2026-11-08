"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiAward, FiAlertCircle } from "react-icons/fi";
import { playfair } from "@/app/fonts";
import dynamic from "next/dynamic";

// Lazy-load heavy Diwali ornaments — no SSR needed
const HangingDiyas = dynamic(() => import("@/components/HangingDiyas"), { ssr: false });

// --- SCRAMBLE TITLE ---
const SCRAMBLE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const HERO_PHRASES = ["Real World Experience", "Live Industry Projects", "Advanced Skill Sets"];

const ScrambleTitle = ({ phrases }: { phrases: string[] }) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState(phrases[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [phrases.length]);

  useEffect(() => {
    let iteration = 0;
    const targetText = phrases[phraseIndex];

    const scrambleInterval = setInterval(() => {
      setDisplayText(
        targetText
          .split("")
          .map((letter, index) => {
            if (index < iteration) return targetText[index];
            if (targetText[index] === " ") return " ";
            return SCRAMBLE_LETTERS[Math.floor(Math.random() * SCRAMBLE_LETTERS.length)];
          })
          .join("")
      );

      if (iteration >= targetText.length) clearInterval(scrambleInterval);
      iteration += 1 / 2;
    }, 30);

    return () => clearInterval(scrambleInterval);
  }, [phraseIndex, phrases]);

  return <>{displayText}</>;
};

// --- DIWALI CONFETTI CTA ---
function DiwaliJoinButton() {
  const handleConfetti = useCallback(async () => {
    // Dynamically import to keep it out of the initial bundle
    const confetti = (await import("canvas-confetti")).default;

    const diwaliColors = ["#ff8c00", "#ffd700", "#ff0000", "#ff4500", "#ffb347"];

    // Fire from left edge
    confetti({
      particleCount: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: diwaliColors,
      angle: 60,
      startVelocity: 45,
    });

    // Fire from right edge
    confetti({
      particleCount: 60,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: diwaliColors,
      angle: 120,
      startVelocity: 45,
    });
  }, []);

  return (
    <Link
      href="/internships"
      onClick={handleConfetti}
      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-base sm:text-lg"
      style={{ willChange: "transform" }}
    >
      Apply for Internship
      <FiArrowRight className="w-5 h-5 shrink-0" />
    </Link>
  );
}

// --- HERO SECTION ---
export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 pt-10 pb-16 md:pt-10">
      {/* Festive warm ambient glow — Diwali edition */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {/* Top-left warm orb */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-orange-500/20 blur-[80px]" />
        {/* Top-right warm orb */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-amber-500/15 blur-[80px]" />
        {/* Centre subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full bg-orange-400/10 blur-[60px]" />
      </div>

      {/* Hanging diya ornaments at top corners */}
      <HangingDiyas />

      {/* ---- CONTENT ---- */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mb-4 inline-flex items-center space-x-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 px-4 py-1.5 rounded-full shadow-sm"
      >
        <FiAlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
        <span className="text-[10px] sm:text-xs font-bold text-amber-700 dark:text-amber-400 tracking-wider uppercase truncate">
          Website is under construction
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mb-6 inline-flex items-center space-x-2 bg-white dark:bg-[#111C3A] border border-teal-100 dark:border-teal-900/50 px-4 py-1.5 rounded-full shadow-sm transition-colors max-w-full"
      >
        <FiAward className="w-4 h-4 text-teal-500 shrink-0" />
        <span className="text-[10px] sm:text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase truncate">
          #1 Platform for Virtual Internships
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-10 text-center w-full max-w-5xl mx-auto px-2"
      >
        <h1
          className={`${playfair.className} text-4xl sm:text-5xl md:text-[84px] font-medium text-[#0A142F] dark:text-white tracking-tight leading-[1.1] transition-colors`}
        >
          Where Learning Meets
        </h1>

        <div className="relative w-full h-[90px] sm:h-[110px] md:h-[135px] flex items-center justify-center mt-2">
          <h1
            className={`${playfair.className} absolute w-full text-4xl sm:text-5xl md:text-[84px] font-medium tracking-tight leading-[1.1] py-2`}
          >
            {/* Diwali-warmed gradient: orange → amber → fuchsia */}
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-fuchsia-500 bg-clip-text text-transparent block pb-2">
              <ScrambleTitle phrases={HERO_PHRASES} />
            </span>
          </h1>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 mt-2 text-base sm:text-lg md:text-[21px] text-gray-500 dark:text-gray-400 w-full max-w-[800px] text-center leading-relaxed mb-8 sm:mb-10 transition-colors px-4"
      >
        Kickstart your career with our free virtual internship program. Gain hands-on experience,
        work on live projects, and get certified.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto px-4"
      >
        {/* CTA with Diwali confetti fireworks */}
        <DiwaliJoinButton />

        <Link
          href="/verification"
          className="w-full sm:w-auto glass-card text-[#0F172A] dark:text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 text-base sm:text-lg"
          style={{ willChange: "transform" }}
        >
          Verify Certificate
          <FiCheckCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 shrink-0" />
        </Link>
      </motion.div>
    </section>
  );
}
