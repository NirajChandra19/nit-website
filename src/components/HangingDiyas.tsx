'use client';

/**
 * HangingDiyas — Decorative pendulum-swinging diya ornaments for the Hero section.
 * Hidden on mobile (hidden md:block) to keep the layout clean on small screens.
 * Uses framer-motion with will-change-transform for 60fps hardware-accelerated animation.
 */

import { motion } from 'framer-motion';

/** Shared pendulum animation props */
const swing = {
  animate: { rotate: [-3, 3, -3] as number[] },
  transition: {
    duration: 3.2,
    repeat: Infinity,
    ease: [0.37, 0, 0.63, 1] as [number, number, number, number], 
  },
};

function DiyaOrnament() {
  return (
    <div
      className="flex flex-col items-center select-none"
      style={{ willChange: 'transform' }}
    >
      {/* Hanging string */}
      <div className="w-px h-12 bg-gradient-to-b from-amber-700/60 to-amber-500/40" />

      {/* Flame glow blur */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="w-4 h-4 rounded-full bg-orange-400 blur-[6px] opacity-80 -mb-2 relative z-10"
        style={{ willChange: 'opacity, transform' }}
      />

      {/* Diya body — placeholder SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 36"
        width="52"
        height="40"
        aria-label="Diya lamp ornament"
        className="drop-shadow-[0_2px_6px_rgba(251,146,60,0.5)]"
      >
        {/* Flame */}
        <ellipse cx="24" cy="7" rx="3" ry="6" fill="#FCD34D" opacity="0.9" />
        <ellipse cx="24" cy="9" rx="2" ry="4" fill="#FDE68A" opacity="0.8" />
        {/* Wick */}
        <line x1="24" y1="13" x2="24" y2="17" stroke="#92400E" strokeWidth="1.2" />
        {/* Diya bowl (outer) */}
        <path
          d="M8 20 Q12 14 24 14 Q36 14 40 20 Q38 30 24 32 Q10 30 8 20 Z"
          fill="#D97706"
        />
        {/* Diya bowl (inner highlight) */}
        <path
          d="M10 21 Q14 16 24 16 Q34 16 38 21 Q36 29 24 30 Q12 29 10 21 Z"
          fill="#F59E0B"
        />
        {/* Oil highlight */}
        <ellipse cx="24" cy="23" rx="7" ry="4" fill="#FDE68A" opacity="0.5" />
        {/* Base / foot */}
        <path d="M14 31 Q24 35 34 31 L32 34 Q24 37 16 34 Z" fill="#B45309" />
      </svg>
    </div>
  );
}

export default function HangingDiyas() {
  return (
    /* ADDED: fixed inset-0 z-[100] pointer-events-none to force it to overlay everything */
    <div className="hidden md:block fixed inset-0 z-[100] pointer-events-none" aria-hidden="true">
      
      {/* Left diya */}
      <motion.div
        animate={swing.animate}
        transition={swing.transition}
        className="absolute top-0 left-[10%] origin-top opacity-80"
        style={{ willChange: 'transform' }}
      >
        <DiyaOrnament />
      </motion.div>

      {/* Right diya — slight phase offset */}
      <motion.div
        animate={swing.animate}
        transition={{ ...swing.transition, delay: 0.8 }}
        className="absolute top-0 right-[10%] origin-top opacity-80"
        style={{ willChange: 'transform' }}
      >
        <DiyaOrnament />
      </motion.div>
      
    </div>
  );
}