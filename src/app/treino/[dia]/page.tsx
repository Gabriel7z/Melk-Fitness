"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { WorkoutPlayer } from "@/components/workout-player";
import { getWorkout } from "@/lib/workouts";

export default function TreinoDiaPage() {
  const params = useParams<{ dia: string }>();
  const raw = params.dia;
  const id = Array.isArray(raw) ? raw[0] : raw;
  const day = id ? getWorkout(id) : undefined;

  if (!day) {
    return (
      <div>
        <h1 className="font-heading text-4xl">Esse treino não está no plano.</h1>
        <Link
          href="/treino"
          className="mt-4 inline-block text-sm font-medium text-primary"
        >
          Voltar para a semana
        </Link>
      </div>
    );
  }

  return <WorkoutPlayer key={day.id} day={day} />;
}
