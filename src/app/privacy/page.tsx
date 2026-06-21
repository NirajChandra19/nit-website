"use client";

import { motion } from "framer-motion";
import { playfair } from "../fonts";
import { FiShield, FiEye, FiLock, FiFileText, FiRefreshCw, FiExternalLink } from "react-icons/fi";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Information We Collect",
      icon: <FiEye className="w-6 h-6" />,
      content: "We collect information you provide directly to us when you create an account, enroll in courses, or apply for internships. This includes your name, email address, educational background, and any other information you choose to provide."
    },
    {
      title: "How We Use Your Data",
      icon: <FiRefreshCw className="w-6 h-6" />,
      content: "We use your data to provide, maintain, and improve our services, including processing your enrollments, issuing certificates, and communicating with you about your progress and new opportunities."
    },
    {
      title: "Data Security",
      icon: <FiLock className="w-6 h-6" />,
      content: "We implement robust security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Your trust is our priority."
    },
    {
      title: "Third-Party Sharing",
      icon: <FiExternalLink className="w-6 h-6" />,
      content: "We do not sell your personal data. We may share information with trusted partners who assist us in operating our website and providing services, provided they agree to keep this information confidential."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050A18] pt-24 pb-20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-3xl mb-8"
          >
            <FiShield className="w-10 h-10" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${playfair.className} text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-white mb-6`}
          >
            Privacy Policy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 dark:text-gray-400"
          >
            Last updated: June 15, 2026
          </motion.p>
        </div>

        {/* Introduction */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-[#111C3A] p-8 md:p-10 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm mb-12"
        >
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic">
            &quot;At Nainital Institute of Technology (NIT), we take your privacy seriously. This policy outlines our commitment to protecting the personal data of our students and interns.&quot;
          </p>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="flex items-start gap-6 p-8 bg-white dark:bg-[#111C3A] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="shrink-0 w-12 h-12 bg-gray-50 dark:bg-[#050A18] text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-4">{section.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center p-8 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800/50"
        >
          <FiFileText className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">Have questions about our policy?</h4>
          <p className="text-gray-600 dark:text-gray-400 mb-6">If you have any questions or concerns, please don&apos;t hesitate to reach out.</p>
          <a href="/support" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:gap-3 transition-all">
            Contact Support <FiExternalLink />
          </a>
        </motion.div>

      </div>
    </div>
  );
}
