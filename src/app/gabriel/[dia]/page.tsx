import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/heading";
import { GABRIEL_DAYS, gabrielDay } from "@/lib/gabriel";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function photoSrc(path: string) {
  if (!path || !basePath || path.startsWith(basePath)) return path;
  return `${basePath}${path}`;
}

export function generateStaticParams() {
  return GABRIEL_DAYS.map((day) => ({ dia: day.id }));
}

export default async function GabrielDiaPage({
  params,
}: {
  params: Promise<{ dia: string }>;
}) {
  const { dia } = await params;
  const day = gabrielDay(dia);
  if (!day) notFound();

  return (
    <div>
      <PageHeader eyebrow={`Gabriel Ferreira · sessão ${day.code}`} title={day.title}>
        {day.when}. {day.summary} Começa com 5 minutos na esteira ou na bike,
        andando.
      </PageHeader>
      <Link
        href="/gabriel"
        className="inline-flex min-h-11 items-center text-sm font-semibold text-primary"
      >
        Ver as três sessões
      </Link>
      <div className="mt-6 grid gap-4">
        {day.exercises.map((exercise) => (
          <article
            key={exercise.id}
            id={exercise.id}
            className="scroll-mt-24 rounded-3xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5"
          >
            <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">
              {exercise.dose}
            </p>
            <h2 className="font-heading mt-1 text-3xl leading-tight">
              {exercise.name}
            </h2>
            <p className="mt-3 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
              A máquina
            </p>
            <p className="font-heading mt-1 text-2xl leading-tight">
              {exercise.machine}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {exercise.where}
            </p>
            {exercise.photo ? (
              <Image
                src={photoSrc(exercise.photo)}
                alt={exercise.alt}
                width={1280}
                height={960}
                className="mt-4 aspect-[4/3] h-auto w-full rounded-2xl object-cover"
              />
            ) : null}
            <p className="mt-4 text-sm leading-relaxed">{exercise.cue}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {exercise.stop}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
