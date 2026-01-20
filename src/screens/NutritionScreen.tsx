import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Header, ContentContainer } from "../components/Layout";
import type { Meal } from "../types";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";

export const NutritionScreen: React.FC = () => {
  const { todayMeals, saveMealState } = useApp();
  const [meals, setMeals] = useState<Meal[]>(todayMeals.meals);

  const toggleMeal = (mealId: string) => {
    const updated = meals.map((m) =>
      m.id === mealId
        ? {
            ...m,
            eaten: !m.eaten,
            eatenDate: !m.eaten ? new Date().toISOString() : undefined,
          }
        : m,
    );
    setMeals(updated);
    saveMealState(updated);
  };

  const deleteMeal = (mealId: string) => {
    const updated = meals.filter((m) => m.id !== mealId);
    setMeals(updated);
    saveMealState(updated);
  };

  const eatenMeals = meals.filter((m) => m.eaten);
  const totalCalories = eatenMeals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = eatenMeals.reduce((sum, m) => sum + m.protein, 0);

  const getMealTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      breakfast: "🥞 Śniadanie",
      lunch: "🍗 Obiad",
      dinner: "🍽️ Kolacja",
      snack: "🍌 Przekąska",
    };
    return labels[type] || type;
  };

  return (
    <>
      <Header title="Jedzenie" subtitle="Dzisiaj" />

      <ContentContainer>
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card p-4 text-center">
            <p className="text-xs text-neutral-500 mb-1">Kalorie</p>
            <p className="text-2xl font-bold text-neutral-900">
              {totalCalories}
            </p>
            <p className="text-xs text-neutral-400 mt-1">kcal</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-xs text-neutral-500 mb-1">Białko</p>
            <p className="text-2xl font-bold text-neutral-900">
              {totalProtein}
            </p>
            <p className="text-xs text-neutral-400 mt-1">g</p>
          </div>
        </div>

        {/* Meals by type */}
        {["breakfast", "lunch", "dinner", "snack"].map((mealType) => {
          const typeMeals = meals.filter((m) => m.type === mealType);
          if (typeMeals.length === 0) return null;

          return (
            <div key={mealType} className="mb-4">
              <h3 className="text-sm font-bold text-neutral-600 mb-2">
                {getMealTypeLabel(mealType)}
              </h3>
              <div className="space-y-2">
                {typeMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className={`card p-3 flex items-center gap-3 ${
                      meal.eaten ? "bg-green-50 border border-green-200" : ""
                    }`}
                  >
                    <button
                      onClick={() => toggleMeal(meal.id)}
                      className="flex-shrink-0"
                    >
                      {meal.eaten ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-neutral-300" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium text-neutral-900 truncate ${
                          meal.eaten ? "line-through text-neutral-500" : ""
                        }`}
                      >
                        {meal.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {meal.calories} kcal • {meal.protein}g protein
                      </p>
                    </div>

                    <button
                      onClick={() => deleteMeal(meal.id)}
                      className="btn-icon flex-shrink-0 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Add meal button */}
        <button className="w-full mt-4 card p-4 text-center text-primary-600 font-medium hover:bg-primary-50 transition-colors">
          + Dodaj posiłek
        </button>

        {/* Motivation */}
        <div className="mt-6 card bg-blue-50 border border-blue-200 p-4">
          <p className="text-sm text-blue-900 font-medium">
            🥗 Zajady są ważne, ale pamiętaj: jedzenie jest fuelem dla mięśni!
          </p>
        </div>
      </ContentContainer>
    </>
  );
};
