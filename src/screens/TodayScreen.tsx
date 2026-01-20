import React from "react";
import { useApp } from "../context/AppContext";
import { Header, ContentContainer } from "../components/Layout";
import { ExerciseCard } from "../components/ExerciseCard";
import { ProgressBar, StatsCard } from "../components/UI";
import type { TrainingDay } from "../types";
import { Calendar, Zap } from "lucide-react";

interface TodayScreenProps {
  onExerciseSelect?: (day: TrainingDay, exerciseId: string) => void;
  onStartWorkout?: () => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  onExerciseSelect,
  onStartWorkout,
}) => {
  const { currentPlan, completeExercise } = useApp();

  // Use first day by default (no calendar mapping)
  const todayPlan = currentPlan.days[0];
  const allExercises = todayPlan?.exercises || [];
  const completedExercises = allExercises.filter((e) => e.completed).length;
  const progress =
    allExercises.length > 0
      ? (completedExercises / allExercises.length) * 100
      : 0;

  return (
    <>
      <Header
        title="Dzisiaj"
        subtitle={todayPlan?.name || "Trening"}
        actions={
          <div className="text-right">
            <p className="text-xs text-neutral-500">Dzisiaj</p>
            <p className="text-sm font-bold text-neutral-900">
              {new Date().toLocaleDateString("pl-PL", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        }
      />

      <ContentContainer>
        {todayPlan ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6 animate-fadeIn">
              <StatsCard
                label="Wykonanych"
                value={completedExercises}
                unit={`/ ${allExercises.length}`}
                icon={<Zap className="w-5 h-5" />}
              />
              <StatsCard
                label="Postęp"
                value={`${Math.round(progress)}%`}
                icon={<Calendar className="w-5 h-5" />}
              />
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <ProgressBar progress={progress} showLabel={true} />
            </div>

            {/* Exercises */}
            <h2 className="text-sm font-bold text-neutral-600 mb-3">
              ĆWICZENIA
            </h2>
            <div>
              {allExercises.length > 0 ? (
                allExercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onComplete={() =>
                      completeExercise(todayPlan.id, exercise.id)
                    }
                    showDetail={true}
                    onClick={() => {
                      if (onExerciseSelect) {
                        onExerciseSelect(todayPlan, exercise.id);
                      }
                    }}
                  />
                ))
              ) : (
                <div className="card p-6 text-center">
                  <p className="text-neutral-500">Brak ćwiczeń na dzisiaj 🎉</p>
                  <p className="text-sm text-neutral-400 mt-1">
                    Dzień przerwy - regeneruj się!
                  </p>
                </div>
              )}
            </div>

            {/* Motivational message */}
            {progress === 100 && allExercises.length > 0 && (
              <div className="mt-6 card bg-green-50 border border-green-200 p-4 text-center animate-scaleIn">
                <p className="font-bold text-green-700">🏆 Doskonale!</p>
                <p className="text-sm text-green-600 mt-1">
                  Ukończyłeś dzisiaj wszystkie ćwiczenia!
                </p>
              </div>
            )}

            {/* Start workout button */}
            {todayPlan && allExercises.length > 0 && (
              <button
                onClick={() => onStartWorkout?.()}
                className="w-full mt-6 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-bold transition-colors active:scale-95"
              >
                🏃 Rozpocznij trening
              </button>
            )}
          </>
        ) : (
          <div className="card p-6 text-center">
            <p className="text-neutral-500">Brak planu na dzisiaj</p>
            <p className="text-sm text-neutral-400 mt-1">
              Przejdź do planu, aby zobaczyć całą podział
            </p>
          </div>
        )}
      </ContentContainer>
    </>
  );
};
