"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/heading";
import { ProfileForm } from "@/components/profile-form";
import { WeekList, weekProgress } from "@/components/week-list";
import { assess, proteinGrams, waterMl } from "@/lib/body";
import { ScanCard } from "@/components/scan-card";
import { formatLongDate } from "@/lib/dates";
import { firstName, formatNumber, formatWeight } from "@/lib/format";
import { setHabit, useStore } from "@/lib/store";
import { useToday } from "@/lib/use-today";
import { isWorkout, planForWeekday } from "@/lib/workouts";
import { cn } from "cn";

const GOALS = [
  {
    title: "Bumbum maior",
    text: "Dois dias de glúteo, com elevação pélvica pesada e stiff.",
  },
  {
    title: "Coxa mais grossa",
    text: "Agachamento, leg press, extensora, posterior e adutora.",
  },
  {
    title: "Barriga mais chapada",
    text: "A gordura, os 31%, é que sai. O peso fica perto de 65 kg.",
  },
  {
    title: "Peito no lugar",
    text: "Supino e inclinado duas vezes na semana, com proteína alta.",
  },
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

  return (
    <div>
      <PageHeader
        eyebrow={today ? formatLongDate(today.key) : "Hoje"}
        title={name ? `Oi, ${name}` : "Oi"}
      >
        O peso fica perto de 65 kg. A gordura desce, glúteo e coxa sobem, o
        peito fica. Quatro treinos na semana.
      </PageHeader>

      {!today ? (
        <div className="h-56 animate-pulse rounded-3xl bg-card ring-1 ring-foreground/10" />
      ) : (
        <Today planIsWorkout={isWorkout(plan)} plan={plan} />
      )}

      <ScanCard compact />

      {today && !profile.onboarded ? (
        <section className="mt-4 grid gap-3">
          <p className="text-sm leading-relaxed text-muted-foreground">
            O peso já está em {formatWeight(profile.weightKg)}. Com a altura, o
            Melk crava a faixa de peso e o quanto comer.
          </p>
          <ProfileForm variant="onboarding" />
        </section>
      ) : null}

      <p className="mt-4 text-sm text-muted-foreground">
        {progress.main} de 4 treinos nesta semana
        {progress.extra ? ", e o sábado também." : "."}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2">
        {GOALS.map((goal) => (
          <article
            key={goal.title}
            className="rounded-3xl bg-card p-4 ring-1 ring-foreground/10"
          >
            <h2 className="font-heading text-xl leading-tight">{goal.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {goal.text}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat
          label="Peso"
          value={today ? formatWeight(profile.weightKg) : "65 kg"}
        />
        <Stat label="Proteína" value={`${protein} g`} />
        <Stat label="Água" value={`${formatNumber(water / 1000, 1)} L`} />
      </div>

      {today && profile.onboarded && !assessment ? (
        <Link
          href="/peso"
          className="mt-4 block rounded-3xl bg-primary px-4 py-4 text-primary-foreground"
        >
          <span className="block font-medium">Falta a altura</span>
          <span className="mt-1 block text-sm text-primary-foreground/80">
            65 kg muda de sentido entre 1,60 m e 1,70 m. A tabela de peso
            ideal está pronta.
          </span>
        </Link>
      ) : null}

      {assessment ? (
        <Link
          href="/peso"
          className="mt-4 block rounded-3xl bg-card px-4 py-4 ring-1 ring-foreground/10"
        >
          <span className="text-xs font-medium tracking-[0.16em] text-primary uppercase">
            {assessment.modeLabel}
          </span>
          <span className="font-heading mt-1 block text-2xl leading-tight">
            {assessment.headline}
          </span>
          <span className="mt-2 block text-sm text-muted-foreground">
            Cerca de {formatNumber(assessment.kcal)} kcal, sem subir o peso.
            Abre a leitura da avaliação.
          </span>
        </Link>
      ) : null}

      <h2 className="font-heading mt-10 text-3xl">Hoje, sem complicar</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Habit
          label={
            isWorkout(plan)
              ? finishedToday
                ? "Treino feito"
                : "Treino do dia"
              : "Caminhada, se quiser"
          }
          on={habit.move || finishedToday}
          locked={finishedToday}
          onClick={() => today && setHabit(today.key, { move: !habit.move })}
        />
        <Habit
          label={`Proteína perto de ${protein} g`}
          on={habit.protein}
          onClick={() => today && setHabit(today.key, { protein: !habit.protein })}
        />
        <Habit
          label={`Água, ${formatNumber(water / 1000, 1)} litros`}
          on={habit.water}
          onClick={() => today && setHabit(today.key, { water: !habit.water })}
        />
        <Habit
          label="Dormir de verdade"
          on={habit.sleep}
          onClick={() => today && setHabit(today.key, { sleep: !habit.sleep })}
        />
      </div>

      <div className="mt-8 flex items-end justify-between gap-3">
        <h2 className="font-heading text-3xl">Semana</h2>
        <Link href="/treino" className="text-sm font-medium text-primary">
          Abrir treinos
        </Link>
      </div>
      <div className="mt-3">
        <WeekList compact />
      </div>
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
      <section className="relative overflow-hidden rounded-3xl bg-primary px-5 py-6 text-primary-foreground">
        <p className="text-xs font-medium tracking-[0.18em] uppercase">
          Descanso
        </p>
        <h2 className="font-heading mt-2 text-4xl italic">
          Hoje o corpo constrói.
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/85">
          {plan.summary}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/prato"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "h-11 px-4 text-base",
            )}
          >
            Prato de descanso
          </Link>
          <Link
            href="/treino"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 border-white/30 bg-transparent px-4 text-base text-primary-foreground hover:bg-white/10 hover:text-primary-foreground",
            )}
          >
            Reposição, se faltou um dia
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-primary px-5 py-6 text-primary-foreground">
      <p className="text-xs font-medium tracking-[0.18em] uppercase">
        Treino {plan.code} · {plan.minutes}
      </p>
      <h2 className="font-heading mt-2 text-4xl leading-tight italic md:text-5xl">
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-card px-3 py-3 ring-1 ring-foreground/10">
      <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="font-heading mt-1 text-2xl">{value}</p>
    </div>
  );
}

function Habit({
  label,
  on,
  locked = false,
  onClick,
}: {
  label: string;
  on: boolean;
  locked?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={locked}
      onClick={onClick}
      className={cn(
        "rounded-3xl border px-4 py-3 text-left text-sm font-medium",
        on
          ? "border-transparent bg-sage-soft text-accent-foreground"
          : "border-border bg-card",
        locked && "opacity-100",
      )}
    >
      <span className="mr-2 inline-block size-2.5 rounded-full bg-current align-middle" />
      {label}
    </button>
  );
}
