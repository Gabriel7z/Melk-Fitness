import { weekdayLabel } from "@/lib/dates";
import { shiftDate } from "@/lib/rhythm";
import { CYCLES, type DayPlate, type PlateKind } from "@/lib/plates";

/** Segunda em que a primeira quinzena começa. */
export const CYCLE_ANCHOR = "2026-10-26";
export const CYCLE_LENGTH = 15;

export type PlannedDay = {
  date: string;
  weekday: number;
  weekdayShort: string;
  dayNumber: number;
  kind: PlateKind;
  kindLabel: string;
  plate: DayPlate;
};

export type CycleWindow = {
  cycleNumber: number;
  cycleName: string;
  index: number;
  start: string;
  end: string;
  nextStart: string;
  days: PlannedDay[];
};

function weekdayOf(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1)).getUTCDay();
}

function daysFromAnchor(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  const [ay, am, ad] = CYCLE_ANCHOR.split("-").map(Number);
  const date = Date.UTC(year, (month ?? 1) - 1, day ?? 1);
  const anchor = Date.UTC(ay, (am ?? 1) - 1, ad ?? 1);
  return Math.round((date - anchor) / 86_400_000);
}

export function plateKind(weekday: number): PlateKind {
  return weekday === 1 || weekday === 2 || weekday === 4 || weekday === 5
    ? "treino"
    : "leve";
}

export function kindLabel(weekday: number) {
  if (plateKind(weekday) === "treino") return "Treino";
  if (weekday === 6) return "Dia leve";
  return "Descanso";
}

export function cycleWindow(date: string): CycleWindow {
  const elapsed = daysFromAnchor(date);
  const block = Math.floor(elapsed / CYCLE_LENGTH);
  const cycleSlot = ((block % CYCLES.length) + CYCLES.length) % CYCLES.length;
  const book = CYCLES[cycleSlot];
  const start = shiftDate(CYCLE_ANCHOR, block * CYCLE_LENGTH);
  const trainCount = { treino: 0, leve: 0 };
  const days: PlannedDay[] = [];

  for (let offset = 0; offset < CYCLE_LENGTH; offset += 1) {
    const key = shiftDate(start, offset);
    const weekday = weekdayOf(key);
    const kind = plateKind(weekday);
    const pool = kind === "treino" ? book.training : book.rest;
    const plate = pool[trainCount[kind] % pool.length];
    trainCount[kind] += 1;
    days.push({
      date: key,
      weekday,
      weekdayShort: weekdayLabel(weekday, "short").replace(".", ""),
      dayNumber: offset + 1,
      kind,
      kindLabel: kindLabel(weekday),
      plate,
    });
  }

  return {
    cycleNumber: cycleSlot + 1,
    cycleName: book.name,
    index: elapsed - block * CYCLE_LENGTH,
    start,
    end: shiftDate(start, CYCLE_LENGTH - 1),
    nextStart: shiftDate(start, CYCLE_LENGTH),
    days,
  };
}

export function shoppingFor(days: PlannedDay[]) {
  const aisles = ["Proteína", "Carboidrato", "Junto"] as const;
  const groups = new Map<string, Map<string, number>>();
  for (const aisle of aisles) groups.set(aisle, new Map());

  for (const day of days) {
    const seen = new Set<string>();
    for (const meal of day.plate.meals) {
      for (const item of meal.foods) {
        const aisle = item.aisle ?? "Junto";
        const shop = item.shop ?? item.name;
        const key = `${aisle}:${shop}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const bucket = groups.get(aisle);
        if (!bucket) continue;
        bucket.set(shop, (bucket.get(shop) ?? 0) + 1);
      }
    }
  }

  return aisles.map((aisle) => ({
    group: aisle,
    items: [...(groups.get(aisle)?.entries() ?? [])]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "pt"))
      .map(([name, count]) => ({
        name,
        count,
        label: `${name} · ${count} ${count === 1 ? "dia" : "dias"}`,
      })),
  }));
}
