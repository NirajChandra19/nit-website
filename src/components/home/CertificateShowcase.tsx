"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiAward } from "react-icons/fi";
import Image from "next/image";
import { playfair } from "@/app/fonts"; 

export function CertificateShowcase() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full flex flex-col lg:flex-row items-center gap-12 md:gap-16">
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

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex-1 w-full max-w-xl lg:max-w-2xl relative group mt-10 lg:mt-0 aspect-[1.414/1] flex items-center justify-center rounded-[1rem] z-10"
      >
        <div className="absolute inset-0 bg-blue-600/20 dark:bg-blue-500/10 blur-2xl sm:blur-3xl rounded-[3rem] transform group-hover:scale-105 transition-transform duration-700"></div>

        <div className="relative w-0 h-0 flex items-center justify-center z-10">
          
          <div className="w-[1000px] flex-shrink-0 origin-center scale-[0.32] sm:scale-[0.5] md:scale-[0.55] lg:scale-[0.5] xl:scale-[0.6] relative transition-transform duration-500">
            
            <div className="absolute -top-3 -left-3 w-32 h-32 bg-gradient-to-br from-teal-400 to-blue-600 rounded-tl-2xl z-[-1] opacity-80"></div>

            <div className="w-full h-full relative bg-white/80 dark:bg-white/90 p-1.5 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/50 backdrop-blur-sm">
              <Image 
                src="/images/certificate-preview.jpg"
                alt="Verified Certificate Preview" 
                width={1000} 
                height={700} 
                className="w-full h-auto rounded-md shadow-sm"
              />
            </div>

            <div className="absolute -bottom-4 -right-2 sm:-bottom-8 sm:-right-4 bg-white dark:bg-[#111C3A] rounded-2xl p-3 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-800 flex items-center gap-3 sm:gap-4 z-30 animate-[bounce_4s_ease-in-out_infinite]">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center shrink-0">
                <FiCheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-green-600 dark:text-green-400"/>
              </div>
              <div className="text-left">
                <p className="text-[9px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-0.5">Status</p>
                <p className="text-xs sm:text-base font-bold text-[#0F172A] dark:text-white leading-none">Verified & Valid</p>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}
