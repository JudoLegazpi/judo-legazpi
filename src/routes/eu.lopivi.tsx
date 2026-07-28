import { createFileRoute } from "@tanstack/react-router";
import { LopiviPage } from "@/components/site/pages";
import { getSiteContent } from "@/lib/site-content.functions";

export const Route = createFileRoute("/eu/lopivi")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: "LOPIVI eta haurren babesa — Legazpiko Judo Kluba" },
      { name: "description", content: "Klubaren haurrak babesteko plana, ordezkaria eta protokoloa." },
      { property: "og:title", content: "LOPIVI — Legazpiko Judo Kluba" },
      { property: "og:description", content: "Haurren babesarekiko konpromisoa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <LopiviPage locale="eu" content={Route.useLoaderData()} />,
});
