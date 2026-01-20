import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { WeeklyPlan, DayMeals, AppSettings, Meal } from "../types";
import { DEFAULT_TRAINING_PLAN, DEFAULT_MEALS } from "../data/defaultData";

interface AppContextType {
  currentPlan: WeeklyPlan;
  todayMeals: DayMeals;
  settings: AppSettings;
  updateExerciseWeight: (
    dayId: string,
    exerciseId: string,
    setIndex: number,
    weight: number,
  ) => void;
  updateExerciseReps: (
    dayId: string,
    exerciseId: string,
    setIndex: number,
    reps: number,
  ) => void;
  completeExercise: (dayId: string, exerciseId: string) => void;
  completeSet: (dayId: string, exerciseId: string, setIndex: number) => void;
  updateExerciseNotes: (
    dayId: string,
    exerciseId: string,
    notes: string,
  ) => void;
  replacePlan: (plan: WeeklyPlan) => void;
  updatePlan: (plan: WeeklyPlan) => void;
  resetProgress: () => void;
  saveMealState: (meals: Meal[]) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PLAN = "silkoapp_training_plan";
const STORAGE_KEY_MEALS = "silkoapp_meals";
const STORAGE_KEY_SETTINGS = "silkoapp_settings";

const DEFAULT_SETTINGS: AppSettings = {
  theme: "light",
  notifications: false,
  autoSuggestWeight: true,
  weightUnit: "kg",
  language: "pl",
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentPlan, setCurrentPlan] = useState<WeeklyPlan>(
    DEFAULT_TRAINING_PLAN,
  );
  const [todayMeals, setTodayMeals] = useState<DayMeals>({
    date: new Date().toISOString().split("T")[0],
    meals: DEFAULT_MEALS,
  });
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      // Load plan
      const savedPlan = localStorage.getItem(STORAGE_KEY_PLAN);
      if (savedPlan) {
        try {
          const parsed = JSON.parse(savedPlan);
          // Check if plan structure changed (e.g., different number of days)
          if (
            parsed.days &&
            parsed.days.length === DEFAULT_TRAINING_PLAN.days.length
          ) {
            setCurrentPlan(parsed);
          } else {
            // Plan structure changed, reset to default
            localStorage.removeItem(STORAGE_KEY_PLAN);
            setCurrentPlan(DEFAULT_TRAINING_PLAN);
          }
        } catch (error) {
          console.error("Error loading plan:", error);
        }
      }

      // Load meals
      const savedMeals = localStorage.getItem(STORAGE_KEY_MEALS);
      if (savedMeals) {
        try {
          const parsed = JSON.parse(savedMeals);
          // Check if it's today's meals
          if (parsed.date === new Date().toISOString().split("T")[0]) {
            setTodayMeals(parsed);
          } else {
            // Reset for new day
            setTodayMeals({
              date: new Date().toISOString().split("T")[0],
              meals: DEFAULT_MEALS.map((m) => ({ ...m, eaten: false })),
            });
          }
        } catch (error) {
          console.error("Error loading meals:", error);
        }
      }

      // Load settings
      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (savedSettings) {
        try {
          setSettings(JSON.parse(savedSettings));
        } catch (error) {
          console.error("Error loading settings:", error);
        }
      }
    };

    loadData();
  }, []);

  const updateExerciseWeight = (
    dayId: string,
    exerciseId: string,
    setIndex: number,
    weight: number,
  ) => {
    const updatedPlan = { ...currentPlan };
    const day = updatedPlan.days.find((d) => d.id === dayId);
    if (day) {
      const exercise = day.exercises.find((e) => e.id === exerciseId);
      if (exercise && exercise.sets[setIndex]) {
        exercise.sets[setIndex].weight = weight;
        exercise.lastUpdated = new Date().toISOString();
        setCurrentPlan(updatedPlan);
        localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(updatedPlan));
      }
    }
  };

  const updateExerciseReps = (
    dayId: string,
    exerciseId: string,
    setIndex: number,
    reps: number,
  ) => {
    const updatedPlan = { ...currentPlan };
    const day = updatedPlan.days.find((d) => d.id === dayId);
    if (day) {
      const exercise = day.exercises.find((e) => e.id === exerciseId);
      if (exercise && exercise.sets[setIndex]) {
        exercise.sets[setIndex].reps = reps;
        exercise.lastUpdated = new Date().toISOString();
        setCurrentPlan(updatedPlan);
        localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(updatedPlan));
      }
    }
  };

  const completeSet = (dayId: string, exerciseId: string, setIndex: number) => {
    const updatedPlan = { ...currentPlan };
    const day = updatedPlan.days.find((d) => d.id === dayId);
    if (day) {
      const exercise = day.exercises.find((e) => e.id === exerciseId);
      if (exercise && exercise.sets[setIndex]) {
        exercise.sets[setIndex].completed = true;
        exercise.lastUpdated = new Date().toISOString();

        // Mark exercise as completed if all sets are done
        const allCompleted = exercise.sets.every((s) => s.completed);
        if (allCompleted) {
          exercise.completed = true;
        }

        setCurrentPlan(updatedPlan);
        localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(updatedPlan));
      }
    }
  };

  const completeExercise = (dayId: string, exerciseId: string) => {
    const updatedPlan = { ...currentPlan };
    const day = updatedPlan.days.find((d) => d.id === dayId);
    if (day) {
      const exercise = day.exercises.find((e) => e.id === exerciseId);
      if (exercise) {
        exercise.completed = !exercise.completed;
        setCurrentPlan(updatedPlan);
        localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(updatedPlan));
      }
    }
  };

  const updateExerciseNotes = (
    dayId: string,
    exerciseId: string,
    notes: string,
  ) => {
    const updatedPlan = { ...currentPlan };
    const day = updatedPlan.days.find((d) => d.id === dayId);
    if (day) {
      const exercise = day.exercises.find((e) => e.id === exerciseId);
      if (exercise) {
        exercise.userNotes = notes;
        exercise.lastUpdated = new Date().toISOString();
        setCurrentPlan(updatedPlan);
        localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(updatedPlan));
      }
    }
  };

  const updatePlan = (plan: WeeklyPlan) => {
    setCurrentPlan(plan);
    localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(plan));
  };

  // Pozwala zewnętrznym integracjom (np. Supabase) podmienić cały plan
  const replacePlan = (plan: WeeklyPlan) => {
    setCurrentPlan(plan);
    localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(plan));
  };

  const resetProgress = () => {
    const resetPlan = JSON.parse(JSON.stringify(DEFAULT_TRAINING_PLAN));
    setCurrentPlan(resetPlan);
    localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(resetPlan));
  };

  const saveMealState = (meals: Meal[]) => {
    const updatedMeals: DayMeals = {
      date: new Date().toISOString().split("T")[0],
      meals,
    };
    setTodayMeals(updatedMeals);
    localStorage.setItem(STORAGE_KEY_MEALS, JSON.stringify(updatedMeals));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
  };

  return (
    <AppContext.Provider
      value={{
        currentPlan,
        todayMeals,
        settings,
        updateExerciseWeight,
        updateExerciseReps,
        completeSet,
        completeExercise,
        updateExerciseNotes,
        replacePlan,
        updatePlan,
        resetProgress,
        saveMealState,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
