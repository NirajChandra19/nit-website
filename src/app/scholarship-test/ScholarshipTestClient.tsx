"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';
import { Exam, Question } from "./types";
import { ExamList } from "./ExamList";
import type { RegistrationFormData } from "./RegistrationForm";

const RegistrationForm = dynamic(() => import("./RegistrationForm").then(mod => mod.RegistrationForm), {
  loading: () => <div className="text-center py-12 text-slate-500 animate-pulse">Loading registration...</div>,
});
const TestInterface = dynamic(() => import("./TestInterface").then(mod => mod.TestInterface), {
  loading: () => <div className="text-center py-12 text-slate-500 animate-pulse">Loading test environment...</div>,
});
const ResultView = dynamic(() => import("./ResultView").then(mod => mod.ResultView), {
  loading: () => <div className="text-center py-12 text-slate-500 animate-pulse">Loading results...</div>,
});

export function ScholarshipTestClient() {
  const [step, setStep] = useState<"list" | "register" | "test" | "result">("list");
  
  // List state
  const [activeExams, setActiveExams] = useState<Exam[]>([]);
  const [isFetchingExams, setIsFetchingExams] = useState(true);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  // General state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Test state
  const [token, setToken] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<{ correctCount: number; totalQuestions: number; accuracy: string } | null>(null);

  useEffect(() => {
    fetchActiveExams();
  }, []);

  const fetchActiveExams = async () => {
    setIsFetchingExams(true);
    try {
      const res = await fetch("/api/exams");
      if (!res.ok) throw new Error("Failed to load active exams");
      const data = await res.json();
      setActiveExams(data);
    } catch (err: any) {
      console.error("Failed to fetch active exams:", err);
      setError(err.message || "Failed to load exams. Please try again later.");
    } finally {
      setIsFetchingExams(false);
    }
  };

  const handleSelectExam = useCallback((exam: Exam) => {
    setSelectedExam(exam);
    setStep("register");
    setError("");
  }, []);

  const handleBackToExams = useCallback(() => {
    setSelectedExam(null);
    setStep("list");
    setError("");
  }, []);

  const handleStartExam = async (formData: RegistrationFormData) => {
    setError("");
    if (!selectedExam) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/exams/${selectedExam.id}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start exam");

      setToken(data.token);
      setQuestions(data.questions);
      setStep("test");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmittingRef = useRef(false);

  const handleSubmitTest = useCallback(async (answers: Record<string, string>) => {
    if (!selectedExam || isSubmittingRef.current) return;
    
    isSubmittingRef.current = true;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/exams/${selectedExam.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, answers }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit exam");

      setResult(data.result);
      setStep("result");
    } catch (err: any) {
      alert(err.message);
      isSubmittingRef.current = false; // Only reset if it failed so user can try again
    } finally {
      setIsLoading(false);
    }
  }, [selectedExam, token]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050A18] pt-5 pb-10 px-4 sm:px-6 transition-colors duration-300">
      {/* Animated background glow effects */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[150px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[150px] pointer-events-none" 
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          
          {step === "list" && (
            <ExamList 
              activeExams={activeExams} 
              isFetchingExams={isFetchingExams} 
              onSelectExam={handleSelectExam} 
            />
          )}

          {step === "register" && selectedExam && (
            <RegistrationForm
              selectedExam={selectedExam}
              isLoading={isLoading}
              error={error}
              onBack={handleBackToExams}
              onSubmit={handleStartExam}
            />
          )}

          {step === "test" && selectedExam && (
            <TestInterface
              exam={selectedExam}
              questions={questions}
              durationMinutes={selectedExam.duration_minutes}
              isLoading={isLoading}
              onSubmit={handleSubmitTest}
            />
          )}

          {step === "result" && result && (
            <ResultView result={result} />
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
