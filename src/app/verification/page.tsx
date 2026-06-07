"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import your new components! Adjust paths based on your folder structure.
// Note: We use '@/' assuming you have path aliases set up in tsconfig.json. 
// If not, use relative paths like '../components/SearchForm'
import SearchForm from "@/components/SearchForm"; 
import SuccessCard, { CertificateData } from "@/components/SuccessCard";

// ==========================================
// STATIC MOCK DATABASE
// ==========================================
const MOCK_DATABASE: Record<string, CertificateData> = {
  "CERT-NIT-2025-8901": {
    studentName: "Niraj Chandra",
    courseName: "Machine Learning & Data Science",
    issueDate: "Aug 15, 2025",
    grade: "Outstanding (94%)",
    credentialId: "CERT-NIT-2025-8901"
  },
  "CERT-NIT-2025-4432": {
    studentName: "Niraj Chandra",
    courseName: "Python Programming Fundamentals",
    issueDate: "Oct 26, 2025",
    grade: "Excellent (88%)",
    credentialId: "CERT-NIT-2025-4432"
  }
};

export default function VerificationPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [verifiedData, setVerifiedData] = useState<CertificateData | null>(null);

  const handleVerify = (certId: string) => {
    if (!certId.trim()) return;

    setIsLoading(true);
    setError("");

    setTimeout(() => {
      const data = MOCK_DATABASE[certId.trim().toUpperCase()];
      
      if (data) {
        setVerifiedData(data);
      } else {
        setError("No certificate found with this ID. Please check and try again.");
      }
      setIsLoading(false);
    }, 800); 
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 dark:from-[#050A18] dark:via-[#0A142F] dark:to-[#050A18] px-4 py-20 transition-colors duration-300">
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] opacity-30 dark:opacity-20 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] opacity-30 dark:opacity-20 animate-pulse pointer-events-none"></div>

      <AnimatePresence mode="wait">
        {!verifiedData ? (
          <SearchForm 
            key="search" 
            onVerify={handleVerify} 
            isLoading={isLoading} 
            error={error} 
          />
        ) : (
          <SuccessCard 
            key="success" 
            data={verifiedData} 
            onReset={() => { setVerifiedData(null); setError(""); }} 
          />
        )}
      </AnimatePresence>

      <motion.p 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center relative z-10"
      >
        Need assistance or notice an error? Reach our verification desk at <br/>
        <a href="mailto:services.nit@gmail.com" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline mt-1 inline-block">
          services.nit@gmail.com
        </a>
      </motion.p>
    </div>
  );
}