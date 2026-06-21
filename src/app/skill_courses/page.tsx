"use client";

import { useState, useEffect, useMemo, useDeferredValue, memo } from "react";
import { playfair } from "../fonts"; // or "@/app/fonts" depending on your setup
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch, FiClock, FiFileText, FiCheckCircle, 
  FiAward, FiArrowRight, FiTerminal, FiActivity, 
  FiDatabase, FiPenTool, FiCode, FiCpu, FiBookOpen
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

interface Course {
  id: number;
  category: string;
  title: string;
  description: string;
  duration: string;
  icon_name: string;
  type: string;
}

const IconMap: Record<string, React.ElementType> = {
  FiTerminal: FiTerminal,
  FiActivity: FiActivity,
  FiDatabase: FiDatabase,
  FiPenTool: FiPenTool,
  FiCode: FiCode,
  FiCpu: FiCpu,
};

// 1. Extract the Card into a Memoized Component
const CourseCard = memo(({ course, index }: { course: Course, index: number }) => {
  const IconComponent = IconMap[course.icon_name] || FiBookOpen;
  const { user } = useAuth();
  const router = useRouter();

  const handleStartCourse = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { 
      router.push(`/login?redirect=/skill_courses/${course.id}/quiz`); 
      return; 
    }
    router.push(`/skill_courses/${course.id}/quiz`);
  };
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="bg-white dark:bg-[#111C3A] rounded-[2rem] p-8 md:p-10 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-[0_20px_40px_rgba(37,99,235,0.08)] dark:hover:shadow-[0_20px_40px_rgba(37,99,235,0.15)] hover:-translate-y-2 transition-all duration-300 flex flex-col group relative overflow-hidden"
    >
      {/* Decorative Background Glow on Hover */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Header: Category & Icon */}
      <div className="flex justify-between items-start mb-6">
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800/50">
          {course.category}
        </span>
        <div className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
          <IconComponent className="w-6 h-6" />
        </div>
      </div>

      {/* Title & Description */}
      <h3 className={`${playfair.className} text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-white mb-4 transition-colors`}>
        {course.title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 flex-grow transition-colors">
        {course.description}
      </p>

      {/* 2x2 Meta Grid */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-10 border-t border-gray-100 dark:border-gray-800/80 pt-6">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <FiClock className="w-4 h-4 text-blue-500 shrink-0" /> 10 mins
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <FiFileText className="w-4 h-4 text-purple-500 shrink-0" /> 15 Qs
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <FiCheckCircle className="w-4 h-4 text-teal-500 shrink-0" /> Pass: {'> 60%'}
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <FiAward className="w-4 h-4 text-amber-500 shrink-0" /> Certificate
        </div>
      </div>

      {/* Action Button */}
      <button onClick={handleStartCourse} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg group-hover:gap-4 transition-all w-fit mt-auto outline-none">
        Start Course <FiArrowRight className="w-5 h-5 shrink-0" />
      </button>
    </motion.div>
  );
});

CourseCard.displayName = "CourseCard";

export default function SkillCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. State for handling user input
  const [searchQuery, setSearchQuery] = useState("");
  
  // 3. Defer the search query to keep the UI from freezing while typing
  const deferredSearchQuery = useDeferredValue(searchQuery);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses);
        }
      } catch (error) {
        console.error('Failed to load courses', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // 4. Filter logic based on title, category, or description
  const filteredCourses = useMemo(() => {
    const query = deferredSearchQuery.toLowerCase();
    if (!query) return courses;

    return courses.filter((course) => 
      course.title.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query) ||
      course.description?.toLowerCase().includes(query)
    );
  }, [deferredSearchQuery, courses]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050A18] pt-10 pb-10 transition-colors duration-300">
      
      {/* ================= HERO & SEARCH SECTION ================= */}
      <section className="text-center px-4 max-w-4xl mx-auto mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${playfair.className} text-5xl md:text-7xl text-[#0F172A] dark:text-white font-medium mb-6 tracking-tight transition-colors`}
        >
          Validate your skills. <br />
          <span className="bg-gradient-to-r from-blue-600 to-teal-400 dark:from-blue-400 dark:to-teal-300 bg-clip-text text-transparent italic pr-2">
            Get Certified.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12 transition-colors"
        >
          Take industry-aligned assessments and earn verified certificates to prove your technical expertise.
        </motion.p>

        {/* Premium Glassmorphic Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400 w-6 h-6" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a skill or domain (e.g., Python)..." 
            className="w-full bg-white dark:bg-[#111C3A]/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700/50 rounded-2xl py-6 pl-16 pr-8 text-lg text-gray-900 dark:text-white shadow-[0_20px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </motion.div>
      </section>

      {/* ================= COURSES GRID ================= */}
      <section className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center py-20"
          >
            <h3 className="text-2xl font-bold text-gray-400 dark:text-gray-600 mb-2">No courses found</h3>
            <p className="text-gray-500">We couldn&apos;t find anything matching &quot;{searchQuery}&quot;</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="mt-6 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Clear search
            </button>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Bottom Security Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 flex justify-center"
        >
          <div className="inline-flex items-center gap-3 bg-white dark:bg-[#111C3A] border border-gray-200 dark:border-gray-800 px-6 py-3 rounded-full shadow-sm">
            <FiAward className="text-teal-500 w-5 h-5" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Get a verified certificate after passing the assessment.
            </span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}