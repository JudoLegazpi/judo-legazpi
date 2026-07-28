import { createFileRoute } from "@tanstack/react-router";
import { TournamentsPage } from "@/components/site/pages";
import { getSiteContent } from "@/lib/site-content.functions";

export const Route = createFileRoute("/torneos")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: "Torneos del club — Club Judo Legazpi" },
      {
        name: "description",
        content: "Torneos de judo organizados por el Club Judo Legazpi: ediciones, fechas y resultados.",
      },
      { property: "og:title", content: "Torneos del club — Club Judo Legazpi" },
      { property: "og:description", content: "Competiciones que organizamos en Legazpi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <TournamentsPage locale="es" content={Route.useLoaderData()} />,
});
