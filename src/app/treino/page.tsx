"use client";

import { PageHeader, SectionTitle } from "@/components/heading";
import { MachineIndex } from "@/components/machine-guide";
import { WeekList, weekProgress } from "@/components/week-list";
import { useStore } from "@/lib/store";
import { useToday } from "@/lib/use-today";
import { DONT, PROGRESS_RULES } from "@/lib/workouts";

export default function TreinoPage() {
  const today = useToday();
  const { sessions } = useStore();
  const progress = today
    ? weekProgress(sessions, today)
    : { main: 0, extra: false };

  return (
    <div>
      <PageHeader eyebrow="Treinos Melk" title="Quatro dias constroem. O sábado é extra.">
        Segunda e quinta são de glúteo. Terça e sexta são só de coxa. Cada
        exercício tem a foto da máquina e o passo a passo. Não tem supino.
      </PageHeader>

      <p className="text-sm text-muted-foreground">
        {progress.main} de 4 treinos nesta semana
        {progress.extra ? ". O de postura também foi feito." : "."} Perdeu um
        dia? Faz ele no sábado e deixa o extra para outra semana. Não junta
        dois treinos de perna.
      </p>

      <div className="mt-5">
        <WeekList />
      </div>

      <SectionTitle hint="Toca na foto. O treino abre já nesse exercício.">
        Como achar a máquina
      </SectionTitle>
      <MachineIndex />

      <SectionTitle hint="O plano só muda o corpo se a carga sobe com a forma boa.">
        Como evoluir
      </SectionTitle>
      <div className="grid gap-2">
        {PROGRESS_RULES.map((rule) => (
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

      <SectionTitle>O que não entra</SectionTitle>
      <ul className="grid gap-2">
        {DONT.map((item) => (
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
