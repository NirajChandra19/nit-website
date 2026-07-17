"use client";

import { useState, useRef } from "react";
import useSWR from "swr";
import { FiPlusCircle, FiList, FiDatabase, FiUsers, FiSave, FiCheckCircle, FiTrash2, FiEdit2, FiAlertTriangle, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { ResultsView } from "./ResultsView";
import { ExamsView } from "./ExamsView";
import { QuestionsView } from "./QuestionsView";

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

interface ToastMessage {
  id: number;
  type: "success" | "error";
  text: string;
}

export default function ManageScholarshipTests() {
  const [activeSubView, setActiveSubView] = useState<"exams" | "questions" | "results">("exams");
  const [isLoading, setIsLoading] = useState(false);
  
  const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });
  
  // Custom Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  let toastIdCounter = useRef(0);

  const [selectedExamId, setSelectedExamId] = useState<string>("");

  // SWR Hooks
  const { data: exams = [], mutate: mutateExams } = useSWR<Exam[]>("/api/admin/exams", fetcher);

  const showToast = (type: "success" | "error", text: string) => {
    const id = ++toastIdCounter.current;
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };



  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg pointer-events-auto backdrop-blur-md border ${
                toast.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10' 
                  : 'bg-red-500/10 text-red-400 border-red-500/30 shadow-red-500/10'
              }`}
            >
              {toast.type === 'success' ? <FiCheckCircle className="w-5 h-5 shrink-0" /> : <FiAlertTriangle className="w-5 h-5 shrink-0" />}
              <p className="font-medium text-sm">{toast.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Scholarship Tests Management</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Create exams, manage question banks, and view rankings.</p>
        </div>
        
        {/* Nested Sub-Navigation */}
        <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => setActiveSubView("exams")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSubView === 'exams' ? 'bg-indigo-600 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'}`}
          >
            <FiList /> Exams
          </button>
          <button 
            onClick={() => setActiveSubView("questions")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSubView === 'questions' ? 'bg-indigo-600 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'}`}
          >
            <FiDatabase /> Questions
          </button>
          <button 
            onClick={() => setActiveSubView("results")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSubView === 'results' ? 'bg-indigo-600 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'}`}
          >
            <FiUsers /> Results
          </button>
        </div>
      </div>

      {/* VIEW 1: EXAMS */}
      {activeSubView === "exams" && (
        <ExamsView 
          exams={exams}
          mutateExams={mutateExams}
          showToast={showToast}
        />
      )}

      {/* VIEW 2: QUESTIONS */}
      {activeSubView === "questions" && (
        <QuestionsView 
          exams={exams}
          selectedExamId={selectedExamId}
          setSelectedExamId={setSelectedExamId}
          showToast={showToast}
        />
      )}

      {/* VIEW 3: RESULTS */}
      {activeSubView === "results" && (
        <ResultsView 
          exams={exams} 
          selectedExamId={selectedExamId} 
          setSelectedExamId={setSelectedExamId} 
        />
      )}
    </div>
  );
}
