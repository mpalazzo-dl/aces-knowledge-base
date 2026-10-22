"use client";

import { useEffect, useState } from "react";
import { useContentfulLiveUpdates } from "@contentful/live-preview/react";

import type { CfFetchById, CfResource, Nested } from "@aces/types";
import { fetchResourceById } from "@aces/features";

import { CfResourceEmbed } from "./render";
import { ResourceEmbedSkeleton } from "./skeleton";

export interface CfResourceEmbedClientProps extends CfFetchById, Nested {}

export const CfResourceEmbedClient = ({
  id,
  preview,
  lang,
  nested,
}: CfResourceEmbedClientProps) => {
  const [data, setData] = useState<CfResource | null>(null);

  useEffect(() => {
    fetchResourceById(id, preview, lang)
      .then(setData)
      .catch((err) => {
        console.error("Client fetch failed:", err);
      });
  }, [id, preview, lang]);

  const updatedData = useContentfulLiveUpdates(data);

  if (!updatedData) return <ResourceEmbedSkeleton />;

  return <CfResourceEmbed resource={updatedData} lang={lang} nested={nested} />;
};
