'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { FiClock, FiAlertTriangle, FiCheckCircle, FiXCircle, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

export default function QuizInterface({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const { user, isLoading: authIsLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const [quizData, setQuizData] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes default
  const [timerActive, setTimerActive] = useState(false);
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (authIsLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    
    fetch(`/api/courses/${courseId}/quiz`)
      .then(res => res.json())
      .then(data => {
        if (data.questions && data.questions.length > 0) {
          setQuizData(data);
          setQuestions(data.questions);
          setTimeLeft(data.timeLimitMinutes * 60);
          setTimerActive(true);
        } else {
          setResult({ error: 'No questions available for this course yet.' });
        }
      })
      .catch(err => {
        setResult({ error: 'Failed to load quiz data.' });
      })
      .finally(() => setLoading(false));
  }, [user, courseId, router, authIsLoading]);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      handleAutoSubmit();
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, timeLeft]);

  function handleAutoSubmit() {
    setTimerActive(false);
    submitQuiz();
  }

  async function submitQuiz() {
    if (!user) return;
    setIsSubmitting(true);
    setTimerActive(false);
    setShowConfirmModal(false);

    try {
      const res = await fetch(`/api/courses/${courseId}/quiz/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user.id,
          selectedAnswers: answers
        })
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: 'Failed to grade assessment.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    if (quizData) {
      setTimeLeft(quizData.timeLimitMinutes * 60);
    } else {
      setTimeLeft(10 * 60);
    }
    setTimerActive(true);
    setResult(null);
  };

  const handleOptionSelect = (qId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (authIsLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050A18] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050A18] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#0A1024] max-w-lg w-full rounded-3xl shadow-xl p-8 text-center border border-gray-100 dark:border-gray-800">
          {result.error ? (
            <>
              <FiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-2">Assessment Unavailable</h2>
              <p className="text-gray-500 mb-6">{result.error}</p>
              <Link href="/skill_courses" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">Back to Courses</Link>
            </>
          ) : (
            <>
              {result.passed ? (
                <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              ) : (
                <FiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              )}
              <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-2">
                {result.passed ? 'Assessment Passed!' : 'Assessment Failed'}
              </h2>
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 my-6">
                {result.percentage}%
              </div>
              <p className="text-gray-500 mb-2">Score: {result.score} / {result.total}</p>
              <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 mb-8">{result.message}</p>
              
              <div className="flex gap-4 justify-center">
                <Link href="/dashboard" className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 px-6 rounded-xl transition-colors">Dashboard</Link>
                {result.passed ? (
                  <Link href={result.certificate_id ? `/verification?id=${result.certificate_id}` : '/certificates'} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">View Certificate</Link>
                ) : (
                  <button onClick={resetQuiz} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">Retry Assessment</button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];
  const unansweredCount = questions.length - Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050A18] flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-white dark:bg-[#0A1024] border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="font-bold text-lg text-[#0F172A] dark:text-white">{quizData.courseTitle} - Assessment</h1>
          <p className="text-xs text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg ${timeLeft < 60 ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
          <FiClock /> {formatTime(timeLeft)}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-6 flex flex-col justify-center">
        {isSubmitting ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white animate-pulse">Grading in progress...</h2>
            <p className="text-gray-500 mt-2">Please do not refresh the page.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#111C3A] rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white mb-8 leading-relaxed">
              {currentQuestionIndex + 1}. {currentQ.question_text}
            </h2>

            <div className="space-y-4">
              {currentQ.options.map((opt: string, i: number) => {
                const isSelected = answers[currentQ.id] === opt;
                return (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(currentQ.id, opt)}
                    className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all font-medium ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {String.fromCharCode(65 + i)}. {opt}
                  </button>
                );
              })}
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-100 dark:border-gray-800">
              <button 
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 text-[#0F172A] dark:text-white"
              >
                <FiArrowLeft /> Previous
              </button>
              
              {currentQuestionIndex < questions.length - 1 ? (
                <button 
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30"
                >
                  Next <FiArrowRight />
                </button>
              ) : (
                <button 
                  onClick={() => setShowConfirmModal(true)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-500/30"
                >
                  Submit Quiz <FiCheckCircle />
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111C3A] max-w-md w-full rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-800 text-center animate-in zoom-in-95 duration-200">
            <FiAlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-2">Ready to submit?</h3>
            <p className="text-gray-500 mb-6">
              You have {formatTime(timeLeft)} remaining.
              {unansweredCount > 0 && (
                <span className="block mt-2 font-bold text-red-500">
                  You have {unansweredCount} unanswered {unansweredCount === 1 ? 'question' : 'questions'} left.
                </span>
              )}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-xl transition-colors"
              >
                Return to Quiz
              </button>
              <button 
                onClick={submitQuiz}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
