"use client";

import { useState } from "react";
import { PageHeader, SectionTitle } from "@/components/heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { assess } from "@/lib/body";
import { cycleWindow, shoppingFor, type PlannedDay } from "@/lib/cycle";
import { useToday } from "@/lib/use-today";
import { formatNumber } from "@/lib/format";
import {
  MORNING_TRAINING,
  RULES,
  SWAPS,
  foodKcal,
  menuTotals,
  plateAdjustment,
  sumFoods,
} from "@/lib/nutrition";
import { useMounted, useStore } from "@/lib/store";
import { cn } from "cn";

export default function PratoPage() {
  const mounted = useMounted();
  const today = useToday();
  const { profile } = useStore();
  const assessment = mounted ? assess(profile) : null;
  const plan = today ? cycleWindow(today.key) : null;
  const [picked, setPicked] = useState<string | null>(null);
  const selected =
    plan?.days.find((day) => day.date === (picked ?? today?.key)) ??
    plan?.days[0] ??
    null;

  return (
    <div>
      <PageHeader eyebrow="Alimentação" title="Quinze dias de prato.">
        O cardápio vale 15 dias e depois troca. Dia de treino tem mais arroz,
        batata e tapioca. Quarta, sábado e domingo a proteína fica e o
        carboidrato desce. Sem tilápia.
      </PageHeader>

      {assessment ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Macro label="Calorias" value={formatNumber(assessment.kcal)} />
          <Macro label="Proteína" value={`${assessment.protein} g`} />
          <Macro label="Carboidrato" value={`${assessment.carbs} g`} />
          <Macro label="Gordura" value={`${assessment.fat} g`} />
        </div>
      ) : (
        <p className="rounded-3xl bg-card px-4 py-4 text-sm leading-relaxed text-muted-foreground ring-1 ring-foreground/10">
          Sem a altura, o prato de treino fica perto de 1.900 kcal e uns 150 g
          de proteína, uma base boa para 68 kg. Em Peso, a conta fica a sua.
        </p>
      )}
      {assessment?.kcalNote ? (
        <p className="mt-3 text-sm text-muted-foreground">{assessment.kcalNote}</p>
      ) : null}

      {!plan || !selected ? (
        <div className="mt-6 h-64 animate-pulse rounded-3xl bg-card ring-1 ring-foreground/10" />
      ) : (
        <>
          <section className="mt-6 rounded-3xl bg-card px-4 py-4 ring-1 ring-foreground/10">
            <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">
              Ciclo {plan.cycleNumber} de 2 · dia {selected.dayNumber} de 15
            </p>
            <h2 className="font-heading mt-1 text-2xl leading-tight">
              {plan.cycleName}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              De {formatDayMonth(plan.start)} a {formatDayMonth(plan.end)}. No
              dia {formatDayMonth(plan.nextStart)} entra o{" "}
              {plan.cycleNumber === 1 ? "segundo" : "primeiro"} ciclo.
            </p>
          </section>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {plan.days.map((day) => {
              const active = day.date === selected.date;
              const isToday = day.date === today?.key;
              return (
                <button
                  key={day.date}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setPicked(day.date)}
                  className={cn(
                    "min-w-16 shrink-0 rounded-2xl px-2 py-2 text-center ring-1 ring-foreground/10",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground",
                  )}
                >
                  <span className="block text-[10px] font-semibold tracking-wide uppercase">
                    {day.weekdayShort}
                  </span>
                  <span className="font-heading block text-lg leading-tight font-bold">
                    {Number(day.date.slice(8, 10))}
                  </span>
                  <span className="block text-[10px] leading-tight">
                    {isToday ? "Hoje" : day.kindLabel}
                  </span>
                </button>
              );
            })}
          </div>

          <DayMeals
            day={selected}
            target={assessment?.kcal ?? null}
          />
        </>
      )}

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {MORNING_TRAINING}
      </p>

      <SectionTitle hint="O prato não depende de um alimento só.">
        Trocas
      </SectionTitle>
      <div className="grid gap-2 sm:grid-cols-2">
        {SWAPS.map((swap) => (
          <article
            key={swap.title}
            className="rounded-3xl bg-card px-4 py-4 ring-1 ring-foreground/10"
          >
            <h3 className="font-medium">{swap.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {swap.text}
            </p>
          </article>
        ))}
      </div>

      {plan ? (
        <>
          <SectionTitle hint="O que estes 15 dias pedem. A quantidade é por dia de uso, não por quilo.">
            Compras do ciclo
          </SectionTitle>
          <div className="grid gap-3">
            {shoppingFor(plan.days).map((group) => (
              <section
                key={group.group}
                className="rounded-3xl bg-card px-4 py-4 ring-1 ring-foreground/10"
              >
                <h3 className="font-medium">{group.group}</h3>
                <ul className="mt-2 grid gap-1 text-sm text-muted-foreground">
                  {group.items.map((item) => (
                    <li key={item.name}>{item.label}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      ) : null}

      <SectionTitle>Regras do prato</SectionTitle>
      <div className="grid gap-2">
        {RULES.map((rule) => (
          <article
            key={rule.title}
            className="rounded-3xl bg-card px-4 py-4 ring-1 ring-foreground/10"
          >
            <h3 className="font-medium">{rule.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {rule.text}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function DayMeals({ day, target }: { day: PlannedDay; target: number | null }) {
  const totals = menuTotals(day.plate);
  const adjustment = plateAdjustment(target, totals.kcal);
  return (
    <div className="mt-4 grid gap-3">
      <div className="rounded-3xl bg-sage-soft px-4 py-4">
        <p className="text-xs font-medium tracking-[0.16em] text-sage uppercase">
          {formatNumber(totals.kcal)} kcal · {totals.p} g proteína · {totals.c} g
          carbo · {totals.f} g gordura
        </p>
        <h2 className="font-heading mt-1 text-2xl">
          {day.kindLabel} · {day.plate.title}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-accent-foreground">
          {adjustment.title}. {adjustment.text}
        </p>
        <p className="mt-2 text-sm text-accent-foreground/80">{day.plate.blurb}</p>
      </div>
      {day.plate.meals.map((meal) => {
        const mealTotal = sumFoods(meal.foods);
        return (
          <Card key={meal.id}>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">{meal.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{meal.when}</p>
              <Badge variant="secondary">{mealTotal.p} g de proteína</Badge>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2">
                {meal.foods.map((item) => (
                  <li
                    key={`${meal.id}-${item.name}`}
                    className="flex items-baseline justify-between gap-3 text-sm"
                  >
                    <span>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        · {item.amount}
                      </span>
                    </span>
                    <span className="shrink-0 text-muted-foreground tabular-nums">
                      {foodKcal(item)} kcal
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function Macro({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-card px-3 py-3 ring-1 ring-foreground/10">
      <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="font-heading mt-1 text-2xl">{value}</p>
    </div>
  );
}

function formatDayMonth(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "numeric",
    month: "long",
  }).format(new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1, 15)));
}
