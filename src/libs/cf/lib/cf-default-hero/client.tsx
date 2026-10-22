"use client";

import { useEffect, useState } from "react";
import { useContentfulLiveUpdates } from "@contentful/live-preview/react";

import type { CfFetchById } from "@aces/types";

import { CfDefaultHero } from "./render";
import { fetchDefaultHeroData } from "./services";
import { DefaultHeroSkeleton } from "./skeleton";

export interface CfDefaultHeroClientProps extends CfFetchById {}

export const CfDefaultHeroClient = ({
  id,
  preview,
  lang,
}: CfDefaultHeroClientProps) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchDefaultHeroData(id, preview, lang)
      .then(setData)
      .catch((err) => {
        console.error("Client fetch failed:", err);
      });
  }, [id, preview, lang]);

  const updatedData = useContentfulLiveUpdates(data);

  if (!updatedData) return <DefaultHeroSkeleton />;

  return (
    <CfDefaultHero
      internalTitle={updatedData.internalTitle}
      headline={updatedData.headline}
      subhead={updatedData.subhead}
      media={updatedData.media}
      __typename={updatedData.__typename}
      id={id}
      lang={lang}
      preview={preview}
    />
  );
};
