"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { playfair } from "../fonts"; 
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiLogIn } from "react-icons/fi";
import { useAuth } from "@/components/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [tempStudentId, setTempStudentId] = useState<number | null>(null);
  const [twoFactorToken, setTwoFactorToken] = useState(["", "", "", "", "", ""]);
  
  const { login, completeLogin, user, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    if (!authIsLoading && user) {
      router.push(redirectUrl);
    }
  }, [user, authIsLoading, router, redirectUrl]);

  if (authIsLoading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-[#FAFAFA] dark:bg-[#050A18]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      const result = await login(email, password);
      setIsLoading(false);

      if (result.success) {
        if (result.requires2FA) {
          setTempStudentId(result.studentId!);
          setStep('2fa');
          setFeedback({ type: "", message: "" });
        } else {
          setFeedback({ type: "success", message: result.message });
          setTimeout(() => router.push(redirectUrl), 1000);
        }
      } else {
        setFeedback({ type: "error", message: result.message });
      }
    } catch (error) {
      setIsLoading(false);
      setFeedback({ type: "error", message: "An unexpected error occurred." });
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      const code = twoFactorToken.join("");
      const res = await fetch('/api/auth/verify-login-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: tempStudentId, code })
      });
      const data = await res.json();
      setIsLoading(false);

      if (res.ok && data.success) {
        completeLogin(data.user);
        setFeedback({ type: "success", message: "2FA Verified! Logging in..." });
        setTimeout(() => router.push(redirectUrl), 1000);
      } else {
        setFeedback({ type: "error", message: data.error || "Invalid 2FA code." });
      }
    } catch (error) {
      setIsLoading(false);
      setFeedback({ type: "error", message: "An unexpected error occurred." });
    }
  };

  return (
    // 1. LAYOUT FIX: Changed min-h-screen to flex-grow w-full and adjusted padding
    <div className="flex-grow w-full bg-[#FAFAFA] dark:bg-[#050A18] flex flex-col items-center justify-center px-4 py-8 sm:p-10 transition-colors duration-300">

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md flex flex-col items-center"
      >
        {/* Feedback Message */}
        <div className="w-full h-16 mb-2 flex items-center">
          {feedback.message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`w-full p-4 rounded-xl border text-sm font-medium ${
                feedback.type === "success" 
                  ? "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800 text-green-600 dark:text-green-400" 
                  : "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 text-red-600 dark:text-red-400"
              }`}
            >
              {feedback.message}
            </motion.div>
          )}
        </div>

        {/* Glowing Top Icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500 blur-xl opacity-40 rounded-full animate-pulse"></div>
          <div className="relative bg-blue-500 p-4 rounded-2xl shadow-lg shadow-blue-500/30 text-white">
            <FiLogIn className="w-8 h-8" />
          </div>
        </div>

        {/* Headings */}
        <h1 className={`${playfair.className} text-4xl font-semibold text-[#0F172A] dark:text-white mb-2 tracking-wide`}>
          Welcome Back
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
          Or <Link href="/join" className="text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition-colors">create a new account for free</Link>
        </p>

        {/* Form Card */}
        {step === 'credentials' ? (
          <div className="w-full bg-white dark:bg-[#111C3A] rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800/60">
            <form className="space-y-6" onSubmit={handleSubmit}>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-[#0F172A] dark:text-gray-200">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email" // 2. FORM FIX: Added missing ID
                    name="email" // Added missing Name
                    autoComplete="email" // Improves autofill
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#050A18]/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-[#0F172A] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-[#0F172A] dark:text-gray-200">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password" // 3. FORM FIX: Added missing ID
                    name="password" // Added missing Name
                    autoComplete="current-password" // Improves autofill
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-[#050A18]/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-[#0F172A] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input type="checkbox" id="remember" name="remember" className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-[#050A18] cursor-pointer" />
                  <span className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] ${isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Sign In <FiArrowRight className="w-5 h-5" /></>
                )}
              </button>

            </form>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white dark:bg-[#111C3A] rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800/60 text-center"
          >
            <h2 className={`${playfair.className} text-2xl font-bold text-[#0F172A] dark:text-white mb-2`}>Two-Factor Authentication</h2>
            <p className="text-sm text-gray-500 mb-6">Enter the 6-digit code from your authenticator app.</p>
            <form onSubmit={handleVerify2FA} className="space-y-6">
              <div className="flex justify-center gap-2">
                {twoFactorToken.map((digit, i) => (
                  <input 
                    key={i} 
                    type="text" 
                    maxLength={1} 
                    value={digit}
                    onChange={(e) => {
                      const newToken = [...twoFactorToken];
                      newToken[i] = e.target.value.replace(/[^0-9]/g, "");
                      setTwoFactorToken(newToken);
                      if (e.target.value && i < 5) {
                        const nextInput = document.getElementById(`login-2fa-${i + 1}`);
                        if (nextInput) nextInput.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !twoFactorToken[i] && i > 0) {
                        const prevInput = document.getElementById(`login-2fa-${i - 1}`);
                        if (prevInput) prevInput.focus();
                      }
                    }}
                    id={`login-2fa-${i}`}
                    className="w-10 h-14 sm:w-12 sm:h-14 text-center text-xl font-bold bg-gray-50 dark:bg-[#0A1024] border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white outline-none focus:border-blue-500 transition-all" 
                    required
                  />
                ))}
              </div>
              
              <button
                type="submit"
                disabled={isLoading || twoFactorToken.some(d => d === "")}
                className={`w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] ${(isLoading || twoFactorToken.some(d => d === "")) ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Verify <FiArrowRight className="w-5 h-5" /></>
                )}
              </button>
              
              <button 
                type="button" 
                onClick={() => { setStep('credentials'); setTwoFactorToken(["", "", "", "", "", ""]); }}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Back to Login
              </button>
            </form>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex-grow flex items-center justify-center min-h-screen bg-[#FAFAFA] dark:bg-[#050A18]"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <LoginContent />
    </Suspense>
  );
}