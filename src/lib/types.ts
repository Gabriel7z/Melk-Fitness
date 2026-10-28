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

export type Store = {
  profile: Profile;
  checkins: CheckIn[];
  sessions: SessionLog[];
  habits: Record<string, HabitDay>;
};
