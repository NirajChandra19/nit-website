"use client";

import { FiCheckCircle } from "react-icons/fi";
import { useLanguage } from "@/components/LanguageProvider";

const languages = ["English", "Hindi"];

export default function LanguageModal({
  language,
  setLanguage,
  user,
  onClose
}: {
  language: string;
  setLanguage: (lang: string) => void;
  user: any;
  onClose: () => void;
}) {
  const { setLanguage: setGlobalLanguage } = useLanguage();

  const handleLanguageChange = async (lang: string) => {
    if (!user?.id) return;
    try {
      const res = await fetch('/api/settings/language', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user.id, language: lang })
      });
      const data = await res.json();
      if (data.success) {
        setLanguage(lang);
        setGlobalLanguage(lang);
        onClose();
      } else alert(data.error || "Failed to update language");
    } catch (err) { alert("Error updating language"); }
  };

  return (
    <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => handleLanguageChange(lang)}
          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${language === lang ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0A1024] hover:border-gray-300 dark:hover:border-gray-600'}`}
        >
          <span className={`text-sm font-bold ${language === lang ? 'text-blue-700 dark:text-blue-400' : 'text-[#0F172A] dark:text-white'}`}>{lang}</span>
          {language === lang && <FiCheckCircle className="w-5 h-5 text-blue-500" />}
        </button>
      ))}
    </div>
  );
}
