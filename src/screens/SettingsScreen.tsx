import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Header, ContentContainer } from "../components/Layout";
import { ConfirmDialog } from "../components/Modal";
import { Download, Upload, RotateCcw, Sun } from "lucide-react";

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, resetProgress, currentPlan } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleExport = () => {
    const data = {
      plan: currentPlan,
      settings: settings,
      exportDate: new Date().toISOString(),
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `silkoapp-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.plan) {
          localStorage.setItem(
            "silkoapp_training_plan",
            JSON.stringify(data.plan),
          );
          alert("Dane zostały zaimportowane! Odśwież stronę.");
        }
      } catch {
        alert("Błąd przy imporcie pliku");
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Header title="Ustawienia" />

      <ContentContainer>
        {/* General Settings */}
        <h2 className="text-sm font-bold text-neutral-600 mb-3">OGÓLNE</h2>

        {/* Theme */}
        <div className="card p-4 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-neutral-600" />
              <div>
                <p className="font-medium text-neutral-900">Motyw</p>
                <p className="text-xs text-neutral-500">Jasny (domyślny)</p>
              </div>
            </div>
            <span className="text-sm font-medium text-neutral-600">Light</span>
          </div>
        </div>

        {/* Weight Unit */}
        <div className="card p-4 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-900">Jednostka wagi</p>
              <p className="text-xs text-neutral-500">
                Jednostka do wyświetlania
              </p>
            </div>
            <select
              value={settings.weightUnit}
              onChange={(e) =>
                updateSettings({ weightUnit: e.target.value as "kg" | "lbs" })
              }
              className="px-3 py-1.5 bg-neutral-100 border border-neutral-200 rounded text-sm font-medium"
            >
              <option value="kg">Kilogramy (kg)</option>
              <option value="lbs">Funty (lbs)</option>
            </select>
          </div>
        </div>

        {/* Language */}
        <div className="card p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-900">Język</p>
              <p className="text-xs text-neutral-500">Język aplikacji</p>
            </div>
            <select
              value={settings.language}
              onChange={(e) =>
                updateSettings({ language: e.target.value as "pl" | "en" })
              }
              className="px-3 py-1.5 bg-neutral-100 border border-neutral-200 rounded text-sm font-medium"
            >
              <option value="pl">Polski</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* Auto Suggest Weight */}
        <div className="card p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-900">
                Auto podpowiadanie ciężaru
              </p>
              <p className="text-xs text-neutral-500">Proponuj + 1-2 kg</p>
            </div>
            <button
              onClick={() =>
                updateSettings({
                  autoSuggestWeight: !settings.autoSuggestWeight,
                })
              }
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.autoSuggestWeight ? "bg-primary-500" : "bg-neutral-300"
              } relative`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.autoSuggestWeight ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Data Management */}
        <h2 className="text-sm font-bold text-neutral-600 mb-3">DANE</h2>

        {/* Export */}
        <button
          onClick={handleExport}
          className="w-full card p-4 mb-3 flex items-center justify-between hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-primary-600" />
            <div className="text-left">
              <p className="font-medium text-neutral-900">Eksportuj dane</p>
              <p className="text-xs text-neutral-500">
                Pobierz kopię zapasową (JSON)
              </p>
            </div>
          </div>
          <span className="text-neutral-400">→</span>
        </button>

        {/* Import */}
        <label className="w-full card p-4 mb-3 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Upload className="w-5 h-5 text-primary-600" />
            <div className="text-left">
              <p className="font-medium text-neutral-900">Importuj dane</p>
              <p className="text-xs text-neutral-500">
                Załaduj z kopii zapasowej
              </p>
            </div>
            <span className="text-neutral-400">→</span>
          </div>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>

        {/* Reset Progress */}
        <button
          onClick={() => setShowResetConfirm(true)}
          className="w-full card p-4 mb-6 flex items-center gap-3 hover:bg-red-50 transition-colors text-red-600"
        >
          <RotateCcw className="w-5 h-5" />
          <div className="text-left flex-1">
            <p className="font-medium">Resetuj postęp</p>
            <p className="text-xs text-red-500">
              Resetuj wszystkie ćwiczenia do początkowego stanu
            </p>
          </div>
          <span className="text-neutral-400">→</span>
        </button>

        {/* App Info */}
        <div className="card bg-neutral-100 p-4 text-center">
          <p className="text-xs text-neutral-600 mb-1">SilkoApp v1.0</p>
          <p className="text-xs text-neutral-500">
            Prywatna aplikacja treningowa PWA
          </p>
          <p className="text-xs text-neutral-400 mt-2">
            © 2026 - Offline Ready • {currentPlan.days.length} dni planu
          </p>
        </div>
      </ContentContainer>

      {/* Reset Confirm Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Resetuj postęp?"
        message="Czy na pewno chcesz zresetować wszystkie ćwiczenia? Tej akcji nie można cofnąć."
        confirmText="Resetuj"
        cancelText="Anuluj"
        isDestructive={true}
        onConfirm={() => {
          resetProgress();
          setShowResetConfirm(false);
          alert("Postęp został zresetowany!");
        }}
      />
    </>
  );
};
