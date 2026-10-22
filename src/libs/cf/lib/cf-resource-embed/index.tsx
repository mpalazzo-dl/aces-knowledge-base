import type { CfFetchById, Nested } from "@aces/types";
import { fetchResourceById } from "@aces/features";

import { CfResourceEmbed } from "./render";
import { ResourceEmbedSkeleton } from "./skeleton";

export interface CfResourceEmbedServerProps extends CfFetchById, Nested {}

export const CfResourceEmbedServer = async ({
  id,
  preview,
  lang,
  nested,
}: CfResourceEmbedServerProps) => {
  const resource = await fetchResourceById(id, preview, lang);

  if (!resource) {
    return <ResourceEmbedSkeleton />;
  }

  return <CfResourceEmbed resource={resource} lang={lang} nested={nested} />;
};
