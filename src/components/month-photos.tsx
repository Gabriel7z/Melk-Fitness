"use client";

import { useEffect, useState } from "react";
import { useSyncExternalStore } from "react";
import {
  deleteMonthPhoto,
  getPhotoRevision,
  readMonthPhoto,
  saveMonthPhoto,
  subscribePhotos,
  type PhotoSlot,
} from "@/lib/photos";
import { formatMonth } from "@/lib/rhythm";
import { cn } from "cn";

const SLOTS: { id: PhotoSlot; label: string }[] = [
  { id: "frente", label: "Frente" },
  { id: "lado", label: "Lado" },
];

export function MonthPhotos({
  month,
  previous,
}: {
  month: string;
  previous: string | null;
}) {
  const revision = useSyncExternalStore(
    subscribePhotos,
    getPhotoRevision,
    () => 0,
  );
  const current = useShots(month, revision);
  const before = useShots(previous ?? "", revision);
  const [error, setError] = useState("");
  const hasBefore = Boolean(before.frente || before.lado);

  return (
    <div className="mt-4">
      <p className="text-sm font-medium">Foto no mesmo lugar</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        De manhã, na mesma parede e na mesma luz. Celular na altura do umbigo,
        sempre a um passo da marca no chão. Frente e lado, roupa parecida, sem
        pose. A balança não mostra o glúteo.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {SLOTS.map((slot) => (
          <div key={slot.id} className="grid gap-2">
            <p className="text-sm font-medium">{slot.label}</p>
            <PhotoFrame
              id={`foto-${slot.id}`}
              url={current[slot.id]}
              alt={`Foto de ${slot.label.toLowerCase()} deste mês`}
              empty={`Tirar a de ${slot.label.toLowerCase()}`}
              onPick={async (file) => {
                try {
                  await saveMonthPhoto(month, slot.id, file);
                  setError("");
                } catch {
                  setError("Não consegui guardar a foto neste celular.");
                }
              }}
              onClear={
                current[slot.id]
                  ? () => {
                      deleteMonthPhoto(month, slot.id).catch(() => {
                        setError("Não consegui apagar a foto.");
                      });
                    }
                  : undefined
              }
            />
            {hasBefore ? (
              <div>
                <p className="text-xs text-muted-foreground">
                  {shortMonth(previous ?? "")}
                </p>
                {before[slot.id] ? (
                  // A foto vem do celular, em blob:. O otimizador do Next não serve isso.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={before[slot.id] ?? ""}
                    alt={`${slot.label} de ${shortMonth(previous ?? "")}`}
                    className="mt-1 aspect-[3/4] w-full rounded-2xl object-cover"
                  />
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">Sem esta foto.</p>
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-primary">
          {error}
        </p>
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        As fotos ficam neste celular. Não sobem para lugar nenhum.
        {hasBefore
          ? " A de baixo é o mês anterior, no mesmo enquadramento."
          : " No próximo mês, esta foto aparece embaixo para comparar."}
      </p>
    </div>
  );
}

function PhotoFrame({
  id,
  url,
  alt,
  empty,
  onPick,
  onClear,
}: {
  id: string;
  url: string | null;
  alt: string;
  empty: string;
  onPick: (file: File) => void;
  onClear?: () => void;
}) {
  return (
    <div>
      <label
        className={cn(
          "relative block overflow-hidden rounded-2xl bg-muted",
          url ? "" : "flex aspect-[3/4] items-end",
        )}
      >
        {url ? (
          // A foto vem do celular, em blob:. O otimizador do Next não serve isso.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={alt}
            className="aspect-[3/4] w-full object-cover"
          />
        ) : (
          <span className="p-3 text-sm leading-snug text-muted-foreground">
            {empty}
          </span>
        )}
        <input
          id={id}
          type="file"
          accept="image/*"
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) onPick(file);
          }}
        />
        <span className="absolute right-2 bottom-2 rounded-full bg-card/95 px-2.5 py-1 text-xs font-medium">
          {url ? "Trocar" : "Escolher"}
        </span>
      </label>
      {onClear ? (
        <button
          type="button"
          className="mt-1 text-xs text-muted-foreground underline-offset-4 hover:underline"
          onClick={onClear}
        >
          Apagar
        </button>
      ) : null}
    </div>
  );
}

function useShots(month: string, revision: number) {
  const [shots, setShots] = useState<{ frente: string | null; lado: string | null }>({
    frente: null,
    lado: null,
  });

  useEffect(() => {
    if (!month) return;
    let cancel = false;
    const urls: string[] = [];
    Promise.all([
      readMonthPhoto(month, "frente"),
      readMonthPhoto(month, "lado"),
    ])
      .then(([frente, lado]) => {
        if (cancel) return;
        const next = {
          frente: frente ? URL.createObjectURL(frente) : null,
          lado: lado ? URL.createObjectURL(lado) : null,
        };
        if (next.frente) urls.push(next.frente);
        if (next.lado) urls.push(next.lado);
        setShots(next);
      })
      .catch(() => {
        if (!cancel) setShots({ frente: null, lado: null });
      });
    return () => {
      cancel = true;
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [month, revision]);

  return shots;
}

function shortMonth(month: string) {
  const label = formatMonth(month);
  const name = label.split(" de ")[0] ?? label;
  return name.charAt(0).toUpperCase() + name.slice(1);
}
