"use client";

import dynamic from "next/dynamic";

import { defaultLocale, Locale } from "@aces/i18n";
import { CfResource } from "@aces/types";
import { palette, shape } from "@aces/theme";
import { Box, FlexBox, Icon, Skeleton, Text } from "@aces/ui";

import {
  canPreviewInOffice,
  FileKindMeta,
  formatFileSize,
  getFileKind,
  getImageUrl,
  getOfficeEmbedUrl,
  toAbsoluteAssetUrl,
} from "../file-kind";
import { useResourceLabels } from "../labels";
import { DownloadButton } from "../download-button";

// pdf.js touches browser globals, so it only ever loads on the client
const PdfViewer = dynamic(
  () => import("./pdf-viewer").then((module) => module.PdfViewer),
  {
    ssr: false,
    loading: () => <Skeleton variant="rectangular" width="100%" height={600} />,
  },
);

const PdfThumbnail = dynamic(
  () => import("./pdf-viewer").then((module) => module.PdfThumbnail),
  { ssr: false },
);

interface ResourcePreviewProps {
  resource: CfResource;
  height?: number | string;
  lang?: Locale;
}

/** Full-size, interactive preview used on the detail page and quick view. */
export const ResourcePreview = ({
  resource,
  height = "75vh",
  lang = defaultLocale,
}: ResourcePreviewProps) => {
  const labels = useResourceLabels(lang);
  const { file } = resource;
  if (!file) return null;

  const kind = getFileKind(file);
  const url = toAbsoluteAssetUrl(file.url);
  const frameStyle = {
    width: "100%",
    border: 0,
    borderRadius: 8,
    backgroundColor: palette.grey[100],
  };

  switch (FileKindMeta[kind].preview) {
    case "pdf":
      return <PdfViewer url={url} labels={labels} maxHeight={height} />;

    case "office":
      if (!canPreviewInOffice(file)) {
        return (
          <PreviewFallback
            resource={resource}
            message={labels.preview.tooLarge}
            lang={lang}
          />
        );
      }
      return (
        <iframe
          src={getOfficeEmbedUrl(file)}
          title={resource.title}
          style={{ ...frameStyle, height }}
          allowFullScreen
        />
      );

    case "image":
      return (
        <FlexBox
          justifyContent="center"
          borderRadius={shape.borderRadius}
          style={{ backgroundColor: palette.grey[100], overflow: "hidden" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getImageUrl(file.url, 1600)}
            alt={file.description || resource.title}
            style={{
              maxWidth: "100%",
              maxHeight: height,
              objectFit: "contain",
            }}
          />
        </FlexBox>
      );

    case "video":
      return (
        <video
          controls
          preload="metadata"
          src={url}
          style={{ ...frameStyle, maxHeight: height, backgroundColor: "#000" }}
        >
          <track kind="captions" />
        </video>
      );

    case "audio":
      return (
        <FlexBox
          flexDirection="column"
          alignItems="center"
          gap={5}
          padding={8}
          borderRadius={shape.borderRadius}
          style={{ backgroundColor: palette.grey[100] }}
        >
          <Icon
            icon={FileKindMeta[kind].icon}
            size={72}
            color={FileKindMeta[kind].color}
          />
          <audio
            controls
            preload="metadata"
            src={url}
            style={{ width: "100%" }}
          />
        </FlexBox>
      );

    default:
      return (
        <PreviewFallback
          resource={resource}
          message={labels.preview.unavailable}
          lang={lang}
        />
      );
  }
};

interface PreviewFallbackProps {
  resource: CfResource;
  message: string;
  lang: Locale;
}

const PreviewFallback = ({ resource, message, lang }: PreviewFallbackProps) => {
  const kind = getFileKind(resource.file);

  return (
    <FlexBox
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={3}
      padding={10}
      borderRadius={shape.borderRadius}
      style={{ backgroundColor: palette.grey[100], textAlign: "center" }}
    >
      <Icon
        icon={FileKindMeta[kind].icon}
        size={96}
        color={FileKindMeta[kind].color}
      />
      <Text fontWeight={700}>{resource.file?.fileName}</Text>
      <Text.Small color={palette.grey[600]}>
        {formatFileSize(resource.file?.size)}
      </Text.Small>
      <Text.Small color={palette.grey[600]}>{message}</Text.Small>
      <Box marginTop={2}>
        <DownloadButton
          slug={resource.slug}
          fileName={resource.file?.fileName}
          lang={lang}
        />
      </Box>
    </FlexBox>
  );
};

interface ResourceThumbnailProps {
  resource: CfResource;
  height?: number;
}

/**
 * Static card thumbnail: an automatic preview where the file allows it,
 * otherwise the file type icon.
 */
export const ResourceThumbnail = ({
  resource,
  height = 200,
}: ResourceThumbnailProps) => {
  const { file } = resource;
  const kind = getFileKind(file);
  const meta = FileKindMeta[kind];

  const imageStyle = {
    width: "100%",
    height,
    objectFit: "cover" as const,
    display: "block",
  };

  let content: React.ReactNode;

  if (file && kind === "image") {
    content = (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={getImageUrl(file.url, 800)}
        alt=""
        loading="lazy"
        style={imageStyle}
      />
    );
  } else if (file && kind === "pdf") {
    content = (
      <PdfThumbnail url={toAbsoluteAssetUrl(file.url)} height={height} />
    );
  } else if (file && kind === "video") {
    content = (
      <Box position="relative">
        {/* Seeking past 0 makes browsers paint the first frame */}
        <video
          src={`${toAbsoluteAssetUrl(file.url)}#t=0.1`}
          preload="metadata"
          muted
          playsInline
          style={{ ...imageStyle, backgroundColor: "#000" }}
        />
        <FlexBox
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Icon icon="PlayArrow" size={56} color={palette.common.white} />
        </FlexBox>
      </Box>
    );
  } else {
    content = (
      <FlexBox
        alignItems="center"
        justifyContent="center"
        height={height}
        style={{ backgroundColor: `${meta.color}14` }}
      >
        <Icon icon={meta.icon} size={72} color={meta.color} />
      </FlexBox>
    );
  }

  return (
    <Box
      position="relative"
      width="100%"
      height={height}
      borderRadius={shape.borderRadius}
      style={{
        overflow: "hidden",
        backgroundColor: palette.grey[100],
        border: `1px solid ${palette.border.light}`,
      }}
    >
      {content}
    </Box>
  );
};
