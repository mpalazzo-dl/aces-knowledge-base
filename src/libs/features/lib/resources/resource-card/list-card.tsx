"use client";

import { useState } from "react";

import { defaultLocale } from "@aces/i18n";
import { formatDate, truncate } from "@aces/utils";
import { useMediaQuery } from "@aces/hooks";
import { palette } from "@aces/theme";
import { Col, FlexBox, LinkWrapper, Row, Text, TextButton } from "@aces/ui";

import { DownloadButton } from "../download-button";
import { useResourceLabels } from "../labels";
import { ResourceThumbnail } from "../resource-preview";
import { ResourceQuickView } from "../resource-quick-view";
import { getResourceDate, getResourceHref } from "../utils";
import { ResourceCardProps } from "./grid-card";
import { KindBadge } from "./kind-badge";

export const ResourceListCard = ({
  resource,
  showQuickView = true,
  lang = defaultLocale,
}: ResourceCardProps) => {
  const labels = useResourceLabels(lang);
  const { isSmallerThanMd } = useMediaQuery();
  const [hover, setHover] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const href = getResourceHref(resource.slug);
  const date = getResourceDate(resource);
  const categories = resource.categoriesCollection?.items || [];

  return (
    <Row alignItems="center" columnSpacing={5}>
      <Col size={{ xs: 12, md: 3 }}>
        <LinkWrapper href={href} style={{ width: "100%" }}>
          <ResourceThumbnail resource={resource} height={150} />
        </LinkWrapper>
      </Col>
      <Col size={{ xs: 12, md: 9 }}>
        <FlexBox
          flexDirection="column"
          gap={2}
          marginTop={{ xs: 3, md: 0 }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <FlexBox alignItems="center" gap={3} style={{ flexWrap: "wrap" }}>
            <KindBadge file={resource.file} lang={lang} />
            {date && (
              <Text.Small color={palette.grey[500]}>
                {formatDate(date, lang)}
              </Text.Small>
            )}
            {categories.length > 0 && (
              <Text.Small color={palette.grey[500]}>
                {categories.map((category) => category.title).join(", ")}
              </Text.Small>
            )}
          </FlexBox>
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
              {truncate(resource.description, isSmallerThanMd ? 18 : 45)}
            </Text.Small>
          )}
          <FlexBox alignItems="center" gap={3}>
            <DownloadButton
              slug={resource.slug}
              fileName={resource.file?.fileName}
              compact
              lang={lang}
            />
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
          </FlexBox>
        </FlexBox>
      </Col>
      {showQuickView && (
        <ResourceQuickView
          resource={resource}
          open={quickViewOpen}
          setOpen={setQuickViewOpen}
          lang={lang}
        />
      )}
    </Row>
  );
};
