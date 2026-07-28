import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/site/pages";
import { getSiteContent } from "@/lib/site-content.functions";

export const Route = createFileRoute("/")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: "Club Judo Legazpi — Judo para todas las edades en Legazpi" },
      {
        name: "description",
        content:
          "Club de judo en Legazpi (Gipuzkoa) desde 1978. Horarios por edades, calendario de competiciones, torneos y cuerpo técnico titulado.",
      },
      { property: "og:title", content: "Club Judo Legazpi" },
      {
        property: "og:description",
        content: "Judo y valores en Legazpi desde 1978. Horarios, calendario y torneos del club.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const content = Route.useLoaderData();
  return <HomePage locale="es" content={content} />;
}
