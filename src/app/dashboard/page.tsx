"use client";

import { useState } from "react";
import { playfair } from "../fonts"; // or "@/app/fonts" depending on your setup
import { motion } from "framer-motion";
import { 
  FiGrid, FiBookOpen, FiAward, FiTrendingUp, 
  FiSettings, FiLogOut, FiBell, FiSearch, 
  FiArrowRight, FiCheckCircle, FiClock, FiMenu, FiX 
} from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";

// --- MOCK DATA ---
const RECENT_ACTIVITY = [
  { id: 1, title: "Machine Learning Basics", type: "Assessment Passed", score: "92%", time: "2 hours ago", status: "success" },
  { id: 2, title: "Python for Data Science", type: "Module Completed", score: "-", time: "Yesterday", status: "neutral" },
  { id: 3, title: "Data Visualization UI", type: "Certificate Unlocked", score: "100%", time: "3 days ago", status: "special" },
];

const SIDEBAR_LINKS = [
  { name: "Dashboard", icon: FiGrid, href: "/dashboard" },
  { name: "Skill Courses", icon: FiBookOpen, href: "/skill_courses" },
  { name: "My Certificates", icon: FiAward, href: "/certificates" },
  { name: "Analytics", icon: FiTrendingUp, href: "/analytics" },
];

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // Tracks current URL

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050A18] text-[#0F172A] dark:text-gray-200 transition-colors duration-300 font-sans flex">
      
      {/* ================= SIDEBAR (DESKTOP) ================= */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 sticky top-0 h-[calc(100vh-80px)] sm:h-[calc(100vh-88px)] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A1024] z-40">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
            N
          </div>
          <span className={`${playfair.className} text-2xl font-bold tracking-wide text-[#0F172A] dark:text-white`}>
            NIT<span className="text-blue-500">.</span>
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <p className="px-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Menu</p>
          {SIDEBAR_LINKS.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link 
                href={link.href}
                key={link.name}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${
                  isActive 
                    ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-[#0F172A] dark:hover:text-white"
                }`}
              >
                <link.icon className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mb-4">
          <div className="bg-gray-50 dark:bg-[#111C3A] rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px]">
                <div className="w-full h-full bg-white dark:bg-[#0A1024] rounded-full overflow-hidden border-2 border-white dark:border-[#0A1024]">
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold">NC</div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">Niraj Chandra</h4>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-red-500 dark:hover:text-red-400 py-2 transition-colors">
              <FiLogOut /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-20 px-6 sm:px-10 flex items-center justify-between bg-white/80 dark:bg-[#050A18]/80 backdrop-blur-md sticky top-0 z-30 border-b border-transparent dark:border-gray-800/50">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-500" onClick={() => setIsMobileMenuOpen(true)}>
              <FiMenu className="w-6 h-6" />
            </button>
            <h1 className={`${playfair.className} text-2xl font-bold text-[#0F172A] dark:text-white hidden sm:block`}>
              Overview
            </h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative hidden md:block">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search courses..." 
                className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-[#111C3A] border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-[#111C3A] rounded-full text-sm w-64 transition-all outline-none"
              />
            </div>
            <button className="relative text-gray-500 hover:text-[#0F172A] dark:hover:text-white transition-colors">
              <FiBell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#050A18]"></span>
            </button>
            <button className="text-gray-500 hover:text-[#0F172A] dark:hover:text-white transition-colors">
              <FiSettings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dashboard Content - Bento Grid Layout */}
        <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            
            {/* Bento 1: Welcome & Current Focus (Spans 2 columns) */}
            <motion.div variants={itemVariants} className="md:col-span-2 relative overflow-hidden bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl p-8 sm:p-10 text-white shadow-lg shadow-blue-500/20 group">
              <div className="absolute -right-10 -top-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute right-10 bottom-10 w-32 h-32 bg-teal-300 opacity-20 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase mb-4 shadow-sm border border-white/10">
                  Active Learning
                </span>
                <h2 className={`${playfair.className} text-3xl sm:text-4xl font-bold mb-2`}>Welcome back, Niraj!</h2>
                <p className="text-blue-50 mb-8 max-w-md text-sm sm:text-base leading-relaxed">
                  You are 80% through the <strong>Machine Learning & Data Science</strong> program. Keep up the momentum to earn your certificate!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all">
                    Resume Course <FiArrowRight />
                  </button>
                  <p className="text-xs text-blue-100 font-medium flex items-center gap-1.5">
                    <FiClock /> Last active 2 hours ago
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Bento 2: Radial Performance Stat */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-[#111C3A] rounded-3xl p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">Average Score</h3>
              
              <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-100 dark:text-gray-800" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="283" strokeDashoffset="28" className="text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold text-[#0F172A] dark:text-white">90%</span>
                </div>
              </div>
              
              <p className="text-xs font-semibold text-teal-500 bg-teal-50 dark:bg-teal-500/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                <FiTrendingUp /> Top 5% of Students
              </p>
            </motion.div>

            {/* Bento 3: Quick Stats Row */}
            <motion.div variants={itemVariants} className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: "Courses Attempted", value: "4", icon: FiBookOpen, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
                { label: "Certificates Unlocked", value: "2", icon: FiAward, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
                { label: "Assessments Passed", value: "12", icon: FiCheckCircle, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-500/10" },
                { label: "Learning Hours", value: "48", icon: FiClock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-[#111C3A] p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white mb-1">{stat.value}</h4>
                  <p className="text-xs font-bold text-gray-400 tracking-wide uppercase">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Bento 4: Recent Activity Timeline */}
            <motion.div variants={itemVariants} className="md:col-span-2 bg-white dark:bg-[#111C3A] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className={`${playfair.className} text-2xl font-bold text-[#0F172A] dark:text-white`}>Recent Activity</h3>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors flex items-center gap-1">
                  View All <FiArrowRight />
                </button>
              </div>

              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-700 before:to-transparent">
                {RECENT_ACTIVITY.map((activity) => (
                  <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-[#111C3A] bg-blue-100 dark:bg-blue-900/30 text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      {activity.status === 'success' ? <FiCheckCircle className="w-4 h-4 text-teal-500" /> : 
                       activity.status === 'special' ? <FiAward className="w-4 h-4 text-purple-500" /> : 
                       <FiBookOpen className="w-4 h-4" />}
                    </div>
                    
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 dark:bg-[#0A1024] p-4 rounded-xl border border-gray-100 dark:border-gray-800 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">{activity.title}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          activity.status === 'success' ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400' :
                          activity.status === 'special' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' :
                          'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                          {activity.score}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.type}</p>
                      <p className="text-[10px] font-semibold text-gray-400 mt-2 uppercase tracking-wider">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bento 5: Upcoming / Motivation */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] dark:from-[#111C3A] dark:to-[#0A1024] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                  <FiAward className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className={`${playfair.className} text-2xl font-bold mb-3`}>Ready for your next badge?</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Complete the final assessment in your Data Science module to unlock the verified credential.
                </p>
              </div>
              <button className="w-full bg-white text-[#0F172A] py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-colors mt-auto">
                Go to Assessment
              </button>
            </motion.div>

          </motion.div>
        </div>
      </main>

      {/* ================= MOBILE OVERLAY MENU ================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden flex">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="w-72 h-full bg-white dark:bg-[#0A1024] flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
              <span className={`${playfair.className} text-xl font-bold text-[#0F172A] dark:text-white`}>NIT<span className="text-blue-500">.</span></span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 p-2"><FiX className="w-6 h-6" /></button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {SIDEBAR_LINKS.map((link) => {
                const isActive = pathname === link.href;
                
                return (
                  <Link 
                    href={link.href}
                    key={link.name} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium ${
                      isActive 
                        ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                        : "text-gray-600 dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white"
                    }`}
                  >
                    <link.icon className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} /> 
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
        </div>
      )}

    </div>
  );
}