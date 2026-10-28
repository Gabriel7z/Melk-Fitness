import Image from "next/image";
import Link from "next/link";
import { guideFor, GUIDES, type MachineGuide } from "@/lib/machines";

export function MachineGuideCard({ exerciseId }: { exerciseId: string }) {
  const guide = guideFor(exerciseId);
  if (!guide) return null;
  return (
    <div className="mt-4">
      {guide.photo ? (
        <Image
          src={guide.photo}
          alt={guide.alt}
          width={1280}
          height={960}
          priority
          className="aspect-[4/3] h-auto w-full rounded-2xl object-cover"
        />
      ) : (
        <p className="rounded-2xl bg-sage-soft px-4 py-3 text-sm leading-relaxed text-accent-foreground">
          Este fica de lado para a polia. A foto de frente ensinaria um
          exercício de peito, e peito não entra.
        </p>
      )}
      <p className="mt-4 text-xs font-medium tracking-[0.16em] text-primary uppercase">
        A máquina
      </p>
      <h3 className="font-heading mt-1 text-2xl leading-tight">{guide.machine}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {guide.place}
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-medium">Prepara</p>
          <ol className="mt-2 grid list-decimal gap-2 pl-4 text-sm leading-relaxed">
            {guide.prepare.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
        <div>
          <p className="text-sm font-medium">Faz</p>
          <ol className="mt-2 grid list-decimal gap-2 pl-4 text-sm leading-relaxed">
            {guide.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export function MachineIndex() {
  const days = GUIDES.reduce<string[]>((list, guide) => {
    if (!list.includes(guide.dayLabel)) list.push(guide.dayLabel);
    return list;
  }, []);

  return (
    <div className="grid gap-6">
      {days.map((day) => (
        <section key={day}>
          <h3 className="text-sm font-medium tracking-[0.14em] text-primary uppercase">
            {day}
          </h3>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {GUIDES.filter((guide) => guide.dayLabel === day).map((guide) => (
              <MachineThumb key={guide.exerciseId} guide={guide} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function MachineThumb({ guide }: { guide: MachineGuide }) {
  return (
    <Link
      href={`/treino/${guide.dayId}?ex=${guide.exerciseId}`}
      className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10"
    >
      {guide.photo ? (
        <Image
          src={guide.photo}
          alt={guide.alt}
          width={640}
          height={480}
          className="aspect-[4/3] h-auto w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[4/3] items-center bg-sage-soft px-3 text-sm leading-snug text-accent-foreground">
          De lado para a polia. Sem foto, para não virar peito.
        </div>
      )}
      <span className="block px-3 py-2 text-sm leading-snug">{guide.machine}</span>
    </Link>
  );
}
