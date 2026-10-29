export type ActivityLevel = "leve" | "moderado" | "alto";

export type Profile = {
  name: string;
  weightKg: number;
  heightCm: number | null;
  age: number | null;
  activity: ActivityLevel;
  onboarded: boolean;
};

export type CheckIn = {
  id: string;
  date: string;
  weightKg: number | null;
  waistCm: number | null;
  hipCm: number | null;
  thighCm: number | null;
  chestCm: number | null;
  note: string;
};

export type SessionLog = {
  date: string;
  dayId: string;
  done: Record<string, boolean[]>;
  loads: Record<string, string>;
  finished: boolean;
};

export type HabitDay = {
  protein: boolean;
  water: boolean;
  sleep: boolean;
  move: boolean;
};

export type WeeklyWeighIn = {
  id: string;
  /** Segunda-feira que abre a semana, AAAA-MM-DD. */
  week: string;
  date: string;
  weightKg: number;
};

export type BioScan = {
  id: string;
  date: string;
  weightKg: number;
  fatPercent: number;
  musclePercent: number | null;
  visceralFat: number | null;
};

export type Energy = "cansada" | "normal" | "disposta";
export type Hunger = "pouca" | "na medida" | "demais";

export type MonthlyReview = {
  id: string;
  /** AAAA-MM. */
  month: string;
  date: string;
  waistCm: number | null;
  hipCm: number | null;
  thighCm: number | null;
  chestCm: number | null;
  energy: Energy | null;
  hunger: Hunger | null;
  note: string;
};

export type Store = {
  profile: Profile;
  checkins: CheckIn[];
  sessions: SessionLog[];
  habits: Record<string, HabitDay>;
  weeks: WeeklyWeighIn[];
  months: MonthlyReview[];
  bios: BioScan[];
  /** Segundas marcadas como período, AAAA-MM-DD. */
  cycleWeeks: string[];
};
