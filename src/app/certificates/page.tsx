"use client";

import { useState, memo } from "react";
import { playfair } from "../fonts"; 
import { motion } from "framer-motion";
import {
  FiGrid, FiBookOpen, FiAward, FiTrendingUp, 
  FiSettings, FiLogOut, FiBell, FiSearch, 
  FiMenu, FiX, FiDownload, FiShare2, FiCheckCircle, FiLock,FiArrowLeft
} from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";

// --- MOCK DATA ---
const SIDEBAR_LINKS = [
  { name: "Dashboard", icon: FiGrid, href: "/dashboard" },
  { name: "Skill Courses", icon: FiBookOpen, href: "/skill_courses" },
  { name: "My Certificates", icon: FiAward, href: "/certificates" },
  { name: "Analytics", icon: FiTrendingUp, href: "/analytics" },
];

const EARNED_CERTIFICATES = [
  { 
    id: "CERT-NIT-2025-8901", 
    title: "Machine Learning & Data Science", 
    issueDate: "Aug 15, 2025", 
    grade: "Outstanding (94%)",
    skills: ["Python", "TensorFlow", "Data Analysis"],
    color: "from-blue-500 to-teal-400"
  },
  { 
    id: "CERT-NIT-2025-4432", 
    title: "Python Programming Fundamentals", 
    issueDate: "Oct 26, 2025", 
    grade: "Excellent (88%)",
    skills: ["Data Structures", "Algorithms", "OOP"],
    color: "from-purple-500 to-indigo-500"
  }
];

const IN_PROGRESS = [
  {
    title: "Full Stack Web Development",
    progress: 65,
    modulesLeft: 4,
  }
];

// --- ANIMATION VARIANTS ---
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

// ================= OPTIMIZED SUB-COMPONENTS =================

// 1. Memoized Certificate Card (Prevents re-renders)
const CertificateCard = memo(({ cert }: { cert: typeof EARNED_CERTIFICATES[0] }) => (
  <motion.div variants={itemVariants} className="bg-white dark:bg-[#111C3A] rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
    <div className={`h-24 sm:h-28 bg-gradient-to-r ${cert.color} p-6 relative overflow-hidden shrink-0`}>
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
      <div className="flex justify-between items-start relative z-10">
        <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <FiCheckCircle /> Verified
        </div>
        <FiAward className="text-white/40 w-12 h-12 -mt-2 -mr-2" />
      </div>
    </div>

    <div className="p-6 flex flex-col flex-1">
      <h3 className={`${playfair.className} text-xl font-bold text-[#0F172A] dark:text-white mb-4 line-clamp-2`}>{cert.title}</h3>
      
      <div className="space-y-3 mb-6 flex-1 text-sm">
        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Issue Date</span><span className="font-semibold text-[#0F172A] dark:text-gray-200">{cert.issueDate}</span></div>
        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Grade</span><span className="font-semibold text-teal-600 dark:text-teal-400">{cert.grade}</span></div>
        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Credential ID</span><span className="font-mono text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-[#0A1024] px-2 py-0.5 rounded">{cert.id}</span></div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {cert.skills.map((skill) => (
          <span key={skill} className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 py-1 rounded-md">{skill}</span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        <button className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"><FiDownload /> Download</button>
        <button className="border border-gray-200 dark:border-gray-700 text-[#0F172A] dark:text-white hover:border-gray-300 dark:hover:border-gray-600 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"><FiShare2 /> Share</button>
      </div>
    </div>
  </motion.div>
));
CertificateCard.displayName = "CertificateCard";

// 2. Memoized In-Progress Card
const InProgressCard = memo(({ course }: { course: typeof IN_PROGRESS[0] }) => (
  <motion.div variants={itemVariants} className="bg-white dark:bg-[#111C3A] p-6 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 flex flex-col relative overflow-hidden">
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400"><FiLock className="w-5 h-5" /></div>
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">Locked</span>
    </div>
    <h3 className="font-bold text-[#0F172A] dark:text-white mb-2">{course.title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{course.modulesLeft} modules left to unlock</p>
    <div className="mt-auto">
      <div className="flex justify-between text-xs font-bold text-[#0F172A] dark:text-gray-300 mb-2"><span>Progress</span><span>{course.progress}%</span></div>
      <div className="w-full h-2 bg-gray-100 dark:bg-[#0A1024] rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
      </div>
    </div>
  </motion.div>
));
InProgressCard.displayName = "InProgressCard";

// ================= MAIN PAGE COMPONENT =================

export default function CertificatesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); 

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050A18] transition-colors duration-300 pt-10 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Navigation */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 group">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>

        <h1 className={`${playfair.className} text-4xl font-bold text-[#0F172A] dark:text-white mb-10`}>My Certificates</h1>

        {/* Content */}
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-12">
          
          {/* Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center"><FiCheckCircle className="w-6 h-6" /></div>
              <div>
                <h3 className="text-[#0F172A] dark:text-white font-bold text-lg">Official NIT Credentials</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">All certificates are globally recognized and verified.</p>
              </div>
            </div>
            <Link href="/verification" className="bg-white dark:bg-[#111C3A] border border-gray-200 dark:border-gray-700 hover:border-blue-500 text-[#0F172A] dark:text-white font-semibold py-2.5 px-5 rounded-xl transition-colors shadow-sm text-sm whitespace-nowrap">Verify a Certificate</Link>
          </div>

          {/* Certificates Grid */}
          <div>
            <h2 className={`${playfair.className} text-2xl font-bold text-[#0F172A] dark:text-white mb-6`}>Earned Certificates</h2>
            {EARNED_CERTIFICATES.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-[#111C3A] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                <FiAward className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#0F172A] dark:text-white">No certificates yet</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {EARNED_CERTIFICATES.map((cert) => <CertificateCard key={cert.id} cert={cert} />)}
              </div>
            )}
          </div>

          {/* In Progress */}
          <div>
            <h2 className={`${playfair.className} text-2xl font-bold text-[#0F172A] dark:text-white mb-6`}>In Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {IN_PROGRESS.map((course, idx) => <InProgressCard key={idx} course={course} />)}
            </div>
          </div>
        </motion.div>

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
                    <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium ${isActive ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}>
                      <link.icon className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} /> {link.name}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
          </div>
        )}
      </div>
    </div>
  );
}