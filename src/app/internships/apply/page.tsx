"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { playfair } from "../../fonts"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiArrowLeft, FiUser, FiMail, FiPhone, 
  FiBook, FiUploadCloud, FiBriefcase, FiCheckCircle, FiSend 
} from "react-icons/fi";

// --- ISOLATED FORM COMPONENT TO READ URL PARAMS ---
function ApplicationForm() {
  const searchParams = useSearchParams();
  
  // Grab the data from the URL, or use fallbacks just in case
  const title = searchParams.get("title") || "Internship Program";
  const duration = searchParams.get("duration") || "4 Weeks";
  const category = searchParams.get("category") || "Technology";
  const color = searchParams.get("color") || "from-blue-600 to-teal-500";

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    degree: "",
    portfolioUrl: "",
    coverLetter: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Connect Backend API Here
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000); 
  };

  return (
    <AnimatePresence mode="wait">
      {!isSuccess ? (
        <motion.div 
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-[#111C3A] rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden"
        >
          {/* DYNAMIC HEADER AREA */}
          <div className={`bg-gradient-to-r ${color} p-8 sm:p-10 relative overflow-hidden transition-colors duration-500`}>
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="relative z-10 text-white">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase mb-4 shadow-sm border border-white/10">
                {category} Application
              </span>
              <h1 className={`${playfair.className} text-3xl sm:text-4xl font-bold mb-2`}>
                {title}
              </h1>
              <p className="text-white/90 text-sm sm:text-base">
                Join our {duration} virtual program to build real-world projects and get certified.
              </p>
            </div>
          </div>

          {/* Form Area */}
          <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8">
            
            {/* Section 1: Personal Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                1. Personal Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" name="fullName" required suppressHydrationWarning
                      value={formData.fullName} onChange={handleChange}
                      placeholder="John Doe" 
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#0A1024] border border-gray-200 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-[#0F172A] dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email" name="email" required suppressHydrationWarning
                      value={formData.email} onChange={handleChange}
                      placeholder="john@example.com" 
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#0A1024] border border-gray-200 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-[#0F172A] dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="tel" name="phone" required suppressHydrationWarning
                      value={formData.phone} onChange={handleChange}
                      placeholder="+91 98765 43210" 
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#0A1024] border border-gray-200 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-[#0F172A] dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Academic & Professional */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                2. Academic & Experience
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">College / University</label>
                  <div className="relative">
                    <FiBook className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" name="college" required suppressHydrationWarning
                      value={formData.college} onChange={handleChange}
                      placeholder="Nainital Institute of Technology" 
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#0A1024] border border-gray-200 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-[#0F172A] dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Degree & Year</label>
                  <div className="relative">
                    <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" name="degree" required suppressHydrationWarning
                      value={formData.degree} onChange={handleChange}
                      placeholder="BCA, 3rd Year" 
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#0A1024] border border-gray-200 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-[#0F172A] dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Resume & Cover Letter */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                3. Resume & Details
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Upload Resume (PDF)</label>
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors bg-gray-50/50 dark:bg-[#0A1024]/50 group">
                  <input 
                    type="file" accept=".pdf,.doc,.docx" required onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  <div className="p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <FiUploadCloud className="w-6 h-6" />
                    </div>
                    {fileName ? (
                      <span className="text-sm font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2">
                        <FiCheckCircle /> {fileName}
                      </span>
                    ) : (
                      <>
                        <span className="text-sm font-semibold text-[#0F172A] dark:text-white mb-1">Click to upload or drag and drop</span>
                        <span className="text-xs text-gray-500">PDF, DOCX up to 5MB</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Why should we select you? (Optional)</label>
                <textarea 
                  name="coverLetter" rows={4} suppressHydrationWarning
                  value={formData.coverLetter} onChange={handleChange}
                  placeholder="Tell us about your skills, projects, and why you are a great fit..." 
                  className="w-full p-4 bg-gray-50 dark:bg-[#0A1024] border border-gray-200 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-[#0F172A] dark:text-white resize-none"
                />
              </div>
            </div>

            {/* Submit Area */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting Application...
                  </>
                ) : (
                  <>Submit Application <FiSend className="w-5 h-5" /></>
                )}
              </button>
              <p className="text-xs text-gray-500 mt-4 flex items-center gap-1.5">
                <FiCheckCircle className="text-teal-500" /> By submitting, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>

          </form>
        </motion.div>
      ) : (
        /* --- SUCCESS STATE UI --- */
        <motion.div 
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-[#111C3A] rounded-3xl border border-gray-100 dark:border-gray-800/60 p-12 text-center shadow-xl flex flex-col items-center"
        >
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="w-24 h-24 bg-teal-100 dark:bg-teal-900/30 text-teal-500 rounded-full flex items-center justify-center mb-6"
          >
            <FiCheckCircle className="w-12 h-12" />
          </motion.div>
          <h2 className={`${playfair.className} text-3xl font-bold text-[#0F172A] dark:text-white mb-4`}>
            Application Received!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
            Thank you for applying to the {title}. Our team will review your application and get back to you via email within 3-5 business days.
          </p>
          <Link 
            href="/internships" 
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#0F172A] dark:text-white font-bold py-3.5 px-8 rounded-xl transition-colors"
          >
            Return to Internships
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- MAIN PAGE WRAPPER ---
export default function InternshipApplicationPage() {
  return (
    // FIX: Removed min-h-screen and pt-24. Switched to py-8 (or py-12 on medium screens) to fix the top gap.
    <div className="bg-[#F8FAFC] dark:bg-[#050A18] transition-colors duration-300 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link 
          href="/internships" 
          className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6 md:mb-8 group font-medium"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Internships
        </Link>
        
        {/* Suspense boundary is required by Next.js when using useSearchParams */}
        <Suspense fallback={
          <div className="bg-white dark:bg-[#111C3A] rounded-3xl h-[600px] flex items-center justify-center border border-gray-100 dark:border-gray-800/60 shadow-sm animate-pulse">
            <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        }>
          <ApplicationForm />
        </Suspense>

      </div>
    </div>
  );
}