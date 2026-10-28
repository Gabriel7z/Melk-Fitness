import { TreinoDia } from "./treino-dia";
import { WORKOUTS } from "@/lib/workouts";

export function generateStaticParams() {
  return WORKOUTS.map((day) => ({ dia: day.id }));
}

export default function TreinoDiaPage() {
  return <TreinoDia />;
}
