"use client";

import { useState, memo } from "react";
import Link from "next/link";
import { playfair } from "../fonts"; // or "@/app/fonts" depending on your setup
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield, FiUser } from "react-icons/fi";

// ================= OPTIMIZED SUB-COMPONENTS =================

// 1. Isolate the Password Input so toggling visibility doesn't re-render the whole page
const PasswordInput = memo(() => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2 pb-2">
      <label className="text-sm font-semibold text-[#0F172A] dark:text-gray-200">Password</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <FiLock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          suppressHydrationWarning
          placeholder="••••••••"
          className="w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-[#050A18]/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-[#0F172A] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
        </button>
      </div>
      <p className="text-[11px] text-gray-500 dark:text-gray-500 pt-1">
        Must be at least 8 characters with a mix of letters and numbers.
      </p>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";


// ================= MAIN PAGE COMPONENT =================

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050A18] flex flex-col items-center justify-center p-4 pt-24 transition-colors duration-300">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md flex flex-col items-center"
      >
        {/* Glowing Top Icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500 blur-xl opacity-40 rounded-full animate-pulse"></div>
          <div className="relative bg-blue-500 p-4 rounded-2xl shadow-lg shadow-blue-500/30 text-white">
            <FiShield className="w-8 h-8" />
          </div>
        </div>

        {/* Headings */}
        <h1 className={`${playfair.className} text-4xl font-semibold text-[#0F172A] dark:text-white mb-2 tracking-wide`}>
          Create an Account
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Already have an account? <Link href="/login" className="text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition-colors">Sign in here</Link>
        </p>

        {/* Form Card */}
        <div className="w-full bg-white dark:bg-[#111C3A] rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800/60">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Full Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0F172A] dark:text-gray-200">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  suppressHydrationWarning
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#050A18]/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-[#0F172A] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0F172A] dark:text-gray-200">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  suppressHydrationWarning
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#050A18]/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-[#0F172A] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Isolated Password Input Component */}
            <PasswordInput />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]"
            >
              Create Account <FiArrowRight className="w-5 h-5" />
            </button>

          </form>
        </div>
      </motion.div>
    </div>
  );
}