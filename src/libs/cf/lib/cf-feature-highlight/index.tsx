import type { CfFetchById } from "@aces/types";

import { CfFeatureHighlight } from "./render";
import { fetchFeatureHighlightData } from "./services";
import { FeatureHighlightSkeleton } from "./skeleton";

export interface CfFeatureHighlightServerProps extends CfFetchById {}

export const CfFeatureHighlightServer = async ({
  id,
  preview,
  lang,
}: CfFeatureHighlightServerProps) => {
  let data;

  try {
    data = await fetchFeatureHighlightData(id, preview, lang);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return <FeatureHighlightSkeleton />;
  }

  if (!data) {
    return <FeatureHighlightSkeleton />;
  }

  return (
    <CfFeatureHighlight
      internalTitle={data.internalTitle}
      headline={data.headline}
      bodyCopy={data.bodyCopy}
      media={data.media}
      __typename={data.__typename}
      id={id}
      lang={lang}
      preview={preview}
    />
  );
};
