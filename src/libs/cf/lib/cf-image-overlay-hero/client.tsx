"use client";

import { useEffect, useState } from "react";
import { useContentfulLiveUpdates } from "@contentful/live-preview/react";

import type { CfFetchById } from "@aces/types";

import { CfImageOverlayHero } from "./render";
import { fetchImageOverlayHero } from "./services";
import { ImageOverlayHeroSkeleton } from "./skeleton";

export const CfImageOverlayHeroClient = ({
  id,
  preview,
  lang,
}: CfFetchById) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchImageOverlayHero(id, preview, lang)
      .then(setData)
      .catch((err) => {
        console.error("Client fetch failed:", err);
      });
  }, [id, preview, lang]);

  const updatedData = useContentfulLiveUpdates(data);

  if (!updatedData) return <ImageOverlayHeroSkeleton />;

  return (
    <CfImageOverlayHero
      internalTitle={updatedData.internalTitle}
      headline={updatedData.headline}
      subhead={updatedData.subhead}
      buttonsCollection={updatedData.buttonsCollection}
      image={updatedData.image}
      fullOverlay={updatedData.fullOverlay}
      slim={updatedData.slim}
      __typename={updatedData.__typename}
      id={id}
      lang={lang}
      preview={preview}
    />
  );
};
