import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/site/pages";
import { getSiteContent } from "@/lib/site-content.functions";

export const Route = createFileRoute("/eu/")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: "Legazpiko Judo Kluba — Judoa adin guztietarako" },
      {
        name: "description",
        content:
          "Legazpiko judo kluba (Gipuzkoa) 1978tik. Adinaren araberako ordutegiak, lehiaketa egutegia, txapelketak eta talde teknikoa.",
      },
      { property: "og:title", content: "Legazpiko Judo Kluba" },
      { property: "og:description", content: "Judoa eta balioak Legazpin 1978tik." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <HomePage locale="eu" content={Route.useLoaderData()} />,
});
