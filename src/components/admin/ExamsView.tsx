import { useState } from "react";
import { FiPlusCircle, FiList, FiSave, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface Exam {
  id: string;
  title: string;
  duration_minutes: number;
  is_active?: boolean;
}

interface ExamsViewProps {
  exams: Exam[];
  mutateExams: (data?: any, shouldRevalidate?: boolean) => void;
  showToast: (type: "success" | "error", text: string) => void;
}

export function ExamsView({ exams, mutateExams, showToast }: ExamsViewProps) {
  const [newExam, setNewExam] = useState({ title: "", duration_minutes: 30 });
  const [examToDelete, setExamToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Toggle Exam Status
  const handleToggleStatus = async (exam: Exam) => {
    const newStatus = !exam.is_active;
    
    // Optimistic UI update
    mutateExams(
      exams.map(e => e.id === exam.id ? { ...e, is_active: newStatus } : e),
      false
    );

    try {
      const res = await fetch(`/api/admin/exams/${exam.id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: newStatus })
      });
      
      if (!res.ok) throw new Error();
      showToast("success", `Exam marked as ${newStatus ? 'Active' : 'Inactive'}`);
      mutateExams(); // Revalidate
    } catch (err) {
      showToast("error", "Failed to update exam status");
      mutateExams(); // Revert on failure
    }
  };

  // 1. Create Exam
  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExam)
      });
      if (res.ok) {
        showToast("success", "Exam created successfully!");
        setNewExam({ title: "", duration_minutes: 30 });
        mutateExams();
      } else {
        showToast("error", "Failed to create exam");
      }
    } catch (err) {
      showToast("error", "Network error");
    } finally {
      setIsLoading(false);
    }
  };

  // 1b. Delete Exam
  const confirmDeleteExam = async () => {
    if (!examToDelete) return;
    const idToDelete = examToDelete;
    
    // Optimistic UI update
    mutateExams(exams.filter(e => e.id !== idToDelete), false);
    setExamToDelete(null);

    try {
      const res = await fetch(`/api/admin/exams/${idToDelete}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("success", "Exam deleted successfully");
      mutateExams();
    } catch (err) {
      showToast("error", "Failed to delete exam");
      mutateExams(); // Revert optimistic update
    }
  };

  return (
    <>
      {/* Delete Exam Confirmation Modal */}
      <AnimatePresence>
        {examToDelete && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full"
            >
              <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
                <FiAlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Exam?</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                Are you sure? This will permanently delete the exam, all its questions, and all student results. This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setExamToDelete(null)}
                  className="px-5 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDeleteExam}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-slate-900 dark:text-white font-medium transition-all shadow-lg shadow-red-500/30 active:scale-95"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm h-fit">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2"><FiPlusCircle className="text-indigo-400" /> Create New Exam</h3>
          <form onSubmit={handleCreateExam} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5">Exam Title</label>
              <input 
                type="text" required
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-slate-600"
                value={newExam.title} onChange={e => setNewExam({...newExam, title: e.target.value})}
                placeholder="e.g. Winter 2026 Scholarship Exam"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5">Duration (Minutes)</label>
              <input 
                type="number" required min="1"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                value={newExam.duration_minutes} onChange={e => setNewExam({...newExam, duration_minutes: Number(e.target.value)})}
              />
            </div>
            <button disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-slate-900 dark:text-white font-medium py-3 rounded-lg transition-all shadow-lg shadow-indigo-500/30 active:scale-[0.98] flex justify-center items-center gap-2 mt-2">
              <FiSave /> Save Exam
            </button>
          </form>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2"><FiList className="text-indigo-400" /> Active Exams</h3>
          <div className="space-y-3">
            {exams.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed">
                <p className="text-slate-400 dark:text-slate-500">No exams created yet.</p>
              </div>
            ) : (
              <AnimatePresence>
                {exams.map(exam => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={exam.id} 
                    className="group bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 hover:border-slate-600 p-4 rounded-xl flex justify-between items-center transition-colors"
                  >
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white mb-1">{exam.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">ID: {exam.id}</span>
                        <span>•</span>
                        <span>{exam.duration_minutes} mins</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleToggleStatus(exam)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          exam.is_active 
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50' 
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                        }`}
                        title="Toggle Active Status"
                      >
                        {exam.is_active ? 'Active' : 'Inactive'}
                      </button>
                      <button 
                        onClick={() => setExamToDelete(exam.id)}
                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete Exam"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
