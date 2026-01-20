import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Header, ContentContainer } from "../components/Layout";
import { StatsCard, ProgressBar } from "../components/UI";
import {
  TrendingUp,
  Award,
  Zap,
  Calendar,
  Plus,
  Scale,
  Ruler,
} from "lucide-react";
import type { BodyMeasurement } from "../types";

export const ProgressScreen: React.FC = () => {
  const { currentPlan } = useApp();
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>(() => {
    const saved = localStorage.getItem("silkoapp_body_measurements");
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate progress statistics
  const allExercises = currentPlan.days.flatMap((d) => d.exercises);
  const completedExercises = allExercises.filter((e) => e.completed);

  // Total stats - zliczanie serii i powtórzeń
  const totalSets = completedExercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
    0,
  );
  const totalReps = completedExercises.reduce(
    (sum, ex) =>
      sum +
      ex.sets.filter((s) => s.completed).reduce((rSum, s) => rSum + s.reps, 0),
    0,
  );
  const totalWeight = completedExercises.reduce(
    (sum, ex) =>
      sum +
      ex.sets
        .filter((s) => s.completed)
        .reduce((wSum, s) => wSum + s.weight * s.reps, 0),
    0,
  );

  const totalExercises = allExercises.length;
  const overallProgress =
    totalExercises > 0 ? (completedExercises.length / totalExercises) * 100 : 0;

  // Streak calculation
  const workoutDays = currentPlan.days.filter((d) =>
    d.exercises.some((e) => e.completed),
  ).length;

  // Group exercises by muscle group
  const exercisesByMuscle = allExercises.reduce(
    (acc, ex) => {
      const key = ex.targetMuscle;
      if (!acc[key]) acc[key] = [];
      acc[key].push(ex);
      return acc;
    },
    {} as Record<string, typeof allExercises>,
  );

  // Get top exercises by weight
  const topExercises = allExercises
    .map((e) => ({
      ...e,
      maxWeight: Math.max(...e.sets.map((s) => s.weight), 0),
    }))
    .filter((e) => e.maxWeight > 0)
    .sort((a, b) => b.maxWeight - a.maxWeight)
    .slice(0, 5);

  const saveMeasurement = (measurement: Omit<BodyMeasurement, "id">) => {
    const newMeasurement: BodyMeasurement = {
      ...measurement,
      id: Date.now().toString(),
    };
    const updated = [newMeasurement, ...measurements];
    setMeasurements(updated);
    localStorage.setItem("silkoapp_body_measurements", JSON.stringify(updated));
    setShowMeasurementForm(false);
  };

  const latestMeasurement = measurements[0];

  return (
    <>
      <Header title="Postęp" />

      <ContentContainer>
        {/* Workout Stats - NOWE LICZNIKI */}
        <h2 className="text-sm font-bold text-neutral-600 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          STATYSTYKI TRENINGOWE
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
          <StatsCard
            label="Serie"
            value={totalSets}
            icon={<Award className="w-5 h-5" />}
            className="bg-gradient-to-br from-primary-50 to-primary-100 transition-all hover:scale-105 active:scale-95"
          />
          <StatsCard
            label="Powtórzenia"
            value={totalReps}
            icon={<TrendingUp className="w-5 h-5" />}
            className="bg-gradient-to-br from-green-50 to-green-100 transition-all hover:scale-105 active:scale-95"
          />
          <StatsCard
            label="Podniesione"
            value={`${Math.round(totalWeight)}`}
            unit="kg"
            icon={<Scale className="w-5 h-5" />}
            className="bg-gradient-to-br from-orange-50 to-orange-100 transition-all hover:scale-105 active:scale-95"
          />
          <StatsCard
            label="Dni treningowe"
            value={workoutDays}
            unit={`/ ${currentPlan.days.length}`}
            icon={<Calendar className="w-5 h-5" />}
            className="bg-gradient-to-br from-purple-50 to-purple-100 transition-all hover:scale-105 active:scale-95"
          />
        </div>

        <div className="card p-4 mb-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white animate-scaleIn">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Postęp treningu</h3>
            <span className="text-2xl font-bold">
              {Math.round(overallProgress)}%
            </span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-xs text-primary-100 mt-2">
            {completedExercises.length} / {totalExercises} ćwiczeń ukończonych
          </p>
        </div>

        {/* Body Measurements - NOWA SEKCJA */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-neutral-600 flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            POMIARY CIAŁA
          </h2>
          <button
            onClick={() => setShowMeasurementForm(!showMeasurementForm)}
            className="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 hover:shadow-lg"
          >
            <Plus className="w-3 h-3" />
            Dodaj
          </button>
        </div>

        {/* Measurement Form */}
        {showMeasurementForm && (
          <div className="card p-4 mb-4 border-2 border-primary-500 animate-slideUp">
            <h3 className="font-bold text-neutral-900 mb-3">Nowy pomiar</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                saveMeasurement({
                  date: new Date().toISOString(),
                  weight: Number(formData.get("weight")),
                  height: formData.get("height")
                    ? Number(formData.get("height"))
                    : undefined,
                  bodyFat: formData.get("bodyFat")
                    ? Number(formData.get("bodyFat"))
                    : undefined,
                  measurements: {
                    chest: formData.get("chest")
                      ? Number(formData.get("chest"))
                      : undefined,
                    waist: formData.get("waist")
                      ? Number(formData.get("waist"))
                      : undefined,
                    arms: formData.get("arms")
                      ? Number(formData.get("arms"))
                      : undefined,
                  },
                  notes: (formData.get("notes") as string) || undefined,
                });
              }}
            >
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Waga (kg) *
                  </label>
                  <input
                    type="number"
                    name="weight"
                    step="0.1"
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="75.5"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Wzrost (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="180"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Tłuszcz (%)
                </label>
                <input
                  type="number"
                  name="bodyFat"
                  step="0.1"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="15.5"
                />
              </div>

              <div className="border-t border-neutral-200 pt-3 mb-3">
                <p className="text-xs font-semibold text-neutral-700 mb-2">
                  Obwody ciała (cm)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    name="chest"
                    className="px-2 py-1.5 border border-neutral-300 rounded text-xs focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="Klatka"
                  />
                  <input
                    type="number"
                    name="waist"
                    className="px-2 py-1.5 border border-neutral-300 rounded text-xs focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="Talia"
                  />
                  <input
                    type="number"
                    name="arms"
                    className="px-2 py-1.5 border border-neutral-300 rounded text-xs focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="Ramiona"
                  />
                </div>
              </div>

              <textarea
                name="notes"
                placeholder="Notatki (opcjonalnie)"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs mb-3 resize-none focus:ring-2 focus:ring-primary-500 transition-all"
                rows={2}
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-semibold transition-all active:scale-95 hover:shadow-lg"
                >
                  Zapisz
                </button>
                <button
                  type="button"
                  onClick={() => setShowMeasurementForm(false)}
                  className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg text-sm font-semibold transition-all active:scale-95"
                >
                  Anuluj
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Latest Measurement */}
        {latestMeasurement && (
          <div className="card p-4 mb-4 bg-gradient-to-br from-neutral-50 to-neutral-100 animate-fadeIn">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-neutral-900">Ostatni pomiar</h3>
                <p className="text-xs text-neutral-600">
                  {new Date(latestMeasurement.date).toLocaleDateString("pl-PL")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-600">
                  {latestMeasurement.weight} kg
                </p>
                {latestMeasurement.bodyFat && (
                  <p className="text-xs text-neutral-600">
                    {latestMeasurement.bodyFat}% tłuszczu
                  </p>
                )}
              </div>
            </div>
            {latestMeasurement.measurements && (
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-200">
                {latestMeasurement.measurements.chest && (
                  <div className="text-center">
                    <p className="text-xs text-neutral-600">Klatka</p>
                    <p className="font-bold text-neutral-900">
                      {latestMeasurement.measurements.chest} cm
                    </p>
                  </div>
                )}
                {latestMeasurement.measurements.waist && (
                  <div className="text-center">
                    <p className="text-xs text-neutral-600">Talia</p>
                    <p className="font-bold text-neutral-900">
                      {latestMeasurement.measurements.waist} cm
                    </p>
                  </div>
                )}
                {latestMeasurement.measurements.arms && (
                  <div className="text-center">
                    <p className="text-xs text-neutral-600">Ramiona</p>
                    <p className="font-bold text-neutral-900">
                      {latestMeasurement.measurements.arms} cm
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Measurement History */}
        {measurements.length > 1 && (
          <>
            <h3 className="text-sm font-bold text-neutral-600 mb-3">
              HISTORIA POMIARÓW
            </h3>
            <div className="space-y-2 mb-6">
              {measurements.slice(1, 6).map((m) => (
                <div
                  key={m.id}
                  className="card p-3 flex justify-between items-center transition-all hover:shadow-md"
                >
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">
                      {m.weight} kg
                    </p>
                    <p className="text-xs text-neutral-600">
                      {new Date(m.date).toLocaleDateString("pl-PL")}
                    </p>
                  </div>
                  {m.bodyFat && (
                    <span className="text-xs font-semibold text-primary-600">
                      {m.bodyFat}% BF
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {measurements.length === 0 && !showMeasurementForm && (
          <div className="card p-6 text-center mb-6 animate-fadeIn">
            <Scale className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
            <p className="text-neutral-600 text-sm mb-3">Brak pomiarów ciała</p>
            <button
              onClick={() => setShowMeasurementForm(true)}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-semibold transition-all active:scale-95 hover:shadow-lg"
            >
              Dodaj pierwszy pomiar
            </button>
          </div>
        )}

        {/* Muscle group breakdown */}
        <h2 className="text-sm font-bold text-neutral-600 mb-3 mt-6">
          PO GRUPACH MIĘŚNIOWYCH
        </h2>
        <div className="space-y-3">
          {Object.entries(exercisesByMuscle).map(([muscle, exercises]) => {
            const completed = exercises.filter((e) => e.completed).length;
            const percentage = (completed / exercises.length) * 100;
            return (
              <div key={muscle} className="card p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-neutral-900">{muscle}</h3>
                  <span className="text-sm font-bold text-primary-600">
                    {Math.round(percentage)}%
                  </span>
                </div>
                <ProgressBar progress={percentage} />
                <p className="text-xs text-neutral-500 mt-2">
                  {completed} / {exercises.length} ćwiczeń
                </p>
              </div>
            );
          })}
        </div>

        {/* Top lifts */}
        {topExercises.length > 0 && (
          <>
            <h2 className="text-sm font-bold text-neutral-600 mb-3 mt-6">
              TOP CIĘŻARY
            </h2>
            <div className="space-y-2">
              {topExercises.map((exercise, idx) => (
                <div
                  key={exercise.id}
                  className="card p-4 flex items-center gap-3"
                >
                  <div className="bg-primary-100 text-primary-600 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 truncate">
                      {exercise.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {exercise.sets.length} sets
                    </p>
                  </div>
                  <p className="font-bold text-neutral-900">
                    {exercise.maxWeight} kg
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Motivational message */}
        <div className="mt-6 card bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-4 text-center">
          <p className="text-sm font-medium text-neutral-700">
            💪 Pamiętaj: Konsystencja to klucz do osiągnięcia sukcesu!
          </p>
        </div>
      </ContentContainer>
    </>
  );
};
