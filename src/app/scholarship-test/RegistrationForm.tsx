import { motion } from "framer-motion";
import { FiArrowLeft, FiClock, FiAlertCircle, FiUser, FiPhone, FiMail, FiHome, FiLoader, FiArrowRight } from "react-icons/fi";
import { Exam } from "./types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().trim().min(1, "Full Name is required"),
  phone: z.string().regex(/^(?:\+91\s?)?[0-9]{10}$/, "Please enter a valid 10-digit phone number"),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  college: z.string().trim().min(1, "College name is required"),
});

export type RegistrationFormData = z.infer<typeof formSchema>;

interface RegistrationFormProps {
  selectedExam: Exam;
  isLoading: boolean;
  error: string;
  onBack: () => void;
  onSubmit: (data: RegistrationFormData) => void;
}

export function RegistrationForm({ selectedExam, isLoading, error, onBack, onSubmit }: RegistrationFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<RegistrationFormData>({
    resolver: zodResolver(formSchema),
  });

  return (
    <motion.div
      key="register"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl mx-auto w-full"
    >
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 p-8 rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text dark:text-white mb-8 transition-colors text-sm font-medium"
        >
          <FiArrowLeft /> Back to Exams
        </button>

        <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">{selectedExam.title}</h2>
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 text-xs px-3 py-1.5 rounded-full font-medium">
            <FiClock className="w-3.5 h-3.5" /> {selectedExam.duration_minutes} Minutes Duration
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 flex items-start gap-3 text-sm backdrop-blur-sm">
            <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> 
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
            <div className="relative flex items-center">
              <FiUser className="absolute left-4 text-slate-500 dark:text-slate-400 w-5 h-5" />
              <input
                type="text"
                {...register("name")}
                className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg py-3 pl-11 pr-4 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
            <div className="relative flex items-center">
              <FiPhone className="absolute left-4 text-slate-500 dark:text-slate-400 w-5 h-5" />
              <input
                type="tel"
                {...register("phone")}
                className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg py-3 pl-11 pr-4 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="+91 9876543210"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
            <div className="relative flex items-center">
              <FiMail className="absolute left-4 text-slate-500 dark:text-slate-400 w-5 h-5" />
              <input
                type="email"
                {...register("email")}
                className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg py-3 pl-11 pr-4 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="john@example.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">College Name</label>
            <div className="relative flex items-center">
              <FiHome className="absolute left-4 text-slate-500 dark:text-slate-400 w-5 h-5" />
              <input
                type="text"
                {...register("college")}
                className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg py-3 pl-11 pr-4 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Nainital Institute of Technology"
              />
            </div>
            {errors.college && <p className="text-red-500 text-xs mt-1">{errors.college.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-8 flex justify-center items-center gap-2"
          >
            {isLoading ? <FiLoader className="animate-spin w-5 h-5" /> : (
              <>
                Register & Start Exam <FiArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
