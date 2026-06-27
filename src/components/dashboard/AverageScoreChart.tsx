"use client";

import { motion, Variants } from "framer-motion";
import { FiTrendingUp } from "react-icons/fi";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function AverageScoreChart({ 
  currentAverageScore, 
  t 
}: { 
  currentAverageScore: number, 
  t: (key: string) => string 
}) {
  return (
    <motion.div variants={itemVariants} className="bg-white dark:bg-[#0B1229] rounded-3xl p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden hover:-translate-y-1 transition-transform duration-300">
      <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">{t("Average Score")}</h3>
      <div className="relative w-32 h-32 flex items-center justify-center mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-100 dark:text-gray-800" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * currentAverageScore) / 100} className="text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)] transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-bold text-[#0F172A] dark:text-white">{currentAverageScore}%</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-teal-500 bg-teal-50 dark:bg-teal-500/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1">
        <FiTrendingUp /> {currentAverageScore >= 90 ? "Excellent Progress" : currentAverageScore > 0 ? "Good Progress" : "Start Learning"}
      </p>
    </motion.div>
  );
}
