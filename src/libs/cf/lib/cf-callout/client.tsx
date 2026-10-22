"use client";

import { useEffect, useState } from "react";
import { useContentfulLiveUpdates } from "@contentful/live-preview/react";

import type { CfFetchById } from "@aces/types";

import { CfCallout } from "./render";
import { fetchCalloutData } from "./services";
import { CalloutSkeleton } from "./skeleton";

export interface CfCalloutClientProps extends CfFetchById {}

export const CfCalloutClient = ({
  id,
  preview,
  lang,
}: CfCalloutClientProps) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchCalloutData(id, preview, lang)
      .then(setData)
      .catch((err) => {
        console.error("Client fetch failed:", err);
      });
  }, [id, preview, lang]);

  const updatedData = useContentfulLiveUpdates(data);

  if (!updatedData) return <CalloutSkeleton />;

  return (
    <CfCallout
      internalTitle={updatedData.internalTitle}
      headline={updatedData.headline}
      bodyCopy={updatedData.bodyCopy}
      tags={updatedData.tags}
      buttonsCollection={updatedData.buttonsCollection}
      media={updatedData.media}
      __typename={updatedData.__typename}
      id={id}
      lang={lang}
      preview={preview}
    />
  );
};
