import { CfAsset, ResourceFileKind } from "@aces/types";
import type { IconEnum } from "@aces/ui";

import { OfficePreviewLimits } from "./config";

export type ResourcePreviewStrategy =
  | "pdf"
  | "office"
  | "image"
  | "video"
  | "audio"
  | "none";

interface FileKindMeta {
  icon: keyof typeof IconEnum;
  color: string;
  preview: ResourcePreviewStrategy;
}

export const FileKindMeta: Record<ResourceFileKind, FileKindMeta> = {
  pdf: { icon: "PictureAsPdf", color: "#D93025", preview: "pdf" },
  presentation: { icon: "Slideshow", color: "#D04423", preview: "office" },
  document: { icon: "Description", color: "#2B579A", preview: "office" },
  spreadsheet: { icon: "TableChart", color: "#217346", preview: "office" },
  image: { icon: "Image", color: "#8E44AD", preview: "image" },
  video: { icon: "Movie", color: "#E67E22", preview: "video" },
  audio: { icon: "AudioFile", color: "#16A085", preview: "audio" },
  archive: { icon: "FolderZip", color: "#7F8C8D", preview: "none" },
  other: { icon: "InsertDriveFile", color: "#7F8C8D", preview: "none" },
};

// Display order for the file type filter
export const FileKindOrder: ResourceFileKind[] = [
  "pdf",
  "presentation",
  "document",
  "spreadsheet",
  "video",
  "image",
  "audio",
  "archive",
  "other",
];

const MimePatterns: [ResourceFileKind, RegExp][] = [
  ["pdf", /^application\/pdf$/],
  ["presentation", /presentation|powerpoint|keynote/],
  ["spreadsheet", /spreadsheet|excel|^text\/csv$/],
  ["document", /wordprocessing|msword|opendocument\.text|rtf|^text\//],
  ["image", /^image\//],
  ["video", /^video\//],
  ["audio", /^audio\//],
  ["archive", /zip|x-tar|gzip|x-7z|x-rar|compressed/],
];

const ExtensionKinds: Record<string, ResourceFileKind> = {
  pdf: "pdf",
  ppt: "presentation",
  pptx: "presentation",
  pps: "presentation",
  ppsx: "presentation",
  key: "presentation",
  odp: "presentation",
  doc: "document",
  docx: "document",
  odt: "document",
  rtf: "document",
  txt: "document",
  md: "document",
  xls: "spreadsheet",
  xlsx: "spreadsheet",
  ods: "spreadsheet",
  csv: "spreadsheet",
  png: "image",
  jpg: "image",
  jpeg: "image",
  gif: "image",
  webp: "image",
  svg: "image",
  avif: "image",
  mp4: "video",
  mov: "video",
  webm: "video",
  m4v: "video",
  mp3: "audio",
  wav: "audio",
  m4a: "audio",
  ogg: "audio",
  zip: "archive",
  rar: "archive",
  "7z": "archive",
  gz: "archive",
  tar: "archive",
};

export const getFileExtension = (fileName?: string) =>
  fileName?.includes(".") ? fileName.split(".").pop()!.toLowerCase() : "";

/** Derives the resource file kind from the asset alone — authors never set it. */
export const getFileKind = (
  file?: Pick<CfAsset, "contentType" | "fileName"> | null,
): ResourceFileKind => {
  if (!file) return "other";

  const contentType = file.contentType?.toLowerCase() || "";
  const match = MimePatterns.find(([, pattern]) => pattern.test(contentType));
  if (match) return match[0];

  return ExtensionKinds[getFileExtension(file.fileName)] || "other";
};

export const formatFileSize = (bytes?: number) => {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, exponent);
  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

/** Contentful asset URLs are protocol-relative (`//assets.ctfassets.net/...`). */
export const toAbsoluteAssetUrl = (url?: string) =>
  url?.startsWith("//") ? `https:${url}` : url || "";

/** Office Online can embed Word, PowerPoint and Excel files under its size limits. */
export const canPreviewInOffice = (file?: CfAsset | null) => {
  if (!file) return false;
  const extension = getFileExtension(file.fileName);
  const size = file.size || 0;

  if (["doc", "docx", "ppt", "pptx", "pps", "ppsx"].includes(extension)) {
    return size <= OfficePreviewLimits.WordAndPowerPoint;
  }
  if (["xls", "xlsx"].includes(extension)) {
    return size <= OfficePreviewLimits.Excel;
  }
  return false;
};

export const getOfficeEmbedUrl = (file: CfAsset) =>
  `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
    toAbsoluteAssetUrl(file.url),
  )}`;

/** Resized image URL through the Contentful Images API. */
export const getImageUrl = (url: string, width: number) =>
  `${toAbsoluteAssetUrl(url)}?w=${width}&fm=webp&q=80`;
