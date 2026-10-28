"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { weekDates, weekdayLabel, type CivilDate } from "@/lib/dates";
import { useToday } from "@/lib/use-today";
import { sessionFor, useMounted, useStore } from "@/lib/store";
import type { SessionLog } from "@/lib/types";
import {
  isWorkout,
  MAIN_WORKOUT_IDS,
  planForWeekday,
} from "@/lib/workouts";
import { cn } from "cn";

export function weekProgress(sessions: SessionLog[], today: CivilDate) {
  const keys = new Set(weekDates(today).map((day) => day.key));
  const main = new Set(
    sessions
      .filter(
        (session) =>
          session.finished &&
          keys.has(session.date) &&
          MAIN_WORKOUT_IDS.includes(session.dayId),
      )
      .map((session) => session.dayId),
  );
  const extra = sessions.some(
    (session) =>
      session.finished && session.dayId === "e" && keys.has(session.date),
  );
  return { main: main.size, extra };
}

export function WeekList({ compact = false }: { compact?: boolean }) {
  const mounted = useMounted();
  const { sessions } = useStore();
  const today = useToday();
  if (!today) {
    return <div className="h-48 animate-pulse rounded-3xl bg-card ring-1 ring-foreground/10" />;
  }
  const keys = new Set(weekDates(today).map((day) => day.key));

  return (
    <ol className={compact ? "grid gap-3 sm:grid-cols-2" : "grid gap-3"}>
      {weekDates(today).map((day) => {
        const plan = planForWeekday(day.weekday);
        const isToday = day.key === today.key;
        const done =
          mounted &&
          isWorkout(plan) &&
          sessions.some(
            (session) =>
              session.finished &&
              session.dayId === plan.id &&
              keys.has(session.date),
          );
        const started =
          mounted &&
          isWorkout(plan) &&
          !done &&
          Boolean(sessionFor(sessions, today.key, plan.id));
        const body = (
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                {weekdayLabel(day.weekday, "short")}
                {isWorkout(plan) ? ` · ${plan.code}` : ""}
              </p>
              {isToday ? (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium tracking-wide text-primary-foreground uppercase">
                  Hoje
                </span>
              ) : null}
              {done ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-sage-soft px-2 py-0.5 text-[10px] font-semibold tracking-wide text-sage uppercase">
                  <Check className="size-3" aria-hidden />
                  Feito
                </span>
              ) : null}
              {started ? (
                <span className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Aberto
                </span>
              ) : null}
            </div>
            <p className="font-heading mt-1 text-2xl leading-tight font-bold">
              {plan.title}
            </p>
            {isWorkout(plan) && !done && !started ? (
              <p className="mt-2 text-xs font-semibold text-muted-foreground">
                Ainda não
              </p>
            ) : null}
            {!isWorkout(plan) ? (
              <p className="mt-2 text-xs font-semibold text-muted-foreground">
                Descanso
              </p>
            ) : null}
            {compact ? null : (
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {plan.summary}
              </p>
            )}
            {isWorkout(plan) ? (
              <p className="mt-2 text-xs text-muted-foreground">
                {plan.minutes} · {plan.focus}
              </p>
            ) : null}
          </div>
        );
        const className = cn(
          "melk-card block px-4 py-4 transition motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg",
          isToday && "ring-2 ring-primary",
          done && "border-primary/30",
        );
        return (
          <li key={day.key}>
            {isWorkout(plan) ? (
              <Link href={`/treino/${plan.id}`} className={className}>
                {body}
              </Link>
            ) : (
              <div className={className}>{body}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
