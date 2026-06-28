"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiAward } from "react-icons/fi";
import Image from "next/image";
import { playfair } from "@/app/fonts"; 

export function CertificateShowcase() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full flex flex-col lg:flex-row items-center gap-12 md:gap-16">
      
      {/* Left Column: Text & Buttons (Unchanged) */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex-1 text-center lg:text-left w-full"
      >
        <div className="inline-flex items-center space-x-2 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 px-4 py-1.5 rounded-full mb-6">
          <FiAward className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="text-[10px] sm:text-xs font-bold text-amber-700 dark:text-amber-400 tracking-wider uppercase">
            Verified Credential
          </span>
        </div>
        <h2 className={`${playfair.className} text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-white mb-6 leading-tight transition-colors`}>
          Earn a Recognized <br className="hidden lg:block"/>
          <span className="bg-gradient-to-r from-blue-600 to-teal-400 dark:from-blue-400 dark:to-teal-300 bg-clip-text text-transparent italic pr-1">
            Certificate of&nbsp;
          </span><br className="hidden sm:block"/>
          <span className="bg-gradient-to-r from-blue-600 to-teal-400 dark:from-blue-400 dark:to-teal-300 bg-clip-text text-transparent italic pr-1">
            Completion&nbsp;
          </span>
        </h2>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed transition-colors max-w-2xl mx-auto lg:mx-0">
          Showcase your achievement. Our certificates come with a unique verification ID that can be verified instantly on our platform. Add it to your LinkedIn profile and resume to stand out to top tech recruiters.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Link href="/skill_courses" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
            Start Your Journey <FiArrowRight className="shrink-0" />
          </Link>
          <Link href="/verification" className="w-full sm:w-auto glass-card text-[#0F172A] dark:text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-white/5 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
            Verify a Certificate <FiCheckCircle className="shrink-0" />
          </Link>
        </div>
      </motion.div>

      {/* Right Column: Uncropped, Raw Certificate Image */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex-1 w-full max-w-xl lg:max-w-2xl relative group mt-10 lg:mt-0 flex items-center justify-center z-10"
      >
        {/* Background glow effect (Kept this so it matches your theme) */}
        <div className="absolute -inset-2 sm:-inset-6 bg-gradient-to-r from-blue-600/30 to-teal-400/30 dark:from-blue-500/40 dark:to-teal-400/40 blur-2xl sm:blur-3xl rounded-[3rem] opacity-80 group-hover:opacity-100 transform group-hover:scale-105 transition-all duration-700 z-0"></div>

        {/* Pure Image Wrapper: No bg-white, no CSS cropping, no hidden overflows. */}
        <div className="relative w-full shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-xl transition-transform duration-500 group-hover:scale-[1.02] z-10 flex justify-center">
          
          <Image 
            src="/images/Certificate.jpg" 
            alt="Verified Certificate Preview" 
            width={1000} 
            height={700} 
            className="w-full h-auto rounded-xl object-contain" 
            priority
          />
        </div>

        {/* Floating Verification Badge - Balanced Size with Dark Mode Restored */}
        <div className="absolute -bottom-3 -right-2 sm:-bottom-5 sm:-right-5 bg-white dark:bg-[#111C3A] rounded-xl px-3 py-2 sm:px-4 sm:py-3 shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-gray-800 flex items-center gap-2 sm:gap-3 z-30 animate-[bounce_4s_ease-in-out_infinite]">
          <div className="w-7 h-7 sm:w-9 sm:h-9 bg-[#E8F7F0] dark:bg-green-900/30 rounded-full flex items-center justify-center shrink-0">
            <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#22C55E] dark:text-green-400" strokeWidth={2.5} />
          </div>
          
          <div className="text-left pr-1 sm:pr-2">
            <p className="text-[8px] sm:text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-0.5">Status</p>
            <p className="text-[10px] sm:text-xs font-extrabold text-[#0F172A] dark:text-white leading-none">Verified & Valid</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}