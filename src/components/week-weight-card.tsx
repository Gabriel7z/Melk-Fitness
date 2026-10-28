"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatLongDate } from "@/lib/dates";
import { formatNumber, formatWeight, parseNumber } from "@/lib/format";
import {
  mondayOf,
  previousWeighIn,
  shiftDate,
} from "@/lib/rhythm";
import { deleteWeekWeight, saveWeekWeight, useStore } from "@/lib/store";
import { useToday } from "@/lib/use-today";

export function WeekWeightCard({ history = true }: { history?: boolean }) {
  const today = useToday();
  const { weeks } = useStore();
  const week = today ? mondayOf(today) : "";
  const saved = weeks.find((item) => item.week === week);
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState("");
  const value =
    draft ?? (saved ? String(saved.weightKg).replace(".", ",") : "");

  if (!today) {
    return (
      <div className="mt-4 h-36 animate-pulse rounded-3xl bg-card ring-1 ring-foreground/10" />
    );
  }

  const prior = previousWeighIn(weeks, week);
  const delta =
    saved && prior ? saved.weightKg - prior.weightKg : null;
  const monday = today.weekday === 1;

  function save() {
    const weightKg = parseNumber(value);
    if (weightKg == null || weightKg < 35 || weightKg > 180) {
      setError("Peso em quilos, tipo 65 ou 65,2.");
      return;
    }
    saveWeekWeight({ week, date: today!.key, weightKg });
    setDraft(null);
    setError("");
  }

  return (
    <section
      id="semana"
      className="mt-4 rounded-3xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5"
    >
      <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">
        Peso da semana
      </p>
      <h2 className="font-heading mt-1 text-3xl leading-tight">
        {monday ? "Hoje é segunda. Sobe na balança." : "Uma vez, na segunda."}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {monday
          ? "De manhã, antes de comer, depois do banheiro. Só esta marca vale na semana."
          : `A segunda desta semana foi ${dayOnly(week)}. Se passou, anota agora. A próxima balança é ${dayOnly(shiftDate(week, 7))}.`}
      </p>
      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <div className="grid flex-1 gap-1.5">
          <Label htmlFor="peso-semana">Peso</Label>
          <div className="relative">
            <Input
              id="peso-semana"
              inputMode="decimal"
              value={value}
              placeholder="65,0"
              className="h-11 pr-12 text-base"
              onChange={(event) => {
                setDraft(event.target.value);
                setError("");
              }}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
              kg
            </span>
          </div>
        </div>
        <Button type="submit" size="lg" className="h-11 text-base">
          {saved ? "Atualizar o peso da semana" : "Guardar o peso da semana"}
        </Button>
      </form>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-primary">
          {error}
        </p>
      ) : null}
      {saved && delta != null ? (
        <p className="mt-3 text-sm text-muted-foreground">
          {delta === 0
            ? "Igual à semana passada."
            : `${delta > 0 ? "Subiu" : "Desceu"} ${formatNumber(Math.abs(delta), 1)} kg desde ${formatLongDate(prior?.week ?? week)}.`}
        </p>
      ) : null}
      {saved ? (
        <p className="mt-1 text-sm text-muted-foreground">
          Semana de {dayOnly(week)}: {formatWeight(saved.weightKg)}.
        </p>
      ) : null}
      {history ? <WeekList /> : null}
    </section>
  );
}

function dayOnly(key: string) {
  const full = formatLongDate(key);
  const comma = full.indexOf(", ");
  return comma >= 0 ? full.slice(comma + 2) : full;
}

function WeekList() {
  const { weeks } = useStore();
  const sorted = weeks.slice().sort((a, b) => b.week.localeCompare(a.week));
  if (sorted.length === 0) return null;
  return (
    <ul className="mt-4 grid gap-2">
      {sorted.slice(0, 8).map((item, index) => {
        const older = sorted[index + 1];
        const delta = older ? item.weightKg - older.weightKg : null;
        return (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span>
              {formatLongDate(item.week)}
              <span className="ml-2 text-muted-foreground">
                {formatWeight(item.weightKg)}
                {delta != null
                  ? ` · ${delta > 0 ? "+" : "−"}${formatNumber(Math.abs(delta), 1)}`
                  : ""}
              </span>
            </span>
            <button
              type="button"
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
              onClick={() => deleteWeekWeight(item.id)}
            >
              Apagar
            </button>
          </li>
        );
      })}
    </ul>
  );
}
