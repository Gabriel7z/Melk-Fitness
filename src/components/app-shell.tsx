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

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const mounted = useMounted();
  const { profile } = useStore();

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border/80 bg-card/80 px-5 py-7 md:flex">
        <Link href="/" className="font-heading text-5xl text-primary italic">
          melk
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">treino e prato</p>
        <nav className="mt-10 flex flex-col gap-1">
          {NAV.map((item) => {
            const active = isActive(item.href, path);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted",
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
          Feito para a vida de academia dela. Os dados ficam neste celular.
        </p>
      </aside>

      <div className="min-w-0">
        <header className="flex items-end justify-between px-4 pt-4 md:hidden">
          <Link href="/" className="font-heading text-4xl text-primary italic">
            melk
          </Link>
          <p className="pb-1 text-xs tracking-[0.14em] text-muted-foreground uppercase">
            {mounted ? formatWeight(profile.weightKg) : "65 kg"}
          </p>
        </header>
        <main className="mx-auto w-full max-w-3xl px-4 pt-5 pb-28 md:px-8 md:pt-8 md:pb-16">
          {children}
          <p className="mt-14 max-w-xl text-xs leading-relaxed text-muted-foreground">
            Plano geral de recomposição. Não substitui médico, nutricionista
            nem um profissional de educação física. Dor na articulação, lesão,
            gestação ou qualquer condição de saúde pede um ajuste presencial.
          </p>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden">
        <ul className="grid grid-cols-5 px-1 pt-1 pb-[max(0.35rem,env(safe-area-inset-bottom))]">
          {NAV.map((item) => {
            const active = isActive(item.href, path);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-medium",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="size-5" />
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
