"use client";

import { useEffect, useState } from "react";
import { useContentfulLiveUpdates } from "@contentful/live-preview/react";

import type { CfFetchById, Nested } from "@aces/types";

import { CfGridClientRender } from "./render-client";
import { fetchGridData } from "./services";
import { GridSkeleton } from "./skeleton";

export interface CfGridClientProps extends CfFetchById, Nested {}

export const CfGridClient = ({
  id,
  preview,
  lang,
  nested,
}: CfGridClientProps) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchGridData(id, preview, lang)
      .then(setData)
      .catch((err) => {
        console.error("Client fetch failed:", err);
      });
  }, [id, preview, lang]);

  const updatedData = useContentfulLiveUpdates(data);

  if (!updatedData) return <GridSkeleton />;

  return (
    <CfGridClientRender
      internalTitle={updatedData.internalTitle}
      showDividers={updatedData.showDividers}
      gridColumnCount={updatedData.gridColumnCount}
      gridItemsStyle={updatedData.gridItemsStyle}
      verticalAlignment={updatedData.verticalAlignment}
      listItems={updatedData.listItemsCollection.items}
      __typename={updatedData.__typename}
      nested={nested}
      id={id}
      lang={lang}
      preview={preview}
    />
  );
};
