import { createFileRoute } from "@tanstack/react-router";
import { CalendarPage } from "@/components/site/pages";
import { getSiteContent } from "@/lib/site-content.functions";

export const Route = createFileRoute("/eu/calendario")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: "Egutegia — Legazpiko Judo Kluba" },
      { name: "description", content: "Lehiaketak, gerriko azterketak eta klubaren jarduerak." },
      { property: "og:title", content: "Egutegia — Legazpiko Judo Kluba" },
      { property: "og:description", content: "Hurrengo lehiaketak eta jarduerak." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <CalendarPage locale="eu" content={Route.useLoaderData()} />,
});
