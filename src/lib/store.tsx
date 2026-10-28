"use client";

import { useSyncExternalStore } from "react";
import type {
  CheckIn,
  Energy,
  HabitDay,
  Hunger,
  MonthlyReview,
  Profile,
  SessionLog,
  Store,
  WeeklyWeighIn,
} from "@/lib/types";
import { clearMonthPhotos } from "@/lib/photos";

const PROFILE_KEY = "melk.profile.v2";
const CHECKINS_KEY = "melk.checkins.v2";
const SESSIONS_KEY = "melk.sessions.v2";
const HABITS_KEY = "melk.habits.v2";
const WEEKS_KEY = "melk.weeks.v2";
const MONTHS_KEY = "melk.months.v2";

export const defaultProfile: Profile = {
  name: "Amanda",
  weightKg: 68,
  heightCm: 170,
  age: null,
  activity: "moderado",
  onboarded: true,
};

const emptyHabit = (): HabitDay => ({
  protein: false,
  water: false,
  sleep: false,
  move: false,
});

function defaultStore(): Store {
  return {
    profile: defaultProfile,
    checkins: [],
    sessions: [],
    habits: {},
    weeks: [],
    months: [],
  };
}

const serverStore = defaultStore();
let memory = defaultStore();
let loaded = false;
const listeners = new Set<() => void>();

function readJson(key: string) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function numberOrNull(value: unknown, min: number, max: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  if (value < min || value > max) return null;
  return value;
}

function sanitizeProfile(value: unknown): Profile {
  if (!value || typeof value !== "object") return defaultProfile;
  const record = value as Partial<Profile>;
  const activity =
    record.activity === "leve" ||
    record.activity === "moderado" ||
    record.activity === "alto"
      ? record.activity
      : "moderado";
  return {
    name: typeof record.name === "string" ? record.name.slice(0, 40) : "",
    weightKg: numberOrNull(record.weightKg, 35, 180) ?? 68,
    heightCm: numberOrNull(record.heightCm, 140, 210),
    age: numberOrNull(record.age, 16, 80),
    activity,
    onboarded: Boolean(record.onboarded),
  };
}

function sanitizeCheckins(value: unknown): CheckIn[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Partial<CheckIn>;
    if (typeof record.id !== "string" || typeof record.date !== "string") {
      return [];
    }
    return [
      {
        id: record.id,
        date: record.date,
        weightKg: numberOrNull(record.weightKg, 35, 180),
        waistCm: numberOrNull(record.waistCm, 40, 160),
        hipCm: numberOrNull(record.hipCm, 50, 180),
        thighCm: numberOrNull(record.thighCm, 30, 120),
        chestCm: numberOrNull(record.chestCm, 50, 160),
        note: typeof record.note === "string" ? record.note.slice(0, 280) : "",
      },
    ];
  });
}

function sanitizeSessions(value: unknown): SessionLog[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Partial<SessionLog>;
    if (typeof record.date !== "string" || typeof record.dayId !== "string") {
      return [];
    }
    const done: Record<string, boolean[]> = {};
    if (record.done && typeof record.done === "object") {
      for (const [key, sets] of Object.entries(record.done)) {
        if (Array.isArray(sets)) done[key] = sets.map((set) => Boolean(set));
      }
    }
    const loads: Record<string, string> = {};
    if (record.loads && typeof record.loads === "object") {
      for (const [key, load] of Object.entries(record.loads)) {
        if (typeof load === "string") loads[key] = load.slice(0, 24);
      }
    }
    return [
      {
        date: record.date,
        dayId: record.dayId,
        done,
        loads,
        finished: Boolean(record.finished),
      },
    ];
  });
}

function sanitizeHabits(value: unknown): Record<string, HabitDay> {
  if (!value || typeof value !== "object") return {};
  const habits: Record<string, HabitDay> = {};
  for (const [key, habit] of Object.entries(value)) {
    if (!habit || typeof habit !== "object") continue;
    const record = habit as Partial<HabitDay>;
    habits[key] = {
      protein: Boolean(record.protein),
      water: Boolean(record.water),
      sleep: Boolean(record.sleep),
      move: Boolean(record.move),
    };
  }
  return habits;
}

function dateKey(value: unknown) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value
    : null;
}

function monthKey(value: unknown) {
  return typeof value === "string" && /^\d{4}-\d{2}$/.test(value) ? value : null;
}

function sanitizeWeeks(value: unknown): WeeklyWeighIn[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Partial<WeeklyWeighIn>;
    const week = dateKey(record.week);
    const date = dateKey(record.date);
    const weightKg = numberOrNull(record.weightKg, 35, 180);
    if (!week || !date || weightKg == null || typeof record.id !== "string") {
      return [];
    }
    return [{ id: record.id, week, date, weightKg }];
  });
}

function sanitizeMonths(value: unknown): MonthlyReview[] {
  if (!Array.isArray(value)) return [];
  const energies = new Set<Energy>(["cansada", "normal", "disposta"]);
  const hungers = new Set<Hunger>(["pouca", "na medida", "demais"]);
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Partial<MonthlyReview>;
    const month = monthKey(record.month);
    const date = dateKey(record.date);
    if (!month || !date || typeof record.id !== "string") return [];
    const energy =
      record.energy && energies.has(record.energy) ? record.energy : null;
    const hunger =
      record.hunger && hungers.has(record.hunger) ? record.hunger : null;
    return [
      {
        id: record.id,
        month,
        date,
        waistCm: numberOrNull(record.waistCm, 40, 160),
        hipCm: numberOrNull(record.hipCm, 50, 180),
        thighCm: numberOrNull(record.thighCm, 30, 120),
        chestCm: numberOrNull(record.chestCm, 50, 160),
        energy,
        hunger,
        note: typeof record.note === "string" ? record.note.slice(0, 280) : "",
      },
    ];
  });
}

function load() {
  const savedProfile = readJson(PROFILE_KEY);
  const profile = sanitizeProfile(savedProfile);
  let weeks = sanitizeWeeks(readJson(WEEKS_KEY));
  // 65 kg was the seeded start, not the scale on 28/10/2026.
  const correctSeed =
    weeks.length === 0 &&
    (savedProfile == null || profile.weightKg === 65);
  const migrated = correctSeed ? { ...profile, weightKg: 68 } : profile;
  if (correctSeed) {
    weeks = [
      {
        id: "semana-2026-10-26",
        week: "2026-10-26",
        date: "2026-10-28",
        weightKg: 68,
      },
    ];
  }
  memory = {
    profile: migrated,
    checkins: sanitizeCheckins(readJson(CHECKINS_KEY)),
    sessions: sanitizeSessions(readJson(SESSIONS_KEY)),
    habits: sanitizeHabits(readJson(HABITS_KEY)),
    weeks,
    months: sanitizeMonths(readJson(MONTHS_KEY)),
  };
  loaded = true;
  if (correctSeed) {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(migrated));
      localStorage.setItem(WEEKS_KEY, JSON.stringify(weeks));
    } catch {
      // The corrected weight still shows in this session.
    }
  }
}

function persist(store: Store) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(store.profile));
    localStorage.setItem(CHECKINS_KEY, JSON.stringify(store.checkins));
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(store.sessions));
    localStorage.setItem(HABITS_KEY, JSON.stringify(store.habits));
    localStorage.setItem(WEEKS_KEY, JSON.stringify(store.weeks));
    localStorage.setItem(MONTHS_KEY, JSON.stringify(store.months));
  } catch {
    // O plano continua nesta sessão mesmo se o celular recusar gravar.
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function ensure() {
  if (loaded || typeof window === "undefined") return;
  load();
}

export function getStore() {
  ensure();
  return memory;
}

function update(recipe: (store: Store) => Store) {
  ensure();
  memory = recipe(memory);
  if (typeof window !== "undefined") persist(memory);
  emit();
}

export function subscribe(listener: () => void) {
  if (typeof window === "undefined") return () => {};
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key && !event.key.startsWith("melk.")) return;
    loaded = false;
    ensure();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useStore() {
  return useSyncExternalStore(subscribe, getStore, () => serverStore);
}

export function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function saveProfile(profile: Profile) {
  update((store) => ({ ...store, profile }));
}

export function setHabit(date: string, patch: Partial<HabitDay>) {
  update((store) => ({
    ...store,
    habits: {
      ...store.habits,
      [date]: { ...emptyHabit(), ...store.habits[date], ...patch },
    },
  }));
}

export function upsertSession(session: SessionLog) {
  update((store) => {
    const sessions = store.sessions.filter(
      (item) => !(item.date === session.date && item.dayId === session.dayId),
    );
    sessions.push(session);
    const habits = session.finished
      ? {
          ...store.habits,
          [session.date]: {
            ...emptyHabit(),
            ...store.habits[session.date],
            move: true,
          },
        }
      : store.habits;
    return { ...store, sessions, habits };
  });
}

export function saveCheckIn(input: Omit<CheckIn, "id"> & { id?: string }) {
  update((store) => {
    const next: CheckIn = {
      id: input.id ?? crypto.randomUUID(),
      date: input.date,
      weightKg: input.weightKg,
      waistCm: input.waistCm,
      hipCm: input.hipCm,
      thighCm: input.thighCm,
      chestCm: input.chestCm,
      note: input.note.trim(),
    };
    const checkins = store.checkins.filter((item) => item.date !== next.date);
    checkins.push(next);
    checkins.sort((a, b) => b.date.localeCompare(a.date));
    const profile =
      next.weightKg != null
        ? { ...store.profile, weightKg: next.weightKg }
        : store.profile;
    return { ...store, checkins, profile };
  });
}

export function saveWeekWeight(input: {
  week: string;
  date: string;
  weightKg: number;
}) {
  update((store) => {
    const existing = store.weeks.find((item) => item.week === input.week);
    const next: WeeklyWeighIn = {
      id: existing?.id ?? crypto.randomUUID(),
      week: input.week,
      date: input.date,
      weightKg: input.weightKg,
    };
    const weeks = store.weeks.filter((item) => item.week !== input.week);
    weeks.push(next);
    weeks.sort((a, b) => b.week.localeCompare(a.week));
    return {
      ...store,
      weeks,
      profile: { ...store.profile, weightKg: input.weightKg },
    };
  });
}

export function deleteWeekWeight(id: string) {
  update((store) => ({
    ...store,
    weeks: store.weeks.filter((item) => item.id !== id),
  }));
}

export function saveMonthReview(
  input: Omit<MonthlyReview, "id"> & { id?: string },
) {
  update((store) => {
    const existing = store.months.find((item) => item.month === input.month);
    const next: MonthlyReview = {
      id: input.id ?? existing?.id ?? crypto.randomUUID(),
      month: input.month,
      date: input.date,
      waistCm: input.waistCm,
      hipCm: input.hipCm,
      thighCm: input.thighCm,
      chestCm: input.chestCm,
      energy: input.energy,
      hunger: input.hunger,
      note: input.note.trim(),
    };
    const months = store.months.filter((item) => item.month !== input.month);
    months.push(next);
    months.sort((a, b) => b.month.localeCompare(a.month));
    return { ...store, months };
  });
}

export function deleteMonthReview(id: string) {
  update((store) => ({
    ...store,
    months: store.months.filter((item) => item.id !== id),
  }));
}

export function deleteCheckIn(id: string) {
  update((store) => ({
    ...store,
    checkins: store.checkins.filter((item) => item.id !== id),
  }));
}

export function resetStore() {
  memory = defaultStore();
  loaded = true;
  if (typeof window !== "undefined") {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(CHECKINS_KEY);
    localStorage.removeItem(SESSIONS_KEY);
    localStorage.removeItem(HABITS_KEY);
    localStorage.removeItem(WEEKS_KEY);
    localStorage.removeItem(MONTHS_KEY);
    void clearMonthPhotos();
  }
  emit();
}

export function lastLoad(sessions: SessionLog[], exerciseId: string) {
  const sorted = sessions
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
  for (const session of sorted) {
    const load = session.loads[exerciseId]?.trim();
    if (load) return load;
  }
  return "";
}

export function sessionFor(sessions: SessionLog[], date: string, dayId: string) {
  return sessions.find((item) => item.date === date && item.dayId === dayId);
}
