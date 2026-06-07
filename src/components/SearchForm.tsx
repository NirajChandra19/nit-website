"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiShield, FiSearch, FiRefreshCcw, FiAlertCircle } from "react-icons/fi";
import { playfair } from "../app/fonts";

interface SearchFormProps {
  onVerify: (certId: string) => void;
  isLoading: boolean;
  error: string;
}

export default function SearchForm({ onVerify, isLoading, error }: SearchFormProps) {
  const [inputId, setInputId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onVerify(inputId);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }} 
      animate={{ opacity: 1, scale: 1, y: 0 }} 
      exit={{ opacity: 0, scale: 0.95, y: -20 }} 
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg bg-white/90 dark:bg-[#111C3A]/90 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 shadow-[0_20px_60px_rgb(0,0,0,0.05)] border border-white/50 dark:border-gray-700/50 relative z-10"
    >
      <div className="flex justify-center mb-8">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-800/50 shadow-inner">
          <FiShield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </motion.div>
      </div>

      <div className="text-center mb-8">
        <h1 className={`${playfair.className} text-3xl md:text-4xl text-[#0F172A] dark:text-white font-bold mb-3`}>
          Certificate Verification
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed">
          Ensure the authenticity of your NIT certification by entering the unique ID found on your document.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          {/* Linked label and input for better accessibility */}
          <label htmlFor="certificate-id" className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase ml-1">
            Certificate ID
          </label>
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              id="certificate-id"
              type="text" 
              value={inputId}
              onChange={(e) => setInputId(e.target.value.toUpperCase())} // Forces true uppercase in state
              placeholder="e.g. CERT-NIT-2025-8901" 
              className="w-full bg-gray-50 dark:bg-[#0A142F] border border-gray-200 dark:border-gray-700 rounded-xl py-4 pl-12 pr-4 text-gray-800 dark:text-white font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 uppercase transition-all"
              required
            />
          </div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800/30">
            <FiAlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        <button type="submit" disabled={isLoading} className="w-full bg-[#5A6577] hover:bg-[#4A5463] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition shadow-lg active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2">
          {isLoading ? <><FiRefreshCcw className="w-5 h-5 animate-spin" /> Verifying...</> : "Verify Authenticity"}
        </button>
      </form>
    </motion.div>
  );
}