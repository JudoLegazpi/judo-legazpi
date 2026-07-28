import { createFileRoute } from "@tanstack/react-router";
import { DocumentsPage } from "@/components/site/pages";
import { getSiteContent } from "@/lib/site-content.functions";

export const Route = createFileRoute("/eu/documentos")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: "Dokumentuak — Legazpiko Judo Kluba" },
      { name: "description", content: "Izena emateko inprimakiak, baimenak eta protokoloak PDF formatuan." },
      { property: "og:title", content: "Dokumentuak — Legazpiko Judo Kluba" },
      { property: "og:description", content: "Deskargatu klubaren dokumentuak." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <DocumentsPage locale="eu" content={Route.useLoaderData()} />,
});
