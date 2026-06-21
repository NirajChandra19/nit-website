"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { playfair } from "../fonts"; 
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  FiGrid, FiBookOpen, FiAward, FiTrendingUp, 
  FiSettings, FiLogOut, FiBell, FiArrowRight, 
  FiCheckCircle, FiMenu, FiX, FiGlobe, 
  FiBriefcase, FiLock, FiMoon, FiShield
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/components/AuthProvider";
import { studentService } from "@/lib/services/api";
import { Enrollment, Certificate } from "@/types";

interface DashboardData {
  profile: {
    id: number;
    name: string;
    reg_id: string;
    email: string;
    language?: string;
    is_2fa_enabled?: boolean;
  };
  enrollments: (Enrollment & { course_title: string; course_type: string; duration: string })[];
  certificates: Certificate[];
  stats?: {
    coursesEnrolled: number;
    courseCertificates: number;
    internshipsEnrolled: number;
    internshipCertificates: number;
    averageScore?: number; 
  };
}

interface ActivityItem {
  id: string | number;
  title: string;
  type: string;
  score: string;
  time: string;
  status: 'success' | 'special' | 'neutral';
}

const SIDEBAR_LINKS = [
  { name: "Dashboard", icon: FiGrid, href: "/dashboard" },
  { name: "Skill Courses", icon: FiBookOpen, href: "/skill_courses" },
  { name: "My Certificates", icon: FiAward, href: "/certificates" },
  { name: "Analytics", icon: FiTrendingUp, href: "/analytics" },
];

const LANGUAGES = ["English", "Hindi"];

const TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    "Menu": "Menu",
    "Sign Out": "Sign Out",
    "Overview": "Overview",
    "Account": "Account",
    "System": "System",
    "Welcome back": "Welcome back",
    "Average Score": "Average Score",
    "Notifications": "Notifications",
    "Language": "Language",
    "Dark Mode": "Dark Mode"
  },
  Hindi: {
    "Dashboard": "डैशबोर्ड",
    "Skill Courses": "कौशल पाठ्यक्रम",
    "My Certificates": "मेरे प्रमाणपत्र",
    "Analytics": "एनालिटिक्स",
    "Menu": "मेनू",
    "Sign Out": "साइन आउट",
    "Overview": "अवलोकन",
    "Account": "खाता",
    "System": "सिस्टम",
    "Welcome back": "वापसी पर स्वागत है",
    "Average Score": "औसत अंक",
    "Notifications": "सूचनाएं",
    "Language": "भाषा",
    "Dark Mode": "डार्क मोड"
  }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } }
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", duration: 0.5, bounce: 0.3 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};

export default function Dashboard() {
  const { user, logout, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Dropdown States
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  // Modal States
  const [activeModal, setActiveModal] = useState<"none" | "security" | "language">("none");
  const [securityTab, setSecurityTab] = useState<"password" | "2fa">("password");
  
  // Feature States
  const [language, setLanguage] = useState("English");
  const languages: string[] = ["English", "Hindi"];
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  
  // 2FA Setup States
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [twoFactorSecret, setTwoFactorSecret] = useState("");
  const [twoFactorToken, setTwoFactorToken] = useState(["", "", "", "", "", ""]);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    if (user?.id) {
      const fetchNotifications = async () => {
        try {
          const res = await fetch('/api/notifications/fetch');
          if (res.status === 401) throw new Error('Unauthorized');
          if (res.ok) {
            const data = await res.json();
            setNotifications(data);
          }
        } catch (err: any) {
          if (err.message === 'Unauthorized') {
            logout();
            router.push('/login');
          }
        }
      };
      fetchNotifications();
    }
  }, [user?.id, logout, router]);

  const markAllAsRead = async () => {
    if (!user?.id) return;
    try {
      await fetch('/api/notifications/read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      setNotifications(prev => prev.map(n => ({ ...n, unread: false, isUnread: false })));
    } catch (err) {
      console.error("Error marking notifications as read", err);
    }
  };
  
  const t = (key: string) => {
    return (TRANSLATIONS[language] || TRANSLATIONS["English"])[key] || key;
  };

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

  useEffect(() => {
    if (!authIsLoading && !user) {
      router.push("/login");
      return;
    }
    if (user?.id) {
      const fetchDashboard = async () => {
        try {
          const data = await studentService.getDashboardData();
          setDashboardData(data);
        } catch (error: any) {
          if (error.message === 'Unauthorized') {
            logout();
            router.push('/login');
          }
        } finally {
          setLoading(false);
        }
      };

      const fetchActivity = async () => {
        try {
          const res = await fetch('/api/student/activity'); 
          if (res.status === 401) throw new Error('Unauthorized');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setRecentActivity(data);
            }
          }
        } catch (e: any) {
          if (e.message === 'Unauthorized') {
            logout();
            router.push('/login');
          }
        }
      };

      fetchDashboard();
      fetchActivity();
    }
  }, [user, authIsLoading, router, logout]);

  const { enrollments, certificates, profile } = useMemo(() => {
    return {
      enrollments: dashboardData?.enrollments || [],
      certificates: dashboardData?.certificates || [],
      profile: dashboardData?.profile || user,
    };
  }, [dashboardData, user]);

  useEffect(() => {
    if (dashboardData?.profile) {
      setLanguage(dashboardData.profile.language || "English");
      setIs2FAEnabled(!!dashboardData.profile.is_2fa_enabled);
    }
  }, [dashboardData?.profile]);

  const stats = useMemo(() => {
    const s = dashboardData?.stats || { coursesEnrolled: 0, courseCertificates: 0, internshipsEnrolled: 0, internshipCertificates: 0 };
    return [
      { label: "Courses Enrolled", value: s.coursesEnrolled.toString(), icon: FiBookOpen, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10", isLoading: loading },
      { label: "Course Certificates", value: s.courseCertificates.toString(), icon: FiAward, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10", isLoading: loading },
      { label: "Internships Enrolled", value: s.internshipsEnrolled.toString(), icon: FiBriefcase, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-500/10", isLoading: loading },
      { label: "Internship Certificates", value: s.internshipCertificates.toString(), icon: FiCheckCircle, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10", isLoading: loading }
    ];
  }, [dashboardData?.stats, loading]);

  const latestEnrollment = enrollments[0] || null;
  const progress = latestEnrollment?.progress || 0;
  const currentAverageScore = dashboardData?.stats?.averageScore ?? (certificates.length > 0 ? 100 : (progress > 0 ? progress : 0));

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    const form = e.target as HTMLFormElement;
    const currentPassword = (form.elements[0] as HTMLInputElement).value;
    const newPassword = (form.elements[1] as HTMLInputElement).value;
    const confirmPassword = (form.elements[2] as HTMLInputElement).value;

    if (newPassword !== confirmPassword) return alert("New passwords do not match!");

    try {
      const res = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user.id, currentPassword, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        alert("Password successfully updated!");
        setActiveModal("none");
        form.reset();
      } else alert(data.error || "Failed to update password");
    } catch (err) { alert("Error updating password"); }
  };

  const handleLanguageChange = async (lang: string) => {
    if (!user?.id) return;
    try {
      const res = await fetch('/api/settings/language', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user.id, language: lang })
      });
      const data = await res.json();
      if (data.success) {
        setLanguage(lang);
        setActiveModal("none");
      } else alert(data.error || "Failed to update language");
    } catch (err) { alert("Error updating language"); }
  };

  const handleEnable2FASetup = async () => {
    if (!user?.id) return;
    if (is2FAEnabled) {
      try {
        const res = await fetch(`/api/settings/2fa?studentId=${user.id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          setIs2FAEnabled(false);
          setQrCodeUrl("");
          alert("2FA Disabled successfully!");
        } else alert(data.error || "Failed to disable 2FA");
      } catch (err) { console.error("Error disabling 2FA"); }
      return;
    }
    
    try {
      const res = await fetch('/api/settings/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user.id, email: profile?.email || "user@example.com" })
      });
      const data = await res.json();
      if (data.success) {
        setQrCodeUrl(data.qrCodeUrl);
        setTwoFactorSecret(data.secret);
      }
    } catch (err) { console.error("Error setting up 2FA"); }
  };

  const handle2FAVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const code = twoFactorToken.join("");
      const res = await fetch('/api/student/setup-2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user?.id, token: code })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIs2FAEnabled(true);
        setActiveModal('none');
        alert("2FA successfully enabled!");
      } else alert(data.error || "Invalid verification code.");
    } catch (err) { alert("Error verifying 2FA"); }
  };

  if (authIsLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050A18] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050A18] text-[#0F172A] dark:text-gray-200 transition-colors duration-300 font-sans flex items-start">
      
      {/* ================= SIDEBAR (DESKTOP) ================= */}
      <aside className="hidden lg:flex flex-col sticky top-[80px] sm:top-[88px] h-[calc(100vh-80px)] sm:h-[calc(100vh-88px)] w-[280px] shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A1024] z-40 overflow-y-auto">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
            N
          </div>
          <span className={`${playfair.className} text-2xl font-bold tracking-wide text-[#0F172A] dark:text-white`}>
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

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Top Header - FIXED STICKY TOP POSITION */}
        <header className="h-20 px-6 sm:px-10 flex items-center justify-between bg-[#F8FAFC]/90 dark:bg-[#050A18]/90 backdrop-blur-md sticky top-[80px] sm:top-[88px] z-30 border-b border-gray-200 dark:border-gray-800/60">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-500" onClick={() => setIsMobileMenuOpen(true)}>
              <FiMenu className="w-6 h-6" />
            </button>
            <h1 className={`${playfair.className} text-2xl font-bold text-[#0F172A] dark:text-white hidden sm:block`}>{t("Overview")}</h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 relative" ref={dropdownContainerRef}>
            
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => { 
                  setShowNotifications(!showNotifications); 
                  setShowSettings(false); 
                  if (!showNotifications) markAllAsRead();
                }}
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
                    className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#111C3A] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
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
                onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); }}
                className={`relative p-2 rounded-full transition-colors ${showSettings ? 'bg-gray-200 dark:bg-gray-800 text-[#0F172A] dark:text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-[#0F172A] dark:hover:text-white'}`}
              >
                <FiSettings className={`w-5 h-5 ${showSettings ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
              </button>

              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    variants={dropdownVariants} initial="hidden" animate="show" exit="exit"
                    className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#111C3A] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-2">
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t("Account")}</p>
                    </div>
                    <button onClick={() => { setActiveModal("security"); setShowSettings(false); setSecurityTab("password"); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#0A1024] hover:text-[#0F172A] dark:hover:text-white transition-colors text-left">
                      <FiLock className="w-4 h-4" /> Security
                    </button>
                    
                    <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 mt-2 mb-2">
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t("System")}</p>
                    </div>
                    <button onClick={() => { setActiveModal("language"); setShowSettings(false); }} className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#0A1024] hover:text-[#0F172A] dark:hover:text-white transition-colors text-left">
                      <div className="flex items-center gap-3"><FiGlobe className="w-4 h-4" /> {t("Language")}</div>
                      <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500">{language}</span>
                    </button>
                    <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#0A1024] hover:text-[#0F172A] dark:hover:text-white transition-colors text-left">
                      <div className="flex items-center gap-3"><FiMoon className="w-4 h-4" /> {t("Dark Mode")}</div>
                      <div className={`w-8 h-4 rounded-full relative transition-colors ${isDark ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isDark ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento 1: Welcome & Current Focus */}
            <motion.div variants={itemVariants} className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 rounded-3xl p-8 sm:p-10 text-white shadow-2xl shadow-blue-500/30 group hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -right-10 -top-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute right-10 bottom-10 w-32 h-32 bg-teal-300 opacity-20 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase shadow-sm border border-white/10">Active Learning</span>
                  {profile?.reg_id && <span className="inline-block px-3 py-1 bg-blue-900/40 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase shadow-sm border border-white/10 text-blue-50">Reg ID: {profile.reg_id}</span>}
                </div>
                <h2 className={`${playfair.className} text-3xl sm:text-4xl font-bold mb-2`}>{t("Welcome back")}, {profile?.name?.split(' ')[0] || "Student"}!</h2>
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

            {/* Bento 2: Radial Performance Stat */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-[#0B1229] rounded-3xl p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">{t("Average Score")}</h3>
              <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-100 dark:text-gray-800" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * currentAverageScore) / 100} className="text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)] transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold text-[#0F172A] dark:text-white">{currentAverageScore}%</span>
                </div>
              </div>
              <p className="text-xs font-semibold text-teal-500 bg-teal-50 dark:bg-teal-500/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                <FiTrendingUp /> {currentAverageScore >= 90 ? "Excellent Progress" : currentAverageScore > 0 ? "Good Progress" : "Start Learning"}
              </p>
            </motion.div>

            {/* Bento 3: Quick Stats Row */}
            <motion.div variants={itemVariants} className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white dark:bg-[#0B1229] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
                    {stat.isLoading ? (
                      <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <stat.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className={`${playfair.className} text-3xl sm:text-4xl font-bold text-[#0F172A] dark:text-white mb-2`}>
                      {stat.isLoading ? (
                        <span className="text-gray-300 dark:text-gray-700 animate-pulse bg-gray-200 dark:bg-gray-800 rounded w-12 h-8 inline-block"></span>
                      ) : stat.value}
                    </h4>
                    <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Bento 4: Recent Activity Timeline */}
            <motion.div variants={itemVariants} className="md:col-span-2 bg-white dark:bg-[#050A18] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h3 className={`${playfair.className} text-2xl font-bold text-[#0F172A] dark:text-white`}>Recent Activity</h3>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors flex items-center gap-1">
                  View All <FiArrowRight />
                </button>
              </div>

              <div className="relative">
                {/* Central Line */}
                <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800 md:-translate-x-1/2"></div>

                <div className="space-y-8">
                  {recentActivity.length > 0 ? recentActivity.map((activity, index) => {
                    const isRight = index % 2 === 0; 
                    return (
                    <div key={activity.id} className={`relative flex items-center justify-between w-full md:justify-center ${isRight ? 'md:flex-row-reverse' : ''} group`}>
                      
                      {/* Timeline Node */}
                      <div className="absolute left-5 md:left-1/2 w-8 h-8 rounded-full border-2 border-white dark:border-[#050A18] bg-blue-50 dark:bg-[#0B1229] text-blue-500 shadow-sm flex items-center justify-center z-10 -translate-x-1/2 group-hover:scale-110 transition-transform">
                        {activity.status === 'success' ? <FiCheckCircle className="w-4 h-4 text-teal-500" /> : 
                         activity.status === 'special' ? <FiAward className="w-4 h-4 text-purple-500" /> : 
                         <FiBookOpen className="w-4 h-4" />}
                      </div>
                      
                      {/* Spacer for desktop alignment */}
                      <div className="hidden md:block w-1/2"></div>

                      {/* Card Content */}
                      <div className={`w-[calc(100%-3.5rem)] ml-14 md:ml-0 md:w-[calc(50%-2.5rem)] ${isRight ? 'md:mr-auto md:text-right' : 'md:ml-auto md:text-left'}`}>
                        <div className={`inline-block bg-gray-50 dark:bg-[#0B1229] p-5 rounded-2xl w-full border border-gray-100 dark:border-gray-800/60 group-hover:border-blue-200 dark:group-hover:border-blue-800/60 transition-colors text-left`}>
                          <div className="flex justify-between items-start mb-2 gap-4">
                            <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">{activity.title}</h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                              activity.status === 'success' ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400' :
                              activity.status === 'special' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' :
                              'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            }`}>
                              {activity.score}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{activity.type}</p>
                          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-4 uppercase tracking-widest">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  )}) : (
                    <div className="text-center py-10 text-gray-500 w-full">No recent activity found.</div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Bento 5: Upcoming / Motivation */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] dark:from-[#111C3A] dark:to-[#0A1024] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                  <FiAward className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className={`${playfair.className} text-2xl font-bold mb-3`}>
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

        {/* ================= MODALS ================= */}
        <AnimatePresence>
          {activeModal !== "none" && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setActiveModal("none")}
              />
              
              <motion.div 
                variants={modalVariants} initial="hidden" animate="show" exit="exit"
                className="relative bg-white dark:bg-[#111C3A] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-800"
              >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#0A1024]">
                  <h2 className="text-lg font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                    {activeModal === "security" ? <><FiShield className="text-blue-500" /> Security Settings</> : <><FiGlobe className="text-blue-500" /> Display Language</>}
                  </h2>
                  <button onClick={() => setActiveModal("none")} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* --- SECURITY MODAL CONTENT --- */}
                {activeModal === "security" && (
                  <div className="flex flex-col h-[400px]">
                    <div className="flex px-6 pt-4 gap-6 border-b border-gray-100 dark:border-gray-800">
                      {(["password", "2fa"] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setSecurityTab(tab)}
                          className={`pb-3 text-sm font-bold capitalize transition-colors relative ${securityTab === tab ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-[#0F172A] dark:hover:text-white'}`}
                        >
                          {tab === "2fa" ? "Two-Factor Auth" : tab}
                          {securityTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />}
                        </button>
                      ))}
                    </div>

                    <div className="p-6 overflow-y-auto flex-1">
                      {/* Password Tab */}
                      {securityTab === "password" && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Current Password</label>
                            <input type="password" required className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A1024] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all dark:text-white" placeholder="••••••••" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">New Password</label>
                            <input type="password" required className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A1024] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all dark:text-white" placeholder="••••••••" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Confirm New Password</label>
                            <input type="password" required className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A1024] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all dark:text-white" placeholder="••••••••" />
                          </div>
                          <button type="submit" className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors">Update Password</button>
                        </form>
                      )}

                      {/* 2FA Tab */}
                      {securityTab === "2fa" && (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/50">
                            <div>
                              <h4 className="font-bold text-[#0F172A] dark:text-white text-sm">Authenticator App</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Use an app like Google Authenticator to get 2FA codes.</p>
                            </div>
                            <button onClick={handleEnable2FASetup} className={`w-12 h-6 rounded-full relative transition-colors ${is2FAEnabled || qrCodeUrl ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}>
                              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${is2FAEnabled || qrCodeUrl ? 'left-7' : 'left-1'}`} />
                            </button>
                          </div>
                          {qrCodeUrl && !is2FAEnabled && (
                            <div className="text-center p-6 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                              <Image src={qrCodeUrl} alt="QR Code" width={128} height={128} className="mx-auto rounded-lg mb-4" />
                              <p className="text-sm font-bold text-[#0F172A] dark:text-white">Scan this QR code</p>
                              <p className="text-xs text-gray-500 mt-1">Enter the 6-digit code from your app below.</p>
                              <div className="flex justify-center gap-2 mt-4">
                                {twoFactorToken.map((digit, i) => (
                                  <input 
                                    key={i} 
                                    type="text" 
                                    maxLength={1} 
                                    value={digit}
                                    onChange={(e) => {
                                      const newToken = [...twoFactorToken];
                                      newToken[i] = e.target.value.replace(/[^0-9]/g, "");
                                      setTwoFactorToken(newToken);
                                      if (e.target.value && i < 5) {
                                        const nextInput = document.getElementById(`2fa-input-${i + 1}`);
                                        if (nextInput) nextInput.focus();
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Backspace' && !twoFactorToken[i] && i > 0) {
                                        const prevInput = document.getElementById(`2fa-input-${i - 1}`);
                                        if (prevInput) prevInput.focus();
                                      }
                                    }}
                                    id={`2fa-input-${i}`}
                                    className="w-10 h-12 text-center text-lg font-bold bg-gray-50 dark:bg-[#0A1024] border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white outline-none focus:border-blue-500" 
                                  />
                                ))}
                              </div>
                              <button onClick={handle2FAVerification} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition-colors">Verify & Enable</button>
                            </div>
                          )}
                          {is2FAEnabled && (
                            <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-2xl">
                              <FiCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                              <p className="text-sm font-bold text-[#0F172A] dark:text-white">Two-Factor Authentication is Enabled</p>
                              <p className="text-xs text-gray-500 mt-1">Your account is secured with 2FA.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* --- LANGUAGE MODAL CONTENT --- */}
                {activeModal === "language" && (
                  <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${language === lang ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0A1024] hover:border-gray-300 dark:hover:border-gray-600'}`}
                      >
                        <span className={`text-sm font-bold ${language === lang ? 'text-blue-700 dark:text-blue-400' : 'text-[#0F172A] dark:text-white'}`}>{lang}</span>
                        {language === lang && <FiCheckCircle className="w-5 h-5 text-blue-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>

      {/* ================= MOBILE OVERLAY MENU ================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden flex">
            <motion.div 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="w-72 h-full bg-white dark:bg-[#0A1024] flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                <span className={`${playfair.className} text-xl font-bold text-[#0F172A] dark:text-white`}>NIT<span className="text-blue-500">.</span></span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 p-2"><FiX className="w-6 h-6" /></button>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                {SIDEBAR_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link 
                      href={link.href} key={link.name} onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium ${isActive ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white"}`}
                    >
                      <link.icon className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} /> {link.name}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}