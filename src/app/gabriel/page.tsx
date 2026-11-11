"use client";

import Link from "next/link";
import { PageHeader, SectionTitle } from "@/components/heading";
import { GABRIEL_DAYS, GABRIEL_SKIP, gabrielToday } from "@/lib/gabriel";
import { useToday } from "@/lib/use-today";
import { cn } from "cn";

export default function GabrielPage() {
  const today = useToday();
  const todayId = today ? gabrielToday(today.weekday) : null;

  return (
    <div>
      <PageHeader eyebrow="Gabriel Ferreira" title="Três sessões para fortalecer.">
        Segunda, quarta e sexta. A lombar fica apoiada ou quieta. Cada
        exercício diz o nome da máquina e onde ela fica na academia.
      </PageHeader>

      <p className="text-sm leading-relaxed text-muted-foreground">
        Nas primeiras quatro semanas o peso fica fácil e o movimento fica
        certo. Na quinta, sobe a menor anilha se o dia seguinte estiver igual.
        Dor que desce para a perna encerra a série.
      </p>

      <div className="mt-6 grid gap-4">
        {GABRIEL_DAYS.map((day) => {
          const current = day.id === todayId;
          return (
            <section
              key={day.id}
              className={cn(
                "rounded-3xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5",
                current && "ring-primary",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">
                    Sessão {day.code} · {day.when}
                    {current ? " · hoje" : ""}
                  </p>
                  <h2 className="font-heading mt-1 text-3xl leading-tight">
                    {day.title}
                  </h2>
                </div>
                <Link
                  href={`/gabriel/${day.id}`}
                  className="inline-flex min-h-11 shrink-0 items-center rounded-2xl bg-primary px-3 text-sm font-semibold text-primary-foreground"
                >
                  Abrir
                </Link>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {day.summary}
              </p>
              <ul className="mt-4 grid gap-2">
                {day.exercises.map((exercise) => (
                  <li key={exercise.id}>
                    <Link
                      href={`/gabriel/${day.id}#${exercise.id}`}
                      className="flex items-baseline justify-between gap-3 rounded-2xl bg-secondary px-3 py-3"
                    >
                      <span>
                        <span className="block font-medium">{exercise.name}</span>
                        <span className="mt-0.5 block text-sm text-muted-foreground">
                          {exercise.machine}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {exercise.dose}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <SectionTitle hint="Estas máquinas e estes movimentos ficam para depois.">
        O que não entra
      </SectionTitle>
      <ul className="grid gap-2">
        {GABRIEL_SKIP.map((item) => (
          <li
            key={item}
            className="rounded-3xl bg-card px-4 py-3 text-sm leading-relaxed ring-1 ring-foreground/10"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
