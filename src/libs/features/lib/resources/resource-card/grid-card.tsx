"use client";

import { useState } from "react";

import { defaultLocale, Locale } from "@aces/i18n";
import { CfResource } from "@aces/types";
import { formatDate, truncate } from "@aces/utils";
import { palette, shape } from "@aces/theme";
import { Box, Chip, FlexBox, LinkWrapper, Text, TextButton } from "@aces/ui";

import { DownloadButton } from "../download-button";
import { useResourceLabels } from "../labels";
import { ResourceThumbnail } from "../resource-preview";
import { ResourceQuickView } from "../resource-quick-view";
import { getResourceDate, getResourceHref } from "../utils";
import { KindBadge } from "./kind-badge";

export interface ResourceCardProps {
  resource: CfResource;
  showQuickView?: boolean;
  lang?: Locale;
}

export const ResourceCard = ({
  resource,
  showQuickView = true,
  lang = defaultLocale,
}: ResourceCardProps) => {
  const labels = useResourceLabels(lang);
  const [hover, setHover] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const href = getResourceHref(resource.slug);
  const date = getResourceDate(resource);

  return (
    <FlexBox
      flexDirection="column"
      width="100%"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Box position="relative">
        <LinkWrapper href={href} style={{ width: "100%" }}>
          <ResourceThumbnail resource={resource} />
        </LinkWrapper>
        {resource.featured && (
          <Box position="absolute" top={12} left={12}>
            <Chip label={labels.featured} color="primary" size="small" />
          </Box>
        )}
      </Box>
      <FlexBox flexDirection="column" marginTop={3} gap={2} flexGrow={1}>
        <KindBadge file={resource.file} lang={lang} />
        <LinkWrapper href={href}>
          <Text
            fontWeight={700}
            color={hover ? palette.primary.main : palette.text.primary}
            style={{ transition: "250ms ease" }}
          >
            {resource.title}
          </Text>
        </LinkWrapper>
        {resource.description && (
          <Text.Small color={palette.grey[600]}>
            {truncate(resource.description, 18)}
          </Text.Small>
        )}
        <FlexBox
          alignItems="center"
          justifyContent="space-between"
          marginTop="auto"
          paddingTop={2}
          style={{ borderTop: `1px solid ${palette.border.light}` }}
        >
          <Text.Small color={palette.grey[500]}>
            {date ? formatDate(date, lang) : ""}
          </Text.Small>
          <FlexBox alignItems="center" gap={2}>
            {showQuickView && (
              <TextButton
                onClick={() => setQuickViewOpen(true)}
                style={{
                  color: "primary.main",
                  fontSize: "0.8125rem",
                  textDecoration: "underline",
                }}
              >
                {labels.quickView}
              </TextButton>
            )}
            <DownloadButton
              slug={resource.slug}
              fileName={resource.file?.fileName}
              compact
              lang={lang}
            />
          </FlexBox>
        </FlexBox>
      </FlexBox>
      {showQuickView && (
        <ResourceQuickView
          resource={resource}
          open={quickViewOpen}
          setOpen={setQuickViewOpen}
          lang={lang}
        />
      )}
    </FlexBox>
  );
};

/** Bordered variant used when a resource is embedded in a page or article. */
export const ResourceEmbedCard = ({ resource, lang }: ResourceCardProps) => (
  <Box
    padding={4}
    borderRadius={shape.borderRadius}
    style={{ border: `1px solid ${palette.border.light}`, maxWidth: 420 }}
  >
    <ResourceCard resource={resource} lang={lang} />
  </Box>
);
