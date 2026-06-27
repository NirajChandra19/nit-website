"use client";

import { useState } from "react";
import Link from "next/link";
import { playfair } from "../fonts"; 
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield, FiUser } from "react-icons/fi";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      const result = await register(name, email, password);
      setIsLoading(false);

      if (result.success) {
        setFeedback({ type: "success", message: result.message });
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setFeedback({ type: "error", message: result.message });
      }
    } catch (error) {
      setIsLoading(false);
      setFeedback({ type: "error", message: "An unexpected error occurred." });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050A18] flex flex-col items-center justify-center p-4 sm:p-8 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md flex flex-col items-center"
      >
        <div className="w-full min-h-[4rem] mb-4 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {feedback.message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`w-full p-4 rounded-xl border text-sm font-medium ${
                  feedback.type === "success" 
                    ? "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800 text-green-600 dark:text-green-400" 
                    : "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 text-red-600 dark:text-red-400"
                }`}
              >
                {feedback.message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500 blur-xl opacity-40 rounded-full animate-pulse"></div>
          <div className="relative bg-blue-500 p-4 rounded-2xl shadow-lg shadow-blue-500/30 text-white">
            <FiShield className="w-8 h-8" />
          </div>
        </div>

        <h1 className={`${playfair.className} text-3xl sm:text-4xl font-semibold text-[#0F172A] dark:text-white mb-2 tracking-wide text-center`}>
          Create an Account
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center text-sm sm:text-base">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition-colors whitespace-nowrap">
            Sign in here
          </Link>
        </p>

        <div className="w-full bg-white dark:bg-[#111C3A] rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800/60">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-[#0F172A] dark:text-gray-200">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input id="name" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#050A18]/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-[#0F172A] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" required />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-[#0F172A] dark:text-gray-200">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#050A18]/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-[#0F172A] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" required />
              </div>
            </div>

            <div className="space-y-2 pb-2">
              <label htmlFor="password" className="text-sm font-semibold text-[#0F172A] dark:text-gray-200">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input id="password" name="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" minLength={8} className="w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-[#050A18]/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-[#0F172A] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-[11px] text-gray-500 pt-1">Must be at least 8 characters with a mix of letters and numbers.</p>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]">
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Create Account <FiArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}