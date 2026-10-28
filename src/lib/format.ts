export function formatNumber(value: number, digits = 0) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatKg(value: number, digits = 1) {
  return `${formatNumber(value, digits)} kg`;
}

export function formatWeight(value: number) {
  return formatKg(value, Number.isInteger(value) ? 0 : 1);
}

export function formatRest(seconds: number) {
  if (seconds <= 0) return "sem descanso";
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (rest === 0) return `${minutes} min`;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export function parseNumber(raw: string) {
  const cleaned = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!cleaned) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

export function firstName(name: string) {
  const word = name.trim().split(/\s+/)[0];
  return word ?? "";
}
