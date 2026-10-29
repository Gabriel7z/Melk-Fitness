import { BODY_SCAN } from "@/lib/scan";
import { formatNumber } from "@/lib/format";
import type { BioScan } from "@/lib/types";

export type FatJourney = {
  start: number;
  goal: number;
  current: number;
  latest: BioScan | null;
  dropped: number;
  left: number;
  ratio: number;
};

export function latestBio(bios: BioScan[]) {
  return bios.slice().sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
}

export function fatJourney(bios: BioScan[]): FatJourney {
  const start = BODY_SCAN.fatPercent;
  const goal = BODY_SCAN.fatGoalPercent;
  const latest = latestBio(bios);
  const current = latest?.fatPercent ?? start;
  const span = start - goal;
  const dropped = start - current;
  const ratio = span <= 0 ? 0 : Math.min(1, Math.max(0, dropped / span));
  return {
    start,
    goal,
    current,
    latest,
    dropped,
    left: current - goal,
    ratio,
  };
}

function points(value: number) {
  const amount = formatNumber(Math.abs(value), 1);
  return `${amount} ${Math.abs(value) === 1 ? "ponto" : "pontos"}`;
}

export function fatJourneyText(journey: FatJourney) {
  if (!journey.latest) {
    return `A partida é ${formatNumber(journey.start, 1)}% em ${BODY_SCAN.dateLabel}. A meta é perto de ${journey.goal}%. Quando repetir a bio, o número entra aqui.`;
  }
  if (journey.left <= 0) {
    return `A gordura chegou em ${formatNumber(journey.current, 1)}%, na meta de ${journey.goal}% ou abaixo.`;
  }
  if (journey.dropped > 0) {
    return `Desceu ${points(journey.dropped)} desde setembro. Faltam ${points(journey.left)} para chegar perto de ${journey.goal}%.`;
  }
  if (journey.dropped < 0) {
    return `Subiu ${points(journey.dropped)} desde setembro. A meta continua perto de ${journey.goal}%.`;
  }
  return `Continua em ${formatNumber(journey.current, 1)}%. A meta continua perto de ${journey.goal}%.`;
}
