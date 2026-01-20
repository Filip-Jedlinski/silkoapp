import React, { useState } from "react";
import type { TrainingDay } from "../types";
import { Header, ContentContainer } from "../components/Layout";
import { useApp } from "../context/AppContext";

interface ExerciseDetailScreenProps {
  day: TrainingDay;
  exerciseId: string;
  onBack: () => void;
}

export const ExerciseDetailScreen: React.FC<ExerciseDetailScreenProps> = ({
  day,
  exerciseId,
  onBack,
}) => {
  const { completeExercise } = useApp();
  const exercise = day.exercises.find((e) => e.id === exerciseId);
  const [userNotes, setUserNotes] = useState(exercise?.userNotes || "");
  const [setIndex, setSetIndex] = useState(0);

  if (!exercise) return null;

  const currentSet = exercise.sets[setIndex];

  const handleComplete = () => {
    completeExercise(day.id, exercise.id);
  };

  return (
    <>
      <Header title={exercise.name} onBack={onBack} />

      <ContentContainer>
        {/* Exercise details */}
        <div className="card p-4 mb-4">
          <div className="space-y-3">
            {exercise.alternative && (
              <>
                <div>
                  <p className="text-xs font-bold text-neutral-600 mb-1">
                    ALTERNATYWA
                  </p>
                  <p className="text-sm text-neutral-700">
                    {exercise.alternative}
                  </p>
                </div>
              </>
            )}

            {exercise.targetMuscle && (
              <div>
                <p className="text-xs font-bold text-neutral-600 mb-1">
                  GRUPA MIĘŚNIOWA
                </p>
                <p className="text-sm text-neutral-700">
                  {exercise.targetMuscle}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sets navigation */}
        <h3 className="text-sm font-bold text-neutral-600 mb-2">
          SERIE ({setIndex + 1}/{exercise.sets.length})
        </h3>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {exercise.sets.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSetIndex(idx)}
              className={`px-3 py-2 rounded text-sm font-medium flex-shrink-0 transition-colors ${
                setIndex === idx
                  ? "bg-primary-500 text-white"
                  : "bg-neutral-200 text-neutral-700"
              }`}
            >
              Set {idx + 1}
            </button>
          ))}
        </div>

        {/* Current set details */}
        {currentSet && (
          <>
            <div className="card p-4 mb-4 bg-blue-50 border border-blue-200">
              <p className="text-xs font-bold text-blue-700 mb-2">
                SERIA {setIndex + 1}
              </p>
              <div className="flex items-baseline gap-4">
                <div>
                  <p className="text-2xl font-bold text-blue-900">
                    {currentSet.reps}
                  </p>
                  <p className="text-xs text-blue-700">powtórzeń</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900">
                    {currentSet.weight}
                  </p>
                  <p className="text-xs text-blue-700">kg</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Notes */}
        <h3 className="text-sm font-bold text-neutral-600 mb-2">NOTATKI</h3>
        <textarea
          value={userNotes}
          onChange={(e) => setUserNotes(e.target.value)}
          placeholder="Dodaj własne notatki, poczu lub obserwacje..."
          className="w-full p-3 border border-neutral-200 rounded-lg text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />

        {/* YouTube reference */}
        {exercise.youtubeQuery && (
          <div className="mt-6 card p-4 bg-red-50 border border-red-200">
            <p className="text-xs font-bold text-red-700 mb-2">TUTORIAL</p>
            <p className="text-sm text-red-900 mb-3">{exercise.youtubeQuery}</p>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.youtubeQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 font-medium text-sm hover:underline"
            >
              Szukaj na YouTube →
            </a>
          </div>
        )}

        {/* Complete button */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleComplete}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium transition-all duration-150 ${
              exercise.completed
                ? "bg-neutral-200 text-neutral-700"
                : "btn-primary"
            }`}
          >
            {exercise.completed ? "Anuluj" : "Wykonane"}
          </button>
        </div>

        {/* Status message */}
        {exercise.completed && (
          <div className="mt-4 card bg-green-50 border border-green-200 p-3 text-center">
            <p className="text-sm text-green-700 font-medium">
              ✓ Ćwiczenie wykonane!
            </p>
          </div>
        )}
      </ContentContainer>
    </>
  );
};
