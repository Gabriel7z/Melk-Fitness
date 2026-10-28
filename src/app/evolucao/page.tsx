"use client";

import { useState } from "react";
import { PageHeader, SectionTitle } from "@/components/heading";
import { ScanCard } from "@/components/scan-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildInsight, formatSigned, measureDelta } from "@/lib/body";
import { formatLongDate } from "@/lib/dates";
import { formatNumber, formatWeight, parseNumber } from "@/lib/format";
import {
  deleteCheckIn,
  resetStore,
  saveCheckIn,
  useStore,
} from "@/lib/store";
import { useToday } from "@/lib/use-today";
import type { CheckIn } from "@/lib/types";
import { cn } from "cn";

type FormState = {
  date: string;
  weight: string;
  waist: string;
  hip: string;
  thigh: string;
  chest: string;
  note: string;
};

const FIELDS = [
  ["weight", "Peso", "kg"],
  ["waist", "Cintura", "cm"],
  ["hip", "Quadril", "cm"],
  ["thigh", "Coxa", "cm"],
  ["chest", "Peito", "cm"],
] as const;

export default function EvolucaoPage() {
  const todayDate = useToday();
  const { checkins } = useStore();
  const today = todayDate?.key ?? "";
  const [draft, setDraft] = useState<FormState | null>(null);
  const [error, setError] = useState("");
  const selectedDate = draft?.date || today;
  const existing = checkins.find((item) => item.date === selectedDate);
  const value = draft ?? toForm(existing, today);
  const insight = buildInsight(checkins);
  const weights = checkins
    .filter((item) => item.weightKg != null)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));

  function update(patch: Partial<FormState>) {
    setDraft({ ...value, ...patch });
    setError("");
  }

  function save() {
    const date = value.date || today;
    if (date > today) {
      setError("A data ainda não chegou.");
      return;
    }
    const weightKg = readMeasure(value.weight, 35, 180);
    const waistCm = readMeasure(value.waist, 40, 160);
    const hipCm = readMeasure(value.hip, 50, 180);
    const thighCm = readMeasure(value.thigh, 30, 120);
    const chestCm = readMeasure(value.chest, 50, 160);
    const measures = [weightKg, waistCm, hipCm, thighCm, chestCm];
    if (measures.some((item) => item === "invalid")) {
      setError("Confere os números. Peso em kg, medidas em cm.");
      return;
    }
    if (measures.every((item) => item == null)) {
      setError("Anota pelo menos uma medida.");
      return;
    }
    saveCheckIn({
      id: existing?.id,
      date,
      weightKg: weightKg === "invalid" ? null : weightKg,
      waistCm: waistCm === "invalid" ? null : waistCm,
      hipCm: hipCm === "invalid" ? null : hipCm,
      thighCm: thighCm === "invalid" ? null : thighCm,
      chestCm: chestCm === "invalid" ? null : chestCm,
      note: value.note,
    });
    setDraft(null);
    setError("");
  }

  if (!todayDate) {
    return (
      <div>
        <PageHeader
          eyebrow="Evolução"
          title="A fita conta mais que a balança."
        >
          Cintura, quadril, coxa e peito, sempre no mesmo ponto. De manhã, antes
          de comer, a cada duas semanas. Foto de frente e de lado, na mesma luz,
          no mesmo dia.
        </PageHeader>
        <div className="h-40 animate-pulse rounded-3xl bg-card ring-1 ring-foreground/10" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Evolução"
        title="A fita conta mais que a balança."
      >
        Cintura, quadril, coxa e peito, sempre no mesmo ponto. De manhã, antes
        de comer, a cada duas semanas. Foto de frente e de lado, na mesma luz,
        no mesmo dia.
      </PageHeader>
      <>
          {insight ? (
            <p className="rounded-3xl bg-sage-soft px-4 py-4 text-sm leading-relaxed text-accent-foreground">
              {insight}
            </p>
          ) : (
            <div className="grid gap-3">
              <ScanCard />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Essa ficha é o ponto zero da gordura e do músculo. Cintura,
                quadril, coxa e peito ela não mediu. A próxima anotação com a
                fita é o que mostra se o glúteo subiu e a barriga desceu sem o
                peito sumir.
              </p>
            </div>
          )}

          {weights.length >= 2 ? (
            <div className="mt-4 rounded-3xl bg-card p-4 ring-1 ring-foreground/10">
              <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                Balança
              </p>
              <Sparkline
                values={weights.map((item) => item.weightKg ?? 0)}
              />
            </div>
          ) : null}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Delta label="Cintura" checkins={checkins} measure="waistCm" lower />
            <Delta label="Quadril" checkins={checkins} measure="hipCm" />
            <Delta label="Coxa" checkins={checkins} measure="thighCm" />
            <Delta label="Peito" checkins={checkins} measure="chestCm" />
          </div>

          <SectionTitle hint="Cintura na parte mais fina. Quadril na volta mais larga do glúteo. Coxa no meio da coxa direita. Peito na linha do sutiã, fita reta.">
            Anotar
          </SectionTitle>
          <form
            className="grid gap-4 rounded-3xl bg-card p-4 ring-1 ring-foreground/10"
            onSubmit={(event) => {
              event.preventDefault();
              save();
            }}
          >
            <div className="grid gap-1.5">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                max={today}
                value={value.date || today}
                className="h-11 text-base"
                onChange={(event) => {
                  const date = event.target.value || today;
                  const found = checkins.find((item) => item.date === date);
                  setDraft(toForm(found, date));
                  setError("");
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {FIELDS.map(([key, label, suffix]) => (
                <div key={key} className="grid gap-1.5">
                  <Label htmlFor={key}>{label}</Label>
                  <div className="relative">
                    <Input
                      id={key}
                      inputMode="decimal"
                      value={value[key]}
                      className="h-11 pr-12 text-base"
                      onChange={(event) => update({ [key]: event.target.value })}
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                      {suffix}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="nota">Nota</Label>
              <Input
                id="nota"
                value={value.note}
                placeholder="ciclo, sono ruim, treino forte"
                className="h-11 text-base"
                onChange={(event) => update({ note: event.target.value })}
              />
            </div>
            {error ? (
              <p role="alert" className="text-sm text-primary">
                {error}
              </p>
            ) : null}
            <Button type="submit" size="lg" className="h-11 text-base">
              {existing ? "Substituir a anotação deste dia" : "Guardar medida"}
            </Button>
          </form>

          {checkins.length > 0 ? (
            <>
              <SectionTitle>Histórico</SectionTitle>
              <ul className="grid gap-2">
                {checkins.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-3xl bg-card px-4 py-3 ring-1 ring-foreground/10"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium capitalize">
                          {formatLongDate(item.date)}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {[
                            item.weightKg != null
                              ? formatWeight(item.weightKg)
                              : null,
                            item.waistCm != null
                              ? `cintura ${formatNumber(item.waistCm, 1)}`
                              : null,
                            item.hipCm != null
                              ? `quadril ${formatNumber(item.hipCm, 1)}`
                              : null,
                            item.thighCm != null
                              ? `coxa ${formatNumber(item.thighCm, 1)}`
                              : null,
                            item.chestCm != null
                              ? `peito ${formatNumber(item.chestCm, 1)}`
                              : null,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                        {item.note ? (
                          <p className="mt-1 text-sm">{item.note}</p>
                        ) : null}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-8 px-2 text-xs"
                        onClick={() => deleteCheckIn(item.id)}
                      >
                        Apagar
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <button
            type="button"
            className="mt-10 text-xs text-muted-foreground underline-offset-4 hover:underline"
            onClick={() => {
              if (
                window.confirm(
                  "Apagar peso, medidas e treinos salvos neste celular?",
                )
              ) {
                resetStore();
                setDraft(null);
              }
            }}
          >
            Apagar dados deste celular
          </button>
      </>
    </div>
  );
}

function toForm(item: CheckIn | undefined, date: string): FormState {
  return {
    date: item?.date ?? date,
    weight: item?.weightKg != null ? stringify(item.weightKg) : "",
    waist: item?.waistCm != null ? stringify(item.waistCm) : "",
    hip: item?.hipCm != null ? stringify(item.hipCm) : "",
    thigh: item?.thighCm != null ? stringify(item.thighCm) : "",
    chest: item?.chestCm != null ? stringify(item.chestCm) : "",
    note: item?.note ?? "",
  };
}

function stringify(value: number) {
  return String(value).replace(".", ",");
}

function readMeasure(raw: string, min: number, max: number) {
  if (!raw.trim()) return null;
  const value = parseNumber(raw);
  if (value == null || value < min || value > max) return "invalid" as const;
  return value;
}

function Delta({
  label,
  checkins,
  measure,
  lower = false,
}: {
  label: string;
  checkins: CheckIn[];
  measure: "waistCm" | "hipCm" | "thighCm" | "chestCm";
  lower?: boolean;
}) {
  const delta = measureDelta(checkins, measure);
  const good =
    delta != null && Math.abs(delta.delta) >= 0.4
      ? lower
        ? delta.delta < 0
        : delta.delta > 0
      : null;
  return (
    <div className="rounded-3xl bg-card px-3 py-3 ring-1 ring-foreground/10">
      <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <p
        className={cn(
          "font-heading mt-1 text-2xl",
          good === true && "text-sage",
          good === false && "text-primary",
        )}
      >
        {delta ? formatSigned(delta.delta, "cm") : "—"}
      </p>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const width = 320;
  const height = 96;
  const pad = 8;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = pad + (index * (width - pad * 2)) / (values.length - 1);
      const y = pad + (1 - (value - min) / span) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-2 h-24 w-full">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-primary"
          points={points}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <p className="text-xs text-muted-foreground">
        de {formatWeight(min)} a {formatWeight(max)}
      </p>
    </div>
  );
}
