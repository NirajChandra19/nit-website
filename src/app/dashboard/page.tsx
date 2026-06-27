"use client";

import { playfair } from "@/app/fonts"; 
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import AverageScoreChart from "@/components/dashboard/AverageScoreChart";
import StatCards from "@/components/dashboard/StatCards";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { FiAward } from "react-icons/fi";
import { useDashboardData } from "@/hooks/useDashboardData";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function DashboardPage() {
  const { 
    authIsLoading, 
    loading, 
    profile, 
    stats, 
    recentActivity, 
    latestEnrollment, 
    progress, 
    currentAverageScore, 
    t 
  } = useDashboardData();

  if (authIsLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full">
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <WelcomeCard profile={profile} latestEnrollment={latestEnrollment} progress={progress} t={t} />
        <AverageScoreChart currentAverageScore={currentAverageScore} t={t} />
        <StatCards stats={stats} />
        <RecentActivity recentActivity={recentActivity} />

        {/* Bento 5: Upcoming / Motivation */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] dark:from-[#111C3A] dark:to-[#0A1024] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
              <FiAward className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className={`${playfair?.className || ''} text-2xl font-bold mb-3`}>
              {latestEnrollment ? "Keep pushing forward!" : "Ready for your first badge?"}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {latestEnrollment 
                ? `Complete the remaining ${100 - progress}% of your ${latestEnrollment.course_title} program to unlock your next verified credential.` 
                : "Enroll in your first skill course today to start earning verified credentials and industry badges."}
            </p>
          </div>
          <Link href="/skill_courses" className="w-full bg-white text-[#0F172A] py-3.5 rounded-xl text-center font-bold hover:bg-gray-100 transition-colors mt-auto">
            Go to Courses
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}