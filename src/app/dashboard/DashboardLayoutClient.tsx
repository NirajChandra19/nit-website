"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import SecurityModal from "@/components/dashboard/modals/SecurityModal";
import LanguageModal from "@/components/dashboard/modals/LanguageModal";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { FiShield, FiGlobe, FiX } from "react-icons/fi";
import { DashboardProvider, useDashboardData } from "@/hooks/useDashboardData";

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", duration: 0.5, bounce: 0.3 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { 
    profile, 
    logout, 
    t, 
    notifications, 
    markAllAsRead, 
    language, 
    user, 
    is2FAEnabled, 
    updateLanguage, 
    update2FA,
    authIsLoading
  } = useDashboardData();
  const router = useRouter();

  useEffect(() => {
    if (!authIsLoading && !user) {
      router.push('/login');
    }
  }, [user, authIsLoading, router]);

  const [activeModal, setActiveModal] = useState<"none" | "security" | "language">("none");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const openSecurityModal = () => setActiveModal("security");
  const openLanguageModal = () => setActiveModal("language");
  const closeModal = () => setActiveModal("none");

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050A18] text-[#0F172A] dark:text-gray-200 transition-colors duration-300 font-sans flex items-start">
      <Sidebar 
        profile={profile} 
        logout={logout} 
        t={t} 
        isMobileMenuOpen={isMobileMenuOpen}
        closeMobileMenu={closeMobileMenu}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header 
          t={t}
          notifications={notifications}
          markAllAsRead={markAllAsRead}
          language={language}
          openSecurityModal={openSecurityModal}
          openLanguageModal={openLanguageModal}
          openMobileMenu={openMobileMenu}
        />
        
        {children}
        
        {/* ================= MODALS ================= */}
        <AnimatePresence>
          {activeModal !== "none" && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={closeModal}
              />
              
              <motion.div 
                variants={modalVariants} initial="hidden" animate="show" exit="exit"
                className="relative bg-white dark:bg-[#111C3A] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-800"
              >
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#0A1024]">
                  <h2 className="text-lg font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                    {activeModal === "security" ? <><FiShield className="text-blue-500" /> Security Settings</> : <><FiGlobe className="text-blue-500" /> Display Language</>}
                  </h2>
                  <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {activeModal === "security" && (
                  <SecurityModal 
                    user={user} 
                    profile={profile} 
                    is2FAEnabled={is2FAEnabled}
                    setIs2FAEnabled={update2FA}
                    onClose={closeModal}
                  />
                )}

                {activeModal === "language" && (
                  <LanguageModal 
                    language={language}
                    setLanguage={updateLanguage}
                    user={user}
                    onClose={closeModal}
                  />
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function DashboardLayoutClient({ children, initialData, initialActivity, initialNotifications }: { children: React.ReactNode, initialData?: any, initialActivity?: any[], initialNotifications?: any[] }) {
  return (
    <DashboardProvider initialData={initialData} initialActivity={initialActivity} initialNotifications={initialNotifications}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardProvider>
  );
}
