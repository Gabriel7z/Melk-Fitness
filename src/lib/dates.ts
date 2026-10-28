const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export type CivilDate = {
  key: string;
  weekday: number;
};

export function saoPauloToday(date = new Date()): CivilDate {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const year = read("year");
  const month = read("month");
  const day = read("day");
  return {
    key: `${year}-${month}-${day}`,
    weekday: WEEKDAY_INDEX[read("weekday")] ?? 0,
  };
}

export function formatLongDate(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  const instant = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1, 15));
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(instant);
}

export function weekdayLabel(weekday: number, width: "long" | "short" = "long") {
  const instant = new Date(Date.UTC(2024, 0, 7 + weekday, 15));
  const label = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC",
    weekday: width,
  }).format(instant);
  return label.replace("-feira", "");
}

export function weekDates(today: CivilDate) {
  const [year, month, day] = today.key.split("-").map(Number);
  const base = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));
  const mondayOffset = today.weekday === 0 ? -6 : 1 - today.weekday;
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(base);
    date.setUTCDate(base.getUTCDate() + mondayOffset + index);
    const key = date.toISOString().slice(0, 10);
    return { key, weekday: index === 6 ? 0 : index + 1 };
  });
}
