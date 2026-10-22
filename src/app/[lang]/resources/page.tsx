import { Suspense } from "react";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { defaultLocale, getLocale } from "@aces/i18n";
import { PageProps } from "@aces/types";
import { Box, Container, H3, Row } from "@aces/ui";
import {
  buildMetadata,
  EnableResources,
  fetchAllResources,
  ResourceListing,
  ResourceListingSkeleton,
  ResourcesPageBreadcrumbs,
} from "@aces/features";

export async function generateMetadata({
  params,
}: {
  params: Promise<PageProps>;
}): Promise<Metadata> {
  const { lang = defaultLocale } = await params;
  const t = await getLocale(lang, "seo");

  return await buildMetadata(
    { title: t.resources.title, description: t.resources.description },
    {},
  );
}

export default async function ResourcesPage({
  params,
}: {
  params: Promise<PageProps>;
}) {
  if (!EnableResources) {
    notFound();
  }

  const { lang = defaultLocale } = await params;
  const { isEnabled } = await draftMode();
  const t = await getLocale(lang, "common");

  const resources = await fetchAllResources(isEnabled, lang);

  return (
    <Box marginY={8}>
      <Container>
        <ResourcesPageBreadcrumbs lang={lang} />
        <H3 component="h1" marginTop={6}>
          {t.resources.listingTitle}
        </H3>
        <Suspense
          fallback={
            <Row columnSpacing={5} rowSpacing={7} marginTop={8}>
              <ResourceListingSkeleton />
            </Row>
          }
        >
          <ResourceListing resources={resources} lang={lang} />
        </Suspense>
      </Container>
    </Box>
  );
}
