"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { playfair } from "@/app/fonts";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function WelcomeCard({ 
  profile, 
  latestEnrollment, 
  progress, 
  t 
}: { 
  profile: any, 
  latestEnrollment: any, 
  progress: number, 
  t: (key: string) => string 
}) {
  return (
    <motion.div variants={itemVariants} className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 rounded-3xl p-8 sm:p-10 text-white shadow-2xl shadow-blue-500/30 group hover:-translate-y-1 transition-all duration-300">
      <div className="absolute -right-10 -top-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
      <div className="absolute right-10 bottom-10 w-32 h-32 bg-teal-300 opacity-20 rounded-full blur-2xl"></div>
      
      <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase shadow-sm border border-white/10">Active Learning</span>
          {profile?.reg_id && <span className="inline-block px-3 py-1 bg-blue-900/40 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase shadow-sm border border-white/10 text-blue-50">Reg ID: {profile.reg_id}</span>}
        </div>
        <h2 className={`${playfair?.className || ''} text-3xl sm:text-4xl font-bold mb-2`}>{t("Welcome back")}, {profile?.name?.split(' ')[0] || "Student"}!</h2>
        <p className="text-blue-50 mb-8 max-w-md text-sm sm:text-base leading-relaxed">
          {latestEnrollment ? <>You are {progress}% through the <strong>{latestEnrollment.course_title}</strong> program. Keep up the momentum!</> : <>You haven&apos;t enrolled in any courses yet. Explore our skill courses to get started!</>}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Link href="/skill_courses" className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all">
            {latestEnrollment ? "Resume Course" : "Browse Courses"} <FiArrowRight />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
