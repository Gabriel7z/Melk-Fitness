import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Melk — treino e prato",
    short_name: "Melk",
    description:
      "Treinos e alimentação para glúteo, coxa, barriga definida e peito no lugar.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3ecdf",
    theme_color: "#5c2430",
    lang: "pt-BR",
  };
}
