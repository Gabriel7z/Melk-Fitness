import type { CivilDate } from "@/lib/dates";
import { formatNumber, formatWeight } from "@/lib/format";
import type { MonthlyReview, WeeklyWeighIn } from "@/lib/types";

export function shiftDate(key: string, days: number) {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function mondayOf(today: CivilDate) {
  const offset = today.weekday === 0 ? -6 : 1 - today.weekday;
  return shiftDate(today.key, offset);
}

export function monthOf(key: string) {
  return key.slice(0, 7);
}

export function dayOfMonth(key: string) {
  return Number(key.slice(8, 10));
}

export function shiftMonth(month: string, delta: number) {
  const [year, value] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, (value ?? 1) - 1 + delta, 1));
  const nextMonth = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${date.getUTCFullYear()}-${nextMonth}`;
}

export function formatMonth(month: string) {
  const [year, value] = month.split("-").map(Number);
  const instant = new Date(Date.UTC(year, (value ?? 1) - 1, 1, 15));
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    month: "long",
    year: "numeric",
  }).format(instant);
}

export function mondaysInMonth(month: string) {
  const [year, value] = month.split("-").map(Number);
  const first = new Date(Date.UTC(year, (value ?? 1) - 1, 1));
  const weekday = first.getUTCDay();
  const firstMonday =
    weekday === 1 ? 1 : 1 + ((8 - weekday) % 7);
  const last = new Date(Date.UTC(year, value ?? 1, 0)).getUTCDate();
  const keys: string[] = [];
  for (let day = firstMonday; day <= last; day += 7) {
    keys.push(`${month}-${String(day).padStart(2, "0")}`);
  }
  return keys;
}

export function weeksInMonth(weeks: WeeklyWeighIn[], month: string) {
  return weeks
    .filter((item) => monthOf(item.week) === month)
    .slice()
    .sort((a, b) => a.week.localeCompare(b.week));
}

export function previousWeighIn(weeks: WeeklyWeighIn[], week: string) {
  return (
    weeks
      .filter((item) => item.week < week)
      .sort((a, b) => b.week.localeCompare(a.week))[0] ?? null
  );
}

/** Mês que ainda pede a avaliação. Fora da janela, devolve null. */
export function openMonth(today: CivilDate, reviews: MonthlyReview[]) {
  const current = monthOf(today.key);
  const day = dayOfMonth(today.key);
  const previous = shiftMonth(current, -1);
  const closed = (month: string) => reviews.some((item) => item.month === month);
  if (day <= 7 && !closed(previous)) return previous;
  if (day >= 25 && !closed(current)) return current;
  return null;
}

export function recentMonths(today: CivilDate, count = 4) {
  const current = monthOf(today.key);
  return Array.from({ length: count }, (_, index) =>
    shiftMonth(current, -index),
  );
}

export function buildMonthReading(
  month: string,
  weeks: WeeklyWeighIn[],
  review: MonthlyReview | null,
  previous: MonthlyReview | null,
  cycleWeeks: string[] = [],
) {
  const marks = weeksInMonth(weeks, month);
  const bits: string[] = [];

  if (marks.length === 0) {
    bits.push(
      "Neste mês ainda não entrou peso de segunda. A fita já conta, e a balança entra na próxima segunda.",
    );
  } else if (marks.length === 1) {
    bits.push(
      `A segunda marcou ${formatWeight(marks[0]?.weightKg ?? 0)}. Com uma marca só, o mês ainda não tem direção.`,
    );
  } else {
    const first = marks[0]?.weightKg ?? 0;
    const last = marks[marks.length - 1]?.weightKg ?? 0;
    const delta = last - first;
    const cycle = cycleWeeks.some((week) => monthOf(week) === month);
    if (delta < -0.8) {
      bits.push(
        `O peso desceu ${formatNumber(Math.abs(delta), 1)} kg entre a primeira e a última segunda. Descer mais que isso no mês pode levar o peito junto. Se a fita confirmar, sobe um pouco o arroz.`,
      );
    } else if (delta > 0.4) {
      bits.push(
        cycle
          ? `O peso subiu ${formatNumber(delta, 1)} kg no mês. Tem semana de período nessa conta, então a subida pode ser água. A fita e a próxima bio dizem se a gordura mudou.`
          : `O peso subiu ${formatNumber(delta, 1)} kg no mês. Segura azeite e castanha e mantém a proteína.`,
      );
    } else {
      bits.push(
        `O peso ficou, de ${formatWeight(first)} para ${formatWeight(last)}. A meta inclui perder gordura: a fita confirma se a cintura desceu e a coxa ficou.`,
      );
    }
  }

  if (review && previous) {
    bits.push(tapeLine("A cintura", review.waistCm, previous.waistCm, true));
    bits.push(tapeLine("O quadril", review.hipCm, previous.hipCm, false));
    bits.push(tapeLine("A coxa", review.thighCm, previous.thighCm, false));
    bits.push(tapeLine("O peito", review.chestCm, previous.chestCm, false));
  } else if (review) {
    bits.push(
      "Esta é a primeira fita do mês. A próxima avaliação compara cintura, quadril, coxa e peito com estes números.",
    );
  }

  if (review?.energy === "cansada") {
    bits.push("A energia veio baixa. Olha o sono antes de cortar comida.");
  }
  if (review?.hunger === "demais") {
    bits.push(
      "A fome passou do ponto. No dia de descanso, chega o prato mais perto do dia de treino.",
    );
  }
  if (review?.hunger === "pouca" && marks.length >= 2) {
    const first = marks[0]?.weightKg ?? 0;
    const last = marks[marks.length - 1]?.weightKg ?? 0;
    if (last - first < -0.4) {
      bits.push("Fome baixa e peso caindo: a comida pode estar curta para o glúteo.");
    }
  }

  return bits.filter(Boolean).join(" ");
}

function tapeLine(
  label: string,
  current: number | null,
  previous: number | null,
  lowerIsBetter: boolean,
) {
  if (current == null || previous == null) return "";
  const delta = current - previous;
  if (Math.abs(delta) < 0.4) return `${label} ficou estável.`;
  const direction = delta > 0 ? "subiu" : "desceu";
  const good = lowerIsBetter ? delta < 0 : delta > 0;
  const tone = good ? "Isso ajuda." : "Vale olhar a comida e o treino.";
  return `${label} ${direction} ${formatNumber(Math.abs(delta), 1)} cm. ${tone}`;
}
