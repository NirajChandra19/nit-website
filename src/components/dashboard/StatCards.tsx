"use client";

import { motion, Variants } from "framer-motion";
import { playfair } from "@/app/fonts";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function StatCards({ stats }: { stats: any[] }) {
  return (
    <motion.div variants={itemVariants} className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white dark:bg-[#0B1229] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
            {stat.isLoading ? (
              <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <stat.icon className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4 className={`${playfair?.className || ''} text-3xl sm:text-4xl font-bold text-[#0F172A] dark:text-white mb-2`}>
              {stat.isLoading ? (
                <span className="text-gray-300 dark:text-gray-700 animate-pulse bg-gray-200 dark:bg-gray-800 rounded w-12 h-8 inline-block"></span>
              ) : stat.value}
            </h4>
            <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">{stat.label}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
