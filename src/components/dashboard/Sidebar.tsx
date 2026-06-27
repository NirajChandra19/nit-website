"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { playfair } from "@/app/fonts"; 
import { motion, AnimatePresence } from "framer-motion";
import { FiGrid, FiBookOpen, FiAward, FiTrendingUp, FiLogOut, FiX } from "react-icons/fi";

const SIDEBAR_LINKS = [
  { name: "Dashboard", icon: FiGrid, href: "/dashboard" },
  { name: "Skill Courses", icon: FiBookOpen, href: "/skill_courses" },
  { name: "My Certificates", icon: FiAward, href: "/certificates" },
  { name: "Analytics", icon: FiTrendingUp, href: "/analytics" },
];

export default function Sidebar({ profile, logout, t, isMobileMenuOpen, closeMobileMenu }: { profile: any, logout: () => void, t: (key: string) => string, isMobileMenuOpen: boolean, closeMobileMenu: () => void }) {
  const pathname = usePathname();

  return (
    <>
    <aside className="hidden lg:flex flex-col sticky top-[80px] sm:top-[88px] h-[calc(100vh-80px)] sm:h-[calc(100vh-88px)] w-[280px] shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A1024] z-40 overflow-y-auto">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
          N
        </div>
        <span className={`${playfair?.className || ''} text-2xl font-bold tracking-wide text-[#0F172A] dark:text-white`}>
          NIT<span className="text-blue-500">.</span>
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <p className="px-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">{t("Menu")}</p>
        {SIDEBAR_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              href={link.href}
              key={link.name}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${
                isActive ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-[#0F172A] dark:hover:text-white"
              }`}
            >
              <link.icon className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} />
              {t(link.name)}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mb-4">
        <div className="bg-gray-50 dark:bg-[#111C3A] rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px] shrink-0">
              <div className="w-full h-full bg-white dark:bg-[#0A1024] rounded-full overflow-hidden border-2 border-white dark:border-[#0A1024]">
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold">
                  {profile?.name?.charAt(0) || "U"}
                </div>
              </div>
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-sm text-[#0F172A] dark:text-white truncate">{profile?.name || "Student"}</h4>
              {profile?.reg_id && (
                <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mt-0.5 tracking-wider uppercase truncate">
                  ID: {profile.reg_id}
                </p>
              )}
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-red-500 dark:hover:text-red-400 py-2 transition-colors">
            <FiLogOut /> {t("Sign Out")}
          </button>
        </div>
      </div>
    </aside>

      {/* ================= MOBILE OVERLAY MENU ================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] lg:hidden flex">
            <motion.div 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="w-72 h-full bg-white dark:bg-[#0A1024] flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                <span className={`${playfair?.className || ''} text-xl font-bold text-[#0F172A] dark:text-white`}>NIT<span className="text-blue-500">.</span></span>
                <button onClick={closeMobileMenu} className="text-gray-500 p-2"><FiX className="w-6 h-6" /></button>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                {SIDEBAR_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link 
                      href={link.href} key={link.name} onClick={closeMobileMenu}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium ${isActive ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white"}`}
                    >
                      <link.icon className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} /> {t(link.name)}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
            <div className="flex-1" onClick={closeMobileMenu}></div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
