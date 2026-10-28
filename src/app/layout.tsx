import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Melk — treino e prato",
  description:
    "Treinos Melk e alimentação para glúteo e coxa maiores, barriga mais chapada e peito no lugar.",
  applicationName: "Melk",
  appleWebApp: {
    capable: true,
    title: "Melk",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#5c2430",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
