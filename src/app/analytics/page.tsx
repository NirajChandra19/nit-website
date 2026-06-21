"use client";

import { useState, memo } from "react";
import { playfair } from "../fonts"; 
import { motion } from "framer-motion";
import { 
  FiGrid, FiBookOpen, FiAward, FiTrendingUp, 
  FiSettings, FiLogOut, FiBell, FiSearch, 
  FiMenu, FiX, FiClock, FiTarget, FiActivity, FiPieChart 
} from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";

// --- MOCK DATA ---
const SIDEBAR_LINKS = [
  { name: "Dashboard", icon: FiGrid, href: "/dashboard" },
  { name: "Skill Courses", icon: FiBookOpen, href: "/skill-courses" },
  { name: "My Certificates", icon: FiAward, href: "/certificates" },
  { name: "Analytics", icon: FiTrendingUp, href: "/analytics" },
];

const WEEKLY_DATA = [
  { day: "Mon", hours: 2.5, percentage: 40 },
  { day: "Tue", hours: 4.0, percentage: 75 },
  { day: "Wed", hours: 1.5, percentage: 25 },
  { day: "Thu", hours: 5.5, percentage: 100 },
  { day: "Fri", hours: 3.0, percentage: 55 },
  { day: "Sat", hours: 6.0, percentage: 110 },
  { day: "Sun", hours: 2.0, percentage: 35 },
];

const SKILL_MASTERY = [
  { skill: "Python Programming", progress: 85, color: "bg-blue-500" },
  { skill: "Data Visualization", progress: 65, color: "bg-purple-500" },
  { skill: "Machine Learning", progress: 40, color: "bg-teal-500" },
  { skill: "SQL Databases", progress: 92, color: "bg-amber-500" },
];

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// ================= OPTIMIZED SUB-COMPONENTS =================

// 1. Memoized Weekly Bar Chart Item
const WeeklyBar = memo(({ day, idx }: { day: typeof WEEKLY_DATA[0], idx: number }) => (
  <div className="relative flex flex-col items-center flex-1 group">
    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] text-xs font-bold py-1 px-2 rounded transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
      {day.hours} hrs
    </div>
    <div className="w-full max-w-[40px] h-full flex items-end justify-center rounded-t-lg bg-gray-50 dark:bg-[#0A1024] group-hover:bg-gray-100 dark:group-hover:bg-[#1E293B] transition-colors relative overflow-hidden">
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: `${Math.min(day.percentage, 100)}%` }}
        transition={{ duration: 1, delay: idx * 0.1, type: "spring" }}
        className={`w-full rounded-t-lg ${day.percentage > 100 ? 'bg-teal-400' : 'bg-blue-600 dark:bg-blue-500'}`}
      />
    </div>
    <span className="text-xs font-bold text-gray-400 mt-4 uppercase">{day.day}</span>
  </div>
));
WeeklyBar.displayName = "WeeklyBar";

// 2. Memoized Skill Progress Bar
const SkillProgressBar = memo(({ item, idx }: { item: typeof SKILL_MASTERY[0], idx: number }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-bold text-[#0F172A] dark:text-gray-200">{item.skill}</span>
      <span className="text-xs font-bold text-gray-500">{item.progress}%</span>
    </div>
    <div className="w-full h-3 bg-gray-100 dark:bg-[#0A1024] rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${item.progress}%` }}
        transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
        className={`h-full rounded-full ${item.color}`}
      />
    </div>
  </div>
));
SkillProgressBar.displayName = "SkillProgressBar";


// ================= MAIN PAGE COMPONENT =================

export default function AnalyticsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); 

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050A18] text-[#0F172A] dark:text-gray-200 transition-colors duration-300 font-sans flex">
      
      {/* SIDEBAR (DESKTOP) */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 sticky top-0 h-[calc(100vh-80px)] sm:h-[calc(100vh-88px)] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A1024] z-40">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">N</div>
          <span className={`${playfair.className} text-2xl font-bold tracking-wide text-[#0F172A] dark:text-white`}>NIT<span className="text-blue-500">.</span></span>
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
                    ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/50" 
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
              <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">Niraj Chandra</h4>
            </div>
            <button className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-red-500 dark:hover:text-red-400 py-2 transition-colors"><FiLogOut /> Sign Out</button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-20 px-6 sm:px-10 flex items-center justify-between bg-white/80 dark:bg-[#050A18]/80 backdrop-blur-md sticky top-0 z-30 border-b border-transparent dark:border-gray-800/50">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-500" onClick={() => setIsMobileMenuOpen(true)}><FiMenu className="w-6 h-6" /></button>
            <h1 className={`${playfair.className} text-2xl font-bold text-[#0F172A] dark:text-white hidden sm:block`}>Performance Analytics</h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative hidden md:block">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              {/* FIX: Suppress Hydration Warning for input field */}
              <input suppressHydrationWarning type="text" placeholder="Search metrics..." className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-[#111C3A] border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-[#111C3A] rounded-full text-sm w-64 transition-all outline-none" />
            </div>
            <button className="relative text-gray-500 hover:text-[#0F172A] dark:hover:text-white transition-colors"><FiBell className="w-5 h-5" /></button>
            <button className="text-gray-500 hover:text-[#0F172A] dark:hover:text-white transition-colors"><FiSettings className="w-5 h-5" /></button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 sm:space-y-8">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: "Total Time Spent", value: "124h 30m", change: "+12% this week", icon: FiClock, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
                { label: "Completion Rate", value: "78%", change: "+5% vs last month", icon: FiTarget, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-500/10" },
                { label: "Current Streak", value: "14 Days", change: "Personal Best!", icon: FiActivity, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
                { label: "Avg Assessment", value: "91.5%", change: "Top 3% percentile", icon: FiPieChart, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
              ].map((stat, i) => (
                <motion.div key={i} variants={itemVariants} className="bg-white dark:bg-[#111C3A] p-5 sm:p-6 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}><stat.icon className="w-6 h-6" /></div>
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">{stat.change}</span>
                  </div>
                  <h4 className="text-3xl font-bold text-[#0F172A] dark:text-white mb-1">{stat.value}</h4>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Middle Section: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Custom Bar Chart: Weekly Activity */}
              <motion.div variants={itemVariants} className="lg:col-span-2 bg-white dark:bg-[#111C3A] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className={`${playfair.className} text-2xl font-bold text-[#0F172A] dark:text-white`}>Study Hours</h3>
                    <p className="text-sm text-gray-500 mt-1">Your learning activity for the past 7 days</p>
                  </div>
                  {/* FIX: Suppress Hydration Warning for select dropdown */}
                  <select suppressHydrationWarning className="bg-gray-50 dark:bg-[#0A1024] border border-gray-200 dark:border-gray-700 text-sm rounded-xl px-4 py-2 outline-none text-[#0F172A] dark:text-white font-medium focus:border-blue-500 transition-colors cursor-pointer">
                    <option>This Week</option>
                    <option>Last Week</option>
                    <option>This Month</option>
                  </select>
                </div>

                <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 border-b border-gray-100 dark:border-gray-800">
                  {WEEKLY_DATA.map((day, idx) => (
                    <WeeklyBar key={idx} day={day} idx={idx} />
                  ))}
                </div>
              </motion.div>

              {/* Progress Bars: Skill Mastery */}
              <motion.div variants={itemVariants} className="bg-white dark:bg-[#111C3A] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm flex flex-col">
                <div className="mb-6">
                  <h3 className={`${playfair.className} text-2xl font-bold text-[#0F172A] dark:text-white`}>Skill Mastery</h3>
                  <p className="text-sm text-gray-500 mt-1">Based on assessment scores</p>
                </div>

                <div className="flex-1 space-y-6 sm:space-y-8 flex flex-col justify-center">
                  {SKILL_MASTERY.map((item, idx) => (
                    <SkillProgressBar key={idx} item={item} idx={idx} />
                  ))}
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </main>

      {/* MOBILE OVERLAY MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden flex">
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="w-72 h-full bg-white dark:bg-[#0A1024] flex flex-col">
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
                      isActive ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
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