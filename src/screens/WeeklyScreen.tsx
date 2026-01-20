import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Header, ContentContainer } from "../components/Layout";
import type { TrainingDay } from "../types";
import { Plus } from "lucide-react";

interface WeeklyScreenProps {
  onExerciseSelect?: (day: TrainingDay, exerciseId: string) => void;
}

export const WeeklyScreen: React.FC<WeeklyScreenProps> = ({
  onExerciseSelect,
}) => {
  const { currentPlan, completeExercise } = useApp();
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  return (
    <>
      <Header title="Plan Tygodniowy" />

      <ContentContainer>
        <div className="space-y-3">
          {currentPlan.days.map((day) => (
            <div
              key={day.id}
              className={`card border border-blue-200 p-0 overflow-hidden`}
            >
              {/* Header */}
              <button
                onClick={() =>
                  setExpandedDay(expandedDay === day.id ? null : day.id)
                }
                className="w-full p-4 flex items-center gap-3 hover:bg-black hover:bg-opacity-5 transition-colors"
              >
                <div className="flex-1 text-left min-w-0">
                  <h3 className="font-bold text-neutral-900 truncate">
                    {day.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {day.exercises.length} ćwiczeń
                  </p>
                </div>
              </button>

              {/* Expanded content */}
              {expandedDay === day.id && (
                <div className="border-t border-current border-opacity-20 px-4 py-3">
                  <div className="space-y-2">
                    {day.exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="flex items-center gap-2 p-2 rounded bg-white bg-opacity-50 cursor-pointer hover:bg-opacity-100 transition-colors"
                        onClick={() => onExerciseSelect?.(day, exercise.id)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            {exercise.name}
                          </p>
                          <p className="text-xs text-neutral-600">
                            {exercise.sets.length} sets ·{" "}
                            {exercise.sets[0]?.reps ?? 0} reps @{" "}
                            {exercise.sets[0]?.weight ?? 0}kg
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            completeExercise(day.id, exercise.id);
                          }}
                          className={`text-lg ${
                            exercise.completed
                              ? "✓ text-green-600"
                              : "○ text-neutral-400"
                          }`}
                        >
                          {exercise.completed ? "✓" : "○"}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add exercise button */}
                  <button className="w-full mt-3 p-2 text-primary-600 text-sm font-medium hover:bg-white hover:bg-opacity-50 rounded transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Dodaj ćwiczenie
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info box */}
        <div className="mt-6 card bg-blue-50 border border-blue-200 p-4">
          <p className="text-sm text-blue-900">
            💡 Kliknij na dzień, aby zobaczyć i edytować ćwiczenia
          </p>
        </div>
      </ContentContainer>
    </>
  );
};
