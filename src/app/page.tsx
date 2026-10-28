"use client";

import Link from "next/link";
import {
  Activity,
  Beef,
  Check,
  Droplets,
  Dumbbell,
  Flame,
  Moon,
  Scale,
  Shield,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ProfileForm } from "@/components/profile-form";
import { WeekList, weekProgress } from "@/components/week-list";
import { assess, proteinGrams, waterMl } from "@/lib/body";
import { MonthReviewCard } from "@/components/month-review-card";
import { WeekWeightCard } from "@/components/week-weight-card";
import { formatLongDate } from "@/lib/dates";
import { firstName, formatNumber, formatWeight } from "@/lib/format";
import { BODY_SCAN } from "@/lib/scan";
import { setHabit, useStore } from "@/lib/store";
import { useToday } from "@/lib/use-today";
import { isWorkout, planForWeekday } from "@/lib/workouts";
import { cn } from "cn";

const GOALS: {
  title: string;
  text: string;
  icon: LucideIcon;
  focus?: boolean;
}[] = [
  {
    title: "Bumbum maior",
    text: "Dois dias de glúteo, com elevação pélvica pesada e stiff.",
    icon: Sparkles,
    focus: true,
  },
  {
    title: "Coxa mais grossa",
    text: "Agachamento, leg press, extensora, posterior e adutora.",
    icon: Activity,
    focus: true,
  },
  {
    title: "Barriga mais chapada",
    text: "A gordura, os 31%, é que sai. O peso fica perto de 65 kg.",
    icon: Flame,
  },
  {
    title: "Peito no lugar",
    text: "Sem supino. O peito fica com o peso perto de 65 kg e a proteína no prato.",
    icon: Shield,
  },
];

const SCAN_CHIPS = [
  ["Gordura", `${formatNumber(BODY_SCAN.fatPercent, 1)}%`],
  ["Peso", `${formatNumber(BODY_SCAN.weightKg, 2)} kg`],
  ["Altura", "1,70 m"],
  ["IMC", formatNumber(BODY_SCAN.bmi, 1)],
  ["Músculo", `${formatNumber(BODY_SCAN.skeletalMusclePercent, 1)}%`],
  ["Proteína", `${formatNumber(BODY_SCAN.proteinPercent, 1)}%`],
];

export default function HomePage() {
  const today = useToday();
  const { profile, sessions, habits } = useStore();
  const plan = planForWeekday(today?.weekday ?? 1);
  const assessment = today && profile.heightCm ? assess(profile) : null;
  const progress = today ? weekProgress(sessions, today) : { main: 0, extra: false };
  const habit = (today ? habits[today.key] : undefined) ?? {
    protein: false,
    water: false,
    sleep: false,
    move: false,
  };
  const finishedToday =
    today != null &&
    isWorkout(plan) &&
    sessions.some(
      (session) =>
        session.finished &&
        session.date === today.key &&
        session.dayId === plan.id,
    );
  const name = firstName(profile.name);
  const protein = assessment?.protein ?? proteinGrams(profile.weightKg);
  const water = assessment?.waterMl ?? waterMl(profile.weightKg);
  const waterLabel = formatNumber(water / 1000, 1);

  return (
    <div className="grid gap-6">
      <section
        className="melk-rise relative overflow-hidden rounded-[2rem] bg-primary px-5 py-6 text-primary-foreground shadow-xl shadow-primary/25"
        style={{ animationDelay: "0ms" }}
      >
        <div
          className="pointer-events-none absolute -top-16 -right-10 size-48 rounded-full bg-white/10"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-8 size-40 rounded-full bg-[oklch(0.62_0.1_310)]/40"
          aria-hidden
        />
        <p className="relative text-xs font-semibold tracking-[0.18em] uppercase">
          Meta · recomposição corporal
        </p>
        <h1 className="font-heading relative mt-2 text-4xl leading-tight font-extrabold md:text-5xl">
          {name ? `Oi, ${name}` : "Oi"}
        </h1>
        <p className="relative mt-3 max-w-xl text-lg leading-snug font-semibold">
          O peso fica perto de 65 kg. A gordura desce. Glúteo e coxa sobem. O
          peito fica.
        </p>
        <p className="relative mt-2 text-sm text-primary-foreground/80">
          {today ? formatLongDate(today.key) : "Sem dieta de emagrecer."}
        </p>
        <p className="relative mt-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
          Avaliação de {BODY_SCAN.dateLabel}
        </p>
        <dl className="relative mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SCAN_CHIPS.map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/15 px-3 py-3">
              <dt className="text-[11px] font-semibold tracking-[0.12em] uppercase opacity-80">
                {label}
              </dt>
              <dd className="font-heading mt-1 text-xl leading-none font-bold">{value}</dd>
            </div>
          ))}
        </dl>
        <Link
          href="/peso"
          className="relative mt-4 inline-flex min-h-11 items-center text-sm font-semibold underline decoration-white/40 underline-offset-4"
        >
          Abrir a leitura da avaliação
        </Link>
      </section>

      <section aria-label="Métricas de hoje" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={Scale}
          label="Peso"
          value={formatWeight(profile.weightKg)}
          hint="Recomposição, 63 a 65 kg"
          tone="rose"
          delay="40ms"
        />
        <Metric
          icon={Beef}
          label="Proteína"
          value={`${protein} g`}
          hint={habit.protein ? "Marcada hoje" : "Meta do dia"}
          progress={habit.protein ? 100 : 0}
          tone="lilac"
          delay="80ms"
        />
        <Metric
          icon={Droplets}
          label="Água"
          value={`${waterLabel} L`}
          hint={habit.water ? "Marcada hoje" : "Meta do dia"}
          progress={habit.water ? 100 : 0}
          tone="water"
          delay="120ms"
        />
        <Metric
          icon={Dumbbell}
          label="Treinos"
          value={`${progress.main} de 4`}
          hint={progress.extra ? "Sábado também feito" : "Na semana"}
          progress={(progress.main / 4) * 100}
          tone="plum"
          delay="160ms"
        />
      </section>

      {!today ? (
        <div className="h-48 animate-pulse rounded-[2rem] bg-card" />
      ) : (
        <Today planIsWorkout={isWorkout(plan)} plan={plan} />
      )}

      {today && !profile.onboarded ? (
        <section className="melk-card grid gap-3 p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            O peso já está em {formatWeight(profile.weightKg)}. Com a altura, o
            Melk crava a faixa de peso e o quanto comer.
          </p>
          <ProfileForm variant="onboarding" />
        </section>
      ) : null}

      {today && profile.onboarded && !assessment ? (
        <Link href="/peso" className="melk-card block px-5 py-4">
          <span className="block font-semibold">Falta a altura</span>
          <span className="mt-1 block text-sm text-muted-foreground">
            65 kg muda de sentido entre 1,60 m e 1,70 m.
          </span>
        </Link>
      ) : null}

      <section aria-labelledby="objetivos">
        <h2 id="objetivos" className="font-heading text-2xl font-bold">
          Objetivos
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Uma meta só: recomposição corporal. A forma muda. A balança não vai para 60 kg.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {GOALS.map((goal, index) => (
            <article
              key={goal.title}
              className={cn(
                "melk-rise melk-card p-5 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg",
                goal.focus && "border-primary/25",
              )}
              style={{ animationDelay: `${180 + index * 40}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-2xl",
                    goal.focus
                      ? "bg-primary text-primary-foreground"
                      : "bg-lilac-soft text-lilac",
                  )}
                >
                  <goal.icon className="size-5" aria-hidden />
                </span>
                {goal.focus ? (
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold tracking-wide text-primary uppercase">
                    Foco
                  </span>
                ) : (
                  <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
                    Junto
                  </span>
                )}
              </div>
              <h3 className="font-heading mt-4 text-xl leading-tight font-bold">
                {goal.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {goal.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="rotina">
        <h2 id="rotina" className="font-heading text-2xl font-bold">
          Hoje, sem complicar
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Quatro marcas. O dia fica leve de acompanhar.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          <Habit
            icon={Dumbbell}
            label={
              isWorkout(plan)
                ? finishedToday
                  ? "Treino feito"
                  : "Treino do dia"
                : "Caminhada, se quiser"
            }
            on={habit.move || finishedToday}
            locked={finishedToday || !today}
            onClick={() => today && setHabit(today.key, { move: !habit.move })}
          />
          <Habit
            icon={Beef}
            label={`Proteína perto de ${protein} g`}
            on={habit.protein}
            locked={!today}
            onClick={() => today && setHabit(today.key, { protein: !habit.protein })}
          />
          <Habit
            icon={Droplets}
            label={`Água, ${waterLabel} litros`}
            on={habit.water}
            locked={!today}
            onClick={() => today && setHabit(today.key, { water: !habit.water })}
          />
          <Habit
            icon={Moon}
            label="Dormir de verdade"
            on={habit.sleep}
            locked={!today}
            onClick={() => today && setHabit(today.key, { sleep: !habit.sleep })}
          />
        </ul>
      </section>

      <section aria-labelledby="semana">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 id="semana" className="font-heading text-2xl font-bold">
              Semana
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {progress.main} de 4 treinos feitos
              {progress.extra ? ", e o sábado também." : "."}
            </p>
          </div>
          <Link href="/treino" className="min-h-11 text-sm font-bold text-primary">
            Abrir treinos
          </Link>
        </div>
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"
          aria-hidden
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${(progress.main / 4) * 100}%` }}
          />
        </div>
        <div className="mt-4">
          <WeekList compact />
        </div>
      </section>

      {today ? <WeekWeightCard history={false} /> : null}
      {today ? <MonthReviewCard quiet /> : null}
    </div>
  );
}

function Today({
  plan,
  planIsWorkout,
}: {
  plan: ReturnType<typeof planForWeekday>;
  planIsWorkout: boolean;
}) {
  if (!planIsWorkout || !isWorkout(plan)) {
    return (
      <section className="melk-card px-5 py-6">
        <p className="text-xs font-bold tracking-[0.16em] text-primary uppercase">
          Descanso
        </p>
        <h2 className="font-heading mt-2 text-3xl font-extrabold">
          Hoje o corpo constrói.
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          {plan.summary}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/prato"
            className={cn(buttonVariants({ variant: "default" }), "h-12 px-5 text-base")}
          >
            Prato de descanso
          </Link>
          <Link
            href="/treino"
            className={cn(buttonVariants({ variant: "outline" }), "h-12 px-5 text-base")}
          >
            Reposição, se faltou um dia
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-[oklch(0.48_0.1_330)] px-5 py-6 text-primary-foreground shadow-lg shadow-primary/20">
      <p className="text-xs font-bold tracking-[0.16em] uppercase">
        Treino {plan.code} · {plan.minutes}
      </p>
      <h2 className="font-heading mt-2 text-4xl leading-tight font-extrabold">
        {plan.title}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/85">
        {plan.summary}
      </p>
      <Link
        href={`/treino/${plan.id}`}
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "mt-5 h-12 px-5 text-base",
        )}
      >
        Começar
      </Link>
    </section>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  hint,
  progress,
  tone,
  delay,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  progress?: number;
  tone: "rose" | "lilac" | "water" | "plum";
  delay: string;
}) {
  const toneClass = {
    rose: "bg-secondary text-primary",
    lilac: "bg-lilac-soft text-lilac",
    water: "bg-[oklch(0.94_0.03_230)] text-[oklch(0.4_0.08_230)]",
    plum: "bg-primary text-primary-foreground",
  }[tone];
  return (
    <article
      className="melk-rise melk-card p-4 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
          {label}
        </p>
        <span className={cn("grid size-10 place-items-center rounded-2xl", toneClass)}>
          <Icon className="size-5" aria-hidden />
        </span>
      </div>
      <p className="font-heading mt-3 text-3xl leading-none font-extrabold">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
      {progress != null ? (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress <= 0 ? 0 : Math.min(100, progress)}%` }}
          />
        </div>
      ) : null}
    </article>
  );
}

function Habit({
  icon: Icon,
  label,
  on,
  locked = false,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  on: boolean;
  locked?: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        aria-pressed={on}
        disabled={locked}
        onClick={onClick}
        className={cn(
          "flex min-h-16 w-full items-center gap-3 rounded-[1.4rem] border px-4 py-3 text-left transition",
          on
            ? "border-primary/20 bg-secondary"
            : "border-border bg-card hover:bg-secondary/60",
          locked && on && "cursor-default disabled:opacity-100",
        )}
      >
        <span
          className={cn(
            "grid size-7 shrink-0 place-items-center rounded-lg border-2",
            on
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/40 bg-card",
          )}
          aria-hidden
        >
          {on ? <Check className="size-4" /> : null}
        </span>
        <Icon className="size-5 shrink-0 text-primary" aria-hidden />
        <span className="min-w-0 flex-1 text-sm leading-snug font-semibold">{label}</span>
        <span className="shrink-0 text-xs font-bold tracking-wide text-muted-foreground uppercase">
          {on ? "Feito" : "A fazer"}
        </span>
      </button>
    </li>
  );
}
