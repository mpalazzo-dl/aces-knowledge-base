"use client";

import { ContentfulLivePreview } from "@contentful/live-preview";

import { defaultLocale, Locale } from "@aces/i18n";
import { useGetLocale } from "@aces/hooks";
import { CfResourceDetail, RouteDirectory } from "@aces/types";
import { formatDate } from "@aces/utils";
import { palette, shape, typography } from "@aces/theme";
import {
  Box,
  Breadcrumbs,
  Chip,
  Col,
  Container,
  Divider,
  FlexBox,
  H3,
  H5,
  Icon,
  InlineBox,
  Link,
  Row,
  Text,
} from "@aces/ui";

import { DownloadButton } from "../download-button";
import { FileKindMeta, formatFileSize, getFileKind } from "../file-kind";
import { useResourceLabels } from "../labels";
import { ResourceCard } from "../resource-card";
import { KindBadge } from "../resource-card/kind-badge";
import { ResourcePreview } from "../resource-preview";
import { getResourceDate, getResourceHref } from "../utils";

interface ResourceDetailProps {
  resource: CfResourceDetail;
  lang?: Locale;
}

export const ResourceDetail = ({
  resource,
  lang = defaultLocale,
}: ResourceDetailProps) => {
  const labels = useResourceLabels(lang);
  const kind = getFileKind(resource.file);
  const date = getResourceDate(resource);
  const categories = resource.categoriesCollection?.items || [];
  const related = resource.relatedResourcesCollection?.items || [];

  const liveProps = (fieldId: string) =>
    ContentfulLivePreview.getProps({
      entryId: resource.sys.id,
      fieldId,
      locale: lang,
    });

  const details = [
    { label: labels.details.fileType, value: labels.kinds[kind] },
    { label: labels.details.size, value: formatFileSize(resource.file?.size) },
    { label: labels.details.fileName, value: resource.file?.fileName },
    {
      label: labels.details.published,
      value: date ? formatDate(date, lang) : "",
    },
  ].filter((detail) => detail.value);

  return (
    <Container>
      <ResourceBreadcrumbs resource={resource} lang={lang} />
      <Row columnSpacing={8} rowSpacing={6} marginBottom={12}>
        <Col size={{ xs: 12, lg: 8 }}>
          <FlexBox flexDirection="column" gap={3} marginBottom={6}>
            <KindBadge file={resource.file} lang={lang} />
            <H3 component="h1" {...liveProps("title")}>
              {resource.title}
            </H3>
            {resource.description && (
              <Text color={palette.grey[700]} {...liveProps("description")}>
                {resource.description}
              </Text>
            )}
          </FlexBox>
          <Box {...liveProps("file")}>
            <ResourcePreview resource={resource} lang={lang} />
          </Box>
        </Col>
        <Col size={{ xs: 12, lg: 4 }}>
          <FlexBox
            flexDirection="column"
            gap={5}
            padding={6}
            borderRadius={shape.borderRadius}
            style={{
              border: `1px solid ${palette.border.light}`,
              position: { lg: "sticky" },
              top: { lg: 120 },
            }}
          >
            <FlexBox alignItems="center" gap={3}>
              <Icon
                icon={FileKindMeta[kind].icon}
                size={40}
                color={FileKindMeta[kind].color}
              />
              <Text fontWeight={700} style={{ wordBreak: "break-word" }}>
                {resource.file?.fileName}
              </Text>
            </FlexBox>
            <DownloadButton
              slug={resource.slug}
              fileName={resource.file?.fileName}
              fullWidth
              lang={lang}
            />
            <Divider />
            <FlexBox component="dl" flexDirection="column" gap={3} margin={0}>
              {details.map((detail) => (
                <FlexBox
                  key={detail.label}
                  justifyContent="space-between"
                  gap={4}
                >
                  <Text.Small component="dt" color={palette.grey[500]}>
                    {detail.label}
                  </Text.Small>
                  <Text.Small
                    component="dd"
                    fontWeight={700}
                    style={{
                      margin: 0,
                      textAlign: "right",
                      wordBreak: "break-word",
                    }}
                  >
                    {detail.value}
                  </Text.Small>
                </FlexBox>
              ))}
            </FlexBox>
            {categories.length > 0 && (
              <FlexBox
                flexDirection="column"
                gap={2}
                {...liveProps("categories")}
              >
                <Text.Small color={palette.grey[500]}>
                  {labels.details.categories}
                </Text.Small>
                <FlexBox gap={2} style={{ flexWrap: "wrap" }}>
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`${RouteDirectory.Resources}?categories=${category.slug}`}
                    >
                      <Chip
                        label={category.title}
                        variant="outlined"
                        size="small"
                        uppercase={false}
                      />
                    </Link>
                  ))}
                </FlexBox>
              </FlexBox>
            )}
            <Link href={RouteDirectory.Resources}>
              <FlexBox alignItems="center" gap={1}>
                <Icon icon="ArrowBack" size={18} />
                <Text.Small>{labels.backToListing}</Text.Small>
              </FlexBox>
            </Link>
          </FlexBox>
        </Col>
      </Row>
      {related.length > 0 && (
        <Box marginBottom={16} {...liveProps("relatedResources")}>
          <H5 component="h2" marginBottom={6}>
            {labels.relatedTitle}
          </H5>
          <Row columnSpacing={5} rowSpacing={7}>
            {related.map((item) => (
              <Col
                key={item.sys.id}
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                style={{ display: "flex" }}
              >
                <ResourceCard resource={item} lang={lang} />
              </Col>
            ))}
          </Row>
        </Box>
      )}
    </Container>
  );
};

const crumbStyle = (disabled = false) => ({
  fontSize: typography.caption2.fontSize,
  color: disabled ? palette.grey[500] : palette.primary.main,
  pointerEvents: disabled ? "none" : "auto",
  "& a": { textDecoration: disabled ? "none" : "underline" },
});

const ResourceBreadcrumbs = ({
  resource,
  lang,
}: {
  resource: CfResourceDetail;
  lang: Locale;
}) => {
  const { t } = useGetLocale(lang, "common");

  return (
    <Breadcrumbs marginY={7}>
      <InlineBox style={crumbStyle()}>
        <Link href={RouteDirectory.Homepage}>
          {t?.breadcrumbs.home ?? "Home"}
        </Link>
      </InlineBox>
      <InlineBox style={crumbStyle()}>
        <Link href={RouteDirectory.Resources}>
          {t?.breadcrumbs.resources ?? "Resources"}
        </Link>
      </InlineBox>
      <InlineBox style={crumbStyle(true)}>
        <Link href={getResourceHref(resource.slug)} aria-current="page">
          {resource.title}
        </Link>
      </InlineBox>
    </Breadcrumbs>
  );
};
