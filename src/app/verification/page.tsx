"use client";

import { playfair } from "../fonts"; // or "@/app/fonts" depending on your setup
import { motion } from "framer-motion";
import { FiShield, FiSearch } from "react-icons/fi";

export default function VerificationPage() {
  return (
    // FIX: Added dark mode background gradients
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 dark:from-[#050A18] dark:via-[#0A142F] dark:to-[#050A18] px-4 py-20 transition-colors duration-300">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] opacity-30 dark:opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] opacity-30 dark:opacity-20 animate-pulse"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        // FIX: Dark mode card styling
        className="w-full max-w-lg bg-white/90 dark:bg-[#111C3A]/90 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 shadow-[0_20px_60px_rgb(0,0,0,0.05)] border border-white/50 dark:border-gray-700/50 relative z-10 transition-colors"
      >
        
        {/* Animated Shield Icon */}
        <div className="flex justify-center mb-8">
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            // FIX: Dark mode icon container
            className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-800/50 shadow-inner"
          >
            <FiShield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </motion.div>
        </div>

        {/* Text Content */}
        <div className="text-center mb-8">
          {/* FIX: Dark mode text */}
          <h1 className={`${playfair.className} text-3xl md:text-4xl text-[#0F172A] dark:text-white font-bold mb-3 transition-colors`}>
            Certificate Verification
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed transition-colors">
            Ensure the authenticity of your NIT certification by entering the unique ID found on your document.
          </p>
        </div>

        {/* Input Form */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase ml-1 transition-colors">
              Certificate ID
            </label>
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              {/* FIX: Dark mode input field */}
              <input 
                type="text" 
                placeholder="e.g. NIT/01/3573" 
                className="w-full bg-gray-50 dark:bg-[#0A142F] border border-gray-200 dark:border-gray-700 rounded-xl py-4 pl-12 pr-4 text-gray-800 dark:text-white font-medium focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-[#111C3A] focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          <button className="w-full bg-[#5A6577] hover:bg-[#4A5463] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition shadow-lg active:scale-[0.98]">
            Verify Authenticity
          </button>
        </form>

      </motion.div>

      {/* Help Link */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center relative z-10 transition-colors"
      >
        Need assistance or notice an error? Reach our verification desk at <br/>
        <a href="mailto:services.nit@gmail.com" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline mt-1 inline-block">
          services.nit@gmail.com
        </a>
      </motion.p>

    </div>
  );
}