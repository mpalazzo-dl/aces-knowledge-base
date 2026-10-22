"use client";

import {
  ContentfulLivePreviewProvider,
  useContentfulLiveUpdates,
} from "@contentful/live-preview/react";

import { Locale } from "@aces/i18n";
import { CfResourceDetail } from "@aces/types";
import { ResourceDetail } from "@aces/features";

interface ResourcePreviewClientProps {
  initialResource: CfResourceDetail;
  lang: Locale;
}

const ResourcePreviewBody = ({
  initialResource,
  lang,
}: ResourcePreviewClientProps) => {
  const resource = useContentfulLiveUpdates(initialResource);

  return <ResourceDetail resource={resource || initialResource} lang={lang} />;
};

export default function ResourcePreviewClient({
  initialResource,
  lang,
}: ResourcePreviewClientProps) {
  return (
    <ContentfulLivePreviewProvider locale={lang}>
      <ResourcePreviewBody initialResource={initialResource} lang={lang} />
    </ContentfulLivePreviewProvider>
  );
}
