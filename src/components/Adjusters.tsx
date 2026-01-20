import React from "react";
import { Plus, Minus } from "lucide-react";

interface WeightAdjusterProps {
  weight: number;
  onWeightChange: (weight: number) => void;
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
}

export const WeightAdjuster: React.FC<WeightAdjusterProps> = ({
  weight,
  onWeightChange,
  step = 2.5,
  min = 0,
  max = 500,
  unit = "kg",
}) => {
  return (
    <div className="flex items-center gap-3 bg-neutral-50 p-3 rounded-lg">
      <button
        onClick={() => onWeightChange(Math.max(min, weight - step))}
        className="btn-secondary p-2"
        disabled={weight <= min}
      >
        <Minus className="w-5 h-5" />
      </button>

      <div className="text-center flex-1">
        <p className="text-2xl font-bold text-neutral-900">{weight}</p>
        <p className="text-xs text-neutral-500">{unit}</p>
      </div>

      <button
        onClick={() => onWeightChange(Math.min(max, weight + step))}
        className="btn-secondary p-2"
        disabled={weight >= max}
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};

interface RepsAdjusterProps {
  sets: number;
  reps: number;
  onSetsChange: (sets: number) => void;
  onRepsChange: (reps: number) => void;
}

export const RepsAdjuster: React.FC<RepsAdjusterProps> = ({
  sets,
  reps,
  onSetsChange,
  onRepsChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-neutral-50 p-3 rounded-lg">
        <p className="text-xs text-neutral-500 mb-2">Serie</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSetsChange(Math.max(1, sets - 1))}
            className="btn-secondary p-1 text-sm"
          >
            −
          </button>
          <span className="text-xl font-bold w-8 text-center">{sets}</span>
          <button
            onClick={() => onSetsChange(sets + 1)}
            className="btn-secondary p-1 text-sm"
          >
            +
          </button>
        </div>
      </div>

      <div className="bg-neutral-50 p-3 rounded-lg">
        <p className="text-xs text-neutral-500 mb-2">Powtórzenia</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onRepsChange(Math.max(1, reps - 1))}
            className="btn-secondary p-1 text-sm"
          >
            −
          </button>
          <span className="text-xl font-bold w-8 text-center">{reps}</span>
          <button
            onClick={() => onRepsChange(reps + 1)}
            className="btn-secondary p-1 text-sm"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
