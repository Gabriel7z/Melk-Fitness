"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatLongDate } from "@/lib/dates";
import { fatJourney, fatJourneyText } from "@/lib/fat";
import { formatNumber, parseNumber } from "@/lib/format";
import { BODY_SCAN } from "@/lib/scan";
import { deleteBio, saveBio, useStore } from "@/lib/store";
import { useToday } from "@/lib/use-today";

type Draft = {
  date: string;
  weight: string;
  fat: string;
  muscle: string;
  visceral: string;
};

export function FatScanCard({ form = true }: { form?: boolean }) {
  const today = useToday();
  const { bios } = useStore();
  const journey = fatJourney(bios);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const value = draft ?? emptyDraft(today?.key ?? "");

  function update(patch: Partial<Draft>) {
    setDraft({ ...value, ...patch });
    setError("");
  }

  function save() {
    if (!today) return;
    const date = value.date;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setError("Escolhe a data da ficha.");
      return;
    }
    if (date > today.key) {
      setError("A data ainda não chegou.");
      return;
    }
    if (date === BODY_SCAN.date) {
      setError("25 de setembro de 2026 já é a ficha de partida. Anota a bio nova.");
      return;
    }
    const weightKg = parseNumber(value.weight);
    const fatPercent = parseNumber(value.fat);
    const muscleRaw = value.muscle.trim();
    const visceralRaw = value.visceral.trim();
    const musclePercent = muscleRaw ? parseNumber(muscleRaw) : null;
    const visceralFat = visceralRaw ? parseNumber(visceralRaw) : null;
    if (weightKg == null || weightKg < 35 || weightKg > 180) {
      setError("Peso em quilos, tipo 67,4.");
      return;
    }
    if (fatPercent == null || fatPercent < 5 || fatPercent > 70) {
      setError("Gordura em porcentagem, tipo 30,2.");
      return;
    }
    if (muscleRaw && (musclePercent == null || musclePercent < 15 || musclePercent > 60)) {
      setError("Músculo esquelético em porcentagem, tipo 37.");
      return;
    }
    if (visceralRaw && (visceralFat == null || visceralFat < 1 || visceralFat > 30)) {
      setError("Gordura visceral é um número da ficha, tipo 5.");
      return;
    }
    saveBio({ date, weightKg, fatPercent, musclePercent, visceralFat });
    setDraft(emptyDraft(today.key));
    setError("");
  }

  return (
    <section
      id={form ? "bio" : undefined}
      className="rounded-3xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5"
    >
      <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">
        Gordura
      </p>
      <h2 className="font-heading mt-1 text-3xl leading-tight">
        {journey.latest
          ? `${formatNumber(journey.current, 1)}% na última bio`
          : `${formatNumber(journey.start, 1)}% na partida`}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {fatJourneyText(journey)}
      </p>
      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-secondary"
        role="meter"
        aria-label="Caminho da gordura até a meta"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(journey.ratio * 100)}
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${journey.ratio * 100}%` }}
        />
      </div>
      <p className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{formatNumber(journey.start, 1)}% em setembro</span>
        <span>meta {journey.goal}%</span>
      </p>

      {journey.latest ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Última ficha, {formatLongDate(journey.latest.date)}:{" "}
          {formatWeightLine(journey.latest.weightKg)} e{" "}
          {formatNumber(journey.latest.fatPercent, 1)}% de gordura.
        </p>
      ) : null}

      {!form ? (
        <Link
          href="/evolucao#bio"
          className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary"
        >
          Anotar a próxima bio
        </Link>
      ) : null}

      {form ? (
        <form
          className="mt-5 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Data" id="bio-data">
              <Input
                id="bio-data"
                type="date"
                max={today?.key}
                value={value.date}
                className="h-11"
                onChange={(event) => update({ date: event.target.value })}
              />
            </Field>
            <Field label="Peso" id="bio-peso">
              <Input
                id="bio-peso"
                inputMode="decimal"
                placeholder="67,4"
                value={value.weight}
                className="h-11"
                onChange={(event) => update({ weight: event.target.value })}
              />
            </Field>
            <Field label="Gordura %" id="bio-gordura">
              <Input
                id="bio-gordura"
                inputMode="decimal"
                placeholder="30,2"
                value={value.fat}
                className="h-11"
                onChange={(event) => update({ fat: event.target.value })}
              />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Músculo esquelético %, se vier" id="bio-musculo">
              <Input
                id="bio-musculo"
                inputMode="decimal"
                placeholder="37,0"
                value={value.muscle}
                className="h-11"
                onChange={(event) => update({ muscle: event.target.value })}
              />
            </Field>
            <Field label="Gordura visceral, se vier" id="bio-visceral">
              <Input
                id="bio-visceral"
                inputMode="decimal"
                placeholder="5"
                value={value.visceral}
                className="h-11"
                onChange={(event) => update({ visceral: event.target.value })}
              />
            </Field>
          </div>
          {error ? (
            <p role="alert" className="text-sm text-primary">
              {error}
            </p>
          ) : null}
          <Button type="submit" size="lg" className="h-11 text-base">
            Guardar a bio
          </Button>
        </form>
      ) : null}

      {form && bios.length > 0 ? (
        <ul className="mt-4 grid gap-2">
          {bios.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
              <span>
                {formatLongDate(item.date)}
                <span className="ml-2 text-muted-foreground">
                  {formatNumber(item.fatPercent, 1)}% · {formatWeightLine(item.weightKg)}
                </span>
              </span>
              <button
                type="button"
                className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                onClick={() => deleteBio(item.id)}
              >
                Apagar
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function emptyDraft(date: string): Draft {
  return { date, weight: "", fat: "", muscle: "", visceral: "" };
}

function formatWeightLine(kg: number) {
  return `${formatNumber(kg, Number.isInteger(kg) ? 0 : 1)} kg`;
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
