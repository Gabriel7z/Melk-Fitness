import Link from "next/link";
import { BODY_SCAN } from "@/lib/scan";
import { formatNumber } from "@/lib/format";

const STATS = [
  ["Gordura", `${formatNumber(BODY_SCAN.fatPercent, 1)}%`],
  ["Gordura em kg", `${formatNumber(BODY_SCAN.fatKg, 1)} kg`],
  ["Músculo esquelético", `${formatNumber(BODY_SCAN.skeletalMusclePercent, 1)}%`],
  ["Músculo em kg", `${formatNumber(BODY_SCAN.skeletalMuscleKg, 1)} kg`],
  ["Massa muscular", `${formatNumber(BODY_SCAN.muscleKg, 1)} kg`],
  ["Proteína", `${formatNumber(BODY_SCAN.proteinPercent, 1)}%`],
  ["Gordura visceral", String(BODY_SCAN.visceralFat)],
  ["Metabolismo", `${formatNumber(BODY_SCAN.bmr)} kcal`],
];

export function ScanCard({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <Link
        href="/peso"
        className="mt-4 block rounded-3xl bg-card px-4 py-4 ring-1 ring-foreground/10"
      >
        <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">
          Avaliação · {BODY_SCAN.dateLabel}
        </p>
        <p className="font-heading mt-1 text-2xl leading-tight">
          {formatNumber(BODY_SCAN.fatPercent, 1)}% de gordura em{" "}
          {formatNumber(BODY_SCAN.weightKg, 2)} kg
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          1,70 m, IMC {formatNumber(BODY_SCAN.bmi, 1)}. Gordura alta. Músculo
          esquelético {formatNumber(BODY_SCAN.skeletalMusclePercent, 1)}%, já
          excelente. Proteína da ficha,{" "}
          {formatNumber(BODY_SCAN.proteinPercent, 1)}%, veio baixa. A meta é
          recomposição corporal: peso parado, gordura descendo, músculo no
          glúteo e na coxa.
        </p>
      </Link>
    );
  }

  return (
    <section className="rounded-3xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5">
      <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">
        {BODY_SCAN.name} · {BODY_SCAN.dateLabel}
      </p>
      <h2 className="font-heading mt-1 text-3xl leading-tight">
        {BODY_SCAN.reading}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Naquele dia: {formatNumber(BODY_SCAN.weightKg, 2)} kg, 1,70 m, IMC{" "}
        {formatNumber(BODY_SCAN.bmi, 1)}. A ficha já tem um tempo. Em
        28/10/2026 a balança marcou 68 kg. Gordura veio alta, músculo
        esquelético excelente, proteína baixa.
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STATS.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-secondary px-3 py-3">
            <dt className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              {label}
            </dt>
            <dd className="font-heading mt-1 text-xl leading-tight font-bold">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
