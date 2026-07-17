import { useState } from "react";
import useSWR from "swr";
import { FiPlusCircle, FiDatabase, FiTrash2, FiEdit2, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface Exam {
  id: string;
  title: string;
  duration_minutes: number;
}

interface Question {
  id: number;
  question_text: string;
  options: string[] | string;
  correct_answer: string;
}

interface QuestionsViewProps {
  exams: Exam[];
  selectedExamId: string;
  setSelectedExamId: (id: string) => void;
  showToast: (type: "success" | "error", text: string) => void;
}

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
});

export function QuestionsView({ exams, selectedExamId, setSelectedExamId, showToast }: QuestionsViewProps) {
  const [questionPage, setQuestionPage] = useState(1);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correct_answer: "A"
  });

  const { data: questionsData, mutate: mutateQuestions, isValidating: isFetchingQuestions } = useSWR(
    selectedExamId ? `/api/admin/exams/${selectedExamId}/questions?page=${questionPage}&limit=5` : null,
    fetcher
  );
  const questions: Question[] = questionsData?.data || [];
  const questionTotalPages = questionsData?.pagination?.totalPages || 1;

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId) {
      showToast("error", "Please select an exam first");
      return;
    }
    
    setIsLoading(true);
    try {
      const options = [newQuestion.optionA, newQuestion.optionB, newQuestion.optionC, newQuestion.optionD];
      const correctText = newQuestion[`option${newQuestion.correct_answer}` as keyof typeof newQuestion];
      
      const payload = {
        question_text: newQuestion.question_text,
        options,
        correct_answer: correctText
      };

      if (editingQuestionId) {
        // Update
        const res = await fetch(`/api/admin/exams/${selectedExamId}/questions/${editingQuestionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast("success", "Question updated successfully!");
          mutateQuestions();
          resetQuestionForm();
        } else {
          showToast("error", "Failed to update question");
        }
      } else {
        // Create
        const res = await fetch(`/api/admin/exams/${selectedExamId}/questions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast("success", "Question added successfully!");
          mutateQuestions();
          resetQuestionForm();
        } else {
          showToast("error", "Failed to add question");
        }
      }
    } catch (err) {
      showToast("error", "Network error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditQuestion = (q: Question) => {
    let parsedOptions: string[] = [];
    try {
      parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
    } catch (e) {
      parsedOptions = ["", "", "", ""];
    }

    const correctLetterMatch = ["A", "B", "C", "D"].find(
      (letter, index) => parsedOptions[index] === q.correct_answer
    ) || "A";

    setNewQuestion({
      question_text: q.question_text,
      optionA: parsedOptions[0] || "",
      optionB: parsedOptions[1] || "",
      optionC: parsedOptions[2] || "",
      optionD: parsedOptions[3] || "",
      correct_answer: correctLetterMatch
    });
    setEditingQuestionId(q.id);
    setIsQuestionModalOpen(true);
  };

  const handleDeleteQuestion = async (qId: number) => {
    try {
      const res = await fetch(`/api/admin/exams/${selectedExamId}/questions/${qId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast("success", "Question deleted");
        mutateQuestions();
      } else {
        throw new Error();
      }
    } catch (err) {
      showToast("error", "Failed to delete question");
      mutateQuestions(); // Revert
    }
  };

  const resetQuestionForm = () => {
    setNewQuestion({ question_text: "", optionA: "", optionB: "", optionC: "", optionD: "", correct_answer: "A" });
    setEditingQuestionId(null);
    setIsQuestionModalOpen(false);
  };

  return (
    <>
      {/* Question Modal */}
      <AnimatePresence>
        {isQuestionModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden"
            >
              <div className="border-b border-slate-200 dark:border-slate-800 p-5 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingQuestionId ? "Edit Question" : "Add Question"}
                </h3>
                <button onClick={resetQuestionForm} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5">
                <form id="question-form" onSubmit={handleSaveQuestion} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5">Question Text</label>
                    <textarea 
                      required rows={3}
                      className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                      value={newQuestion.question_text} onChange={e => setNewQuestion({...newQuestion, question_text: e.target.value})}
                      placeholder="Enter the question here..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-2">
                        <span className="w-5 h-5 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center text-xs">A</span> Option A
                      </label>
                      <input type="text" required className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" value={newQuestion.optionA} onChange={e => setNewQuestion({...newQuestion, optionA: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-2">
                        <span className="w-5 h-5 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center text-xs">B</span> Option B
                      </label>
                      <input type="text" required className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" value={newQuestion.optionB} onChange={e => setNewQuestion({...newQuestion, optionB: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-2">
                        <span className="w-5 h-5 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center text-xs">C</span> Option C
                      </label>
                      <input type="text" required className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" value={newQuestion.optionC} onChange={e => setNewQuestion({...newQuestion, optionC: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-2">
                        <span className="w-5 h-5 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center text-xs">D</span> Option D
                      </label>
                      <input type="text" required className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" value={newQuestion.optionD} onChange={e => setNewQuestion({...newQuestion, optionD: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5">Correct Answer</label>
                    <select 
                      className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none"
                      value={newQuestion.correct_answer} onChange={e => setNewQuestion({...newQuestion, correct_answer: e.target.value})}
                    >
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800 p-5 flex justify-end gap-3 bg-white dark:bg-slate-900/50">
                <button 
                  type="button"
                  onClick={resetQuestionForm}
                  className="px-4 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  form="question-form"
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-slate-900 dark:text-white font-medium px-6 py-2 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-purple-500/20"
                >
                  {isLoading ? "Saving..." : (editingQuestionId ? "Update Question" : "Save Question")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6 max-w-4xl mx-auto mt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <FiDatabase className="text-indigo-400" /> Manage Exam Questions
          </h3>
          <button
            onClick={() => {
              if (!selectedExamId) {
                showToast("error", "Please select an exam first to add questions.");
                return;
              }
              resetQuestionForm();
              setIsQuestionModalOpen(true);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-slate-900 dark:text-white rounded-md px-4 py-2 font-medium transition-colors flex items-center justify-center gap-2"
          >
            <FiPlusCircle className="w-4 h-4" /> Create Question
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5">Select Exam</label>
          <select 
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none"
            value={selectedExamId} 
            onChange={e => {
              setSelectedExamId(e.target.value);
              setQuestionPage(1);
            }}
          >
            <option value="">-- Choose an exam --</option>
            {exams.map(exam => <option key={exam.id} value={exam.id}>{exam.title}</option>)}
          </select>
        </div>

        <div className="mt-8">
          {!selectedExamId ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700/50 border-dashed">
              <p className="text-slate-400 dark:text-slate-500">Select an exam above to view its questions.</p>
            </div>
          ) : isFetchingQuestions ? (
            <div className="text-center py-12">
              <p className="text-indigo-400 animate-pulse">Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700/50 border-dashed">
              <p className="text-slate-400 dark:text-slate-500">No questions found for this exam.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {questions.map((q, idx) => {
                  let parsedOptions: string[] = [];
                  try {
                    parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
                  } catch (e) {
                    parsedOptions = ["", "", "", ""];
                  }
                  
                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={q.id} 
                      className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl relative group hover:border-slate-300 dark:border-slate-500 transition-colors"
                    >
                      <div className="absolute top-4 right-4 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEditQuestion(q)}
                          className="p-2 bg-slate-100 dark:bg-slate-800 text-indigo-400 hover:bg-indigo-500 hover:text-slate-900 dark:text-white rounded-lg transition-colors shadow-lg"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                        <button 
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-2 bg-slate-100 dark:bg-slate-800 text-red-400 hover:bg-red-500 hover:text-slate-900 dark:text-white rounded-lg transition-colors shadow-lg"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                      
                      <div className="pr-20">
                        <h4 className="text-slate-900 dark:text-white font-medium mb-4 leading-relaxed">
                          <span className="text-indigo-400 font-bold mr-2">Q{idx + 1}.</span> 
                          {q.question_text}
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-3 text-sm">
                          {parsedOptions.map((opt, oIdx) => {
                            const isCorrect = opt === q.correct_answer;
                            const letters = ["A", "B", "C", "D"];
                            return (
                              <div key={oIdx} className={`px-4 py-2.5 rounded-lg border ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300'}`}>
                                <span className="font-bold mr-2 opacity-50">{letters[oIdx]}.</span> {opt}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {/* Pagination Footer */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                <span className="text-sm text-slate-500 dark:text-slate-400">Showing Page {questionPage} of {questionTotalPages}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setQuestionPage(prev => Math.max(prev - 1, 1))}
                    disabled={questionPage === 1}
                    className="bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-md transition-colors border border-slate-200 dark:border-slate-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &lt; Previous
                  </button>
                  <button
                    onClick={() => setQuestionPage(prev => Math.min(prev + 1, questionTotalPages))}
                    disabled={questionPage === questionTotalPages}
                    className="bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-md transition-colors border border-slate-200 dark:border-slate-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next &gt;
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
