"use client";

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
    <ol className="grid gap-2">
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
                <span className="rounded-full bg-sage-soft px-2 py-0.5 text-[10px] font-medium tracking-wide text-sage uppercase">
                  Feito
                </span>
              ) : null}
              {started ? (
                <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                  Aberto
                </span>
              ) : null}
            </div>
            <p className="font-heading mt-1 text-2xl leading-tight">
              {isWorkout(plan) ? plan.title : plan.title}
            </p>
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
          "block rounded-3xl bg-card px-4 py-4 ring-1 ring-foreground/10",
          isToday && "ring-2 ring-primary",
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
