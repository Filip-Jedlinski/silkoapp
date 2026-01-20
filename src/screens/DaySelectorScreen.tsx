import React from "react";
import { useApp } from "../context/AppContext";
import { Header, ContentContainer } from "../components/Layout";
import type { TrainingDay } from "../types";

interface DaySelectorScreenProps {
  onDaySelect: (day: TrainingDay) => void;
}

export const DaySelectorScreen: React.FC<DaySelectorScreenProps> = ({
  onDaySelect,
}) => {
  const { currentPlan } = useApp();

  return (
    <>
      <Header
        title="Wybierz trening"
        subtitle="Który plan chcesz wykonać dzisiaj?"
      />

      <ContentContainer>
        <div className="space-y-2 mb-8">
          {currentPlan.days.map((day) => {
            const estimatedMinutes = Math.ceil(
              (day.exercises.reduce((sum, ex) => sum + ex.sets.length * 3, 0) /
                60) *
                15,
            );

            return (
              <button
                key={day.id}
                onClick={() => onDaySelect(day)}
                className="w-full p-5 text-left bg-white hover:bg-neutral-50 active:bg-neutral-100 transition-all duration-100 border border-neutral-300 hover:border-neutral-400 rounded-2xl"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-base font-semibold text-neutral-900 mb-1">
                      {day.name}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {day.exercises.length} ćwiczeń • {estimatedMinutes} min
                    </div>
                  </div>
                  <div className="ml-4 text-neutral-400 text-lg">→</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Info box - Apple style */}
        <div className="px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl">
          <p className="text-xs font-medium text-neutral-600 tracking-wide">
            💪 WSKAZÓWKA
          </p>
          <p className="text-sm text-neutral-700 mt-2">
            Możesz wybrać dowolny dzień niezależnie od harmonogramu.
          </p>
        </div>
      </ContentContainer>
    </>
  );
};
