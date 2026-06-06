"use client";

import Link from "next/link";
import { useState, useMemo, useDeferredValue, memo } from "react";
import { playfair } from "../fonts"; // <-- CRITICAL FIX: Centralized font to prevent memory leaks
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiUsers, FiClock, FiArrowRight } from "react-icons/fi";

// Note: If this data eventually comes from a database, pass it in as a prop 
// from a Server Component rather than defining it here.
const INTERNSHIPS = [
  { title: "Frontend Development", category: "Development", users: "23.9K", duration: "4 Weeks", color: "from-blue-400 to-blue-600" },
  { title: "Backend Development", category: "Development", users: "21.9K", duration: "4 Weeks", color: "from-teal-400 to-teal-600" },
  { title: "Full Stack Development", category: "Development", users: "91.5K", duration: "4 Weeks", color: "from-indigo-400 to-indigo-600" },
  { title: "App Development", category: "Development", users: "50.0K", duration: "4 Weeks", color: "from-purple-400 to-purple-600" },
  { title: "Python Programming", category: "Programming", users: "19.7K", duration: "4 Weeks", color: "from-yellow-400 to-orange-500" },
  { title: "Java Programming", category: "Programming", users: "57.1K", duration: "4 Weeks", color: "from-red-400 to-rose-600" },
];

const CATEGORIES = ["All Programs", "Development", "Programming", "AI & Data Science", "Design", "Business"];

// 1. Extracted Card into a memoized component to prevent unnecessary re-renders
const InternshipCard = memo(({ internship }: { internship: typeof INTERNSHIPS[0] }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.2 }} 
    className="bg-white dark:bg-[#111C3A] rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-300 border border-gray-100 dark:border-gray-800 group flex flex-col"
  >
    <div className={`h-40 sm:h-48 w-full bg-gradient-to-br ${internship.color} flex items-center justify-center relative overflow-hidden shrink-0`}>
      <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/40 backdrop-blur-sm text-[10px] sm:text-xs font-bold text-gray-800 dark:text-white px-3 py-1.5 rounded-full z-10 shadow-sm">
        {internship.category}
      </div>
      <h3 className={`${playfair.className} text-2xl sm:text-3xl text-white font-bold opacity-30 tracking-wider absolute`}>
        {internship.title.split(" ")[0]}
      </h3>
    </div>

    <div className="p-5 sm:p-6 flex flex-col flex-grow">
      <h3 className={`${playfair.className} text-xl sm:text-2xl text-[#0F172A] dark:text-white font-semibold mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
        {internship.title}
      </h3>
      
      <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm gap-4 sm:gap-6 mb-6 sm:mb-8 mt-auto">
        <span className="flex items-center gap-1.5 sm:gap-2"><FiUsers className="text-blue-500 shrink-0" /> {internship.users}</span>
        <span className="flex items-center gap-1.5 sm:gap-2"><FiClock className="text-blue-500 shrink-0" /> {internship.duration}</span>
      </div>

      {/* Dynamic Link to Application Form */}
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
        className="w-full bg-[#0F172A] dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-500 text-white font-semibold py-3 sm:py-3.5 rounded-xl flex items-center justify-center gap-2 transition active:scale-95 text-sm sm:text-base mt-auto"
      >
        Apply Now <FiArrowRight className="shrink-0" />
      </Link>
    </div>
  </motion.div>
));

InternshipCard.displayName = "InternshipCard";

// ================= MAIN PAGE COMPONENT =================

export default function InternshipsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Programs");

  // Defer the search query so typing is instantly responsive
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Memoize the filtering logic so it only runs when the deferred query or category changes
  const filteredInternships = useMemo(() => {
    return INTERNSHIPS.filter((internship) => {
      const query = deferredSearchQuery.toLowerCase();
      const matchesSearch = internship.title.toLowerCase().includes(query) || 
                            internship.category.toLowerCase().includes(query);
      
      const matchesCategory = activeCategory === "All Programs" || internship.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [deferredSearchQuery, activeCategory]);

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#050A18] min-h-screen pb-12 transition-colors duration-300">
      
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