import type { MetadataRoute } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Melk Fitness — treino e prato",
    short_name: "Melk Fitness",
    description:
      "Treinos e alimentação para glúteo, coxa, barriga definida e peito no lugar.",
    start_url: basePath ? `${basePath}/` : "/",
    display: "standalone",
    background_color: "#f8f3f6",
    theme_color: "#7a3148",
    lang: "pt-BR",
  };
}
