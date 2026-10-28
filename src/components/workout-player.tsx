"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MachineGuideCard } from "@/components/machine-guide";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToday } from "@/lib/use-today";
import { formatRest } from "@/lib/format";
import {
  getStore,
  lastLoad,
  sessionFor,
  upsertSession,
  useStore,
} from "@/lib/store";
import type { Exercise, WorkoutDay } from "@/lib/workouts";
import { totalSets } from "@/lib/workouts";
import { cn } from "cn";

function readSets(exercise: Exercise, done: Record<string, boolean[]>) {
  const sets = done[exercise.id] ?? [];
  return Array.from({ length: exercise.sets }, (_, index) => Boolean(sets[index]));
}

function formatClock(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function restDeadline(seconds: number) {
  return Date.now() + seconds * 1000;
}

function extendRest(current: number | null) {
  return (current ?? Date.now()) + 15000;
}

export function WorkoutPlayer({ day }: { day: WorkoutDay }) {
  const { sessions } = useStore();
  const todayDate = useToday();
  const today = todayDate?.key ?? "";
  const session = sessionFor(sessions, today, day.id);
  const params = useSearchParams();
  const selected = params.get("ex");
  const queryIndex = selected
    ? day.exercises.findIndex((item) => item.id === selected)
    : -1;
  const [picked, setPicked] = useState<number | null>(null);
  const index = picked ?? (queryIndex >= 0 ? queryIndex : 0);
  const [restUntil, setRestUntil] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const vibrated = useRef(false);
  const exercise = day.exercises[index] ?? day.exercises[0];
  const done = session?.done ?? {};
  const loads = session?.loads ?? {};
  const allSets = totalSets(day);
  const doneCount = day.exercises.reduce(
    (sum, item) => sum + readSets(item, done).filter(Boolean).length,
    0,
  );
  const percent = allSets === 0 ? 0 : Math.round((doneCount / allSets) * 100);

  useEffect(() => {
    if (!restUntil) return;
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(id);
  }, [restUntil]);

  useEffect(() => {
    vibrated.current = false;
  }, [restUntil]);

  useEffect(() => {
    if (!restUntil || vibrated.current || Date.now() < restUntil) return;
    vibrated.current = true;
    navigator.vibrate?.(200);
  }, [now, restUntil]);

  if (!exercise || !todayDate) {
    return (
      <div className="h-64 animate-pulse rounded-3xl bg-card ring-1 ring-foreground/10" />
    );
  }

  const sets = readSets(exercise, done);
  const previous = lastLoad(
    sessions.filter((item) => item.date !== today || item.dayId !== day.id),
    exercise.id,
  );
  const remaining = restUntil == null ? 0 : Math.max(0, restUntil - now);
  const resting = restUntil != null;

  function persist(
    nextDone: Record<string, boolean[]>,
    nextLoads: Record<string, string>,
  ) {
    const finished = day.exercises.every((item) =>
      readSets(item, nextDone).every(Boolean),
    );
    upsertSession({
      date: today,
      dayId: day.id,
      done: nextDone,
      loads: nextLoads,
      finished,
    });
  }

  function toggleSet(setNumber: number) {
    const latest = sessionFor(getStore().sessions, today, day.id);
    const latestDone = latest?.done ?? {};
    const currentSets = readSets(exercise, latestDone);
    const nextSets = currentSets.map((on, cursor) =>
      cursor === setNumber ? !on : on,
    );
    persist(
      { ...latestDone, [exercise.id]: nextSets },
      latest?.loads ?? {},
    );
    if (!currentSets[setNumber] && exercise.restSec > 0) {
      setRestUntil(restDeadline(exercise.restSec));
    }
  }

  return (
    <div className="grid gap-4">
      <div>
        <Link
          href="/treino"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Semana
        </Link>
        <p className="mt-3 text-xs font-medium tracking-[0.18em] text-primary uppercase">
          Treino {day.code}
        </p>
        <h1 className="font-heading text-4xl leading-tight md:text-5xl">
          {day.title}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {day.shortTip}
        </p>
      </div>

      <Progress value={percent}>
        <ProgressLabel>Séries</ProgressLabel>
        <ProgressValue>{() => `${doneCount} de ${allSets}`}</ProgressValue>
      </Progress>

      {session?.finished ? (
        <p className="rounded-3xl bg-sage-soft px-4 py-4 text-sm leading-relaxed text-accent-foreground">
          Dia fechado. O músculo cresce na comida e no sono de hoje, não em
          mais uma série escondida.
        </p>
      ) : null}

      <details className="rounded-3xl bg-card px-4 py-3 ring-1 ring-foreground/10">
        <summary className="cursor-pointer text-sm font-medium">
          Aquecimento
        </summary>
        <ul className="mt-3 grid gap-1 text-sm text-muted-foreground">
          {day.warmup.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </details>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {day.exercises.map((item, cursor) => {
          const complete = readSets(item, done).every(Boolean);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setPicked(cursor)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium",
                cursor === index
                  ? "border-primary bg-primary text-primary-foreground"
                  : complete
                    ? "border-transparent bg-sage-soft text-sage"
                    : "border-border bg-card",
              )}
            >
              {cursor + 1}. {item.name}
            </button>
          );
        })}
      </div>

      <article className="rounded-3xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge variant="secondary">{exercise.feel}</Badge>
            <h2 className="font-heading mt-3 text-3xl leading-tight">
              {exercise.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {exercise.sets} séries · {exercise.reps} · descansa{" "}
              {formatRest(exercise.restSec)}
            </p>
          </div>
          <p className="font-heading text-2xl text-primary italic">
            {index + 1}/{day.exercises.length}
          </p>
        </div>

        <MachineGuideCard exerciseId={exercise.id} />

        <p className="mt-4 text-base leading-relaxed">{exercise.cue}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Evita: {exercise.avoid}
        </p>
        <details className="mt-3 text-sm leading-relaxed">
          <summary className="cursor-pointer font-medium">
            Se doer ou a máquina estiver ocupada
          </summary>
          <p className="mt-2 text-muted-foreground">{exercise.ifPain}</p>
          <p className="mt-1 text-muted-foreground">Troca: {exercise.swap}</p>
        </details>

        <div className="mt-5 grid gap-1.5">
          <Label htmlFor="carga">Carga de hoje</Label>
          <Input
            id="carga"
            value={loads[exercise.id] ?? ""}
            placeholder={previous ? `última: ${previous}` : "ex.: 40 kg"}
            className="h-11 text-base"
            onChange={(event) => {
              const latest = sessionFor(getStore().sessions, today, day.id);
              persist(latest?.done ?? {}, {
                ...(latest?.loads ?? {}),
                [exercise.id]: event.target.value,
              });
            }}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {sets.map((on, setNumber) => (
            <button
              key={`${exercise.id}-${setNumber}`}
              type="button"
              aria-pressed={on}
              onClick={() => toggleSet(setNumber)}
              className={cn(
                "h-16 rounded-2xl border text-sm font-medium",
                on
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border bg-background",
              )}
            >
              Série {setNumber + 1}
            </button>
          ))}
        </div>

        {resting ? (
          <div
            className={cn(
              "mt-4 rounded-3xl px-4 py-4 text-center",
              remaining === 0
                ? "bg-sage-soft text-accent-foreground"
                : "bg-primary text-primary-foreground",
            )}
          >
            <p className="text-xs tracking-[0.16em] uppercase">Descanso</p>
            <p className="font-heading mt-1 text-5xl tabular-nums">
              {remaining === 0 ? "Pode ir" : formatClock(remaining)}
            </p>
            <div className="mt-3 flex justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                className="h-10 px-3"
                onClick={() => setRestUntil((current) => extendRest(current))}
              >
                +15 s
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-10 px-3"
                onClick={() => setRestUntil(null)}
              >
                {remaining === 0 ? "Fechar" : "Pular"}
              </Button>
            </div>
          </div>
        ) : null}

        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1"
            disabled={index === 0}
            onClick={() =>
              setPicked((current) => Math.max(0, (current ?? index) - 1))
            }
          >
            Anterior
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1"
            disabled={index === day.exercises.length - 1}
            onClick={() =>
              setPicked((current) =>
                Math.min(day.exercises.length - 1, (current ?? index) + 1),
              )
            }
          >
            Próximo
          </Button>
        </div>
      </article>

      <Link
        href="/prato"
        className={cn(buttonVariants({ variant: "outline" }), "h-11")}
      >
        Ver o prato de hoje
      </Link>
    </div>
  );
}
