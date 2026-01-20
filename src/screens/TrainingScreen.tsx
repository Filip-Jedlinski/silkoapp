import React from "react";
import { Header, ContentContainer } from "../components/Layout";
import { Dumbbell, ArrowRight } from "lucide-react";

interface TrainingScreenProps {
  onStartWorkout?: () => void;
}

export const TrainingScreen: React.FC<TrainingScreenProps> = ({
  onStartWorkout,
}) => {
  return (
    <>
      <Header title="Trening" subtitle="Przygotuj się do ćwiczeń" />

      <ContentContainer>
        {/* Big CTA Button */}
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-8 p-6 bg-primary-50 rounded-3xl">
            <Dumbbell className="w-16 h-16 text-primary-500" />
          </div>

          <h2 className="text-3xl font-bold text-neutral-900 mb-2 text-center">
            Gotowy na trening?
          </h2>
          <p className="text-neutral-600 text-center mb-12 max-w-xs leading-relaxed">
            Wybierz dzień z planu treningowego i zacznij ćwiczyć.
          </p>

          <button
            onClick={() => onStartWorkout?.()}
            className="w-full max-w-xs px-8 py-5 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-2xl font-bold text-lg transition-colors shadow-lg flex items-center justify-center gap-3"
          >
            <span>Rozpocznij trening</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Info cards */}
        <div className="space-y-3 mt-8">
          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl">
            <p className="text-xs font-semibold text-neutral-700 mb-1 tracking-wide">
              💪 TRENINGOWY PLAN
            </p>
            <p className="text-sm text-neutral-600">
              Wybierz dzień z 4-dniowego cyklu Push/Pull/Legs.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl">
            <p className="text-xs font-semibold text-neutral-700 mb-1 tracking-wide">
              ⏱️ TEMPO WŁASNE
            </p>
            <p className="text-sm text-neutral-600">
              Trenuj w swoim tempie z automatyczną obsługą czasu odpoczynku.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl">
            <p className="text-xs font-semibold text-neutral-700 mb-1 tracking-wide">
              📊 ŚLEDZENIE POSTĘPU
            </p>
            <p className="text-sm text-neutral-600">
              Obserwuj postęp i dopasowuj obciążenia dla każdego ćwiczenia.
            </p>
          </div>
        </div>
      </ContentContainer>
    </>
  );
};
