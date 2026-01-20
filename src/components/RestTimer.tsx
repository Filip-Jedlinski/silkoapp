import React, { useState, useEffect } from "react";
import { CheckCircle2, Clock } from "lucide-react";

interface RestTimerProps {
  duration: number; // seconds
  onComplete: () => void;
  onSkip?: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  duration,
  onComplete,
  onSkip,
}) => {
  const [remaining, setRemaining] = useState(duration);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (remaining <= 0) {
      onComplete();
      setIsComplete(true);
      return;
    }

    const timer = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining, onComplete]);

  const percentage = ((duration - remaining) / duration) * 100;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8">
      {/* Circular countdown */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Background circle */}
        <svg
          className="absolute inset-0 w-full h-full transform -rotate-90"
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="8"
            strokeDasharray={`${(percentage / 100) * 565.5} 565.5`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.3s ease-out" }}
          />
        </svg>

        {/* Time display */}
        <div className="text-center z-10">
          <div className="text-5xl font-bold text-neutral-900 tabular-nums">
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>
          <p className="text-sm text-neutral-500 mt-2">Odpoczynek</p>
        </div>
      </div>

      {/* Status */}
      {isComplete ? (
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-bold">Czas na następną serię!</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-neutral-600">
          <Clock className="w-5 h-5 animate-spin" />
          <span className="text-sm">Odpoczywaj...</span>
        </div>
      )}

      {/* Skip button */}
      {!isComplete && onSkip && (
        <button
          onClick={onSkip}
          className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-lg font-medium text-sm hover:bg-neutral-300 transition-colors"
        >
          Pomiń
        </button>
      )}
    </div>
  );
};
