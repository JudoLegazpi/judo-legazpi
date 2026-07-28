import { createFileRoute } from "@tanstack/react-router";
import { LopiviPage } from "@/components/site/pages";
import { getSiteContent } from "@/lib/site-content.functions";

export const Route = createFileRoute("/lopivi")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: "LOPIVI y protección de la infancia — Club Judo Legazpi" },
      {
        name: "description",
        content:
          "Plan de protección a la infancia del Club Judo Legazpi: delegado de protección, protocolo y documentos.",
      },
      { property: "og:title", content: "LOPIVI — Club Judo Legazpi" },
      { property: "og:description", content: "Compromiso del club con la protección de la infancia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <LopiviPage locale="es" content={Route.useLoaderData()} />,
});
