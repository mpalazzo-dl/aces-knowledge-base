"use client";

import { useParams } from "next/navigation";
import { ContentfulLivePreviewProvider } from "@contentful/live-preview/react";

import { defaultLocale } from "@aces/i18n";

import { PreviewPageHero } from "./page-hero-preview";
import { PageHeroProps } from "./page-hero-types";

export const PageHeroLivePreview = ({ item, preview, lang }: PageHeroProps) => {
  const params = useParams();
  let langParam = params?.lang || lang || defaultLocale;
  if (Array.isArray(langParam)) langParam = langParam[0];

  return (
    <ContentfulLivePreviewProvider locale={langParam as string}>
      <PreviewPageHero item={item} preview={preview} lang={lang} />
    </ContentfulLivePreviewProvider>
  );
};
