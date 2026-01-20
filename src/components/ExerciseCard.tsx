import React from "react";
import type { Exercise } from "../types";
import { CheckCircle2, Circle } from "lucide-react";

interface ExerciseCardProps {
  exercise: Exercise;
  onComplete: (exerciseId: string) => void;
  onEdit?: (exercise: Exercise) => void;
  showDetail?: boolean;
  onClick?: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onComplete,
  onEdit,
  showDetail = false,
  onClick,
}) => {
  const completedSets = exercise.sets.filter((s) => s.completed).length;
  const totalSets = exercise.sets.length;
  const progress = (completedSets / totalSets) * 100;

  return (
    <div
      className={`card p-4 mb-3 cursor-pointer transition-all duration-200 ${
        exercise.completed ? "bg-green-50 border border-green-200" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete(exercise.id);
          }}
          className="mt-1 flex-shrink-0"
          aria-label="Toggle exercise"
        >
          {exercise.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6 text-neutral-300" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-neutral-900 truncate ${
              exercise.completed ? "line-through text-neutral-500" : ""
            }`}
          >
            {exercise.name}
          </h3>

          {showDetail && exercise.userNotes && (
            <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
              {exercise.userNotes}
            </p>
          )}

          {/* Display sets */}
          <div className="mt-2 space-y-1">
            {exercise.sets.map((set, idx) => (
              <div
                key={idx}
                className="text-sm text-neutral-600 flex items-center gap-2"
              >
                <span className="font-medium">Set {idx + 1}:</span>
                <span>
                  {set.reps} reps × {set.weight}kg
                </span>
                {set.completed && (
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                )}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          {totalSets > 1 && (
            <div className="mt-2 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Edit button - optional */}
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(exercise);
            }}
            className="btn-icon flex-shrink-0"
          >
            ✎
          </button>
        )}
      </div>
    </div>
  );
};

export const ExerciseCardSkeleton: React.FC = () => {
  return (
    <div className="card p-4 mb-3 animate-pulse">
      <div className="flex gap-3">
        <div className="w-6 h-6 bg-neutral-200 rounded-full flex-shrink-0" />
        <div className="flex-1">
          <div className="h-5 bg-neutral-200 rounded mb-2 w-3/4" />
          <div className="h-4 bg-neutral-100 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
};
