import { useState } from "react";
import useSWR from "swr";
import { Download } from "lucide-react";

interface Exam {
  id: string;
  title: string;
  duration_minutes: number;
}

interface Submission {
  id: number;
  student_name: string;
  student_phone: string;
  college: string;
  correct_answers: number;
  total_questions: number;
  accuracy: string;
}

interface ResultsViewProps {
  exams: Exam[];
  selectedExamId: string;
  setSelectedExamId: (id: string) => void;
}

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
});

export function ResultsView({ exams, selectedExamId, setSelectedExamId }: ResultsViewProps) {
  const [resultPage, setResultPage] = useState(1);

  const { data: resultsData, isValidating: isFetchingResults } = useSWR(
    selectedExamId ? `/api/admin/exams/${selectedExamId}/results?page=${resultPage}&limit=10` : null,
    fetcher
  );
  
  const results: Submission[] = resultsData?.data || [];
  const resultTotalPages = resultsData?.pagination?.totalPages || 1;

  const handleExportCSV = () => {
    if (!results || results.length === 0) return;

    let csvContent = "Rank,Student Name,Phone,College,Score,Accuracy\n";

    results.forEach((sub, idx) => {
      const rank = idx + 1 + (resultPage - 1) * 10;
      const name = `"${sub.student_name.replace(/"/g, '""')}"`;
      const phone = `"${sub.student_phone}"`;
      const college = `"${sub.college.replace(/"/g, '""')}"`;
      const score = sub.correct_answers;
      const accuracy = `"${Number(sub.accuracy).toFixed(0)}%"`;

      csvContent += `${rank},${name},${phone},${college},${score},${accuracy}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const selectedExamTitle = exams.find(e => e.id === selectedExamId)?.title || "Scholarship";
    const cleanTitle = selectedExamTitle.replace(/[^a-zA-Z0-9]/g, '_');
    const date = new Date().toISOString().split('T')[0];
    const fileName = `${cleanTitle}_Results_${date}.csv`;

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Student Rankings</h3>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <select 
            className="w-full sm:w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none"
            onChange={e => {
              setSelectedExamId(e.target.value);
              setResultPage(1);
            }}
            value={selectedExamId}
          >
            <option value="">-- Select Exam to View Results --</option>
            {exams.map(exam => <option key={exam.id} value={exam.id}>{exam.title}</option>)}
          </select>
          <button
            onClick={handleExportCSV}
            disabled={!selectedExamId || results.length === 0}
            className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/50">
        <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
          <thead className="text-xs uppercase bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4 rounded-tl-lg">Rank</th>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">College</th>
              <th className="px-6 py-4 text-center">Score</th>
              <th className="px-6 py-4 text-center rounded-tr-lg">Accuracy</th>
            </tr>
          </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50 bg-white dark:bg-slate-900/40">
              {isFetchingResults ? (
                <tr><td colSpan={5} className="text-center py-12 text-indigo-600 dark:text-indigo-400 animate-pulse">Loading rankings...</td></tr>
              ) : !selectedExamId ? (
                <tr><td colSpan={5} className="text-center py-12 text-slate-500 dark:text-slate-400">Please select an exam to view results.</td></tr>
              ) : results.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-slate-500 dark:text-slate-400">No submissions found for this exam.</td></tr>
              ) : (
                results.map((sub, idx) => (
                  <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-indigo-600 dark:text-indigo-400 font-bold">#{idx + 1 + (resultPage - 1) * 10}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white">{sub.student_name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sub.student_phone}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{sub.college}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{sub.correct_answers}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs ml-2">/ {sub.total_questions}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">
                      {Number(sub.accuracy).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Pagination Footer */}
        {results.length > 0 && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/50 px-4 pb-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">Showing Page {resultPage} of {resultTotalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setResultPage(prev => Math.max(prev - 1, 1))}
                disabled={resultPage === 1}
                className="bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-md transition-colors border border-slate-200 dark:border-slate-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt; Previous
              </button>
              <button
                onClick={() => setResultPage(prev => Math.min(prev + 1, resultTotalPages))}
                disabled={resultPage === resultTotalPages}
                className="bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-md transition-colors border border-slate-200 dark:border-slate-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
