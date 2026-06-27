"use client";

import { motion, Variants } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiAward, FiBookOpen } from "react-icons/fi";
import { playfair } from "@/app/fonts";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function RecentActivity({ recentActivity }: { recentActivity: any[] }) {
  return (
    <motion.div variants={itemVariants} className="md:col-span-2 bg-white dark:bg-[#050A18] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm">
      <div className="flex justify-between items-center mb-10">
        <h3 className={`${playfair?.className || ''} text-2xl font-bold text-[#0F172A] dark:text-white`}>Recent Activity</h3>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors flex items-center gap-1">
          View All <FiArrowRight />
        </button>
      </div>

      <div className="relative">
        {/* Central Line */}
        <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800 md:-translate-x-1/2"></div>

        <div className="space-y-8">
          {recentActivity.length > 0 ? recentActivity.map((activity, index) => {
            const isRight = index % 2 === 0; 
            return (
            <div key={activity.id} className={`relative flex items-center justify-between w-full md:justify-center ${isRight ? 'md:flex-row-reverse' : ''} group`}>
              
              {/* Timeline Node */}
              <div className="absolute left-5 md:left-1/2 w-8 h-8 rounded-full border-2 border-white dark:border-[#050A18] bg-blue-50 dark:bg-[#0B1229] text-blue-500 shadow-sm flex items-center justify-center z-10 -translate-x-1/2 group-hover:scale-110 transition-transform">
                {activity.status === 'success' ? <FiCheckCircle className="w-4 h-4 text-teal-500" /> : 
                 activity.status === 'special' ? <FiAward className="w-4 h-4 text-purple-500" /> : 
                 <FiBookOpen className="w-4 h-4" />}
              </div>
              
              {/* Spacer for desktop alignment */}
              <div className="hidden md:block w-1/2"></div>

              {/* Card Content */}
              <div className={`w-[calc(100%-3.5rem)] ml-14 md:ml-0 md:w-[calc(50%-2.5rem)] ${isRight ? 'md:mr-auto md:text-right' : 'md:ml-auto md:text-left'}`}>
                <div className={`inline-block bg-gray-50 dark:bg-[#0B1229] p-5 rounded-2xl w-full border border-gray-100 dark:border-gray-800/60 group-hover:border-blue-200 dark:group-hover:border-blue-800/60 transition-colors text-left`}>
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">{activity.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                      activity.status === 'success' ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400' :
                      activity.status === 'special' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' :
                      'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {activity.score}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.type}</p>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-4 uppercase tracking-widest">{activity.time}</p>
                </div>
              </div>
            </div>
          )}) : (
            <div className="text-center py-10 text-gray-500 w-full">No recent activity found.</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
