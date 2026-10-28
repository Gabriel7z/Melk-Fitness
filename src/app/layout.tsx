import type { Metadata, Viewport } from "next";
import { Nunito, Poppins } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Melk Fitness — treino e prato",
  description:
    "Painel pessoal de treino e alimentação para glúteo e coxa maiores, barriga mais chapada e peito no lugar.",
  applicationName: "Melk Fitness",
  appleWebApp: {
    capable: true,
    title: "Melk Fitness",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#7a3148",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${nunito.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
