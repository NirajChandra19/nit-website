"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield, FiCheckCircle } from "react-icons/fi";
import { playfair } from "../fonts"; 

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  // Helper to show feedback for exactly 2 seconds
  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback({ type: "", message: "" });
    }, 2000);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      const res = await fetch('/api/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setIsLoading(false);

      if (res.ok) {
        showFeedback("success", "Password reset code sent!");
        setStep(2);
      } else {
        showFeedback("error", data.error || "Failed to send code.");
      }
    } catch (error) {
      setIsLoading(false);
      showFeedback("error", "Failed to send reset code.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return;
    
    setIsLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      const res = await fetch('/api/auth/forgot-password/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json();
      setIsLoading(false);

      if (res.ok) {
        showFeedback("success", "Code verified!");
        setStep(3);
      } else {
        showFeedback("error", data.error || "Invalid verification code.");
      }
    } catch (error) {
      setIsLoading(false);
      showFeedback("error", "Failed to verify code.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showFeedback("error", "Passwords do not match.");
      return;
    }
    
    setIsLoading(true);
    setFeedback({ type: "", message: "" });
    const code = otp.join("");

    try {
      const res = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });
      const data = await res.json();
      setIsLoading(false);

      if (res.ok) {
        showFeedback("success", "Password reset successfully!");
        // Wait exactly 2 seconds for the success message to show before redirecting
        setTimeout(() => router.push("/login"), 2000);
      } else {
        showFeedback("error", data.error || "Failed to reset password.");
      }
    } catch (error) {
      setIsLoading(false);
      showFeedback("error", "An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050A18] flex flex-col items-center justify-center p-2 sm:p-8 transition-colors duration-300">
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
                className={`w-full p-4 rounded-xl border text-sm font-medium text-center shadow-sm ${
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
            {step === 3 ? <FiCheckCircle className="w-8 h-8" /> : <FiShield className="w-8 h-8" />}
          </div>
        </div>

        <h1 className={`${playfair.className} text-3xl sm:text-4xl font-semibold text-[#0F172A] dark:text-white mb-2 tracking-wide text-center`}>
          {step === 1 ? "Forgot Password" : step === 2 ? "Verify Code" : "Set New Password"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center text-sm sm:text-base">
          {step === 1 && "We'll send a code to your email to reset your password."}
          {step === 2 && `Enter the 6-digit code sent to ${email}`}
          {step === 3 && "Please enter your new password below."}
        </p>

        <div className="w-full bg-white dark:bg-[#111C3A] rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800/60 overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: EMAIL */}
            {step === 1 && (
              <motion.form key="step-1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5" onSubmit={handleSendOtp}>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-[#0F172A] dark:text-gray-200">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#050A18]/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-[#0F172A] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-base" required />
                  </div>
                </div>

                <button type="submit" disabled={isLoading || !email} className="w-full bg-blue-600 hover:bg-blue-500  text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md mt-4">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Send Reset Code <FiArrowRight className="w-5 h-5" /></>}
                </button>
                <div className="text-center mt-4">
                  <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Back to Login</Link>
                </div>
              </motion.form>
            )}

            {/* STEP 2: OTP */}
            {step === 2 && (
              <motion.form key="step-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6" onSubmit={handleVerifyOtp}>
                <div className="flex justify-center gap-2 sm:gap-3 my-4">
                  {otp.map((digit, i) => (
                    <input 
                      key={i} type="text" maxLength={1} value={digit}
                      onChange={(e) => {
                        const newOtp = [...otp];
                        newOtp[i] = e.target.value.replace(/[^0-9]/g, "");
                        setOtp(newOtp);
                        if (e.target.value && i < 5) {
                          document.getElementById(`otp-${i + 1}`)?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[i] && i > 0) {
                          document.getElementById(`otp-${i - 1}`)?.focus();
                        }
                      }}
                      id={`otp-${i}`}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-gray-50 dark:bg-[#0A1024] border border-gray-200 dark:border-gray-700/50 rounded-xl dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all" 
                      required
                    />
                  ))}
                </div>

                <button type="submit" disabled={isLoading || otp.some(d => d === "")} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Verify Code <FiArrowRight className="w-5 h-5" /></>}
                </button>
                <div className="text-center mt-4">
                  <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Back</button>
                </div>
              </motion.form>
            )}

            {/* STEP 3: NEW PASSWORD */}
            {step === 3 && (
              <motion.form key="step-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5" onSubmit={handleResetPassword}>
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-semibold text-[#0F172A] dark:text-gray-200">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input id="newPassword" type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" minLength={8} className="w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-[#050A18]/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-base" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pb-2">
                  <label htmlFor="confirmPassword" className="text-sm font-semibold text-[#0F172A] dark:text-gray-200">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input id="confirmPassword" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" minLength={8} className="w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-[#050A18]/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-base" required />
                  </div>
                </div>

                <button type="submit" disabled={isLoading || !newPassword || !confirmPassword} className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-400 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg mt-4">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Reset Password"}
                </button>
              </motion.form>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// disabled:bg-blue-400