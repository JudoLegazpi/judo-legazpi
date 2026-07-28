import { createFileRoute } from "@tanstack/react-router";
import { ClubPage } from "@/components/site/pages";
import { getSiteContent } from "@/lib/site-content.functions";

export const Route = createFileRoute("/eu/club")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: "Kluba — Legazpiko Judo Kluba" },
      { name: "description", content: "Legazpiko Judo Klubaren historia, balioak eta instalazioak." },
      { property: "og:title", content: "Kluba — Legazpiko Judo Kluba" },
      { property: "og:description", content: "Klubaren historia eta balioak." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ClubPage locale="eu" content={Route.useLoaderData()} />,
});
