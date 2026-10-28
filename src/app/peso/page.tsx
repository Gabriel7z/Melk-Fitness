"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader, SectionTitle } from "@/components/heading";
import {
  fromProfile,
  ProfileForm,
  readDraft,
  type Draft,
} from "@/components/profile-form";
import {
  assess,
  bmiLabel,
  bmiOf,
  closestHeight,
  HEIGHT_ROWS,
} from "@/lib/body";
import { ScanCard } from "@/components/scan-card";
import { BODY_SCAN, scanMatches } from "@/lib/scan";
import { formatNumber, formatWeight } from "@/lib/format";
import { useMounted, useStore } from "@/lib/store";
import { cn } from "cn";

export default function PesoPage() {
  const mounted = useMounted();
  const { profile } = useStore();
  const [draft, setDraft] = useState<Draft | null>(null);
  const reading = readDraft(draft ?? fromProfile(profile), profile);
  const live = reading.profile;
  const assessment = mounted ? assess(live) : null;
  const highlight = closestHeight(live.heightCm);
  const usingScan = scanMatches(live);

  return (
    <div>
      <PageHeader
        eyebrow="A meta dela"
        title={
          usingScan
            ? "Recomposição corporal"
            : `${formatWeight(live.weightKg)} não é uma sentença.`
        }
      >
        {usingScan
          ? `A meta é recomposição: perder gordura e ganhar músculo no glúteo e na coxa, com o peito no lugar. Com 1,70 m, ${formatWeight(live.weightKg)} já é um peso de ficar. A avaliação de ${BODY_SCAN.dateLabel} mostrou gordura alta (${formatNumber(BODY_SCAN.fatPercent, 1)}%) e músculo esquelético excelente (${formatNumber(BODY_SCAN.skeletalMusclePercent, 1)}%). A balança fica entre ${formatNumber(live.weightKg - 2, 0)} e ${formatNumber(live.weightKg, 0)} kg.`
          : "O mesmo peso é definição em uma altura e é ajuste em outra. Para glúteo maior, coxa grossa, barriga chapada e peito no lugar, a faixa importa mais do que um número redondo."}
      </PageHeader>

      {usingScan ? <ScanCard /> : null}

      {usingScan ? (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          A balança pediu para perder {formatNumber(BODY_SCAN.scaleCutKg, 1)} kg
          e ir para perto de {BODY_SCAN.scaleTargetKg} kg. Isso secaria peito e
          glúteo junto. O desenho certo é outro: gordura de{" "}
          {formatNumber(BODY_SCAN.fatPercent, 1)}% para perto de{" "}
          {BODY_SCAN.fatGoalPercent}%, mais músculo na coxa e no glúteo em cima
          dos {formatNumber(BODY_SCAN.skeletalMuscleKg, 1)} kg que já estão
          excelentes, peso quase no mesmo lugar. Se a fita mostrar cintura menor
          e quadril igual ou maior, está dando certo mesmo com a balança parada.
        </p>
      ) : null}

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {usingScan
          ? `A tabela só situa o IMC. Em 1,70 m, ${formatWeight(live.weightKg)} continua na faixa saudável. Ganhar músculo aqui não precisa aparecer como peso a mais.`
          : `A tabela usa o peso de hoje, ${mounted ? formatWeight(live.weightKg) : "68 kg"}. IMC 22 é só o meio da faixa saudável. Quem ganha músculo pesa mais e pode estar definida acima disso.`}
      </p>

      <div className="mt-4 overflow-x-auto rounded-3xl bg-card ring-1 ring-foreground/10">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <caption className="px-4 py-3 text-left text-xs tracking-[0.14em] text-muted-foreground uppercase">
            Peso de hoje em cada altura
          </caption>
          <thead className="text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-2 font-medium">Altura</th>
              <th className="px-4 py-2 font-medium">IMC hoje</th>
              <th className="px-4 py-2 font-medium">Faixa saudável</th>
              <th className="px-4 py-2 font-medium">Meio da faixa</th>
            </tr>
          </thead>
          <tbody>
            {HEIGHT_ROWS.map((height) => {
              const bmi = bmiOf(live.weightKg, height);
              const meters = height / 100;
              const selected = highlight === height;
              return (
                <tr
                  key={height}
                  className={cn(selected && "bg-primary/10")}
                >
                  <th className="px-4 py-3 font-medium" scope="row">
                    {formatNumber(height / 100, 2)} m
                    {selected ? (
                      <span className="ml-2 text-xs font-medium text-primary">
                        a sua
                      </span>
                    ) : null}
                  </th>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        bmi >= 18.5 && bmi < 25 ? "text-sage" : "text-primary",
                      )}
                    >
                      {formatNumber(bmi, 1)}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {bmiLabel(bmi)}
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {formatNumber(18.5 * meters * meters, 1)}–
                    {formatNumber(24.9 * meters * meters, 1)} kg
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {formatNumber(22 * meters * meters, 1)} kg
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <SectionTitle hint="Altura, idade e rotina mudam a comida. O peso você já pode corrigir aqui.">
        A sua conta
      </SectionTitle>
      <ProfileForm
        variant="full"
        onDraft={(next) => setDraft(next)}
      />

      {assessment ? (
        <section className="mt-4 rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
          <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">
            {assessment.modeLabel} · IMC {formatNumber(assessment.bmi, 1)}
          </p>
          <h2 className="font-heading mt-2 text-3xl leading-tight">
            {assessment.headline}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {assessment.detail}
          </p>
          <BmiBar bmi={assessment.bmi} />
          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Number
              label="Faixa saudável"
              value={`${formatNumber(assessment.healthyMin, 1)}–${formatNumber(assessment.healthyMax, 1)} kg`}
            />
            <Number
              label="Para mirar"
              value={`${formatNumber(assessment.goalLow, 1)}–${formatNumber(assessment.goalHigh, 1)} kg`}
            />
            <Number label="Comer" value={`${formatNumber(assessment.kcal)} kcal`} />
            <Number label="Proteína" value={`${assessment.protein} g`} />
          </dl>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Gasto estimado em {formatNumber(assessment.tdee)} kcal. Carboidrato
            perto de {assessment.carbs} g, gordura perto de {assessment.fat} g,
            água {formatNumber(assessment.waterMl / 1000, 1)} L.
            {assessment.bmrMeasured
              ? " A idade não entrou: o repouso veio da bioimpedância."
              : assessment.ageAssumed
                ? " Usei 25 anos enquanto a idade não entra. Muda pouco a conta."
                : ""}
            {assessment.kcalNote ? ` ${assessment.kcalNote}` : ""}
          </p>
          {assessment.age < 18 ? (
            <p className="mt-2 text-sm text-primary">
              Menos de 18 anos: mostra este plano para um profissional antes de
              seguir qualquer déficit.
            </p>
          ) : null}
          <Link href="/prato" className="mt-4 inline-block text-sm font-medium text-primary">
            Montar o prato com esses números
          </Link>
        </section>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Quando a altura entrar, aparece o modo do plano: déficit leve,
          recomposição, manutenção ou um pouco mais de comida. Sem altura, a
          tabela acima já mostra onde o peso de hoje cai.
        </p>
      )}

      <SectionTitle hint="A foto e a fita contam a história que a balança esconde.">
        Como saber se está dando certo
      </SectionTitle>
      <ul className="grid gap-2 text-sm leading-relaxed">
        <li className="rounded-3xl bg-card px-4 py-3 ring-1 ring-foreground/10">
          Cintura desce, quadril e coxa seguram ou sobem, peito fica. É o
          desenho certo, mesmo se o peso quase não mudar.
        </li>
        <li className="rounded-3xl bg-card px-4 py-3 ring-1 ring-foreground/10">
          Tudo desce junto, inclusive peito e glúteo: a comida está baixa.
          Sobe o arroz, não tira o frango.
        </li>
        <li className="rounded-3xl bg-card px-4 py-3 ring-1 ring-foreground/10">
          A balança sobe e a cintura sobe junto: segura azeite e castanha por
          uma semana e mantém a proteína.
        </li>
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        {usingScan
          ? "O repouso veio da bioimpedância de balança, que estima gordura e músculo. Não é um exame de laboratório. A faixa de IMC é a da OMS."
          : "Conta de gasto de Mifflin-St Jeor e faixa de IMC da OMS. É ponto de partida, não exame."}
      </p>
    </div>
  );
}

function BmiBar({ bmi }: { bmi: number }) {
  const left = Math.min(100, Math.max(0, ((bmi - 16) / 18) * 100));
  const healthyStart = ((18.5 - 16) / 18) * 100;
  const healthyWidth = ((24.9 - 18.5) / 18) * 100;
  return (
    <div className="mt-5">
      <div className="relative h-2 rounded-full bg-muted">
        <div
          className="absolute inset-y-0 rounded-full bg-sage/25"
          style={{ left: `${healthyStart}%`, width: `${healthyWidth}%` }}
        />
        <div
          className="absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full bg-primary ring-2 ring-card"
          style={{ left: `calc(${left}% - 7px)` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
        <span>18,5</span>
        <span>faixa saudável</span>
        <span>24,9</span>
      </div>
    </div>
  );
}

function Number({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="font-heading mt-1 text-xl leading-tight">{value}</dd>
    </div>
  );
}
