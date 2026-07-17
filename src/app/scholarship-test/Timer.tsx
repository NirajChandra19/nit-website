import { useState, useEffect, useRef } from "react";
import { FiClock } from "react-icons/fi";

interface TimerProps {
  initialSeconds: number;
  onTimeUp: () => void;
}

export function Timer({ initialSeconds, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  // Keep the latest callback in a ref to avoid stale closures
  const onTimeUpRef = useRef(onTimeUp);
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (initialSeconds <= 0) return;
    
    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [initialSeconds]);

  // Separate effect to safely trigger the callback
  useEffect(() => {
    if (timeLeft === 0 && initialSeconds > 0) {
      onTimeUpRef.current();
    }
  }, [timeLeft, initialSeconds]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className={`inline-flex items-center gap-2 font-mono text-xl font-bold px-6 py-3 rounded-full border shadow-sm transition-colors ${
      timeLeft < 60 
        ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400' 
        : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300'
    }`}>
      <FiClock /> {formatTime(timeLeft)}
    </div>
  );
}
