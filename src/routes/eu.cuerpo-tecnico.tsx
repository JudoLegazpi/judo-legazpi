import { createFileRoute } from "@tanstack/react-router";
import { StaffPage } from "@/components/site/pages";
import { getSiteContent } from "@/lib/site-content.functions";

export const Route = createFileRoute("/eu/cuerpo-tecnico")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: "Talde teknikoa — Legazpiko Judo Kluba" },
      { name: "description", content: "Legazpiko Judo Klubaren entrenatzaile tituludunak." },
      { property: "og:title", content: "Talde teknikoa — Legazpiko Judo Kluba" },
      { property: "og:description", content: "Nor dagoen tatamian." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <StaffPage locale="eu" content={Route.useLoaderData()} />,
});
