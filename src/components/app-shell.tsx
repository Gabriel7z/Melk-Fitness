"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dumbbell,
  House,
  Scale,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "cn";
import { formatWeight } from "@/lib/format";
import { useMounted, useStore } from "@/lib/store";

const NAV = [
  { href: "/", label: "Início", icon: House },
  { href: "/treino", label: "Treino", icon: Dumbbell },
  { href: "/prato", label: "Prato", icon: UtensilsCrossed },
  { href: "/peso", label: "Peso", icon: Scale },
  { href: "/evolucao", label: "Medidas", icon: TrendingUp },
];

function isActive(href: string, path: string) {
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}

function WeightPill({ value }: { value: string }) {
  return (
    <div className="rounded-2xl bg-primary px-3 py-2 text-primary-foreground shadow-lg shadow-primary/20">
      <p className="text-[10px] font-semibold tracking-[0.16em] uppercase">
        Agora
      </p>
      <p className="font-heading text-lg leading-none font-bold">{value}</p>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const mounted = useMounted();
  const { profile } = useStore();
  const weight = mounted ? formatWeight(profile.weightKg) : "68 kg";

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border bg-card/90 px-5 py-7 md:flex">
        <Link href="/" className="font-heading text-3xl leading-none font-extrabold text-primary">
          Melk Fitness
        </Link>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Meta: recomposição corporal.
        </p>
        <div className="mt-6">
          <WeightPill value={weight} />
        </div>
        <nav className="mt-8 flex flex-col gap-1" aria-label="Seções">
          {NAV.map((item) => {
            const active = isActive(item.href, path);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition",
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-foreground hover:bg-secondary",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon />
                {item.label === "Medidas" ? "Evolução" : item.label}
              </Link>
            );
          })}
        </nav>
        <p className="mt-auto text-xs leading-relaxed text-muted-foreground">
          Painel pessoal. Os dados ficam neste celular.
        </p>
      </aside>

      <div className="min-w-0">
        <header className="flex items-start justify-between gap-3 px-4 pt-5 md:hidden">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
              Painel pessoal
            </p>
            <Link
              href="/"
              className="font-heading mt-1 block text-[1.7rem] leading-none font-extrabold text-primary"
            >
              Melk Fitness
            </Link>
            <p className="mt-2 max-w-[16rem] text-sm leading-snug text-muted-foreground">
              Meta: recomposição corporal.
            </p>
          </div>
          <WeightPill value={weight} />
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 pt-6 pb-28 md:px-8 md:pt-8 md:pb-16">
          {children}
          <p className="mt-16 max-w-xl text-xs leading-relaxed text-muted-foreground">
            Plano geral de recomposição. Não substitui médico, nutricionista
            nem um profissional de educação física. Dor na articulação, lesão,
            gestação ou qualquer condição de saúde pede um ajuste presencial.
          </p>
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden"
        aria-label="Seções"
      >
        <ul className="grid grid-cols-5 px-1 pt-1 pb-[max(0.4rem,env(safe-area-inset-bottom))]">
          {NAV.map((item) => {
            const active = isActive(item.href, path);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1.5 text-[12px] font-semibold",
                    active
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="size-5" aria-hidden />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
