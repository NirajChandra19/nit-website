"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { TRANSLATIONS } from "@/lib/translations";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>("English");

  const setLanguage = (lang: string) => setLanguageState(lang);

  const t = useCallback((key: string) => {
    return (TRANSLATIONS[language] || TRANSLATIONS["English"])[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
