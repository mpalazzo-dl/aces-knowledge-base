import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { defaultLocale } from "@aces/i18n";
import { PageProps } from "@aces/types";
import {
  buildMetadata,
  EnableResources,
  fetchResourceBySlug,
  ResourceDetail,
} from "@aces/features";

import ResourcePreviewClient from "./resource-preview-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<PageProps>;
}): Promise<Metadata> {
  const { slug, lang = defaultLocale } = await params;
  const { isEnabled } = await draftMode();

  const resource = await fetchResourceBySlug(slug, isEnabled, lang);
  if (!resource) return {};

  return await buildMetadata(
    {
      title: resource.title,
      description: resource.description || "",
      keywords: resource.searchKeywords,
    },
    {},
  );
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<PageProps>;
}) {
  const { slug, lang = defaultLocale } = await params;
  const { isEnabled } = await draftMode();

  const resource = await fetchResourceBySlug(slug, isEnabled, lang);

  if (!resource || !EnableResources) {
    notFound();
  }

  if (isEnabled) {
    return <ResourcePreviewClient initialResource={resource} lang={lang} />;
  }

  return <ResourceDetail resource={resource} lang={lang} />;
}
