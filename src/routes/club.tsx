import { createFileRoute } from "@tanstack/react-router";
import { ClubPage } from "@/components/site/pages";
import { getSiteContent } from "@/lib/site-content.functions";

export const Route = createFileRoute("/club")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: "El club — Club Judo Legazpi" },
      {
        name: "description",
        content: "Historia, valores e instalaciones del Club Judo Legazpi, en el polideportivo municipal de Legazpi.",
      },
      { property: "og:title", content: "El club — Club Judo Legazpi" },
      { property: "og:description", content: "Historia, valores e instalaciones del Club Judo Legazpi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ClubPage locale="es" content={Route.useLoaderData()} />,
});
