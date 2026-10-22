"use client";

import { useEffect, useState } from "react";
import { useContentfulLiveUpdates } from "@contentful/live-preview/react";

import type { CfAlignment, CfFetchById, Nested } from "@aces/types";

import { CfHeader } from "./render";
import { fetchHeaderData } from "./services";
import { HeaderSkeleton } from "./skeleton";

export interface CfHeaderClientProps extends CfFetchById, Nested {
  alignment?: CfAlignment;
}

export const CfHeaderClient = ({
  id,
  preview,
  lang,
  nested,
  alignment,
}: CfHeaderClientProps) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchHeaderData(id, preview, lang)
      .then(setData)
      .catch((err) => {
        console.error("Client fetch failed:", err);
      });
  }, [id, preview, lang]);

  const updatedData = useContentfulLiveUpdates(data);

  if (!updatedData) return <HeaderSkeleton />;

  return (
    <CfHeader
      internalTitle={updatedData.internalTitle}
      headline={updatedData.headline}
      headerType={updatedData.headerType}
      alignment={alignment ? alignment : updatedData.alignment}
      containerWidth={updatedData.containerWidth}
      nested={nested}
      __typename={updatedData.__typename}
      id={id}
      lang={lang}
      preview={preview}
    />
  );
};
