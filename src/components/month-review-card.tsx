"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatLongDate } from "@/lib/dates";
import { formatWeight, parseNumber } from "@/lib/format";
import {
  buildMonthReading,
  formatMonth,
  mondaysInMonth,
  monthOf,
  openMonth,
  recentMonths,
  weeksInMonth,
} from "@/lib/rhythm";
import { saveMonthReview, useStore } from "@/lib/store";
import { useToday } from "@/lib/use-today";
import type { Energy, Hunger, MonthlyReview } from "@/lib/types";
import { cn } from "cn";

const ENERGY: { id: Energy; label: string }[] = [
  { id: "cansada", label: "Cansada" },
  { id: "normal", label: "Normal" },
  { id: "disposta", label: "Disposta" },
];

const HUNGER: { id: Hunger; label: string }[] = [
  { id: "pouca", label: "Pouca" },
  { id: "na medida", label: "Na medida" },
  { id: "demais", label: "Demais" },
];

const TAPES = [
  ["waist", "Cintura", "waistCm"],
  ["hip", "Quadril", "hipCm"],
  ["thigh", "Coxa", "thighCm"],
  ["chest", "Peito", "chestCm"],
] as const;

type TapeKey = (typeof TAPES)[number][0];

type Draft = {
  month: string;
  waist: string;
  hip: string;
  thigh: string;
  chest: string;
  energy: Energy | null;
  hunger: Hunger | null;
  note: string;
};

export function MonthReviewCard({ quiet = false }: { quiet?: boolean }) {
  const today = useToday();
  const { weeks, months } = useStore();
  const due = today ? openMonth(today, months) : null;
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");

  if (!today) {
    return (
      <div className="mt-4 h-40 animate-pulse rounded-3xl bg-card ring-1 ring-foreground/10" />
    );
  }

  const current = monthOf(today.key);
  const selected = draft?.month ?? due ?? current;
  const saved = months.find((item) => item.month === selected);
  const value = draft ?? fromReview(saved, selected);
  const reading = buildMonthReading(
    selected,
    weeks,
    saved ?? null,
    previousReview(months, selected),
  );

  if (quiet && due == null) {
    const latest = months
      .slice()
      .sort((a, b) => b.month.localeCompare(a.month))[0];
    if (!latest) {
      return (
        <p className="mt-4 text-sm text-muted-foreground">
          A avaliação do mês abre na última semana, com a fita: cintura,
          quadril, coxa e peito.
        </p>
      );
    }
    return (
      <Link
        href="/evolucao#mes"
        className="mt-4 block rounded-3xl bg-card px-4 py-4 ring-1 ring-foreground/10"
      >
        <span className="text-xs font-medium tracking-[0.16em] text-primary uppercase">
          Avaliação mensal
        </span>
        <span className="font-heading mt-1 block text-2xl leading-tight">
          {titleMonth(latest.month)}
        </span>
        <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
          {buildMonthReading(
            latest.month,
            weeks,
            latest,
            previousReview(months, latest.month),
          )}
        </span>
      </Link>
    );
  }

  function update(patch: Partial<Draft>) {
    setDraft({ ...value, ...patch });
    setError("");
  }

  function save() {
    const waistCm = readTape(value.waist, 40, 160);
    const hipCm = readTape(value.hip, 50, 180);
    const thighCm = readTape(value.thigh, 30, 120);
    const chestCm = readTape(value.chest, 50, 160);
    const tapes = [waistCm, hipCm, thighCm, chestCm];
    if (tapes.some((item) => item === "invalid")) {
      setError("Confere a fita. As medidas são em centímetros.");
      return;
    }
    if (tapes.every((item) => item == null) && !value.note.trim()) {
      setError("Anota pelo menos a cintura, ou uma nota do mês.");
      return;
    }
    saveMonthReview({
      id: saved?.id,
      month: selected,
      date: today!.key,
      waistCm: waistCm === "invalid" ? null : waistCm,
      hipCm: hipCm === "invalid" ? null : hipCm,
      thighCm: thighCm === "invalid" ? null : thighCm,
      chestCm: chestCm === "invalid" ? null : chestCm,
      energy: value.energy,
      hunger: value.hunger,
      note: value.note,
    });
    setDraft(null);
    setError("");
  }

  const marks = weeksInMonth(weeks, selected);

  return (
    <section
      id="mes"
      className="mt-4 rounded-3xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5"
    >
      <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">
        Avaliação mensal
        {due === selected ? " · para fechar" : ""}
      </p>
      <h2 className="font-heading mt-1 text-3xl leading-tight">
        {titleMonth(selected)}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Uma vez no mês, de manhã, com a mesma fita. A balança deste mês são as
        segundas. A fita diz se a barriga desceu sem o peito sumir.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {recentMonths(today).map((month) => (
          <button
            key={month}
            type="button"
            aria-pressed={month === selected}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm capitalize",
              month === selected
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
            onClick={() => {
              const found = months.find((item) => item.month === month);
              setDraft(fromReview(found, month));
              setError("");
            }}
          >
            {titleMonth(month).split(" de ")[0]}
          </button>
        ))}
      </div>

      <ul className="mt-4 grid gap-1 text-sm">
        {mondaysInMonth(selected).map((week) => {
          const mark = marks.find((item) => item.week === week);
          const future = week > today.key;
          return (
            <li key={week} className="flex justify-between gap-3">
              <span className="text-muted-foreground">{formatLongDate(week)}</span>
              <span>
                {mark
                  ? formatWeight(mark.weightKg)
                  : future
                    ? "ainda não chegou"
                    : "faltou"}
              </span>
            </li>
          );
        })}
      </ul>

      <form
        className="mt-4 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          {TAPES.map(([key, label]) => (
            <div key={key} className="grid gap-1.5">
              <Label htmlFor={`mes-${key}`}>{label}</Label>
              <div className="relative">
                <Input
                  id={`mes-${key}`}
                  inputMode="decimal"
                  value={value[key]}
                  className="h-11 pr-12 text-base"
                  onChange={(event) =>
                    update({ [key]: event.target.value } as Pick<Draft, TapeKey>)
                  }
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                  cm
                </span>
              </div>
            </div>
          ))}
        </div>
        <Choice
          label="Energia no mês"
          options={ENERGY}
          value={value.energy}
          onChange={(energy) => update({ energy })}
        />
        <Choice
          label="Fome no mês"
          options={HUNGER}
          value={value.hunger}
          onChange={(hunger) => update({ hunger })}
        />
        <div className="grid gap-1.5">
          <Label htmlFor="mes-nota">Nota do mês</Label>
          <Input
            id="mes-nota"
            value={value.note}
            placeholder="roupa, ciclo, sono, treino"
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
          {saved ? "Atualizar a avaliação" : "Fechar o mês"}
        </Button>
      </form>

      {saved ? (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {reading}
        </p>
      ) : null}
    </section>
  );
}

function Choice<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T | null;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={value === option.id}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm",
              value === option.id
                ? "bg-sage-soft text-accent-foreground"
                : "bg-muted text-muted-foreground",
            )}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function fromReview(review: MonthlyReview | undefined, month: string): Draft {
  return {
    month,
    waist: stringify(review?.waistCm),
    hip: stringify(review?.hipCm),
    thigh: stringify(review?.thighCm),
    chest: stringify(review?.chestCm),
    energy: review?.energy ?? null,
    hunger: review?.hunger ?? null,
    note: review?.note ?? "",
  };
}

function previousReview(reviews: MonthlyReview[], month: string) {
  return (
    reviews
      .filter((item) => item.month < month)
      .sort((a, b) => b.month.localeCompare(a.month))[0] ?? null
  );
}

function titleMonth(month: string) {
  const label = formatMonth(month);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function stringify(value: number | null | undefined) {
  if (value == null) return "";
  return String(value).replace(".", ",");
}

function readTape(raw: string, min: number, max: number) {
  if (!raw.trim()) return null;
  const value = parseNumber(raw);
  if (value == null || value < min || value > max) return "invalid" as const;
  return value;
}
