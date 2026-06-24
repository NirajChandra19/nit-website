"use client";

import Link from "next/link";
import { useState, useMemo, useDeferredValue, memo, useEffect } from "react";
import { playfair } from "../fonts"; 
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiUsers, FiClock, FiArrowRight } from "react-icons/fi";
import { internshipService } from "@/lib/services/api";
import { CourseOrInternship } from "@/types";

const CATEGORIES = ["All Programs", "Development", "Programming", "AI & Data Science", "Design", "Business"];

// 1. Extracted Card into a memoized component to prevent unnecessary re-renders
const InternshipCard = memo(({ internship }: { internship: CourseOrInternship }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }} 
    className="group relative flex flex-col bg-white dark:bg-[#0B1221] rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800/60 shadow-sm hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgba(30,86,160,0.15)] transition-all duration-500 hover:-translate-y-1"
  >
    {/* Top Gradient/Image Area with Glassmorphism */}
    <div className={`relative h-48 sm:h-52 w-full bg-gradient-to-br ${internship.color || 'from-slate-100 to-gray-50 dark:from-slate-800 dark:to-slate-900'} p-6 flex flex-col justify-between overflow-hidden shrink-0`}>
      {/* Aesthetic Glowing Orbs */}
      <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/30 dark:bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-black/5 dark:bg-black/20 rounded-full blur-2xl"></div>

      {/* Frosted Glass Badge */}
      <div className="relative z-10 inline-flex">
        <span className="bg-white/80 dark:bg-[#111C3A]/80 backdrop-blur-md text-blue-600 dark:text-blue-400 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm border border-white/40 dark:border-gray-700/50">
          {internship.category}
        </span>
      </div>

      {/* Decorative Background Text */}
      {/* Decorative Background Text */}
      <h3 className={`${playfair.className} text-6xl sm:text-7xl font-bold text-black/5 dark:text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 tracking-tighter group-hover:scale-110 transition-all duration-500 select-none pointer-events-none w-full text-center`}>
        {internship.title.split(" ")[0]}
      </h3>
    </div>

    {/* Content Area */}
    <div className="p-6 sm:p-7 flex flex-col flex-grow z-10 bg-white dark:bg-[#0B1221]">
      <h3 className={`${playfair.className} text-xl sm:text-2xl text-gray-900 dark:text-white font-bold mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2`}>
        {internship.title}
      </h3>
      
      {/* Meta Stats aligned perfectly */}
      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm gap-6 mb-8 mt-auto font-medium">
        <span className="flex items-center gap-2">
          <FiUsers className="text-blue-500/80 dark:text-blue-400 w-4 h-4 shrink-0" /> 
          <span className="leading-none">{internship.users || "120"}K</span>
        </span>
        <span className="flex items-center gap-2">
          <FiClock className="text-blue-500/80 dark:text-blue-400 w-4 h-4 shrink-0" /> 
          <span className="leading-none">{internship.duration} Weeks</span>
        </span>
      </div>

      {/* Animated Action Button */}
      <Link 
        href={{
          pathname: "/internships/apply",
          query: {
            title: internship.title,
            duration: internship.duration,
            category: internship.category,
            color: internship.color
          }
        }}
        className="w-full bg-[#0F172A] hover:bg-blue-600 dark:bg-[#1E293B] dark:hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-blue-500/25 mt-auto group/btn"
      >
        Apply Now <FiArrowRight className="shrink-0 group-hover/btn:translate-x-1 transition-transform duration-300" />
      </Link>
    </div>
  </motion.div>
));

InternshipCard.displayName = "InternshipCard";

// ================= MAIN PAGE COMPONENT =================

export default function InternshipsPage() {
  const [internships, setInternships] = useState<CourseOrInternship[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Programs");

  useEffect(() => {
    const fetchInternships = async () => {
      const data = await internshipService.getAll();
      setInternships(data);
    };
    fetchInternships();
  }, []);

  // Defer the search query so typing is instantly responsive
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Memoize the filtering logic so it only runs when the deferred query or category changes
  const filteredInternships = useMemo(() => {
    return internships.filter((internship) => {
      const query = deferredSearchQuery.toLowerCase();
      const matchesSearch = internship.title.toLowerCase().includes(query) || 
                            internship.category.toLowerCase().includes(query);
      
      const matchesCategory = activeCategory === "All Programs" || internship.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [deferredSearchQuery, activeCategory, internships]);

  return (
    <div className="bg-transparent relative z-10 min-h-screen pb-12 transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="text-center pt-10 pb-8 px-4 max-w-4xl mx-auto">
        <h1 className={`${playfair.className} text-4xl sm:text-5xl md:text-6xl text-[#0F172A] dark:text-white mb-4 transition-colors`}>
          Available <span className="text-[#1E56A0] dark:text-blue-400 italic">Internships</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto transition-colors">
          Choose from a wide range of technical and non-technical domains. Gain hands-on experience and get certified.
        </p>
      </section>

      {/* Search & Filters */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="relative max-w-3xl mx-auto mb-6 sm:mb-8">
          <FiSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search domains (e.g., Python)..." 
            className="w-full bg-white dark:bg-[#111C3A] border border-transparent dark:border-gray-700 rounded-full py-4 sm:py-5 pl-14 sm:pl-16 pr-8 text-base sm:text-lg text-gray-900 dark:text-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {CATEGORIES.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                activeCategory === cat 
                  ? "bg-[#0F172A] dark:bg-blue-600 text-white shadow-md" 
                  : "bg-white dark:bg-[#111C3A] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-white shadow-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Internship Cards Grid */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 min-h-[400px]">
        {filteredInternships.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-400 dark:text-gray-600 mb-2">No internships found</h3>
            <p className="text-gray-500">Try adjusting your search or category filters.</p>
            <button 
              onClick={() => { setSearchQuery(""); setActiveCategory("All Programs"); }}
              className="mt-6 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredInternships.map((internship) => (
                <InternshipCard key={internship.title} internship={internship} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

    </div>
  );
}