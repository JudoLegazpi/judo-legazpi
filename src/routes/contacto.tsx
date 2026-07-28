import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/site/pages";
import { getSiteContent } from "@/lib/site-content.functions";

export const Route = createFileRoute("/contacto")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: "Contacto — Club Judo Legazpi" },
      {
        name: "description",
        content: "Dónde estamos y cómo contactar con el Club Judo Legazpi. Ven a probar una clase gratis.",
      },
      { property: "og:title", content: "Contacto — Club Judo Legazpi" },
      { property: "og:description", content: "Polideportivo municipal de Legazpi. Escríbenos o acércate a probar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ContactPage locale="es" content={Route.useLoaderData()} />,
});
