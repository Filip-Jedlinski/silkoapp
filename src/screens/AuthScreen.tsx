import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const OWNER_EMAIL =
  import.meta.env.VITE_SUPABASE_OWNER_EMAIL || "owner@local.silownia";

interface AuthScreenProps {
  onLogin?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: OWNER_EMAIL,
      password,
    });
    setLoading(false);
    if (error) {
      setError("Błędne hasło");
      return;
    }
    setPassword("");
    onLogin?.();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-neutral-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-sm border border-neutral-100 animate-scaleIn">
        <h1 className="text-xl font-bold text-neutral-900 mb-4 text-center">
          SilkoApp
        </h1>
        <p className="text-sm text-neutral-600 mb-6 text-center">
          Wpisz swoje hasło, aby odblokować aplikację
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Hasło
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold text-sm transition-all active:scale-95 disabled:opacity-60"
          >
            {loading ? "Logowanie..." : "Zaloguj"}
          </button>
        </form>
        <p className="text-[11px] text-neutral-500 mt-4 text-center">
          E-mail ukryty, używamy tylko hasła właściciela
        </p>
      </div>
    </div>
  );
};
