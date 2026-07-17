import { useState, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLoader, FiArrowLeft, FiArrowRight, FiAlertCircle } from "react-icons/fi";
import { Exam, Question } from "./types";
import { Timer } from "./Timer";
import { QuestionItem } from "./QuestionItem";

const MemoizedGridButton = memo(function GridButton({ 
  idx, 
  isAnswered, 
  isCurrent, 
  onClick 
}: { 
  idx: number; 
  isAnswered: boolean; 
  isCurrent: boolean; 
  onClick: (idx: number) => void 
}) {
  let btnClass = "w-full aspect-square flex items-center justify-center rounded-lg font-medium text-sm transition-all cursor-pointer border ";
  if (isCurrent) {
    btnClass += "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 dark:bg-indigo-600 dark:border-indigo-600";
  } else if (isAnswered) {
    btnClass += "bg-blue-50 border-blue-200 text-blue-700 dark:bg-indigo-500/20 dark:border-indigo-500/50 dark:text-indigo-300";
  } else {
    btnClass += "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400";
  }
  return (
    <button onClick={() => onClick(idx)} className={btnClass}>
      {idx + 1}
    </button>
  );
});

interface TestInterfaceProps {
  exam: Exam;
  questions: Question[];
  durationMinutes: number;
  isLoading: boolean;
  onSubmit: (answers: Record<string, string>) => void;
}

export function TestInterface({ exam, questions, durationMinutes, isLoading, onSubmit }: TestInterfaceProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const handleSelectAnswer = useCallback((questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  }, []);

  const handlePreSubmitCheck = () => {
    if (Object.keys(answers).length < questions.length) {
      setShowSubmitModal(true);
    } else {
      onSubmit(answers);
    }
  };

  const handleFinalSubmit = () => {
    setShowSubmitModal(false);
    onSubmit(answers);
  };

  const handleTimeUp = useCallback(() => {
    onSubmit(answers);
  }, [answers, onSubmit]);

  return (
    <motion.div
      key="test"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 py-8 relative"
    >
      <div className="bg-white/95 backdrop-blur-md dark:bg-slate-900/90 rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
        {/* Sticky Header */}
        <div className="sticky top-4 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl p-4 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto">
            <h2 className="font-bold text-xl text-slate-900 dark:text-white line-clamp-1">{exam.title}</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm">Question {currentQuestionIndex + 1} of {questions.length}</p>
          </div>
          <button
            onClick={handlePreSubmitCheck}
            disabled={isLoading}
            className="w-full sm:w-auto justify-center bg-blue-600 hover:bg-blue-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? <FiLoader className="animate-spin w-4 h-4" /> : "Submit Final Answers"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column (Span 3) */}
          <div className="lg:col-span-3">
            {questions.length > 0 && (
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {useMemo(() => (
                  <QuestionItem 
                    question={questions[currentQuestionIndex]}
                    index={currentQuestionIndex}
                    selectedAnswer={answers[questions[currentQuestionIndex].id]}
                    onSelect={handleSelectAnswer}
                  />
                ), [questions, currentQuestionIndex, answers[questions[currentQuestionIndex]?.id], handleSelectAnswer])}

                {/* Pagination Buttons */}
                <div className="flex justify-between items-center mt-12">
                  <button
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 px-6 py-3 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <FiArrowLeft /> Previous
                  </button>
                  
                  {currentQuestionIndex < questions.length - 1 && (
                    <button
                      onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                      className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 px-6 py-3 rounded-xl transition-all flex items-center gap-2"
                    >
                      Next <FiArrowRight />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner dark:bg-slate-800/30 dark:border-slate-700/50">
              <div className="text-center mb-6">
                <Timer initialSeconds={durationMinutes * 60} onTimeUp={handleTimeUp} />
              </div>
              
              <div className="grid grid-cols-5 gap-2 mt-6">
                {questions.map((q, idx) => (
                  <MemoizedGridButton
                    key={q.id}
                    idx={idx}
                    isAnswered={!!answers[q.id]}
                    isCurrent={currentQuestionIndex === idx}
                    onClick={setCurrentQuestionIndex}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Submit Warning Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiAlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Incomplete Exam</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                You still have <span className="font-bold text-slate-900 dark:text-white">{questions.length - Object.keys(answers).length}</span> unanswered questions. Are you sure you want to submit your exam early? You cannot undo this action.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white py-3 rounded-xl transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition-all font-medium shadow-lg shadow-red-500/30"
                >
                  Yes, Submit Anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
