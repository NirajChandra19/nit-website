"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiDownload, FiRefreshCcw } from "react-icons/fi";
import { playfair } from "../app/fonts";

// We export this interface so the main page can use it too
export interface CertificateData {
  studentName: string;
  courseName: string;
  issueDate: string;
  grade: string;
  percentage?: number | null;
  credentialId: string;
  type: string;
  studentRegId?: string;
  duration?: number;
}

interface SuccessCardProps {
  data: CertificateData;
  onReset: () => void;
}

export default function SuccessCard({ data, onReset }: SuccessCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    if (isDownloading) return;
    setIsDownloading(true);
    
    // Create an invisible anchor tag to trigger the download from the API route
    const link = document.createElement('a');
    link.href = `/api/certificates/download?id=${data.credentialId}`;
    link.download = `Certificate_${data.credentialId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Simulate a brief downloading state
    setTimeout(() => {
      setIsDownloading(false);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }} 
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="w-full max-w-lg bg-white/90 dark:bg-[#111C3A]/90 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 shadow-[0_20px_60px_rgb(0,0,0,0.05)] border border-white/50 dark:border-gray-700/50 relative z-10"
    >
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center border border-green-100 dark:border-green-800/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
          <FiCheckCircle className="w-10 h-10 text-green-500 dark:text-green-400" />
        </div>
      </div>

      <h2 className={`${playfair.className} text-3xl text-center text-[#0F172A] dark:text-white font-bold mb-2`}>Verified Successfully</h2>
      <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-8">This certificate is authentic and officially recognized by NIT.</p>

      <div className="bg-gray-50 dark:bg-[#0A142F] rounded-xl p-6 border border-gray-100 dark:border-gray-800 mb-8 space-y-4">
        <div><p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Recipient</p><p className="text-lg font-bold text-[#0F172A] dark:text-white">{data.studentName}</p></div>
        <div><p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Certification</p><p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{data.courseName}</p></div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div><p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Issue Date</p><p className="text-sm font-medium text-gray-800 dark:text-gray-200">{data.issueDate}</p></div>
          {data.type === 'course' ? (
            <div><p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Percentage</p><p className="text-sm font-medium text-green-600 dark:text-green-400">{data.percentage != null ? `${data.percentage}%` : 'N/A'}</p></div>
          ) : (
            <div><p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Grade</p><p className="text-sm font-medium text-green-600 dark:text-green-400">{data.grade || 'N/A'}</p></div>
          )}
        </div>
        <div className="pt-2 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Credential ID</p>
            <p className="text-sm font-mono font-medium text-gray-600 dark:text-gray-400">{data.credentialId}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Type</p>
            <p className="text-sm font-medium text-purple-600 dark:text-purple-400 capitalize">{data.type}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-50"
        >
          <FiDownload className="w-5 h-5" /> {isDownloading ? "Starting Download..." : "Download Official PDF"}
        </button>
        <button onClick={onReset} className="w-full bg-transparent hover:bg-gray-50 dark:hover:bg-[#0A142F] text-gray-500 dark:text-gray-400 font-medium py-3 px-4 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-800 flex justify-center items-center gap-2">
          <FiRefreshCcw className="w-4 h-4" /> Verify Another
        </button>
      </div>
    </motion.div>
  );
}