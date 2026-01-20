import { supabase } from "../lib/supabaseClient";
import type { WeeklyPlan, BodyMeasurement, TrainingDay } from "../types";

const PLAN_KEY = "silkoapp_training_plan";
const MEASURE_KEY = "silkoapp_body_measurements";

export async function runInitialSync(
  userId: string,
  localPlan: WeeklyPlan,
  replacePlan: (plan: WeeklyPlan) => void,
) {
  // --- Plan treningowy ---
  const { data: remotePlans, error: planError } = await supabase
    .from("training_plans")
    .select("id, name, days, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1);

  if (planError) {
    console.error("Supabase plan fetch error", planError);
  }

  if (remotePlans && remotePlans.length > 0) {
    const remotePlan: WeeklyPlan = {
      id: remotePlans[0].id ?? localPlan.id,
      name: remotePlans[0].name || localPlan.name,
      days: (remotePlans[0].days as TrainingDay[]) || localPlan.days,
      createdAt:
        (remotePlans[0] as any).created_at ||
        localPlan.createdAt ||
        new Date().toISOString(),
      updatedAt:
        (remotePlans[0] as any).updated_at ||
        localPlan.updatedAt ||
        new Date().toISOString(),
    };
    localStorage.setItem(PLAN_KEY, JSON.stringify(remotePlan));
    replacePlan(remotePlan);
  } else {
    // Brak planu w chmurze – wyślij lokalny
    const { error: insertErr } = await supabase.from("training_plans").insert({
      user_id: userId,
      name: localPlan.name,
      days: localPlan.days,
      created_at: localPlan.createdAt,
      updated_at: localPlan.updatedAt,
    });
    if (insertErr) {
      console.error("Supabase plan insert error", insertErr);
    }
  }

  // --- Pomiary ciała ---
  const localMeasurementsRaw = localStorage.getItem(MEASURE_KEY);
  const localMeasurements: BodyMeasurement[] = localMeasurementsRaw
    ? JSON.parse(localMeasurementsRaw)
    : [];

  const { data: remoteMeasurements, error: measError } = await supabase
    .from("body_measurements")
    .select("id, date, weight, height, body_fat, measurements, notes")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (measError) {
    console.error("Supabase measurements fetch error", measError);
  }

  if (remoteMeasurements && remoteMeasurements.length > 0) {
    // Zapisz zdalne do localStorage
    const mapped: BodyMeasurement[] = remoteMeasurements.map((m) => ({
      id: m.id,
      date: m.date,
      weight: Number(m.weight),
      height: m.height ?? undefined,
      bodyFat: m.body_fat ?? undefined,
      measurements: m.measurements ?? undefined,
      notes: m.notes ?? undefined,
    }));
    localStorage.setItem(MEASURE_KEY, JSON.stringify(mapped));
  } else if (localMeasurements.length > 0) {
    // Brak danych w chmurze – wyślij lokalne
    const payload = localMeasurements.map((m) => ({
      user_id: userId,
      date: m.date,
      weight: m.weight,
      height: m.height ?? null,
      body_fat: m.bodyFat ?? null,
      measurements: m.measurements ?? null,
      notes: m.notes ?? null,
    }));
    const { error: insertErr } = await supabase
      .from("body_measurements")
      .insert(payload);
    if (insertErr) {
      console.error("Supabase measurements insert error", insertErr);
    }
  }
}
