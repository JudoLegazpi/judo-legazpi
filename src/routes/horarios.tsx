import { createFileRoute } from "@tanstack/react-router";
import { SchedulePage } from "@/components/site/pages";
import { getSiteContent } from "@/lib/site-content.functions";

export const Route = createFileRoute("/horarios")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: "Horarios y tarifas — Club Judo Legazpi" },
      {
        name: "description",
        content: "Horarios de judo por grupos de edad en Legazpi y cuotas del club. Ven a probar una clase.",
      },
      { property: "og:title", content: "Horarios y tarifas — Club Judo Legazpi" },
      { property: "og:description", content: "Grupos por edad, días y horas de entrenamiento y cuotas del club." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <SchedulePage locale="es" content={Route.useLoaderData()} />,
});
