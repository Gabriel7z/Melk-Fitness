"use client";

import { PageHeader, SectionTitle } from "@/components/heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { assess } from "@/lib/body";
import { useToday } from "@/lib/use-today";
import { formatNumber } from "@/lib/format";
import {
  MENUS,
  MORNING_TRAINING,
  plateAdjustment,
  RULES,
  SHOPPING,
  SWAPS,
  foodKcal,
  menuTotals,
  sumFoods,
  type Menu,
} from "@/lib/nutrition";
import { useMounted, useStore } from "@/lib/store";
import { isWorkout, planForWeekday } from "@/lib/workouts";

export default function PratoPage() {
  const mounted = useMounted();
  const today = useToday();
  const { profile } = useStore();
  const assessment = mounted ? assess(profile) : null;
  const trainingToday = today
    ? isWorkout(planForWeekday(today.weekday))
    : null;

  return (
    <div>
      <PageHeader eyebrow="Alimentação" title="Você vai comer.">
        Definir não é pular refeição. A proteína segura o peito e o glúteo, o
        carboidrato faz a coxa crescer, e a barriga chapa no ponto certo de
        comida, não no abdominal infinito.
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
          de proteína, uma base boa para 65 kg. Em Peso, a conta fica a sua.
        </p>
      )}
      {assessment?.kcalNote ? (
        <p className="mt-3 text-sm text-muted-foreground">{assessment.kcalNote}</p>
      ) : null}

      {trainingToday == null ? (
        <div className="mt-6 h-64 animate-pulse rounded-3xl bg-card ring-1 ring-foreground/10" />
      ) : (
      <Tabs
        defaultValue={trainingToday ? "treino" : "descanso"}
        className="mt-6"
      >
        <TabsList className="h-11 w-full">
          <TabsTrigger value="treino" className="h-9 flex-1">
            Treino{trainingToday ? " · hoje" : ""}
          </TabsTrigger>
          <TabsTrigger value="descanso" className="h-9 flex-1">
            Descanso{trainingToday ? "" : " · hoje"}
          </TabsTrigger>
        </TabsList>
        {MENUS.map((menu) => (
          <TabsContent key={menu.id} value={menu.id} className="mt-4">
            <MenuBlock
              menu={menu}
              target={assessment?.kcal ?? null}
            />
          </TabsContent>
        ))}
      </Tabs>
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

      <SectionTitle hint="Uma semana, ajustando o que já tem em casa.">
        Compras
      </SectionTitle>
      <div className="grid gap-3">
        {SHOPPING.map((group) => (
          <section
            key={group.group}
            className="rounded-3xl bg-card px-4 py-4 ring-1 ring-foreground/10"
          >
            <h3 className="font-medium">{group.group}</h3>
            <ul className="mt-2 grid gap-1 text-sm text-muted-foreground">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

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

function MenuBlock({ menu, target }: { menu: Menu; target: number | null }) {
  const totals = menuTotals(menu);
  const adjustment = plateAdjustment(target, totals.kcal);
  return (
    <div className="grid gap-3">
      <div className="rounded-3xl bg-sage-soft px-4 py-4">
        <p className="text-xs font-medium tracking-[0.16em] text-sage uppercase">
          {formatNumber(totals.kcal)} kcal · {totals.p} g proteína · {totals.c} g
          carbo · {totals.f} g gordura
        </p>
        <h2 className="font-heading mt-1 text-2xl">{adjustment.title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-accent-foreground">
          {adjustment.text}
        </p>
        <p className="mt-2 text-sm text-accent-foreground/80">{menu.blurb}</p>
      </div>
      {menu.meals.map((meal) => {
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
                {meal.foods.map((food) => (
                  <li
                    key={`${meal.id}-${food.name}`}
                    className="flex items-baseline justify-between gap-3 text-sm"
                  >
                    <span>
                      <span className="font-medium">{food.name}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        · {food.amount}
                      </span>
                    </span>
                    <span className="shrink-0 text-muted-foreground tabular-nums">
                      {foodKcal(food)} kcal
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
