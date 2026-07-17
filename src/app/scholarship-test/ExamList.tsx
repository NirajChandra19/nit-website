import { motion } from "framer-motion";
import { FiClock, FiFileText, FiArrowRight, FiLoader, FiAlertCircle } from "react-icons/fi";
import { Exam } from "./types";

interface ExamListProps {
  activeExams: Exam[];
  isFetchingExams: boolean;
  onSelectExam: (exam: Exam) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function ExamList({ activeExams, isFetchingExams, onSelectExam }: ExamListProps) {
  return (
    <motion.div
      key="list"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-6 pb-2">
          Scholarship Tests
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Select an active exam to participate and win scholarships. Experience our premium assessment platform.
        </p>
      </div>

      {isFetchingExams ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
          <FiLoader className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
          <p>Loading available exams...</p>
        </div>
      ) : activeExams.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 p-10 rounded-2xl text-center backdrop-blur-md max-w-2xl mx-auto">
          <FiAlertCircle className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Active Exams</h3>
          <p className="text-slate-500 dark:text-slate-400">There are no active scholarship exams at the moment. Please check back later.</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activeExams.map((exam) => (
            <motion.div
              variants={itemVariants}
              key={exam.id}
              onClick={() => onSelectExam(exam)}
              className="group bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 p-6 rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-md hover:scale-[1.02] hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20 relative overflow-hidden flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                  <FiFileText className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 text-xs px-3 py-1 rounded-full font-medium">
                  <FiClock className="w-3.5 h-3.5" /> {exam.duration_minutes} Mins
                </div>
              </div>
              
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-300 transition-colors line-clamp-2">
                  {exam.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                  Take this scholarship test to prove your skills and win exciting rewards.
                </p>
              </div>

              <div className="mt-6 flex items-center text-sm font-medium text-indigo-400 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                Register Now <FiArrowRight className="ml-2" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
