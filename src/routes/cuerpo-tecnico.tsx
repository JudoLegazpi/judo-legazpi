import { createFileRoute } from "@tanstack/react-router";
import { StaffPage } from "@/components/site/pages";
import { getSiteContent } from "@/lib/site-content.functions";

export const Route = createFileRoute("/cuerpo-tecnico")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: "Cuerpo técnico — Club Judo Legazpi" },
      {
        name: "description",
        content: "Entrenadores y entrenadoras titulados del Club Judo Legazpi, formados en protección a la infancia.",
      },
      { property: "og:title", content: "Cuerpo técnico — Club Judo Legazpi" },
      { property: "og:description", content: "Quién entrena en el tatami del Club Judo Legazpi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <StaffPage locale="es" content={Route.useLoaderData()} />,
});
