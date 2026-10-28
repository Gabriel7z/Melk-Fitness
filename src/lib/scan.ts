import type { Profile } from "@/lib/types";

/** Bioimpedância de 25 de setembro de 2026. É a última avaliação, não o peso de hoje. */
export const BODY_SCAN = {
  name: "Amanda Alves",
  date: "2026-09-25",
  dateLabel: "25 de setembro de 2026",
  weightKg: 65.95,
  heightCm: 170,
  bmi: 22.8,
  fatPercent: 31.1,
  fatKg: 20.5,
  skeletalMusclePercent: 36.9,
  skeletalMuscleKg: 24.3,
  musclePercent: 63.5,
  muscleKg: 41.9,
  waterPercent: 48.2,
  waterKg: 31.8,
  visceralFat: 5,
  boneKg: 3.48,
  bmr: 1358,
  proteinPercent: 15.3,
  proteinKg: 10.1,
  leanKg: 45.43,
  /** A balança sugeriu chegar perto de 60 kg. */
  scaleCutKg: 5.9,
  scaleTargetKg: 60,
  fatGoalPercent: 26,
  /** Faixa da balança enquanto a gordura desce. Não é o corte para 60 kg. */
  scaleGoalLow: 64,
  scaleGoalHigh: 66,
  reading: "Levemente acima do peso",
} as const;

export function scanMatches(profile: Pick<Profile, "heightCm" | "weightKg">) {
  if (profile.heightCm == null) return false;
  return (
    Math.abs(profile.heightCm - BODY_SCAN.heightCm) <= 2 &&
    profile.weightKg >= 60 &&
    profile.weightKg <= 72
  );
}
