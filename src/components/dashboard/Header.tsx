"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FiMenu, FiBell, FiSettings, FiLock, FiGlobe, FiMoon, FiAward, FiBookOpen } from "react-icons/fi";
import { useTheme } from "next-themes";
import { playfair } from "@/app/fonts";

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } }
};

interface HeaderProps {
  t: (key: string) => string;
  notifications: any[];
  markAllAsRead: () => void;
  language: string;
  openSecurityModal: () => void;
  openLanguageModal: () => void;
  openMobileMenu: () => void;
}

export default function Header({
  t, notifications, markAllAsRead, language, openSecurityModal, openLanguageModal, openMobileMenu
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationsToggle = useCallback(() => {
    const opening = !showNotifications;
    setShowNotifications(opening);
    if (opening) {
      setShowSettings(false);
    } else {
      markAllAsRead();
    }
  }, [showNotifications, markAllAsRead]);

  const handleSettingsToggle = useCallback(() => {
    setShowSettings(prev => !prev);
    setShowNotifications(false);
  }, []);

  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && (theme === 'dark' || (theme === 'system' && systemTheme === 'dark'));

  const toggleTheme = useCallback(() => {
    setTheme(isDarkMode ? 'light' : 'dark');
  }, [isDarkMode, setTheme]);

  return (
    <header className="h-20 px-6 sm:px-10 flex items-center justify-between bg-[#F8FAFC]/90 dark:bg-[#050A18]/90 backdrop-blur-md sticky top-[80px] sm:top-[88px] z-30 border-b border-gray-200 dark:border-gray-800/60">
        <div className="flex items-center gap-4">
          <button className="lg:hidden text-gray-500" onClick={openMobileMenu}>
            <FiMenu className="w-6 h-6" />
          </button>
          <h1 className={`${playfair?.className || ''} text-2xl font-bold text-[#0F172A] dark:text-white hidden sm:block`}>{t("Overview")}</h1>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 relative" ref={dropdownContainerRef}>
          
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={handleNotificationsToggle}
              className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-gray-200 dark:bg-gray-800 text-[#0F172A] dark:text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-[#0F172A] dark:hover:text-white'}`}
            >
              <FiBell className="w-5 h-5" />
              {notifications.some(n => n.unread || n.isUnread) && (
                <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#050A18]"></span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  variants={dropdownVariants} initial="hidden" animate="show" exit="exit"
                  className="absolute top-full mt-3 w-[calc(100vw-2rem)] sm:w-80 md:w-96 right-[-1rem] sm:right-0 bg-white dark:bg-[#111C3A] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-[60]"
                >
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#0A1024]">
                    <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">{t("Notifications")}</h3>
                    <button onClick={markAllAsRead} className="text-xs text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline">Mark all as read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map((notif) => {
                      const Icon = notif.type === 'certificate' ? FiAward : FiBookOpen;
                      return (
                      <div key={notif.id} className={`p-4 flex gap-3 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-[#0A1024] cursor-pointer transition-colors ${notif.unread || notif.isUnread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.unread || notif.isUnread ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#0F172A] dark:text-white truncate">{notif.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{notif.desc || notif.message}</p>
                          <p className="text-[10px] text-gray-400 font-medium mt-1">{notif.time || new Date(notif.created_at).toLocaleDateString()}</p>
                        </div>
                        {(notif.unread || notif.isUnread) && <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 shrink-0"></div>}
                      </div>
                    )}) : <div className="p-6 text-center text-sm text-gray-500">No notifications</div>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings */}
          <div className="relative">
            <button 
              onClick={handleSettingsToggle}
              className={`relative p-2 rounded-full transition-colors ${showSettings ? 'bg-gray-200 dark:bg-gray-800 text-[#0F172A] dark:text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-[#0F172A] dark:hover:text-white'}`}
            >
              <FiSettings className={`w-5 h-5 ${showSettings ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
            </button>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  variants={dropdownVariants} initial="hidden" animate="show" exit="exit"
                  className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-[#111C3A] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-2">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t("Account")}</p>
                  </div>
                  <button onClick={() => { openSecurityModal(); setShowSettings(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#0A1024] hover:text-[#0F172A] dark:hover:text-white transition-colors text-left">
                    <FiLock className="w-4 h-4" /> Security
                  </button>
                  
                  <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 mt-2 mb-2">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t("System")}</p>
                  </div>
                  <button onClick={() => { openLanguageModal(); setShowSettings(false); }} className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#0A1024] hover:text-[#0F172A] dark:hover:text-white transition-colors text-left">
                    <div className="flex items-center gap-3"><FiGlobe className="w-4 h-4" /> {t("Language")}</div>
                    <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500">{language}</span>
                  </button>
                  <button onClick={toggleTheme} className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#0A1024] hover:text-[#0F172A] dark:hover:text-white transition-colors text-left">
                    <div className="flex items-center gap-3"><FiMoon className="w-4 h-4" /> {t("Dark Mode")}</div>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isDarkMode ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
  );
}
