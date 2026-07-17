import { memo } from "react";
import { Question } from "./types";

interface QuestionItemProps {
  question: Question;
  index: number;
  selectedAnswer?: string;
  onSelect: (questionId: number, answer: string) => void;
}

export const QuestionItem = memo(function QuestionItem({ question, index, selectedAnswer, onSelect }: QuestionItemProps) {
  return (
    <>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-relaxed">
        <span className="mr-3">Q{index + 1}.</span>
        {question.question_text}
      </h3>
      <div className="flex flex-col gap-4">
        {question.options.map((opt, oIdx) => {
          const isSelected = selectedAnswer === opt;
          return (
            <label
              key={oIdx}
              className={`border rounded-xl p-4 transition-all cursor-pointer flex items-center gap-4 shadow-sm ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50 text-blue-900 ring-1 ring-blue-500 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-white dark:ring-indigo-500' 
                  : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700/50'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={opt}
                checked={isSelected}
                onChange={(e) => onSelect(question.id, e.target.value)}
                className="hidden"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                isSelected ? 'border-blue-500 dark:border-indigo-500' : 'border-slate-300 dark:border-slate-500'
              }`}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 dark:bg-indigo-500" />}
              </div>
              <span className="flex-1 text-[16px] leading-relaxed">{opt}</span>
            </label>
          );
        })}
      </div>
    </>
  );
});
