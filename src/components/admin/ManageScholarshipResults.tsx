"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiDownload } from "react-icons/fi";

interface Submission {
  id: number;
  student_name: string;
  student_phone: string;
  student_email: string;
  college: string;
  correct_answers: number;
  total_questions: number;
  accuracy: number;
  created_at: string;
}

export default function ManageScholarshipResults() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/admin/scholarships");
      const data = await res.json();
      if (res.ok) {
        setSubmissions(data.submissions);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Failed to fetch submissions", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => 
    sub.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.student_phone.includes(searchTerm) ||
    sub.college.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-[#111C3A] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Scholarship Results</h2>
          <p className="text-sm text-slate-600 dark:text-gray-400">View and manage test submissions</p>
        </div>
        
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors whitespace-nowrap">
            <FiDownload /> Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-left text-sm text-slate-700 dark:text-gray-300">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-slate-800 dark:text-gray-200 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Student Info</th>
              <th className="px-6 py-4">College</th>
              <th className="px-6 py-4 text-center">Score</th>
              <th className="px-6 py-4 text-center">Accuracy</th>
              <th className="px-6 py-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-600 dark:text-gray-400">
                  Loading results...
                </td>
              </tr>
            ) : filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-600 dark:text-gray-400">
                  No submissions found.
                </td>
              </tr>
            ) : (
              filteredSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{sub.student_name}</div>
                    <div className="text-xs text-slate-600 dark:text-gray-400">{sub.student_phone} • {sub.student_email}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-800 dark:text-gray-300 font-medium">
                    {sub.college}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {sub.correct_answers} / {sub.total_questions}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${sub.accuracy >= 80 ? 'bg-emerald-500' : sub.accuracy >= 50 ? 'bg-amber-500' : 'bg-red-500'} rounded-full transition-all duration-500`}
                          style={{ width: `${sub.accuracy}%` }}
                        />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white min-w-[3ch]">
                        {Number(sub.accuracy).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-slate-600 dark:text-gray-400 font-medium whitespace-nowrap">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}