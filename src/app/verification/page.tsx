"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
// Note: We use '@/' assuming you have path aliases set up in tsconfig.json. 
import SearchForm from "@/components/SearchForm"; 
import SuccessCard, { CertificateData } from "@/components/SuccessCard";

function VerificationContent() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [verifiedData, setVerifiedData] = useState<CertificateData | null>(null);

  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  useEffect(() => {
    if (initialId) {
      handleVerify(initialId);
    }
   
  }, [initialId]);

  async function handleVerify(certId: string) {
    if (!certId.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/verify?id=${certId.trim()}`);
      const result = await response.json();

      if (response.ok) {
        // Map backend fields to frontend interface
        const mappedData: CertificateData = {
          studentName: result.student_name,
          courseName: result.course_title,
          issueDate: new Date(result.issue_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          grade: result.grade,
          percentage: result.percentage,
          credentialId: result.cert_id,
          type: result.type,
          studentRegId: result.reg_id
        };
        setVerifiedData(mappedData);
      } else {
        setError(result.error || "No certificate found with this ID. Please check and try again.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("An error occurred during verification. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center relative z-10 overflow-hidden bg-transparent px-4 py-10 transition-colors duration-300">
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] opacity-30 dark:opacity-20 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] opacity-30 dark:opacity-20 animate-pulse pointer-events-none"></div>

      <AnimatePresence mode="wait">
        {!verifiedData ? (
          <SearchForm 
            key="search" 
            onVerify={handleVerify} 
            isLoading={isLoading} 
            error={error} 
            initialId={initialId}
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

export default function VerificationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <VerificationContent />
    </Suspense>
  );
}