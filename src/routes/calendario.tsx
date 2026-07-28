import { createFileRoute } from "@tanstack/react-router";
import { CalendarPage } from "@/components/site/pages";
import { getSiteContent } from "@/lib/site-content.functions";

export const Route = createFileRoute("/calendario")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: "Calendario — Club Judo Legazpi" },
      {
        name: "description",
        content: "Competiciones, exámenes de cinturón y actividades del Club Judo Legazpi.",
      },
      { property: "og:title", content: "Calendario — Club Judo Legazpi" },
      { property: "og:description", content: "Próximas competiciones y actividades del club." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <CalendarPage locale="es" content={Route.useLoaderData()} />,
});
