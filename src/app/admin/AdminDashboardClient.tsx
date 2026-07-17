"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { CertificateTable } from '@/components/admin/CertificateTable';

const AddProgramForm = dynamic(() => import('@/components/admin/AddProgramForm'));
const IssueCertificateForm = dynamic(() => import('@/components/admin/IssueCertificateForm'));
const ManageAssessments = dynamic(() => import('@/components/admin/ManageAssessments'));
const ManageScholarshipTests = dynamic(() => import('@/components/admin/ManageScholarshipTests'));

export default function AdminDashboardClient({ 
  initialCourses,
  logoutAction
}: { 
  initialCourses: any[],
  logoutAction: () => Promise<void>
}) {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'courses' | 'certificates' | 'manage_certificates' | 'assessments' | 'scholarships'>('courses');
  const [courses, setCourses] = useState<any[]>(initialCourses);

  const fetchCourses = async () => {
    const res = await fetch('/api/admin/courses');
    const data = await res.json();
    setCourses(data);
  };

  const handleLogout = async () => {
    try {
      await logoutAction();
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050A18] p-4 md:p-10 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Management Center</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Platform control & Certification Engine</p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all"
          >
            Logout
          </button>
        </header>

        <div className="flex flex-wrap gap-4 mb-10">
          <button 
            onClick={() => setActiveTab('courses')} 
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'courses' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Courses & Internships
          </button>
          <button 
            onClick={() => setActiveTab('certificates')} 
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'certificates' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Issue New Certificate
          </button>
          <button 
            onClick={() => setActiveTab('manage_certificates')} 
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'manage_certificates' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Manage Certificates
          </button>
          <button 
            onClick={() => setActiveTab('assessments')} 
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'assessments' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Manage Assessments
          </button>
          <button 
            onClick={() => setActiveTab('scholarships')} 
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'scholarships' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Manage Tests
          </button>
        </div>

        {activeTab === 'courses' ? (
          <AddProgramForm fetchCourses={fetchCourses} />
        ) : activeTab === 'certificates' ? (
          <IssueCertificateForm courses={courses} />
        ) : activeTab === 'manage_certificates' ? (
          <div className="bg-slate-100 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-8 rounded-3xl">
            <CertificateTable />
          </div>
        ) : activeTab === 'assessments' ? (
          <ManageAssessments courses={courses} />
        ) : activeTab === 'scholarships' ? (
          <ManageScholarshipTests />
        ) : null}
      </div>
    </div>
  );
}
