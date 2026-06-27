"use client";

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { studentService } from "@/lib/services/api";
import { FiBookOpen, FiAward, FiBriefcase, FiCheckCircle } from "react-icons/fi";
import { useLanguage } from "@/components/LanguageProvider";

// Dictionary logic removed - using Google Translate DOM widget instead

export function useDashboardDataInternal({ initialData, initialActivity, initialNotifications }: { initialData?: any, initialActivity?: any[], initialNotifications?: any[] } = {}) {
  const { user, logout, isLoading: authIsLoading } = useAuth();
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState<any | null>(initialData || null);
  const [notifications, setNotifications] = useState<any[]>(initialNotifications || []);
  const [recentActivity, setRecentActivity] = useState<any[]>(initialActivity || []);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    // If we have initialData from the Server Component, we don't need to fetch!
    if (initialData) return;

    if (user?.id) {
      const controller = new AbortController();

      const fetchAllData = async () => {
        try {
          const [dashRes, actRes, notifRes] = await Promise.all([
            studentService.getDashboardData().catch((e: any) => { if (e.message === 'Unauthorized') throw e; return null; }),
            fetch('/api/student/activity', { signal: controller.signal }).then(r => { if (r.status === 401) throw new Error('Unauthorized'); return r.ok ? r.json() : [] }),
            fetch('/api/notifications/fetch', { signal: controller.signal }).then(r => { if (r.status === 401) throw new Error('Unauthorized'); return r.ok ? r.json() : [] })
          ]);
          
          if (!controller.signal.aborted) {
            if (dashRes) setDashboardData(dashRes);
            if (Array.isArray(actRes)) setRecentActivity(actRes);
            if (Array.isArray(notifRes)) setNotifications(notifRes);
          }
        } catch (error: any) {
          if (controller.signal.aborted) return;
          if (error.message === 'Unauthorized' || error.name === 'AbortError') {
            if (error.message === 'Unauthorized') {
              logout();
              router.push('/login');
            }
          }
        } finally {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        }
      };

      fetchAllData();
      return () => controller.abort();
    }
  }, [user, authIsLoading, router, logout, initialData]);

  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;
    try {
      await fetch('/api/notifications/read', { method: 'PUT', headers: { 'Content-Type': 'application/json' } });
      setNotifications(prev => prev.map(n => ({ ...n, unread: false, isUnread: false })));
    } catch (err) {
      console.error("Error marking notifications as read", err);
    }
  }, [user?.id]);

  const updateLanguage = useCallback((newLang: string) => {
    setDashboardData((prev: any) => prev ? {
      ...prev,
      profile: { ...prev.profile, language: newLang }
    } : prev);
  }, []);

  const update2FA = useCallback((enabled: boolean) => {
    setDashboardData((prev: any) => prev ? {
      ...prev,
      profile: { ...prev.profile, is_2fa_enabled: enabled ? 1 : 0 }
    } : prev);
  }, []);

  const { enrollments, certificates, profile } = useMemo(() => {
    return {
      enrollments: dashboardData?.enrollments || [],
      certificates: dashboardData?.certificates || [],
      profile: dashboardData?.profile || user,
    };
  }, [dashboardData, user]);

  const language = profile?.language || "English";
  const is2FAEnabled = !!profile?.is_2fa_enabled;

  const { t, setLanguage: setGlobalLanguage } = useLanguage();

  // Sync database language with global context on initial load
  useEffect(() => {
    if (profile?.language) {
      setGlobalLanguage(profile.language);
    }
  }, [profile?.language, setGlobalLanguage]);

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
  
  const currentAverageScore = useMemo(() => {
    return dashboardData?.stats?.averageScore ?? (certificates.length > 0 ? 100 : (progress > 0 ? progress : 0));
  }, [dashboardData?.stats?.averageScore, certificates.length, progress]);

  return {
    user,
    logout,
    authIsLoading,
    loading,
    profile,
    language,
    is2FAEnabled,
    notifications,
    recentActivity,
    stats,
    latestEnrollment,
    progress,
    currentAverageScore,
    t,
    markAllAsRead,
    updateLanguage,
    update2FA
  };
}

const DashboardContext = createContext<ReturnType<typeof useDashboardDataInternal> | null>(null);

export function DashboardProvider({ children, initialData, initialActivity, initialNotifications }: { children: React.ReactNode, initialData?: any, initialActivity?: any[], initialNotifications?: any[] }) {
  const data = useDashboardDataInternal({ initialData, initialActivity, initialNotifications });
  return <DashboardContext.Provider value={data}>{children}</DashboardContext.Provider>;
}

export function useDashboardData() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardData must be used within a DashboardProvider");
  }
  return context;
}
