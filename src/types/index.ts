// Types dla aplikacji SilkoApp

export interface ExerciseSet {
  reps: number;
  weight: number;
  completed?: boolean;
  actualReps?: number;
  actualWeight?: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
  restSeconds: number;
  alternative: string;
  youtubeQuery: string;
  targetMuscle: string;
  userNotes?: string;
  completed: boolean;
  lastUpdated: string;
}

export interface TrainingDay {
  id: string;
  name: string;
  exercises: Exercise[];
  completed: boolean;
  completedDate?: string;
}

export interface WeeklyPlan {
  id: string;
  name: string;
  days: TrainingDay[];
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  eaten: boolean;
  eatenDate?: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
}

export interface DayMeals {
  date: string;
  meals: Meal[];
}

export interface Progress {
  exerciseId: string;
  exerciseName: string;
  history: ProgressEntry[];
  isPersonalRecord: boolean;
}

export interface ProgressEntry {
  date: string;
  weight: number;
  sets: number;
  reps: number;
  notes: string;
}

export interface AppState {
  currentPlan: WeeklyPlan;
  todayProgress: Progress[];
  allProgress: Map<string, Progress>;
  todayMeals: DayMeals;
  settings: AppSettings;
}

export interface AppSettings {
  theme: "light" | "dark";
  notifications: boolean;
  autoSuggestWeight: boolean;
  weightUnit: "kg" | "lbs";
  language: "pl" | "en";
}

export interface BodyMeasurement {
  id: string;
  date: string; // ISO date
  weight: number; // kg
  height?: number; // cm
  bodyFat?: number; // %
  measurements?: {
    chest?: number; // cm
    waist?: number; // cm
    hips?: number; // cm
    arms?: number; // cm
    thighs?: number; // cm
  };
  notes?: string;
}

export interface WorkoutStats {
  totalSets: number;
  totalReps: number;
  totalWeight: number; // kg lifted total
  workoutDays: number;
  currentStreak: number;
  longestStreak: number;
}
