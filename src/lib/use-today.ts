"use client";

import { saoPauloToday, type CivilDate } from "@/lib/dates";
import { useMounted } from "@/lib/store";

export function useToday(): CivilDate | null {
  const mounted = useMounted();
  if (!mounted) return null;
  return saoPauloToday();
}
