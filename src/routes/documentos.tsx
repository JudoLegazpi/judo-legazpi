import { createFileRoute } from "@tanstack/react-router";
import { DocumentsPage } from "@/components/site/pages";
import { getSiteContent } from "@/lib/site-content.functions";

export const Route = createFileRoute("/documentos")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: "Documentos y descargas — Club Judo Legazpi" },
      {
        name: "description",
        content: "Formularios de inscripción, autorizaciones y protocolos del Club Judo Legazpi en PDF.",
      },
      { property: "og:title", content: "Documentos — Club Judo Legazpi" },
      { property: "og:description", content: "Descarga los documentos del club en PDF." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <DocumentsPage locale="es" content={Route.useLoaderData()} />,
});
