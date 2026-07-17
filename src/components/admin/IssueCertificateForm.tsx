"use client";

import { useState } from 'react';

export default function IssueCertificateForm({ courses }: { courses: any[] }) {
  const [loading, setLoading] = useState(false);
  const [certForm, setCertForm] = useState({ 
    isNewStudent: false, student_name: '', reg_id: '', course_id: '', 
    type: 'internship', grade: 'A', percentage: '', issue_date: new Date().toISOString().split('T')[0] 
  });

  const handleCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/admin/certificates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(certForm)
    });
    const data = await res.json().catch(() => ({ error: 'An unknown error occurred' }));
    if (res.ok) {
      alert(`Certificate Issued! ID: ${data.cert_id}`);
      setCertForm({ ...certForm, student_name: '', reg_id: '', course_id: '' });
    } else {
      alert(`Error: ${data.error}`);
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-8 rounded-3xl">
      <h2 className="text-xl font-bold mb-6 text-green-600 dark:text-green-400">Issuance Terminal</h2>
      <form onSubmit={handleCertSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 flex justify-center mb-2">
          <div className="bg-white dark:bg-slate-900 p-1 rounded-full inline-flex border border-slate-200 dark:border-slate-700">
            <button 
              type="button"
              onClick={() => setCertForm({...certForm, isNewStudent: false})}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!certForm.isNewStudent ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Existing Student
            </button>
            <button 
              type="button"
              onClick={() => setCertForm({...certForm, isNewStudent: true})}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${certForm.isNewStudent ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              New Student
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-500 uppercase">Program Type</label>
          <select className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 p-3 rounded-xl outline-none focus:border-blue-500" value={certForm.type} onChange={e => setCertForm({...certForm, type: e.target.value, course_id: ''})}>
            <option value="internship">Internship</option>
            <option value="course">Course</option>
          </select>
        </div>

        {certForm.isNewStudent ? (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-500 uppercase">Student Name</label>
            <input className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 p-3 rounded-xl outline-none focus:border-blue-500" value={certForm.student_name} onChange={e => setCertForm({...certForm, student_name: e.target.value})} required placeholder="e.g. John Doe" />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-500 uppercase">Student Registration ID</label>
            <input className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 p-3 rounded-xl outline-none focus:border-blue-500" value={certForm.reg_id} onChange={e => setCertForm({...certForm, reg_id: e.target.value})} required placeholder="e.g. NIT-2026-1234" />
          </div>
        )}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-500 uppercase">Select Program</label>
          <select className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 p-3 rounded-xl outline-none focus:border-blue-500" value={certForm.course_id} onChange={e => setCertForm({...certForm, course_id: e.target.value})} required>
            <option value="">Choose...</option>
            {courses.filter(c => c.type === certForm.type).map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        {certForm.type === 'internship' ? (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-500 uppercase">Performance Grade</label>
            <input className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 p-3 rounded-xl outline-none focus:border-blue-500" value={certForm.grade} onChange={e => setCertForm({...certForm, grade: e.target.value})} placeholder="e.g. A+" />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-500 uppercase">Percentage Marks</label>
            <input type="number" min="0" max="100" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 p-3 rounded-xl outline-none focus:border-blue-500" value={certForm.percentage} onChange={e => setCertForm({...certForm, percentage: e.target.value})} placeholder="e.g. 85" />
          </div>
        )}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-500 uppercase">Issue Date</label>
          <input type="date" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 p-3 rounded-xl outline-none focus:border-blue-500" value={certForm.issue_date} onChange={e => setCertForm({...certForm, issue_date: e.target.value})} required />
        </div>
        <button disabled={loading} className="md:col-span-2 bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50">
          {loading ? 'Processing...' : 'Generate & Issue Certificate'}
        </button>
      </form>
    </div>
  );
}
