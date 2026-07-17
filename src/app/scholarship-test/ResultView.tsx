import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import Link from "next/link";

interface ResultViewProps {
  result: { correctCount: number; totalQuestions: number; accuracy: string };
}

export function ResultView({ result }: ResultViewProps) {
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 rounded-3xl text-center shadow-2xl mt-10"
    >
      <FiCheckCircle className="text-emerald-400 w-16 h-16 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
      
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Assessment Submitted!</h2>
      
      <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
        Thank you for participating in the NIT Scholarship Exam. Your responses have been securely recorded.
      </p>
      
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
        Our academic team will evaluate all submissions. If you qualify for the scholarship, you will be notified via your registered email address shortly.
      </p>

      <Link 
        href="/"
        className="block w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white py-3 rounded-xl transition-all font-semibold"
      >
        Return to Homepage
      </Link>
    </motion.div>
  );
}
