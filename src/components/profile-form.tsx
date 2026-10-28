"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ACTIVITY } from "@/lib/body";
import { parseNumber } from "@/lib/format";
import { saveProfile, useMounted, useStore } from "@/lib/store";
import type { ActivityLevel, Profile } from "@/lib/types";
import { cn } from "cn";

export type Draft = {
  name: string;
  weight: string;
  height: string;
  age: string;
  activity: ActivityLevel;
};

type FieldError = "weight" | "height" | "age";

const ERRORS: Record<FieldError, string> = {
  weight: "Peso em quilos, tipo 68 ou 68,2.",
  height: "Altura em centímetros, tipo 163.",
  age: "Idade entre 16 e 80, ou deixa em branco.",
};

export function fromProfile(profile: Profile): Draft {
  return {
    name: profile.name,
    weight: formatDraft(profile.weightKg),
    height: profile.heightCm ? formatDraft(profile.heightCm) : "",
    age: profile.age ? String(profile.age) : "",
    activity: profile.activity,
  };
}

function formatDraft(value: number) {
  return String(value).replace(".", ",");
}

export function readDraft(draft: Draft, current: Profile) {
  const errors: FieldError[] = [];
  const weight = parseNumber(draft.weight);
  let height = draft.height.trim() ? parseNumber(draft.height) : null;
  if (height != null && height >= 1.4 && height < 2.3) {
    height = Math.round(height * 100);
  }
  const age = draft.age.trim() ? parseNumber(draft.age) : null;
  if (weight == null || weight < 35 || weight > 180) errors.push("weight");
  if (draft.height.trim() && (height == null || height < 140 || height > 210)) {
    errors.push("height");
  }
  if (draft.age.trim() && (age == null || age < 16 || age > 80)) {
    errors.push("age");
  }
  const profile: Profile = {
    name: draft.name.trim().slice(0, 40),
    weightKg: weight != null && !errors.includes("weight") ? weight : current.weightKg,
    heightCm: height != null && !errors.includes("height") ? height : null,
    age: age != null && !errors.includes("age") ? Math.round(age) : null,
    activity: draft.activity,
    onboarded: true,
  };
  return { errors, profile };
}

export function ProfileForm({
  variant,
  onDraft,
}: {
  variant: "onboarding" | "full";
  onDraft?: (draft: Draft) => void;
}) {
  const mounted = useMounted();
  const { profile } = useStore();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saved, setSaved] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const value = draft ?? fromProfile(mounted ? profile : profile);

  function update(patch: Partial<Draft>) {
    const next = { ...value, ...patch };
    setDraft(next);
    setSaved(false);
    onDraft?.(next);
  }

  function save(requireHeight: boolean) {
    setAttempted(true);
    const { errors, profile: next } = readDraft(value, profile);
    if (requireHeight && !value.height.trim()) {
      return;
    }
    if (errors.length > 0) return;
    if (requireHeight && next.heightCm == null) return;
    saveProfile(next);
    setDraft(null);
    setSaved(true);
  }

  const { errors } = readDraft(value, profile);
  const missingHeight = attempted && variant === "onboarding" && !value.height.trim();
  const visibleErrors = attempted ? errors : [];

  if (!mounted) {
    return <div className="h-48 animate-pulse rounded-3xl bg-card ring-1 ring-foreground/10" />;
  }

  return (
    <form
      className="grid gap-4 rounded-3xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5"
      onSubmit={(event) => {
        event.preventDefault();
        save(variant === "onboarding");
      }}
    >
      <div className="grid gap-1.5">
        <Label htmlFor="nome">Nome</Label>
        <Input
          id="nome"
          value={value.name}
          placeholder="Como te chamam"
          className="h-11 text-base"
          onChange={(event) => update({ name: event.target.value })}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          id="peso"
          label="Peso"
          suffix="kg"
          value={value.weight}
          invalid={visibleErrors.includes("weight")}
          onChange={(weight) => update({ weight })}
        />
        <Field
          id="altura"
          label="Altura"
          suffix="cm"
          value={value.height}
          invalid={visibleErrors.includes("height") || missingHeight}
          onChange={(height) => update({ height })}
        />
        <Field
          id="idade"
          label="Idade"
          suffix="anos"
          value={value.age}
          invalid={visibleErrors.includes("age")}
          onChange={(age) => update({ age })}
        />
      </div>
      {variant === "full" ? (
        <fieldset className="grid gap-2">
          <legend className="mb-1 text-sm font-medium">Dia a dia</legend>
          {(Object.keys(ACTIVITY) as ActivityLevel[]).map((key) => {
            const selected = value.activity === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={selected}
                onClick={() => update({ activity: key })}
                className={cn(
                  "rounded-2xl border px-3 py-3 text-left",
                  selected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background",
                )}
              >
                <span className="block text-sm font-medium">
                  {ACTIVITY[key].label}
                </span>
                <span className="block text-sm text-muted-foreground">
                  {ACTIVITY[key].detail}
                </span>
              </button>
            );
          })}
        </fieldset>
      ) : null}
      {visibleErrors.length > 0 || missingHeight ? (
        <div role="alert" className="text-sm text-primary">
          {missingHeight ? <p>{ERRORS.height}</p> : null}
          {visibleErrors.map((error) => (
            <p key={error}>{ERRORS[error]}</p>
          ))}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="lg" className="h-11 px-4 text-base">
          {variant === "onboarding" ? "Ver meu plano" : "Guardar"}
        </Button>
        {variant === "onboarding" ? (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-11 px-4 text-base"
            onClick={() => {
              saveProfile({ ...profile, name: value.name.trim(), onboarded: true });
              setSaved(true);
            }}
          >
            Agora não
          </Button>
        ) : null}
      </div>
      {saved ? (
        <p className="text-sm text-sage">Guardado neste celular.</p>
      ) : null}
    </form>
  );
}

function Field({
  id,
  label,
  suffix,
  value,
  invalid,
  onChange,
}: {
  id: string;
  label: string;
  suffix: string;
  value: string;
  invalid: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          inputMode="decimal"
          value={value}
          aria-invalid={invalid}
          className="h-11 pr-14 text-base"
          onChange={(event) => onChange(event.target.value)}
        />
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
          {suffix}
        </span>
      </div>
    </div>
  );
}
