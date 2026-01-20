import { useEffect, useRef, useState } from "react";
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
import { supabase } from "./lib/supabaseClient";
import { AuthScreen } from "./screens/AuthScreen";
import { runInitialSync } from "./utils/supabaseSync";
import type { Session } from "@supabase/supabase-js";
import type { TrainingDay } from "./types";

type Screen = "training" | "today" | "weekly" | "progress" | "settings";

function AppContent() {
  const app = useApp();
  const [currentScreen, setCurrentScreen] = useState<Screen>("training");
  const [selectedExercise, setSelectedExercise] = useState<{
    day: TrainingDay;
    exerciseId: string;
  } | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<TrainingDay | null>(null);
  const [showDaySelector, setShowDaySelector] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const syncRan = useRef(false);

  // Supabase auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setAuthChecked(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      },
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  // Jednorazowa synchronizacja danych po zalogowaniu
  useEffect(() => {
    if (!session || syncRan.current) return;
    syncRan.current = true;
    runInitialSync(session.user.id, app.currentPlan, app.replacePlan).catch(
      (err) => console.error("Supabase sync error", err),
    );
  }, [session, app.currentPlan, app.replacePlan]);

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

  if (!authChecked) {
    return null; // można dodać splash/loading
  }

  if (!session) {
    return <AuthScreen />;
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
