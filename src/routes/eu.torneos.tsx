import { createFileRoute } from "@tanstack/react-router";
import { TournamentsPage } from "@/components/site/pages";
import { getSiteContent } from "@/lib/site-content.functions";

export const Route = createFileRoute("/eu/torneos")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: "Txapelketak — Legazpiko Judo Kluba" },
      { name: "description", content: "Legazpiko Judo Klubak antolatzen dituen judo txapelketak." },
      { property: "og:title", content: "Txapelketak — Legazpiko Judo Kluba" },
      { property: "og:description", content: "Legazpin antolatzen ditugun lehiaketak." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <TournamentsPage locale="eu" content={Route.useLoaderData()} />,
});
