import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/site/pages";
import { getSiteContent } from "@/lib/site-content.functions";

export const Route = createFileRoute("/eu/contacto")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: "Kontaktua — Legazpiko Judo Kluba" },
      { name: "description", content: "Non gauden eta nola jarri harremanetan Legazpiko Judo Klubarekin." },
      { property: "og:title", content: "Kontaktua — Legazpiko Judo Kluba" },
      { property: "og:description", content: "Legazpiko kiroldegia. Idatzi edo hurbildu probatzera." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ContactPage locale="eu" content={Route.useLoaderData()} />,
});
