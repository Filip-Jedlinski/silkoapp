import { useState } from "react";
import "./App.css";
import { Layout } from "./components/Layout";
import { BottomNav, getNavItems } from "./components/BottomNav";
import { TrainingScreen } from "./screens/TrainingScreen";
import { TodayScreen } from "./screens/TodayScreen";
import { WeeklyScreen } from "./screens/WeeklyScreen";
import { ProgressScreen } from "./screens/ProgressScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { ExerciseDetailScreen } from "./screens/ExerciseDetailScreen";
import { WorkoutModeScreen } from "./screens/WorkoutModeScreen";
import { DaySelectorScreen } from "./screens/DaySelectorScreen";
import { AppProvider, useApp } from "./context/AppContext";
import { AuthScreen } from "./screens/AuthScreen";
import type { TrainingDay } from "./types";

type Screen = "training" | "today" | "weekly" | "progress" | "settings";

function AppContent() {
  useApp();
  const [currentScreen, setCurrentScreen] = useState<Screen>("training");
  const [selectedExercise, setSelectedExercise] = useState<{
    day: TrainingDay;
    exerciseId: string;
  } | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<TrainingDay | null>(null);
  const [showDaySelector, setShowDaySelector] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("silkoapp_authenticated") === "true";
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleExerciseSelect = (day: TrainingDay, exerciseId: string) => {
    setSelectedExercise({ day, exerciseId });
  };

  const handleBackFromExercise = () => {
    setSelectedExercise(null);
  };

  const handleStartWorkout = () => {
    setShowDaySelector(true);
  };

  const handleSelectDay = (day: TrainingDay) => {
    setActiveWorkout(day);
    setShowDaySelector(false);
  };

  const handleExitWorkout = () => {
    setActiveWorkout(null);
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const renderScreen = () => {
    if (showDaySelector) {
      return <DaySelectorScreen onDaySelect={handleSelectDay} />;
    }

    if (activeWorkout) {
      return (
        <WorkoutModeScreen day={activeWorkout} onExit={handleExitWorkout} />
      );
    }

    if (selectedExercise) {
      return (
        <ExerciseDetailScreen
          day={selectedExercise.day}
          exerciseId={selectedExercise.exerciseId}
          onBack={handleBackFromExercise}
        />
      );
    }

    switch (currentScreen) {
      case "training":
        return <TrainingScreen onStartWorkout={handleStartWorkout} />;
      case "today":
        return (
          <TodayScreen
            onExerciseSelect={handleExerciseSelect}
            onStartWorkout={handleStartWorkout}
          />
        );
      case "weekly":
        return <WeeklyScreen onExerciseSelect={handleExerciseSelect} />;
      case "progress":
        return <ProgressScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return <TrainingScreen onStartWorkout={handleStartWorkout} />;
    }
  };

  const navItems = getNavItems(
    currentScreen,
    setCurrentScreen as (screen: string) => void,
  );

  return (
    <Layout>
      {renderScreen()}
      {!activeWorkout && <BottomNav items={navItems} />}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
