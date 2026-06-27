"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SearchForm from "@/components/SearchForm"; 
import SuccessCard, { CertificateData } from "@/components/SuccessCard";

interface Props {
  initialId: string;
  initialData: CertificateData | null;
  initialError: string;
}

export default function VerificationClient({ initialId, initialData, initialError }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>(initialError);
  const [verifiedData, setVerifiedData] = useState<CertificateData | null>(initialData);
  const router = useRouter();

  // If the user submits a NEW id from the search form, we navigate to the new URL
  const handleVerify = (certId: string) => {
    if (!certId.trim()) return;
    setIsLoading(true);
    router.push(`/verification?id=${certId.trim()}`);
  };

  useEffect(() => {
    setVerifiedData(initialData);
    setError(initialError);
    setIsLoading(false);
  }, [initialData, initialError, initialId]);

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
            onReset={() => { 
              setVerifiedData(null); 
              setError(""); 
              router.push('/verification'); // Clear the URL id
            }} 
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
