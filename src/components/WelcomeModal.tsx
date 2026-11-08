'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 800); 
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => setIsOpen(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 perspective-[1000px]">
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40, rotateX: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20, rotateX: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[2rem] shadow-[0_0_60px_-15px_rgba(249,115,22,0.4)] overflow-hidden transform-gpu"
          >
            {/* Ambient Background Glows */}
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-orange-500/30 to-yellow-500/30 blur-[60px] rounded-full pointer-events-none" 
            />
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 blur-[60px] rounded-full pointer-events-none" 
            />
            
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors z-20 group"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Diwali Image Header */}
            <div className="relative w-full h-48 sm:h-56 bg-slate-900 overflow-hidden">
              {/* NOTE: Replace the src with your actual image path */}
              <Image 
                src="/images/diwali.png" 
                alt="Happy Diwali Celebration"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 500px"
              />
              {/* Fade out bottom of image into the card background */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/95 dark:to-[#0B1120]/95" />
            </div>

            {/* Content Area */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="relative z-10 flex flex-col items-center text-center px-8 pb-10 sm:px-10"
            >
              
              <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">NIT</span>
              </motion.h2>
              
              {/* Festive Message */}
              <motion.div variants={itemVariants} className="mb-8">
                <p className="text-base sm:text-lg font-semibold text-orange-600 dark:text-orange-400 mb-2">
                  ✨ Happy & Prosperous Diwali! ✨
                </p>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed px-2">
                  May this festival of lights illuminate your journey towards success. Dive into our live industry projects and illuminate your tech career with us!
                </p>
              </motion.div>
              
              <motion.button
                variants={itemVariants}
                onClick={handleClose}
                className="group relative w-full py-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-lg rounded-xl transition-all shadow-[0_8px_30px_-8px_rgba(249,115,22,0.5)] overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                <span className="relative flex items-center justify-center gap-2">
                  Explore Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </motion.div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}