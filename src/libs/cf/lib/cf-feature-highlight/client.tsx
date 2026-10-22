"use client";

import { useEffect, useState } from "react";
import { useContentfulLiveUpdates } from "@contentful/live-preview/react";

import type { CfFetchById } from "@aces/types";

import { CfFeatureHighlight } from "./render";
import { fetchFeatureHighlightData } from "./services";
import { FeatureHighlightSkeleton } from "./skeleton";

export interface CfFeatureHighlightClientProps extends CfFetchById {}

export const CfFeatureHighlightClient = ({
  id,
  preview,
  lang,
}: CfFeatureHighlightClientProps) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchFeatureHighlightData(id, preview, lang)
      .then(setData)
      .catch((err) => {
        console.error("Client fetch failed:", err);
      });
  }, [id, preview, lang]);

  const updatedData = useContentfulLiveUpdates(data);

  if (!updatedData) return <FeatureHighlightSkeleton />;

  return (
    <CfFeatureHighlight
      internalTitle={updatedData.internalTitle}
      headline={updatedData.headline}
      bodyCopy={updatedData.bodyCopy}
      media={updatedData.media}
      __typename={updatedData.__typename}
      id={id}
      lang={lang}
      preview={preview}
    />
  );
};
