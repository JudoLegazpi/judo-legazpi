import { createFileRoute } from "@tanstack/react-router";
import { SchedulePage } from "@/components/site/pages";
import { getSiteContent } from "@/lib/site-content.functions";

export const Route = createFileRoute("/eu/horarios")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: "Ordutegiak eta tarifak — Legazpiko Judo Kluba" },
      { name: "description", content: "Adinaren araberako judo ordutegiak Legazpin eta klubaren kuotak." },
      { property: "og:title", content: "Ordutegiak — Legazpiko Judo Kluba" },
      { property: "og:description", content: "Taldeak, egunak, orduak eta kuotak." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <SchedulePage locale="eu" content={Route.useLoaderData()} />,
});
