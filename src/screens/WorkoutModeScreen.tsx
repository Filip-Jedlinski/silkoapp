import React, { useState, useEffect } from "react";
import type { TrainingDay } from "../types";
import { ContentContainer } from "../components/Layout";
import { RestTimer } from "../components/RestTimer";
import { useApp } from "../context/AppContext";
import { ChevronRight, ChevronLeft, X } from "lucide-react";

interface WorkoutModeScreenProps {
  day: TrainingDay;
  onExit: () => void;
}

type WorkoutPhase = "exercise" | "rest" | "complete";

interface WorkoutState {
  dayId: string;
  exerciseIndex: number;
  setIndex: number;
  phase: WorkoutPhase;
}

export const WorkoutModeScreen: React.FC<WorkoutModeScreenProps> = ({
  day,
  onExit,
}) => {
  const { completeSet, completeExercise, updateExerciseNotes } = useApp();

  // Load state from localStorage or initialize
  const [workoutState, setWorkoutState] = useState<WorkoutState>(() => {
    try {
      const saved = localStorage.getItem("silkoapp_workout_state");
      if (saved) {
        const state = JSON.parse(saved) as WorkoutState;
        // Only restore if same day
        if (state.dayId === day.id) {
          return state;
        }
      }
    } catch {
      // Ignore parse errors
    }
    return {
      dayId: day.id,
      exerciseIndex: 0,
      setIndex: 0,
      phase: "exercise" as WorkoutPhase,
    };
  });

  const { exerciseIndex, setIndex, phase } = workoutState;

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "silkoapp_workout_state",
      JSON.stringify(workoutState),
    );
  }, [workoutState]);

  const currentExercise = day.exercises[exerciseIndex];
  const currentSet = currentExercise?.sets[setIndex];
  const totalExercises = day.exercises.length;
  const totalSets = currentExercise?.sets.length || 0;

  const handleSetComplete = () => {
    // Mark set as complete
    completeSet(day.id, currentExercise.id, setIndex);

    // Check if all sets done
    if (setIndex < totalSets - 1) {
      // Move to rest phase
      setWorkoutState((prev) => ({ ...prev, phase: "rest" }));
    } else {
      // All sets done, complete exercise
      completeExercise(day.id, currentExercise.id);

      if (exerciseIndex < totalExercises - 1) {
        // More exercises, move to next
        setWorkoutState((prev) => ({
          ...prev,
          setIndex: 0,
          exerciseIndex: exerciseIndex + 1,
          phase: "exercise",
        }));
      } else {
        // Workout complete
        setWorkoutState((prev) => ({ ...prev, phase: "complete" }));
      }
    }
  };

  const handleRestComplete = () => {
    setWorkoutState((prev) => ({
      ...prev,
      setIndex: setIndex + 1,
      phase: "exercise",
    }));
  };

  const handleSkipRest = () => {
    setWorkoutState((prev) => ({
      ...prev,
      setIndex: setIndex + 1,
      phase: "exercise",
    }));
  };

  const handlePrevExercise = () => {
    if (exerciseIndex > 0) {
      setWorkoutState((prev) => ({
        ...prev,
        exerciseIndex: exerciseIndex - 1,
        setIndex: 0,
        phase: "exercise",
      }));
    }
  };

  const handleNextExercise = () => {
    if (exerciseIndex < totalExercises - 1) {
      setWorkoutState((prev) => ({
        ...prev,
        exerciseIndex: exerciseIndex + 1,
        setIndex: 0,
        phase: "exercise",
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-white text-neutral-900 flex flex-col safe-top-nav safe-bottom-nav">
      {/* Header */}
      <div className="px-4 py-2 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
        <div>
          <p className="text-xs font-medium text-neutral-600 tracking-wide">
            {day.name}
          </p>
          <p className="text-sm font-bold text-neutral-900 mt-0">
            {exerciseIndex + 1}/{totalExercises}
          </p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("silkoapp_workout_state");
            onExit();
          }}
          className="p-1.5 hover:bg-neutral-200 active:bg-neutral-300 rounded-full transition-colors"
          aria-label="Exit workout"
        >
          <X className="w-4 h-4 text-neutral-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {phase === "exercise" && currentExercise && currentSet ? (
          <ContentContainer>
            {/* Exercise title */}
            <div className="mt-3 mb-3">
              <h1 className="text-2xl font-bold text-neutral-900 mb-1 tracking-tight">
                {currentExercise.name}
              </h1>
              <p className="text-xs text-neutral-600 font-medium">
                {currentExercise.targetMuscle}
              </p>
            </div>

            {/* Machine instructions */}
            {currentExercise.alternative && (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl mb-3">
                <p className="text-xs font-semibold text-neutral-700 mb-1 tracking-wide">
                  ALTERNATYWA
                </p>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  {currentExercise.alternative}
                </p>
              </div>
            )}

            {/* Set progress */}
            <div className="flex gap-1.5 mb-3">
              {currentExercise.sets.map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${
                    idx < setIndex
                      ? "bg-green-500"
                      : idx === setIndex
                        ? "bg-primary-500"
                        : "bg-neutral-300"
                  }`}
                />
              ))}
            </div>

            {/* Current set card - Optimized */}
            <div className="rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 p-4 mb-3 text-center text-white shadow-lg">
              <p className="text-xs font-semibold text-primary-100 mb-2 tracking-wide uppercase">
                Seria {setIndex + 1}/{totalSets}
              </p>
              <div className="flex justify-around items-center gap-2 mb-3">
                <div>
                  <div className="text-4xl font-bold text-white leading-none mb-1">
                    {currentSet.reps}
                  </div>
                  <p className="text-xs text-primary-100 font-medium">
                    powtórzeń
                  </p>
                </div>
                <div className="text-3xl text-primary-200 opacity-60">×</div>
                <div>
                  <div className="text-4xl font-bold text-white leading-none mb-1">
                    {currentSet.weight}
                  </div>
                  <p className="text-xs text-primary-100 font-medium">kg</p>
                </div>
              </div>
              <p className="text-xs text-primary-50 font-medium opacity-90">
                Sugerowane
              </p>
            </div>

            {/* YouTube link */}
            {currentExercise.youtubeQuery && (
              <button
                onClick={() => {
                  window.open(
                    `https://www.youtube.com/results?search_query=${encodeURIComponent(currentExercise.youtubeQuery)}`,
                    "_blank",
                  );
                }}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 active:scale-95 text-white rounded-xl text-xs font-semibold transition-all duration-150 mb-2 shadow-md"
              >
                🎬 Tutorial
              </button>
            )}

            {/* User Notes */}
            <div className="mb-3">
              <label className="text-xs font-semibold text-neutral-700 mb-1 block">
                TWOJE NOTATKI
              </label>
              <textarea
                value={currentExercise.userNotes || ""}
                onChange={(e) =>
                  updateExerciseNotes(
                    day.id,
                    currentExercise.id,
                    e.target.value,
                  )
                }
                placeholder="Dodaj notatkę do tego ćwiczenia..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                rows={2}
              />
            </div>

            {/* Complete set button - WIĘKSZY */}
            <button
              onClick={handleSetComplete}
              className="w-full px-6 py-5 bg-green-600 hover:bg-green-700 active:bg-green-800 active:scale-[0.98] text-white rounded-xl font-bold text-lg transition-all duration-150 shadow-lg hover:shadow-xl"
            >
              ✓ Seria wykonana
            </button>
          </ContentContainer>
        ) : phase === "rest" ? (
          <>
            <RestTimer
              duration={currentExercise?.restSeconds || 90}
              onComplete={handleRestComplete}
              onSkip={handleSkipRest}
            />
          </>
        ) : phase === "complete" ? (
          <ContentContainer>
            <div className="flex flex-col items-center justify-center py-10">
              <div className="text-6xl mb-4 animate-pulse">🏆</div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2 text-center">
                Świetnie!
              </h2>
              <p className="text-neutral-700 text-center mb-8 text-sm leading-relaxed">
                Trening ukończony. Pamiętaj aby się odpoczyć.
              </p>
              <button
                onClick={() => {
                  localStorage.removeItem("silkoapp_workout_state");
                  onExit();
                }}
                className="px-8 py-3 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg"
              >
                Wróć do planu
              </button>
            </div>
          </ContentContainer>
        ) : null}
      </div>

      {/* Footer navigation */}
      {phase === "exercise" && (
        <div className="px-4 py-2 border-t border-neutral-100 flex items-center gap-3 bg-neutral-50">
          <button
            onClick={handlePrevExercise}
            disabled={exerciseIndex === 0}
            className="p-2 hover:bg-neutral-200 active:bg-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-colors text-neutral-900"
            aria-label="Previous exercise"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 text-center text-xs text-neutral-700 font-medium">
            {exerciseIndex + 1}/{totalExercises} • {setIndex + 1}/{totalSets}
          </div>

          <button
            onClick={handleNextExercise}
            disabled={exerciseIndex === totalExercises - 1}
            className="p-2 hover:bg-neutral-200 active:bg-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-colors text-neutral-900"
            aria-label="Next exercise"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
